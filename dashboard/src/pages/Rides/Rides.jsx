import PageHeader from "@/components/PageHeader/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, MapPin, MoreHorizontal, Search, User } from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";

const initialRides = [
  {
    id: "1",
    rider: "John Doe",
    driver: "Alice Smith",
    pickup: "Hotel The Cox Today, Cox's Bazar",
    dropoff: "Inani Beach, Cox's Bazar",
    status: "completed",
    fare: 25.5,
    date: "2023-06-15 14:30",
    duration: "25 min",
  },
  {
    id: "2",
    rider: "Jane Smith",
    driver: "Bob Johnson",
    pickup: "Cox's Bazar Airport",
    dropoff: "Laboni Beach, Cox's Bazar",
    status: "in-progress",
    fare: 15.75,
    date: "2023-06-15 15:45",
    duration: "15 min",
  },
  {
    id: "3",
    rider: "Mike Brown",
    driver: "Carol Davis",
    pickup: "Cox's Bazar Central Bus Terminal",
    dropoff: "Himchori Waterfall, Cox's Bazar",
    status: "cancelled",
    fare: 0,
    date: "2023-06-15 16:00",
    duration: "N/A",
  },
  {
    id: "4",
    rider: "Sarah Lee",
    driver: "David Wilson",
    pickup: "Marine Drive, Cox's Bazar",
    dropoff: "Ramu, Cox's Bazar",
    status: "completed",
    fare: 32.0,
    date: "2023-06-15 16:30",
    duration: "35 min",
  },
  {
    id: "5",
    rider: "Tom Harris",
    driver: "Eva Martinez",
    pickup: "Bakkhali River, Cox's Bazar",
    dropoff: "Teknaf, Cox's Bazar",
    status: "in-progress",
    fare: 18.25,
    date: "2023-06-15 17:15",
    duration: "20 min",
  },
];

const Rides = () => {
  const [rides, setRides] = useState(initialRides);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  const filteredRides = rides?.filter(
    (ride) =>
      (filter === "all" || ride.status === filter) &&
      (ride.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.dropoff.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setIsViewDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    // {
    //   name: "#",
    //   selector: (data, index) =>
    //     calculateItemIndex(pageGarage, limitGarage, index),
    //   width: "60px",
    // },

    {
      name: "Rider",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${row.rider}`}
              alt={row.rider}
            />
            <AvatarFallback>
              {row?.rider
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.rider}</div>
            {/* <div className="text-sm text-gray-500">{row.email}</div> */}
          </div>
        </div>
      ),
      width: "170px",
      sortable: true,
    },
    {
      name: "Driver",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${row.driver}`}
              alt={row.driver}
            />
            <AvatarFallback>
              {row?.driver
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.driver}</div>
            {/* <div className="text-sm text-gray-500">{row.email}</div> */}
          </div>
        </div>
      ),
      width: "170px",
      sortable: true,
    },
    {
      name: "Pickup",
      selector: (row) => row.pickup,
      sortable: true,
    },
    {
      name: "Dropoff",
      selector: (row) => row.dropoff,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            row.status
          )}`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Fare",
      cell: (row) => <p>&#2547; {row.fare.toFixed(2)}</p>,
      sortable: true,
      width: "90px",
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      width: "140px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(row)}>
              <Search className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <MapPin className="w-4 h-4 mr-2" />
              Track Ride
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Contact Rider
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Car className="w-4 h-4 mr-2" />
              Contact Driver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      width: "80px",
    },
  ];
  return (
    <div>
      <PageHeader title1={"Dashboard/Rides"} title2={"Rides"} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-1 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rides</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full md:w-[300px]"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredRides}
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
      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ride Details</DialogTitle>
          </DialogHeader>
          {selectedRide && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ride ID</Label>
                  <p>{selectedRide.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p
                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(
                      selectedRide.status
                    )}`}
                  >
                    {selectedRide.status.charAt(0).toUpperCase() +
                      selectedRide.status.slice(1)}
                  </p>
                </div>
                <div>
                  <Label>Rider</Label>
                  <p>{selectedRide.rider}</p>
                </div>
                <div>
                  <Label>Driver</Label>
                  <p>{selectedRide.driver}</p>
                </div>
                <div>
                  <Label>Pickup Location</Label>
                  <p>{selectedRide.pickup}</p>
                </div>
                <div>
                  <Label>Dropoff Location</Label>
                  <p>{selectedRide.dropoff}</p>
                </div>
                <div>
                  <Label>Fare</Label>
                  <p>${selectedRide.fare.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <p>{selectedRide.date}</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p>{selectedRide.duration}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button>Track Ride</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rides;
