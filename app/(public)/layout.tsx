"use client";
import Spinner from "@/components/global/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import React from "react";

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

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
