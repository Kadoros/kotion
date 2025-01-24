"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Plus,
  Trash,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DocumentList from "@/components/sidebar/document-list";
import { toast } from "sonner";
import Item from "@/components/global/item";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TrashBox from "@/components/sidebar/trash-box";

export function NavDocumentList() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
    }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {/* {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))} */}
        <DocumentList />
        <Item onClick={handleCreate} label={"Add a page"} icon={Plus} />
        <Popover>
          <PopoverTrigger className="w-full ">
            <Item label="Trash" icon={Trash} />
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-72"
            side={isMobile ? "bottom" : "right"}
          >
            <TrashBox />
          </PopoverContent>
        </Popover>
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
