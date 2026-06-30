import { useUser } from '../context/UserContext'

function linkClasses(isActive, light) {
  const base = 'text-sm font-medium transition-colors duration-200'
  if (light) {
    return `${base} ${isActive ? 'font-semibold text-bloom-peach' : 'text-white hover:text-bloom-peach'}`
  }
  return `${base} ${isActive ? 'font-semibold text-bloom-pink' : 'text-bloom-dark hover:text-bloom-pink'}`
}

export default function NavAuthLinks({ active = null, className = '', light = false }) {
  const { token } = useUser()

  if (!token) return null

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <a href="/feed" className={linkClasses(active === 'feed', light)}>
        Feed
      </a>
      <a href="/profile" className={linkClasses(active === 'profile', light)}>
        Mi perfil
      </a>
    </div>
  )
}

