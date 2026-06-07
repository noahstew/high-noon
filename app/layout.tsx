import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'High Noon Optimist Club',
    template: '%s | High Noon Optimist Club',
  },
  description:
    'High Noon Optimist Club of Regina, Saskatchewan — youth programs, community service, events, and local partnerships.',
  keywords: [
    'High Noon Optimist Club',
    'Regina Saskatchewan',
    'youth programs',
    'community service',
    'Optimist Club',
    'youth leadership',
    'local events',
    'High Noon Regina',
    'Optimist Club Regina',
  ],
  authors: [{ name: 'High Noon Optimist Club' }],
  creator: 'High Noon Optimist Club',
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Navbar />
        <main className="flex-grow ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
