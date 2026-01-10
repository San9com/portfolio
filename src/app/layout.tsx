import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes, Reenie_Beanie } from "next/font/google";
import clsx from "clsx";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const sans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans-base",
});

const serif = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-serif-display",
});

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script-display",
});

const handwritten = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwritten",
});

const siteName = "designer";
const siteDescription =
  "Portfolio of Alexander Murashka, a UX/UI designer crafting immersive, user-centered digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL("https://murashka-portfolio.vercel.app"),
  title: siteName,
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
    locale: "en_US",
    url: "https://murashka-portfolio.vercel.app",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={clsx(sans.variable, serif.variable, script.variable, handwritten.variable, "antialiased")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
