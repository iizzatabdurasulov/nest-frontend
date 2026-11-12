import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Forma — didingizga xos tanlovlar",
  description:
    "Kundalik hayotingiz uchun saralangan mahsulotlar. Forma bilan o‘zingizga mosini toping.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#f7f8f2] font-[family-name:var(--font-geist-sans)] text-stone-900 antialiased selection:bg-[#e3e9d6] [&_a:focus-visible]:rounded-md [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#65804a]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
