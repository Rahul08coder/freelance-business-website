import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { inquiryStatuses } from '../../config/inquiryStatuses.js'
import { budgetOptions } from '../../config/formOptions.js'
import { inquiriesPath } from '../../services/adminInquiryService.js'
import { formatDateTime } from '../../utils/formatDate.js'
import { labelFor, prettySlug } from '../../utils/text.js'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import Pagination from '../../components/admin/Pagination.jsx'

const PAGE_SIZE = 10

const statusOptions = inquiryStatuses.map((status) => ({ value: status.value, label: status.label }))

function AdminInquiries() {
  usePageTitle('Inquiries')

  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  // Filters URL mein rehte hain (reload ya Back par bhi bane rahte hain)
  const rawStatus = searchParams.get('status') || ''
  const status = inquiryStatuses.some((item) => item.value === rawStatus) ? rawStatus : ''
  const urlSearch = searchParams.get('search') || ''
  const rawPage = Number(searchParams.get('page'))
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1

  // Search box ka text. User ruk jaye (0.4 second) tab hi URL (aur server request) badalti hai.
  const [searchText, setSearchText] = useState(urlSearch)
  const debouncedSearch = useDebouncedValue(searchText.trim(), 400)

  useEffect(() => {
    setSearchParams(
      (previous) => {
        if ((previous.get('search') || '') === debouncedSearch) return previous

        const next = new URLSearchParams(previous)
        if (debouncedSearch) next.set('search', debouncedSearch)
        else next.delete('search')
        next.delete('page') // naya search toh pehle page se
        return next
      },
      { replace: true }
    )
  }, [debouncedSearch, setSearchParams])

  const { data, loading, error, retry } = useFetch(
    inquiriesPath({ search: urlSearch, status, page, limit: PAGE_SIZE })
  )

  function changeStatus(event) {
    const value = event.target.value
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set('status', value)
      else next.delete('status')
      next.delete('page')
      return next
    })
  }

  function changePage(newPage) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (newPage > 1) next.set('page', String(newPage))
      else next.delete('page')
      return next
    })
  }

  function clearFilters() {
    setSearchText('')
    setSearchParams({})
  }

  const hasFilters = Boolean(urlSearch || status)
  const total = data?.pagination.total ?? 0
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
      <p className="mt-1 text-sm text-muted">Project requests sent from your website.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-80">
          <Input
            label="Search"
            name="search"
            type="search"
            maxLength={100}
            placeholder="Name, email, company or reference"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <Select
            label="Status"
            name="status"
            placeholder="All statuses"
            options={statusOptions}
            value={status}
            onChange={changeStatus}
          />
        </div>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="mt-6">
        {loading && <LoadingBlock label="Loading inquiries..." />}
        {error && <ErrorBlock message={error.message} onRetry={retry} />}

        {data && data.inquiries.length === 0 && (
          <Card>
            {page > 1 ? (
              <>
                <p className="text-sm text-muted">There is nothing on this page.</p>
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => changePage(1)}>
                    Go to the first page
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">
                {hasFilters ? 'No inquiries match your filters.' : 'No inquiries yet.'}
              </p>
            )}
          </Card>
        )}

        {data && data.inquiries.length > 0 && (
          <>
            <p className="mb-3 text-sm text-muted" role="status">
              Showing {from} to {to} of {total}
            </p>

            <Card className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th scope="col" className="px-5 py-3 font-medium">
                        Reference
                      </th>
                      <th scope="col" className="px-3 py-3 font-medium">
                        Client
                      </th>
                      <th scope="col" className="px-3 py-3 font-medium">
                        Project type
                      </th>
                      <th scope="col" className="px-3 py-3 font-medium">
                        Budget
                      </th>
                      <th scope="col" className="px-3 py-3 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Received
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.inquiries.map((item) => (
                      <tr key={item.id} className="border-b border-line last:border-0">
                        <td className="px-5 py-3">
                          <Link
                            to={`/admin/inquiries/${item.id}`}
                            state={{ listSearch: location.search }}
                            className="font-mono text-xs text-accent-600 hover:underline"
                          >
                            {item.inquiryId}
                          </Link>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="break-all text-xs text-muted">{item.email}</p>
                        </td>
                        <td className="px-3 py-3">{prettySlug(item.projectType)}</td>
                        <td className="px-3 py-3">{labelFor(budgetOptions, item.budget)}</td>
                        <td className="px-3 py-3">
                          <StatusBadge value={item.status} />
                        </td>
                        <td className="px-5 py-3 text-muted">{formatDateTime(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Pagination
              page={page}
              totalPages={data.pagination.totalPages}
              onChange={changePage}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AdminInquiries