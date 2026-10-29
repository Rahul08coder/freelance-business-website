import { useId } from 'react'
import FormField from './FormField.jsx'
import { fieldClasses } from './formStyles.js'

// options ka format: [{ value: 'landing-page', label: 'Landing page' }, ...]
function Select({
  label,
  error,
  hint,
  required = false,
  id,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...rest
}) {
  const autoId = useId()
  const fieldId = id || autoId
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined

  return (
    <FormField id={fieldId} label={label} error={error} hint={hint} required={required}>
      <select
        id={fieldId}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`${fieldClasses(Boolean(error))} ${className}`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}

export default Select