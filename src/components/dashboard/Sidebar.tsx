"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  Trophy,
  Users,
  Sliders,
  UserCheck,
  ClipboardList,
  Settings,
  Bell,
  ExternalLink,
  X,
} from "lucide-react";
import { Role } from "@/lib/permissions/rbac";

export interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isLeaderOrAdmin = role === "SUPER_ADMIN" || role === "EVENT_LEADER";

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, show: true },
    { name: "Events", href: "/dashboard/events", icon: Calendar, show: true },
    { name: "Gallery Media", href: "/dashboard/gallery", icon: ImageIcon, show: true },
    { name: "Winners", href: "/dashboard/winners", icon: Trophy, show: true },
    { name: "Organizing Team", href: "/dashboard/team", icon: Users, show: isLeaderOrAdmin },
    { name: "Hero Carousel", href: "/dashboard/carousel", icon: Sliders, show: isLeaderOrAdmin },
    { name: "User Accounts", href: "/dashboard/users", icon: UserCheck, show: isSuperAdmin },
    { name: "Audit Trail", href: "/dashboard/audit", icon: ClipboardList, show: isSuperAdmin },
    { name: "Site Settings", href: "/dashboard/settings", icon: Settings, show: isLeaderOrAdmin },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell, show: true },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                S
              </div>
              <div>
                <span className="font-extrabold text-charcoal tracking-tight text-base block leading-tight">
                  Team SCAI
                </span>
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                  Management
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-charcoal rounded-lg hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Main Menu
            </p>
            {navigation
              .filter((item) => item.show)
              .map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-800 font-semibold border-l-4 border-brand-700"
                        : "text-slate-600 hover:text-charcoal hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-brand-700" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Footer / Public Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-700 hover:bg-white border border-slate-200 transition-colors"
          >
            <span>Live Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
