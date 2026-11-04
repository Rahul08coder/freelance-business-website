import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { inquiryStatuses } from '../../config/inquiryStatuses.js'
import { formatDateTime } from '../../utils/formatDate.js'
import Card from '../../components/ui/Card.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'

function StatCard({ label, value, hint }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  )
}

// "business-website" ko "Business website" jaisa dikhata hai
function prettySlug(slug) {
  const text = String(slug).replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function AdminDashboard() {
  usePageTitle('Dashboard')

  const { data, loading, error, retry } = useFetch('/admin/dashboard')

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">A quick look at your website.</p>

      <div className="mt-6">
        {loading && <LoadingBlock label="Loading dashboard..." />}
        {error && <ErrorBlock message={error.message} onRetry={retry} />}

        {data && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard label="Total inquiries" value={data.inquiries.total} />
              <StatCard label="New, not yet reviewed" value={data.inquiries.byStatus.new} />
              <StatCard label="Last 7 days" value={data.inquiries.last7Days} />
              <StatCard
                label="Projects"
                value={data.projects.total}
                hint={`${data.projects.featured} featured`}
              />
              <StatCard
                label="Services"
                value={data.services.total}
                hint={`${data.services.enabled} shown on the website`}
              />
            </div>

            <Card>
              <h2 className="text-base font-semibold">Inquiries by status</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {inquiryStatuses.map((status) => (
                  <li key={status.value} className="flex items-center justify-between gap-3">
                    <StatusBadge value={status.value} />
                    <span className="text-sm font-semibold">
                      {data.inquiries.byStatus[status.value] ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-base font-semibold">Latest inquiries</h2>

              {data.inquiries.recent.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No inquiries yet.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[34rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-muted">
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Reference
                        </th>
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Name
                        </th>
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Project type
                        </th>
                        <th scope="col" className="py-2 pr-4 font-medium">
                          Status
                        </th>
                        <th scope="col" className="py-2 font-medium">
                          Received
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.inquiries.recent.map((item) => (
                        <tr key={item.inquiryId} className="border-b border-line last:border-0">
                          <td className="py-3 pr-4 font-mono text-xs">{item.inquiryId}</td>
                          <td className="py-3 pr-4">{item.name}</td>
                          <td className="py-3 pr-4">{prettySlug(item.projectType)}</td>
                          <td className="py-3 pr-4">
                            <StatusBadge value={item.status} />
                          </td>
                          <td className="py-3 text-muted">{formatDateTime(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard