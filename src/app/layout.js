import {
  Poppins,
} from "next/font/google";
import "./globals.css";
import Navbar from "../components/sheard/Navbar";
import Footer from "@/components/sheard/Footer";
import TopHeader from "@/components/sheard/TopHeader";
import Preloader from "@/components/sheard/Preloader";

import ReduxProviderWrapper from "@/components/ReduxProvaiderWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

import { Toaster } from "react-hot-toast";
import MetaPixel from "@/components/sheard/MetaPixel";
import { Suspense } from "react";

// Google Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    template: "Hi Ict Park | %s",
    default: "Hi Ict Park | Home",
  },
  description:
    "ejobs it  a leading IT training institute and digital solutions provider. We specialize in professional courses, ready-made software, and premium website templates to help you grow your skills and business.",
  icons: {
    icon: "/images/ejobsitlogo.png",
    shortcut: "/images/ejobsitlogo.png",
    apple: "/images/ejobsitlogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <Preloader />
        <ReduxProviderWrapper>
          <LanguageProvider>
            <Toaster position="top-center" reverseOrder={false} />

            <Suspense fallback={null}>
              <MetaPixel />
            </Suspense>

            {children}
          </LanguageProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
