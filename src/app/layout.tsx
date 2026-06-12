import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = "https://2fa.media";
const TITLE = "2FA Code Generator — Free Online TOTP Codes | 2FA.media";
const DESCRIPTION =
  "Generate TOTP two-factor authentication codes from your 2FA secret key — free, instant, and 100% in your browser. No signup, no server, your secrets never leave your device.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "2fa code generator",
    "totp generator",
    "2fa generator online",
    "two factor authentication code generator",
    "2fa live alternative",
    "totp online",
    "authenticator code generator",
    "2fa secret key generator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "2FA.media",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
