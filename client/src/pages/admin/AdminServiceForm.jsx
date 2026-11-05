import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { getIcon } from '../../config/icons.js'
import {
  adminServicePath,
  createService,
  updateService,
} from '../../services/adminServiceApi.js'
import {
  emptyService,
  serviceIconOptions,
  serviceSlugFromTitle,
  toServiceFormValues,
  toServicePayload,
  validateService,
} from '../../utils/serviceForm.js'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'

function BackLink() {
  return (
    <Link
      to="/admin/services"
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition hover:text-accent-700"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back to services
    </Link>
  )
}

// Naya aur edit, dono ke liye ek hi form. service = edit mein asli service, naye mein null.
function ServiceFormView({ initial, service }) {
  const navigate = useNavigate()
  const isEdit = Boolean(service)

  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  // Naye service mein slug title se apne aap banta hai, jab tak tum use khud na badlo
  const [slugTouched, setSlugTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const PreviewIcon = getIcon(values.icon)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setValues((previous) => {
      const next = { ...previous, [name]: nextValue }
      if (!isEdit && name === 'title' && !slugTouched) {
        next.slug = serviceSlugFromTitle(value)
      }
      return next
    })

    if (name === 'slug') setSlugTouched(true)

    // Is field ka purana error type karte hi hata do
    if (errors[name] || (name === 'title' && errors.slug && !slugTouched)) {
      setErrors((previous) => {
        const next = { ...previous }
        delete next[name]
        if (name === 'title' && !slugTouched) delete next.slug
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

    const validationErrors = validateService(values, isEdit)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalid()
      return
    }

    setSubmitting(true)

    try {
      const payload = toServicePayload(values, isEdit)

      if (isEdit) {
        const data = await updateService(service.id, payload)
        setValues(toServiceFormValues(data.service))
        setSavedMessage('Saved. The website now shows your changes.')
      } else {
        await createService(payload)
        navigate('/admin/services', { state: { flash: 'Service created.' } })
        return
      }
    } catch (error) {
      if (Array.isArray(error.details) && error.details.length > 0) {
        // Server ne field-wise errors bheje (jaise slug pehle se kisi aur ka hai)
        const serverErrors = {}
        error.details.forEach(({ field, message }) => {
          serverErrors[field] = message
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
    <div>
      <BackLink />

      <h1 className="text-2xl font-semibold tracking-tight">
        {isEdit ? 'Edit service' : 'New service'}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-2xl">
        <Card>
          <div className="space-y-5">
            <Input
              label="Title"
              name="title"
              required
              value={values.title}
              onChange={handleChange}
              error={errors.title}
            />

            {isEdit ? (
              <div>
                <p className="text-sm font-medium">Slug</p>
                <p className="mt-1 font-mono text-sm text-muted">{service.slug}</p>
                <p className="mt-1 text-xs text-muted">
                  The slug cannot be changed. It is used in links like
                  /start-project?service={service.slug} and in old inquiries.
                </p>
              </div>
            ) : (
              <Input
                label="Slug"
                name="slug"
                required
                value={values.slug}
                onChange={handleChange}
                error={errors.slug}
                hint="Lowercase letters, numbers and hyphens. It cannot be changed later."
              />
            )}

            <Textarea
              label="Short description"
              name="description"
              required
              rows={3}
              maxLength={300}
              value={values.description}
              onChange={handleChange}
              error={errors.description}
              hint={`${values.description.trim().length}/300. Shown on the service card.`}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Select
                  label="Icon"
                  name="icon"
                  required
                  options={serviceIconOptions}
                  placeholder="Choose an icon"
                  value={values.icon}
                  onChange={handleChange}
                  error={errors.icon}
                />
                <div className="mt-3 flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <PreviewIcon size={20} aria-hidden="true" />
                  </span>
                  Preview
                </div>
              </div>

              <Input
                label="Order"
                name="order"
                type="number"
                min="0"
                max="9999"
                value={values.order}
                onChange={handleChange}
                error={errors.order}
                hint="Smaller number shows first. Leave empty to add it at the end."
              />
            </div>

            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                name="enabled"
                checked={values.enabled}
                onChange={handleChange}
                className="h-4 w-4 rounded border-line"
              />
              Show this service on the website and in the Start a Project form
            </label>

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

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" loading={submitting}>
                {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create service'}
              </Button>
              <Button to="/admin/services" variant="outline" size="lg">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}

export function AdminServiceNew() {
  usePageTitle('New service')

  return <ServiceFormView initial={emptyService} service={null} />
}

export function AdminServiceEdit() {
  const { id } = useParams()
  const { data, loading, error, retry } = useFetch(adminServicePath(id))

  usePageTitle(data ? `Edit ${data.service.title}` : 'Edit service')

  if (loading) {
    return <LoadingBlock label="Loading service..." />
  }

  // Galat id (400) ya na mila (404)
  if (error && (error.status === 404 || error.status === 400)) {
    return (
      <div>
        <BackLink />
        <Card>
          <h1 className="text-lg font-semibold">Service not found</h1>
          <p className="mt-2 text-sm text-muted">
            It may have been deleted, or the link is not correct.
          </p>
        </Card>
      </div>
    )
  }

  if (error) {
    return <ErrorBlock message={error.message} onRetry={retry} />
  }

  // key se alag service par fresh form milta hai
  return (
    <ServiceFormView
      key={data.service.id}
      initial={toServiceFormValues(data.service)}
      service={data.service}
    />
  )
}