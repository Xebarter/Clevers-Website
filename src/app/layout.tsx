import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Clevers International School",
  description: "Nurturing Excellence, Empowering Futures",
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
          <Header />
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}