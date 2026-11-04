import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import {
  ADMIN_PROJECTS_PATH,
  deleteProject,
  setProjectFeatured,
} from '../../services/adminProjectService.js'
import { formatDateTime } from '../../utils/formatDate.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingBlock from '../../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../../components/ui/ErrorBlock.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'

// Featured on/off ka switch
function FeaturedSwitch({ project, busy, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={project.featured}
      aria-label={`Featured on the home page: ${project.title}`}
      disabled={busy}
      onClick={() => onToggle(project)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
        project.featured ? 'bg-accent-600' : 'bg-gray-300'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          project.featured ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// Data aa jane ke baad ki list. Toggle aur delete ke baad list yahin update hoti hai (dobara fetch nahi).
function ProjectsList({ initial }) {
  const [projects, setProjects] = useState(initial)
  const [busyId, setBusyId] = useState('')
  const [rowError, setRowError] = useState('')

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleToggle(project) {
    if (busyId) return

    setBusyId(project.id)
    setRowError('')

    try {
      const data = await setProjectFeatured(project.id, !project.featured)
      setProjects((previous) =>
        previous.map((item) =>
          item.id === project.id ? { ...item, featured: data.project.featured } : item
        )
      )
    } catch (error) {
      setRowError(`Could not update "${project.title}": ${error.message}`)
    } finally {
      setBusyId('')
    }
  }

  async function handleDelete() {
    if (!pendingDelete || deleting) return

    setDeleting(true)
    setDeleteError('')

    try {
      await deleteProject(pendingDelete.id)
      setProjects((previous) => previous.filter((item) => item.id !== pendingDelete.id))
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

  if (projects.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No projects yet. Add your first one.</p>
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
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th scope="col" className="px-5 py-3 font-medium">
                  Project
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Featured
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
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="font-mono text-xs text-muted">/portfolio/{project.slug}</p>
                  </td>
                  <td className="px-3 py-3">{project.category}</td>
                  <td className="px-3 py-3">
                    <FeaturedSwitch
                      project={project}
                      busy={busyId === project.id}
                      onToggle={handleToggle}
                    />
                  </td>
                  <td className="px-3 py-3">{project.order}</td>
                  <td className="px-3 py-3 text-muted">{formatDateTime(project.updatedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/portfolio/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition hover:text-accent-600"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="font-medium text-accent-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(project)}
                        className="font-medium text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this project?"
        confirmLabel="Delete project"
        onConfirm={handleDelete}
        onCancel={closeDialog}
        loading={deleting}
        error={deleteError}
      >
        <p>
          You are about to delete <strong>{pendingDelete?.title}</strong>. It will disappear from
          your website. This cannot be undone.
        </p>
      </ConfirmDialog>
    </>
  )
}

function AdminProjects() {
  usePageTitle('Projects')

  const location = useLocation()
  const navigate = useNavigate()

  // Form se "saved" ka message aata hai (ek baar dikhta hai)
  const [flash] = useState(location.state?.flash ?? '')

  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const { data, loading, error, retry } = useFetch(ADMIN_PROJECTS_PATH)

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            The projects shown on your website. Switch Featured on to show a project on the home
            page.
          </p>
        </div>
        <Button to="/admin/projects/new">
          <Plus size={16} aria-hidden="true" />
          New project
        </Button>
      </div>

      {flash && (
        <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {flash}
        </p>
      )}

      <div className="mt-6">
        {loading && <LoadingBlock label="Loading projects..." />}
        {error && <ErrorBlock message={error.message} onRetry={retry} />}
        {data && <ProjectsList initial={data.projects} />}
      </div>
    </div>
  )
}

export default AdminProjects