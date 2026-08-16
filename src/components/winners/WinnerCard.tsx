import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/Card";
import { Trophy, Award } from "lucide-react";

export interface WinnerData {
  id: string;
  name: string;
  position: string;
  photoUrl?: string | null;
  description?: string | null;
  isFeatured?: boolean;
  event: {
    title: string;
    slug: string;
  };
}

export function WinnerCard({ winner }: { winner: WinnerData }) {
  const isFirst =
    winner.position.toLowerCase().includes("1st") ||
    winner.position.toLowerCase().includes("champion") ||
    winner.position.toLowerCase().includes("winner");

  return (
    <Card hoverEffect className="flex flex-col h-full bg-white border border-slate-200">
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {winner.photoUrl ? (
          <Image
            src={winner.photoUrl}
            alt={winner.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-brand-50 text-brand-700">
            <Trophy className="w-12 h-12 mb-1 opacity-80" />
            <span className="text-xs font-bold uppercase tracking-wider">Team SCAI Award</span>
          </div>
        )}

        {/* Position badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
              isFirst
                ? "bg-amber-400 text-amber-950 border border-amber-500"
                : "bg-white/90 text-charcoal border border-slate-300 backdrop-blur-sm"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{winner.position}</span>
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <Link
            href={`/events/${winner.event.slug}`}
            className="text-xs font-bold text-brand-700 hover:text-brand-900 uppercase tracking-wide line-clamp-1"
          >
            {winner.event.title}
          </Link>
          <h3 className="text-lg font-bold text-charcoal leading-snug">
            {winner.name}
          </h3>
          {winner.description && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {winner.description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Official SCAI Podium</span>
          <Link
            href={`/events/${winner.event.slug}`}
            className="font-semibold text-brand-700 hover:underline"
          >
            View Event →
          </Link>
        </div>
      </div>
    </Card>
  );
}
