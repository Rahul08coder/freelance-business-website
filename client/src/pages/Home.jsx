import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { siteConfig, services } from '../config/site.js'

function Home() {
  const activeServices = services.filter((service) => service.enabled)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">{siteConfig.brandName}</h1>
        <p className="mt-2 text-muted">{siteConfig.tagline}</p>

        <Link
          to={siteConfig.cta.path}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-700"
        >
          {siteConfig.cta.label}
          <ArrowRight size={16} />
        </Link>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Color check</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <div className="rounded-lg bg-accent-50 p-4">accent-50</div>
          <div className="rounded-lg bg-accent-100 p-4">accent-100</div>
          <div className="rounded-lg bg-accent-500 p-4 text-white">accent-500</div>
          <div className="rounded-lg bg-accent-600 p-4 text-white">accent-600</div>
          <div className="rounded-lg bg-accent-700 p-4 text-white">accent-700</div>
          <div className="rounded-lg border border-line bg-surface p-4">surface</div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Services from config ({activeServices.length})</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {activeServices.map((service) => (
            <li key={service.id}>{service.title}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Home