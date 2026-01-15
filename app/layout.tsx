import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import FacebookSDK from '@/components/FacebookSDK';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'High Noon Optimist Club',
  description: 'Website for the high noon optimist club of Regina Saskatchewan',
};

const lora = Lora({
  subsets: ['latin'], // Specify the necessary subsets for performance
  weight: ['400', '700'],
  variable: '--font-lora',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body
        // className={`antialiased ${montserrat.variable} ${montserrat.className}`}
        className={`antialiased flex flex-col min-h-screen ${lora.variable} ${lora.className}`}
      >
        <FacebookSDK />
        <Navbar />
        <main className="flex-grow ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
