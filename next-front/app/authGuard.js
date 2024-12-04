"use client";

import { useEffect } from "react";
import { useAuthUser } from "@/store/authUser";
import { usePathname, useRouter } from "next/navigation";

const protectedRoutes = ["/profile"];
const publicRoutes = ["/"];

export default function AuthGuard({ children }) {
  const { user, setLogedInUser, refreshAccessToken } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          await refreshAccessToken();
          await setLogedInUser();
        } catch (error) {
          if (isProtectedRoute(pathname)) {
            router.push("/auth-login");
          }
        }
      }
    };

    checkAuth();
  }, [user, setLogedInUser, refreshAccessToken, router, pathname]);

  // if (isProtectedRoute(pathname) && !user) return <p>Loading...</p>;

  return children;
}

function isProtectedRoute(pathname) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}
