import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
  ),

  // Primary meta tags
  title: {
    default:
      "Algorithm Visualizer - Interactive Data Structure & Algorithm Animation Tool",
    template: "%s | Algorithm Visualizer",
  },
  description:
    "Learn algorithms and data structures through interactive visualization. Practice sorting, searching, trees, graphs with step-by-step animations. Perfect for coding interviews and computer science learning.",

  // Keywords for SEO
  keywords: [
    "algorithm visualizer",
    "data structure visualization",
    "sorting algorithms",
    "binary tree visualizer",
    "graph algorithms",
    "coding interview prep",
    "algorithm animation",
    "interactive algorithms",
    "computer science learning",
    "algorithm tutorial",
    "programming education",
    "algorithm simulator",
  ],

  // Authors and creator info
  authors: [{ name: "Algorithm Visualizer Team" }],
  creator: "Algorithm Visualizer",
  publisher: "Algorithm Visualizer",

  // Open Graph meta tags
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Algorithm Visualizer",
    title: "Algorithm Visualizer - Interactive Learning Platform",
    description:
      "Master algorithms through interactive visualization. Free online tool for learning data structures, sorting, searching, and graph algorithms.",
    images: [
      {
        url: "/og-image-homepage.png",
        width: 1200,
        height: 630,
        alt: "Algorithm Visualizer - Interactive Learning Platform",
      },
    ],
  },

  // Twitter Card meta tags
  twitter: {
    card: "summary_large_image",
    site: "@AlgorithmViz",
    creator: "@AlgorithmViz",
    title: "Algorithm Visualizer - Interactive Learning Platform",
    description:
      "Learn algorithms through interactive visualization. Perfect for coding interviews and CS education.",
    images: ["/twitter-card-image.png"],
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification and other meta
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },

  // App specific metadata
  applicationName: "Algorithm Visualizer",
  referrer: "origin-when-cross-origin",
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Algorithm Visualizer",
    description:
      "Interactive algorithm and data structure visualization platform for education and coding interview preparation",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev",
    logo: {
      "@type": "ImageObject",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
      }/logo.png`,
      width: "512",
      height: "512",
    },
    sameAs: [
      "https://twitter.com/AlgorithmViz",
      "https://github.com/algorithm-visualizer",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
      }/contact`,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Algorithm Visualizer",
    description:
      "Learn algorithms and data structures through interactive visualization",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
        }/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Algorithm Visualizer",
    operatingSystem: "Web Browser",
    applicationCategory: "EducationalApplication",
    description:
      "Interactive algorithm and data structure visualization tool for learning and coding interview preparation",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev",
    screenshot: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://algorithm-visualizer.dev"
    }/screenshot.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    creator: {
      "@type": "Organization",
      name: "Algorithm Visualizer Team",
    },
    featureList: [
      "Sorting Algorithm Visualization",
      "Binary Tree Animation",
      "Graph Algorithm Demos",
      "Interactive Algorithm Controls",
      "Step-by-step Algorithm Execution",
      "Performance Analysis",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
