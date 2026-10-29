// Input, Textarea aur Select teeno ki same styling yahan se aati hai.
// Error ho toh border laal ho jata hai.

export function fieldClasses(hasError) {
  const base =
    'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-gray-400 transition focus:outline-none focus:ring-2'

  const state = hasError
    ? 'border-red-500 focus:ring-red-200'
    : 'border-line focus:border-accent-500 focus:ring-accent-100'

  return `${base} ${state}`
}