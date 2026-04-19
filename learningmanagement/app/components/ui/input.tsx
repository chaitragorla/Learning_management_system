import * as React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm',
        'placeholder:text-[hsl(var(--muted-foreground))]',
        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-150',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
