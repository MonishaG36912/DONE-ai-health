"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  format, 
  addDays, 
  isSameDay, 
  isWithinInterval, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval 
} from "date-fns";
import { CalendarDays, Droplets, Heart } from "lucide-react";
import { DUMMY_USER_ID } from "@/lib/constants";
import { calculatePeriodStats } from "@/lib/utils/period-calculations";

export function PeriodCalendar() {
  const [periodEntries, setPeriodEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch period data
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

  // Calculate all period dates and predictions, but only use the latest entry for predictions
  const calculatePeriodDates = () => {
    const periodDates = new Set();
    const ovulationDates = new Set();
    const fertileDates = new Set();
    const predictedDates = new Set();

    if (!periodEntries || periodEntries.length === 0) {
      return { periodDates, ovulationDates, fertileDates, predictedDates };
    }

    // Sort entries by lastPeriodDate descending (latest first)
    const sortedEntries = [...periodEntries].sort((a, b) => new Date(b.lastPeriodDate) - new Date(a.lastPeriodDate));

    // Add actual period days for all entries
    periodEntries.forEach((entry) => {
      const startDate = new Date(entry.lastPeriodDate);
      for (let i = 0; i < entry.periodDuration; i++) {
        const periodDay = addDays(startDate, i);
        periodDates.add(format(periodDay, 'yyyy-MM-dd'));
      }
    });

    // Use only the latest entry for predictions
    const latestEntry = sortedEntries[0];
    if (latestEntry) {
      const stats = calculatePeriodStats(latestEntry);
      // Add predicted next period
      for (let i = 0; i < latestEntry.periodDuration; i++) {
        const predictedDay = addDays(stats.nextPeriodPrediction, i);
        predictedDates.add(format(predictedDay, 'yyyy-MM-dd'));
      }
      // Add ovulation date
      ovulationDates.add(format(stats.ovulationPrediction, 'yyyy-MM-dd'));
      // Add fertile window
      const fertileStart = stats.fertility.start;
      const fertileEnd = stats.fertility.end;
      eachDayOfInterval({ start: fertileStart, end: fertileEnd }).forEach(day => {
        fertileDates.add(format(day, 'yyyy-MM-dd'));
      });
    }

    return { periodDates, ovulationDates, fertileDates, predictedDates };
  };

  const { periodDates, ovulationDates, fertileDates, predictedDates } = calculatePeriodDates();

  // Custom day renderer for the calendar
  const renderDay = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isPeriodDay = periodDates.has(dateStr);
    const isPredictedPeriod = predictedDates.has(dateStr);
    const isOvulationDay = ovulationDates.has(dateStr);
    const isFertileDay = fertileDates.has(dateStr);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={`
          relative z-10 text-sm font-medium
          ${isPeriodDay ? 'text-white' : ''}
          ${isPredictedPeriod ? 'text-red-700' : ''}
          ${isOvulationDay && !isPeriodDay ? 'text-white' : ''}
          ${isFertileDay && !isPeriodDay && !isOvulationDay ? 'text-purple-700' : ''}
        `}>
          {format(day, 'd')}
        </span>
        
        {/* Period day background */}
        {isPeriodDay && (
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-90 flex items-center justify-center">
            <Droplets className="w-3 h-3 text-white opacity-60" />
          </div>
        )}
        
        {/* Predicted period background */}
        {isPredictedPeriod && !isPeriodDay && (
          <div className="absolute inset-0 bg-red-200 rounded-full border-2 border-red-400 border-dashed" />
        )}
        
        {/* Ovulation day background */}
        {isOvulationDay && !isPeriodDay && (
          <div className="absolute inset-0 bg-pink-500 rounded-full opacity-90 flex items-center justify-center">
            <Heart className="w-3 h-3 text-white opacity-60" />
          </div>
        )}
        
        {/* Fertile window background */}
        {isFertileDay && !isPeriodDay && !isOvulationDay && (
          <div className="absolute inset-0 bg-purple-200 rounded-full opacity-70" />
        )}
      </div>
    );
  };

  // Get info for selected date
  const getSelectedDateInfo = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const info = [];

    if (periodDates.has(dateStr)) {
      info.push({ type: 'period', label: 'Period Day', color: 'bg-red-500' });
    }
    if (predictedDates.has(dateStr)) {
      info.push({ type: 'predicted', label: 'Predicted Period', color: 'bg-red-400' });
    }
    if (ovulationDates.has(dateStr)) {
      info.push({ type: 'ovulation', label: 'Ovulation Day', color: 'bg-pink-500' });
    }
    if (fertileDates.has(dateStr)) {
      info.push({ type: 'fertile', label: 'Fertile Window', color: 'bg-purple-400' });
    }

    return info;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Period Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Period Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                components={{
                  Day: ({ date, ...props }) => (
                    <div 
                      {...props}
                      className="relative p-0 w-9 h-9 cursor-pointer hover:bg-accent rounded-md flex items-center justify-center"
                    >
                      {renderDay(date)}
                    </div>
                  )
                }}
                className="rounded-md border w-full"
              />
              
              {/* Legend */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Legend:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <Droplets className="w-2 h-2 text-white" />
                    </div>
                    <span>Period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 border-2 border-red-400 border-dashed rounded-full"></div>
                    <span>Predicted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="w-2 h-2 text-white" />
                    </div>
                    <span>Ovulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-200 rounded-full"></div>
                    <span>Fertile</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Date Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {getSelectedDateInfo().length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {getSelectedDateInfo().map((info, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className={`${info.color} text-white`}
                      >
                        {info.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2">No cycle events on this date</p>
                )}
              </div>

              {/* Quick Stats: Show all period entries, latest first */}
              {periodEntries.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Period Info (Latest on Top)</h4>
                  {[...periodEntries]
                    .sort((a, b) => new Date(b.lastPeriodDate) - new Date(a.lastPeriodDate))
                    .map((entry, idx) => {
                      const stats = calculatePeriodStats(entry);
                      return (
                        <div key={entry.lastPeriodDate + '-' + idx} className="space-y-2 text-sm border-b pb-2 last:border-b-0 last:pb-0">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Period:</span>
                            <span>{format(new Date(entry.lastPeriodDate), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cycle Length:</span>
                            <span>{entry.cycleLength} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Period Duration:</span>
                            <span>{entry.periodDuration} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Next Period:</span>
                            <span>{format(stats.nextPeriodPrediction, 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
