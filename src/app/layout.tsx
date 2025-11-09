import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { ToastProvider } from '@/components/error/Toast'
import { reportWebVital } from '@/lib/performance'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Optimize font loading
  preload: true,
})

export const metadata: Metadata = {
  title: 'JobPlat Job Board',
  description: 'Connecting JobPlat graduates and students with exceptional career opportunities across Rwanda and East Africa.',
  keywords: 'JobPlat, jobs, careers, Rwanda, East Africa, graduates, students',
  authors: [{ name: 'JobPlat' }],
  creator: 'JobPlat',
  publisher: 'JobPlat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jobs.cmu.edu'),
  openGraph: {
    title: 'JobPlat Job Board',
    description: 'Connecting JobPlat graduates and students with exceptional career opportunities across Rwanda and East Africa.',
    url: 'https://jobs.cmu.edu',
    siteName: 'JobPlat Job Board',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobPlat Job Board',
    description: 'Connecting JobPlat graduates and students with exceptional career opportunities across Rwanda and East Africa.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Export reportWebVital for Next.js to use
export { reportWebVital }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Viewport meta for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#C41E3A" />
        <meta name="msapplication-TileColor" content="#C41E3A" />
        
        {/* Prevent zoom on iOS */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
