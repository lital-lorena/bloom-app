import { useEffect } from 'react'
import BloomButton from './BloomButton'

export default function ConfirmModal({
  open,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-bloom-dark/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Cerrar"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-[0_16px_48px_-8px_rgba(255,95,168,0.25)]">
        <h2 id="confirm-modal-title" className="font-subtitle mb-3 text-xl text-bloom-dark">
          {title}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-bloom-gray">{message}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <BloomButton variant="secondary" className="sm:min-w-[7rem]" onClick={onCancel}>
            {cancelLabel}
          </BloomButton>
          <BloomButton variant="primary" className="sm:min-w-[7rem]" onClick={onConfirm}>
            {confirmLabel}
          </BloomButton>
        </div>
      </div>
    </div>
  )
}

