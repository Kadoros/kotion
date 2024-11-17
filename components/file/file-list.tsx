// components/FileList.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileIcon } from "lucide-react"; // Or any icon of your choice
import Item from "@/components/item"; // Adjust the import according to your setup

interface FileListProps {
  parentFolderPath?: string; // To handle nested folders if necessary
  level?: number;
}

const FileList = ({ parentFolderPath = "", level = 0 }: FileListProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (filePath: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [filePath]: !prevExpanded[filePath],
    }));
  };

  // Fetch files from the API on mount or whenever the parent folder changes
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/file?folder=${parentFolderPath}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          console.error("Failed to fetch files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [parentFolderPath]);

  const onRedirect = (filePath: string) => {
    router.push(`${filePath}`); // Adjust the route to how you'd handle note viewing
  };

  if (files.length === 0) {
    return <Item.Skeleton level={level} />;
  }

  return (
    <>
      {files.map((file) => (
        <div key={file}>
          <Item
            // id={file}
            onClick={() => onRedirect(file)}
            label={file.split("/").slice(-1)[0]}
            icon={FileIcon}
            active={false}
            level={level}
            onExpend={() => onExpand(file)}
            expanded={expanded[file]}
          />
          {expanded[file] && (
            <FileList parentFolderPath={file} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default FileList;
