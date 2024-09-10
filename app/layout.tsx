import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import localFont from "next/font/local";
import { Poppins } from 'next/font/google';
import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  title: "WolfOrganize",
  description: "WolfOrganize is a even organizer",
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
