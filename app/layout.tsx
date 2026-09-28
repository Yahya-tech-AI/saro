import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saro — by Aro",
  description: "Your personal AI.",
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