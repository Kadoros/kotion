"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useOpenPdfWith } from "@/hook/use-open-pdf-with";
import { useRouter } from "next/navigation"; // Import useRouter

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const OpenPdfWithModel = () => {
  const openPdf = useOpenPdfWith();
  const [urlval, setUrlval] = useState("");

  const router = useRouter(); // Initialize the router

  const handleGoButtonClick = () => {
    const redirectUrl = `/pdf?url=${encodeURIComponent(urlval)}`;
    openPdf.onClose();
    router.push(redirectUrl); // Use router.push for navigation
  };

  return (
    <Dialog open={openPdf.isOpen} onOpenChange={openPdf.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-2xl font-medium">Open PDF</h2>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xl">With URL</Label>
          </div>
          <Input
            className="border-2"
            value={urlval}
            onChange={(e) => {
              setUrlval(e.target.value);
            }} // Update urlval on input change
          />
          <Button className="w-28 ml-auto" onClick={handleGoButtonClick}>
            GO
          </Button>
          <Accordion type="single" collapsible>
            <AccordionItem value="from-local">
              <AccordionTrigger className="text-sm">
                From Local
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-x-2 mt-2">
                  <Label>Click icon : </Label>
                  <OpenPdfIcon />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const OpenPdfIcon = () => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="16px"
      viewBox="0 0 24 24"
      width="16px"
      fill="none"
      stroke="currentColor"
      className="dark:text-white"
    >
      <path d="M18.5,7.5c.275,0,.341-.159.146-.354L12.354.854a.5.5,0,0,0-.708,0L5.354,7.147c-.2.195-.129.354.146.354h3v10a1,1,0,0,0,1,1h5a1,1,0,0,0,1-1V7.5Z"></path>
      <path d="M23.5,18.5v4a1,1,0,0,1-1,1H1.5a1,1,0,0,1-1-1v-4"></path>
    </svg>
  );
};
