import './globals.css'
import type { Metadata } from 'next'
import { Bebas_Neue, DM_Mono, DM_Sans } from 'next/font/google'
import Script from 'next/script'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'The One Million Miles Challenge',
  description: 'The One Million Miles Challenge, in support of Evelina London.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${dmMono.variable}`}
        style={{ margin: 0, padding: 0, background: '#0a0f1e' }}
      >
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5715351096287649"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
