import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/pagelayout/header";
import Footer from "@/components/pagelayout/footer";
import { initDb } from "@/db/init";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - League of Legends Aram",
  description: "Dashboard for League of Legends Aram",
};

initDb()
  .then(() => {
    console.log("[Mongo] DB initialized.");
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Header />
          {children}
          <Footer />
      </body>
    </html>
  );
}
