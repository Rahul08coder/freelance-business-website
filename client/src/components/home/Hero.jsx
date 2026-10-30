import { ArrowRight } from 'lucide-react'
import { siteConfig } from '../../config/site.js'
import { getIcon } from '../../config/icons.js'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'
import heroImage from '../../assets/hero-illustration.svg'

function Hero() {
  const { hero, highlights, cta } = siteConfig

  return (
    <section className="bg-gradient-to-b from-accent-50/60 to-white">
      <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 ring-1 ring-accent-100">
            {hero.badge}
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {hero.headline}
            <span className="block text-accent-600">{hero.headlineAccent}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">{hero.text}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Main skills">
            {hero.chips.map((chip) => {
              const Icon = getIcon(chip.icon)
              return (
                <li
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink"
                >
                  <Icon size={14} className="text-accent-600" aria-hidden="true" />
                  {chip.label}
                </li>
              )
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={cta.path} size="lg">
              {cta.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button to={hero.secondaryCta.path} variant="outline" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        <img
          src={heroImage}
          alt="A laptop showing code and a phone showing a website design"
          width="640"
          height="480"
          className="mx-auto w-full max-w-xl"
        />
      </Container>

      {/* Highlights strip */}
      <div className="border-t border-line bg-white">
        <Container>
          <ul className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <li key={item.title} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted">{item.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Container>
      </div>
    </section>
  )
}

export default Hero