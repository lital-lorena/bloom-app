import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const REMEMBERED_EMAIL_KEY = 'remembered_email'

function Login() {
  const labelClass = 'mb-1.5 block text-sm font-normal text-[#3D2B1F]'

  const inputClass =
    'w-full min-h-[44px] rounded-lg border border-[#E5E7EB] bg-white py-3 text-base text-[#3D2B1F] placeholder:text-[#9CA3AF] transition-colors focus:border-[#8C52FF] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/20'

  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useUser()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    console.log(response.status, response.ok, data)
    if (response.ok) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
      login(data.user, data.access_token)
      navigate("/feed")
    } else {
      console.log("response.ok es FALSE:", response.status)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFAF6] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex flex-col items-center mb-6">
            <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-16 w-16 object-contain mb-3" />
            <h1 className="text-center font-serif text-2xl font-bold leading-tight text-[#3D2B1F] sm:text-[32px]">
              Bienvenida a Bloom
            </h1>
          </div>

          <form className="flex flex-col gap-4" noValidate onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Tu email"
                  className={`${inputClass} pl-10 pr-4`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Contraseña
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className={`${inputClass} pl-10 pr-11`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#8C52FF] transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A2 2 0 0 0 12 15a2 2 0 0 0 1.42-.58M9.88 5.09A9.77 9.77 0 0 1 12 5c5 0 9 4 10 7a11.6 11.6 0 0 1-1.67 2.67M6.11 6.11A11.6 11.6 0 0 0 2 12c1 3 5 7 10 7 1.09 0 2.13-.18 3.09-.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-right">
                <span className="text-sm text-[#8C52FF] hover:text-[#7440E8] cursor-default">
                  ¿Olvidaste tu contraseña?
                </span>
              </p>
            </div>

            <button
              type="submit"
              className="mt-2 min-h-[44px] w-full rounded-lg bg-[#8C52FF] px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#7440E8] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/40 focus:ring-offset-2"
            >
              Entrar
            </button>

            <p className="text-center text-sm text-[#3D2B1F]">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-medium text-[#8C52FF] hover:text-[#7440E8] transition-colors">
                Regístrate →
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
