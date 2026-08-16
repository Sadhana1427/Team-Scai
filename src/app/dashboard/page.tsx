import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Calendar,
  Image as ImageIcon,
  Trophy,
  Users,
  Plus,
  Upload,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const revalidate = 0; // Dynamic

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Fetch counts safely
  let totalEvents = 0;
  let ongoingEvents = 0;
  let upcomingEvents = 0;
  let pastEvents = 0;
  let galleryCount = 0;
  let winnerCount = 0;
  let teamCount = 0;
  let userCount = 0;
  let recentEvents: any[] = [];
  let recentLogs: any[] = [];

  try {
    const [
      eventsAll,
      eventsOngoing,
      eventsUpcoming,
      eventsPast,
      galleryTotal,
      winnerTotal,
      teamTotal,
      userTotal,
      recentEvts,
      recentLgs,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: "ONGOING" } }),
      prisma.event.count({ where: { status: "UPCOMING" } }),
      prisma.event.count({ where: { status: "PAST" } }),
      prisma.galleryImage.count(),
      prisma.winner.count(),
      prisma.teamMember.count(),
      prisma.user.count(),
      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      isSuperAdmin
        ? prisma.auditLog.findMany({
            take: 6,
            orderBy: { createdAt: "desc" },
            include: { user: true },
          })
        : [],
    ]);

    totalEvents = eventsAll;
    ongoingEvents = eventsOngoing;
    upcomingEvents = eventsUpcoming;
    pastEvents = eventsPast;
    galleryCount = galleryTotal;
    winnerCount = winnerTotal;
    teamCount = teamTotal;
    userCount = userTotal;
    recentEvents = recentEvts;
    recentLogs = recentLgs;
  } catch (err) {
    console.warn("Failed fetching dashboard metrics:", err);
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Control Center
          </span>
          <h1 className="text-2xl font-black text-charcoal tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Role: <strong className="text-charcoal">{user?.role}</strong> • Account: <strong className="text-charcoal">{user?.accountId}</strong>
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/events">
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Button>
          </Link>

          <Link href="/dashboard/gallery">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </Button>
          </Link>

          {isSuperAdmin && (
            <Link href="/dashboard/users">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={Calendar}
          description={`${ongoingEvents} live • ${upcomingEvents} upcoming`}
          color="brand"
        />
        <StatCard
          title="Live Events"
          value={ongoingEvents}
          icon={CheckCircle2}
          description="Active sessions right now"
          color="emerald"
        />
        <StatCard
          title="Gallery Media"
          value={galleryCount}
          icon={ImageIcon}
          description="Photos in media library"
          color="slate"
        />
        <StatCard
          title="Hall of Fame"
          value={winnerCount}
          icon={Trophy}
          description="Winners & podium entries"
          color="amber"
        />
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Team Members"
            value={teamCount}
            icon={Users}
            description="Active committee members"
            color="slate"
          />
          <StatCard
            title="Team Accounts"
            value={userCount}
            icon={Users}
            description="Authorized management accounts"
            color="brand"
          />
          <StatCard
            title="Upcoming Events"
            value={upcomingEvents}
            icon={Clock}
            description="Scheduled on calendar"
            color="amber"
          />
          <StatCard
            title="Completed Events"
            value={pastEvents}
            icon={CheckCircle2}
            description="Archived records"
            color="emerald"
          />
        </div>
      )}

      {/* Two-Column Activity & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Recent Events List */}
        <div className="lg:col-span-7">
          <Card className="bg-white border-slate-200">
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Events</CardTitle>
              <Link href="/dashboard/events" className="text-xs font-bold text-brand-700 hover:underline">
                Manage All →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentEvents.length === 0 ? (
                  <p className="p-6 text-xs text-slate-400 text-center">
                    No events created yet.
                  </p>
                ) : (
                  recentEvents.map((evt) => (
                    <div key={evt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5 max-w-sm">
                        <Link
                          href={`/events/${evt.slug}`}
                          target="_blank"
                          className="text-sm font-bold text-charcoal hover:text-brand-700 truncate block"
                        >
                          {evt.title}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {evt.category.name} • {formatDate(evt.startDate)}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          evt.status === "ONGOING"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : evt.status === "UPCOMING"
                            ? "bg-brand-50 text-brand-700 border-brand-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log / Staff Activity Feed */}
        <div className="lg:col-span-5">
          <Card className="bg-white border-slate-200">
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-base">
                {isSuperAdmin ? "Recent Audit Trail" : "Quick Navigation"}
              </CardTitle>
              {isSuperAdmin && (
                <Link href="/dashboard/audit" className="text-xs font-bold text-brand-700 hover:underline">
                  Full Logs →
                </Link>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {isSuperAdmin ? (
                <div className="divide-y divide-slate-100">
                  {recentLogs.length === 0 ? (
                    <p className="p-6 text-xs text-slate-400 text-center">
                      No audit activity logged yet.
                    </p>
                  ) : (
                    recentLogs.map((log) => (
                      <div key={log.id} className="p-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-charcoal truncate">
                            {log.user ? log.user.name : "System"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">
                          {log.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  <Link href="/dashboard/events" className="block p-3 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 transition-colors">
                    <span className="text-xs font-bold text-charcoal block">Manage Events</span>
                    <span className="text-[11px] text-slate-500">Edit schedules, venues, and registration URLs</span>
                  </Link>
                  <Link href="/dashboard/gallery" className="block p-3 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 transition-colors">
                    <span className="text-xs font-bold text-charcoal block">Media Library</span>
                    <span className="text-[11px] text-slate-500">Upload and assign event photos</span>
                  </Link>
                  <Link href="/dashboard/winners" className="block p-3 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 transition-colors">
                    <span className="text-xs font-bold text-charcoal block">Winner Records</span>
                    <span className="text-[11px] text-slate-500">Add competition podium winners</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
