import { toast } from "@/components/hooks/use-toast";
import { toast as sonner } from "sonner";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createNotice,
  getNotices,
  updateNotice,
} from "@/service/notice.service";
import useAuth from "@/store/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";

const FormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  user: z.string().nonempty("User type is required"),
});

const Notice = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  //   Get Notices
  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => getNotices(),
  });
  // Create Notice
  const {
    mutateAsync: createNewNotice,
    data: createData,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createNotice,
    onSuccess: (data) => {
      queryClient.setQueryData(["notices"], (oldData = { notices: [] }) => ({
        ...oldData,
        notices: [data.notice, ...oldData.notices],
      }));
    },
  });
  // Update Driver
  const {
    mutateAsync: updateNoticeData,
    data: updatedData,
    isPending: updateLoading,
    error: updateError,
  } = useMutation({
    mutationFn: updateNotice,
    onSuccess: (data) => {
      queryClient.setQueryData(["notices"], (oldData = { notices: [] }) => ({
        ...oldData,
        notices: oldData.notices.map((item) =>
          item.id === data?.notice.id ? data?.notice : item
        ),
      }));
    },
  });
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      user: "",
    },
  });

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);

    form.setValue("title", data.title);
    form.setValue("user", data.user);

    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    if (isEditing) {
      await updateNoticeData({
        id: currentData.id,
        formData: data,
      });
    } else {
      await createNewNotice({ ...data });
    }
  }

  useEffect(() => {
    if (createData?.message || updatedData?.message) {
      sonner("Success", {
        description: `${createData?.message || updatedData?.message}`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createError || updateError) {
      toast({
        variant: "destructive",
        title: `${createError?.message || updateError?.message}`,
      });
    }
  }, [
    createData?.message,
    createError,
    form,
    updateError,
    updatedData?.message,
  ]);
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Notice"}
        title2={"Notice"}
        button1={
          <Button
            onClick={() => {
              setIsEditing(false); // Reset editing mode
              form.reset(); // Reset form
              setIsDialogOpen(true);
            }}
          >
            Create Notice
          </Button>
        }
      />
      {/* Create and update notice dialog and form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Update notice" : "Create notice"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel
                        className={`${
                          (createLoading || updateLoading) &&
                          "cursor-not-allowed text-gray-400"
                        }`}
                      >
                        Notice
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={createLoading || updateLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* User type */}
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>User Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={createLoading || updateLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">USER</SelectItem>
                          <SelectItem value="DRIVER">DRIVER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Add other fields as necessary */}
              <Button
                type="submit"
                disabled={
                  createLoading ||
                  updateLoading ||
                  auth?.role?.name === "VIEWER" ||
                  auth?.role?.name === "DEMO"
                }
              >
                {createLoading || updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <LoadingComponent loader={isLoading} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices?.notices?.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.user}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleEdit(notice)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Notice;
