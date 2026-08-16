import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { EventGrid } from "@/components/events/EventGrid";
import { WinnerCard } from "@/components/winners/WinnerCard";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, Trophy, Users, Image as ImageIcon, Mail } from "lucide-react";
import Image from "next/image";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  // Fetch real data with graceful fallbacks
  let slides: Array<{
    id: string;
    heading: string;
    description: string;
    imageUrl: string;
    ctaText?: string | null;
    ctaLink?: string | null;
  }> = [];

  let ongoingEvents: any[] = [];
  let upcomingEvents: any[] = [];
  let pastEvents: any[] = [];
  let galleryPreview: any[] = [];
  let winnersPreview: any[] = [];
  let teamPreview: any[] = [];

  try {
    // 1. Carousel Slides
    slides = await prisma.carouselItem.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    // 2. Ongoing Events
    ongoingEvents = await prisma.event.findMany({
      where: { status: "ONGOING", isVisible: true },
      include: { category: true },
      orderBy: { startDate: "desc" },
    });

    // 3. Upcoming Events
    upcomingEvents = await prisma.event.findMany({
      where: { status: "UPCOMING", isVisible: true },
      include: { category: true },
      orderBy: { startDate: "asc" },
      take: 6,
    });

    // 4. Past Events
    pastEvents = await prisma.event.findMany({
      where: { status: "PAST", isVisible: true },
      include: { category: true },
      orderBy: { startDate: "desc" },
      take: 3,
    });

    // 5. Gallery Preview
    galleryPreview = await prisma.galleryImage.findMany({
      where: { isFeatured: true },
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    // 6. Winners Preview
    winnersPreview = await prisma.winner.findMany({
      where: { isFeatured: true },
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    // 7. Team Preview
    teamPreview = await prisma.teamMember.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
      take: 4,
    });
  } catch (err) {
    console.warn("Database query in HomePage had fallback:", err);
  }

  // Fallback slides if database empty
  if (slides.length === 0) {
    slides = [
      {
        id: "default-1",
        heading: "Innovate. Build. Accelerate.",
        description: "Join Team SCAI for national hackathons, generative AI masterclasses, and hands-on developer symposiums.",
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600&auto=format&fit=crop&q=80",
        ctaText: "Explore Upcoming Events",
        ctaLink: "/events",
      },
    ];
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Carousel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <HeroCarousel slides={slides} />
      </section>

      {/* 2. Ongoing Events (Top Priority) */}
      {ongoingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                    Happening Right Now
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    Live competitions and active sessions currently underway
                  </p>
                </div>
              </div>
              <Link href="/events?status=ONGOING">
                <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-900 bg-white hover:bg-emerald-100/50 text-xs">
                  View Live Stream / Details
                </Button>
              </Link>
            </div>
            <EventGrid events={ongoingEvents} />
          </div>
        </section>
      )}

      {/* 3. Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Calendar of Activities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Upcoming Events & Hackathons
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Mark your schedule and reserve seats before registration closes
            </p>
          </div>
          <Link href="/events?status=UPCOMING">
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <span>View All Upcoming</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <EventGrid
          events={upcomingEvents}
          emptyTitle="No upcoming events scheduled"
          emptyDescription="We are curating new hackathons and workshops. Check back soon!"
        />
      </section>

      {/* 4. Past Events Spotlight */}
      {pastEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                Archive & Records
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                Recent Past Events
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Browse results, winning project showcases, and event galleries
              </p>
            </div>
            <Link href="/events?status=PAST">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <span>Browse Event Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <EventGrid events={pastEvents} />
        </section>
      )}

      {/* 5. Gallery Showcase */}
      {galleryPreview.length > 0 && (
        <section className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Visual Moments
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                  Life at Team SCAI
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Snapshots from our hackathons, speaker series, and award ceremonies
                </p>
              </div>
              <Link href="/gallery">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <span>Explore Full Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {galleryPreview.map((item) => (
                <Link
                  key={item.id}
                  href="/gallery"
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all"
                >
                  <Image
                    src={item.thumbnailUrl || item.url}
                    alt={item.title || "Gallery thumbnail"}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-[11px] font-semibold text-white truncate">
                      {item.title || item.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Winners Showcase */}
      {winnersPreview.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                Hall of Fame
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                Featured Champions & Winners
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Celebrating outstanding innovation, code excellence, and podium finishers
              </p>
            </div>
            <Link href="/winners">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <span>View All Winners</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {winnersPreview.map((w) => (
              <WinnerCard key={w.id} winner={w} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Organizing Team Preview */}
      {teamPreview.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
                <Users className="w-3.5 h-3.5" />
                Leadership & Coordinators
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                Meet the Organizing Team
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                The minds driving operations, mentorship, and event execution
              </p>
            </div>
            <Link href="/team">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <span>Full Team Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamPreview.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Contact & Collaboration CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 text-white rounded-2xl p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-800 text-brand-200 rounded-full text-xs font-bold uppercase tracking-wider">
              Get Involved
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Want to partner or organize an event with us?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We collaborate with universities, technology companies, and student organizations to run premier hackathons, technical conferences, and student symposiums.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-brand-900 hover:bg-slate-100 font-bold gap-2">
                <Mail className="w-4 h-4 text-brand-700" />
                <span>Contact Team SCAI</span>
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
