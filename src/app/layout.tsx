import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stacked - Life Toolkit for Modern Students",
  description: "A comprehensive toolkit for students to manage their academic and personal life",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
