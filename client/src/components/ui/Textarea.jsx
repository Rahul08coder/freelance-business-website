import { useId } from 'react'
import FormField from './FormField.jsx'
import { fieldClasses } from './formStyles.js'

function Textarea({ label, error, hint, required = false, id, rows = 5, className = '', ...rest }) {
  const autoId = useId()
  const fieldId = id || autoId
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined

  return (
    <FormField id={fieldId} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={fieldId}
        rows={rows}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`${fieldClasses(Boolean(error))} ${className}`}
        {...rest}
      />
    </FormField>
  )
}

export default Textarea