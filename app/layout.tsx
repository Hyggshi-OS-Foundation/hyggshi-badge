import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hyggshi Badge — Custom SVG Badge Generator',
  description:
    'Create stunning custom SVG badges for GitHub, npm, and more. Themes: Flat, Glass, Neon, Hyggshi, Custom. Deploy on Vercel.',
  keywords: 'svg badge, shields.io alternative, badge generator, github badge, npm badge, custom badge, neon badge, glassmorphism badge',
  authors: [{ name: 'Hyggshi' }],
  openGraph: {
    title: 'Hyggshi Badge — Custom SVG Badge Generator',
    description: 'Create stunning custom SVG badges for your projects.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
