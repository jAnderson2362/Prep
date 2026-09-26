import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { AuthLayout, GoogleIcon, OrDivider } from '#/components/auth-layout'
import { FadePresence } from '#/components/motion'
import { Alert } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/auth/sign_up', {
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
        setError(result.error ?? 'Unable to create account.')
        return
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
        setError(result.error ?? 'Unable to register with Google.')
        return
      }

      window.location.href = result.url
    } catch (error) {
      console.error('Google registration failed:', error)
      setError('Unable to register with Google.')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Free to start. Pick your first topic in under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5">
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <FadePresence show={!!error}>
          <Alert variant="danger">{error}</Alert>
        </FadePresence>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? 'Creating Account...' : 'Create Account'}
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
