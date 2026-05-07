

import './globals.css'
import { Noto_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import ClientLayout from '@/components/client-layout'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from './context/AuthContext'

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'shdMonitoring',
  description: 'Удирдлагын хэсэг',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mn" className={notoSans.variable}>
      <body className="font-sans">
        <AuthProvider>
          <Toaster />
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
