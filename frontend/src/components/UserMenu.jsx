import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const itemClass =
  'block w-full px-4 py-2.5 text-left text-sm font-medium text-bloom-dark transition-colors hover:bg-bloom-pink/10 hover:text-bloom-pink'

export default function UserMenu() {
  const { user, token, logout, updateUser } = useUser()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Cargar avatar actualizado desde el perfil
  useEffect(() => {
    if (!token) return

    let cancelled = false

    fetch('import.meta.env.VITE_API_URL/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return
        setImgError(false)
        updateUser({
          nombre: data.nombre,
          apellido: data.apellido,
          avatar: data.avatar,
          rol: data.rol,
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [token, updateUser])

  if (!token) return null

  const name = user?.nombre || 'Usuaria'
  const letter = name.trim().charAt(0).toUpperCase()
  const avatar = user?.avatar
  const showPhoto = Boolean(avatar) && !imgError

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full bg-bloom-pink ring-2 ring-bloom-pink/25 transition-opacity hover:opacity-90"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="MenÃº de usuario"
      >
        {showPhoto ? (
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-title text-sm font-semibold text-white">
            {letter}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-black/5 bg-white/95 py-1 shadow-lg backdrop-blur-sm"
        >
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              navigate('/profile')
              setOpen(false)
            }}
          >
            Mi perfil
          </button>
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              navigate('/feed')
              setOpen(false)
            }}
          >
            Feed
          </button>
          <div className="my-1 border-t border-black/10" role="separator" />
          <button type="button" role="menuitem" className={itemClass} onClick={handleLogout}>
            Cerrar sesiÃ³n
          </button>
        </div>
      )}
    </div>
  )
}

