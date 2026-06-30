import { useState, useRef, useEffect } from 'react'

export default function PostText({ text, className = '' }) {
  const [expanded, setExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    const el = textRef.current
    if (!el || expanded) return

    const checkTruncation = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 1)
    }

    checkTruncation()
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [text, expanded])

  if (!text) return null

  return (
    <div>
      <p
        ref={textRef}
        className={`whitespace-pre-wrap text-base leading-relaxed text-bloom-dark ${!expanded ? 'line-clamp-3' : ''} ${className}`}
      >
        {text}
      </p>
      {!expanded && isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 text-sm font-semibold text-bloom-pink transition-colors hover:text-bloom-rose"
        >
          Seguir leyendo ↓
        </button>
      )}
      {expanded && isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-2 text-sm font-semibold text-bloom-pink transition-colors hover:text-bloom-rose"
        >
          Ver menos ↑
        </button>
      )}
    </div>
  )
}
