import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700',
  secondary: 'bg-accent-50 text-accent-700 hover:bg-accent-100',
  outline: 'border border-line bg-white text-ink hover:bg-surface',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

// Agar `to` diya hai toh yeh link banega (page navigation).
// Nahi diya toh normal button banega (form submit, click action).
function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export default Button