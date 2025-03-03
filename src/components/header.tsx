'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, LogOut, User } from 'lucide-react';

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
  // Get user initials for avatar fallback
  const getInitials = (name: string = 'User') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Generate random avatar URL based on user's email or name
  const getRandomAvatarUrl = () => {
    // Use a consistent identifier (email or name) to get the same avatar for the same user
    const identifier = user?.email || user?.name || 'anonymous-user';
    // Create a hash-like value from the identifier for more randomness
    const hash = Array.from(identifier).reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Use DiceBear API with various styles
    const styles = ['adventurer', 'avataaars', 'bottts', 'initials', 'micah', 'personas'];
    const style = styles[hash % styles.length];
    
    // Return the avatar URL
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(identifier)}`;
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
      
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage 
                  src={user?.image || getRandomAvatarUrl()} 
                  alt={user?.name || 'User'} 
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