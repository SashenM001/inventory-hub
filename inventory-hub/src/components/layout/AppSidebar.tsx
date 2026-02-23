import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useInventoryStore } from "@/stores/inventoryStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: number;
  adminOnly?: boolean;
}

const baseNavItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Summary", url: "/suppliers/summary", icon: BarChart3 },
];

const adminNavItems: NavItem[] = [
  { title: "Manage Employees", url: "/admin/employees", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useInventoryStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 px-2 border-b border-sidebar-border">
        {collapsed ? (
          <img
            src="/SFD_Logo.jpg"
            alt="SFD Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <img
            src="/SFD_Logo.jpg"
            alt="Supreme Funeral Directors"
            className="h-14 w-auto object-contain animate-fade-in"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {(() => {
          const navItems = [...baseNavItems];
          if (currentUser?.role === "admin") {
            navItems.push(...adminNavItems);
          }
          return navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url);

            if (collapsed) {
              return (
                <Tooltip key={item.url} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-all duration-200",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="animate-fade-in">{item.title}</span>
              </Link>
            );
          });
        })()}
      </nav>

      {/* User & Collapse Toggle */}
      <div className="space-y-2 p-3 border-t border-sidebar-border">
        {/* User Info */}
        {currentUser && !collapsed && (
          <div className="px-3 py-2 text-sm">
            <p className="text-sidebar-foreground/80 text-xs font-medium">
              Logged in as
            </p>
            <p className="text-sidebar-foreground font-medium truncate">
              {currentUser.fullName}
            </p>
          </div>
        )}

        {/* Logout Button */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-10 h-10 mx-auto p-0 justify-center text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-red-600 gap-3"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "px-0",
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
