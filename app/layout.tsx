import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import FacebookSDK from '@/components/FacebookSDK';

export const metadata: Metadata = {
  title: 'High Noon Optimist Club',
  description: 'Website for the high noon optimist club of Regina Saskatchewan',
};

const montserrat = Montserrat({
  subsets: ['latin'], // Specify the necessary subsets for performance
  weight: ['400', '700'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" sizes="any" />

      <body
        // className={`antialiased ${montserrat.variable} ${montserrat.className}`}
        className="antialiased"
      >
        <FacebookSDK />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
