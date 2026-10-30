import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import Button from '../ui/Button.jsx'

// Success ke baad confirmation. Heading par focus jata hai, taaki screen reader user ko pata chale.
function InquirySuccess({ result, onReset }) {
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600">
        <Check size={24} aria-hidden="true" />
      </span>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-5 text-2xl font-semibold tracking-tight focus:outline-none"
      >
        Thank you, your request has been sent
      </h2>
      <p className="mt-3 text-muted">
        I will read your project details and reply to you by email.
      </p>

      {result?.inquiryId && (
        <p className="mt-4 text-sm">
          Your reference ID: <span className="font-semibold">{result.inquiryId}</span>
        </p>
      )}

      {result?.demo && (
        <p
          role="note"
          className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        >
          Demo mode: this request was not saved. Saving starts once the backend is connected.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button to="/">Back to home</Button>
        <Button variant="outline" onClick={onReset}>
          Send another request
        </Button>
      </div>
    </div>
  )
}

export default InquirySuccess