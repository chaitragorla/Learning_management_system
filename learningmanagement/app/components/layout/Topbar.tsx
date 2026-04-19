'use client'

import { Menu, Bell, Search, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '../../lib/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getInitials } from '../../lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface TopbarProps {
  onMenuClick: () => void
  title?: string
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const unreadCount = user?.notifications?.filter((n) => !n.read).length || 0

  useEffect(() => setMounted(true), [])

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center gap-4 h-16 px-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md"
      style={{ left: 'var(--sidebar-width)', transition: 'left 0.3s ease' }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="text-lg font-semibold hidden sm:block truncate">{title}</h1>
      )}

      {/* Search bar */}
      <div className="flex-1 max-w-md hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.5] text-sm text-[hsl(var(--muted-foreground))]">
        <Search className="w-4 h-4 shrink-0" />
        <Link href="/courses" className="flex-1">Search courses…</Link>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/profile">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Link>
        </Button>

        {/* Avatar */}
        <Link href="/profile">
          <Avatar className="w-8 h-8 ring-2 ring-[hsl(var(--primary))] ring-offset-2 ring-offset-[hsl(var(--background))]">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-xs">{getInitials(user?.name || 'U')}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
