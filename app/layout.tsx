import type { Metadata } from "next";
import { Inter, Playfair_Display, Architects_Daughter, Pacifico } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const architectsDaughter = Architects_Daughter({ weight: "400", subsets: ["latin"], variable: "--font-handwriting" });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--font-logo" });

export const metadata: Metadata = {
  title: "ClearMark",
  description: "Flawless Watermark Removal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${architectsDaughter.variable} ${pacifico.variable} font-handwriting font-black antialiased selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
