import DataTable from "react-data-table-component";

const columns = [
  {
    name: "No",
    selector: (row) => row.no,
  },
  {
    name: "Status",
    selector: (row) => row.status,
  },
  {
    name: "Customer",
    selector: (row) => row.customer,
  },
  {
    name: "Date",
    selector: (row) => row.date,
  },
  {
    name: "Total",
    selector: (row) => row.total,
  },
];

const data = [
  {
    id: 1,
    no: "#54543",
    status: "Pending",
    customer: "John Doe",
    date: "2022-01-01",
    total: "$1000.00",
  },
  {
    id: 2,
    no: "#54653",
    status: "Completed",
    customer: "Henry Doe",
    date: "2022-01-01",
    total: "$1000.00",
  },
];
const RecentOrdersTable = () => {
  return (
    <div className="bg-white rounded-md shadow-md">
      <h3 className="text-base font-medium text-gray_text mb-3 p-3">
        Recent orders
      </h3>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default RecentOrdersTable;
