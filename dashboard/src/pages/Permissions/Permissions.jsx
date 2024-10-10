import { useToast } from "@/components/hooks/use-toast";
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
import { createPermission } from "@/features/permissions/permissionsApiSlice";
import {
  getPermissions,
  setMessageEmpty,
} from "@/features/permissions/permissionsSlice";
import { useEffect, useState } from "react";
import { toast as hotToast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Permissions = () => {
  const dispatch = useDispatch();
  const { permissions, error, message, success } = useSelector(getPermissions);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast({
        variant: "destructive",
        title: "The field is required!",
      });
    } else {
      dispatch(createPermission(name));

      dispatch(setMessageEmpty());
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: `${error}`,
      });
    }
    if (message) {
      hotToast.success(message);
    }
    if (message || error || success) {
      dispatch(setMessageEmpty());
    }
  }, [dispatch, error, message, success, toast]);
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
          <Button type="submit">Sumbit</Button>
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
      </div>
    </div>
  );
};

export default Permissions;
