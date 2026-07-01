// Fecha relativa en español (p. ej. "hace 5 minutos")

export function formatRelativeTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
  const absSec = Math.abs(diffSec)
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'always' })

  if (absSec < 60) return rtf.format(diffSec, 'second')
  const diffMin = Math.round(diffSec / 60)
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute')
  const diffHour = Math.round(diffSec / 3600)
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour')
  const diffDay = Math.round(diffSec / 86400)
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day')
  const diffMonth = Math.round(diffSec / (86400 * 30))
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month')

  return rtf.format(Math.round(diffSec / (86400 * 365)), 'year')
}

/**
 * Obtiene la fecha del comentario desde la respuesta de la API.
 */
export function getCommentDate(comment) {
  return comment?.created_at || comment?.fecha || null
}
