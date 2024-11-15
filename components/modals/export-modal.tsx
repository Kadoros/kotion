"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useExport } from "@/hook/use-export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
interface ExportModalProps {
  onExport: (format: string) => Promise<string>;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onExport }) => {
  // Update component signature
  const exports = useExport();
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const handleExport = async () => {
    if (selectedFormat) {
      const data = await onExport(selectedFormat); // Await the promise

      // Create a blob and a download link
      const blob = new Blob([data], { type: "text/plain" }); // Change MIME type if necessary
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger a download
      const link = document.createElement("a");
      link.href = url;
      link.download = `export.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link element and revoking the object URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      exports.onClose();
    }
  };

  return (
    <Dialog open={exports.isOpen} onOpenChange={exports.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Export note</h2>
        </DialogHeader>
        <div className="flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <Label className="text-sm font-medium">Export as</Label>
            </div>
            <Select onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="md">Markdown & CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full justify-end flex mt-3">
            <Button size={"sm"} onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
