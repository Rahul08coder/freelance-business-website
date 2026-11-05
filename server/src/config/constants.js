// Allowed values ek jagah. Frontend ke client/src/config/formOptions.js se same rakhna.
// Yahan ke "value" badle toh frontend mein bhi badalna padega.

export const BUDGET_VALUES = ['under-10k', '10k-25k', '25k-50k', '50k-100k', 'above-100k', 'not-sure']

export const DEADLINE_VALUES = ['asap', '2-weeks', '1-month', '1-3-months', 'flexible']

export const INQUIRY_STATUSES = [
  'new',
  'under-review',
  'contacted',
  'accepted',
  'in-progress',
  'completed',
  'rejected',
]

export const PROJECT_CATEGORIES = ['Full-stack', 'Frontend', 'Backend']

// Service ke icon. Ye client/src/config/icons.js ke serviceIconNames se bilkul same hone chahiye.
export const SERVICE_ICONS = [
  'Globe',
  'LayoutTemplate',
  'Code',
  'Layers',
  'Bug',
  'Smartphone',
  'Plug',
  'Database',
  'Palette',
  'Server',
  'Rocket',
  'Wrench',
  'Search',
]

// Frontend ki inquiryValidation.js wali limits. Day 17 mein validation bhi yahin se padhti hai.
export const INQUIRY_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  company: { max: 100 },
  projectType: { max: 60 },
  description: { min: 20, max: 2000 },
  referenceUrl: { max: 300 },
  notes: { max: 1000 },
}