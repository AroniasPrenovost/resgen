import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"


import { ToasterProvider } from '@/components/toaster-provider'
import { CrispProvider } from '@/components/crisp-provider'

import './globals.css'

const font = Inter({ subsets: ['latin'] });

const siteUrl = 'https://resumai.services';
const siteName = 'ResumAI';
const defaultTitle = 'ResumAI – AI-Powered Resume Generator for ATS-Friendly Resumes';
const defaultDescription =
  'Create a tailored, ATS-friendly resume in minutes with ResumAI. Our AI-powered resume builder turns your experience into multiple polished, downloadable resume versions — free to start.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | ResumAI',
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    'AI resume generator',
    'resume builder',
    'ATS-friendly resume',
    'AI resume builder',
    'free resume generator',
    'resume writing',
    'CV builder',
    'job application',
    'resume maker',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName,
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/transcript.png',
        width: 1200,
        height: 630,
        alt: 'ResumAI – AI-Powered Resume Generator',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/transcript.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  category: 'technology',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <CrispProvider />
        <body className={font.className}>
          <ToasterProvider />
          {children}
          <Analytics />
        </body>
      </html>
    // </ClerkProvider>
  )
}
