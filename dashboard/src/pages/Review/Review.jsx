import {
  useGetReviewsQuery,
  useUpdateReviewStatusMutation,
} from "@/app/services/reviewApi";
import { toast } from "@/components/hooks/use-toast";
import { toast as sonner } from "sonner";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
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
  Check,
  ChevronDown,
  Flag,
  Loader2,
  Search,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { formatDateTime } from "@/utils/timeAgo";

const Review = () => {
  // const [reviews, setReviews] = useState(initialReviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching } = useGetReviewsQuery({
    search: searchTerm,
    status,
    typeFilter,
    page,
    limit,
  });
  const [updateReviewStatus, { isLoading: updateLoading }] =
    useUpdateReviewStatusMutation();

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setLimit(newPerPage);
  };

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const handleStatusChange = async (id, status = "APPROVED" | "REJECTED") => {
    try {
      const res = await updateReviewStatus({
        id,
        status,
      }).unwrap();
      if (res?.message) {
        sonner("Success", {
          description: `${res?.message}`,
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error?.data?.message}`,
      });
    }
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      cell: (row) => (
        <p>{row.type === "RIDER" ? "Rider → Driver" : "Public → Driver"}</p>
      ),
      sortable: true,
    },
    {
      name: "Reviewer",
      cell: (row) => (
        <p>
          {row?.reviewer?.firstName ? row.reviewer?.firstName : "Anonymous"}
        </p>
      ),
      sortable: true,
    },
    {
      name: "Reviewee",
      selector: (row) => row.driver?.name,
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
      selector: (row) => formatDateTime(row.createdAt),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : row.status === "APPROVED"
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <div className="flex flex-col gap-2">
                  {row.comment && (
                    <div className="border rounded-md p-2">
                      <Label>Comment</Label>
                      <p className="mt-1">{row.comment}</p>
                    </div>
                  )}

                  {(row.reviewer?.phone || row?.reviewerPhone) && (
                    <div className="border rounded-md p-2">
                      <Label>Phone Number</Label>
                      <p className="mt-1">
                        {row.reviewer?.phone
                          ? row.reviewer?.phone
                          : row?.reviewerPhone}
                      </p>
                    </div>
                  )}
                  <div className="border rounded-md p-2">
                    <Label>IP Address</Label>
                    <p className="mt-1">{row.ipAddress}</p>
                  </div>
                </div>
                {row.status === "PENDING" && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleStatusChange(row.id, "APPROVED")}
                      className="flex-1"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(row.id, "REJECTED")}
                      variant="destructive"
                      className="flex-1"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
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
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Reviews</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="RIDER">Rider Reviews</SelectItem>
              <SelectItem value="PUBLIC">Public Reviews</SelectItem>
              <SelectItem value="DRIVER">Driver Reviews</SelectItem>
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
        data={data?.reviews}
        responsive
        progressPending={isLoading || isFetching}
        progressComponent={
          <div className="h-[50vh] flex items-center justify-center">
            <LoadingComponent loader={isLoading || isFetching} />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={data?.totalReviews}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
      />
    </div>
  );
};

export default Review;
