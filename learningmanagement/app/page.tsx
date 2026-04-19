'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, BookOpen, Users, TrendingUp, Star,
  Play, ChevronRight, Check, Zap, Globe, Award, ArrowRight,
  BarChart3, Shield, Cpu
} from 'lucide-react'
import { Button } from './components/ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from './lib/store/authStore'

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '1,200+', label: 'Expert Instructors' },
  { value: '8,500+', label: 'Courses' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Learning',
    desc: 'Adaptive learning paths powered by intelligent recommendations tailored to your pace and goals.',
    color: 'hsl(38 92% 50%)',
  },
  {
    icon: Globe,
    title: 'Learn Anywhere',
    desc: 'Fully responsive on every device. Download lessons for offline access and learn on the go.',
    color: 'hsl(200 80% 50%)',
  },
  {
    icon: Award,
    title: 'Industry Certificates',
    desc: 'Earn recognized certificates upon course completion to showcase your skills to employers.',
    color: 'hsl(142 71% 45%)',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    desc: 'Real-time dashboards show your progress, streaks, and performance analytics at a glance.',
    color: 'hsl(250 84% 54%)',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'JWT authentication, role-based access, and end-to-end encrypted data storage.',
    color: 'hsl(0 84% 60%)',
  },
  {
    icon: Cpu,
    title: 'AI Recommendations',
    desc: 'Smart algorithms analyze your interests to surface the most relevant courses for you.',
    color: 'hsl(262 83% 58%)',
  },
]

const categories = [
  { name: 'Web Development', icon: '💻', count: 342 },
  { name: 'Data Science', icon: '📊', count: 218 },
  { name: 'Design & UX', icon: '🎨', count: 156 },
  { name: 'Business', icon: '📈', count: 189 },
  { name: 'DevOps & Cloud', icon: '☁️', count: 97 },
  { name: 'AI & ML', icon: '🤖', count: 124 },
  { name: 'Cybersecurity', icon: '🔐', count: 83 },
  { name: 'Mobile Dev', icon: '📱', count: 110 },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Full-Stack Developer at Google',
    text: 'LearnFlow completely transformed how I learn. The course quality is exceptional and the progress tracking keeps me accountable.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Data Scientist at Netflix',
    text: 'The instructor tools are world-class. I went from 0 to 500 students in just 3 months on this platform.',
    avatar: 'MJ',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'UX Lead at Airbnb',
    text: 'Best LMS I\'ve used. The UI is beautiful, the content is high quality, and assignments are easy to manage.',
    avatar: 'PP',
    rating: 5,
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[hsl(var(--border))]/50 bg-[hsl(var(--background))]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">LearnFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            <Link href="#features" className="hover:text-[hsl(var(--foreground))] transition-colors">Features</Link>
            <Link href="#categories" className="hover:text-[hsl(var(--foreground))] transition-colors">Courses</Link>
            <Link href="#testimonials" className="hover:text-[hsl(var(--foreground))] transition-colors">Reviews</Link>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient" size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient dark:opacity-100 opacity-30" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(250 84% 54% / 0.07) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, hsl(262 83% 58% / 0.07) 0%, transparent 50%)`,
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            🎉 Over 50,000 students learning right now
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Learn Without{' '}
            <span className="gradient-text">Limits</span>
            <br />
            Teach Without{' '}
            <span className="gradient-text">Barriers</span>
          </h1>

          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 leading-relaxed">
            The enterprise-grade LMS that empowers instructors to create world-class courses
            and students to master any skill — beautifully.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button variant="gradient" size="lg" className="gap-2 text-base px-8 h-14">
                Start Learning Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register?role=instructor">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-14">
                <Play className="w-4 h-4" /> Become an Instructor
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-black gradient-text">{value}</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(var(--primary))] mb-3">Why LearnFlow?</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
            Powerful tools for learners and instructors alike, wrapped in a beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="card-base p-6 group cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section id="categories" className="py-24 bg-[hsl(var(--muted))/0.4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(var(--primary))] mb-3">Explore Topics</p>
            <h2 className="text-4xl font-black mb-4">Top Course Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ name, icon, count }, i) => (
              <button
                key={name}
                onClick={() => setActiveCategory(i)}
                className={`card-base p-5 text-center transition-all duration-200 group cursor-pointer ${
                  activeCategory === i ? 'ring-2 ring-[hsl(var(--primary))]' : ''
                }`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
                <p className="font-semibold text-sm mb-1">{name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{count} courses</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses">
              <Button variant="gradient">Browse All Courses <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(var(--primary))] mb-3">Testimonials</p>
          <h2 className="text-4xl font-black mb-4">Loved by learners worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, text, avatar, rating }) => (
            <div key={name} className="card-base p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'var(--gradient-primary)' }}>
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-primary)' }} />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, white 0%, transparent 50%),
                              radial-gradient(circle at 70% 50%, white 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to transform your career?</h2>
          <p className="text-xl opacity-90 mb-10">
            Join 50,000+ learners who are advancing their skills on LearnFlow today.
            It&apos;s free to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[hsl(250,84%,54%)] hover:bg-gray-100 font-bold px-8 h-14 text-base">
                Start for Free Today <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register?role=instructor">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 h-14 text-base">
                Teach on LearnFlow
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">LearnFlow</span>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              © 2026 LearnFlow. Enterprise Learning Management System.
            </p>
            <div className="flex gap-6 text-sm text-[hsl(var(--muted-foreground))]">
              <Link href="#" className="hover:text-[hsl(var(--foreground))]">Privacy</Link>
              <Link href="#" className="hover:text-[hsl(var(--foreground))]">Terms</Link>
              <Link href="#" className="hover:text-[hsl(var(--foreground))]">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
