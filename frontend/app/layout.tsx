import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Roboto_Condensed } from "next/font/google";
import ThemeClerkProvider from "@/components/ThemeClerkProvider";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TaskPulse — Production Task & Workflow Management",
    template: "%s | TaskPulse",
  },
  description:
    "A high-performance, enterprise-grade to-do and workflow management application engineered with Next.js and NestJS.",
  applicationName: "TaskPulse",
  authors: [{ name: "TaskPulse Team" }],
  creator: "TaskPulse",
  publisher: "TaskPulse",
  keywords: [
    "TaskPulse",
    "Todo",
    "Task Management",
    "Productivity",
    "Workflow",
    "Next.js",
    "NestJS",
    "Enterprise",
  ],
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: ["/icon.svg"],
    apple: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TaskPulse",
    title: "TaskPulse — Production Task & Workflow Management",
    description:
      "A high-performance, enterprise-grade to-do and workflow management application engineered with Next.js and NestJS.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "TaskPulse Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TaskPulse — Production Task & Workflow Management",
    description:
      "A high-performance, enterprise-grade to-do and workflow management application engineered with Next.js and NestJS.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoCondensed.className} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('taskpulse_theme');
                if (t === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch(e){}
            })()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-indigo-500 selection:text-white">
        <ThemeClerkProvider>{children}</ThemeClerkProvider>
      </body>
    </html>
  );
}