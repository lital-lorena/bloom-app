import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import BloomLogo from '../components/BloomLogo'
import BackLink from '../components/BackLink'

const REMEMBERED_EMAIL_KEY = 'remembered_email'

function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useUser()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const response = await fetch("import.meta.env.VITE_API_URL/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (response.ok) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
      login(data.user, data.access_token)
      navigate("/feed")
    } else {
      setError(data.error || "Email o contraseÃ±a incorrectos")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">

      {/* â”€â”€ COLUMNA IZQUIERDA: FORMULARIO â”€â”€ */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">

          <BackLink to="/" />

          {/* Logo */}
          <div className="mb-10">
            <BloomLogo className="h-14 w-auto" />
          </div>

          {/* TÃ­tulo */}
          <h1 className="font-title text-3xl font-bold text-bloom-dark sm:text-4xl">
            Bienvenida de nuevo
          </h1>
          <p className="mt-2 text-base text-bloom-gray">
            Inicia sesiÃ³n para continuar tu camino en la comunidad Bloom.
          </p>

          {/* Formulario */}
          <form className="mt-8 flex flex-col gap-5" noValidate onSubmit={handleLogin}>

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
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-base text-bloom-dark placeholder:text-bloom-gray transition-colors focus:border-bloom-pink focus:outline-none focus:ring-2 focus:ring-bloom-pink/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* ContraseÃ±a */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-bloom-dark">
                ContraseÃ±a
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 pr-11 text-base text-bloom-dark placeholder:text-bloom-gray transition-colors focus:border-bloom-pink focus:outline-none focus:ring-2 focus:ring-bloom-pink/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bloom-gray hover:text-bloom-pink transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseÃ±a' : 'Mostrar contraseÃ±a'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0 0 12 15a2 2 0 0 0 1.42-.58M9.88 5.09A9.77 9.77 0 0 1 12 5c5 0 9 4 10 7a11.6 11.6 0 0 1-1.67 2.67M6.11 6.11A11.6 11.6 0 0 0 2 12c1 3 5 7 10 7 1.09 0 2.13-.18 3.09-.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Recordar + Olvidaste */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-bloom-gray">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#E5E7EB] accent-bloom-pink"
                />
                Recordarme
              </label>
              <span className="text-sm font-medium text-bloom-pink hover:text-bloom-rose cursor-default">
                Â¿Olvidaste tu contraseÃ±a?
              </span>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            {/* BotÃ³n */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-full bg-bloom-pink px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-bloom-rose disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* Registro */}
            <p className="text-center text-sm text-bloom-dark">
              Â¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-bloom-pink hover:text-bloom-rose transition-colors">
                Crea tu cuenta â†’
              </Link>
            </p>
          </form>
        </div>
      </div>
      {/* â”€â”€ COLUMNA DERECHA: FOTO + FLORES + CITA â”€â”€ */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">

        {/* Foto de fondo */}
        <img
          src="/src/assets/bloom_login_bg.jpg"
          alt="Mujeres profesionales"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay suave */}
        <div className="absolute inset-0 bg-gradient-to-t from-bloom-dark/60 via-transparent to-bloom-pink/15" />


        {/* Cita */}
        <div className="relative z-10 mt-auto mb-16 w-full p-10">
          <div className="rounded-2xl bg-white/85 p-6 shadow-lg backdrop-blur-sm">
            <p className="font-subtitle text-base italic leading-relaxed text-bloom-dark">
              "Cada vez que entro, encuentro a alguien cuya historia se parece a la mÃ­a. Eso lo cambia todo."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bloom-pink text-sm font-semibold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-bloom-dark">Ana MartÃ­nez</p>
                <p className="text-xs text-bloom-gray">A los 35 me atrevÃ­ a empezar de cero</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

