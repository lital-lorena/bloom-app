import { useNavigate } from 'react-router-dom'

const variants = {
  default:
    'mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-bloom-pink px-4 py-2 text-sm font-medium text-bloom-pink transition-colors hover:bg-bloom-pink/5',
  hero:
    'inline-flex w-fit items-center gap-2 rounded-full bg-bloom-lime px-5 py-2.5 text-sm font-semibold text-bloom-pink shadow-md transition-opacity hover:opacity-90',
}

export default function BackLink({ to = '/', label = 'Volver', variant = 'default', className = '' }) {
  const navigate = useNavigate()
  const baseClass = variants[variant] || variants.default

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={[baseClass, className].filter(Boolean).join(' ')}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 flex-none"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {label}
    </button>
  )
}

