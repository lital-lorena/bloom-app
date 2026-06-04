function Login() {
  const inputClass =
    'w-full min-h-[44px] rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#3D2B1F] placeholder:text-[#9CA3AF] transition-colors focus:border-[#8C52FF] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/20'

  const labelClass = 'mb-1.5 block text-sm font-normal text-[#3D2B1F]'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFAF6] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sm:p-6">
          <h1 className="mb-6 text-center font-serif text-2xl font-bold leading-tight text-[#3D2B1F] sm:text-[32px]">
            Bienvenida a Bloom 🌸
          </h1>

          <form className="flex flex-col gap-4" noValidate>
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
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="mt-2 min-h-[44px] w-full rounded-lg bg-[#8C52FF] px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#7440E8] focus:outline-none focus:ring-2 focus:ring-[#8C52FF]/40 focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
