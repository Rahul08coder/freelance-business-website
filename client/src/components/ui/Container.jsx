// Content ko center mein rakhta hai aur max width limit karta hai.
// Mobile par side spacing kam, bade screens par zyada.

function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default Container