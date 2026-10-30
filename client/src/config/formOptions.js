// Form ke dropdown options yahan hain.
// Day 17 mein backend bhi inhi values ko validate karega, isliye values (value) mat badalna,
// sirf label badal sakte ho.

import { services } from './site.js'

// Project types services se apne aap bante hain (sirf enabled wali)
export const projectTypeOptions = [
  ...services
    .filter((service) => service.enabled)
    .map((service) => ({ value: service.id, label: service.title })),
  { value: 'other', label: 'Something else / not sure yet' },
]

export const budgetOptions = [
  { value: 'under-10k', label: 'Under ₹10,000' },
  { value: '10k-25k', label: '₹10,000 to ₹25,000' },
  { value: '25k-50k', label: '₹25,000 to ₹50,000' },
  { value: '50k-100k', label: '₹50,000 to ₹1,00,000' },
  { value: 'above-100k', label: 'Above ₹1,00,000' },
  { value: 'not-sure', label: 'Not sure yet' },
]

export const deadlineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '2-weeks', label: 'Within 2 weeks' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1 to 3 months' },
  { value: 'flexible', label: 'Flexible / not sure yet' },
]