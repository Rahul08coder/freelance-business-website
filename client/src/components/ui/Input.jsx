import { useId } from 'react'
import FormField from './FormField.jsx'
import { fieldClasses } from './formStyles.js'

function Input({ label, error, hint, required = false, id, className = '', ...rest }) {
  const autoId = useId()
  const inputId = id || autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <FormField id={inputId} label={label} error={error} hint={hint} required={required}>
      <input
        id={inputId}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`${fieldClasses(Boolean(error))} ${className}`}
        {...rest}
      />
    </FormField>
  )
}

export default Input