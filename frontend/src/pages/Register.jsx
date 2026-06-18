import { useState } from 'react'
import { useNavigate } from 'react-router-dom'




function Register() {
  const inputClass =
    'w-full min-h-[44px] rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#3D2B1F] placeholder:text-[#9CA3AF] transition-colors focus:border-[#8C52FF] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/20'

  const labelClass = 'mb-1.5 block text-sm font-normal text-[#3D2B1F]'
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: name,
        apellido: lastName,
        email,
        ciudad: location,
        pais: location,
        password
      })
    })
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      navigate("/login")
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFAF6] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex flex-col items-center mb-6">
            <img src="/src/assets/bloom_flor.png" alt="Bloom" className="h-16 w-16 object-contain mb-3" />
            <h1 className="text-center font-serif text-2xl font-bold leading-tight text-[#3D2B1F] sm:text-[32px]">
              Únete a Bloom
            </h1>
          </div>

          <form className="flex flex-col gap-4" noValidate onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className={labelClass}>
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
                <label htmlFor="apellido" className={labelClass}>
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

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Tu email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="ciudad-pais" className={labelClass}>
                Ciudad / País
              </label>
              <input
                id="ciudad-pais"
                type="text"
                autoCapitalize="words"
                name="ciudadPais"
                autoComplete="address-level2"
                placeholder="Ej. Madrid, España"
                className={inputClass}
                value={location}
                onChange={(e) => setLocation(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
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
            </div>

            <button
              type="submit"
              className="mt-2 min-h-[44px] w-full rounded-lg bg-[#8C52FF] px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#7440E8] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/40 focus:ring-offset-2"
            >
              Unirme a Bloom
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
