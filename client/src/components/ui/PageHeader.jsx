import Container from './Container.jsx'

// Inner pages (About, Services, etc.) ka upar wala title block.
function PageHeader({ title, subtitle }) {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted sm:text-lg">{subtitle}</p>}
      </Container>
    </section>
  )
}

export default PageHeader