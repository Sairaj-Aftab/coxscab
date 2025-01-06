import avatar from "../../assets/avatar.png";
import { toast } from "@/components/hooks/use-toast";
import { toast as sonner } from "sonner";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Phone,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { formatDateTime } from "@/utils/timeAgo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReviews, updateReviewStatus } from "@/service/review.service";

const Review = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  // Get Reviews
  const { data, isLoading } = useQuery({
    queryKey: [
      "reviews",
      {
        search: searchTerm,
        status,
        typeFilter,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getReviews({
        search: searchTerm,
        status,
        typeFilter,
        page,
        limit,
      }),
  });
  // Update review Status
  const {
    mutateAsync: updateReviewStatusData,
    data: updatedData,
    isPending: updateLoading,
    error: updateError,
  } = useMutation({
    mutationFn: updateReviewStatus,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "reviews",
          {
            search: searchTerm,
            status,
            typeFilter,
            page,
            limit,
          },
        ],
        (oldData = { reviews: [] }) => ({
          ...oldData,
          reviews: oldData.reviews.map((item) =>
            item.id === data?.review.id ? data?.review : item
          ),
        })
      );
    },
  });

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const handleStatusChange = async (id, status = "APPROVED" | "REJECTED") => {
    await updateReviewStatusData({
      id,
      status,
    });
  };

  const handleViewDriverInfo = (driver) => {
    setSelectedDriver(driver);
    setIsViewDialogOpen(true);
  };

  useEffect(() => {
    if (updatedData) {
      sonner("Success", {
        description: `${updatedData?.message}`,
      });
    }
    if (updateError) {
      toast({
        variant: "destructive",
        title: `${updateError?.message}`,
      });
    }
  }, [updateError, updatedData]);

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
        <p>{(row?.reviewer?.firstName || row.name) ?? "Anonymous"}</p>
      ),
      sortable: true,
    },
    {
      name: "Reviewee",
      selector: (row) => row.driver?.name,
      sortable: true,
    },
    {
      name: "Driver ID",
      cell: (row) => (
        <p
          onClick={() => handleViewDriverInfo(row.driver)}
          className="text-primary underline cursor-pointer"
        >
          {row.driver?.coxscabId}
        </p>
      ),
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
      width: "90px",
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
        progressPending={isLoading}
        progressComponent={
          <div className="h-[50vh] flex items-center justify-center">
            <LoadingComponent loader={isLoading} />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={data?.totalReviews}
        onChangeRowsPerPage={(value) => setLimit(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
      />
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              View details for driver {selectedDriver?.coxscabId}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            {selectedDriver && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <img
                    src={
                      selectedDriver?.pictureUrl
                        ? selectedDriver?.pictureUrl
                        : avatar
                    }
                    alt={selectedDriver.name}
                    className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-full border border-primary"
                  />
                  <div>
                    <p className="text-lg font-semibold text-primary mb-2">
                      {selectedDriver.name}
                    </p>
                    {selectedDriver?.mobileNo && (
                      <a
                        href={`tel:+88${selectedDriver.mobileNo}`}
                        className="flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4 text-blue-500" />{" "}
                        <span className="text-blue-500 underline">
                          {selectedDriver.mobileNo}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDriver?.fatherName && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Father&apos;s Name</Label>
                      <p>{selectedDriver.fatherName}</p>
                    </div>
                  )}
                  {selectedDriver?.motherName && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Mother&apos;s Name</Label>
                      <p>{selectedDriver.motherName}</p>
                    </div>
                  )}
                  {selectedDriver?.nidNo && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>NID Number</Label>
                      <p>{selectedDriver.nidNo}</p>
                    </div>
                  )}
                  {selectedDriver?.nidDob && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Date of Birth (NID)</Label>
                      <p>
                        {new Date(selectedDriver.nidDob).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedDriver?.drivingLicenseNo && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Driving License No.</Label>
                      <p>{selectedDriver.drivingLicenseNo}</p>
                    </div>
                  )}
                  {selectedDriver?.bloodGroup && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Blood Group</Label>
                      <p>{selectedDriver.bloodGroup}</p>
                    </div>
                  )}
                  {selectedDriver?.educationalQualification && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Educational Qualification</Label>
                      <p>{selectedDriver.educationalQualification}</p>
                    </div>
                  )}
                  {selectedDriver?.permanentAddress && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Permanent Address</Label>
                      <p>
                        {[
                          selectedDriver?.permanentAddress?.village,
                          selectedDriver?.permanentAddress?.po,
                          selectedDriver?.permanentAddress?.thana,
                          selectedDriver?.permanentAddress?.district,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedDriver?.currentAddress && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Current Address</Label>
                      <p>
                        {[
                          selectedDriver?.currentAddress?.holdingNo,
                          selectedDriver?.currentAddress?.wardNo,
                          selectedDriver?.currentAddress?.village,
                          selectedDriver?.currentAddress?.thana,
                          selectedDriver?.currentAddress?.district,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {selectedDriver?.vehicle && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md">
                      <Label>Vehicle Reg. No.</Label>
                      <p>{selectedDriver?.vehicle?.registrationNo}</p>
                    </div>
                  )}
                  {selectedDriver?.note && (
                    <div className="flex flex-col gap-2 border p-2 rounded-md md:col-span-2">
                      <Label>Note</Label>
                      <p>{selectedDriver.note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Review;
