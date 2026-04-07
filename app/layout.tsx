import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NHS Million Miles Challenge 2025',
  description: 'NHS staff collectively running, cycling and walking one million miles in 2025.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0a0f1e' }}>{children}</body>
    </html>
  )
}
