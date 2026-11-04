import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import LoadingBlock from '../ui/LoadingBlock.jsx'

// Login ke bina admin pages nahi khulte. Ye sirf suvidha hai (redirect).
// Asli suraksha server ki requireAdmin hai: bina login ke API data deti hi nahi.
function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <LoadingBlock label="Checking your session..." />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute