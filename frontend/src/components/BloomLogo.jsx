import logo from '../assets/logo.png'

export default function BloomLogo({ className = 'h-10 w-auto' }) {
  return (
    <img
      src={logo}
      alt="Bloom"
      className={`object-contain ${className}`}
    />
  )
}

