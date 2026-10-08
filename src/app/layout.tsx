import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Newsreader } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// Only ever used for italic accent words, so the upright cut is never loaded.
// Not preloaded: it isn't needed for the first paint to read correctly, and
// the size-matched fallback keeps the swap from shifting the layout.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: "italic",
  weight: "500",
  preload: false,
});

// Both taken word for word from the hero: the name with its eyebrow line,
// and the intro.
const title = "Agrim Sharma | Software Engineering · Adelaide";
const description =
  "Final-year Computer Science student at Adelaide University, majoring in Artificial Intelligence. I build software that solves problems, put AI to work inside them, and ship it so real people actually use it.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agrimsharma.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Agrim Sharma",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${bricolage.variable} ${newsreader.variable} font-sans antialiased`}
      >
        {children}
        <SmoothScroll />
      </body>
    </html>
  );
}
