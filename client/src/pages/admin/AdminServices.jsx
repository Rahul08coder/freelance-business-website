import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { getIcon } from '../../config/icons.js'
import {
  ADMIN_SERVICES_PATH,
  deleteService,
  setServiceEnabled,
} from '../../services/adminServiceApi.js'
import { formatDateTime } from '../../utils/formatDate.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ToggleSwitch from '../../components/admin/ToggleSwitch.jsx'

// Data aa jane ke baad ki list. Toggle aur delete ke baad list yahin update hoti hai (dobara fetch nahi).
function ServicesList({ initial }) {
  const [services, setServices] = useState(initial)
  const [busyId, setBusyId] = useState('')
  const [rowError, setRowError] = useState('')

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleToggle(service) {
    if (busyId) return

    setBusyId(service.id)
    setRowError('')

    try {
      const data = await setServiceEnabled(service.id, !service.enabled)
      setServices((previous) =>
        previous.map((item) =>
          item.id === service.id ? { ...item, enabled: data.service.enabled } : item
        )
      )
    } catch (error) {
      setRowError(`Could not update "${service.title}": ${error.message}`)
    } finally {
      setBusyId('')
    }
  }

  async function handleDelete() {
    if (!pendingDelete || deleting) return

    setDeleting(true)
    setDeleteError('')

    try {
      await deleteService(pendingDelete.id)
      setServices((previous) => previous.filter((item) => item.id !== pendingDelete.id))
      setPendingDelete(null)
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  function closeDialog() {
    setPendingDelete(null)
    setDeleteError('')
  }

  if (services.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No services yet. Add your first one.</p>
      </Card>
    )
  }

  return (
    <>
      {rowError && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {rowError}
        </p>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th scope="col" className="px-5 py-3 font-medium">
                  Service
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Shown on website
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Order
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Updated
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const Icon = getIcon(service.icon)
                return (
                  <tr key={service.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-medium">{service.title}</p>
                          <p className="font-mono text-xs text-muted">{service.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <ToggleSwitch
                        checked={service.enabled}
                        busy={busyId === service.id}
                        label={`Show on the website: ${service.title}`}
                        onChange={() => handleToggle(service)}
                      />
                    </td>
                    <td className="px-3 py-3">{service.order}</td>
                    <td className="px-3 py-3 text-muted">{formatDateTime(service.updatedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/services/${service.id}/edit`}
                          className="font-medium text-accent-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(service)}
                          className="font-medium text-red-700 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this service?"
        confirmLabel="Delete service"
        onConfirm={handleDelete}
        onCancel={closeDialog}
        loading={deleting}
        error={deleteError}
      >
        <p>
          You are about to delete <strong>{pendingDelete?.title}</strong>. It will disappear from
          your website and from the Start a Project form. Old inquiries are not affected. This
          cannot be undone. To hide it for a while instead, use the switch.
        </p>
      </ConfirmDialog>
    </>
  )
}

function AdminServices() {
  usePageTitle('Services')

  const location = useLocation()
  const navigate = useNavigate()

  // Form se "saved" ka message aata hai (ek baar dikhta hai)
  const [flash] = useState(location.state?.flash ?? '')

  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const { data, loading, error, retry } = useFetch(ADMIN_SERVICES_PATH)

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted">
            The services you offer. Only services that are switched on show on your website and in
            the Start a Project form.
          </p>
        </div>
        <Button to="/admin/services/new">
          <Plus size={16} aria-hidden="true" />
          New service
        </Button>
      </div>

      {flash && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          {flash}
        </p>
      )}

      <div className="mt-6">
        {loading && <LoadingBlock label="Loading services..." />}
        {error && <ErrorBlock message={error.message} onRetry={retry} />}
        {data && <ServicesList initial={data.services} />}
      </div>
    </div>
  )
}

export default AdminServices