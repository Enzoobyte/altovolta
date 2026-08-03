import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://altovolta.vercel.app'),
  title: {
    default: "Altovolta | Tienda",
    template: "%s | Altovolta",
  },
  description: "Tienda de ropa Altovolta. Catálogo online, pedidos por WhatsApp.",
  openGraph: {
    title: "Altovolta",
    description: "Ropa con actitud. Catálogo online, pedidos por WhatsApp.",
    siteName: "Altovolta",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
