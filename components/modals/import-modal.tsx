"use client";
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useImport } from "@/hook/use-import";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUp, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ImportModalProps {
  onImport: (data: string, format: string) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onImport }) => {
  const imports = useImport();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const format = file.name.split(".").pop(); // Get file extension
      if (format === "md" || format === "html") {
        const data = await file.text();
        await onImport(data, format);
        imports.onClose();
      } else {
        alert("Unsupported file format. Please upload a .md or .html file.");
      }
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={imports.isOpen} onOpenChange={imports.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Import Note</h2>
        </DialogHeader>
        <div className="flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <Label className="text-sm font-medium">Import with</Label>
            </div>
            <Button size="icon" variant="ghost" onClick={handleFileUploadClick}>
              <FileUp className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".md, .html"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <Collapsible className="w-full flex flex-col">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <Label className="text-sm font-medium">Integrate from</Label>
                </div>
                <CollapsibleTrigger>
                  <Button size="icon" variant="ghost">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <Label className="text-sm font-medium">
                  it is not supported yet...
                </Label>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
