import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
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

const siteName = "Alexander Murashka — UI/UX Designer";
const siteDescription =
  "Portfolio of Alexander Murashka, a UI/UX designer crafting immersive, user-centered digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL("https://murashka-portfolio.vercel.app"),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={clsx(sans.variable, serif.variable, script.variable, "antialiased")}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
