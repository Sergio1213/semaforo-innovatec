"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircleQuestion,
  Presentation,
  Settings,
  Speech,
  Store,
  ChevronDown,
  CircuitBoard,
} from "lucide-react";

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Menu items.
const items = [
  {
    title: "Exposición",
    url: "/",
    icon: Presentation,
  },
  {
    title: "Preguntas y respuestas",
    url: "/preguntas-y-respuestas",
    icon: MessageCircleQuestion,
  },
  {
    title: "Stand",
    url: "/stand",
    icon: Store,
  },
  {
    title: "Pitch deck",
    url: "/pitch-deck",
    icon: Speech,
  },
  {
    title: "Personalizado",
    url: "/personalizado",
    icon: Settings,
  },
];

const itemshackatec = [
  {
    title: "Exposición",
    url: "/hackatec/Expo",
    icon: Presentation,
  },
  {
    title: "Prototipo",
    url: "/hackatec/Prototipo",
    icon: CircuitBoard,
  },
  {
    title: "Preguntas y Respuestas",
    url: "/hackatec/Preguntas",
    icon: MessageCircleQuestion,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarMenu>
        <Collapsible className="group/collapsible">
          <SidebarMenuItem className="px-0">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full">
                <span>Innovatec Menu</span>
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
      <SidebarMenu>
        <Collapsible className="group/collapsible">
          <SidebarMenuItem className="px-0">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full">
                <span>Hackatec Menu</span>
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {itemshackatec.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </Sidebar>
  );
}
