import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const PURPLE = "#8C52FF"
const CREAM = "#fdf6f0"
const PLUM = "#3D2B1F"
const GRAY = "#9CA3AF"
const LAVENDER = "#F3EEFF"

function Avatar({ name, size = "md", foto = null }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase()
  const sizes = {
    sm: "h-9 w-9 text-sm",
    md: "h-11 w-11 text-lg",
    lg: "h-16 w-16 text-2xl",
  }
  return foto ? (
    <img
      src={foto}
      alt={name}
      className={`flex-none rounded-full object-cover ${sizes[size]}`}
    />
  ) : (
    <div
      className={`flex flex-none items-center justify-center rounded-full font-serif font-semibold ${sizes[size]}`}
      style={{ backgroundColor: LAVENDER, color: PURPLE }}
    >
      {letter}
    </div>
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

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return String(value ?? "")
  }
}

function Feed() {
  const [posts, setPosts] = useState([])
  const [text, setText] = useState("")
  const [postImage, setPostImage] = useState(null)
  const [suggestion, setSuggestion] = useState("")
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const { token, user, logout } = useUser()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [editSuggestion, setEditSuggestion] = useState("")
  const [editSuggestLoading, setEditSuggestLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [filtroTema, setFiltroTema] = useState(null)

  const postImagePreview = useMemo(
    () => (postImage ? URL.createObjectURL(postImage) : null),
    [postImage]
  )

  useEffect(() => {
    return () => {
      if (postImagePreview) URL.revokeObjectURL(postImagePreview)
    }
  }, [postImagePreview])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/posts")
      const data = await response.json()
      setPosts(data)
    }
    const fetchProfile = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    }
    fetchPosts()
    if (token) fetchProfile()
  }, [])

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!text.trim() && !postImage) return
    setPostLoading(true)
    try {
      let response
      if (postImage) {
        const formData = new FormData()
        formData.append("texto", text)
        formData.append("image", postImage)
        response = await fetch("http://127.0.0.1:5000/api/posts", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        })
      } else {
        response = await fetch("http://127.0.0.1:5000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ texto: text })
        })
      }
      if (response.ok) {
        setText("")
        setPostImage(null)
        setSuggestion("")
        const updatedResponse = await fetch("http://127.0.0.1:5000/api/posts")
        const updatedPosts = await updatedResponse.json()
        setPosts(updatedPosts)
      }
    } finally {
      setPostLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (response.ok) {
      setPosts(posts.filter((post) => post.id !== postId))
    }
  }

  const handleEditPost = async (postId) => {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ texto: editText })
    })
    if (response.ok) {
      setPosts(posts.map((post) =>
        post.id === postId ? { ...post, texto: editText } : post
      ))
      setEditingId(null)
      setEditText("")
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSuggest = async () => {
    if (!text.trim()) return
    setSuggestLoading(true)
    setSuggestion("")
    try {
      const response = await fetch("http://127.0.0.1:5000/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ texto: text })
      })
      const data = await response.json()
      if (response.ok) {
        setSuggestion(data.sugerencia)
      } else {
        setSuggestion(data.error || "No se pudo generar una sugerencia.")
      }
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
      const response = await fetch("http://127.0.0.1:5000/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ texto: editText })
      })
      const data = await response.json()
      if (response.ok) {
        setEditSuggestion(data.sugerencia)
      } else {
        setEditSuggestion(data.error || "No se pudo generar una sugerencia.")
      }
    } catch {
      setEditSuggestion("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setEditSuggestLoading(false)
    }
  }

  const isError = (text) =>
    text.startsWith("Error") || text.startsWith("Tu publicación") || text.startsWith("El texto") || text.startsWith("No se pudo")

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: CREAM, color: PLUM }}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-9 w-9 object-contain" />
            <span className="font-serif text-xl font-semibold" style={{ color: PLUM }}>
              Bloom
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/feed" className="text-sm font-semibold" style={{ color: PURPLE }}>
              Feed
            </a>
            <a href="/profile" className="text-sm font-medium hover:opacity-70" style={{ color: PLUM }}>
              Mi perfil
            </a>
            <button
              onClick={handleLogout}
              className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium hover:bg-black/5"
              style={{ color: PLUM }}
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </header>

      {/* ── CONTENIDO PRINCIPAL: 3 COLUMNAS ── */}
      <main className="mx-auto flex max-w-6xl gap-6 px-5 py-8">

        {/* ── SIDEBAR IZQUIERDA ── */}
        <aside className="hidden w-72 flex-none lg:block">

          {/* Tarjeta de perfil */}
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <Avatar name={profile?.nombre || user?.nombre} size="lg" foto={profile?.avatar || user?.avatar} />
              <h2 className="mt-3 font-serif text-lg font-semibold" style={{ color: PLUM }}>
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
            <h3 className="mb-3 text-sm font-semibold" style={{ color: PLUM }}>
              Temas para ti
            </h3>
            <div className="flex flex-wrap gap-2">
            {["Cambio Profesional", "Nuevos Comienzos", "Habilidades Transferibles", "Confianza Profesional", "Aprendizaje Continuo", "Entrevistas Laborales", "Emprendimiento", "Logros y Avances"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFiltroTema(tag)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: LAVENDER, color: PURPLE }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── COLUMNA CENTRAL: FEED ── */}
        <div className="min-w-0 flex-1">

          {/* Título */}
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-semibold" style={{ color: PLUM }}>
              Comunidad
            </h1>
            <p className="mt-1 text-sm" style={{ color: GRAY }}>
              Comparte tu historia. Alguien aquí ha pasado por lo mismo.
            </p>
          </div>

          {/* ── CREAR POST ── */}
          <section className="mb-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <form onSubmit={handleCreatePost}>
              <div className="flex gap-3">
                <Avatar name={profile?.nombre || user?.nombre} foto={profile?.avatar || user?.avatar} />
                <textarea
                  value={text}
                  onChange={(e) => {
                    const val = e.target.value
                    setText(val.charAt(0).toUpperCase() + val.slice(1))
                  }}
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
                    <button
                      type="button"
                      onClick={() => { setText(suggestion); setSuggestion("") }}
                      className="text-sm font-semibold hover:opacity-70"
                      style={{ color: PURPLE }}
                    >
                      Usar esta sugerencia
                    </button>
                  )}
                </div>
              )}

              {postImagePreview && (
                <div className="relative mt-4">
                  <img
                    src={postImagePreview}
                    alt="Vista previa"
                    className="h-32 w-32 rounded-xl object-cover border border-black/5"
                  />
                  <button
                    type="button"
                    onClick={() => setPostImage(null)}
                    className="absolute -right-2 -top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5" style={{ color: PLUM }}>
                  <CameraIcon /> Añadir foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPostImage(e.target.files[0] || null)}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSuggest}
                  disabled={suggestLoading || !text.trim()}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderColor: `${PURPLE}66`, color: PURPLE }}
                >
                  <SparkleIcon /> {suggestLoading ? "Pensando..." : "Sugerencia"}
                </button>

                <button
                  type="submit"
                  disabled={postLoading || (!text.trim() && !postImage)}
                  className="ml-auto rounded-full px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: PURPLE }}
                >
                  {postLoading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </form>
          </section>

          {/* ── POSTS ── */}
          <div className="flex flex-col gap-5">
            {posts.length === 0 && (
              <p className="py-12 text-center text-sm" style={{ color: GRAY }}>
                Aún no hay publicaciones. ¡Sé la primera en compartir!
              </p>
            )}

            {filtroTema && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 border border-black/5">
                <p className="text-sm" style={{ color: PLUM }}>
                  Filtrando por: <span className="font-semibold" style={{ color: PURPLE }}>{filtroTema}</span>
                </p>
                <button
                  onClick={() => setFiltroTema(null)}
                  className="ml-auto rounded-full bg-black/5 px-3 py-1 text-xs font-medium hover:bg-black/10"
                  style={{ color: PLUM }}
                >
                  ✕ Quitar filtro
                </button>
              </div>
            )}

            {posts.filter((post) => !filtroTema || (post.temas && post.temas.includes(filtroTema))).map((post) => {
              const isOwner = user && String(post.autora.id) === String(user.id)
              const isEditing = editingId === post.id
              return (
                <article key={post.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 px-5 pt-5">
                    <Avatar name={post.autora.nombre} foto={post.autora.avatar} />
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => navigate(`/usuario/${post.autora.id}`)}
                        className="font-serif text-base font-semibold hover:underline text-left capitalize"
                        style={{ color: PURPLE }}
                      >
                        {post.autora.nombre}
                      </button>
                      <p className="text-xs" style={{ color: GRAY }}>
                        {post.autora.profesion && <>{post.autora.profesion} · </>}
                        {formatDate(post.fecha)}
                      </p>
                    </div>
                  </div>

                  {/* Texto del post o textarea de edición */}
                  <div className="px-5 py-3">
                    {isEditing ? (
                      <>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full resize-none rounded-xl border border-black/10 p-3 text-base leading-relaxed outline-none"
                          style={{ color: PLUM }}
                        />
                        {editSuggestion && (
                          <div
                            className="mt-3 rounded-xl border p-4"
                            style={{
                              borderColor: isError(editSuggestion) ? "#dc262633" : `${PURPLE}33`,
                              backgroundColor: isError(editSuggestion) ? "#dc26260D" : `${PURPLE}0D`
                            }}
                          >
                            <p className="mb-3 text-sm leading-relaxed" style={{ color: PLUM }}>{editSuggestion}</p>
                            {!isError(editSuggestion) && (
                              <button
                                type="button"
                                onClick={() => { setEditText(editSuggestion); setEditSuggestion("") }}
                                className="text-sm font-semibold hover:opacity-70"
                                style={{ color: PURPLE }}
                              >
                                Usar esta sugerencia
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: PLUM }}>
                          {post.texto}
                        </p>
                        {post.temas && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.temas.split(",").map((tema) => (
                              <button
                                key={tema.trim()}
                                onClick={() => setFiltroTema(tema.trim())}
                                className="rounded-full px-3 py-1 text-xs font-medium hover:opacity-80 cursor-pointer"
                                style={{ backgroundColor: LAVENDER, color: PURPLE }}
                              >
                                {tema.trim()}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {post.url && (
                    <div className="px-5 pb-3">
                      <img
                        src={post.url}
                        alt="Imagen del post"
                        className="w-full rounded-xl object-contain"
                      />
                    </div>
                  )}

                  {/* Botones */}
                  {isOwner && (
                    <div className="flex items-center gap-2 border-t border-black/5 px-5 py-3">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleEditSuggest}
                            disabled={editSuggestLoading || !editText.trim()}
                            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                            style={{ borderColor: `${PURPLE}66`, color: PURPLE }}
                          >
                            <SparkleIcon /> {editSuggestLoading ? "Pensando..." : "Sugerencia"}
                          </button>
                          <button
                            onClick={() => handleEditPost(post.id)}
                            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                            style={{ backgroundColor: PURPLE }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditSuggestion("") }}
                            className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                            style={{ color: GRAY }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(post.id); setEditText(post.texto) }}
                            className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                            style={{ color: PLUM }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                            style={{ color: "#dc2626" }}
                          >
                            Borrar
                          </button>
                        </>
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

          {/* Mentoras */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold" style={{ color: PLUM }}>
              Mentoras para seguir
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { name: "Elena Ríos", role: "Diseñadora de producto" },
                { name: "Marta Solís", role: "Ingeniería → Marketing" },
              ].map((mentor) => (
                <div key={mentor.name} className="flex items-center gap-3">
                  <Avatar name={mentor.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: PLUM }}>
                      {mentor.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: GRAY }}>
                      {mentor.role}
                    </p>
                  </div>
                  <button
                    className="rounded-full border px-3 py-1 text-xs font-semibold hover:opacity-80"
                    style={{ borderColor: PURPLE, color: PURPLE }}
                  >
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Círculo semanal */}
          <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold" style={{ color: PLUM }}>
              Círculo semanal
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: GRAY }}>
              Únete a la conversación del jueves sobre cómo negociar tu valor profesional.
            </p>
            <button
              className="mt-4 w-full rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
              style={{ borderColor: `${PURPLE}44`, color: PURPLE }}
            >
              Reservar mi lugar
            </button>
          </div>
        </aside>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-7 w-7 object-contain" />
            <span className="font-serif text-lg font-semibold" style={{ color: PLUM }}>Bloom</span>
          </div>
          <p className="text-center text-xs" style={{ color: GRAY }}>
            © 2026 Bloom. Hecho con amor para mujeres que florecen.
          </p>
        </div>
      </footer>
    </div >
  )
}

export default Feed