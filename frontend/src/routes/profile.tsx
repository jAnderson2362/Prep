import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  CalendarDays,
  Camera,
  KeyRound,
  Loader2,
  Mail,
  Trash2,
  UserRound,
} from 'lucide-react'

import { Avatar, useAvatar } from '#/components/avatar'
import { fileToAvatarDataUrl, setStoredAvatar } from '#/lib/avatar'
import { FadePresence, Reveal, Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell } from '#/components/page-shell'
import { Alert } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  const [displayName, setDisplayName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const response = await fetch('http://localhost:8000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        setError('Failed to load profile')
        return
      }

      setEmail(result.email)
      setCreatedAt(result.created_at)
      setDisplayName(result.display_name || '')
    } catch {
      setError('Unable to load profile.')
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')

    if (accessToken) {
      localStorage.setItem('access_token', accessToken)

      window.history.replaceState({}, document.title, window.location.pathname)
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    console.log('Save button clicked')

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/auth/update_profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            display_name: displayName,
          }),
        },
      )

      console.log('Response:', response)

      setSuccess('Profile updated successfully!')
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const handleChangePassword = async () => {
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/auth/change_password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            new_password: newPassword,
          }),
        },
      )

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        return
      }

      setSuccess('Password changed successfully!')
    } catch {
      setError('Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U'

  const avatar = useAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError('')
    setSuccess('')

    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      setStoredAvatar(dataUrl)
      setSuccess('Profile picture updated!')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update profile picture.',
      )
    }
  }

  const handleAvatarRemove = () => {
    setStoredAvatar(null)
    setError('')
    setSuccess('Profile picture removed.')
  }

  return (
    <PageShell tone="hero">
      <PageHeader
        eyebrow="Account"
        title="User Profile"
        description="Manage your display name and keep your account secure."
      />

      <FadePresence show={!!success} className="mb-6">
        <Alert variant="success">{success}</Alert>
      </FadePresence>
      <FadePresence show={!!error} className="mb-6">
        <Alert variant="danger">{error}</Alert>
      </FadePresence>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Identity card */}
        <Reveal delay={0.05}>
          <Card variant="soft" className="h-full">
            <CardContent className="flex h-full flex-col items-center justify-evenly gap-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute inset-0 -m-1 rounded-full bg-brand/20 blur-sm"
                  />
                  <Avatar
                    src={avatar}
                    initial={initial}
                    className="size-28 text-5xl shadow-soft"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile picture"
                    title="Change profile picture"
                    className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full border-2 border-card bg-card text-foreground shadow-soft transition-colors hover:bg-secondary"
                  >
                    <Camera className="size-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera />
                    Change photo
                  </Button>
                  {avatar && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarRemove}
                      aria-label="Remove profile picture"
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-2xl font-bold">{displayName || 'Your name'}</p>

              <dl className="w-full space-y-3 text-left text-sm">
                <div className="flex items-start gap-3 rounded-xl bg-card p-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-muted-foreground">
                      Email
                    </dt>
                    <dd className="truncate font-medium">
                      {email || 'Not Available'}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-card p-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-muted-foreground">
                      Account Created
                    </dt>
                    <dd className="truncate font-medium">
                      {createdAt || 'Not Available'}
                    </dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>
        </Reveal>

        <Stagger className="space-y-6" stagger={0.1} delay={0.1}>
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="size-4 text-primary" />
                  Display Name
                </CardTitle>
                <CardDescription>
                  This is how you'll appear across Prep.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                />
                <Button
                  className="mt-4"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Use at least 8 characters with a mix of letters and numbers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-new-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </StaggerItem>
        </Stagger>
      </div>
    </PageShell>
  )
}
