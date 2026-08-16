import React from "react";
import { prisma } from "@/lib/db/prisma";
import { EventGrid } from "@/components/events/EventGrid";
import { EventCardData } from "@/components/events/EventCard";
import { Search, Filter, Calendar } from "lucide-react";
import { EventStatus, Prisma } from "@prisma/client";

export const revalidate = 30;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    tag?: string;
    status?: string;
    year?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const categorySlug = params.category || "";
  const tagSlug = params.tag || "";
  const status = params.status as EventStatus | undefined;
  const year = params.year || "";

  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let tags: Array<{ id: string; name: string; slug: string }> = [];
  let events: EventCardData[] = [];

  try {
    categories = await prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    });

    tags = await prisma.eventTag.findMany({
      orderBy: { name: "asc" },
    });

    const whereClause: Prisma.EventWhereInput = {
      isVisible: true,
      ...(status && ["UPCOMING", "ONGOING", "PAST"].includes(status) ? { status } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(tagSlug ? { tags: { some: { slug: tagSlug } } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { shortDescription: { contains: search, mode: "insensitive" } },
              { venue: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    if (year && !isNaN(Number(year))) {
      whereClause.startDate = {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    let orderBy: Prisma.EventOrderByWithRelationInput = { startDate: "asc" };
    if (status === "PAST") {
      orderBy = { startDate: "desc" };
    } else if (status === "ONGOING") {
      orderBy = { startDate: "desc" };
    }

    const fetchedEvents = await prisma.event.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
      },
      orderBy,
    });

    events = fetchedEvents as unknown as EventCardData[];
  } catch (err) {
    console.warn("Failed fetching events in listing page:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          Official Schedule & Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
          Explore All Events
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Discover upcoming hackathons, AI workshops, technical seminars, and browse archives of completed competitions.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <form method="GET" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by event title, keywords, or campus venue..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={status || ""}
              className="w-full h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-charcoal focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="ONGOING">Ongoing Now</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="PAST">Completed (Past)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <select
              name="category"
              defaultValue={categorySlug}
              className="w-full h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-charcoal focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Topic / Tag
            </label>
            <select
              name="tag"
              defaultValue={tagSlug}
              className="w-full h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-charcoal focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.slug}>
                  #{t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action button */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="w-full h-9 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
            <a
              href="/events"
              className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
            >
              Reset
            </a>
          </div>
        </div>
      </form>

      {/* Grid Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Showing {events.length} results</span>
        </div>
        <EventGrid
          events={events}
          emptyTitle="No events match your criteria"
          emptyDescription="Try clearing filters or searching for another keyword."
        />
      </div>
    </div>
  );
}
