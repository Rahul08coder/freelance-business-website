import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useNoIndex } from '../../hooks/useNoIndex.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'

function AdminLogin() {
  usePageTitle('Admin login')
  useNoIndex()

  const { status, login } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Login ke baad wahin bhejo jahan se aaye the (sirf /admin ke andar)
  const requested = location.state?.from?.pathname
  const destination = requested && requested.startsWith('/admin') ? requested : '/admin'

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoadingBlock label="Checking your session..." />
      </div>
    )
  }

  // Pehle se login ho toh login page dikhana hi nahi
  if (status === 'authenticated') {
    return <Navigate to={destination} replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Safal hone par status "authenticated" ho jata hai, aur upar wala <Navigate> aage bhej deta hai
      await login(form.email.trim(), form.password)
    } catch (loginError) {
      setError(loginError.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-2 text-center text-sm text-muted">Sign in to manage your website.</p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5 rounded-xl border border-line bg-white p-6 shadow-sm"
        >
          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="username"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted transition hover:text-accent-600">
            Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin