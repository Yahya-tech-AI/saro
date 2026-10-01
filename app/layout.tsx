import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saro — by Aro",
  description:
    "Saro — the all-in-one AI workspace for chat, coding, building, research, agents, automation, and more.",
  icons: {
    icon: "/brand/saro-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
