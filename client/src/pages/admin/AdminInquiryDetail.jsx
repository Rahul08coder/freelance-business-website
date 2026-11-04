import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { inquiryStatuses } from '../../config/inquiryStatuses.js'
import { budgetOptions, deadlineOptions } from '../../config/formOptions.js'
import {
  deleteInquiry,
  inquiryPath,
  updateInquiryStatus,
} from '../../services/adminInquiryService.js'
import { formatDateTime } from '../../utils/formatDate.js'
import { isHttpUrl, labelFor, prettySlug } from '../../utils/text.js'
import Card from '../../components/ui/Card.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'

const statusOptions = inquiryStatuses.map((status) => ({ value: status.value, label: status.label }))

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm">{children}</dd>
    </div>
  )
}

function BackLink({ to }) {
  return (
    <Link
      to={to}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition hover:text-accent-700"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back to inquiries
    </Link>
  )
}

// Data aa jane ke baad ka poora detail. key={inquiry.id} se alag inquiry par fresh state milti hai.
function DetailView({ initial, backTo }) {
  const navigate = useNavigate()

  const [inquiry, setInquiry] = useState(initial)
  const [selectedStatus, setSelectedStatus] = useState(initial.status)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleSaveStatus() {
    if (saving || selectedStatus === inquiry.status) return

    setSaving(true)
    setSaveMessage('')
    setSaveError('')

    try {
      const data = await updateInquiryStatus(inquiry.id, selectedStatus)
      setInquiry(data.inquiry)
      setSelectedStatus(data.inquiry.status)
      setSaveMessage('Status updated.')
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (deleting) return

    setDeleting(true)
    setDeleteError('')

    try {
      await deleteInquiry(inquiry.id)
      navigate(backTo, { replace: true })
    } catch (error) {
      setDeleteError(error.message)
      setDeleting(false)
    }
  }

  function closeDialog() {
    setConfirmOpen(false)
    setDeleteError('')
  }

  return (
    <div>
      <BackLink to={backTo} />

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{inquiry.name}</h1>
        <StatusBadge value={inquiry.status} />
      </div>
      <p className="mt-1 font-mono text-xs text-muted">{inquiry.inquiryId}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="text-base font-semibold">Client</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name">{inquiry.name}</Field>
              <Field label="Email">
                <a href={`mailto:${inquiry.email}`} className="text-accent-600 hover:underline">
                  {inquiry.email}
                </a>
              </Field>
              <Field label="Company">{inquiry.company || 'Not given'}</Field>
              <Field label="Reference website">
                {inquiry.referenceUrl ? (
                  isHttpUrl(inquiry.referenceUrl) ? (
                    <a
                      href={inquiry.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 hover:underline"
                    >
                      {inquiry.referenceUrl}
                    </a>
                  ) : (
                    inquiry.referenceUrl
                  )
                ) : (
                  'Not given'
                )}
              </Field>
            </dl>
          </Card>

          <Card>
            <h2 className="text-base font-semibold">Project</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="Project type">{prettySlug(inquiry.projectType)}</Field>
              <Field label="Budget">{labelFor(budgetOptions, inquiry.budget)}</Field>
              <Field label="Deadline">{labelFor(deadlineOptions, inquiry.deadline)}</Field>
            </dl>

            <h3 className="mt-6 text-sm text-muted">Description</h3>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{inquiry.description}</p>

            <h3 className="mt-6 text-sm text-muted">Additional notes</h3>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">
              {inquiry.notes || 'None'}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold">Status</h2>

            <div className="mt-4">
              <Select
                label="Change status"
                name="status"
                options={statusOptions}
                placeholder="Choose a status"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
              />
            </div>

            <div className="mt-4">
              <Button
                onClick={handleSaveStatus}
                loading={saving}
                disabled={selectedStatus === inquiry.status}
              >
                {saving ? 'Saving...' : 'Save status'}
              </Button>
            </div>

            {saveMessage && (
              <p role="status" className="mt-3 text-sm text-green-700">
                {saveMessage}
              </p>
            )}
            {saveError && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {saveError}
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-base font-semibold">Dates</h2>
            <dl className="mt-4 space-y-3">
              <Field label="Received">{formatDateTime(inquiry.createdAt)}</Field>
              <Field label="Last updated">{formatDateTime(inquiry.updatedAt)}</Field>
            </dl>
          </Card>

          <Card>
            <h2 className="text-base font-semibold">Delete</h2>
            <p className="mt-2 text-sm text-muted">
              This removes the inquiry for good. It cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete inquiry
            </button>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this inquiry?"
        confirmLabel="Delete inquiry"
        onConfirm={handleDelete}
        onCancel={closeDialog}
        loading={deleting}
        error={deleteError}
      >
        <p>
          You are about to delete <strong>{inquiry.inquiryId}</strong> from{' '}
          <strong>{inquiry.name}</strong>. This cannot be undone.
        </p>
      </ConfirmDialog>
    </div>
  )
}

function AdminInquiryDetail() {
  const { id } = useParams()
  const location = useLocation()

  // List se aate waqt uske filters yaad rakhe the, "Back" par wahi filters wapas
  const savedSearch = location.state?.listSearch
  const backTo = `/admin/inquiries${typeof savedSearch === 'string' && savedSearch.startsWith('?') ? savedSearch : ''}`

  const { data, loading, error, retry } = useFetch(inquiryPath(id))

  usePageTitle(data ? data.inquiry.inquiryId : 'Inquiry')

  if (loading) {
    return <LoadingBlock label="Loading inquiry..." />
  }

  // Galat id (400) ya na mila (404)
  if (error && (error.status === 404 || error.status === 400)) {
    return (
      <div>
        <BackLink to={backTo} />
        <Card>
          <h1 className="text-lg font-semibold">Inquiry not found</h1>
          <p className="mt-2 text-sm text-muted">
            It may have been deleted, or the link is not correct.
          </p>
        </Card>
      </div>
    )
  }

  if (error) {
    return <ErrorBlock message={error.message} onRetry={retry} />
  }

  return <DetailView key={data.inquiry.id} initial={data.inquiry} backTo={backTo} />
}

export default AdminInquiryDetail