"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebarL";

interface FuncSwitcherProps {
  funcs: {
    id: number;
    name: string;
    logo: React.ElementType;
  }[];
  onFuncChange: (id: number) => void;
}

export function FuncSwitcher({ funcs, onFuncChange }: FuncSwitcherProps) {
  const { isMobile } = useSidebar();
  const [activeFunc, setActiveFunc] = React.useState(funcs[0]);

  const handleFuncSelect = (func: {
    id: number;
    name: string;
    logo: React.ElementType;
  }) => {
    setActiveFunc(func);
    onFuncChange(func.id); // Trigger the callback when a function is selected
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-secondary text-sidebar-secondary-foreground">
                <activeFunc.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeFunc.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Fixed features
            </DropdownMenuLabel>
            {funcs.map((func, index) => (
              <DropdownMenuItem
                key={func.name}
                onClick={() => handleFuncSelect(func)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <func.logo className="size-4 shrink-0" />
                </div>
                {func.name}
                <DropdownMenuShortcut>Alt {index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Custom features
            </DropdownMenuLabel>
            {funcs.map((func, index) => (
              <DropdownMenuItem
                key={func.name}
                onClick={() => handleFuncSelect(func)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <func.logo className="size-4 shrink-0" />
                </div>
                {func.name}
                <DropdownMenuShortcut>Alt {index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
