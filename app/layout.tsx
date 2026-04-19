import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "6:10 Assistant | Ridgeway Site Intelligence",
  description: "AI-powered overnight security analysis platform",
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