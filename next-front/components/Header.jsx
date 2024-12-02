"use client";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { MapPin, Menu, Search } from "lucide-react";
import { useMapCoordinates } from "@/store/mapCoordinates";
import { useAuthUser } from "@/store/authUser";
import { useRouter } from "next/navigation";

const Header = () => {
  const sidebar = useSidebar();

  const router = useRouter();
  const { user } = useAuthUser();
  const { setUserCoordinates } = useMapCoordinates();
  const handleYourLocation = () => {
    if (user) {
      router.push("/");
      navigator.geolocation.getCurrentPosition(function (pos) {
        setUserCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    } else {
      router.push("/auth-login");
    }
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3"
    >
      <div className="container flex h-14 items-center">
        <Menu
          className="w-6 h-6 cursor-pointer"
          onClick={() => sidebar.toggleSidebar()}
        />
        <div className="mx-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block text-primary text-xl">
              CoxsCab
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none md:hidden">
            <Link
              href={"/"}
              className="inline-flex items-center whitespace-nowrap text-primary font-bold h-9 px-4 py-2 w-full justify-start text-xl md:w-40"
            >
              CoxsCab
            </Link>
          </div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleYourLocation}>
              <MapPin className="h-5 w-5" />
              <span className="sr-only">Location</span>
            </Button>
            {user && (
              <Link href="/profile" passHref>
                <Avatar>
                  <AvatarImage src={``} alt="" />
                  <AvatarFallback className="gradient-page text-gray-900 text-lg font-semibold">
                    {user?.firstName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
