import AuthGuard from "./authGuard";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import QueryProviders from "@/lib/query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "COXSCAB",
  description: "COXSCAB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <AuthGuard>
            <Providers>
              <Toaster />
              <MainSidebar />
              <div className="flex flex-col w-full">
                <Header />
                {children}
                <Footer />
              </div>
            </Providers>
          </AuthGuard>
        </QueryProviders>
      </body>
    </html>
  );
}
