"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UAParser } from "ua-parser-js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  BriefcaseBusiness,
  Car,
  HelpCircle,
  Home,
  Loader2,
  LogOut,
  MapPinned,
  Notebook,
  Package,
  Settings,
  UserCircle,
} from "lucide-react";
import { useAuthUser } from "@/store/authUser";
import { logOut } from "@/service/auth.service";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import axios from "axios";
import { set } from "react-hook-form";

const MainSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [browser, setBrowser] = useState(null);
  const [device, setDevice] = useState(null);
  const [os, setOs] = useState(null);
  const { user, setLogOut } = useAuthUser();
  const handleLogOutUser = async () => {
    setLoader(true);
    try {
      if (user) {
        const res = await logOut(user.id, {
          platform: "web",
          ipAddress,
          location,
          device: { browser, device, os },
        });
        if (res) {
          setLogOut();
          router.replace("/auth-login");
          setLoader(false);
          setIsOpen(false);
        }
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
    const parser = new UAParser();
    const result = parser.getResult();
    setBrowser(result.browser);
    setDevice(result.device);
    setOs(result.os);
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response?.data?.ip);
      } catch (error) {}
    };

    fetchIpAddress();
  }, []);
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center space-x-2 px-4 py-2">
            <span className="font-bold text-xl text-primary">CoxsCab</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {user && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Car className="mr-2 h-4 w-4" />
                  <span>Ride</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/drive">
                  <Car className="mr-2 h-4 w-4" />
                  <span>Drive</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/popular-destination">
                  <MapPinned className="mr-2 h-4 w-4" />
                  <span>Popular Destination</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/packages">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Packages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/business">
                  <BriefcaseBusiness className="mr-2 h-4 w-4" />
                  <span>Business</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/about">
                  <Notebook className="mr-2 h-4 w-4" />
                  <span>About</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {user && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {user && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    className="w-full text-left"
                    onClick={() => setIsOpen(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will log you out of your account and remove your
              session data. You can log back in anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogOutUser}>
              {loader ? <Loader2 className="animate-spin" /> : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MainSidebar;
