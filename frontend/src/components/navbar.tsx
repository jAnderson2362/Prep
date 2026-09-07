import { useState, useEffect } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setIsLoggedIn(!!token)
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
    navigate({ to: "/" })
  }
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#81a3f8] px-5 py-4 shadow-sm lg:px-8 xl:px-[8%]">
      {/* Logo placeholder*/}
      <Link to="/" className="font-bold text-lg w-28">
        PREP
      </Link>

      {/* Nav */}
      <ul className="hidden md:flex items-center gap-8 rounded-full px-12 py-3">
        <li>
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/subject-selection"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            Subject Selection
          </Link>
        </li>
        <li>
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            Community
          </Link>
        </li>
        <li>
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'border-b-2 border-blue-600 text-blue-600',
            }}
            inactiveProps={{
              className: 'hover:text-blue-600',
            }}
          >
            Contact
          </Link>
        </li>
        <li>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              activeProps={{
                className: 'border-b-2 border-blue-600 text-blue-600',
              }}
              inactiveProps={{
                className: 'hover:text-blue-600',
              }}
            >
              Dashboard
            </Link>
          )}
        </li>
      </ul>

      <div className="flex items-center gap-4 min-w-[220px] justify-end">
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            className="text-sm bg-black text-white hover:text-blue border border-zinc-700 px-3 py-1.5 rounded"
          >
            Sign out
          </button>
        ) : (
          <>
            <Link
              to="/sign-in"
              className="text-sm bg-white text-black hover:text-blue border border-zinc-700 px-3 py-1.5 rounded"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm bg-black text-white hover:text-blue border border-zinc-700 px-3 py-1.5 rounded"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile borgir button */}
      <button className="md:hidden" onClick={() => setMenuOpen(true)}>
        ☰
      </button>

      {/* Mobile Nav */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-[#81a3f8] transition-transform duration-300 md:hidden
                ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        <div className="flex flex-col gap-6 mt-20 px-6">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Features
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Community
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
