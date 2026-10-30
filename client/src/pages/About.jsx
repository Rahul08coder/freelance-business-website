import { Check } from 'lucide-react'
import { aboutContent } from '../config/aboutContent.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import SkillsSection from '../components/home/SkillsSection.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'

function About() {
  usePageTitle('About')

  return (
    <>
      <PageHeader
        title="About"
        subtitle="A little about me and how I like to work with clients."
      />

      <Section>
        <div className="max-w-3xl space-y-5 text-base text-ink sm:text-lg">
          {aboutContent.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section
        tone="surface"
        title="How I work"
        subtitle="What you can expect when we work together."
      >
        <ul className="grid gap-6 sm:grid-cols-2">
          {aboutContent.principles.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                <Check size={14} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <SkillsSection />
      <CtaBanner />
    </>
  )
}

export default About