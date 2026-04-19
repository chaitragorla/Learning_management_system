import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from './components/ui/toaster'

export const metadata: Metadata = {
  title: 'LearnFlow LMS — Enterprise Learning Platform',
  description:
    'A premium, enterprise-grade Learning Management System for instructors and students. Create courses, track progress, and accelerate your learning journey.',
  keywords: ['LMS', 'e-learning', 'courses', 'education', 'online learning'],
  openGraph: {
    title: 'LearnFlow LMS',
    description: 'Enterprise Learning Management System',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
