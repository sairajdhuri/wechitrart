import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wechitrart Studio | Archival Wall Art & Statement Posters",
  description:
    "Explore curated museum-grade archival art prints crafted on 300 GSM heavy matte paper. Direct WhatsApp checkout, custom sizing (A4, A3, A2), and safe packaging.",
  keywords: [
    "Posters",
    "Wall Art",
    "Anime Posters",
    "Abstract Art",
    "Cinema Posters",
    "Minimalist Decor",
    "WhatsApp Checkout",
    "Wechitrart",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-gray-100">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
