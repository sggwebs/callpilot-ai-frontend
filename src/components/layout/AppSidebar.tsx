import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "📊",
    roles: ["Admin", "Low Admin"]
  },
  {
    title: "Call Logs",
    url: "/call-logs",
    icon: "📞",
    roles: ["Admin", "Low Admin"]
  },
  {
    title: "Leads",
    url: "/leads",
    icon: "👥",
    roles: ["Admin", "Low Admin"]
  },
  {
    title: "AI Agents",
    url: "/ai-agents",
    icon: "🤖",
    roles: ["Admin"]
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: "🎯",
    roles: ["Admin"]
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "⚙️",
    roles: ["Admin"]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { userProfile } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  
  const filteredItems = navigationItems.filter(item => 
    userProfile && item.roles.includes(userProfile.role)
  );

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-16 border-r border-border" : "w-64 border-r border-border"}>
      <SidebarContent className="p-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
              CP
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg text-foreground">CallPilotAI</h2>
                <p className="text-xs text-muted-foreground">Call Center AI</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="p-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${getNavCls({ isActive })}
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}