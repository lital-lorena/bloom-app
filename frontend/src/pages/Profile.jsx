import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PURPLE = "#8C52FF"
const CREAM = "#fdf6f0"
const PLUM = "#3D2B1F"
const GRAY = "#9CA3AF"
const LAVENDER = "#F3EEFF"

export default function Profile() {
    const { token, logout } = useUser()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [profesion, setProfesion] = useState("")
    const [story, setStory] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch("http://127.0.0.1:5000/api/users/me", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await response.json()
            setName(data.nombre || "")
            setLastName(data.apellido || "")
            setProfesion(data.profesion || "")
            setStory(data.mi_historia || "")
            setCountry(data.pais || "")
            setCity(data.ciudad || "")
            setAvatar(data.avatar)

            // Cargar posts de la usuaria
            if (data.id) {
                const postsRes = await fetch(`http://127.0.0.1:5000/api/users/${data.id}`)
                if (postsRes.ok) {
                    const postsData = await postsRes.json()
                    setPosts(postsData.posts || [])
                }
            }
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        const formData = new FormData()
        formData.append("nombre", name)
        formData.append("apellido", lastName)
        formData.append("profesion", profesion)
        formData.append("mi_historia", story)
        formData.append("pais", country)
        formData.append("ciudad", city)
        if (avatar && typeof avatar !== "string") {
            formData.append("avatar", avatar)
        }
        const response = await fetch("http://127.0.0.1:5000/api/users/me", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        })
        if (response.ok) {
            setMessage("¡Perfil actualizado! ✅")
            setEditing(false)
        } else {
            setMessage("Error al actualizar ❌")
        }
        setLoading(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const avatarPreview =
        typeof avatar === "string"
            ? avatar
            : avatar instanceof File
                ? URL.createObjectURL(avatar)
                : null

    const letter = (name || "?").trim().charAt(0).toUpperCase()

    const inputClass =
        "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/20"

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

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: CREAM, color: PLUM }}>

            {/* ── NAVBAR ── */}
            <header className="sticky top-0 z-10 border-b border-black/5 bg-white shadow-sm">
                <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-9 w-9 object-contain" />
                        <span className="font-serif text-xl font-semibold" style={{ color: PLUM }}>
                            Bloom
                        </span>
                    </a>
                    <div className="flex items-center gap-6">
                        <a href="/feed" className="text-sm font-medium hover:opacity-70" style={{ color: PLUM }}>
                            Feed
                        </a>
                        <a href="/profile" className="text-sm font-semibold" style={{ color: PURPLE }}>
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

            <main className="mx-auto max-w-4xl px-5 py-8">

                {/* ── TARJETA DE PERFIL ── */}
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">

                    {/* Banner con flores */}
                    <div
                        className="relative h-40 overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${LAVENDER} 0%, #E8DEFF 50%, ${LAVENDER} 100%)` }}
                    >
                        <img
                            src="/src/assets/bloom_flor.png"
                            alt=""
                            className="absolute -right-10 -top-10 h-48 w-48 rotate-12 object-contain opacity-15"
                            aria-hidden="true"
                        />
                        <img
                            src="/src/assets/bloom_flor.png"
                            alt=""
                            className="absolute -left-8 bottom-0 h-36 w-36 -rotate-12 object-contain opacity-10"
                            aria-hidden="true"
                        />
                        <img
                            src="/src/assets/bloom_flor.png"
                            alt=""
                            className="absolute right-1/3 -bottom-6 h-28 w-28 rotate-45 object-contain opacity-8"
                            aria-hidden="true"
                        />
                    </div>

                    {/* Info del perfil */}
                    <div className="relative px-6 pb-6">
                        <div className="relative -mt-14 flex items-end gap-5">
                            {/* Avatar */}
                            <div className="relative flex-none">
                                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <div
                                            className="flex h-full w-full items-center justify-center font-serif text-4xl font-semibold"
                                            style={{ backgroundColor: CREAM, color: PURPLE }}
                                        >
                                            {letter}
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-md hover:opacity-90"
                                    style={{ backgroundColor: PURPLE }}
                                    aria-label="Cambiar foto"
                                >
                                    +
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setAvatar(e.target.files[0])}
                                />
                            </div>

                            {/* Nombre + profesión */}
                            <div className="mb-2 min-w-0 flex-1">
                                <h1 className="font-serif text-2xl font-bold capitalize" style={{ color: PLUM }}>
                                    {name} {lastName}
                                </h1>
                                {profesion && (
                                    <p className="text-sm" style={{ color: GRAY }}>{profesion}</p>
                                )}
                            </div>

                            {/* Botón editar */}
                            <button
                                onClick={() => setEditing(!editing)}
                                className="mb-2 flex-none rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-black/5"
                                style={{ borderColor: `${PURPLE}44`, color: PURPLE }}
                            >
                                {editing ? "Cancelar" : "Editar perfil"}
                            </button>
                        </div>

                        {/* Historia */}
                        {story && (
                            <p className="mt-4 text-base leading-relaxed break-all" style={{ color: PLUM }}>
                                {story}
                            </p>
                        )}

                        {/* Ubicación */}
                        {(city || country) && (
                            <p className="mt-3 flex items-center gap-1.5 text-sm" style={{ color: GRAY }}>
                                <span>📍</span>
                                {city}{city && country ? ", " : ""}{country}
                            </p>
                        )}

                        {/* Estadísticas */}
                        <div className="mt-5 flex gap-8 border-t border-black/5 pt-5">
                            <div>
                                <p className="font-serif text-xl font-bold" style={{ color: PLUM }}>{posts.length}</p>
                                <p className="text-xs" style={{ color: GRAY }}>Publicaciones</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FORMULARIO DE EDICIÓN ── */}
                {editing && (
                    <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 font-serif text-xl font-semibold" style={{ color: PLUM }}>
                            Editar mi perfil
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="name" className="mb-1.5 block text-sm font-medium" style={{ color: PLUM }}>
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium" style={{ color: PLUM }}>
                                    Apellido
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="profesion" className="mb-1.5 block text-sm font-medium" style={{ color: PLUM }}>
                                    Profesión
                                </label>
                                <input
                                    id="profesion"
                                    type="text"
                                    value={profesion}
                                    onChange={(e) => setProfesion(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                                    className={inputClass}
                                    placeholder="Ej. Desarrolladora web, Diseñadora UX..."
                                />
                            </div>

                            <div>
                                <label htmlFor="story" className="mb-1.5 block text-sm font-medium" style={{ color: PLUM }}>
                                    Mi historia
                                </label>
                                <textarea
                                    id="story"
                                    value={story}
                                    onChange={(e) => setStory(e.target.value)}
                                    className={`${inputClass} resize-none`}
                                    rows={4}
                                    placeholder="Cuéntanos tu historia de reinvención..."
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium" style={{ color: PLUM }}>
                                        Ciudad
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="mb-1.5 block text-sm font-medium" style={{ color: PLUM }}>
                                        País
                                    </label>
                                    <input
                                        id="country"
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full rounded-full px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                                style={{ backgroundColor: PURPLE }}
                            >
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>

                            {message && (
                                <p className="text-center text-sm" style={{ color: PLUM }}>{message}</p>
                            )}
                        </form>
                    </div>
                )}

                {/* ── PUBLICACIONES ── */}
                <div className="mt-6">
                    <h2 className="mb-4 font-serif text-xl font-semibold" style={{ color: PLUM }}>
                        Publicaciones recientes
                    </h2>

                    {posts.length === 0 ? (
                        <div className="rounded-2xl border border-black/5 bg-white py-12 text-center shadow-sm">
                            <p className="text-sm" style={{ color: GRAY }}>
                                Aún no has compartido nada. ¡Anímate a publicar en el Feed!
                            </p>
                            <button
                                onClick={() => navigate('/feed')}
                                className="mt-4 rounded-full px-6 py-2 text-sm font-semibold text-white"
                                style={{ backgroundColor: PURPLE }}
                            >
                                Ir al Feed
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {posts.map((post) => (
                                <article key={post.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 flex-none overflow-hidden rounded-full">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt={name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center font-serif text-sm font-semibold"
                                                    style={{ backgroundColor: LAVENDER, color: PURPLE }}
                                                >
                                                    {letter}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: PLUM }}>{name}</p>
                                            <p className="text-xs" style={{ color: GRAY }}>
                                                {profesion && <>{profesion} · </>}
                                                {formatDate(post.fecha)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: PLUM }}>
                                        {post.texto}
                                    </p>

                                    {post.url && (
                                        <img
                                            src={post.url}
                                            alt="Imagen del post"
                                            className="mt-3 w-full rounded-xl object-contain"
                                        />
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="mt-8 border-t border-black/5 bg-white">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-7 w-7 object-contain" />
                        <span className="font-serif text-lg font-semibold" style={{ color: PLUM }}>Bloom</span>
                    </div>
                    <p className="text-center text-xs" style={{ color: GRAY }}>
                        © 2026 Bloom. Hecho con amor para mujeres que florecen.
                    </p>
                </div>
            </footer>
        </div>
    )
}