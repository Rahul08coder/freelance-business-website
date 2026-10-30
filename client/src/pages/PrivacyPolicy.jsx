import { siteConfig } from '../config/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'

// Jab policy badle (ya analytics add karo), yeh date update karna.
const lastUpdated = 'October 30, 2026'

const sections = [
  {
    heading: 'Overview',
    paragraphs: [
      `This policy explains what information ${siteConfig.brandName} collects through this website, how it is used and the choices you have.`,
    ],
  },
  {
    heading: 'Information I collect',
    paragraphs: [
      'When you submit the Start a Project form, I collect the details you enter:',
    ],
    items: [
      'Your name and email address',
      'Your company or business name (optional)',
      'Project type, budget range and desired deadline',
      'Your project description and any additional notes',
      'A reference website URL (optional)',
    ],
    after:
      'I do not ask for passwords, payment details or government ID numbers. Please do not include them in the form.',
  },
  {
    heading: 'How I use your information',
    paragraphs: [
      'I use your details to read your project request, reply to you, discuss a quote and keep a record of our conversation. I do not sell your information or use it for unrelated marketing.',
    ],
  },
  {
    heading: 'Where your information is stored',
    paragraphs: [
      'Project requests are stored in a database. The website and its database are hosted by third-party cloud providers, who process data on my behalf to keep the website running.',
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: [
      'You do not need cookies to browse this website. A cookie is used only for the secure login of the website administrator. This website does not currently use advertising or analytics cookies. If that changes, this policy will be updated.',
    ],
  },
  {
    heading: 'How long I keep your information',
    paragraphs: [
      'I keep your project request for as long as it is needed to respond to you and to keep a record of our discussion. You can ask me to delete it at any time.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      `You can ask for a copy of your information, or ask me to correct or delete it, by emailing ${siteConfig.email}.`,
    ],
  },
  {
    heading: 'Security',
    paragraphs: [
      'I take reasonable steps to protect your information, such as using secure connections and keeping the administration area restricted. No method of sending data over the internet is completely secure, so I cannot guarantee absolute security.',
    ],
  },
  {
    heading: 'Children',
    paragraphs: [
      'This website is not intended for children under 13, and I do not knowingly collect information from them.',
    ],
  },
  {
    heading: 'Changes to this policy',
    paragraphs: [
      'I may update this policy from time to time. The date at the top of this page shows when it was last changed.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      `If you have any questions about this policy, email ${siteConfig.email}.`,
    ],
  },
]

function PrivacyPolicy() {
  usePageTitle('Privacy Policy')

  return (
    <>
      <PageHeader title="Privacy Policy" subtitle={`Last updated: ${lastUpdated}`} />

      <Section>
        <div className="max-w-3xl space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold">{section.heading}</h2>

              {section.paragraphs.map((text) => (
                <p key={text} className="mt-3 text-muted">
                  {text}
                </p>
              ))}

              {section.items && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.after && <p className="mt-3 text-muted">{section.after}</p>}
            </section>
          ))}
        </div>
      </Section>
    </>
  )
}

export default PrivacyPolicy