"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { currentLogo } from "@/lib/logo-config";

export function Logo({ 
  src = currentLogo.src, 
  alt = currentLogo.alt || "Period Tracker Logo", 
  width = currentLogo.width || 32, 
  height = currentLogo.height || 32, 
  showIcon = currentLogo.showIcon !== false,
  showText = currentLogo.showText !== false,
  variant = "default" // default, compact, mobile
}) {
  
  // Responsive adjustments
  const isCompact = variant === "compact" || variant === "mobile";
  const textSize = isCompact ? "text-base" : "text-lg";
  const spacing = isCompact ? "space-x-2" : "space-x-3";
  
  return (
    <div className={`flex items-center ${spacing}`}>
      {/* Logo Image or Icon */}
      <div className="flex items-center justify-center">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="rounded-lg"
            priority
          />
        ) : showIcon ? (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: '#5C2A72' }}>
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
        ) : null}
      </div>
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSize}`} style={{ color: '#5C2A72' }}>
            Done.
          </span>
          {!isCompact && (
            <span className="text-xs text-muted-foreground -mt-1 hidden sm:block">
              AI for UR health
            </span>
          )}
        </div>
      )}
    </div>
  );
}
