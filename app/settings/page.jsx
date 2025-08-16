"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const colorThemes = [
  { label: "Light", value: "light" },
  { label: "Pink", value: "light-pink" },
  { label: "Purple", value: "light-plum" },
  { label: "Cherry", value: "light-cherry" },
  { label: "Brown", value: "light-brown" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "James Aurther", phone: "1234567890", email: "james@email.com" });
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to "light"
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTheme") || "light";
    }
    return "light";
  });

  // Map theme value to background color (HSL format for Tailwind compatibility)
  const themeBgMap = {
    "light": "0 0% 100%", // white
    "light-pink": "351 100% 96%", // light pink
    "light-plum": "300 100% 96%", // light purple
    "light-cherry": "0 100% 96%", // light red
    "light-brown": "30 100% 95%", // light brown
  };

  // Update background color site-wide when theme changes
  React.useEffect(() => {
    const bg = themeBgMap[theme] || "0 0% 100%";
    document.documentElement.style.setProperty("--background", bg);
    // Also update body background directly for immediate visual feedback
    document.body.style.backgroundColor = `hsl(${bg})`;
    // Save theme to localStorage
    localStorage.setItem("selectedTheme", theme);
  }, [theme]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and color theme</p>
      </div>
      <div className="max-w-xl mx-auto space-y-8">
        <div className="rounded-xl border bg-card p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                autoComplete="name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <Button type="button" className="w-full mt-4">Save Profile</Button>
          </form>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Color Theme</h2>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a color theme" />
            </SelectTrigger>
            <SelectContent>
              {colorThemes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
