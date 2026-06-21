import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: name,
        apellido: lastName,
        email,
        ciudad,
        pais,
        password
      })
    })
    const data = await response.json()
    if (response.ok) {
      navigate("/login")
    } else {
      setError(data.error || "No se pudo crear la cuenta. Inténtalo de nuevo.")
    }
    setLoading(false)
  }

  const inputClass =
    "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#3D2B1F] placeholder:text-[#9CA3AF] transition-colors focus:border-[#8C52FF] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/20"

  return (
    <div className="flex min-h-screen">

      {/* ── COLUMNA IZQUIERDA: FORMULARIO ── */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">

          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <img
              src="/src/assets/bloom_flor.png"
              alt="Bloom"
              className="h-9 w-9 object-contain"
            />
            <span className="font-serif text-xl font-semibold text-[#3D2B1F]">
              Bloom
            </span>
          </div>

          {/* Título */}
          <h1 className="font-serif text-3xl font-bold text-[#3D2B1F] sm:text-4xl">
            Comienza tu nueva etapa
          </h1>
          <p className="mt-2 text-base text-[#9CA3AF]">
            Crea tu cuenta y únete a una comunidad de mujeres que crecen juntas.
          </p>

          {/* Formulario */}
          <form className="mt-6 flex flex-col gap-3.5" noValidate onSubmit={handleRegister}>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
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
                <label htmlFor="apellido" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
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
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
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
                <label htmlFor="ciudad" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
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
                <label htmlFor="pais" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
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
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#3D2B1F]">
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
              <p className="mt-1.5 text-xs text-[#9CA3AF]">Mínimo 8 caracteres.</p>
            </div>

            {/* Términos */}
            <label className="flex items-start gap-2 text-sm text-[#9CA3AF]">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#E5E7EB] accent-[#8C52FF]"
              />
              <span>
                Acepto los{' '}
                <span className="text-[#8C52FF] hover:text-[#7440E8] cursor-default">
                  Términos
                </span>{' '}
                y la{' '}
                <span className="text-[#8C52FF] hover:text-[#7440E8] cursor-default">
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
              className="mt-1 w-full rounded-full bg-[#8C52FF] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#7440E8] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-[#3D2B1F]">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-[#8C52FF] hover:text-[#7440E8] transition-colors">
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
          src="/src/assets/bloom_register_bg.jpg"
          alt="Mujeres profesionales"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay suave para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/60 via-transparent to-[#8C52FF]/10" />

        {/* Cita sobre la foto */}
        <div className="relative z-10 mt-auto mb-16 w-full p-10">
          <div className="rounded-2xl bg-white/85 p-6 shadow-lg backdrop-blur-sm">
            <p className="font-serif text-base italic leading-relaxed text-[#3D2B1F]">
              "Me uní un domingo por la noche, sin estar segura. El lunes ya tenía tres mujeres ofreciéndome ayuda. Bloom es real."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8C52FF] text-sm font-semibold text-white">
                L
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3D2B1F]">Laura Gómez</p>
                <p className="text-xs text-[#9CA3AF]">Volviendo al trabajo tras una pausa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register