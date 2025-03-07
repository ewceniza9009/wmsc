'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a toggle function that doesn't depend on theme until after mounted
  const toggleTheme = () => {
    if (mounted) {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  };

  // Always render a consistent button structure to avoid hydration mismatches
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      // Only set aria-label after mounted to prevent hydration mismatch
      aria-label={mounted ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
      // Prevent interaction until mounted
      tabIndex={mounted ? 0 : -1}
    >
      {/* Use opacity to hide the icons until mounted, but keep DOM structure consistent */}
      <div className={`relative w-5 h-5 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {mounted && (
          <>
            <Sun className={`h-5 w-5 absolute transition-transform ${resolvedTheme === 'dark' ? 'scale-100' : 'scale-0'}`} />
            <Moon className={`h-5 w-5 absolute transition-transform ${resolvedTheme === 'dark' ? 'scale-0' : 'scale-100'}`} />
          </>
        )}
      </div>
    </Button>
  );
}

