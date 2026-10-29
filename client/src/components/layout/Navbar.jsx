import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '../../config/site.js'
import Container from '../ui/Container.jsx'
import Button from '../ui/Button.jsx'

// NavLink ek `isActive` deta hai: current page ka link true hota hai.
function desktopLinkClass({ isActive }) {
  const base = 'rounded-md px-3 py-2 text-sm font-medium transition'
  return isActive
    ? `${base} bg-accent-50 text-accent-700`
    : `${base} text-muted hover:text-ink`
}

function mobileLinkClass({ isActive }) {
  const base = 'block rounded-md px-3 py-3 text-base font-medium transition'
  return isActive
    ? `${base} bg-accent-50 text-accent-700`
    : `${base} text-ink hover:bg-surface`
}

function Navbar() {
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  // Menu khula ho toh Escape key dabane par band ho jaye
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-lg font-semibold tracking-tight text-accent-600"
        >
          {siteConfig.brandName}
        </Link>

        {/* Desktop navigation (md se bade screens par) */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {siteConfig.navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={desktopLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
          <Button to={siteConfig.cta.path} size="sm" className="ml-3">
            {siteConfig.cta.label}
          </Button>
        </nav>

        {/* Hamburger button (sirf mobile par) */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-md p-2 text-ink transition hover:bg-surface md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {/* Mobile menu panel */}
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white md:hidden">
          <Container className="py-3">
            <nav aria-label="Mobile navigation" className="space-y-1">
              {siteConfig.navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <Button
              to={siteConfig.cta.path}
              onClick={closeMenu}
              className="mt-3 w-full"
            >
              {siteConfig.cta.label}
            </Button>
          </Container>
        </div>
      )}
    </header>
  )
}

export default Navbar