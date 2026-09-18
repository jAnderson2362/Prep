import { Link } from '@tanstack/react-router'

import { Logo } from './logo'

const columns: {
  heading: string
  links: {
    label: string
    to?: '/' | '/about' | '/subject-selection'
    href?: string
  }[]
}[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', to: '/' },
      { label: 'Pricing', to: '/' },
      { label: 'Subjects', to: '/subject-selection' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Study Guides', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Support', to: '/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  },
  {
    heading: 'Social',
    links: [
      { label: 'Discord', href: 'https://discord.com' },
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'TikTok', href: 'https://tiktok.com' },
    ],
  },
]

const linkClass =
  'text-sm text-muted-foreground transition-colors hover:text-foreground'

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/70 dark:bg-card">
      <div className="container-prep py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))] md:gap-8">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Learn, practise and sit realistic exams for every NCEA topic. Your
              exam, mastered.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-foreground uppercase">
                {column.heading}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={linkClass}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to ?? '/'} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Prep. All rights reserved.</p>
          <p className="text-xs">Made in Aotearoa New Zealand.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
