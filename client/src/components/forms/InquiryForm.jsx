import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { budgetOptions, deadlineOptions, projectTypeOptions } from '../../config/formOptions.js'
import {
  LIMITS,
  buildPayload,
  initialValues,
  validateAll,
  validateField,
} from '../../utils/inquiryValidation.js'
import { submitInquiry } from '../../services/inquiryService.js'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import InquirySuccess from './InquirySuccess.jsx'

function InquiryForm() {
  // /start-project?service=mern-fullstack ho toh project type pehle se select ho jata hai
  const [searchParams] = useSearchParams()
  const presetService = searchParams.get('service')

  const [values, setValues] = useState(() => ({
    ...initialValues,
    projectType: projectTypeOptions.some((option) => option.value === presetService)
      ? presetService
      : '',
  }))
  const [errors, setErrors] = useState({})
  // status: 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState(null)
  const formRef = useRef(null)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))

    // Agar is field mein pehle se error dikh raha tha, toh type karte hi dobara check karo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  // Field se bahar nikalte hi check karo (par khaali untouched field par error mat dikhao)
  function handleBlur(event) {
    const { name, value } = event.target
    if (value.trim() === '' && !errors[name]) return
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Duplicate-submission rokna: pehla request chal raha ho toh dobara mat bhejo
    if (status === 'submitting') return

    setSubmitError('')

    const validationErrors = validateAll(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      // Pehle galat field par focus bhejo (keyboard aur screen reader users ke liye)
      setTimeout(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
      }, 0)
      return
    }

    // Honeypot bhara hua hai toh bot hai: chupchap success dikha do, kuch bhejo mat
    if (values.botField) {
      setResult({ inquiryId: null, demo: false })
      setStatus('success')
      return
    }

    setStatus('submitting')

    try {
      const data = await submitInquiry(buildPayload(values))
      setResult(data)
      setStatus('success')
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  function handleReset() {
    setValues(initialValues)
    setErrors({})
    setSubmitError('')
    setResult(null)
    setStatus('idle')
  }

  if (status === 'success') {
    return <InquirySuccess result={result} onReset={handleReset} />
  }

  const isSubmitting = status === 'submitting'
  const descriptionLength = values.description.trim().length

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Your name"
          name="name"
          required
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Company or business name"
          name="company"
          autoComplete="organization"
          hint="Optional"
          value={values.company}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.company}
        />
        <Select
          label="Project type"
          name="projectType"
          required
          placeholder="Choose a project type"
          options={projectTypeOptions}
          value={values.projectType}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.projectType}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Budget range"
          name="budget"
          required
          placeholder="Choose a budget range"
          options={budgetOptions}
          value={values.budget}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.budget}
        />
        <Select
          label="Desired deadline"
          name="deadline"
          required
          placeholder="Choose a timeframe"
          options={deadlineOptions}
          value={values.deadline}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.deadline}
        />
      </div>

      <Textarea
        label="Project description"
        name="description"
        required
        rows={6}
        maxLength={LIMITS.description.max}
        placeholder="What do you want to build? Who is it for? Any must-have features?"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        hint={`${descriptionLength}/${LIMITS.description.max} characters (minimum ${LIMITS.description.min})`}
      />

      <Input
        label="Reference website"
        name="referenceUrl"
        type="text"
        inputMode="url"
        autoComplete="off"
        placeholder="https://example.com"
        hint="Optional. A website you like or your current website."
        value={values.referenceUrl}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.referenceUrl}
      />

      <Textarea
        label="Additional notes"
        name="notes"
        rows={3}
        maxLength={LIMITS.notes.max}
        hint="Optional. Anything else I should know."
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.notes}
      />

      {/* Honeypot: insaan ko dikhta nahi. Bots ise bhar dete hain. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="botField">Leave this field empty</label>
        <input
          id="botField"
          name="botField"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.botField}
          onChange={handleChange}
        />
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send project request'}
        </Button>
        <p className="text-xs text-muted">
          Your details are used only to reply to your request. Read the{' '}
          <Link to="/privacy-policy" className="underline hover:text-accent-600">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

export default InquiryForm