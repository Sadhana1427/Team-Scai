import React from "react";
import { prisma } from "@/lib/db/prisma";
import { WinnerCard, WinnerData } from "@/components/winners/WinnerCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Trophy } from "lucide-react";

export const revalidate = 60;

export default async function WinnersPage() {
  let winners: WinnerData[] = [];

  try {
    const fetched = await prisma.winner.findMany({
      include: {
        event: {
          select: { title: true, slug: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });
    winners = fetched as unknown as WinnerData[];
  } catch (err) {
    console.warn("Failed fetching winners:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Hall of Fame
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
          Champions & Award Winners
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Honoring the teams, builders, and researchers who excelled across Team SCAI competitions and technical symposiums.
        </p>
      </div>

      {winners.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No winners posted yet"
          description="Results and podium finishers from ongoing events will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {winners.map((w) => (
            <WinnerCard key={w.id} winner={w} />
          ))}
        </div>
      )}
    </div>
  );
}
