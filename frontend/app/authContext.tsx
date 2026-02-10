"use client";
import React, { PropsWithChildren } from "react";
import { useContext, createContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [currUser, setCurrUser] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/signup"];

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    // Set current user if userId exists in storage
    if (userIdFromStorage && !currUser) {
      setCurrUser(userIdFromStorage);
    }

    // Redirect to auth page if no userId and trying to access protected route
    if (!userIdFromStorage && !publicRoutes.includes(pathname)) {
      router.push("/auth/login");
    }

    // Redirect to dashboard if userId exists and currently on auth page
    if (
      (userIdFromStorage && pathname === "/auth/login") ||
      pathname === "/auth/signup"
    ) {
      router.push("/dashboard");
    }
  }, [currUser, pathname, router]);

  const value = {
    currUser,
    setCurrUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
