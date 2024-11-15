import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FolderInput,
  FolderOutput,
  Import,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useImport } from "@/hook/use-import";
import { useExport } from "@/hook/use-export";

interface MenuProps {
  documentId: Id<"documents">;
}

export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const imports = useImport();
  const exports = useExport();
  const archive = useMutation(api.documents.archive);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving note...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    router.push("/documents");
  };

  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant={"ghost"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={imports.onOpen}>
          <FolderInput className="h-4 w-4 mr-2" />
          Import
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exports.onOpen}>
          <FolderOutput className="h-4 w-4 mr-2" />
          Export
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
