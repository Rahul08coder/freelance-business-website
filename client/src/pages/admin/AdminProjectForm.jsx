import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { projectCategoryOptions } from '../../config/projectOptions.js'
import {
  adminProjectPath,
  createProject,
  updateProject,
} from '../../services/adminProjectService.js'
import { emptyProject, slugify, toFormValues, toPayload, validateProject } from '../../utils/projectForm.js'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'

// Naya aur edit, dono ke liye ek hi form. initial = form ke shuruaati values, project = edit mein asli project.
function ProjectFormView({ initial, project }) {
  const navigate = useNavigate()
  const isEdit = Boolean(project)

  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  // Naye project mein slug title se apne aap banta hai, jab tak tum use khud na badlo
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setValues((previous) => {
      const next = { ...previous, [name]: nextValue }
      if (name === 'title' && !slugTouched) {
        next.slug = slugify(value)
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

    const validationErrors = validateProject(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalid()
      return
    }

    setSubmitting(true)

    try {
      const payload = toPayload(values)

      if (isEdit) {
        const data = await updateProject(project.id, payload)
        setValues(toFormValues(data.project))
        setSavedMessage('Saved. The website now shows your changes.')
      } else {
        await createProject(payload)
        navigate('/admin/projects', { state: { flash: 'Project created.' } })
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
      <Link
        to="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition hover:text-accent-700"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">
        {isEdit ? 'Edit project' : 'New project'}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-3xl">
        <Card>
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Title"
                name="title"
                required
                value={values.title}
                onChange={handleChange}
                error={errors.title}
              />
              <Input
                label="Slug"
                name="slug"
                required
                value={values.slug}
                onChange={handleChange}
                error={errors.slug}
                hint={`Web address: /portfolio/${values.slug || 'your-slug'}`}
              />
            </div>

            {isEdit && values.slug !== project.slug && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Changing the slug changes this project&apos;s web address. Old links to it will stop
                working.
              </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Category"
                name="category"
                required
                placeholder="Choose a category"
                options={projectCategoryOptions}
                value={values.category}
                onChange={handleChange}
                error={errors.category}
              />
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

            <Textarea
              label="Short description"
              name="description"
              required
              rows={3}
              maxLength={300}
              value={values.description}
              onChange={handleChange}
              error={errors.description}
              hint={`${values.description.trim().length}/300. Shown on the project card.`}
            />

            <Textarea
              label="Overview"
              name="overview"
              required
              rows={6}
              maxLength={3000}
              value={values.overview}
              onChange={handleChange}
              error={errors.overview}
              hint={`${values.overview.trim().length}/3000. Shown on the project page.`}
            />

            <Textarea
              label="Key features"
              name="features"
              rows={6}
              value={values.features}
              onChange={handleChange}
              error={errors.features}
              hint="One feature per line. Up to 15."
            />

            <Input
              label="Technologies"
              name="tech"
              value={values.tech}
              onChange={handleChange}
              error={errors.tech}
              hint="Separate with commas, for example: React, Node.js, MongoDB. Up to 15."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="GitHub link"
                name="githubUrl"
                inputMode="url"
                placeholder="https://github.com/..."
                value={values.githubUrl}
                onChange={handleChange}
                error={errors.githubUrl}
                hint="Optional."
              />
              <Input
                label="Live demo link"
                name="liveUrl"
                inputMode="url"
                placeholder="https://..."
                value={values.liveUrl}
                onChange={handleChange}
                error={errors.liveUrl}
                hint="Optional. Add it once the project is deployed."
              />
            </div>

            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                name="featured"
                checked={values.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-line"
              />
              Show this project in &quot;Featured projects&quot; on the home page
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
                {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
              </Button>
              <Button to="/admin/projects" variant="outline" size="lg">
                Cancel
              </Button>
              {isEdit && (
                <Link
                  to={`/portfolio/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-accent-600"
                >
                  View on website
                </Link>
              )}
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}

export function AdminProjectNew() {
  usePageTitle('New project')

  return <ProjectFormView initial={emptyProject} project={null} />
}

export function AdminProjectEdit() {
  const { id } = useParams()
  const { data, loading, error, retry } = useFetch(adminProjectPath(id))

  usePageTitle(data ? `Edit ${data.project.title}` : 'Edit project')

  if (loading) {
    return <LoadingBlock label="Loading project..." />
  }

  // Galat id (400) ya na mila (404)
  if (error && (error.status === 404 || error.status === 400)) {
    return (
      <div>
        <Link
          to="/admin/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition hover:text-accent-700"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to projects
        </Link>
        <Card>
          <h1 className="text-lg font-semibold">Project not found</h1>
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

  // key={id} se alag project par fresh form milta hai
  return <ProjectFormView key={data.project.id} initial={toFormValues(data.project)} project={data.project} />
}