"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Car,
  User,
  Bell,
  ChevronDown,
  MapPinned,
  BriefcaseBusiness,
  Notebook,
  HelpCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileMenu = ({ isOpen, menuItems, onClose, currentPath }) => {
  const isMenuItemActive = (itemPath) => {
    // Special case for home route
    if (itemPath === "/") {
      return currentPath === "/";
    }
    // For other routes, check if current path starts with the item path
    return currentPath.startsWith(itemPath);
  };
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute right-0 top-16 bg-white shadow-lg rounded-tl-lg rounded-bl-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <button onClick={onClose} className="absolute top-4 right-4">
            <X className="h-6 w-6" />
          </button>
          <div className="mt-8 space-y-4">
            {menuItems.map((item) => {
              const isActive = isMenuItemActive(item.path);
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out ${
                    isActive
                      ? "text-primary bg-gray-50 font-semibold"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <span className={isActive ? "text-primary" : ""}>
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  // Function to check if a menu item is active
  const isMenuItemActive = (itemPath) => {
    // Special case for home route
    if (itemPath === "/") {
      return currentPath === "/";
    }
    // For other routes, check if current path starts with the item path
    return currentPath.startsWith(itemPath);
  };

  const menuItems = [
    { label: "Ride", path: "/", icon: <Car className="w-5 h-5" /> },
    { label: "Drive", path: "/drive", icon: <Car className="w-5 h-5" /> },
    {
      label: "Popular Destination",
      path: "/popular-destination",
      icon: <MapPinned className="w-5 h-5" />,
    },
    {
      label: "Lost & Found",
      path: "/lost-and-found",
      icon: <Info className="w-5 h-5" />,
    },
    {
      label: "Business",
      path: "/business",
      icon: <BriefcaseBusiness className="w-5 h-5" />,
    },
    {
      label: "About",
      path: "/about",
      icon: <Notebook className="w-5 h-5" />,
    },
    {
      label: "Help",
      path: "/help",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Car className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                CoxsCab
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-4">
              {menuItems.map((item) => {
                const isActive = isMenuItemActive(item.path);
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out ${
                      isActive
                        ? "text-primary bg-gray-50 font-semibold"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <span className={isActive ? "text-primary" : ""}>
                      {item.icon}
                    </span>
                    <span className="ml-2">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isOpen}
        menuItems={menuItems}
        onClose={() => setIsOpen(false)}
        currentPath={currentPath}
      />
    </nav>
  );
};

export default Header;
