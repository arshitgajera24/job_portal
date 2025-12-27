"use client"

import { handleLogout } from "@/features/auth/server/authAction";
import { Bookmark, Briefcase, Building, CreditCard, LayoutDashboard, Plus, Settings, User, LogOut } from "lucide-react"
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { URLPattern } from "next/server";

const base = "/employer-dashboard"

const navigationItems = [
  { name: "Overview", icon: LayoutDashboard, href: base + "/" },
  { name: "Employers Profile", icon: User },
  { name: "Post a Job", icon: Plus },
  { name: "My Jobs", icon: Briefcase },
  { name: "Saved Candidate", icon: Bookmark },
  { name: "Plans & Billing", icon: CreditCard },
  { name: "All Companies", icon: Building },
  { name: "Settings", icon: Settings, href: base + "/settings" },
];

const EmployerSidebar = () => {

  const pathname = usePathname();

  function isActive(href: string, pathname: string) {
    const cleanHref = href.replace(/\/+$/, "");
    const cleanPath = pathname.replace(/\/+$/, "");

    if (cleanHref === "/employer-dashboard")
      return cleanPath === "/employer-dashboard";

    return cleanPath.startsWith(cleanHref);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="p-4 mb-2 flex justify-center items-center text-md font-medium text-muted-foreground uppercase tracking-wide">Employers Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                navigationItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <Link href={item.href || "#"} className={cn("text-sm font-medium rounded-lg transition-colors", 
                              isActive(item.href || "#", pathname) && "text-primary bg-blue-300")}>

                              <item.icon className="w-5 h-5" />
                              <span>{item.name}</span>

                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>

                        <TooltipContent side="right">
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild onClick={handleLogout} className="cursor-pointer hover:bg-red-100" >
                    <button className="font-medium text-muted-foreground text-sm hover:text-foreground rounded-lg">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default EmployerSidebar
