// Fecha relativa en español (p. ej. "hace 5 minutos")

export function formatRelativeTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 0) return 'ahora'
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'always' })

  // Sin granularidad de segundos: evita textos que cambian en cada render
  if (diffSec < 60) return 'hace un momento'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return rtf.format(-diffMin, 'minute')
  const diffHour = Math.floor(diffSec / 3600)
  if (diffHour < 24) return rtf.format(-diffHour, 'hour')
  const diffDay = Math.floor(diffSec / 86400)
  if (diffDay < 30) return rtf.format(-diffDay, 'day')
  const diffMonth = Math.floor(diffSec / (86400 * 30))
  if (diffMonth < 12) return rtf.format(-diffMonth, 'month')

  return rtf.format(-Math.floor(diffSec / (86400 * 365)), 'year')
}

/**
 * Obtiene la fecha del comentario desde la respuesta de la API.
 */
export function getCommentDate(comment) {
  return comment?.created_at || comment?.fecha || null
}
