import React from "react";
import { Card } from "../ui/Card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  color?: "brand" | "emerald" | "amber" | "slate";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "brand",
}: StatCardProps) {
  const colors = {
    brand: "bg-brand-50 text-brand-700 border-brand-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Card className="bg-white border-slate-200 shadow-subtle p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={cn("p-2.5 rounded-xl border", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          {value}
        </span>
        {description && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
        )}
        {trend && (
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">{trend}</p>
        )}
      </div>
    </Card>
  );
}
