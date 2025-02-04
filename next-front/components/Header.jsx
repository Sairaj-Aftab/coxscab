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
} from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Ride", path: "/", icon: <Car className="w-5 h-5" /> },
    { label: "Drive", path: "/drive", icon: <Car className="w-5 h-5" /> },
    {
      label: "Popular Destination",
      path: "/popular-destination",
      icon: <MapPinned className="w-5 h-5" />,
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
    <nav className="bg-white shadow-lg border-b-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Car className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                CoxsCab
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Profile dropdown */}
            {/* <div className="ml-4 flex items-center">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                <User className="w-5 h-5" />
                <span className="ml-2">Profile</span>
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </div> */}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </a>
            ))}
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              <User className="w-5 h-5" />
              <span className="ml-2">Profile</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
