import DialogBox from "@/components/DialogBox/DialogBox";
import PageHeader from "@/components/PageHeader/PageHeader";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "@/features/roles/rolesSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthUsers, setMessageEmpty } from "@/features/user/userSlice";
import { createAuthUser, updateAuthUser } from "@/features/user/userApiSllice";
import { formatDateTime } from "@/utils/timeAgo";

const FormSchema = z.object({
  userName: z.string().min(2, {
    message: "User name is required.",
  }),
  password: z.string().min(2, {
    message: "Password is required.",
  }),
  roleId: z.string({
    message: "Please select a role",
  }),
});

const AuthUsers = () => {
  const dispatch = useDispatch();
  const { authUsers, message, error, loader } = useSelector(getAuthUsers);
  const { roles } = useSelector(getRoles);
  // State to track if editing mode is active
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAuth, setCurrentAuth] = useState(null);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: "",
      phone: "",
      password: "",
      roleId: [],
    },
  });
  function onSubmit(data) {
    if (isEditing) {
      dispatch(
        updateAuthUser({
          id: currentAuth.id,
          data: {
            userName: data.userName,
            phone: data.phone,
            password: data.password,
            roleId: data.roleId,
          },
        })
      );
    } else {
      dispatch(createAuthUser(data));
    }
  }

  // Function to open the dialog for editing a role
  const handleEdit = (auth) => {
    setIsEditing(true);
    setCurrentAuth(auth);

    // Set form values to the current role's data
    form.setValue("userName", auth.userName);
    form.setValue("phone", auth.phone);
    form.setValue("roleId", auth.roleId);

    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (message) {
      setIsDialogOpen(false);
      toast({
        title: `${message}`,
      });
      setIsEditing(false);
      form.reset();
    }
    if (error) {
      console.log(error);

      toast({
        variant: "destructive",
        title: `${error}`,
      });
    }
    if (message || error) {
      dispatch(setMessageEmpty());
    }
  }, [dispatch, error, form, message]);

  const createAuthUserDialogComponent = () => {
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
            Create user
          </Button>
        }
        title={isEditing ? "Edit user" : "Add New Auth User"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      loader && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    User name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loader} />
                  </FormControl>

                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      loader && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loader} />
                  </FormControl>

                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      loader && "cursor-not-allowed text-gray-400"
                    }`}
                  >
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={loader} />
                  </FormControl>

                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((data) => (
                        <SelectItem key={data.id} value={data.id}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
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
            /> */}
            <Button type="submit" disabled={loader}>
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait...
                </>
              ) : isEditing ? (
                "Update user"
              ) : (
                "Create user"
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
        title1={"Dashboard/Auth Users"}
        title2={"Auth Users"}
        button1={createAuthUserDialogComponent()}
      />
      {/* Data Table */}
      <div className="flex gap-2 flex-col lg:flex-row">
        <Table className="bg-white p-3 shadow-md rounded-md table-auto min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>User name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last login</TableHead>
              <TableHead>Last login IP</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authUsers?.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{data.userName}</TableCell>
                <TableCell>{data.role?.name}</TableCell>
                <TableCell>{formatDateTime(data.lastLoginTime)}</TableCell>
                <TableCell>{data.lastLoginIp}</TableCell>
                <TableCell>{data.phone}</TableCell>
                <TableCell>{data.password}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  <BiEditAlt
                    className="text-primary text-xl cursor-pointer"
                    onClick={() => handleEdit(data)}
                  />
                  {/* <BiTrash className="text-red-500 text-xl cursor-pointer" /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="bg-white rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>User name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last login</TableHead>
              <TableHead>Last login IP</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {permissions?.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{data.name}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuthUsers;
