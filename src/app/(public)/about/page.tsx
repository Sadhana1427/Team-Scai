import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Cpu, Terminal, Users, Award, ShieldCheck, Rocket, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
  let settings = null;
  try {
    settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  } catch {
    // fallback
  }

  const orgName = settings?.orgName || "Student Community for AI & Innovation";
  const aboutFull =
    settings?.aboutFull ||
    "Team SCAI is a premier student organization dedicated to fostering practical excellence in Artificial Intelligence, Software Engineering, Design, and Creative Computing. We organize flagship collegiate events, technical symposiums, research circles, and community outreach programs.";

  const pillars = [
    {
      title: "Hands-on Engineering",
      description: "Building production-ready software, AI agents, and embedded robotics rather than just theoretical exercises.",
      icon: Terminal,
    },
    {
      title: "Collegiate Hackathons",
      description: "Hosting 36-hour hackathons that draw top student engineers, designers, and mentors from across the nation.",
      icon: Cpu,
    },
    {
      title: "Community & Mentorship",
      description: "Pairing freshman and sophomore builders with experienced senior leads and industry alumni.",
      icon: Users,
    },
    {
      title: "Merit & Open Recognition",
      description: "Showcasing student talent, publishing winners openly, and offering transparent podium evaluations.",
      icon: Award,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            About Our Organization
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal tracking-tight leading-tight">
            {orgName}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-2">
            {aboutFull}
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href="/events">
              <Button size="md" className="gap-2">
                <span>View Event Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/team">
              <Button variant="outline" size="md">
                Meet Organizing Leads
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-square rounded-2xl overflow-hidden shadow-card border border-slate-200 bg-slate-100">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
            alt="Team SCAI Community"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Pillars of Innovation */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Our Core Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            What Drives Team SCAI
          </h2>
          <p className="text-sm text-slate-600">
            Guiding principles that define every workshop, symposium, and competition we host.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Card key={i} className="p-6 bg-white border-slate-200 text-left space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-charcoal">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Milestones / Impact */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-brand-400 block">
              2,500+
            </span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
              Hackathon Participants
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-brand-400 block">
              45+
            </span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
              Workshops & Bootcamps
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-brand-400 block">
              $50K+
            </span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
              Prizes Awarded
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-brand-400 block">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1 block">
              Student-Driven
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
