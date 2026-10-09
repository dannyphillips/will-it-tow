import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegister from "./sw-register";
import {
  PWA_DESCRIPTION,
  PWA_NAME,
  PWA_THEME_COLOR,
  PWA_THEME_COLOR_DARK,
} from "../lib/pwa-theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: PWA_NAME,
  description: PWA_DESCRIPTION,
  applicationName: PWA_NAME,
  appleWebApp: {
    capable: true,
    title: PWA_NAME,
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PWA_THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: PWA_THEME_COLOR_DARK },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
