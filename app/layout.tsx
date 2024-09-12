import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

export const metadata: Metadata = {
  title: "Wolf Organize",
  description: "Wolf Organize is a even organizer",
  icons: {
    icon : '/assets/images/logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
