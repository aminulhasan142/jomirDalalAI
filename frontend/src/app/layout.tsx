import type { Metadata } from "next";
import "./tailwind-built.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export const metadata: Metadata = {
  title: "জমির দালাল AI — এআই-চালিত বাংলাদেশ ভূমি রেকর্ড অডিট ও বিশ্লেষণ",
  description:
    "বাংলাদেশের খতিয়ান ও পর্চার জটিল আনা-গণ্ডা ভগ্নাংশ হিসাব, উত্তরাধিকার ফারায়েজ যাচাই ও ল্যান্ড ট্রুথ স্কোরকার্ডের মাধ্যমে জমি প্রতারণা প্রতিরোধের ডিজিটাল প্ল্যাটফর্ম।",
  keywords: [
    "জমির দালাল AI",
    "খতিয়ান",
    "আনা গণ্ডা",
    "উত্তরাধিকার ফারায়েজ",
    "ল্যান্ড ট্রুথ স্কোরকার্ড",
    "LandTech 2026",
    "Bangladesh Land Records",
  ],
  authors: [{ name: "LandTech 2026 Team" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <Navbar />
        <ErrorBoundary>
          <main className="flex-1 w-full">{children}</main>
        </ErrorBoundary>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
