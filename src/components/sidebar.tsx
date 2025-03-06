"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Building2,
  Container,
  MapPin,
  Package,
  Package2,
  PackageOpen,
  Combine,
  Forklift,
  ClipboardList,
  Truck,
  ArrowLeftRight,
  Users,
  UserRoundSearch,
  Settings,
  ChartBarStacked,
  Warehouse,
  Thermometer,
  ChartCandlestick,
  Activity,
  CalendarCheck,
  X,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Menu,
  Calendar,
  CandlestickChart,
  CopyMinus,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  roles: string[];
  children?: NavItem[];
}

export function Sidebar({
  isOpen,
  onClose,
  userRole,
  isCollapsed: propIsCollapsed,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(propIsCollapsed || false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Call the parent component's callback if provided
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsedState);
    }
    // Force layout recalculation by triggering a small timeout
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 10);
  };

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const collapseAllGroups = () => {
    // Create a new object with all groups set to false
    const collapsedGroups = Object.keys(openGroups).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);

    setOpenGroups(collapsedGroups);
  };

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/pages/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["admin", "manager", "worker"],
    },
    {
      title: "Setup",
      icon: <Package className="h-5 w-5" />,
      roles: ["admin", "manager", "worker"],
      children: [
        {
          title: "Company",
          href: "/pages/companies",
          icon: <Building2 className="h-5 w-5" />,
          roles: ["admin", "manager", "worker"],
        },
        {
          title: "Warehouse",
          href: "/pages/warehouses",
          icon: <Warehouse className="h-5 w-5" />,
          roles: ["admin", "manager", "worker"],
        },
        {
          title: "Customer",
          href: "/pages/customers",
          icon: <UserRoundSearch className="h-5 w-5" />,
          roles: ["admin", "manager", "worker"],
        },
        {
          title: "Storage Room",
          href: "/pages/room",
          icon: <Container className="h-5 w-5" />,
          roles: ["admin", "manager", "worker"],
        },
        {
          title: "Storage Location",
          href: "/pages/location",
          icon: <MapPin className="h-5 w-5" />,
          roles: ["admin", "manager", "worker"],
        },
        {
          title: "Materials",
          href: "/pages/material",
          icon: <Package2 className="h-5 w-5" />,
          roles: ["admin", "manager", "worker"],
        },
      ],
    },
    {
      title: "Operations",
      icon: <Combine className="h-5 w-5" />,
      roles: ["admin", "manager"],
      children: [
        {
          title: "Storage Receiving",
          href: "/pages/storage-receiving",
          icon: <Truck className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
        {
          title: "Storage Transfer",
          href: "/pages/storage-transfer",
          icon: <ArrowLeftRight className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
        {
          title: "Storage Packing",
          href: "/pages/storage-packing",
          icon: <PackageOpen className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
        {
          title: "Withdrawal Order",
          href: "/pages/witdrawal-order",
          icon: <ClipboardList className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
        {
          title: "Storage Pick",
          href: "/pages/pick",
          icon: <Forklift className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
      ],
    },
    {
      title: "Reports",
      icon: <ChartBarStacked className="h-5 w-5" />,
      roles: ["admin", "manager"],
      children: [
        {
          title: "Shipments",
          href: "/pages/shipments",
          icon: <Truck className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
        {
          title: "Temperature Logs",
          href: "/pages/temperature",
          icon: <Thermometer className="h-5 w-5" />,
          roles: ["admin", "manager"],
        },
      ],
    },
    {
      title: "Inventory Status",
      href: "/pages/inventory-status",
      icon: <CandlestickChart className="h-5 w-5" />,
      roles: ["admin", "manager", "worker"],
    },
    {
      title: "Storage Status",
      href: "/pages/storage-status",
      icon: <Activity className="h-5 w-5" />,
      roles: ["admin", "manager"],
    },
    {
      title: "Administration",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin"],
      children: [
        {
          title: "Users",
          href: "/pages/users",
          icon: <Users className="h-5 w-5" />,
          roles: ["admin"],
        },
        {
          title: "Settings",
          href: "/pages/settings",
          icon: <Settings className="h-5 w-5" />,
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Calendar",
      href: "/pages/calendar",
      icon: <CalendarCheck className="h-5 w-5" />,
      roles: ["admin", "manager"],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // Check if the item itself has the role
    const hasRole = item.roles.includes(userRole);

    // If it has children, check if any child has the role
    if (item.children) {
      const hasChildWithRole = item.children.some((child) =>
        child.roles.includes(userRole)
      );
      return hasRole || hasChildWithRole;
    }

    return hasRole;
  });

  // Render a nav item (could be a link or a collapsible group)
  const renderNavItem = (item: NavItem) => {
    // If the item has children, render it as a collapsible group
    if (item.children && item.children.length > 0) {
      const filteredChildren = item.children.filter((child) =>
        child.roles.includes(userRole)
      );

      if (filteredChildren.length === 0) return null;

      return (
        <Collapsible
          key={item.title}
          open={openGroups[item.title]}
          onOpenChange={() => toggleGroup(item.title)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground font-semibold",
                openGroups[item.title]
                  ? "bg-accent/50 text-teal-700"
                  : "text-teal-700"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className={cn(isCollapsed ? "hidden" : "block")}>
                  {item.title}
                </span>
              </div>
              {!isCollapsed &&
                (openGroups[item.title] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ))}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-1">
              {filteredChildren.map((child) => (
                <Link
                  key={child.href}
                  href={child.href || "#"}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isCollapsed ? "pl-3" : "border-l-2 border-muted ml-3",
                    pathname === child.href
                      ? "bg-accent/50 text-teal-700 border-primary"
                      : "transparent"
                  )}
                >
                  {child.icon}
                  <span className={cn(isCollapsed ? "hidden" : "block")}>
                    {child.title}
                  </span>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Otherwise, render it as a regular link
    return (
      <Link
        key={item.href}
        href={item.href || "#"}
        onClick={() => onClose()}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          pathname === item.href ? "bg-accent/50 text-teal-700" : "transparent"
        )}
      >
        {item.icon}
        <span className={cn(isCollapsed ? "hidden" : "block")}>
          {item.title}
        </span>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col relative">
      <div className="flex h-16 items-center border-b px-4">
        <Link
          href="/pages/dashboard"
          className="flex items-center font-semibold"
          onClick={() => onClose()}
        >
          <Warehouse className="mr-2 h-6 w-6" />
          <span
            className={cn(
              isCollapsed ? "hidden" : "block",
              "text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 drop-shadow-md"
            )}
          >
            COLD STORAGE
          </span>
        </Link>
      </div>

      {/* Company Logo and Name (only visible when not collapsed) */}
      {!isCollapsed && (
        <div className="flex items-center px-3 py-2 border-b">
          <Image
            src="/images/global_marketing.jpg"
            alt="Global Marketing Logo"
            width={50}
            height={50}
            className="rounded-full border-2 border-e-cyan-500 p-1"
          />
          <span className="text-sm font-small text-primary px-2 w-50 text-start break-words">
            Global Marketing Corporation
          </span>
        </div>
      )}

      <div className="flex items-center justify-start px-2 pt-4">
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs flex items-center gap-1"
            onClick={collapseAllGroups}
          >
            <CopyMinus className="h-3.5 w-3.5" />
            <span>Collapse All</span>
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map(renderNavItem)}
        </nav>
      </ScrollArea>

      {/* Floating toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border shadow-md hidden md:flex justify-center items-center bg-background z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-72">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 z-10 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0 border-r bg-background w-full">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
