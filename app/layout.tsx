import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

// Premium display font — classic, elegant, luxury
const garamond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Clean geometric sans — modern, highly readable, premium
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["200", "300", "400", "500", "600", "700"],
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
      <body className={`${garamond.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
