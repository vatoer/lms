import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ConfettiProvider } from "@/components/provider/confetti-provider";
import { ToastProvider } from "@/components/provider/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Confetti from "react-confetti/dist/types/Confetti";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
