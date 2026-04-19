'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, LayoutDashboard, Users, FileText,
  TrendingUp, MessageSquare, Bell, LogOut, GraduationCap,
  ChevronRight, PlusCircle, Settings, Menu, X
} from 'lucide-react'
import { useAuthStore } from '../../lib/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getInitials } from '../../lib/utils'
import { useState } from 'react'
import { cn } from '../../lib/utils'

const studentNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/courses', icon: BookOpen, label: 'Browse Courses' },
  { href: '/assignments', icon: FileText, label: 'Assignments' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
]

const instructorNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/courses', icon: BookOpen, label: 'My Courses' },
  { href: '/courses/create', icon: PlusCircle, label: 'Create Course' },
  { href: '/assignments', icon: FileText, label: 'Assignments' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
]

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = user?.role === 'instructor' ? instructorNav : studentNav

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'sidebar',
          mobileOpen ? 'translate-x-0' : ''
        )}
        style={{ transform: mobileOpen ? 'translateX(0)' : undefined }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-[hsl(var(--border))] shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: 'var(--gradient-primary)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">LearnFlow</span>
          <button onClick={onClose} className="ml-auto md:hidden text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="rounded-lg px-3 py-2 text-xs font-semibold"
            style={{
              background: user?.role === 'instructor'
                ? 'hsl(250 84% 54% / 0.12)'
                : 'hsl(142 71% 45% / 0.12)',
              color: user?.role === 'instructor'
                ? 'hsl(250 84% 54%)'
                : 'hsl(142 71% 45%)',
            }}>
            {user?.role === 'instructor' ? '🎓 Instructor View' : '📚 Student View'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Menu
          </p>
          <ul className="space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                    )}
                    style={isActive ? { background: 'var(--gradient-primary)' } : {}}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 border-t border-[hsl(var(--border))] pt-4">
            <Link
              href="/profile"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                pathname === '/profile'
                  ? 'text-white shadow-md'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
              style={pathname === '/profile' ? { background: 'var(--gradient-primary)' } : {}}
            >
              <Settings className="w-4 h-4" />
              Profile & Settings
            </Link>
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-[hsl(var(--border))]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{getInitials(user?.name || 'U')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors p-1 rounded"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
