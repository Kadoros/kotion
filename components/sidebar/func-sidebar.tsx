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
  Trash,
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
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebarL";

import { FuncSwitcher } from "./func-switcher";

import { usePDFHighlight } from "@/hook/use-pdf-highlight";
import DictionaryCard from "./func/dictionary-card";
import TranslatorCard from "./func/translator-card";
import LectureNotetaker from "./func/lecture-note-taker";

// This is sample data.
const data = {
  funcs: [
    {
      id: 1,
      name: "Langauge support",
      logo: GalleryVerticalEnd,
    },
    { id: 2, name: "AI chat", logo: AudioWaveform },
    { id: 3, name: "lecture support", logo: Command },
  ],
};
export function FuncSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const selectedText = usePDFHighlight((state) => state.selectedText);
  const [funcId, setFuncId] = React.useState(1);

  const handleFuncChange = (id: number) => {
    setFuncId(id);
  };
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <FuncSwitcher funcs={data.funcs} onFuncChange={handleFuncChange} />
        </SidebarHeader>
        <SidebarContent>
          {funcId == 1 && (
            <>
              <DictionaryCard text={selectedText} />
            </>
          )}
          {funcId == 2 && (
            <>
              <DictionaryCard text={selectedText} />
            </>
          )}
          {funcId == 3 && (
            <>
              <LectureNotetaker />
            </>
          )}
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
