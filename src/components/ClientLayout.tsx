"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/pagelayout/header";
import Footer from "@/components/pagelayout/footer";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider>
        <Header />
        {children}
        <Footer />
      </ThemeProvider>
    </div>
  );
}
