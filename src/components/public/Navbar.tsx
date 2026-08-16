"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Calendar, Image as ImageIcon, Trophy, Users, Info, Mail, LogIn, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

interface NavbarProps {
  siteName?: string;
  logoUrl?: string | null;
  user?: {
    name: string;
    accountId: string;
    role: string;
  } | null;
}

export function Navbar({ siteName = "Team SCAI", logoUrl, user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", icon: Calendar },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Winners", href: "/winners", icon: Trophy },
    { name: "Team", href: "/team", icon: Users },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-brand-800 transition-colors">
              S
            </div>
            <div>
              <span className="text-lg md:text-xl font-black tracking-tight text-brand-900 block leading-tight">
                {siteName}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Events & Showcase
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-brand-700 bg-brand-50 font-semibold"
                      : "text-slate-600 hover:text-charcoal hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Portal / Login */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-brand-700 hover:bg-brand-800 gap-2">
                  <Shield className="w-4 h-4 text-indigo-200" />
                  <span>Dashboard ({user.accountId})</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Team Portal</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center sm:hidden gap-2">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="h-8 px-2.5 text-xs bg-brand-700">
                  <Shield className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                  <LogIn className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-charcoal rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-dropdown animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? "text-brand-700 bg-brand-50 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 mt-2">
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Team Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Team Portal Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
