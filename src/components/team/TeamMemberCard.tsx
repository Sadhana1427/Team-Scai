import React from "react";
import Image from "next/image";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Mail, Linkedin, Github, Twitter, User } from "lucide-react";

export interface TeamMemberData {
  id: string;
  name: string;
  photoUrl?: string | null;
  designation: string;
  description?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

export function TeamMemberCard({ member }: { member: TeamMemberData }) {
  return (
    <Card hoverEffect className="flex flex-col h-full bg-white border border-slate-200 text-center p-6 items-center">
      {/* Avatar */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-brand-200 shadow-sm bg-slate-100">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-700">
            <User className="w-12 h-12 opacity-60" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5 w-full flex-1 flex flex-col items-center">
        <Badge variant="neutral" size="sm" className="mb-1">
          {member.category.name}
        </Badge>
        <h3 className="text-base font-bold text-charcoal">{member.name}</h3>
        <p className="text-xs font-semibold text-brand-700">{member.designation}</p>
        {member.description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
            {member.description}
          </p>
        )}
      </div>

      {/* Social Icons */}
      <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-slate-100 w-full">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {member.githubUrl && (
          <a
            href={member.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on GitHub`}
            className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
        {member.twitterUrl && (
          <a
            href={member.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on Twitter`}
            className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        )}
      </div>
    </Card>
  );
}
