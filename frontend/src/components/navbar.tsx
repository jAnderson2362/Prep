import { useEffect, useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { Menu, X } from 'lucide-react'

import { cn } from '#/lib/utils'
import { Avatar, useAvatar } from './avatar'
import { Button } from './ui/button'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

type NavItem = {
  label: string
  to: '/' | '/about' | '/products' | '/subject-selection' | '/dashboard'
  /** Only show when signed in. */
  auth?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Subjects', to: '/subject-selection' },
  { label: 'Community', to: '/' },
  { label: 'Dashboard', to: '/dashboard', auth: true },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const avatar = useAvatar()

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleSignOut = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    setMenuOpen(false)
    navigate({ to: '/' })
  }

  const visibleItems = NAV_ITEMS.filter((item) => !item.auth || isLoggedIn)
  // Only the first item matching the path is "active" (Community currently
  // points at "/" as a placeholder, so it must not light up alongside Home).
  const activeLabel = visibleItems.find((item) => item.to === pathname)?.label

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full border-b transition-[border-color,box-shadow,background-color] duration-300',
          scrolled
            ? 'glass border-border shadow-soft'
            : 'border-transparent bg-background/0',
        )}
      >
        <nav
          aria-label="Main"
          className="grid h-16 w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 sm:px-6"
        >
          <div className="justify-self-start">
            <Logo />
          </div>

          {/* Desktop nav (true centre column) */}
          <ul className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-soft backdrop-blur lg:flex">
            {visibleItems.map((item) => {
              const isActive = item.label === activeLabel
              return (
                <li key={item.label} className="relative">
                  <Link
                    to={item.to}
                    className={cn(
                      'relative z-10 inline-flex h-8 items-center justify-center rounded-full px-4 text-sm leading-none font-medium transition-colors',
                      isActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-primary shadow-soft"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 justify-self-end sm:gap-3">
            <ThemeToggle />

            <div className="hidden items-center gap-2 lg:flex">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign out
                  </Button>
                  <Link
                    to="/profile"
                    aria-label="Profile"
                    title="Profile"
                    className="rounded-full shadow-soft transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-95"
                  >
                    <Avatar src={avatar} icon className="size-10" />
                  </Link>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Get started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,85vw)] flex-col border-l border-border bg-card shadow-lift lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <Logo onClick={() => setMenuOpen(false)} />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <X />
                </Button>
              </div>

              <motion.ul
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                  },
                }}
              >
                {visibleItems.map((item) => {
                  const isActive = item.label === activeLabel
                  return (
                    <motion.li
                      key={item.label}
                      variants={{
                        hidden: { opacity: 0, x: 16 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted',
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  )
                })}
              </motion.ul>

              <div className="flex flex-col gap-2 border-t border-border p-4">
                {isLoggedIn ? (
                  <>
                    <Button asChild>
                      <Link to="/profile" onClick={() => setMenuOpen(false)}>
                        Profile
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register" onClick={() => setMenuOpen(false)}>
                        Get started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
