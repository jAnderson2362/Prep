import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'

import { AVATAR_CHANGE_EVENT, getStoredAvatar } from '#/lib/avatar'
import { cn } from '#/lib/utils'

/**
 * Subscribes to the locally stored profile picture. Returns null on the
 * server and until mounted, so server and client markup match.
 */
export function useAvatar() {
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => setAvatar(getStoredAvatar())
    sync()
    window.addEventListener(AVATAR_CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(AVATAR_CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return avatar
}

type AvatarProps = {
  src?: string | null
  /** Fallback initial shown when there is no picture. */
  initial?: string
  className?: string
  /** Show a generic person icon instead of the initial as the fallback. */
  icon?: boolean
}

export function Avatar({ src, initial, className, icon = false }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground',
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          draggable={false}
        />
      ) : icon ? (
        <UserRound className="size-[45%]" />
      ) : (
        <span className="font-extrabold">{initial ?? 'U'}</span>
      )}
    </span>
  )
}
