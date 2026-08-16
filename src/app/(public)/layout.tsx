import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });
  } catch {
    // Graceful fallback if database is not yet connected
  }

  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // Guest visitor
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        siteName={settings?.websiteName || "Team SCAI"}
        logoUrl={settings?.logoUrl}
        user={user ? { name: user.name, accountId: user.accountId, role: user.role } : null}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
