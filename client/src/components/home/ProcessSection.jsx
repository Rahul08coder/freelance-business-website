import { processSteps } from '../../config/content.js'
import Section from '../ui/Section.jsx'

function ProcessSection() {
  return (
    <Section
      tone="surface"
      title="How we work together"
      subtitle="A simple process, so you always know what happens next."
    >
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li key={step.title}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export default ProcessSection