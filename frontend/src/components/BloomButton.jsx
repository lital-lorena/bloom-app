const variants = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full bg-bloom-pink px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-bloom-rose md:px-8 md:py-3.5 md:text-base',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border-2 border-bloom-pink bg-transparent px-6 py-3 text-sm font-semibold text-bloom-pink transition-colors hover:bg-bloom-pink/10 md:px-8 md:py-3.5 md:text-base',
  hero:
    'inline-flex w-fit items-center gap-3 rounded-full bg-bloom-lime px-6 py-3 text-sm font-semibold text-bloom-pink shadow-md transition-opacity hover:opacity-90 md:px-8 md:py-3.5 md:text-base',
  nav:
    'rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-bloom-pink shadow-md transition-colors hover:bg-white',
  ghost:
    'rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-bloom-dark transition-colors hover:bg-black/5',
}

export default function BloomButton({
  variant = 'primary',
  children,
  className = '',
  showDot = false,
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {showDot && variant === 'hero' && (
        <span className="h-3 w-3 flex-none rounded-full bg-bloom-pink" />
      )}
      {children}
    </button>
  )
}
