'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useAuthStore } from '../../lib/store/authStore'
import api from '../../lib/api'
import { toast } from '../../hooks/use-toast'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.user, res.data.token)
      toast.success('Welcome back!', `Logged in as ${res.data.user.name}`)
      router.push('/dashboard')
    } catch (err: any) {
      toast.error('Login failed', err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Welcome back 👋</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Sign in to your LearnFlow account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              id="password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full h-11"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[hsl(var(--primary))] font-semibold hover:underline">
          Create one free
        </Link>
      </div>

      {/* Demo credentials */}
      <div className="mt-6 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.5] text-sm">
        <p className="font-semibold mb-2 text-[hsl(var(--foreground))]">🔑 Demo Credentials</p>
        <div className="space-y-1 text-[hsl(var(--muted-foreground))]">
          <p>Register a new account above to get started</p>
          <p>Choose <strong>Student</strong> or <strong>Instructor</strong> role</p>
        </div>
      </div>
    </div>
  )
}
