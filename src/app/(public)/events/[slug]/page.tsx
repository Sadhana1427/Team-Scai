import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EventShareButtons } from "@/components/events/EventShareButtons";
import { EventCountdown } from "@/components/events/EventCountdown";
import { WinnerCard } from "@/components/winners/WinnerCard";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Download,
  FileText,
  User,
  Image as ImageIcon,
  Trophy,
  ArrowLeft,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!event) return { title: "Event Not Found — Team SCAI" };

    return {
      title: `${event.title} — Team SCAI Events`,
      description: event.shortDescription,
      openGraph: {
        title: event.title,
        description: event.shortDescription,
        images: event.posterUrl ? [{ url: event.posterUrl }] : [],
      },
    };
  } catch {
    return { title: "Event Details — Team SCAI" };
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let event = null;
  try {
    event = await prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        eventLeader: {
          select: { name: true, email: true, accountId: true, avatarUrl: true },
        },
        documents: {
          include: { uploadedBy: { select: { name: true } } },
        },
        winners: {
          orderBy: { displayOrder: "asc" },
        },
        images: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (err) {
    console.warn("Failed fetching event detail:", err);
  }

  if (!event) {
    notFound();
  }

  const isRegistrationClosed =
    event.status === "PAST" ||
    (event.registrationDeadline && new Date(event.registrationDeadline).getTime() < Date.now());

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const eventUrl = `${appUrl}/events/${event.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Hero Poster & Core Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Poster */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-card border border-slate-200 bg-slate-100">
            {event.posterUrl ? (
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-lg">
                Team SCAI Official Event
              </div>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Share this Event:
            </span>
            <EventShareButtons title={event.title} url={eventUrl} />
          </div>
        </div>

        {/* Right: Key Details & Registration Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <EventStatusBadge status={event.status} />
              <Badge variant="brand">{event.category.name}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-charcoal leading-tight tracking-tight">
              {event.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {event.shortDescription}
            </p>
          </div>

          {/* Metadata Card */}
          <Card className="bg-slate-50/70 border-slate-200">
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Dates
                  </span>
                  <span className="font-semibold text-charcoal">
                    {formatDate(event.startDate)} — {formatDate(event.endDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Daily Schedule
                  </span>
                  <span className="font-semibold text-charcoal">
                    {event.startTime} to {event.endTime}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Venue
                  </span>
                  <span className="font-semibold text-charcoal">{event.venue}</span>
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Deadline:</span>
                  <EventCountdown targetDate={event.registrationDeadline} prefix="Closes in" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration CTA */}
          <div className="space-y-3">
            {isRegistrationClosed ? (
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-center">
                <span className="text-sm font-bold text-slate-600">
                  Registration Closed
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  The deadline for this event has passed.
                </p>
              </div>
            ) : event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button size="lg" className="w-full justify-center gap-2 text-base font-bold bg-brand-700 hover:bg-brand-800 shadow-md">
                  <span>Register Now (External Portal)</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            ) : (
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl text-center text-xs font-semibold text-brand-800">
                Open Entry / Walk-in at Venue
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Topics & Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((t: any) => (
                  <span
                    key={t.id}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Description & Documents Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-slate-200">
        {/* Left: Editorial Description */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-charcoal">About This Event</h2>
          <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {event.fullDescription}
          </div>
        </div>

        {/* Right: Documents & Coordinator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Documents Drawer */}
          <Card className="bg-white border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-700" />
              <h3 className="text-sm font-bold text-charcoal">Official Documents</h3>
            </div>
            <CardContent className="p-5 space-y-3">
              {event.documents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No downloadable documents uploaded for this event.
                </p>
              ) : (
                event.documents.map((doc: any) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-colors group"
                  >
                    <div className="overflow-hidden pr-2">
                      <span className="text-xs font-bold text-charcoal group-hover:text-brand-800 truncate block">
                        {doc.title}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {doc.docType} • {(doc.fileSize / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-brand-700 shrink-0" />
                  </a>
                ))
              )}
            </CardContent>
          </Card>

          {/* Event Coordinator */}
          {event.eventLeader && (
            <Card className="bg-white border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-50 border border-brand-200 relative shrink-0">
                  {event.eventLeader.avatarUrl ? (
                    <Image
                      src={event.eventLeader.avatarUrl}
                      alt={event.eventLeader.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-700">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Event Coordinator
                  </span>
                  <h4 className="text-sm font-bold text-charcoal">
                    {event.eventLeader.name}
                  </h4>
                  <a
                    href={`mailto:${event.eventLeader.email}`}
                    className="text-xs text-brand-700 hover:underline"
                  >
                    {event.eventLeader.email}
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Event Winners Section */}
      {event.winners.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
              Event Winners & Champions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.winners.map((w: any) => (
              <WinnerCard
                key={w.id}
                winner={{ ...w, event: { title: event.title, slug: event.slug } }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Event Photo Stream */}
      {event.images.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
              Photos from {event.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.images.map((img: any) => (
              <div
                key={img.id}
                className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-subtle"
              >
                <Image
                  src={img.thumbnailUrl || img.url}
                  alt={img.title || event.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
