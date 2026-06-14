import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'

export default function Profile() {
    const { token } = useUser()

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

    return (
        <div className="min-h-screen bg-[#fdf6f0] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-[#2d1b4e] mb-6">Mi Perfil 🌸</h1>
                {avatar && typeof avatar === "string" && (
                    <div className="flex justify-center mb-4">
                        <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg p-3" />
                    <textarea placeholder="Tu historia" value={story} onChange={(e) => setStory(e.target.value)} className="border rounded-lg p-3" rows={3} />
                    <input type="text" placeholder="País" value={country} onChange={(e) => setCountry(e.target.value)} className="border rounded-lg p-3" />
                    <input type="text" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} className="border rounded-lg p-3" />
                    <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} className="border rounded-lg p-3" />
                    <button type="submit" className="bg-purple-600 text-white rounded-lg p-3 font-semibold hover:bg-purple-700">Guardar cambios</button>
                    {message && <p className="text-center text-sm">{message}</p>}
                </form>
            </div>
        </div>
    )
}
