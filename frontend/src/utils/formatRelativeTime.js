// Fecha relativa fija en español (p. ej. "hace 5 minutos", "hace 2 días")

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural
}

/**
 * Calcula una etiqueta relativa en el instante `referenceTime`.
 * No usa Intl.RelativeTimeFormat para evitar granularidad de segundos.
 */
export function formatRelativeTime(value, referenceTime = Date.now()) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffSec = Math.floor((referenceTime - date.getTime()) / 1000)
  if (diffSec < 0) return 'ahora'
  if (diffSec < 60) return 'hace un momento'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) {
    return `hace ${diffMin} ${pluralize(diffMin, 'minuto', 'minutos')}`
  }

  const diffHour = Math.floor(diffSec / 3600)
  if (diffHour < 24) {
    return `hace ${diffHour} ${pluralize(diffHour, 'hora', 'horas')}`
  }

  const diffDay = Math.floor(diffSec / 86400)
  if (diffDay < 30) {
    return `hace ${diffDay} ${pluralize(diffDay, 'día', 'días')}`
  }

  const diffMonth = Math.floor(diffSec / (86400 * 30))
  if (diffMonth < 12) {
    return `hace ${diffMonth} ${pluralize(diffMonth, 'mes', 'meses')}`
  }

  const diffYear = Math.floor(diffSec / (86400 * 365))
  return `hace ${diffYear} ${pluralize(diffYear, 'año', 'años')}`
}

/**
 * Obtiene la fecha del comentario desde la respuesta de la API.
 */
export function getCommentDate(comment) {
  return comment?.created_at || comment?.fecha || null
}

/**
 * Devuelve la etiqueta relativa calculada una sola vez por comentario/fecha.
 * `cache` debe ser un Map persistente (p. ej. useRef().current).
 */
export function getFrozenRelativeTime(cache, commentId, date) {
  if (!date) return ''

  const key = `${commentId}:${date}`
  if (!cache.has(key)) {
    cache.set(key, formatRelativeTime(date))
  }

  return cache.get(key)
}
