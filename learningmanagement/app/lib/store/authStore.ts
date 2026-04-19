// app/lib/store/authStore.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  avatar: string
  bio?: string
  notifications?: { message: string; read: boolean; createdAt: string }[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('lms_token', token)
          localStorage.setItem('lms_user', JSON.stringify(user))
        }
        set({ user, token, isAuthenticated: true })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lms_token')
          localStorage.removeItem('lms_user')
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'lms-auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
