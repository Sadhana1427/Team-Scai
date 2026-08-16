import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EventStatusBadge, EventStatusType } from "./EventStatusBadge";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EventCountdown } from "./EventCountdown";

export interface EventCardData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  posterUrl?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  startTime: string;
  endTime: string;
  venue: string;
  status: EventStatusType;
  category: {
    name: string;
    slug: string;
  };
  registrationDeadline?: string | Date | null;
}

export function EventCard({ event }: { event: EventCardData }) {
  const isOngoing = event.status === "ONGOING";
  const isUpcoming = event.status === "UPCOMING";

  return (
    <Card hoverEffect className="flex flex-col h-full group bg-white border border-slate-200">
      {/* Poster Media */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-medium text-sm">
            Team SCAI Event
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <EventStatusBadge status={event.status} />
          <Badge variant="neutral">{event.category.name}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              {formatDate(event.startDate)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </span>
          </div>

          <Link href={`/events/${event.slug}`} className="block group-hover:text-brand-700 transition-colors">
            <h3 className="text-lg font-bold text-charcoal leading-snug line-clamp-2">
              {event.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          {isUpcoming && event.registrationDeadline ? (
            <EventCountdown targetDate={event.registrationDeadline} prefix="Reg. closes" />
          ) : isOngoing ? (
            <span className="text-xs font-semibold text-emerald-700">In Progress</span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Completed</span>
          )}

          <Link href={`/events/${event.slug}`}>
            <Button variant="outline" size="sm" className="group-hover:border-brand-300 group-hover:bg-brand-50 group-hover:text-brand-800 text-xs gap-1">
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
