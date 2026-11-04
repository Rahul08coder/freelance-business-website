import { getStatus } from '../../config/inquiryStatuses.js'

function StatusBadge({ value }) {
  const status = getStatus(value)

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.badge}`}>
      {status.label}
    </span>
  )
}

export default StatusBadge