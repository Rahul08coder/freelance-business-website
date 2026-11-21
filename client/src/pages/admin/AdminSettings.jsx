import { useState } from 'react'
import { siteConfig } from '../../config/site.js'
import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { ADMIN_SETTINGS_PATH, updateSettings } from '../../services/adminSettingsApi.js'
import {
  toSettingsFormValues,
  toSettingsPayload,
  validateSettings,
} from '../../utils/settingsForm.js'
import { formatDateTime } from '../../utils/formatDate.js'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'

// Server ke "socials.github" jaise field naam ko form ke "github" naam se jodta hai
function formFieldName(serverField) {
  return serverField.replace(/^socials\./, '')
}

function SettingsFormView({ initial, savedSettings }) {
  const [values, setValues] = useState(initial)
  const [updatedAt, setUpdatedAt] = useState(savedSettings?.updatedAt ?? null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))

    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous }
        delete next[name]
        return next
      })
    }
  }

  function focusFirstInvalid() {
    setTimeout(() => {
      document.querySelector('form [aria-invalid="true"]')?.focus()
    }, 0)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    setFormError('')
    setSavedMessage('')

    const validationErrors = validateSettings(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalid()
      return
    }

    setSubmitting(true)

    try {
      const data = await updateSettings(toSettingsPayload(values))
      setValues(toSettingsFormValues(data.settings))
      setUpdatedAt(data.settings.updatedAt)
      setSavedMessage('Saved. The footer, Contact page and Privacy Policy now show these details.')
    } catch (error) {
      if (Array.isArray(error.details) && error.details.length > 0) {
        const serverErrors = {}
        error.details.forEach(({ field, message }) => {
          serverErrors[formFieldName(field)] = message
        })
        setErrors(serverErrors)
        setFormError('Please fix the highlighted fields and try again.')
        focusFirstInvalid()
      } else {
        setFormError(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <Card>
        <div className="space-y-5">
          <Input
            label="Contact email"
            name="email"
            type="email"
            required
            autoComplete="off"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            hint="Shown in the footer, on the Contact page and in the Privacy Policy."
          />

          <Input
            label="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            error={errors.location}
            hint="Optional. Leave empty to hide it on the Contact page."
          />

          <fieldset className="space-y-5">
            <legend className="text-sm font-semibold">Social links</legend>
            <p className="text-xs text-muted">
              Leave a link empty to hide it from the website.
            </p>

            <Input
              label="GitHub"
              name="github"
              inputMode="url"
              placeholder="https://github.com/your-name"
              value={values.github}
              onChange={handleChange}
              error={errors.github}
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              inputMode="url"
              placeholder="https://www.linkedin.com/in/your-name"
              value={values.linkedin}
              onChange={handleChange}
              error={errors.linkedin}
            />
            <Input
              label="Twitter / X"
              name="twitter"
              inputMode="url"
              placeholder="https://x.com/your-name"
              value={values.twitter}
              onChange={handleChange}
              error={errors.twitter}
            />
          </fieldset>

          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {formError}
            </div>
          )}
          {savedMessage && (
            <p
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            >
              {savedMessage}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" loading={submitting}>
              {submitting ? 'Saving...' : 'Save settings'}
            </Button>
            {updatedAt && (
              <span className="text-xs text-muted">Last saved: {formatDateTime(updatedAt)}</span>
            )}
          </div>
        </div>
      </Card>
    </form>
  )
}

function AdminSettings() {
  usePageTitle('Settings')

  const { data, loading, error, retry } = useFetch(ADMIN_SETTINGS_PATH)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted">Your contact details, as shown on the website.</p>

      <p className="mt-3 max-w-2xl text-sm text-muted">
        The brand name, tagline and description are not changed here. They are set in the website
        code (<span className="font-mono text-xs">client/src/config/site.js</span>).
      </p>

      <div className="mt-6">
        {loading && <LoadingBlock label="Loading settings..." />}
        {error && <ErrorBlock message={error.message} onRetry={retry} />}

        {data && (
          <>
            {!data.settings && (
              <p className="mb-4 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                You have not saved settings yet. The values below are the website&apos;s built-in
                defaults. Press Save to store them, then you can change them any time.
              </p>
            )}

            <SettingsFormView
              initial={toSettingsFormValues(data.settings ?? siteConfig)}
              savedSettings={data.settings}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AdminSettings