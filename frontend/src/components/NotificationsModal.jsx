import { useEffect } from 'react'
import BloomButton from './BloomButton'

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function NotificationBell({ count = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-bloom-pink transition-colors hover:bg-bloom-pink/10"
      aria-label={`Notificaciones${count > 0 ? `, ${count} sin leer` : ''}`}
    >
      <BellIcon />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bloom-pink px-1 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

export default function NotificationsModal({
  open,
  notifications = [],
  onClose,
  onSelect,
  onClearAll,
}) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-24 sm:items-center sm:pt-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-bloom-dark/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative flex max-h-[min(32rem,calc(100vh-6rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_16px_48px_-8px_rgba(255,95,168,0.25)]">
        <div className="border-b border-black/5 px-6 py-4">
          <h2 id="notifications-modal-title" className="font-subtitle text-xl text-bloom-dark">
            Notificaciones
          </h2>
          {notifications.length > 0 && (
            <p className="mt-1 text-sm text-bloom-gray">
              {notifications.length} {notifications.length === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {notifications.length === 0 ? (
            <div className="px-2 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bloom-pink/10 text-bloom-pink">
                <BellIcon />
              </div>
              <p className="text-sm text-bloom-gray">No tienes notificaciones nuevas.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(notification)}
                    className="w-full rounded-xl bg-gradient-to-r from-white to-bloom-pink/20 px-4 py-3 text-left transition-colors hover:to-bloom-pink/30"
                  >
                    <p className="text-sm leading-relaxed text-bloom-dark">{notification.mensaje}</p>
                    <span className="mt-1 inline-block text-xs font-medium text-bloom-pink">
                      Ver comentarios â†’
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-black/5 px-6 py-4 sm:flex-row sm:justify-end">
          {notifications.length > 0 && (
            <BloomButton variant="secondary" onClick={onClearAll}>
              Marcar todas como leÃ­das
            </BloomButton>
          )}
          <BloomButton variant="primary" onClick={onClose}>
            Cerrar
          </BloomButton>
        </div>
      </div>
    </div>
  )
}

