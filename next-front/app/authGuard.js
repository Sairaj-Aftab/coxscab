"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/store/authUser";
import { usePathname, useRouter } from "next/navigation";

const protectedRoutes = ["/profile"];

export default function AuthGuard({ children }) {
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

  if (loading) return <p>Loading...</p>;

  return children;
}

function isProtectedRoute(pathname) {
  return (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== "/auth-login"
  );
}
