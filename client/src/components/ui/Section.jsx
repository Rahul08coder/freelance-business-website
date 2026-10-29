import Container from './Container.jsx'

const tones = {
  white: 'bg-white',
  surface: 'bg-surface',
}

// Page ka ek section: upar-neeche spacing, optional title aur subtitle.
function Section({ id, title, subtitle, tone = 'white', className = '', children }) {
  return (
    <section id={id} className={`${tones[tone]} py-16 sm:py-20 ${className}`}>
      <Container>
        {(title || subtitle) && (
          <div className="mb-10 max-w-2xl">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            )}
            {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

export default Section