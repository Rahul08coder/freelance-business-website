import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { adminNavLinks } from '../config/adminNav.js'
import { useAuth } from '../hooks/useAuth.js'
import { useNoIndex } from '../hooks/useNoIndex.js'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'

function navLinkClass({ isActive }) {
  const base = 'rounded-md px-3 py-2 text-sm font-medium transition'
  return isActive ? `${base} bg-accent-50 text-accent-700` : `${base} text-muted hover:text-ink`
}

// Admin pages ka frame: upar bar (naam, menu, logout) aur neeche page.
function AdminLayout() {
  useNoIndex()

  const { admin, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    await logout() // logout hote hi ProtectedRoute login page par bhej deta hai
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/admin" className="text-lg font-semibold tracking-tight text-accent-600">
              DevLance Admin
            </Link>
            <nav aria-label="Admin navigation" className="flex gap-1">
              {adminNavLinks.map((link) => (
                // Dashboard par "end": warna /admin har admin page par highlight rehta
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin'}
                  className={navLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted transition hover:text-accent-600">
              View website
            </Link>
            <span className="hidden text-sm text-muted sm:inline">{admin?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} loading={loggingOut}>
              <LogOut size={14} aria-hidden="true" />
              Log out
            </Button>
          </div>
        </Container>
      </header>

      <main>
        <Container className="py-8">
          <Outlet />
        </Container>
      </main>
    </div>
  )
}

export default AdminLayout