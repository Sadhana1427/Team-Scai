import React from "react";
import { prisma } from "@/lib/db/prisma";
import { ContactForm } from "@/components/public/ContactForm";
import { Mail, MapPin, Phone, Instagram, Linkedin, Github, Twitter, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export const revalidate = 60;

export default async function ContactPage() {
  let settings = null;
  try {
    settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  } catch {
    // fallback
  }

  const email = settings?.contactEmail || "scailpu@gmail.com";
  const phone = settings?.contactPhone || "";
  const address = settings?.address || "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
          Contact Team SCAI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Have questions about participating in hackathons, sponsoring an upcoming event, or joining our organizing team? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border-slate-200">
            <CardContent className="space-y-6 p-6">
              <h3 className="text-base font-bold text-charcoal border-b border-slate-100 pb-3">
                Official Directory
              </h3>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-brand-50 text-brand-700 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-semibold text-charcoal hover:text-brand-700 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Phone (Only if present) */}
              {phone ? (
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-brand-50 text-brand-700 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Phone / Helpline
                    </span>
                    <span className="text-sm font-semibold text-charcoal">{phone}</span>
                  </div>
                </div>
              ) : null}

              {/* Address (Only if present) */}
              {address ? (
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-brand-50 text-brand-700 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-charcoal">{address}</span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Social Channels */}
          <Card className="bg-white border-slate-200 p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Official Social Profiles
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-charcoal hover:text-brand-700 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-charcoal hover:text-brand-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn</span>
                </a>
              )}
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-charcoal hover:text-brand-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-brand-50 border border-slate-200 text-xs font-semibold text-charcoal hover:text-brand-700 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-sky-500" />
                  <span>Twitter / X</span>
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-charcoal">Send Us a Direct Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
