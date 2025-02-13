"use client";
import { Cover } from "@/components/Editor/cover";
import dynamic from "next/dynamic";

import { Toolbar } from "@/components/Editor/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useMemo } from "react";
import { Navbar } from "@/components/Editor/navbar";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/Editor/editor"), { ssr: false }),
    []
  );

  const update = useMutation(api.documents.update);

  const onChange = (content: string) =>
    update({ id: params.documentId, content });

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-x-3xl lg:max-x-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="bg-background h-full">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <Cover url={document.coverImage} />
        <div className="md:max-x-3xl lg:max-x-4xl max-x-4xl mx-auto">
          <Toolbar initialData={document} />
          <Editor onChange={onChange} initialContent={document.content} />
        </div>
      </div>
    </div>
  );
};

export default DocumentIdPage;
