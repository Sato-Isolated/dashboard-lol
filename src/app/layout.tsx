import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";
import { initDb } from "@/db/init";

export const metadata: Metadata = {
  title: "Dashboard - League of Legends Aram",
  description: "Dashboard for League of Legends Aram",
};

initDb().then(() => {
  // console.log("[Mongo] DB initialized.");
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
