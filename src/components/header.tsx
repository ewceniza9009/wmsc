'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LogOut, User, LayoutDashboard, Package, ChartBarStacked, Activity, Warehouse, Calendar1 } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  onMenuClick: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState('1');

  // Get user initials for avatar fallback
  const getInitials = (name: string = 'User') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Use warehouse-themed avatar instead of random avatar
  const getWarehouseAvatar = () => {
    // Use warehouse employee image as default avatar
    return '/images/warehouse_employee.jpg';
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {/* Navigation Links - hidden on mobile */}
      <nav className="hidden md:flex items-center space-x-4">
        <Link href="/pages/dashboard" className="text-sm font-medium text-muted-foreground hover:text-teal-700 flex items-center">
          <LayoutDashboard className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
        <Link href="/pages/inventory-status" className="text-sm font-medium text-muted-foreground hover:text-teal-700 flex items-center">
          <Package className="h-4 w-4 mr-1" />
          Inventory Code/Material Status
        </Link>
        <Link href="/pages/storage-status" className="text-sm font-medium text-muted-foreground hover:text-teal-700 flex items-center">
          <Activity className="h-4 w-4 mr-1" />
          Storage Status
        </Link>
        <Link href="/pages/reports" className="text-sm font-medium text-muted-foreground hover:text-teal-700 flex items-center">
          <Calendar1 className="h-4 w-4 mr-1" />
          Calendar
        </Link>
      </nav>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-[180px] border-0 ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Main Warehouse</SelectItem>
              <SelectItem value="2">Cold Storage North</SelectItem>
              <SelectItem value="3">Cold Storage South</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage 
                  src={user?.image || getWarehouseAvatar()} 
                  alt={user?.name || 'Warehouse User'} 
                />
                <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}