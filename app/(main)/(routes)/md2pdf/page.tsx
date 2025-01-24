"use client"
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { Navbar } from "@/components/Editor/navbar"

const md2pdfPage = () => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor/editor"), { ssr: false }),
    []
  );
  return (
    <div className=" size-full">
      <div className="size-full">
        <Navbar />
        <div className="max-w-4xl mx-auto">
       
          <div className="md:max-x-3xl lg:max-x-4xl max-x-4xl mx-auto">

            <Editor onChange={() => {}}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default md2pdfPage;
