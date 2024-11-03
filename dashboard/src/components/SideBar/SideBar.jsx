import { Link, Outlet, useLocation } from "react-router-dom";
import { BiAlignLeft, BiSolidBell } from "react-icons/bi";
import {
  FaTachometerAlt,
  FaList,
  FaUsers,
  FaShoppingCart,
  FaMailBulk,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuthUser } from "@/features/auth/authApiSlice";
import { setLogoutUser } from "@/features/auth/authSlice";
import { getVehicleTypeData } from "@/features/vehicleTypeSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const { types } = useSelector(getVehicleTypeData);
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogOut = () => {
    dispatch(logoutAuthUser());
    dispatch(setLogoutUser());
  };

  // Close the sidebar when a nav item is clicked
  const handleNavItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Close sidebar on small screens
    }
  };
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
          <Link
            to="/"
            onClick={handleNavItemClick}
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname === "/" && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </Link>
          <Link
            to={`/vehicles/${
              types?.find((type) => type.name === "TOMTOM")?.id || ""
            }`}
            onClick={handleNavItemClick}
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname.includes("/vehicles") && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Vehicles
          </Link>
          <Link
            to={`/drivers/all`}
            onClick={handleNavItemClick}
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname.includes("/drivers") && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Drivers
          </Link>
          <Link
            to={`/garage/${
              types?.find((type) => type.name === "TOMTOM")?.id || ""
            }`}
            onClick={handleNavItemClick}
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname.includes("/garage") && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Garage
          </Link>

          <Link
            to="/auth-users"
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname === "/auth-users" && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Auth Users
          </Link>
          <Link
            to="/required-categories"
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname === "/required-categories" && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Required Categories
          </Link>
          <Link
            to="/roles"
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname === "/roles" && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Roles
          </Link>

          <Link
            to="/permissions"
            className={`flex items-center text-sm font-medium text-gray-100 ${
              pathname === "/permissions" && "bg-gray-600"
            } hover:bg-gray-600 hover:text-white px-3 py-3`}
          >
            <FaList className="mr-3" />
            Permissions
          </Link>
          {/* <Link
            to="/products"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-3"
          >
            <FaList className="mr-3" />
            Products
          </Link>
          <Link
            to="/categories"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-3"
          >
            <FaUsers className="mr-3" />
            Categories
          </Link>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-3"
          >
            <FaUsers className="mr-3" />
            Customers
          </a>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaShoppingCart className="mr-3" />
            Orders
          </a>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaMailBulk className="mr-3" />
            Marketing
          </a>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2 relative"
          >
            <FaCalendarAlt className="mr-3" />
            Inbox
            <span className="absolute right-3 top-2 bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs">
              8
            </span>
          </a>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaCalendarAlt className="mr-3" />
            Calendar
          </a>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaChartBar className="mr-3" />
            Analytics
          </a>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaCog className="mr-3" />
            Settings
          </a> */}
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
