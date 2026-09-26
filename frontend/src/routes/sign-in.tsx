import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { AuthLayout, GoogleIcon, OrDivider } from '#/components/auth-layout'
import { FadePresence } from '#/components/motion'
import { Alert } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError(result.error ?? 'Unable to sign in.')
        return
      }

      if (result.session?.access_token) {
        localStorage.setItem('access_token', result.session.access_token)
      }

      navigate({
        to: '/profile',
      })
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/google')
      const result = await response.json()

      console.log('Google OAuth result:', result)

      if (!response.ok || !result.url) {
        setError(result.error ?? 'Unable to sign in using Google')
        return
      }

      window.location.href = result.url
    } catch (error) {
      console.error('Google sign in failed:', error)
      setError('Unable to connect to the server.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up your revision where you left off."
      footer={
        <>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <FadePresence show={!!error}>
          <Alert variant="danger">{error}</Alert>
        </FadePresence>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <OrDivider />

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <GoogleIcon className="size-4" />
        Continue with Google
      </Button>
    </AuthLayout>
  )
}
