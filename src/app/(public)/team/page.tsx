import React from "react";
import { prisma } from "@/lib/db/prisma";
import { TeamMemberCard, TeamMemberData } from "@/components/team/TeamMemberCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

export const revalidate = 60;

export default async function TeamPage() {
  let categories: any[] = [];
  let members: TeamMemberData[] = [];

  try {
    categories = await prisma.teamCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        members: {
          where: { isActive: true },
          include: { category: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    const fetchedMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
    });
    members = fetchedMembers as unknown as TeamMemberData[];
  } catch (err) {
    console.warn("Failed fetching team data:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          Our People
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
          The Organizing Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Meet the dedicated students, faculty advisors, technical leads, and coordinators driving innovation at Team SCAI.
        </p>
      </div>

      {categories.length > 0 && categories.some((c) => c.members.length > 0) ? (
        categories
          .filter((cat) => cat.members.length > 0)
          .map((cat) => (
            <div key={cat.id} className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
                  {cat.name}
                </h2>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cat.members.map((m: any) => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          ))
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <TeamMemberCard key={m.id} member={m} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Team directory is updating"
          description="The active committee for this semester will be published shortly."
        />
      )}
    </div>
  );
}
