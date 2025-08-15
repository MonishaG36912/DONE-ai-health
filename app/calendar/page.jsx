"use client";

import { PeriodCalendar } from "@/components/period-calendar";

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Period Calendar</h1>
        <p className="text-muted-foreground mt-2">
          Visualize your menstrual cycle, fertile windows, and predictions
        </p>
      </div>
      
      <PeriodCalendar />
    </div>
  );
}
