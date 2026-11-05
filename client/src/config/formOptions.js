// Form ke dropdown options yahan hain.
// Day 17 se backend (server/src/config/constants.js) bhi inhi values ko validate karta hai,
// isliye budget aur deadline ki values (value) mat badalna, sirf label badal sakte ho.

// Project types ab database ki services se aate hain (GET /api/services).
// "Other" hamesha aakhir mein alag se jodte hain.
export const OTHER_PROJECT_TYPE = { value: 'other', label: 'Something else / not sure yet' }

export function buildProjectTypeOptions(services) {
  return [
    ...services.map((service) => ({ value: service.id, label: service.title })),
    OTHER_PROJECT_TYPE,
  ]
}

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