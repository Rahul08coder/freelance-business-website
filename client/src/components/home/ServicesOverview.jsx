import { useFetch } from '../../hooks/useFetch.js'
import { getIcon } from '../../config/icons.js'
import Section from '../ui/Section.jsx'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import LoadingBlock from '../ui/LoadingBlock.jsx'
import ErrorBlock from '../ui/ErrorBlock.jsx'

function ServicesOverview() {
  const { data, loading, error, retry } = useFetch('/services')

  return (
    <Section
      tone="surface"
      title="What I can build for you"
      subtitle="From a simple business website to a complete full-stack application."
    >
      {loading && <LoadingBlock label="Loading services..." />}
      {error && <ErrorBlock message={error.message} onRetry={retry} />}

      {data && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.services.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <li key={service.id}>
                <Card hover className="h-full">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-10">
        <Button to="/services" variant="outline">
          View all services
        </Button>
      </div>
    </Section>
  )
}

export default ServicesOverview