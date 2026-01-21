import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Package,
  Users,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Suppliers", url: "/suppliers", icon: Users },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Package className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-serif text-lg font-semibold text-sidebar-foreground animate-fade-in">
              Inventory
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
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
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
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
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="animate-fade-in">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions Section */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-sidebar-border animate-fade-in">
          <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </p>
          <div className="space-y-1">
            <Link
              to="/inventory?action=add"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </Link>
            <Link
              to="/inventory?action=adjust"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Minus className="w-4 h-4" />
              <span>Adjust Stock</span>
            </Link>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "px-0"
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
