import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://badsaas.app'),
  title: 'BAD — Business Automation & Development',
  description:
    'Custom business automation software, workflow design, AI integration, and consulting for businesses that demand better. We consult, design, and build purpose-built systems that replace manual work.',
  keywords: [
    'business automation',
    'custom software development',
    'AI integration',
    'workflow automation',
    'consulting',
    'SaaS',
    'lead management',
    'business operations',
  ],
  openGraph: {
    title: 'BAD — Business Automation & Development',
    description:
      'Custom automation software, workflow design, AI integration, and consulting. We build the systems your business actually needs.',
    url: 'https://badsaas.app',
    siteName: 'BAD — Business Automation & Development',
    images: [
      {
        url: '/bad-logo.png',
        width: 512,
        height: 512,
        alt: 'BAD — Business Automation & Development',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/bad-logo.png',
    apple: '/bad-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bad-bg">{children}</body>
    </html>
  );
}
