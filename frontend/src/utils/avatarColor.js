// Color de avatar sin foto: HSL estable a partir del nombre

import { PLUM } from '../theme/bloomTheme'

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

/**
 * Genera fondo HSL y color de texto con buen contraste para el avatar sin foto.
 */
export function nameToAvatarStyle(name) {
  const normalized = (name || '?').trim().toLowerCase()
  const hash = hashString(normalized || '?')

  // Gama cálida acorde a Bloom (rosa → coral → melocotón)
  const hue = (330 + (hash % 55)) % 360
  const saturation = 58 + (hash % 14)
  const lightness = 46 + (hash % 9)

  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const color = lightness >= 52 ? PLUM : '#FFFFFF'

  return { backgroundColor, color }
}
