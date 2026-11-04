// Inquiry ke 7 status. value backend ke INQUIRY_STATUSES se same hona zaroori hai.
// Colors (badge) poori class ke roop mein likhe hain, taaki Tailwind unhe pehchan sake.

export const inquiryStatuses = [
  { value: 'new', label: 'New', badge: 'bg-blue-50 text-blue-700' },
  { value: 'under-review', label: 'Under Review', badge: 'bg-amber-50 text-amber-700' },
  { value: 'contacted', label: 'Contacted', badge: 'bg-indigo-50 text-indigo-700' },
  { value: 'accepted', label: 'Accepted', badge: 'bg-green-50 text-green-700' },
  { value: 'in-progress', label: 'In Progress', badge: 'bg-cyan-50 text-cyan-700' },
  { value: 'completed', label: 'Completed', badge: 'bg-emerald-50 text-emerald-800' },
  { value: 'rejected', label: 'Rejected', badge: 'bg-red-50 text-red-700' },
]

export function getStatus(value) {
  return (
    inquiryStatuses.find((status) => status.value === value) || {
      value,
      label: value,
      badge: 'bg-gray-100 text-gray-700',
    }
  )
}