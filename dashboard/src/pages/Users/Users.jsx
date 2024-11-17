import PageHeader from "@/components/PageHeader/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Ban,
  Car,
  CheckCircle,
  MoreHorizontal,
  Search,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";

const initialUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    type: "rider",
    status: "active",
    joinDate: "2023-01-15",
    lastActive: "2023-06-10",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    type: "driver",
    status: "active",
    joinDate: "2023-02-20",
    lastActive: "2023-06-11",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    type: "rider",
    status: "inactive",
    joinDate: "2023-03-05",
    lastActive: "2023-05-20",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    type: "driver",
    status: "suspended",
    joinDate: "2023-04-10",
    lastActive: "2023-06-09",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    type: "rider",
    status: "active",
    joinDate: "2023-05-01",
    lastActive: "2023-06-11",
  },
];

const allPermissions = [
  { id: "book_ride", label: "Book Ride" },
  { id: "view_history", label: "View Ride History" },
  { id: "rate_driver", label: "Rate Driver" },
  { id: "accept_ride", label: "Accept Ride" },
  { id: "view_earnings", label: "View Earnings" },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState([]);

  const filteredUsers = users?.filter(
    (user) =>
      (filter === "all" || user.status === filter) &&
      (typeFilter === "all" || user.type === typeFilter) &&
      (user.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase()?.includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = (
    id,
    newStatus = "active" | "inactive" | "suspended"
  ) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsViewDetailsOpen(true);
  };

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setEditedPermissions(user.permissions);
    setIsEditPermissionsOpen(true);
  };

  const handlePermissionChange = (permissionId) => {
    setEditedPermissions((prev = []) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, permissions: editedPermissions }
            : user
        )
      );
      setIsEditPermissionsOpen(false);
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
      name: "User",
      selector: (row) => row.type,
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${row.name}`}
              alt={row.name}
            />
            <AvatarFallback>
              {row?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "300px",
    },
    {
      name: "Type",
      cell: (row) => (
        <div>
          {row.type === "rider" ? (
            <User className="w-4 h-4 text-blue-500 inline mr-1" />
          ) : (
            <Car className="w-4 h-4 text-green-500 inline mr-1" />
          )}
          {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : row.status === "inactive"
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
      name: "Join Date",
      selector: (row) => row.joinDate,
      sortable: true,
    },
    {
      name: "Last Active",
      selector: (row) => row.lastActive,
      sortable: true,
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
              <User className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditPermissions(row)}>
              <Shield className="w-4 h-4 mr-2" />
              Edit Permissions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "active")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Set as Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "inactive")}
            >
              <Ban className="w-4 h-4 mr-2" />
              Set as Inactive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "suspended")}
              className="text-red-600"
            >
              <Ban className="w-4 h-4 mr-2" />
              Suspend User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <div>
      <PageHeader title1={"Dashboard/Users"} title2={"Users"} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-1 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
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
              <SelectItem value="rider">Riders</SelectItem>
              <SelectItem value="driver">Drivers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full md:w-[300px]"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
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
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedUser.name}`}
                    alt={selectedUser?.name}
                  />
                  <AvatarFallback>
                    {selectedUser?.name
                      ?.split(" ")
                      ?.map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedUser?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User Type</Label>
                  <p>
                    {selectedUser.type.charAt(0).toUpperCase() +
                      selectedUser.type.slice(1)}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p>
                    {selectedUser.status.charAt(0).toUpperCase() +
                      selectedUser.status.slice(1)}
                  </p>
                </div>
                <div>
                  <Label>Join Date</Label>
                  <p>{selectedUser.joinDate}</p>
                </div>
                <div>
                  <Label>Last Active</Label>
                  <p>{selectedUser.lastActive}</p>
                </div>
              </div>
              <div>
                <Label>Permissions</Label>
                <ul className="list-disc list-inside">
                  {selectedUser?.permissions?.map((permission) => (
                    <li key={permission}>
                      {allPermissions.find((p) => p.id === permission)?.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog
        open={isEditPermissionsOpen}
        onOpenChange={setIsEditPermissionsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedUser.name}`}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback>
                    {selectedUser?.name
                      ?.split(" ")
                      ?.map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                {allPermissions?.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={editedPermissions?.includes(permission.id)}
                      onCheckedChange={() =>
                        handlePermissionChange(permission.id)
                      }
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPermissionsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePermissions}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
