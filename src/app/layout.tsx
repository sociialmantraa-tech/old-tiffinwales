import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SubscriptionTrackerBanner } from "@/components/SubscriptionTrackerBanner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Tiffin Wales | Indian Tiffin Service Boston & Cambridge MA | Fresh Homemade Meals Delivered",
  description: "Authentic, fresh Indian tiffin service in Cambridge & Boston, MA. Daily, 2-day, 3-day, 4-day, 5-day meal plans and 30-day monthly subscriptions. Soft rotis, fragrant basmati rice, rich dals and curries delivered to your doorstep.",
  keywords: "Indian tiffin service Boston MA, Indian food Cambridge MA, Harvard Indian food, MIT meal delivery, veg tiffin Boston, 5 days meal plan, Punjabi food Boston, Tiffin Wales",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-100x100.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-300x300.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Tiffin Wales | Authentic Indian Tiffin Delivery in Boston & Cambridge",
    description: "Daily fresh homemade Indian meals delivered across Cambridge, Boston & Somerville. 5-Day and monthly plans available.",
    url: "https://tiffinwales.com",
    siteName: "Tiffin Wales",
    images: [
      {
        url: "https://tiffinwales.com/wp-content/uploads/2026/03/02-Tiffin-food-instagram.png",
        width: 1200,
        height: 630,
        alt: "Tiffin Wales Indian Tiffin Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-100x100.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-300x300.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ff6413" />
      </head>
      <body>
        <CartProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <SubscriptionTrackerBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
