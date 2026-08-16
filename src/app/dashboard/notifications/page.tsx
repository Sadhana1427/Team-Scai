import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { Bell, CheckCheck, Calendar, Image as ImageIcon, Shield, Info } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function DashboardNotificationsPage() {
  const user = await requireAuth();

  let notifications: any[] = [];
  try {
    notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetUserId: user.id },
          { targetUserId: null, targetRole: null },
          { targetRole: user.role },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (err) {
    console.warn("Failed fetching notifications:", err);
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "EVENT":
        return Calendar;
      case "MEDIA":
        return ImageIcon;
      case "USER":
        return Shield;
      default:
        return Info;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-700" />
            <h2 className="text-xl font-bold text-charcoal">Internal Team Notifications</h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time activity alerts on event changes, photo uploads, and team assignments
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications at this time.
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <div
                key={n.id}
                className={`p-4 sm:p-5 flex items-start gap-3.5 transition-colors ${
                  !n.isRead ? "bg-brand-50/40" : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    !n.isRead
                      ? "bg-brand-100 text-brand-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-charcoal">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      className="inline-block text-xs font-semibold text-brand-700 hover:underline pt-1"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
