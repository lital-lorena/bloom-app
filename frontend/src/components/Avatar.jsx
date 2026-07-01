import { nameToAvatarStyle } from '../utils/avatarColor'

const sizes = {
  sm: 'h-9 w-9 text-sm',
  base: 'h-10 w-10 text-sm',
  md: 'h-11 w-11 text-lg',
  lg: 'h-16 w-16 text-2xl',
  xl: 'h-28 w-28 text-4xl',
}

export default function Avatar({ name, size = 'md', foto = null, className = '' }) {
  const letter = (name || '?').trim().charAt(0).toUpperCase()
  const sizeClass = sizes[size] || sizes.md

  if (foto) {
    return (
      <div className={`flex-none overflow-hidden rounded-full ${sizeClass} ${className}`.trim()}>
        <img src={foto} alt={name} className="h-full w-full object-cover object-top" />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-none items-center justify-center rounded-full font-title font-semibold ${sizeClass} ${className}`.trim()}
      style={nameToAvatarStyle(name)}
    >
      {letter}
    </div>
  )
}
