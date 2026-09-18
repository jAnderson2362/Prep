import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { Compass } from 'lucide-react'

import appCss from '../styles.css?url'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { PageTransition, Reveal } from '../components/motion'
import { PageShell } from '../components/page-shell'
import { Button } from '../components/ui/button'
import { ThemeProvider, themeInitScript } from '../lib/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Prep' },
      {
        name: 'description',
        content:
          'Learn, practise and sit realistic exams for every NCEA topic with Prep.',
      },
      { name: 'theme-color', content: '#81a3f8' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      },
    ],
    scripts: [{ children: themeInitScript }],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          {/* pt-16 offsets the fixed navbar; pages with a hero background pull
              themselves back up under it so the nav blends into the page. */}
          <PageTransition
            pageKey={pathname}
            className="flex flex-1 flex-col pt-16"
          >
            <Outlet />
          </PageTransition>
          <Footer />
        </div>
      </MotionConfig>
    </ThemeProvider>
  )
}

function NotFound() {
  return (
    <PageShell center tone="hero" width="narrow">
      <Reveal className="flex flex-col items-center text-center">
        <span className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand-soft text-primary">
          <Compass className="size-8" />
        </span>
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We couldn't find that page. It may have moved, or the link might be
          out of date.
        </p>
        <Button className="mt-8" size="lg" asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </Reveal>
    </PageShell>
  )
}
