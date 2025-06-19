'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeaderRoutes = ['/auth','/admin']
  const shouldHideHeader = hideHeaderRoutes.some(route => pathname.startsWith(route))

  return (
    <>
      {!shouldHideHeader && <Navbar />}
      {children}
    </>
  )
}
