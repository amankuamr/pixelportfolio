import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import CustomCursor from "@/components/CustomCursor";
import AccentInitializer from "@/components/AccentInitializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const agern = localFont({
  src: "../../public/fonts/agern/Agern-Regular.ttf",
  variable: "--font-agern",
  fallback: ["system-ui", "sans-serif"],
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Portfolio - Windows Desktop",
  description: "My portfolio in Windows desktop style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${agern.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-transparent">
        <AccentInitializer />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
