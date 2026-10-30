import { ChevronDown } from 'lucide-react'
import { faqs } from '../../config/content.js'
import Section from '../ui/Section.jsx'

// Browser ka built-in <details> use kiya hai: keyboard (Enter/Space) se bhi khulta hai,
// aur isme koi extra JavaScript ya state nahi lagti.
function FAQSection() {
  return (
    <Section
      tone="surface"
      title="Frequently asked questions"
      subtitle="Quick answers before you get in touch."
    >
      <div className="max-w-3xl space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-line bg-white px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="shrink-0 text-muted transition group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

export default FAQSection