import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BloomLogo from '../components/BloomLogo'
import BackLink from '../components/BackLink'
import { API_URL } from '../config/api'
import registerBg from '../assets/bloom_register_bg.jpg'

function Register() {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [pais, setPais] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const url = `${API_URL}/api/auth/register`
    const body = {
      nombre: name,
      apellido: lastName,
      email,
      ciudad,
      pais,
      password,
    }

    console.log('[Register] API_URL:', API_URL)
    console.log('[Register] POST URL:', url)
    console.log('[Register] VITE_API_URL (raw):', import.meta.env.VITE_API_URL)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      console.log('[Register] response status:', response.status)
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        navigate("/login")
      } else {
        setError(data.error || "No se pudo crear la cuenta. Inténtalo de nuevo.")
      }
    } catch (err) {
      console.error('[Register] fetch error:', err)
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base text-bloom-dark placeholder:text-bloom-gray transition-colors focus:border-bloom-pink focus:outline-none focus:ring-2 focus:ring-bloom-pink/20"

  return (
    <div className="flex min-h-screen">

      {/* ── COLUMNA IZQUIERDA: FORMULARIO ── */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">

          <BackLink to="/" />

          {/* Logo */}
          <div className="mb-6">
            <BloomLogo className="h-14 w-auto" />
          </div>

          {/* Título */}
          <h1 className="font-title text-3xl font-bold text-bloom-dark sm:text-4xl">
            Comienza tu nueva etapa
          </h1>
          <p className="mt-2 text-base text-bloom-gray">
            Crea tu cuenta y únete a una comunidad de mujeres que crecen juntas.
          </p>

          {/* Formulario */}
          <form className="mt-6 flex flex-col gap-3.5" noValidate onSubmit={handleRegister}>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  autoCapitalize="words"
                  name="nombre"
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                />
              </div>
              <div>
                <label htmlFor="apellido" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  autoCapitalize="words"
                  name="apellido"
                  autoComplete="family-name"
                  placeholder="Tu apellido"
                  className={inputClass}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Ciudad + País */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ciudad" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  type="text"
                  autoCapitalize="words"
                  name="ciudad"
                  autoComplete="address-level2"
                  placeholder="Ej. Valencia"
                  className={inputClass}
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                />
              </div>
              <div>
                <label htmlFor="pais" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                  País
                </label>
                <input
                  id="pais"
                  type="text"
                  autoCapitalize="words"
                  name="pais"
                  autoComplete="country-name"
                  placeholder="Ej. España"
                  className={inputClass}
                  value={pais}
                  onChange={(e) => setPais(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Crea una contraseña"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-bloom-gray">Mínimo 8 caracteres.</p>
            </div>

            {/* Términos */}
            <label className="flex items-start gap-2 text-sm text-bloom-gray">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#E5E7EB] accent-bloom-pink"
              />
              <span>
                Acepto los{' '}
                <span className="text-bloom-pink hover:text-bloom-rose cursor-default">
                  Términos
                </span>{' '}
                y la{' '}
                <span className="text-bloom-pink hover:text-bloom-rose cursor-default">
                  Política de privacidad
                </span>{' '}
                de Bloom.
              </span>
            </label>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-full bg-bloom-pink px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-bloom-rose disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-bloom-dark">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-bloom-pink hover:text-bloom-rose transition-colors">
                Inicia sesión →
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ── COLUMNA DERECHA: FOTO + CITA ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">

        {/* Foto de fondo */}
        <img
          src={registerBg}
          alt="Mujeres profesionales"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay suave para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/60 via-transparent to-bloom-pink/10" />

        {/* Cita sobre la foto */}
        <div className="relative z-10 mt-auto mb-16 w-full p-10">
          <div className="rounded-2xl bg-white/85 p-6 shadow-lg backdrop-blur-sm">
            <p className="font-subtitle text-base italic leading-relaxed text-bloom-dark">
              "Me uní un domingo por la noche, sin estar segura. El lunes ya tenía tres mujeres ofreciéndome ayuda. Bloom es real."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bloom-pink text-sm font-semibold text-white">
                L
              </div>
              <div>
                <p className="text-sm font-semibold text-bloom-dark">Laura Gómez</p>
                <p className="text-xs text-bloom-gray">Volviendo al trabajo tras una pausa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

