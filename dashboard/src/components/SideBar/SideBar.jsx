import { NavLink, Outlet } from "react-router-dom";
import { BiAlignLeft, BiSolidBell } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Bell,
  Car,
  LayoutDashboard,
  ListTodo,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  UserCog,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";
import useAuth from "@/store/useAuth";
import useVehicleType from "@/store/useVehicleType";

const SideBar = () => {
  // const location = useLocation();
  const { auth, setLogout } = useAuth();
  const permissions =
    auth?.role?.permissions?.map((permission) => permission.name) || [];

  const { types } = useVehicleType();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogOut = async () => {
    await setLogout();
  };

  // Close the sidebar when a nav item is clicked
  const handleNavItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Close sidebar on small screens
    }
  };
  const menuItem = [
    {
      to: "/",
      name: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      permission: "DASHBOARD",
    },
    {
      to: `/drivers/all`,
      name: "Drivers",
      icon: <Users className="w-4 h-4" />,
      permission: "DRIVER",
    },
    {
      to: `/vehicles/${
        types?.find((type) => type.name === "TOMTOM")?.id || ""
      }`,
      name: "Vehicles",
      icon: <Car className="w-4 h-4" />,
      permission: "VEHICLE",
    },
    {
      to: `/garage/${types?.find((type) => type.name === "TOMTOM")?.id || ""}`,
      name: "Garage",
      icon: <Warehouse className="w-4 h-4" />,
      permission: "GARAGE",
    },
    {
      to: "/rides",
      name: "Rides",
      icon: <MapPin className="w-4 h-4" />,
      permission: "RIDES",
    },
    {
      to: "/package/all",
      name: "Package",
      icon: <Package className="w-4 h-4" />,
      permission: "PACKAGE",
    },
    {
      to: "/users",
      name: "Users",
      icon: <Users className="w-4 h-4" />,
      permission: "USERS",
    },
    {
      to: "/review",
      name: "Review",
      icon: <Star className="w-4 h-4" />,
      permission: "REVIEW",
    },
    {
      to: "/notification",
      name: "Notification",
      icon: <Bell className="w-4 h-4" />,
      permission: "NOTIFICATION",
    },
    {
      to: "/payment",
      name: "Payment",
      icon: <Wallet className="w-4 h-4" />,
      permission: "PAYMENT",
    },
    // {
    //   to: "/places",
    //   name: "Places",
    //   icon: <SquareDot className="w-4 h-4" />,
    //   permission: "PLACES",
    // },
    {
      to: "/auth-users",
      name: "Auth Users",
      icon: <UserCog className="w-4 h-4" />,
      permission: "AUTH-USERS",
    },
    {
      to: "/required-categories",
      name: "Required Categories",
      icon: <ListTodo className="w-4 h-4" />,
      permission: "REQUIRED-CATEGORY",
    },
    {
      to: "/roles",
      name: "Roles",
      icon: <ShieldCheck className="w-4 h-4" />,
      permission: "ROLE",
    },
    {
      to: "/permissions",
      name: "Permissions",
      icon: <Lock className="w-4 h-4" />,
      permission: "PERMISSION",
    },
  ];
  return (
    <>
      {/* Header Section */}
      <div className="fixed top-0 left-0 w-full z-[99999] flex items-center justify-between bg-white shadow-md py-1 px-3">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl md:hidden text-black"
          >
            <BiAlignLeft />
          </button>
          <h1 className="text-xl font-bold hidden md:block text-gray-800">
            Coxscab
          </h1>
          <input
            type="text"
            aria-label="Search"
            placeholder="Search"
            className="hidden md:block border border-gray-300 rounded-full py-1 px-3 ml-3 outline-none"
            style={{ minWidth: "200px" }} // Ensure the search bar has a minimum width
          />
        </div>
        <div className="flex items-center">
          <BiSolidBell className="text-xl text-black cursor-pointer mr-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src="https://picsum.photos/200"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="flex mt-[48px] h-[calc(100vh-48px)]">
        <nav
          // style={{ height: "calc(100vh - 48px)" }}
          className={`bg-[#3d464d] text-gray-100 w-64 lg:w-1/6 h-full fixed top-[48px] left-0 lg:static z-50 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:translate-x-0 lg:overflow-y-auto`}
        >
          {menuItem?.map(
            ({ to, name, icon, permission, count }) =>
              permissions.includes(permission) && (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleNavItemClick}
                  className={({ isActive }) =>
                    `flex items-center text-sm font-medium text-gray-100 relative ${
                      isActive ? "bg-gray-600" : ""
                    } hover:bg-gray-600 hover:text-white px-3 py-3`
                  }
                >
                  {icon}{" "}
                  <p className="ml-3">
                    <span>{name}</span>
                    {count && (
                      <span className="absolute right-3 top-3 p-1 text-xs bg-yellow-600 rounded-full flex justify-center items-center">
                        {count}
                      </span>
                    )}
                  </p>
                </NavLink>
              )
          )}
        </nav>
        {/* Overlay for Sidebar on Small Screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Content Section */}
        <div
          // style={{ height: "calc(100vh - 48px)" }}
          className={`flex-1 h-full overflow-y-auto bg-[#f5f7fa] px-3 pb-10 `}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SideBar;
