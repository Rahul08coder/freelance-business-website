import { usePageTitle } from '../hooks/usePageTitle.js'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'

function NotFound() {
  usePageTitle('Page not found')

  return (
    <section className="py-20 sm:py-28">
      <Container className="text-center">
        <p className="text-6xl font-bold text-accent-600">404</p>
        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">Back to home</Button>
          <Button to="/contact" variant="outline">
            Contact me
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default NotFound