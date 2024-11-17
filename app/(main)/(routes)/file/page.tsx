"use client";
import FileExplorer from "@/components/file/file-explorer";
import { useEffect, useState } from "react";


export default function Notes() {
  // const [files, setFiles] = useState<string[]>([]);

  // useEffect(() => {
  //   fetch("/api/file")
  //     .then((res) => res.json())
  //     .then((data) => setFiles(data))
  //     .catch((err) => console.error("Failed to fetch files:", err));
  // }, []);

  return (
    <div>
      <h1>Available Notes</h1>
      <FileExplorer /> 
    </div>
  );
}
