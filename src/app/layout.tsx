import "./globals.css";

import { Navbar } from "../components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import ChatWindow from "@/components/chat/ChatWindow";
import CookieBanner from "@/components/layout/CookieBanner";

import { Toaster } from "sonner";

import { Space_Grotesk, Inter, Unica_One } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-unica",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${unica.variable}`}
    >
      <body
        className={`
          ${inter.className}
          ${spaceGrotesk.variable}
          ${inter.variable}
          ${unica.variable}
        `}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        <ChatWindow />
        <CookieBanner />

        {/* SONNER TOASTS */}

        <Toaster
          position="top-center"
          richColors
          closeButton
          expand
          duration={3000}
          toastOptions={{
            className: "font-inter",
          }}
        />
      </body>
    </html>
  );
}
