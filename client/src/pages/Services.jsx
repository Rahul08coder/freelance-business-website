import { services } from '../config/site.js'
import { getIcon } from '../config/icons.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'

function Services() {
  usePageTitle('Services')

  const activeServices = services.filter((service) => service.enabled)

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Websites, web applications and fixes. Here is what I can help you with."
      />

      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <li key={service.id}>
                <Card hover className="flex h-full flex-col">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold">{service.title}</h2>
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                  <div className="mt-auto pt-5">
                    <Button
                      to={`/start-project?service=${service.id}`}
                      variant="secondary"
                      size="sm"
                    >
                      Discuss this service
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>

        <p className="mt-10 max-w-2xl text-sm text-muted">
          Every project is different. Send your requirements through the Start a Project form
          and I will reply with a quote.
        </p>
      </Section>

      <CtaBanner />
    </>
  )
}

export default Services