import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CharityHub | Empowering Students",
  description: "A secure digital platform connecting university students with caring donors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col transition-colors duration-500 ease-in-out bg-slate-50 selection:bg-brand-action selection:text-white">
        <ThemeProvider>
          
          <Navbar />
          
          <main className="flex-grow flex flex-col w-full">
            {children}
          </main>

          <Footer />
          
          <ThemeSwitcher />
          
        </ThemeProvider>
      </body>
    </html>
  );
}