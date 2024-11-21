"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

import { FileSystemItem, ItemProps } from "@/types";
import { ItemSkeleton } from "./item-skeleton";
export const FileExplorerItem = ({
  item,
  level = 0,
  expanded = false,
  onExpand,
  useFileSystem,
}: ItemProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [children, setChildren] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { getChildren } = useFileSystem();

  // Handle expanding directories
  const handleExpand = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (item.type === "directory") {
      setIsExpanded(!isExpanded);
      if (!children.length && !loading) {
        setLoading(true);

        try {
          // Simulate fetching directory data (replace with actual fetch if necessary)
          const fetchedChildren = await getChildren(item.path);
          setChildren(fetchedChildren || []);
        } catch (error) {
          console.error("Failed to load directory contents:", error);
        } finally {
          setLoading(false);
        }
      }
      onExpand?.();
    }
  };

  // Handle opening files or folders
  const open = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (item.type === "directory") {
      handleExpand(event); // Expand the folder to show its contents
    } else {
      // Open the file in a new tab (e.g., PDF, text file)
      window.open(`/files/${encodeURIComponent(item.path)}`, "_blank");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open(event as unknown as React.MouseEvent); // Open on enter or space
    }
  };

  const handleDropdownClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Prevent the click from reaching the parent div
  };

  const Icon = item.type === "directory" ? Folder : File;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  const isFolder = item.type === "directory";

  return (
    <div>
      <div
        onClick={open} // Open on click
        onKeyDown={handleKeyPress}
        role="button"
        tabIndex={0}
        style={{
          paddingLeft: `${level * 12 + (isFolder ? 12 : 16)}px`,
        }}
        className={cn(
          "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
          isExpanded && "bg-primary/5"
        )}
      >
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
        >
          {item.type === "directory" && (
            <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>
        <Icon
          className={cn(
            "shrink-0 h-[18px] w-[18px] mr-2",
            item.type === "directory"
              ? "text-blue-500"
              : "text-muted-foreground"
          )}
        />
        <span className="truncate">{item.name}</span>

        {/* {item.size && (
            <span className="ml-2 text-xs text-muted-foreground">
              {formatFileSize(item.size)}
            </span>
          )} */}

        <div
          className="ml-auto flex items-center gap-x-2"
          onClick={handleDropdownClick}
        >
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuSeparator />
              <div className="px-1">
                <div className="flex flex-col items-center gap-y-2">
                  <div className="flex items-center gap-x-2 mr-2">
                    {item.subject && (
                      <span className="text-xs px-1.5 py-0.5 rounded-smbg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 ">
                        {item.subject}
                      </span>
                    )}
                    {item.level && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100">
                        {item.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-x-2 mr-2">
                    {item.paperNumber && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                        Paper {item.paperNumber}
                      </span>
                    )}
                    {item.year && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100">
                        {item.year}
                      </span>
                    )}
                    {item.timeZoneNumber && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">
                        TZ{item.timeZoneNumber}
                      </span>
                    )}
                    {item.month && (
                      <span className="text-xs px-1.5 py-0.5 rounded-smbg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 ">
                        {item.month}
                      </span>
                    )}

                    {item.language && (
                      <span className="text-xs px-1.5 py-0.5 rounded-smbg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 ">
                        {item.language}
                      </span>
                    )}
                    {item.paperType === "markscheme" && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
                        MS
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs space-y-1 p-2">
                {Object.entries(item)
                  .filter(([key, value]) => {
                    // Filter out the children array and undefined/null values
                    if (key === "children") return false;
                    if (value === undefined || value === null) return false;
                    // Filter out empty strings and zero values
                    if (value === "" || value === 0) return false;
                    return true;
                  })
                  .map(([key, value]) => {
                    // Format the value based on its type and property name
                    let displayValue = value;
                    if (key === "size") {
                      displayValue = formatFileSize(value as number);
                    } else if (key === "modifiedAt") {
                      displayValue = formatDate(value as string);
                    } else if (typeof value === "boolean") {
                      displayValue = value ? "Yes" : "No";
                    }

                    // Get the label from propertyLabels
                    const label =
                      propertyLabels[key as keyof FileSystemItem] || key;

                    return (
                      <div key={key} className="flex items-start gap-x-2">
                        <span className="font-medium min-w-[100px]">
                          {label}:
                        </span>
                        <span className="text-muted-foreground break-all">
                          {String(displayValue)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading && (
        <>
          <ItemSkeleton level={level + 1} />
          <ItemSkeleton level={level + 1} />
          <ItemSkeleton level={level + 1} />
        </>
      )}

      {isExpanded &&
        !loading &&
        children.map((child, index) => (
          <FileExplorerItem
            key={child.path + index}
            item={child}
            level={level + 1}
            useFileSystem={useFileSystem}
          />
        ))}
    </div>
  );
};

const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) {
    return "";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const propertyLabels: Record<keyof FileSystemItem, string> = {
  name: "Name",
  path: "Path",
  type: "Type",
  size: "Size",
  modifiedAt: "Modified At",
  groupNumber: "Group Number",
  groupSubject: "Group Subject",
  subject: "Subject",
  level: "Level",
  year: "Year",
  month: "Month",
  paperNumber: "Paper Number",
  timeZoneNumber: "Time Zone",
  language: "Language",
  paperType: "Paper Type",
  children: "Subfolders/Files",
};
