import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { FocusProvider } from "@/context/FocusContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Soulstys Meridian Wellness",
  description:
    "Soulstys Meridian Wellness is a concierge client experience for TRT, BHRT, and peptide therapy programs — intake, tracking, and communication, delivered in partnership with an independent licensed healthcare provider.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-velvet-gradient">
        <FocusProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </FocusProvider>
      </body>
    </html>
  );
}
