"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

const Providers = ({ children }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default Providers;
