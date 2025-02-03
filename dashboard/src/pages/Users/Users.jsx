import { toast } from "@/components/hooks/use-toast";
import { toast as sonner } from "sonner";
import LoadingComponent from "@/components/LoadingComponents/LoadingComponent";
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
import { formatDateTime } from "@/utils/timeAgo";
import {
  Ban,
  Car,
  CheckCircle,
  Filter,
  LogIn,
  LogOut,
  MapPin,
  MoreHorizontal,
  Search,
  User,
  UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getAllUsers, updateUserStatus } from "@/service/users.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import socket from "@/lib/socket";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showTrackDialog, setShowTrackDialog] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [role, setRole] = useState("ALL");
  const [activity, setActivity] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: [
      "users",
      {
        search,
        status,
        role,
        activity,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getAllUsers({
        search,
        status,
        role,
        activity,
        page,
        limit,
      }),
  });

  // Update user Status
  const {
    mutateAsync: updateUserStatusData,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "users",
          {
            search,
            status,
            role,
            activity,
            page,
            limit,
          },
        ],
        (oldData = { users: [] }) => ({
          ...oldData,
          users: oldData.users.map((item) =>
            item.id === data?.user.id ? data?.user : item
          ),
        })
      );
      sonner("Success", {
        description: `${data?.message}`,
      });
    },
  });

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const handleStatusChange = async (id, status = "APPROVED" | "REJECTED") => {
    await updateUserStatusData({
      id,
      status,
    });
  };

  const handleSavePermissions = () => {
    // if (selectedUser) {
    //   setUsers(
    //     users.map((user) =>
    //       user.id === selectedUser.id
    //         ? { ...user, permissions: editedPermissions }
    //         : user
    //     )
    //   );
    //   setIsEditPermissionsOpen(false);
    // }
  };

  useEffect(() => {
    if (updateError) {
      toast({
        variant: "destructive",
        title: `${updateError?.message}`,
      });
    }
  }, [updateError]);
  // Active Users from Socket
  useEffect(() => {
    if (socket) {
      socket.on("allUsers", (data) => {
        setOnlineUsers(data);
      });
      return () => {
        socket.off("allUsers");
      };
    }
  }, []);

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },

    {
      name: "User",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              {row?.pictureUrl ? (
                <img
                  src={row.pictureUrl}
                  alt={row.firstName}
                  className="object-cover rounded-full"
                />
              ) : (
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${row.firstName}`}
                  alt={row.firstName}
                  className="object-cover"
                />
              )}
              <AvatarFallback>
                {row?.firstName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {onlineUsers?.find((user) => user.id === row.id) && (
              <span className="absolute top-0 right-0 bg-green-600 w-3 h-3 rounded-full z-50 border-2 border-white"></span>
            )}
          </div>
          <div>
            <div className="font-medium">{row.firstName}</div>
            <div className="text-sm text-gray-500">{row?.phone}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "300px",
    },
    {
      name: "Type",
      cell: (row) => (
        <div className="flex gap-1 items-center">
          {row.role === "DRIVER" ? (
            <Car className="w-4 h-4 text-green-500 inline mr-1" />
          ) : row.role === "ADMIN" ? (
            <UserCog className="w-4 h-4 text-red-500 inline mr-1" />
          ) : (
            <User className="w-4 h-4 text-blue-500 inline mr-1" />
          )}
          {row?.role === "DRIVER"
            ? "Driver"
            : row?.role === "ADMIN"
            ? "Admin"
            : "Rider"}
        </div>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : row.status === "INACTIVE"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row?.status}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "CallSign",
      selector: (row) => row.callSign,
      sortable: true,
      width: "80px",
    },
    {
      name: "AoR",
      selector: (row) => row.aor,
      sortable: true,
      width: "170px",
    },
    {
      name: "Last Active",
      selector: (row) =>
        formatDateTime(row.lastOnlineTime ? row.lastOnlineTime : row.createdAt),
      sortable: true,
      width: "170px",
    },

    // {
    //   name: "Join Date",
    //   selector: (row) => formatDateTime(row.createdAt),
    //   sortable: true,
    //   width: "170px",
    // },
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
            {/* <DropdownMenuItem onClick={() => handleViewDetails(row)}>
            <User className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEditPermissions(row)}>
            <Shield className="w-4 h-4 mr-2" />
            Edit Permissions
          </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => navigate(`/map/${row.id}`)}>
              <MapPin className="w-4 h-4 mr-2" />
              Track User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "ACTIVE")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Set as Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "INACTIVE")}
            >
              <Ban className="w-4 h-4 mr-2" />
              Set as Inactive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "SUSPENDED")}
              className="text-red-500"
            >
              <Ban className="w-4 h-4 mr-2" />
              Suspend User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(row.id, "BLOCKED")}
              className="text-red-700"
            >
              <Ban className="w-4 h-4 mr-2" />
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <div>
      <PageHeader
        title1={"Dashboard/Users"}
        title2={"Users"}
        button1={
          <div>
            <span className="text-sm font-semibold text-muted-foreground">
              Online Users :
            </span>{" "}
            <span className="text-sm font-semibold text-green-500">
              {onlineUsers?.length}
            </span>
          </div>
        }
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 space-y-1 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Users</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CUSTOMER">Riders</SelectItem>
              <SelectItem value="DRIVER">Drivers</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={activity}
            onValueChange={(value) => setActivity(value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 opacity-50" />
                <SelectValue placeholder="Filter activity" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  All Activity
                </span>
              </SelectItem>
              <SelectItem value="LOGIN">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    Logins
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="LOGOUT">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="flex items-center gap-1">
                    <LogOut className="h-4 w-4" />
                    Logouts
                  </span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-full md:w-[300px]"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={users?.users}
        responsive
        progressPending={isLoading || updateLoading}
        progressComponent={
          <div className="h-[50vh] flex items-center justify-center">
            <LoadingComponent loader={isLoading || updateLoading} />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={users?.totalUsers}
        onChangePage={(page) => setPage(page)}
        onChangeRowsPerPage={(rowsPerPage) => setLimit(rowsPerPage)}
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
                    {selectedUser?.type?.charAt(0).toUpperCase() +
                      selectedUser?.type?.slice(1)}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p>
                    {selectedUser?.status.charAt(0).toUpperCase() +
                      selectedUser?.status?.slice(1)}
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
