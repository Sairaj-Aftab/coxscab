import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  CreditCard,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";

const mockTransactions = [
  {
    id: "1",
    amount: 50.0,
    status: "completed",
    date: "2024-03-15",
    description: "Ride fare",
  },
  {
    id: "2",
    amount: 35.5,
    status: "completed",
    date: "2024-03-14",
    description: "Ride fare",
  },
  {
    id: "3",
    amount: 25.0,
    status: "pending",
    date: "2024-03-13",
    description: "Ride fare",
  },
  {
    id: "4",
    amount: 40.0,
    status: "failed",
    date: "2024-03-12",
    description: "Ride fare",
  },
  {
    id: "5",
    amount: 30.0,
    status: "completed",
    date: "2024-03-11",
    description: "Ride fare",
  },
];

const Payment = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalRevenue = transactions.reduce((sum, transaction) => {
    return transaction.status === "completed" ? sum + transaction.amount : sum;
  }, 0);

  const pendingAmount = transactions.reduce((sum, transaction) => {
    return transaction.status === "pending" ? sum + transaction.amount : sum;
  }, 0);

  const handleActionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const columns = [
    // {
    //   name: "#",
    //   selector: (data, index) =>
    //     calculateItemIndex(pageGarage, limitGarage, index),
    //   width: "60px",
    // },

    {
      name: "Transaction ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Amount",
      cell: (row) => <p>&#2547; {row.amount.toFixed(2)}</p>,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "completed"
              ? "bg-green-100 text-green-800"
              : row.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => handleActionClick(row)}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold my-2">Payment Dashboard</h1>

      <div className="grid gap-2 lg:gap-4 md:grid-cols-2 lg:grid-cols-4 mb-2 lg:mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">-4% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Drivers
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Payment Time
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 days</div>
            <p className="text-xs text-muted-foreground">
              -0.1 days from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="py-2">
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export CSV
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={transactions}
            responsive
            // progressPending={getGarageLoading || garageFetching}
            // progressComponent={
            //   <div className="h-[50vh] flex items-center justify-center">
            //     <LoadingComponent loader={getGarageLoading || garageFetching} />
            //   </div>
            // }
            pagination
            paginationServer
            // paginationTotalRows={garages?.totalGarage}
            // onChangeRowsPerPage={handlePerRowsChangeGarage}
            // onChangePage={handlePageChangeGarage}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View and manage details for transaction {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">ID:</span>
                <span className="col-span-3">{selectedTransaction.id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Amount:</span>
                <span className="col-span-3">
                  ${selectedTransaction.amount.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Status:</span>
                <span className="col-span-3">{selectedTransaction.status}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Date:</span>
                <span className="col-span-3">{selectedTransaction.date}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Customer:</span>
                <span className="col-span-3">
                  {selectedTransaction.customerName}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Driver:</span>
                <span className="col-span-3">
                  {selectedTransaction.driverName}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Payment:</span>
                <span className="col-span-3">
                  {selectedTransaction.paymentMethod}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="button" variant="default">
              Download Receipt
            </Button>
            {selectedTransaction?.status === "pending" && (
              <Button type="button" variant="default">
                Approve Payment
              </Button>
            )}
            {selectedTransaction?.status === "failed" && (
              <Button type="button" variant="default">
                Retry Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
