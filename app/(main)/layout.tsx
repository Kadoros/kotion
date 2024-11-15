"use client";
import Spinner from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import React from "react";
import Navigation from "./_components/navigation";
import SearchCommand from "@/components/search-command";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { FuncSidebar } from "@/components/sidebar/func-sidebar";
import RoleGate from "@/components/auth/role-gate";
import { UserRole } from "@/types";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }
  return (
    <div className="h-full w-full flex dark:bg-[#1F1F1F]">
      <RoleGate allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
        {/* <Navigation /> */}
        <AppSidebar />
        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
        <FuncSidebar side="right" />
      </RoleGate>
    </div>
  );
};

export default MainLayout;
