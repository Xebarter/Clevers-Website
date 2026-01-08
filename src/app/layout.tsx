import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientBody from "@/components/ClientBody";

export const metadata: Metadata = {
  title: "Clevers' Origin Schools",
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
          <ClientBody>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>

            {/* Social and Contact Buttons - Static on all pages */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
              {/* Call Button */}
              <a
                href="tel:+256762494822"
                className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all hover:scale-105 flex items-center justify-center"
                aria-label="Call us"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/256762494822"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition-all hover:scale-105 flex items-center justify-center"
                aria-label="WhatsApp us"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* TikTok Button */}
              <a
                href="https://www.tiktok.com/@cleversorigin?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-black hover:bg-zinc-800 text-white shadow-lg transition-all hover:scale-105 flex items-center justify-center"
                aria-label="Follow us on TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.13-.09-.25-.19-.38-.28V15.5c0 1.57-.44 3.12-1.3 4.43-1.01 1.56-2.61 2.75-4.43 3.32-1.82.57-3.88.54-5.65-.11-1.77-.65-3.26-2.02-4.13-3.72-.87-1.7-1.04-3.78-.47-5.59.57-1.81 1.95-3.35 3.69-4.17 1.4-.66 3.01-.89 4.54-.62v4.03c-.63-.17-1.34-.14-1.94.13-1.01.44-1.81 1.34-2.11 2.4-.3.1.05 2.19.46 3.05.41.86 1.25 1.54 2.17 1.83.92.29 2 .25 2.85-.12.85-.37 1.51-1.12 1.79-2.01.11-.34.15-.71.15-1.07V.02z" />
                </svg>
              </a>
            </div>
          </ClientBody>
        </AdminAuthProvider>
      </body>
    </html>
  );
}