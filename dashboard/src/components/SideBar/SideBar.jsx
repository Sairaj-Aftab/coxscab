import { Link, Outlet } from "react-router-dom";
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
import { useState } from "react";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(true);
  return (
    <>
      {/* Header Section */}
      <div className="fixed top-0 left-0 w-full z-[99999] flex pr-3">
        <div
          className={`${
            open ? "basis-0 w-0" : "basis-2/12"
          } hidden lg:flex bg-primary py-1 justify-center items-center`}
        >
          <h1 className="text-2xl text-white font-bold">Sairaj's</h1>
        </div>
        <div
          className={`${
            open ? "w-full" : "w-full lg:basis-10/12"
          } pl-3 shadow-lg flex justify-between items-center py-1`}
        >
          <div className="flex gap-5 items-center">
            <BiAlignLeft
              onClick={() => setOpen(!open)}
              className="text-xl text-black cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-full py-1 px-3 outline-none"
            />
          </div>
          <div className="flex gap-5 items-center">
            <BiSolidBell className="text-xl text-black cursor-pointer" />
            <div>
              <img
                src="https://picsum.photos/200"
                alt=""
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className={`flex`}>
        <nav
          style={{ height: "calc(100vh - 48px)" }}
          className={`${
            open ? "basis-0" : "w-0 lg:basis-2/12"
          } mt-12 bg-[#3d464d] overflow-auto space-y-2`}
        >
          <Link
            to="/"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </Link>
          <Link
            to="/products"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaList className="mr-3" />
            Products
          </Link>
          <Link
            to="/categories"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaUsers className="mr-3" />
            Categories
          </Link>
          <Link
            to="/tags"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
          >
            <FaUsers className="mr-3" />
            Tags
          </Link>
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2"
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
          </a>
        </nav>
        {/* Content Section */}
        <div
          style={{ height: "calc(100vh - 48px)" }}
          className={`${
            open ? "w-full" : "w-full lg:basis-10/12"
          }  mt-12 px-5 pb-10 bg-[#f5f7fa] overflow-auto`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SideBar;
