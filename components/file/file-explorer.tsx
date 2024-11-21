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
import { cn, enrichItemWithProperties } from "@/lib/utils";
import { toast } from "sonner";
import { FileSystemItem } from "@/types";
import { ItemSkeleton } from "./item-skeleton";
import { FileExplorerItem } from "./file-expolorer-item";
import { SearchBar } from "./search-bar";
import useFileSystem from "@/hook/use-file-system";

// Helper function to format file size

// ItemSkeleton Component

// Main FileExplorer Component
const FileExplorer = () => {
  const [items, setItems] = useState<FileSystemItem[]>([]);

  const [searching, setSearching] = useState(false);

  const [isSearchMode, setIsSearchMode] = useState(false);

  const { loading, error, fetchDirectoryStructure, searchItems } =
    useFileSystem();

  // Handle search logic
  const handleSearch = async (query: string, type: string) => {
    if (!query) {
      const data = await fetchDirectoryStructure();
      setItems(data);
      setIsSearchMode(false);
      return;
    }

    try {
      setSearching(true);
      const results = await searchItems(query, type);
      setItems(results);
      setIsSearchMode(true);
    } catch (error) {
      // Error is already handled by the hook
    } finally {
      setSearching(false);
    }
  };

  // Recursive search function within the directory structure
  const searchInDirectoryStructure = (
    structure: FileSystemItem[],
    query: string,
    type: string
  ): FileSystemItem[] => {
    const results: FileSystemItem[] = [];

    structure.forEach((item) => {
      // Search in all properties of the item
      const itemValues = Object.values(item).filter(
        (value) => typeof value === "string" || typeof value === "number"
      );

      const matchesQuery = itemValues.some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      );
      const matchesType = type === "all" || item.type === type;

      if (matchesQuery && matchesType) {
        results.push(item);
      }

      if (item.children) {
        const childResults = searchInDirectoryStructure(
          item.children,
          query,
          type
        );
        results.push(...childResults);
      }
    });

    return results;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchDirectoryStructure();
        setItems(data);
      } catch (error) {
        // Error is already handled by the hook
      }
    };
    loadInitialData();
  }, [fetchDirectoryStructure]);

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
            <FileExplorerItem
              key={item.path + index}
              item={item}
              useFileSystem={useFileSystem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
