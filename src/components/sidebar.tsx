'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Truck, 
  Users, 
  Settings, 
  BarChart,
  Warehouse,
  Thermometer,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

export function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/pages/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['admin', 'manager', 'worker'],
    },
    {
      title: 'Inventory',
      href: '/pages/inventory',
      icon: <Package className="h-5 w-5" />,
      roles: ['admin', 'manager', 'worker'],
    },
    {
      title: 'Orders',
      href: '/pages/orders',
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ['admin', 'manager', 'worker'],
    },
    {
      title: 'Shipments',
      href: '/pages/shipments',
      icon: <Truck className="h-5 w-5" />,
      roles: ['admin', 'manager'],
    },
    {
      title: 'Temperature Logs',
      href: '/pages/temperature',
      icon: <Thermometer className="h-5 w-5" />,
      roles: ['admin', 'manager'],
    },
    {
      title: 'Storage Locations',
      href: '/pages/locations',
      icon: <Warehouse className="h-5 w-5" />,
      roles: ['admin', 'manager'],
    },
    {
      title: 'Reports',
      href: '/pages/reports',
      icon: <BarChart className="h-5 w-5" />,
      roles: ['admin', 'manager'],
    },
    {
      title: 'Users',
      href: '/pages/users',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin'],
    },
    {
      title: 'Settings',
      href: '/pages/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link 
          href="/dashboard" 
          className="flex items-center font-semibold"
          onClick={() => onClose()}
        >
          <Warehouse className="mr-2 h-6 w-6" />
          <span>WMS Cold Storage</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto md:hidden" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose()}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
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
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 border-r bg-background">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}