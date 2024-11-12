import {MessageCircleQuestion, Presentation, Settings, Speech, Store } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Opciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
