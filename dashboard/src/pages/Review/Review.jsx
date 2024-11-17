import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  ChevronDown,
  Flag,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";

const initialReviews = [
  {
    id: "1",
    type: "rider",
    reviewer: "John Doe",
    reviewee: "Driver A",
    rating: 4,
    comment: "Great ride, very punctual",
    date: "2023-06-01",
    status: "pending",
    reported: false,
  },
  {
    id: "2",
    type: "driver",
    reviewer: "Driver B",
    reviewee: "Jane Smith",
    rating: 2,
    comment: "Passenger was rude",
    date: "2023-06-02",
    status: "pending",
    reported: true,
  },
  {
    id: "3",
    type: "rider",
    reviewer: "Alice Johnson",
    reviewee: "Driver C",
    rating: 5,
    comment: "Excellent service!",
    date: "2023-06-03",
    status: "approved",
    reported: false,
  },
  {
    id: "4",
    type: "driver",
    reviewer: "Driver D",
    reviewee: "Bob Wilson",
    rating: 3,
    comment: "Passenger was okay",
    date: "2023-06-04",
    status: "rejected",
    reported: false,
  },
  {
    id: "5",
    type: "rider",
    reviewer: "Eva Brown",
    reviewee: "Driver E",
    rating: 1,
    comment: "Terrible experience, driver was late",
    date: "2023-06-05",
    status: "pending",
    reported: true,
  },
];

const Review = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = reviews?.filter(
    (review) =>
      (filter === "all" || review.status === filter) &&
      (typeFilter === "all" || review.type === typeFilter) &&
      (review.reviewer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = (id, newStatus = "approved" | "rejected") => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, status: newStatus } : review
      )
    );
  };

  const handleReportResolution = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, reported: false } : review
      )
    );
  };
  const columns = [
    // {
    //   name: "#",
    //   selector: (data, index) =>
    //     calculateItemIndex(pageGarage, limitGarage, index),
    //   width: "60px",
    // },

    {
      name: "Type",
      selector: (row) => row.type,
      cell: (row) => (
        <p>{row.type === "driver" ? "Driver → Rider" : "Rider → Driver"}</p>
      ),
      sortable: true,
    },
    {
      name: "Reviewer",
      selector: (row) => row.reviewer,
      sortable: true,
    },
    {
      name: "Reviewee",
      selector: (row) => row.reviewee,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.managerName,
      cell: (row) => (
        <div className="flex items-center">
          {row.rating}
          <Star className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" />
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.managerMobileNo,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : row.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ChevronDown className="w-4 h-4 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Review Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Comment</Label>
                  <p className="mt-1">{row.comment}</p>
                </div>
                {row.reported && (
                  <div>
                    <Label className="text-red-500">Reported</Label>
                    <p className="mt-1 text-red-500">
                      This review has been flagged for inappropriate content.
                    </p>
                  </div>
                )}
                {row.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleStatusChange(row.id, "approved")}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(row.id, "rejected")}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {row.reported && (
                  <Button
                    onClick={() => handleReportResolution(row.id)}
                    variant="outline"
                    className="w-full"
                  >
                    Resolve Report
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
          {row.reported && <Flag className="w-5 h-5 text-red-500" />}
        </div>
      ),
    },
  ];
  return (
    <div>
      <PageHeader title1={"Dashboard/Review"} title2={"Review"} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-1 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="driver">Driver Reviews</SelectItem>
              <SelectItem value="rider">Rider Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full md:w-[300px]"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredReviews}
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
    </div>
  );
};

export default Review;
