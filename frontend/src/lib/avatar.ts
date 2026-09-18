/**
 * Profile picture stored in the browser until a backend endpoint exists.
 * Images are resized to a small square data URL to keep storage light.
 */

export const AVATAR_STORAGE_KEY = 'prep-avatar'
export const AVATAR_CHANGE_EVENT = 'prep-avatar-change'

const AVATAR_SIZE = 256
const MAX_FILE_BYTES = 5 * 1024 * 1024

export function getStoredAvatar(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(AVATAR_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredAvatar(dataUrl: string | null) {
  try {
    if (dataUrl) {
      localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl)
    } else {
      localStorage.removeItem(AVATAR_STORAGE_KEY)
    }
  } catch {
    // storage may be unavailable or full
  }
  window.dispatchEvent(new Event(AVATAR_CHANGE_EVENT))
}

/**
 * Reads an image file, centre-crops it to a square and returns a data URL.
 */
export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Please choose an image smaller than 5 MB.')
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('That image could not be read.'))
      img.src = objectUrl
    })

    const side = Math.min(image.width, image.height)
    const sx = (image.width - side) / 2
    const sy = (image.height - side) / 2

    const canvas = document.createElement('canvas')
    canvas.width = AVATAR_SIZE
    canvas.height = AVATAR_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Unable to process the image.')
    ctx.drawImage(image, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)

    return canvas.toDataURL('image/jpeg', 0.85)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
