import { useEffect, useState } from 'react'

// Value tab badalti hai jab user thodi der (delayMs) ruk jaye.
// Search mein har akshar par server ko request na jaye, isliye.
export function useDebouncedValue(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}