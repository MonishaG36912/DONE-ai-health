"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Settings, Calendar, List, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";

// Might add more nav items later
const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "+Here", href: "/here", icon: List },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const currentPath = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo/Brand Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {/* Show full logo on desktop, compact on mobile */}
            <div className="hidden sm:block">
              <Logo width={56} height={56} />
            </div>
            <div className="block sm:hidden">
              <Logo variant="mobile" width={40} height={40} showText={false} />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex flex-1 items-center justify-end space-x-4 md:justify-end">
          <nav className="flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-xl px-6 text-lg font-semibold transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    isActive
                      ? "bg-muted font-bold text-foreground shadow"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="h-6 w-6 mr-2" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className="sm:hidden flex items-center">
          <button
            className="inline-flex items-center justify-center rounded-xl p-2 text-lg font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Menu className="h-8 w-8" />
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-20 right-4 w-48 rounded-xl bg-background shadow-lg border z-50 animate-fade-in">
              <nav className="flex flex-col py-2">
                {navLinks.map((link) => {
                  const isActive = currentPath === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-base font-semibold transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-muted font-bold text-foreground shadow"
                          : "text-muted-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="h-5 w-5 mr-2" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
