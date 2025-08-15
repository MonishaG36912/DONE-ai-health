"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { CalendarDays, Droplets, Heart, ArrowRight } from "lucide-react";
import { DUMMY_USER_ID } from "@/lib/constants";
import { calculatePeriodStats } from "@/lib/utils/period-calculations";
import Link from "next/link";

export function MiniPeriodCalendar() {
  const [periodEntries, setPeriodEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const response = await fetch("/api/period", {
          headers: {
            "X-User-Id": DUMMY_USER_ID,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.entries) {
            setPeriodEntries(data.entries);
          }
        }
      } catch (error) {
        console.error("Error fetching period data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, []);

  const calculatePeriodDates = () => {
    const periodDates = new Set();
    const ovulationDates = new Set();
    const predictedDates = new Set();

    periodEntries.slice(0, 1).forEach((entry) => { // Only show latest entry for mini view
      const startDate = new Date(entry.lastPeriodDate);
      const stats = calculatePeriodStats(entry);

      // Add actual period days
      for (let i = 0; i < entry.periodDuration; i++) {
        const periodDay = addDays(startDate, i);
        periodDates.add(format(periodDay, 'yyyy-MM-dd'));
      }

      // Add predicted next period
      for (let i = 0; i < entry.periodDuration; i++) {
        const predictedDay = addDays(stats.nextPeriodPrediction, i);
        predictedDates.add(format(predictedDay, 'yyyy-MM-dd'));
      }

      // Add ovulation date
      ovulationDates.add(format(stats.ovulationPrediction, 'yyyy-MM-dd'));
    });

    return { periodDates, ovulationDates, predictedDates };
  };

  const { periodDates, ovulationDates, predictedDates } = calculatePeriodDates();

  const renderDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isPeriodDay = periodDates.has(dateStr);
    const isPredictedPeriod = predictedDates.has(dateStr);
    const isOvulationDay = ovulationDates.has(dateStr);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={`
          relative z-10 text-xs
          ${isPeriodDay ? 'text-white font-medium' : ''}
          ${isPredictedPeriod ? 'text-red-700 font-medium' : ''}
          ${isOvulationDay && !isPeriodDay ? 'text-white font-medium' : ''}
        `}>
          {format(day, 'd')}
        </span>
        
        {isPeriodDay && (
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-90 flex items-center justify-center">
            <Droplets className="w-2 h-2 text-white opacity-60" />
          </div>
        )}
        
        {isPredictedPeriod && !isPeriodDay && (
          <div className="absolute inset-0 bg-red-200 rounded-full border border-red-400 border-dashed" />
        )}
        
        {isOvulationDay && !isPeriodDay && (
          <div className="absolute inset-0 bg-pink-500 rounded-full opacity-90 flex items-center justify-center">
            <Heart className="w-2 h-2 text-white opacity-60" />
          </div>
        )}
      </div>
    );
  };

  if (loading || periodEntries.length === 0) {
    return null; // Don't show mini calendar if no data
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="w-4 h-4" />
            Quick Calendar
          </CardTitle>
          <Link href="/calendar">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              View Full
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={new Date()}
            components={{
              Day: ({ date, ...props }) => (
                <div 
                  {...props}
                  className="relative p-0 w-8 h-8 flex items-center justify-center"
                >
                  {renderDay(date)}
                </div>
              )
            }}
            className="rounded-md border-0 w-full"
            classNames={{
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
              row: "flex w-full mt-2",
              cell: "text-center text-sm relative p-0 focus-within:relative focus-within:z-20 flex-1",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs",
            }}
          />
          
          {/* Mini Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Period</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 border border-red-400 border-dashed rounded-full"></div>
              <span>Predicted</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span>Ovulation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
