"use client";

import React, { useEffect, useState } from "react";
import { calculateCountdown } from "@/lib/utils";
import { Clock } from "lucide-react";

export function EventCountdown({
  targetDate,
  prefix = "Starts in",
}: {
  targetDate: string | Date;
  prefix?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isPast: boolean;
    formatted: string;
  } | null>(null);

  useEffect(() => {
    setTimeLeft(calculateCountdown(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown(targetDate));
    }, 60000); // refresh every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft || timeLeft.isPast) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold">
      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span>
        {prefix}: <strong className="text-amber-950 font-bold">{timeLeft.formatted}</strong>
      </span>
    </div>
  );
}
