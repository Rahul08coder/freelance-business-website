import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { siteConfig } from '../../config/site.js'
import Container from '../ui/Container.jsx'

const socialLabels = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
}

function Footer() {
  const year = new Date().getFullYear()

  // Sirf wahi socials dikhao jinka link site.js mein bhara hai
  const socialLinks = Object.entries(siteConfig.socials).filter(([, url]) => url)

  const linkClass = 'text-sm text-muted transition hover:text-accent-600'

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="text-lg font-semibold tracking-tight text-accent-600">
              {siteConfig.brandName}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted">{siteConfig.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2">
              {siteConfig.navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={siteConfig.cta.path} className={linkClass}>
                  {siteConfig.cta.label}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={`mailto:${siteConfig.email}`} className={`${linkClass} inline-flex items-center gap-2`}>
                  <Mail size={14} aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              {socialLinks.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {socialLabels[name] || name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.brandName}. All rights reserved.
          </p>
          <ul className="flex gap-4">
            {siteConfig.footerLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="transition hover:text-accent-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}

export default Footer