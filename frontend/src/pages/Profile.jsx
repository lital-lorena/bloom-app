import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PURPLE = "#8C52FF"
const CREAM = "#fdf6f0"
const PLUM = "#3D2B1F"

export default function Profile() {
    const { token, logout } = useUser()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [story, setStory] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch("http://127.0.0.1:5000/api/users/me", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await response.json()
            setName(data.nombre || "")
            setStory(data.mi_historia || "")
            setCountry(data.pais || "")
            setCity(data.ciudad || "")
            setAvatar(data.avatar)
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        const formData = new FormData()
        formData.append("nombre", name)
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

    const labelClass = "mb-1.5 block text-sm font-medium"
    const inputClass =
        "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base capitalize outline-none transition-colors focus:border-[#8C52FF]"

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
                    <div className="flex items-center gap-5">
                        <a href="/feed" className="text-sm font-medium" style={{ color: PURPLE }}>
                            Feed
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

            <main className="mx-auto max-w-md px-5 py-8">
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">

                    {/* HEADER CON AVATAR */}
                    <div
                        className="relative px-6 pb-12 pt-8 text-center"
                        style={{ background: `linear-gradient(180deg, ${PURPLE}22 0%, ${PURPLE}0D 50%, #ffffff 100%)` }}
                    >
                        <div className="relative mx-auto mb-3 h-28 w-28">
                            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
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
                                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white text-lg font-bold leading-none text-white shadow-md hover:opacity-90"
                                style={{ backgroundColor: PURPLE }}
                                aria-label="Cambiar foto de perfil"
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
                        <h1 className="font-serif text-2xl font-semibold" style={{ color: PLUM }}>
                            {name}
                        </h1>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="name" className={labelClass} style={{ color: PURPLE }}>
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
                                <label htmlFor="story" className={labelClass} style={{ color: PURPLE }}>
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

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="country" className={labelClass} style={{ color: PURPLE }}>
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

                                <div>
                                    <label htmlFor="city" className={labelClass} style={{ color: PURPLE }}>
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
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-full px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            style={{ backgroundColor: PURPLE }}
                        >
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>

                        {message && (
                            <p className="mt-4 text-center text-sm" style={{ color: PLUM }}>{message}</p>
                        )}
                    </form>
                </div>
            </main>
        </div>
    )
}