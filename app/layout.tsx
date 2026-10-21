
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://saro-navy.vercel.app"),

  title: {
    default: "Saro — by Aro",
    template: "%s | Saro",
  },

  description:
    "Saro — the all-in-one AI workspace for chat, coding, building, research, agents, automation, and more.",

  applicationName: "Saro",
  icons: {
    icon: "/brand/saro-icon.svg",
    shortcut: "/brand/saro-icon.svg",
    apple: "/brand/saro-icon.svg",
  },

  openGraph: {
    title: "Saro — by Aro",
    description:
      "One AI. Every mode. Fully yours.",
    siteName: "Saro",
    type: "website",
    url: "https://saro-navy.vercel.app",
  },

  twitter: {
    card: "summary_large_image",
    title: "Saro — by Aro",
    description: "One AI. Every mode. Fully yours.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0614",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}