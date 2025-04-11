import type { Metadata } from "next";
import { Quicksand, Varela_Round, Comic_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientBody from "./ClientBody";

// Primary rounded font for headings
const varelaRound = Varela_Round({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-varela-round",
});

// Friendly, rounded font for body text
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

// Playful, childlike font for accent text
const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
});

export const metadata: Metadata = {
  title: "Clevers' Origin Schools - Kindergarten Learning Adventure",
  description: "Clevers' Origin Schools - A fun, nurturing kindergarten with a focus on creative learning and joyful exploration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${varelaRound.variable} ${comicNeue.variable} font-quicksand antialiased`}>
        <ClientBody>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors />
        </ClientBody>
      </body>
    </html>
  );
}
