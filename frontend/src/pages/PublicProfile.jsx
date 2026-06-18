import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const PURPLE = "#8C52FF"
const CREAM = "#fdf6f0"
const PLUM = "#3D2B1F"
const GRAY = "#9CA3AF"

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

export default function PublicProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            const response = await fetch(`http://127.0.0.1:5000/api/users/${id}`)
            const data = await response.json()
            setProfile(data)
            setLoading(false)
        }
        fetchProfile()
    }, [id])

    const letter = (profile?.nombre || "?").trim().charAt(0).toUpperCase()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: CREAM }}>
                <p style={{ color: GRAY }}>Cargando perfil...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: CREAM, color: PLUM }}>

            {/* NAVBAR */}
            <header className="sticky top-0 z-10 border-b border-black/5 bg-white shadow-sm">
                <nav className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-3">
                    <a href="/" className="flex items-center gap-1">
                        <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-10 w-10 object-contain" />
                        <span className="font-serif text-2xl font-semibold" style={{ color: PLUM }}>
                            Bloom
                        </span>
                    </a>
                    <button
                        onClick={() => navigate("/feed")}
                        className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium hover:bg-black/5"
                        style={{ color: PLUM }}
                    >
                        ← Volver al Feed
                    </button>
                </nav>
            </header>

            <main className="mx-auto max-w-2xl px-5 py-8">

                {/* CABECERA DEL PERFIL */}
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm mb-8">
                    <div
                        className="relative px-6 pb-8 pt-8 text-center"
                        style={{ background: `linear-gradient(180deg, ${PURPLE}22 0%, ${PURPLE}0D 50%, #ffffff 100%)` }}
                    >
                        <div className="mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.nombre} className="h-full w-full object-cover" />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center font-serif text-4xl font-semibold"
                                    style={{ backgroundColor: CREAM, color: PURPLE }}
                                >
                                    {letter}
                                </div>
                            )}
                        </div>

                        <h1 className="font-serif text-2xl font-semibold" style={{ color: PLUM }}>
                            {profile.nombre}
                        </h1>

                        {(profile.ciudad || profile.pais) && (
                            <p className="mt-1 text-sm" style={{ color: PURPLE }}>
                                📍 {profile.ciudad || profile.pais}
                            </p>
                        )}

                        {profile.mi_historia && (
                            <p className="mt-3 text-sm leading-relaxed mx-auto max-w-md break-all" style={{ color: PLUM }}>
                                {profile.mi_historia}
                            </p>
                        )}
                    </div>
                </div>

                {/* POSTS DE LA USUARIA */}
                <h2 className="mb-4 font-serif text-xl font-semibold" style={{ color: PLUM }}>
                    Publicaciones
                </h2>

                <div className="flex flex-col gap-5">
                    {profile.posts.length === 0 && (
                        <p className="py-8 text-center text-sm" style={{ color: GRAY }}>
                            Esta usuaria aún no tiene publicaciones.
                        </p>
                    )}

                    {profile.posts.map((post) => (
                        <article key={post.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                            <div className="px-5 py-4">
                                <p className="text-xs mb-2" style={{ color: GRAY }}>
                                    {formatDate(post.fecha)}
                                </p>
                                <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: PLUM }}>
                                    {post.texto}
                                </p>
                            </div>
                            {post.url && (
                                <div className="px-5 pb-3">
                                    <img src={post.url} alt="Imagen del post" className="w-full rounded-xl object-contain" />
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </main>
        </div>
    )
}