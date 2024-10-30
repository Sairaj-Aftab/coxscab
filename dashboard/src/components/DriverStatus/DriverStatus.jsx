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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import LoadingComponent from "../LoadingComponents/LoadingComponent";
import { useCreateDriverStatusMutation } from "@/app/services/driverStatusApi";
import { useSelector } from "react-redux";
import { getDriverStatusData } from "@/features/driverStatusSlice";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Status name is required.",
  }),
});

const DriverStatus = () => {
  const { status, loader } = useSelector(getDriverStatusData);
  const [createDriverStatus, { isLoading }] = useCreateDriverStatusMutation();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data) {
    try {
      await createDriverStatus({ name: data.name }).unwrap();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error?.data?.message}`,
      });
    }
  }
  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-700">Driver Status</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-2 justify-between"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Status name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
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
      </div>
      <Table className="table-auto min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {status?.map((data, index) => (
            <TableRow key={data.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{data.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loader && (
        <div className="h-[30vh] flex items-center justify-center">
          <LoadingComponent loader={loader} />
        </div>
      )}
    </div>
  );
};

export default DriverStatus;