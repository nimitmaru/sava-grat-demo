import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { AppShell } from "@/components/layout/app_shell";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sava GRAT Platform",
  description: "Automated Rolling GRAT Administration — Sava Trust Company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-background text-on-background font-body">
        {/* Mobile gate — demo is desktop-only */}
        <div className="flex lg:hidden h-full items-center justify-center p-8">
          <div className="max-w-sm text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-primary" aria-hidden="true">
              desktop_windows
            </span>
            <h1 className="font-headline text-xl font-bold text-on-surface">
              Desktop Experience Only
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              The Sava GRAT Platform demo is optimized for desktop browsers.
              Please visit on a device with a screen width of at least 1024px.
            </p>
          </div>
        </div>

        {/* Desktop app */}
        <div className="hidden lg:contents">
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
