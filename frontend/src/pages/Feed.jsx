import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import CommentList from '../components/CommentList'
import UserMenu from '../components/UserMenu'
import BloomLogo from '../components/BloomLogo'
import ConfirmModal from '../components/ConfirmModal'
import NotificationsModal, { NotificationBell } from '../components/NotificationsModal'
import PostText from '../components/PostText'
import Avatar from '../components/Avatar'
import socket from '../socket'
import { API_URL } from '../config/api'
import { IMAGE_ACCEPT, validateImageFile } from '../utils/validateImage'

import { PURPLE, PLUM, GRAY, CREAM } from '../theme/bloomTheme'

function PeachTag({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full bg-gradient-to-r from-bloom-pink via-bloom-rose to-bloom-coral px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80 ${className}`}
    >
      {children}
    </button>
  )
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Solo UI: mismo comportamiento que un <select>, con estilo Bloom
function BloomDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const [menuRect, setMenuRect] = useState(null)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const updateMenuRect = () => {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const maxHeight = 240
    const spaceBelow = window.innerHeight - rect.bottom - 8
    const spaceAbove = rect.top - 8
    const openUpward = spaceBelow < 120 && spaceAbove > spaceBelow

    setMenuRect({
      left: rect.left,
      width: rect.width,
      top: openUpward ? undefined : rect.bottom + 4,
      bottom: openUpward ? window.innerHeight - rect.top + 4 : undefined,
      maxHeight: openUpward ? Math.min(maxHeight, spaceAbove) : Math.min(maxHeight, Math.max(spaceBelow, 120)),
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return
      }
      setOpen(false)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    if (open) {
      updateMenuRect()
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', onKeyDown)
      window.addEventListener('scroll', updateMenuRect, true)
      window.addEventListener('resize', updateMenuRect)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', updateMenuRect, true)
      window.removeEventListener('resize', updateMenuRect)
    }
  }, [open])

  const selected = options.find((option) => option.value === value)

  const menu = open && menuRect
    ? createPortal(
        <div
          ref={menuRef}
          role="listbox"
          className="overflow-y-auto rounded-xl border border-black/5 bg-white py-1 shadow-lg"
          style={{
            position: 'fixed',
            left: menuRect.left,
            width: menuRect.width,
            top: menuRect.top,
            bottom: menuRect.bottom,
            maxHeight: menuRect.maxHeight,
            zIndex: 200,
          }}
        >
          {options.map((option) => (
            <button
              key={option.value || '__empty__'}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-bloom-dark transition-colors hover:bg-bloom-pink/10 hover:text-bloom-pink"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )
    : null

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 pr-10 text-left text-sm font-medium text-bloom-dark transition-colors hover:border-bloom-pink/40 focus:border-bloom-pink focus:outline-none focus:ring-2 focus:ring-bloom-pink/20 ${open ? 'border-bloom-pink ring-2 ring-bloom-pink/20' : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected?.label}
      </button>
      <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bloom-pink transition-transform ${open ? 'rotate-180' : ''}`}>
        <ChevronDownIcon />
      </span>
      {menu}
    </div>
  )
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return String(value ?? "")
  }
}

function quitarEmojiInicial(texto) {
  return texto.replace(/^[\s\p{Emoji}\p{Emoji_Presentation}\p{Extended_Pictographic}]+/u, "").trim()
}

function InspiracionCard({ inspiracion, loading, error, onUsar, onOtra, className = "" }) {
  const mensajeError = error === "rate_limit"
    ? "Has agotado las ideas de hoy por ahora. Vuelve en unos minutos e inténtalo de nuevo."
    : "No pudimos generar una idea ahora. Inténtalo de nuevo."

  return (
    <div className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm ${className}`}>
      <h3 className="mb-3 font-subtitle text-sm font-semibold" style={{ color: PLUM }}>
        💡 ¿Sin ideas hoy?
      </h3>
      {loading ? (
        <p className="text-sm leading-relaxed" style={{ color: GRAY }}>Generando una idea para ti...</p>
      ) : inspiracion ? (
        <>
          <p className="text-sm leading-relaxed font-medium" style={{ color: PLUM }}>{inspiracion}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row xl:flex-col">
            <button
              type="button"
              onClick={onUsar}
              className="w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              ✨ Usar esta idea
            </button>
            <button
              type="button"
              onClick={onOtra}
              disabled={loading}
              className="w-full rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: `${PURPLE}44`, color: PURPLE }}
            >
              → Otra idea
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{mensajeError}</p>
          {error !== "rate_limit" && (
            <button
              type="button"
              onClick={onOtra}
              className="mt-3 w-full rounded-full border px-4 py-2 text-sm font-medium hover:bg-black/5"
              style={{ borderColor: `${PURPLE}44`, color: PURPLE }}
            >
              → Intentar de nuevo
            </button>
          )}
        </>
      )}
    </div>
  )
}

function Feed() {
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [text, setText] = useState("")
  const [postImage, setPostImage] = useState(null)
  const [postImageError, setPostImageError] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const { token, user, updateUser } = useUser()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [editSuggestion, setEditSuggestion] = useState("")
  const [editSuggestLoading, setEditSuggestLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [filtroTema, setFiltroTema] = useState(null)
  const [filtroPais, setFiltroPais] = useState(null)
  const [filtroCiudad, setFiltroCiudad] = useState(null)
  const [resumen, setResumen] = useState("")
  const [inspiracion, setInspiracion] = useState("")
  const [inspiracionLoading, setInspiracionLoading] = useState(false)
  const [inspiracionError, setInspiracionError] = useState(null)
  const [pendingModerationPostId, setPendingModerationPostId] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [comentariosAbiertos, setComentariosAbiertos] = useState({})
  const [comentarios, setComentarios] = useState({})
  const [nuevoComentario, setNuevoComentario] = useState({})
  const [notificaciones, setNotificaciones] = useState([])
  const comentariosAbiertosRef = useRef({})
  const crearPostRef = useRef(null)
  const postTextareaRef = useRef(null)

  const paisesDisponibles = [...new Set(posts.map(p => p.autora.pais).filter(Boolean).map(p => p.trim()))]
  const ciudadesDisponibles = [...new Set(
    posts
      .filter(p => !filtroPais || p.autora.pais?.trim() === filtroPais)
      .map(p => p.autora.ciudad)
      .filter(Boolean)
      .map(c => c.trim())
  )]

  const postImagePreview = useMemo(
    () => (postImage ? URL.createObjectURL(postImage) : null),
    [postImage]
  )

  useEffect(() => {
    return () => { if (postImagePreview) URL.revokeObjectURL(postImagePreview) }
  }, [postImagePreview])

  const fetchInspiracion = async () => {
    if (!token) return
    setInspiracionLoading(true)
    setInspiracionError(null)
    try {
      const response = await fetch(`${API_URL}/api/ai/inspiracion`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.error === "rate_limit") {
          setInspiracion("")
          setInspiracionError("rate_limit")
        } else if (data.pregunta) {
          setInspiracion(data.pregunta)
          setInspiracionError(null)
        } else {
          setInspiracion("")
          setInspiracionError("unavailable")
        }
      }
    } catch {
      setInspiracion("")
      setInspiracionError("unavailable")
    } finally {
      setInspiracionLoading(false)
    }
  }

  const handleUsarInspiracion = () => {
    if (!inspiracion) return
    const textoLimpio = quitarEmojiInicial(inspiracion)
    if (!textoLimpio) return
    setText(textoLimpio.charAt(0).toUpperCase() + textoLimpio.slice(1))
    setSuggestion("")
    requestAnimationFrame(() => {
      if (window.innerWidth < 1280) {
        crearPostRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      postTextareaRef.current?.focus()
    })
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true)
      try {
        const response = await fetch(`${API_URL}/api/posts`)
        const data = await response.json()
        setPosts(data)
      } finally {
        setPostsLoading(false)
      }
    }
    const fetchProfile = async () => {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        if (data.rol) updateUser({ rol: data.rol })
      }
    }
    const fetchResumen = async () => {
      const response = await fetch(`${API_URL}/api/ai/resumen`)
      if (response.ok) {
        const data = await response.json()
        setResumen(data.resumen)
      }
    }
    fetchPosts()
    fetchResumen()
    if (token) fetchProfile()
  }, [])

  useEffect(() => {
    if (token) fetchInspiracion()
  }, [token])

  useEffect(() => {
    if (!token) return

    socket.on("connect", () => {
      console.log("✅ Socket listo, enviando token...")
      socket.emit("conectar_usuaria", { token })
    })

    socket.on("nueva_notificacion", (data) => {
      console.log("🔔 Notificacion recibida:", data)
      setNotificaciones(prev => [{ ...data, id: `${Date.now()}-${data.post_id}` }, ...prev])

      const postId = Number(data.post_id)
      if (postId) {
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, comments_count: (post.comments_count || 0) + 1 }
            : post
        ))
        if (comentariosAbiertosRef.current[postId]) {
          fetchComentarios(postId)
        }
      }
    })
    socket.connect()  // ←  connect() va AL FINAL, después de registrar los listeners

    return () => {
      socket.off("connect")
      socket.off("nueva_notificacion")
      socket.disconnect()
    }
  }, [token])

  const handlePostImageChange = (e) => {
    const input = e.target
    const files = input.files
    if (!files || files.length === 0) return

    const result = validateImageFile(files[0], files.length)
    if (!result.ok) {
      setPostImageError(result.error)
      input.value = ""
      return
    }

    setPostImageError("")
    setPostImage(result.file)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!text.trim() && !postImage) return

    if (postImage) {
      const result = validateImageFile(postImage)
      if (!result.ok) {
        setPostImageError(result.error)
        return
      }
    }

    setPostLoading(true)
    try {
      let response
      if (postImage) {
        const formData = new FormData()
        formData.append("texto", text)
        formData.append("image", postImage)
        response = await fetch(`${API_URL}/api/posts`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        })
      } else {
        response = await fetch(`${API_URL}/api/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ texto: text })
        })
      }
      if (response.ok) {
        setText("")
        setPostImage(null)
        setPostImageError("")
        setSuggestion("")
        const updatedResponse = await fetch(`${API_URL}/api/posts`)
        const updatedPosts = await updatedResponse.json()
        setPosts(updatedPosts)
      }
    } finally {
      setPostLoading(false)
    }
  }

  const isAdmin = profile?.rol === "admin"

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== postId))
      } else {
        const data = await response.json().catch(() => ({}))
        const msg = data.error || "No se pudo eliminar el post."
        window.alert(
          profile?.rol === "admin"
            ? `${msg} Reinicia Flask (python run.py) si acabas de actualizar el backend.`
            : `${msg} Solo la cuenta admin (lorenalugosanchez3@gmail.com) puede moderar posts ajenos.`
        )
      }
    } catch {
      window.alert("No se pudo conectar con el servidor. Comprueba que Flask esté en marcha.")
    }
  }

  const handleLike = async (postId, likedByMe) => {
    const method = likedByMe ? "DELETE" : "POST"
    const response = await fetch(`${API_URL}/api/likes/${postId}`, {
      method,
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (response.ok) {
      const data = await response.json()
      setPosts(posts.map((post) =>
        post.id === postId ? { ...post, likes_count: data.likes, liked_by_me: !likedByMe } : post
      ))
    }
  }

  const fetchComentarios = async (postId) => {
    const response = await fetch(`${API_URL}/api/comments/${postId}`)
    if (response.ok) {
      const data = await response.json()
      setComentarios(prev => ({ ...prev, [postId]: data }))
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, comments_count: data.length } : post
      ))
    }
  }

  const abrirPostDesdeNotificacion = (postId) => {
    const id = Number(postId)
    if (!id) return

    setComentariosAbiertos(prev => ({ ...prev, [id]: true }))
    comentariosAbiertosRef.current[id] = true
    fetchComentarios(id)

    setTimeout(() => {
      document.getElementById(`post-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }

  const handleComentario = async (postId) => {
    const texto = nuevoComentario[postId] || ""
    if (!texto.trim()) return
    const response = await fetch(`${API_URL}/api/comments/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ contenido: texto })
    })
    if (response.ok) {
      const nuevo = await response.json()
      setComentarios(prev => ({ ...prev, [postId]: [...(prev[postId] || []), nuevo] }))
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, comments_count: (post.comments_count || 0) + 1 } : post
      ))
      setNuevoComentario(prev => ({ ...prev, [postId]: "" }))
    }
  }

  const toggleComentarios = (postId) => {
    const nuevoEstado = !comentariosAbiertos[postId]
    setComentariosAbiertos(prev => ({ ...prev, [postId]: nuevoEstado }))
    comentariosAbiertosRef.current[postId] = nuevoEstado
    if (!comentariosAbiertos[postId]) fetchComentarios(postId)
  }

  const handleCommentsChange = (postId, updated) => {
    setComentarios(prev => ({ ...prev, [postId]: updated }))
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, comments_count: updated.length } : post
    ))
  }

  const handleEditPost = async (postId) => {
    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ texto: editText })
    })
    if (response.ok) {
      setPosts(posts.map((post) => post.id === postId ? { ...post, texto: editText } : post))
      setEditingId(null)
      setEditText("")
    }
  }

  const handleSuggest = async () => {
    if (!text.trim()) return
    setSuggestLoading(true)
    setSuggestion("")
    try {
      const response = await fetch(`${API_URL}/api/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ texto: text })
      })
      const data = await response.json()
      setSuggestion(response.ok ? data.sugerencia : (data.error || "No se pudo generar una sugerencia."))
    } catch {
      setSuggestion("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setSuggestLoading(false)
    }
  }

  const handleEditSuggest = async () => {
    if (!editText.trim()) return
    setEditSuggestLoading(true)
    setEditSuggestion("")
    try {
      const response = await fetch(`${API_URL}/api/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ texto: editText })
      })
      const data = await response.json()
      setEditSuggestion(response.ok ? data.sugerencia : (data.error || "No se pudo generar una sugerencia."))
    } catch {
      setEditSuggestion("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setEditSuggestLoading(false)
    }
  }

  const isError = (text) =>
    text.startsWith("Error") || text.startsWith("Tu publicación") || text.startsWith("El texto") || text.startsWith("No se pudo")

  return (
    <div className="min-h-screen font-[family-name:var(--font-body)]" style={{ backgroundColor: CREAM, color: PLUM }}>

      {/* ── NAVBAR ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 shadow-lg backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2">
          <a href="/" className="flex items-center">
            <BloomLogo className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            {token && isAdmin && (
              <span className="inline-flex rounded-full bg-gradient-to-r from-bloom-pink via-bloom-rose to-bloom-coral px-3 py-1 text-xs font-semibold text-white">
                Admin
              </span>
            )}

            {/* Notificaciones */}
            <NotificationBell
              count={notificaciones.length}
              onClick={() => setNotificationsOpen(true)}
            />

            <UserMenu />
          </div>
        </nav>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="mx-auto flex max-w-6xl gap-6 px-5 pb-8 pt-16">

        {/* ── SIDEBAR IZQUIERDA ── */}
        <aside className="hidden w-72 flex-none lg:block">

          {/* Tarjeta de perfil */}
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <Avatar name={profile?.nombre || user?.nombre} size="lg" foto={profile?.avatar || user?.avatar} />
              <h2 className="mt-3 font-title text-lg font-semibold" style={{ color: PLUM }}>
                {profile?.nombre || user?.nombre || "Usuaria"}
              </h2>
              {(profile?.ciudad || user?.ciudad) && (
                <p className="mt-1 text-xs" style={{ color: GRAY }}>
                  {profile?.ciudad || user?.ciudad}{(profile?.pais || user?.pais) ? `, ${profile?.pais || user?.pais}` : ""}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 w-full rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
              style={{ borderColor: `${PURPLE}44`, color: PURPLE }}
            >
              Ver mi perfil
            </button>
          </div>

          {/* Temas */}
          <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-subtitle text-sm font-semibold" style={{ color: PLUM }}>Temas para ti</h3>
            <div className="flex flex-wrap gap-2">
              {["Cambio Profesional", "Nuevos Comienzos", "Habilidades Transferibles", "Confianza Profesional", "Aprendizaje Continuo", "Entrevistas Laborales", "Emprendimiento", "Logros y Avances"].map((tag) => (
                <PeachTag key={tag} onClick={() => setFiltroTema(tag)}>
                  {tag}
                </PeachTag>
              ))}
            </div>
          </div>

          {/* Filtro por ubicación */}
          <div className="mt-5 rounded-2xl border border-black/5 bg-white shadow-[0_16px_48px_-8px_rgba(255,95,168,0.15)]">
            <div className="rounded-t-2xl border-b border-black/5 bg-gradient-to-r from-white to-bloom-pink/10 px-5 py-4">
              <h3 className="font-subtitle flex items-center gap-2.5 text-sm font-semibold text-bloom-dark">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bloom-pink/10 text-bloom-pink">
                  <LocationIcon />
                </span>
                Filtrar por ubicación
              </h3>
            </div>
            <div className="flex flex-col gap-3 p-5">
              <BloomDropdown
                value={filtroPais || ''}
                onChange={(val) => { setFiltroPais(val || null); setFiltroCiudad(null) }}
                options={[
                  { value: '', label: 'Todos los países' },
                  ...paisesDisponibles.map((pais) => ({ value: pais, label: pais })),
                ]}
              />
              {filtroPais && (
                <BloomDropdown
                  value={filtroCiudad || ''}
                  onChange={(val) => setFiltroCiudad(val || null)}
                  options={[
                    { value: '', label: 'Todas las ciudades' },
                    ...ciudadesDisponibles.map((ciudad) => ({ value: ciudad, label: ciudad })),
                  ]}
                />
              )}
            </div>
          </div>

        </aside>

        {/* ── COLUMNA CENTRAL ── */}
        <div className="min-w-0 flex-1">

          <div className="mb-6">
            <h1 className="font-title text-3xl font-semibold" style={{ color: PLUM }}>Comunidad</h1>
            <p className="mt-1 text-sm" style={{ color: GRAY }}>Comparte tu historia. Alguien aquí ha pasado por lo mismo.</p>
          </div>

          {/* ── CREAR POST ── */}
          <section ref={crearPostRef} className="mb-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <form onSubmit={handleCreatePost}>
              <div className="flex gap-3">
                <Avatar name={profile?.nombre || user?.nombre} foto={profile?.avatar || user?.avatar} />
                <textarea
                  ref={postTextareaRef}
                  value={text}
                  onChange={(e) => { const val = e.target.value; setText(val.charAt(0).toUpperCase() + val.slice(1)) }}
                  placeholder="¿Qué quieres compartir hoy?"
                  rows={3}
                  className="min-h-[72px] w-full resize-none rounded-xl bg-transparent text-base leading-relaxed outline-none placeholder:text-[#9CA3AF]"
                  style={{ color: PLUM }}
                />
              </div>

              {suggestion && (
                <div
                  className="mt-4 rounded-xl border p-4"
                  style={{
                    borderColor: isError(suggestion) ? "#dc262633" : `${PURPLE}33`,
                    backgroundColor: isError(suggestion) ? "#dc26260D" : `${PURPLE}0D`
                  }}
                >
                  <p className="mb-3 text-sm leading-relaxed" style={{ color: PLUM }}>{suggestion}</p>
                  {!isError(suggestion) && (
                    <button type="button" onClick={() => { setText(suggestion); setSuggestion("") }}
                      className="text-sm font-semibold hover:opacity-70" style={{ color: PURPLE }}>
                      Usar esta sugerencia
                    </button>
                  )}
                </div>
              )}

              {postImagePreview && (
                <div className="relative mt-4">
                  <img src={postImagePreview} alt="Vista previa" className="block w-full h-auto rounded-xl border border-black/5" />
                  <button type="button" onClick={() => { setPostImage(null); setPostImageError("") }}
                    className="absolute -right-2 -top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                    ✕
                  </button>
                </div>
              )}

              {postImageError && (
                <p className="mt-3 text-sm text-red-600" role="alert">
                  {postImageError}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5" style={{ color: PLUM }}>
                  <CameraIcon /> Añadir foto
                  <input type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={handlePostImageChange} />
                </label>
                <button type="button" onClick={handleSuggest} disabled={suggestLoading || !text.trim()}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderColor: `${PURPLE}66`, color: PURPLE }}>
                  <SparkleIcon /> {suggestLoading ? "Pensando..." : "Sugerencia"}
                </button>
                <button type="submit" disabled={postLoading || (!text.trim() && !postImage)}
                  className="ml-auto rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: PURPLE }}>
                  {postLoading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </form>
          </section>

          {token && (
            <InspiracionCard
              className="mb-6 xl:hidden"
              inspiracion={inspiracion}
              loading={inspiracionLoading}
              error={inspiracionError}
              onUsar={handleUsarInspiracion}
              onOtra={fetchInspiracion}
            />
          )}

          {/* ── POSTS ── */}
          <div className="flex flex-col gap-4">
            {postsLoading && (
              <p className="py-12 text-center text-sm" style={{ color: GRAY }}>
                Cargando publicaciones...
              </p>
            )}

            {!postsLoading && posts.length === 0 && (
              <p className="py-12 text-center text-sm" style={{ color: GRAY }}>
                Aún no hay publicaciones. ¡Sé la primera en compartir!
              </p>
            )}

            {filtroTema && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 border border-black/5">
                <p className="text-sm" style={{ color: PLUM }}>
                  Filtrando por: <span className="font-semibold" style={{ color: PURPLE }}>{filtroTema}</span>
                </p>
                <button onClick={() => setFiltroTema(null)}
                  className="ml-auto rounded-full bg-black/5 px-3 py-1 text-xs font-medium hover:bg-black/10"
                  style={{ color: PLUM }}>
                  ✕ Quitar filtro
                </button>
              </div>
            )}

            {!postsLoading && posts.filter((post) => {
              const porTema = !filtroTema || (post.temas && post.temas.includes(filtroTema))
              const porPais = !filtroPais || post.autora.pais?.trim() === filtroPais
              const porCiudad = !filtroCiudad || post.autora.ciudad?.trim() === filtroCiudad
              return porTema && porPais && porCiudad
            }).map((post) => {
              const isOwner = user && String(post.autora.id) === String(user.id)
              const canModerate = isAdmin && !isOwner
              const isEditing = editingId === post.id
              return (
                <article id={`post-${post.id}`} key={post.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 px-5 pt-4 pb-3">
                    <Avatar name={post.autora.nombre} foto={post.autora.avatar} />
                    <div className="min-w-0 flex-1">
                      <button onClick={() => navigate(`/usuario/${post.autora.id}`)}
                        className="font-title text-sm font-semibold hover:underline text-left capitalize"
                        style={{ color: PURPLE }}>
                        {post.autora.nombre}
                      </button>
                      <p className="text-xs" style={{ color: GRAY }}>
                        {post.autora.profesion && <>{post.autora.profesion} · </>}
                        {formatDate(post.fecha)}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3">
                    {isEditing ? (
                      <>
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3}
                          className="w-full resize-none rounded-xl border border-black/10 p-3 text-base leading-relaxed outline-none"
                          style={{ color: PLUM }} />
                        {editSuggestion && (
                          <div className="mt-3 rounded-xl border p-4"
                            style={{
                              borderColor: isError(editSuggestion) ? "#dc262633" : `${PURPLE}33`,
                              backgroundColor: isError(editSuggestion) ? "#dc26260D" : `${PURPLE}0D`
                            }}>
                            <p className="mb-3 text-sm leading-relaxed" style={{ color: PLUM }}>{editSuggestion}</p>
                            {!isError(editSuggestion) && (
                              <button type="button" onClick={() => { setEditText(editSuggestion); setEditSuggestion("") }}
                                className="text-sm font-semibold hover:opacity-70" style={{ color: PURPLE }}>
                                Usar esta sugerencia
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <PostText text={post.texto} />
                        {post.temas && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.temas.split(",").map((tema) => (
                              <PeachTag key={tema.trim()} className="py-1" onClick={() => setFiltroTema(tema.trim())}>
                                {tema.trim()}
                              </PeachTag>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {post.url && (
                    <img
                      src={post.url}
                      alt="Imagen del post"
                      className="block w-full h-auto"
                    />
                  )}

                  {/* Like y comentar */}
                  <div className="flex items-center gap-3 border-t border-black/5 px-5 py-3">
                    <button onClick={() => token && handleLike(post.id, post.liked_by_me)}
                      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5 transition-colors"
                      style={{ color: post.liked_by_me ? PURPLE : GRAY }}>
                      {post.liked_by_me ? "💜" : "🤍"} {post.likes_count || 0}
                    </button>
                    <button onClick={() => toggleComentarios(post.id)}
                      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5 transition-colors"
                      style={{ color: GRAY }}>
                      💬 {post.comments_count ?? comentarios[post.id]?.length ?? 0}
                    </button>
                  </div>

                  {/* Comentarios */}
                  {comentariosAbiertos[post.id] && (
                    <div className="border-t border-black/5 px-5 py-4 flex flex-col gap-3">
                      <CommentList
                        postId={post.id}
                        comentarios={comentarios[post.id] || []}
                        token={token}
                        userId={user?.id}
                        isAdmin={isAdmin}
                        onCommentsChange={handleCommentsChange}
                      />
                      {token && (
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar name={profile?.nombre || user?.nombre} foto={profile?.avatar || user?.avatar} size="sm" />
                          <input type="text" value={nuevoComentario[post.id] || ""}
                            onChange={(e) => setNuevoComentario(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleComentario(post.id)}
                            placeholder="Escribe un comentario..."
                            className="flex-1 rounded-full border border-black/10 px-4 py-1.5 text-sm outline-none"
                            style={{ color: PLUM }} />
                          <button onClick={() => handleComentario(post.id)}
                            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                            style={{ backgroundColor: PURPLE }}>
                            Enviar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botones editar/borrar (autora) o moderación (admin) */}
                  {(isOwner || canModerate) && (
                    <div className="flex items-center gap-2 border-t border-black/5 px-5 py-3">
                      {isOwner && isEditing ? (
                        <>
                          <button type="button" onClick={handleEditSuggest} disabled={editSuggestLoading || !editText.trim()}
                            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                            style={{ borderColor: `${PURPLE}66`, color: PURPLE }}>
                            <SparkleIcon /> {editSuggestLoading ? "Pensando..." : "Sugerencia"}
                          </button>
                          <button onClick={() => handleEditPost(post.id)}
                            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                            style={{ backgroundColor: PURPLE }}>
                            Guardar
                          </button>
                          <button onClick={() => { setEditingId(null); setEditSuggestion("") }}
                            className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                            style={{ color: GRAY }}>
                            Cancelar
                          </button>
                        </>
                      ) : isOwner ? (
                        <>
                          <button onClick={() => { setEditingId(post.id); setEditText(post.texto) }}
                            className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                            style={{ color: PLUM }}>
                            Editar
                          </button>
                          <button onClick={() => handleDeletePost(post.id)}
                            className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                            style={{ color: "#dc2626" }}>
                            Borrar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setPendingModerationPostId(post.id)}
                          className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                          style={{ color: "#dc2626" }}
                        >
                          Eliminar (moderación)
                        </button>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        {/* ── SIDEBAR DERECHA ── */}
        <aside className="hidden w-72 flex-none xl:block">
          <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold font-subtitle" style={{ color: PLUM }}>
              <SparkleIcon /> Esta semana en Bloom
            </h3>
            {resumen ? (
              <p className="text-sm leading-relaxed" style={{ color: GRAY }}>{resumen}</p>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: GRAY }}>Cargando resumen de la comunidad...</p>
            )}
          </div>

          {token && (
            <InspiracionCard
              className="mt-5"
              inspiracion={inspiracion}
              loading={inspiracionLoading}
              error={inspiracionError}
              onUsar={handleUsarInspiracion}
              onOtra={fetchInspiracion}
            />
          )}
        </aside>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <BloomLogo className="h-14 w-auto" />
          </div>
          <p className="text-center text-xs" style={{ color: GRAY }}>© 2026 Bloom. Hecho con amor para mujeres que florecen.</p>
        </div>
      </footer>

      <ConfirmModal
        open={pendingModerationPostId !== null}
        title="Moderación de contenido"
        message="¿Eliminar este post por incumplir las normas de la comunidad?"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          const postId = pendingModerationPostId
          setPendingModerationPostId(null)
          handleDeletePost(postId)
        }}
        onCancel={() => setPendingModerationPostId(null)}
      />

      <NotificationsModal
        open={notificationsOpen}
        notifications={notificaciones}
        onClose={() => setNotificationsOpen(false)}
        onSelect={(notification) => {
          abrirPostDesdeNotificacion(notification.post_id)
          setNotificaciones((prev) => prev.filter((item) => item.id !== notification.id))
          setNotificationsOpen(false)
        }}
        onClearAll={() => setNotificaciones([])}
      />
    </div>
  )
}

export default Feed

