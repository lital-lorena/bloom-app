import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import CommentList from '../components/CommentList'
import BloomLogo from '../components/BloomLogo'
import UserMenu from '../components/UserMenu'
import PostText from '../components/PostText'
import { API_URL } from '../config/api'

import { PURPLE, PLUM, GRAY, CREAM, LAVENDER } from '../theme/bloomTheme'

function Avatar({ name, size = "md", foto = null }) {
    const letter = (name || "?").trim().charAt(0).toUpperCase()
    const sizes = {
        sm: "h-9 w-9 text-sm",
        md: "h-11 w-11 text-lg",
    }
    return foto ? (
        <div
            className={`flex-none overflow-hidden rounded-full ${sizes[size]}`}
            style={{ backgroundColor: LAVENDER }}
        >
            <img src={foto} alt={name} className="h-full w-full object-cover object-top" />
        </div>
    ) : (
        <div
            className={`flex flex-none items-center justify-center rounded-full font-title font-semibold ${sizes[size]}`}
            style={{ backgroundColor: LAVENDER, color: PURPLE }}
        >
            {letter}
        </div>
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

export default function PublicProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token, user } = useUser()
    const isAdmin = user?.rol === "admin"

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comentariosAbiertos, setComentariosAbiertos] = useState({})
    const [comentarios, setComentarios] = useState({})
    const [nuevoComentario, setNuevoComentario] = useState({})

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            const response = await fetch(`${API_URL}/api/users/${id}`)
            const data = await response.json()
            setProfile(data)
            setLoading(false)
        }
        fetchProfile()
    }, [id])

    const fetchComentarios = async (postId) => {
        const response = await fetch(`${API_URL}/api/comments/${postId}`)
        if (response.ok) {
            const data = await response.json()
            setComentarios(prev => ({ ...prev, [postId]: data }))
            setProfile(prev => prev ? {
                ...prev,
                posts: prev.posts.map(post =>
                    post.id === postId ? { ...post, comments_count: data.length } : post
                )
            } : prev)
        }
    }

    const toggleComentarios = (postId) => {
        const abrir = !comentariosAbiertos[postId]
        setComentariosAbiertos(prev => ({ ...prev, [postId]: abrir }))
        if (abrir) fetchComentarios(postId)
    }

    const handleComentario = async (postId) => {
        const texto = nuevoComentario[postId] || ""
        if (!texto.trim() || !token) return

        const response = await fetch(`${API_URL}/api/comments/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ contenido: texto })
        })

        if (response.ok) {
            const nuevo = await response.json()
            handleCommentsChange(postId, [...(comentarios[postId] || []), nuevo])
            setNuevoComentario(prev => ({ ...prev, [postId]: "" }))
        }
    }

    const handleCommentsChange = (postId, updated) => {
        setComentarios(prev => ({ ...prev, [postId]: updated }))
        setProfile(prev => prev ? {
            ...prev,
            posts: prev.posts.map(post =>
                post.id === postId ? { ...post, comments_count: updated.length } : post
            )
        } : prev)
    }

    const letter = (profile?.nombre || "?").trim().charAt(0).toUpperCase()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: CREAM }}>
                <p style={{ color: GRAY }}>Cargando perfil...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-[family-name:var(--font-body)]" style={{ backgroundColor: CREAM, color: PLUM }}>

            <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 shadow-lg backdrop-blur-sm">
                <nav className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-2">
                    <a href="/" className="flex items-center">
                        <BloomLogo className="h-10 w-auto" />
                    </a>
                    {token ? (
                        <UserMenu />
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                            style={{ backgroundColor: PURPLE }}
                        >
                            Entrar
                        </button>
                    )}
                </nav>
            </header>

            <main className="mx-auto max-w-2xl px-5 pb-8 pt-16">

                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm mb-8">
                    <div
                        className="relative px-6 pb-8 pt-8 text-center"
                        style={{ background: `linear-gradient(180deg, ${PURPLE}22 0%, ${PURPLE}0D 50%, #ffffff 100%)` }}
                    >
                        <div
                            className="mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md"
                            style={{ backgroundColor: LAVENDER }}
                        >
                            {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.nombre} className="h-full w-full object-cover object-top" />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center font-title text-4xl font-semibold"
                                    style={{ backgroundColor: CREAM, color: PURPLE }}
                                >
                                    {letter}
                                </div>
                            )}
                        </div>

                        <h1 className="font-title text-2xl font-semibold" style={{ color: PLUM }}>
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

                <h2 className="font-subtitle mb-4 text-xl font-semibold" style={{ color: PLUM }}>
                    Publicaciones
                </h2>

                <div className="flex flex-col gap-5">
                    {profile.posts.length === 0 && (
                        <p className="py-8 text-center text-sm" style={{ color: GRAY }}>
                            Esta usuaria aún no tiene publicaciones.
                        </p>
                    )}

                    {profile.posts.map((post) => (
                        <article key={post.id} id={`post-${post.id}`} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                            <div className="px-5 py-4">
                                <p className="text-xs mb-2" style={{ color: GRAY }}>
                                    {formatDate(post.fecha)}
                                </p>
                                <PostText text={post.texto} />
                            </div>

                            {post.url && (
                                <div className="px-5 pb-3">
                                    <img src={post.url} alt="Imagen del post" className="mt-3 block w-full h-auto rounded-xl" />
                                </div>
                            )}

                            <div className="flex items-center gap-3 border-t border-black/5 px-5 py-3">
                                <button
                                    type="button"
                                    onClick={() => toggleComentarios(post.id)}
                                    className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-black/5 transition-colors"
                                    style={{ color: GRAY }}
                                >
                                    💬 {post.comments_count ?? comentarios[post.id]?.length ?? 0}
                                </button>
                            </div>

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
                                    {token ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <Avatar name={user?.nombre} size="sm" />
                                            <input
                                                type="text"
                                                value={nuevoComentario[post.id] || ""}
                                                onChange={(e) => setNuevoComentario(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                onKeyDown={(e) => e.key === "Enter" && handleComentario(post.id)}
                                                placeholder="Escribe un comentario..."
                                                className="flex-1 rounded-full border border-black/10 px-4 py-1.5 text-sm outline-none"
                                                style={{ color: PLUM }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleComentario(post.id)}
                                                className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                                                style={{ backgroundColor: PURPLE }}
                                            >
                                                Enviar
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-center text-sm py-2" style={{ color: GRAY }}>
                                            <button type="button" onClick={() => navigate("/login")} className="font-medium hover:underline" style={{ color: PURPLE }}>
                                                Inicia sesión
                                            </button>
                                            {" "}para comentar.
                                        </p>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </main>
        </div>
    )
}

