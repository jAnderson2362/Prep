import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // This useEffect only runs in the browser, never on the server.
    // So it's safe to touch localStorage here.
    const stored = localStorage.getItem("access_token")
    setToken(stored)
    setChecked(true)

    if (!stored) {
      navigate({ to: '/sign-in' })
    }
  }, [navigate])

  if (!checked) {
    return null
  }

  if (!token) {
    return null
  }

  return <>{children}</>
}