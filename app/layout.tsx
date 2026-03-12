import type { Metadata } from "next";
import { Poppins, Inter, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

// Premium editorial serif for navbar brand wordmark
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Clean geometric sans for nav links + UI labels
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

// Premium modern display font (existing)
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Clean geometric sans for body (existing)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mercedes-Benz | The Best or Nothing",
  description:
    "Experience the pinnacle of automotive engineering. Discover the new Mercedes-Benz lineup — where luxury meets pure performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
