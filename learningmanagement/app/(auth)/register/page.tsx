'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, BookOpen } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useAuthStore } from '../../lib/store/authStore'
import api from '../../lib/api'
import { toast } from '../../hooks/use-toast'
import { cn } from '../../lib/utils'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  const [role, setRole] = useState<'student' | 'instructor'>(
    searchParams.get('role') === 'instructor' ? 'instructor' : 'student'
  )
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role,
      })
      setAuth(res.data.user, res.data.token)
      toast.success('Account created!', `Welcome to LearnFlow, ${res.data.user.name}!`)
      router.push('/dashboard')
    } catch (err: any) {
      toast.error('Registration failed', err.response?.data?.message || 'Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Create your account 🚀</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Join thousands of learners and instructors on LearnFlow
        </p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
            role === 'student'
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.08]'
              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))/0.5]'
          )}
        >
          <BookOpen className={cn('w-6 h-6', role === 'student' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]')} />
          <span className={cn('text-sm font-semibold', role === 'student' ? 'text-[hsl(var(--primary))]' : '')}>Student</span>
        </button>
        <button
          type="button"
          onClick={() => setRole('instructor')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
            role === 'instructor'
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))/0.08]'
              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))/0.5]'
          )}
        >
          <GraduationCap className={cn('w-6 h-6', role === 'instructor' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]')} />
          <span className={cn('text-sm font-semibold', role === 'instructor' ? 'text-[hsl(var(--primary))]' : '')}>Instructor</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              id="name"
              placeholder="John Doe"
              className="pl-10"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
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
              placeholder="Min. 6 characters"
              className="pl-10 pr-10"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
            />
            <button type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" variant="gradient" className="w-full h-11 mt-2" loading={loading}>
          Create {role === 'instructor' ? 'Instructor' : 'Student'} Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Already have an account?{' '}
        <Link href="/login" className="text-[hsl(var(--primary))] font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
