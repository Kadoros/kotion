"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NoPermissionPage = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/error.png"}
        height={"300"}
        width={"300"}
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src={"/error-dark.png"}
        height={"300"}
        width={"300"}
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className="text-xl font-medium">
        You do not have permission to access this page
      </h2>
      <h2 className="text-xl font-medium">contact to kadoros1130@gmail.com</h2>
      <Button asChild>
        <Link href={"/"}>Go Back</Link>
      </Button>
    </div>
  );
};

export default NoPermissionPage;
