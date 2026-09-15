import type { Metadata, Viewport } from "next";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CODEXA — Open-Source Education Hub",
  description:
    "One platform for semester-wise study material, coding practice, AI-assisted learning, and open-source project contribution for IT/CSE students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-[#E1E0CC]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
