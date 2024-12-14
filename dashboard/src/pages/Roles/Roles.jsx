import PageHeader from "@/components/PageHeader/PageHeader";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DialogBox from "@/components/DialogBox/DialogBox";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "@/app/services/rolesApi";
import { useSelector } from "react-redux";
import { getRolesData } from "@/features/rolesSlice";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import { getPermissionsData } from "@/features/permissionsSlice";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required.",
  }),
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

const Roles = () => {
  const { roles, loader } = useSelector(getRolesData);
  const { permissions } = useSelector(getPermissionsData);
  const [createRole, { isLoading: createLoading, isSuccess }] =
    useCreateRoleMutation();
  const [updateRole, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateRoleMutation();

  // State to track if editing mode is active
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  async function onSubmit(data) {
    if (isEditing) {
      // Dispatch update action when editing a role
      try {
        await updateRole({
          id: currentRole.id,
          name: data.name,
          permissions: data.permissions,
        }).unwrap();
      } catch (error) {
        toast({
          variant: "destructive",
          title: `${error?.data?.message}`,
        });
      }
    } else {
      try {
        await createRole({
          name: data.name,
          permissions: data.permissions,
        }).unwrap();
      } catch (error) {
        toast({
          variant: "destructive",
          title: `${error?.data?.message}`,
        });
      }
    }
  }

  // Function to open the dialog for editing a role
  const handleEditRole = (role) => {
    setIsEditing(true);
    setCurrentRole(role);

    // Set form values to the current role's data
    form.setValue("name", role.name);
    form.setValue(
      "permissions",
      role.permissions.map((p) => p.id)
    );

    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      setIsDialogOpen(false);
    }
  }, [isSuccess, updateSuccess]);
  const createRoleDialogComponent = () => {
    return (
      <DialogBox
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        openButton={
          <Button
            onClick={() => {
              setIsEditing(false); // Reset editing mode
              form.reset(); // Reset form
              setIsDialogOpen(true);
            }}
          >
            Create Role
          </Button>
        }
        title={isEditing ? "Edit Role" : "Add New Role"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER-ADMIN">SUPER ADMIN</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="VIEWER">VIEWER</SelectItem>
                      <SelectItem value="DEMO">DEMO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions*</FormLabel>
                  {permissions?.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait...
                </>
              ) : isEditing ? (
                "Update Role"
              ) : (
                "Create Role"
              )}
            </Button>
          </form>
        </Form>
      </DialogBox>
    );
  };
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Roles"}
        title2={"Roles"}
        button1={createRoleDialogComponent()}
      />

      <div className="bg-white shadow-md rounded-md">
        <Table className="table-auto min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles?.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>
                  <ul>
                    {data.permissions.map((item) => (
                      <li key={item.id}>&#9737; {item.name}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  <BiEditAlt
                    className="text-primary text-xl cursor-pointer"
                    onClick={() => handleEditRole(data)}
                  />
                  <BiTrash className="text-red-500 text-xl cursor-pointer" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loader && (
          <div className="h-[50vh] flex items-center justify-center">
            <LoadingComponent loader={loader} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;
