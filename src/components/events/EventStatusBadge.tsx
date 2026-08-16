import React from "react";
import { Badge } from "../ui/Badge";

export type EventStatusType = "UPCOMING" | "ONGOING" | "PAST";

export function EventStatusBadge({ status }: { status: EventStatusType | string }) {
  switch (status) {
    case "ONGOING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          Ongoing Now
        </span>
      );
    case "UPCOMING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-300">
          Upcoming
        </span>
      );
    case "PAST":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
          Completed
        </span>
      );
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}
