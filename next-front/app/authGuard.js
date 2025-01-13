"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthUser } from "@/store/authUser";
import { usePathname, useRouter } from "next/navigation";
import socket from "@/lib/socket";
import LoadingComponent from "@/components/LoadingComponent";
import { useMapCoordinates } from "@/store/mapCoordinates";

const protectedRoutes = ["/profile"];

export default function AuthGuard({ children }) {
  const [watchCoordinates, setWatchCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, setLogedInUser, refreshAccessToken } =
    useAuthUser();
  const { setUserCoordinates } = useMapCoordinates();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = useCallback(
    (path) =>
      protectedRoutes.some((route) => path.startsWith(route)) &&
      path !== "/auth-login",
    []
  );

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        setUserCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setWatchCoordinates({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
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
