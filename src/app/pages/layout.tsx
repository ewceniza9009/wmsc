"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, show dashboard layout
  if (status === "authenticated") {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          userRole={session.user.role as string}
          isCollapsed={isSidebarCollapsed}
          onCollapsedChange={(collapsed) => setIsSidebarCollapsed(collapsed)}
        />

        {/* Main Content */}
        <div
          className={cn(
            "relative flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
          )}
        >
          <Header
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            user={session.user}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-teal-100/20 to-teal-100/20 dark:from-teal-900/50 dark:to-teal-900/50">{children}</main>
        </div>
        {/* Decorative background image */}
        <img
          src="/images/coldstorage.svg"
          alt="Decorative Cold Storage"
          className="absolute bottom-0 right-0 opacity-[0.05] pointer-events-none"
        />
        {/* Toast notifications */}
        <Toaster />
      </div>
    );
  }

  // Fallback - should not reach here due to redirect in useEffect
  return null;
}
