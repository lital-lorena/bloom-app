import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const { token } = useUser()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [story, setStory] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [avatar, setAvatar] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch("http://127.0.0.1:5000/api/users/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json()
            setName(data.nombre)
            setStory(data.mi_historia || "")
            setCountry(data.pais || "")
            setCity(data.ciudad || "")
            setAvatar(data.avatar)
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
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
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        if (response.ok) {
            setMessage("¡Perfil actualizado! ✅")
        } else {
            setMessage("Error al actualizar ❌")
        }
    }

    const avatarPreview =
        typeof avatar === "string"
            ? avatar
            : avatar instanceof File
              ? URL.createObjectURL(avatar)
              : null

    const labelClass = "mb-1.5 block text-sm font-medium text-[#8C52FF]"
    const inputClass =
        "w-full border-0 border-b border-[#E5E7EB] bg-transparent px-1 py-3 text-[#3D2B1F] capitalize shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-colors focus:border-[#8C52FF] focus:outline-none focus:ring-0"

    return (
        <div className="min-h-screen bg-[#FDFAF6] pb-10">
            <div className="mx-auto w-full max-w-md px-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate("/feed")}
                    className="text-sm font-medium text-[#8C52FF] transition-colors hover:text-[#7440E8]"
                >
                    ← Volver al Feed
                </button>

                <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <header className="relative overflow-hidden px-6 pb-10 pt-8 text-center">
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: 'linear-gradient(180deg, rgba(140, 82, 255, 0.28) 0%, rgba(140, 82, 255, 0.12) 45%, #FDFAF6 100%)',
                            }}
                        />
                        <svg
                            className="pointer-events-none absolute bottom-0 left-0 w-full text-[#8C52FF]/20"
                            viewBox="0 0 1440 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path
                                fill="currentColor"
                                d="M0,55 C240,95 480,25 720,55 C960,85 1200,35 1440,60 L1440,100 L0,100 Z"
                            />
                        </svg>
                        <svg
                            className="pointer-events-none absolute bottom-0 left-0 w-full text-[#8C52FF]/12"
                            viewBox="0 0 1440 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path
                                fill="currentColor"
                                d="M0,70 C320,40 640,90 960,65 C1200,48 1320,55 1440,72 L1440,100 L0,100 Z"
                            />
                        </svg>

                        <div className="relative mx-auto mb-4 h-32 w-32">
                            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#8C52FF]/10 text-2xl text-[#8C52FF]">
                                        🌸
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#8C52FF] text-lg font-bold leading-none text-white shadow-md transition-colors hover:bg-[#7440E8]"
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

                        <h1 className="relative text-2xl font-bold text-[#3D2B1F]">
                            {name}
                        </h1>
                    </header>

                    <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="name" className={labelClass}>
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="story" className={labelClass}>
                                    Mi historia
                                </label>
                                <textarea
                                    id="story"
                                    value={story}
                                    onChange={(e) => setStory(e.target.value)}
                                    className={`${inputClass} resize-none`}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="country" className={labelClass}>
                                        País
                                    </label>
                                    <input
                                        id="country"
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className={labelClass}>
                                        Ciudad
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-full bg-[#8C52FF] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#7440E8] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/40 focus:ring-offset-2"
                        >
                            Guardar cambios
                        </button>

                        {message && (
                            <p className="mt-4 text-center text-sm text-[#3D2B1F]">{message}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
