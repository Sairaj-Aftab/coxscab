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

const RequiredCategories = () => {
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Required Categories"}
        title2={"Required Categories"}
      />
      <div className="flex gap-5 flex-col sm:flex-row">
        {/* Vehicle Type */}
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Vehicle Types
            </h2>
            <Button>Add Type</Button>
          </div>
          <Table className="table-auto min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Name</TableHead>
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
        {/* Vehicle Condition */}
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Vehicle Conditions
            </h2>
            <Button>Add Condition</Button>
          </div>
          <Table className="table-auto min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Name</TableHead>
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
    </div>
  );
};

export default RequiredCategories;
