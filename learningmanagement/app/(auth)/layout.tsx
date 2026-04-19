'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { GraduationCap } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState, Suspense } from 'react'

function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'var(--gradient-primary)' }}>
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, white 0%, transparent 40%),
                              radial-gradient(circle at 70% 30%, white 0%, transparent 40%)`,
          }}
        />
        {/* Grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px),
                              linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            LearnFlow
          </Link>
        </div>

        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-black mb-4 leading-tight">
            The Future of<br />Enterprise Learning
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Join thousands of instructors and students on the most
            beautiful and powerful LMS ever built.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['50K+', 'Active Students'],
              ['1,200+', 'Instructors'],
              ['8,500+', 'Courses'],
              ['98%', 'Satisfaction'],
            ].map(([v, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-2xl font-black text-white">{v}</div>
                <div className="text-sm text-white/70">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 LearnFlow. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">LearnFlow</span>
          </Link>
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))]">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Desktop theme toggle */}
            <div className="hidden lg:flex justify-end mb-6">
              {mounted && (
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthLayoutInner>{children}</AuthLayoutInner>
    </Suspense>
  )
}
