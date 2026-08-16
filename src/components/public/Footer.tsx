import React from "react";
import Link from "next/link";
import { Mail, MapPin, Instagram, Linkedin, Github, Twitter, Youtube } from "lucide-react";

export interface FooterProps {
  settings?: {
    websiteName?: string;
    orgName?: string;
    contactEmail?: string;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    twitterUrl?: string | null;
    youtubeUrl?: string | null;
    address?: string | null;
    aboutShort?: string | null;
    footerText?: string | null;
  } | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = settings?.websiteName || "Team SCAI";
  const orgName = settings?.orgName || "Student Community for AI & Innovation";
  const email = settings?.contactEmail || "scailpu@gmail.com";
  const about = settings?.aboutShort || "Empowering students through technology, hackathons, and creative innovation.";
  const address = settings?.address || "";
  const footerText = settings?.footerText || `© ${currentYear} ${siteName}. All rights reserved.`;

  return (
    <footer className="bg-white border-t border-slate-200 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                S
              </div>
              <span className="text-xl font-black tracking-tight text-brand-900">
                {siteName}
              </span>
            </Link>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {orgName}
            </p>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              {about}
            </p>
            {address ? (
              <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            ) : null}
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/events" className="hover:text-brand-700 transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand-700 transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:text-brand-700 transition-colors">
                  Hall of Fame
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-brand-700 transition-colors">
                  Organizing Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Organization */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Organization
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-brand-700 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-700 transition-colors">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-700 transition-colors">
                  Team Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Social Channels & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Connect With Us
            </h4>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-600" />
              <span>{email}</span>
            </a>

            <div className="flex items-center gap-3 pt-2">
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footerText}</p>
          <p className="flex items-center gap-1">
            Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
