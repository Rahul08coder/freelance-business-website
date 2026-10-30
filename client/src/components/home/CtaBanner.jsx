import { siteConfig } from '../../config/site.js'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

function CtaBanner() {
  const { cta, email } = siteConfig

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="rounded-2xl border border-accent-100 bg-accent-50 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Tell me what you need and I will get back to you with the next steps.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button to={cta.path} size="lg">
              {cta.label}
            </Button>
            <a
              href={`mailto:${email}`}
              className="text-sm font-medium text-accent-700 hover:underline"
            >
              or email {email}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default CtaBanner