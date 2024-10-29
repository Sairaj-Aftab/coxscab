import { useCreatePermissionMutation } from "@/app/services/permissionsApi";
import { useToast } from "@/components/hooks/use-toast";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPermissionsData } from "@/features/permissionsSlice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast as hotToast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Permissions = () => {
  const { permissions, loader } = useSelector(getPermissionsData);
  const [createPermission, { isLoading, isSuccess }] =
    useCreatePermissionMutation();

  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast({
        variant: "destructive",
        title: "The field is required!",
      });
    } else {
      try {
        const res = await createPermission({ name }).unwrap();
        if (res?.message) {
          hotToast.success(res.message);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: `${error?.data?.message}`,
        });
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setName("");
    }
  }, [isSuccess]);

  return (
    <div>
      {/* <Toaster /> */}
      <PageHeader title1={"Dashboard/Permissions"} title2={"Permissions"} />
      <div className="bg-white shadow-md rounded-md">
        <form className="p-3 flex gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Permission name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
          />
          <Button type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>

        <Table className="table-auto min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {permissions?.map((data, index) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{data.name}</TableCell>
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

export default Permissions;
