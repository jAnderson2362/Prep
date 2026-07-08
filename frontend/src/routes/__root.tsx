import { HeadContent, Outlet, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Prep Frontend' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
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
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <div>
      <div>Nav Bar</div>
      <main>
        <Outlet />
      </main>
      <div>Footer</div>
    </div>
  )
}

function NotFound() {
  return (
    <div>
      <h1>
        Page not found
      </h1>
      <Link to="/">Go back home</Link>
    </div>
  )
}
