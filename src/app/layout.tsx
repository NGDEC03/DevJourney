import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SessionWrapper from "@/lib/sessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevJourney",
  description: "Enhance your journey as a developer with curated content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
      
      <SessionWrapper>
      <Header></Header>
          <main className="flex-1">{children}</main>
  <Footer></Footer>
      </SessionWrapper>
          <Toaster/>
         
        </body>
    </html>
  );
}
