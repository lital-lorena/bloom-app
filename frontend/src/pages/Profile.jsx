import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserMenu from '../components/UserMenu'
import BloomLogo from '../components/BloomLogo'
import PostText from '../components/PostText'

import { PURPLE, PLUM, GRAY, CREAM, LAVENDER } from '../theme/bloomTheme'

export default function Profile() {
    const { token, updateUser } = useUser()
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
            const response = await fetch("import.meta.env.VITE_API_URL/api/users/me", {
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
                const postsRes = await fetch(`import.meta.env.VITE_API_URL/api/users/${data.id}`)
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
        const response = await fetch("import.meta.env.VITE_API_URL/api/users/me", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        })
        if (response.ok) {
            const data = await response.json()
            if (data.user) {
                updateUser({
                    nombre: data.user.nombre,
                    apellido: data.user.apellido,
                    avatar: data.user.avatar,
                })
                if (data.user.avatar) setAvatar(data.user.avatar)
            }
            setMessage("¡Perfil actualizado! ✅")
            setEditing(false)
        } else {
            setMessage("Error al actualizar ❌")
        }
        setLoading(false)
    }

    const avatarPreview =
        typeof avatar === "string"
            ? avatar
            : avatar instanceof File
                ? URL.createObjectURL(avatar)
                : null

    const letter = (name || "?").trim().charAt(0).toUpperCase()

    const inputClass =
        "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-bloom-pink focus:ring-2 focus:ring-bloom-pink/20"

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
        <div className="min-h-screen font-[family-name:var(--font-body)]" style={{ backgroundColor: CREAM, color: PLUM }}>

            {/* ── NAVBAR ── */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 shadow-lg backdrop-blur-sm">
                <nav className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-2">
                    <a href="/" className="flex items-center">
                        <BloomLogo className="h-10 w-auto" />
                    </a>
                    <UserMenu />
                </nav>
            </header>

            <main className="mx-auto max-w-4xl px-5 pb-8 pt-16">

                {/* ── TARJETA DE PERFIL ── */}
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">

                    {/* Banner estilo "Lista para florecer" */}
                    <div
                        className="relative flex h-44 items-center justify-center overflow-hidden"
                        style={{
                            backgroundColor: '#FFA58B',
                            backgroundImage: `
                                radial-gradient(ellipse 130% 110% at -5% -10%, #FF5FA8 0%, rgba(255, 95, 168, 0.72) 38%, transparent 72%),
                                radial-gradient(ellipse 110% 95% at 105% 45%, #FFC2A8 0%, rgba(255, 194, 168, 0.88) 42%, transparent 70%),
                                radial-gradient(ellipse 90% 80% at 35% 55%, #FF7E8A 0%, rgba(255, 126, 138, 0.45) 48%, transparent 75%),
                                radial-gradient(ellipse 75% 65% at 65% 15%, rgba(255, 165, 139, 0.75) 0%, transparent 58%),
                                radial-gradient(ellipse 85% 70% at 50% 100%, rgba(255, 194, 168, 0.55) 0%, transparent 62%)
                            `,
                        }}
                    >
                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            viewBox="0 0 1200 400"
                            preserveAspectRatio="xMidYMid slice"
                            aria-hidden="true"
                        >
                            <g style={{ filter: 'blur(0.5px)' }}>
                                <path
                                    d="M-80 90 C180 30, 380 150, 620 80 S1020 20, 1280 110"
                                    stroke="white"
                                    strokeWidth="52"
                                    fill="none"
                                    opacity="0.13"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M-60 260 C220 190, 420 310, 680 230 S1060 170, 1300 280"
                                    stroke="white"
                                    strokeWidth="40"
                                    fill="none"
                                    opacity="0.11"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M120 340 C340 280, 520 380, 760 300 S980 240, 1180 320"
                                    stroke="white"
                                    strokeWidth="28"
                                    fill="none"
                                    opacity="0.1"
                                    strokeLinecap="round"
                                />
                            </g>
                        </svg>
                        <p className="relative z-10 font-title text-5xl tracking-tight text-white md:text-6xl">
                            Bloom
                        </p>
                    </div>

                    {/* Info del perfil */}
                    <div className="relative px-6 pb-6">
                        <div className="relative -mt-14 flex items-end gap-5">
                            {/* Avatar */}
                            <div className="relative flex-none">
                                <div
                                    className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg"
                                    style={{ backgroundColor: LAVENDER }}
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover object-top" />
                                    ) : (
                                        <div
                                            className="flex h-full w-full items-center justify-center font-title text-4xl font-semibold"
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
                                <h1 className="font-title text-2xl font-bold capitalize" style={{ color: PLUM }}>
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
                                <p className="font-title text-xl font-bold" style={{ color: PLUM }}>{posts.length}</p>
                                <p className="text-xs" style={{ color: GRAY }}>Publicaciones</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FORMULARIO DE EDICIÓN ── */}
                {editing && (
                    <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 font-subtitle text-xl font-semibold" style={{ color: PLUM }}>
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
                    <h2 className="mb-4 font-subtitle text-xl font-semibold" style={{ color: PLUM }}>
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
                                        <div
                                            className="h-10 w-10 flex-none overflow-hidden rounded-full"
                                            style={{ backgroundColor: LAVENDER }}
                                        >
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt={name} className="h-full w-full object-cover object-top" />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center font-title text-sm font-semibold"
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

                                    <PostText text={post.texto} />

                                    {post.url && (
                                        <img
                                            src={post.url}
                                            alt="Imagen del post"
                                            className="mt-3 block w-full h-auto rounded-xl"
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
                        <BloomLogo className="h-14 w-auto" />
                    </div>
                    <p className="text-center text-xs" style={{ color: GRAY }}>
                        © 2026 Bloom. Hecho con amor para mujeres que florecen.
                    </p>
                </div>
            </footer>
        </div>
    )
}

