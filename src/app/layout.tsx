import type { Metadata } from "next";
import "./globals.css";
import { GlobalApiLoader } from "@/components/ui/GlobalApiLoader";

export const metadata: Metadata = {
  title: "Team SCAI — Event Management & Showcase Portal",
  description:
    "Official event showcase and innovation platform for Team SCAI. Explore hackathons, workshops, winners, and collegiate technology events.",
  keywords: ["Team SCAI", "Hackathons", "AI Events", "Workshops", "Tech Community", "Student Showcase"],
  authors: [{ name: "Team SCAI" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3730A3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-charcoal antialiased">
        <GlobalApiLoader />
        {children}
      </body>
    </html>
  );
}
