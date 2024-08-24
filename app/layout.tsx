import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"


import { ToasterProvider } from '@/components/toaster-provider'
import { ModalProvider } from '@/components/modal-provider'
import { CrispProvider } from '@/components/crisp-provider'

import './globals.css'

const font = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'ResumAI - AI-Powered Resume Generation',
//   description: 'Customized, AI-assisted resume generation that lets your experience do the talking. Download multiple versions of an ATS-friendly resume today!',
//   ogTitle: '',
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <CrispProvider />
        <head>
           <title>ResumAI - AI-Powered Resume Generation</title>
           <meta name="description" content="Customized, AI-assisted resume generation that lets your experience do the talking. Download multiple versions of an ATS-friendly resume today!"/>
          <meta property="og:title" content="Your Page Title" />
          <meta property="og:description" content="Customized, AI-assisted resume generation that lets your experience do the talking. Download multiple versions of an ATS-friendly resume today!"/>
          <meta property="og:image" content="https://example.com/thumbnail.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body className={font.className}>
          <ToasterProvider />
          <ModalProvider />
          {children}
          <Analytics />
        </body>
      </html>
    // </ClerkProvider>
  )
}
