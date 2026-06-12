import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ConditionalSiteLayout from "@/components/layout/ConditionalSiteLayout";
import ClientBody from "@/components/ClientBody";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cleversoriginschools.com"),
  title: "Clevers' Origin Schools",
  description: "Nurturing Excellence, Empowering Futures",
  openGraph: {
    title: "Clevers' Origin Schools",
    description: "Nurturing Excellence, Empowering Futures",
    url: "https://www.cleversoriginschools.com",
    siteName: "Clevers' Origin Schools",
    images: [
      {
        url: "https://www.cleversoriginschools.com/og.jpg",
        secureUrl: "https://www.cleversoriginschools.com/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Clevers' Origin Schools - Nurturing Excellence, Empowering Futures",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clevers' Origin Schools",
    description: "Nurturing Excellence, Empowering Futures",
    images: [
      {
        url: "https://www.cleversoriginschools.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "Clevers' Origin Schools - Nurturing Excellence, Empowering Futures",
      },
    ],
    creator: "@cleversorigin",
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <AdminAuthProvider>
          <ClientBody>
            <ConditionalSiteLayout>{children}</ConditionalSiteLayout>
          </ClientBody>
        </AdminAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}