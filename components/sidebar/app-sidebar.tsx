"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Settings2,
  SquareTerminal,
  GraduationCap,
  Trash,
  ChevronRight,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import DocumentList from "@/components/sidebar/document-list";
import { NavDocumentList } from "@/components/sidebar/nav-document-list";

import { useSearch } from "@/hook/use-search";
import { useSettings } from "@/hook/use-settings";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import TrashBox from "@/app/(main)/_components/trash-box";
import { useMediaQuery } from "usehooks-ts";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebarL";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Tools",
      url: "#",
      icon: GalleryVerticalEnd,
      isActive: true,
      items: [
        {
          title: "PDF Viewer",
          url: "/pdf",
        },
        // {
        //   title: "Starred",
        //   url: "#",
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "IB",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "Past Paper Question",
          url: "/file",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const search = useSearch();
  const settings = useSettings();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible
                key={"Search"}
                asChild
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={"Search"}
                      onClick={search.onOpen}
                    >
                      <Search />
                      <span>{"Search"}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
              <Collapsible
                key={"Search"}
                asChild
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={"Setting"}
                      onClick={settings.onOpen}
                    >
                      <Settings />
                      <span>{"Setting"}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
          <NavDocumentList />

          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
