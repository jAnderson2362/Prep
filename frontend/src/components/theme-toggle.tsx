import { motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '#/lib/theme'
import { cn } from '#/lib/utils'

/**
 * Sun/Moon are both rendered and swapped with CSS (`dark:`) so the server
 * and client markup match regardless of the stored theme.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme, resolvedTheme } = useTheme()

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9, rotate: -12 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      title="Toggle theme"
      className={cn(
        'relative inline-flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-soft transition-colors hover:border-brand/60 hover:bg-secondary',
        className,
      )}
    >
      <Sun className="size-[18px] dark:hidden" />
      <Moon className="hidden size-[18px] dark:block" />
    </motion.button>
  )
}
