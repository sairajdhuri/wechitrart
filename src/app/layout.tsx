import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${inter.variable} h-full antialiased`}
      style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
