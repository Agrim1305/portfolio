import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import { DraftGrid } from "@/components/draft-grid";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const description =
  "Final-year Computer Science student at Adelaide University, majoring in Artificial Intelligence. Software engineer and applied AI builder, open to graduate roles in software engineering, AI, data, and analytics.";

export const metadata: Metadata = {
  metadataBase: new URL("https://agrimsharma.com"),
  title: "Agrim Sharma | Software Engineer & AI",
  description,
  openGraph: {
    title: "Agrim Sharma | Software Engineer & AI",
    description,
    url: "/",
    siteName: "Agrim Sharma",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agrim Sharma | Software Engineer & AI",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <DraftGrid />
        {children}
      </body>
    </html>
  );
}
