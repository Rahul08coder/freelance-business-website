import { useState } from 'react'
import { Check, Copy, Mail, MapPin } from 'lucide-react'
import { siteConfig } from '../config/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

const socialLabels = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
}

function Contact() {
  usePageTitle('Contact')

  const [copied, setCopied] = useState(false)

  // Sirf wahi socials dikhao jinka link site.js mein bhara hai
  const socialLinks = Object.entries(siteConfig.socials).filter(([, url]) => url)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(siteConfig.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Contact"
        subtitle="Have a question or want to talk about your idea? Here is how to reach me."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">Get in touch</h2>

            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-accent-600" aria-hidden="true" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="break-all text-muted transition hover:text-accent-600"
                  >
                    {siteConfig.email}
                  </a>
                  <div className="mt-2 flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check size={14} aria-hidden="true" />
                      ) : (
                        <Copy size={14} aria-hidden="true" />
                      )}
                      {copied ? 'Copied' : 'Copy email'}
                    </Button>
                    <span role="status" className="text-xs text-accent-700">
                      {copied ? 'Email copied to clipboard' : ''}
                    </span>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent-600" aria-hidden="true" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted">{siteConfig.location}</p>
                </div>
              </li>
            </ul>

            {socialLinks.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-sm font-medium">Find me online</p>
                <ul className="mt-2 flex flex-wrap gap-4 text-sm">
                  {socialLinks.map(([name, url]) => (
                    <li key={name}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-600 transition hover:text-accent-700"
                      >
                        {socialLabels[name] || name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card className="flex flex-col">
            <h2 className="text-lg font-semibold">Have a project in mind?</h2>
            <p className="mt-3 text-sm text-muted">
              For quotes and project work, please use the Start a Project form. It lets you share
              everything I need in one place, so I can give you a useful reply.
            </p>
            <div className="mt-auto pt-6">
              <Button to={siteConfig.cta.path}>{siteConfig.cta.label}</Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  )
}

export default Contact