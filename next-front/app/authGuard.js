"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/store/authUser";
import { usePathname, useRouter } from "next/navigation";
import socket from "@/lib/socket";
import LoadingComponent from "@/components/LoadingComponent";

const protectedRoutes = ["/profile"];

export default function AuthGuard({ children }) {
  const [watchCoordinates, setWatchCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, setLogedInUser, refreshAccessToken } =
    useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          // Refresh token and set user details
          await refreshAccessToken();
          await setLogedInUser();
        } catch (error) {
          console.error("Authentication failed:", error);
          if (isProtectedRoute(pathname)) {
            router.push("/auth-login");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, setLogedInUser, refreshAccessToken, router, pathname]);

  useEffect(() => {
    // Define success and error callbacks
    const successCallback = (pos) => {
      setWatchCoordinates({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    };

    const errorCallback = (err) => {
      setError(err.message);
    };

    // Start watching the user's position
    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback
    );

    // Cleanup: stop watching the position when the component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        socket.emit("joinRide", {
          ...user,
          location: watchCoordinates,
        });
      }, 1000); // Emit every 1 second

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [watchCoordinates, user]);

  if (loading) return <LoadingComponent />;

  return children;
}

function isProtectedRoute(pathname) {
  return (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== "/auth-login"
  );
}
