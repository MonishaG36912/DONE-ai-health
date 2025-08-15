"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Settings, Calendar } from "lucide-react";
import { Logo } from "@/components/logo";

// Might add more nav items later
const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const currentPath = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo/Brand Section */}
        <div className="mr-6 flex">
          <Link href="/" className="flex items-center">
            {/* Show full logo on desktop, compact on mobile */}
            <div className="hidden sm:block">
              <Logo />
            </div>
            <div className="block sm:hidden">
              <Logo variant="mobile" showText={false} />
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
