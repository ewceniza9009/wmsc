import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WMSC",
  description: "Warehouse Management System Cold Storage",
  icons: {
    icon: "/images/warehouse.svg",
    shortcut: "/images/warehouse.svg",
    apple: "/images/warehouse.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <style>
          {`
            :root {
              color-scheme: light dark;
            }
            
            html.light {
              color-scheme: light;
            }
            
            html.dark {
              color-scheme: dark;
            }
            
            /* Prevent FOUC (Flash of Unstyled Content) during theme transitions */
            html.light, html.dark {
              transition-property: background-color, border-color, color, fill, stroke;
              transition-duration: 200ms;
            }
          `}
        </style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem("wmsc-theme") || "dark";
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  // Fail silently if localStorage is not available
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
