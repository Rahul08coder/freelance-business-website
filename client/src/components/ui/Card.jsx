// Services aur projects ke liye box. hover={true} par halka lift effect.
function Card({ children, hover = false, className = '' }) {
  const hoverStyles = hover ? 'transition hover:-translate-y-0.5 hover:shadow-md' : ''

  return (
    <div className={`rounded-xl border border-line bg-white p-6 shadow-sm ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}

export default Card