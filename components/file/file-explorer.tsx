"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  MoreHorizontal,
  Download,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileSystemItem } from "@/types";

interface ItemProps {
  item: FileSystemItem;
  level?: number;
  expanded?: boolean;
  onExpand?: () => void;
}

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
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

// ItemSkeleton Component
const ItemSkeleton = ({ level }: { level?: number }) => {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

const SearchBar = ({
  onSearch,
  isSearching,
}: {
  onSearch: (query: string, type: string) => void;
  isSearching: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), type);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("", "all");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 p-4 border-b">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search files and folders..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pr-8"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="file">Files only</SelectItem>
            <SelectItem value="directory">Folders only</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </div>
    </div>
  );
};

// FileExplorerItem Component
const FileExplorerItem = ({
  item,
  level = 0,
  expanded = false,
  onExpand,
}: ItemProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [children, setChildren] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch children of the directory if expanded
  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: encodeURIComponent(item.path) }),
      });
      if (!response.ok) throw new Error("Failed to fetch children");
      const data = await response.json();
      setChildren(data);
    } catch (error) {
      console.error("Failed to fetch children:", error);
      toast.error("Failed to load folder contents");
    } finally {
      setLoading(false);
    }
  };

  // Handle downloading of files or folders
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;

    try {
      setDownloading(true);
      const endpoint =
        item.type === "directory"
          ? "/api/file/download/folder"
          : "/api/file/download";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: encodeURIComponent(item.path) }), // Include the path in the request body
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        item.type === "directory" ? `${item.name}.zip` : item.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Successfully downloaded ${item.name}`);
    } catch (error) {
      console.error("Failed to download:", error);
      toast.error(`Failed to download ${item.name}`);
    } finally {
      setDownloading(false);
    }
  };

  // Handle expanding directories
  const handleExpand = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (item.type === "directory") {
      setIsExpanded(!isExpanded);
      if (!children.length && !loading) {
        await fetchChildren();
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

  const Icon = item.type === "directory" ? Folder : File;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div>
      <div
        onClick={open} // Open on click
        onKeyDown={handleKeyPress}
        role="button"
        tabIndex={0}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
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

        {item.size && (
          <span className="ml-2 text-xs text-muted-foreground">
            {formatFileSize(item.size)}
          </span>
        )}

        <div className="ml-auto flex items-center gap-x-2">
          <div
            role="button"
            onClick={handleDownload}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Download className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
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
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download {item.type === "directory" ? "as ZIP" : ""}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                <div>Path: {item.path}</div>
                {item.size && <div>Size: {formatFileSize(item.size)}</div>}
                {item.modifiedAt && (
                  <div>Modified: {formatDate(item.modifiedAt)}</div>
                )}
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
          />
        ))}
    </div>
  );
};

// Main FileExplorer Component
const FileExplorer = () => {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchRootItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/file");
      if (!response.ok) throw new Error("Failed to fetch root items");
      const data = await response.json();
      setItems(data);
      setIsSearchMode(false);
    } catch (error) {
      console.error("Failed to fetch root items:", error);
      setError("Failed to load file explorer");
      toast.error("Failed to load file explorer");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, type: string) => {
    if (!query) {
      fetchRootItems();
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const typeParam = type === "all" ? "" : `&type=${type}`;
      const response = await fetch("/api/file/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          type: typeParam, // Send `undefined` for "all" to omit type
        }),
      });

      if (!response.ok) throw new Error("Search failed");

      const results = await response.json();
      setItems(results);
      setIsSearchMode(true);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchRootItems();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} isSearching={searching} />

      {loading ? (
        <div className="p-4">
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </div>
      ) : items.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          {isSearchMode ? "No results found" : "No files or folders found"}
        </div>
      ) : (
        <div className="p-4">
          {items.map((item, index) => (
            <FileExplorerItem key={item.path + index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
