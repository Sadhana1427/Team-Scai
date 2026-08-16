import React from "react";
import { EventCard, EventCardData } from "./EventCard";
import { EmptyState } from "../ui/EmptyState";
import { Calendar } from "lucide-react";

export function EventGrid({
  events,
  emptyTitle = "No events found",
  emptyDescription = "There are currently no events matching your criteria.",
}: {
  events: EventCardData[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
