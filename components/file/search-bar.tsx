"use client";

import React, { useState } from "react";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchBar = ({
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
