import { useState, useCallback } from "react";
import { FileSystemItem } from "@/types";

const useFileSystem = () => {
  const [cache, setCache] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to enrich items with properties
  const enrichItemWithProperties = (item: FileSystemItem): FileSystemItem => {
    const pathParts = item.path.split("/").filter(Boolean);
    let properties: Partial<FileSystemItem> = {};

    // Process based on item depth in the hierarchy
    if (pathParts.length >= 1) {
      const groupMatch = pathParts[0].match(/Group (\d+) - (.+)/);
      if (groupMatch) {
        properties.groupNumber = groupMatch[1];
        properties.groupSubject =
          groupMatch[2] as FileSystemItem["groupSubject"];
      }
    }

    if (pathParts.length >= 2) {
      const parts = pathParts[1].split(/_(?=[^_]+$)/);
      if (parts.length === 2) {
        properties.subject = parts[0] as FileSystemItem["subject"];
        properties.level = parts[1] as FileSystemItem["level"];
      }
    }

    if (pathParts.length >= 3) {
      const sessionMatch = pathParts[2].match(/(\d{4}) (May|November)/);
      if (sessionMatch) {
        properties.year = parseInt(sessionMatch[1]);
        properties.month = sessionMatch[2] as FileSystemItem["month"];
      }
    }

    if (pathParts.length >= 4) {
      const pathPart = pathParts[3];

      const paperMatch = pathPart.match(/paper_(\d)/);

      if (paperMatch) {
        properties.paperNumber = parseInt(paperMatch[1]); // The digit found after "paper"
      }

      const parts = pathPart.split(/[_\.]/);

      const tzPart = parts.find((p) => p.startsWith("TZ"));
      if (tzPart) {
        properties.timeZoneNumber = parseInt(tzPart.substring(2)) as 1 | 2 | 3;
      }

      properties.paperType = parts.includes("markscheme")
        ? "markscheme"
        : "question paper";

      if (parts.includes("Franch")) {
        properties.language = "Franch";
      } else if (parts.includes("Spanish")) {
        properties.language = "Spanish";
      } else {
        properties.language = "English";
      }
    }

    if (item.children) {
      item.children = item.children.map(enrichItemWithProperties);
    }

    return { ...item, ...properties };
  };

  // Fetch and cache directory structure
  const fetchDirectoryStructure = useCallback(async () => {
    if (cache.length > 0) {
      return cache;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/directoryStructure.json");
      if (!response.ok) throw new Error("Failed to fetch directory structure");
      const data = await response.json();
      const enrichedData = data.map(enrichItemWithProperties);

      setCache(enrichedData);
      return enrichedData;
    } catch (error) {
      console.error("Failed to fetch directory structure:", error);
      setError("Failed to load directory structure");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Search within cached data
  const searchItems = useCallback(
    async (query: string, type: string = "all") => {
      try {
        setLoading(true);
        setError(null);

        let data = cache;
        if (cache.length === 0) {
          data = await fetchDirectoryStructure();
        }

        const searchInStructure = (
          items: FileSystemItem[]
        ): FileSystemItem[] => {
          const results: FileSystemItem[] = [];

          items.forEach((item) => {
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
              const childResults = searchInStructure(item.children);
              results.push(...childResults);
            }
          });

          return results;
        };

        return searchInStructure(data);
      } catch (error) {
        console.error("Search failed:", error);
        setError("Search failed");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [cache, fetchDirectoryStructure]
  );

  // Get children for a specific path
  const getChildren = useCallback(
    async (path: string) => {
      try {
        let data = cache;
        if (cache.length === 0) {
          data = await fetchDirectoryStructure();
        }

        const findItemByPath = (
          items: FileSystemItem[],
          targetPath: string
        ): FileSystemItem | null => {
          for (const item of items) {
            if (item.path === targetPath) {
              return item;
            }
            if (item.children) {
              const found = findItemByPath(item.children, targetPath);
              if (found) {
                return found;
              }
            }
          }
          return null;
        };

        const item = findItemByPath(data, path);
        return item?.children || [];
      } catch (error) {
        console.error("Failed to get children:", error);
        throw error;
      }
    },
    [cache, fetchDirectoryStructure]
  );

  return {
    loading,
    error,
    fetchDirectoryStructure,
    searchItems,
    getChildren,
  };
};

export default useFileSystem;
