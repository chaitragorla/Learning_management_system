'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--primary))] text-white shadow hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0',
        destructive: 'bg-[hsl(var(--destructive))] text-white hover:opacity-90',
        outline: 'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]',
        secondary: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--muted))]',
        ghost: 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]',
        link: 'text-[hsl(var(--primary))] underline-offset-4 hover:underline',
        gradient: 'btn-gradient',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading…
        </>
      ) : children}
    </button>
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
