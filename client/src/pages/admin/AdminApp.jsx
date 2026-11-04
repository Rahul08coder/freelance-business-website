import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthProvider.jsx'
import ProtectedRoute from '../../components/admin/ProtectedRoute.jsx'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminInquiries from './AdminInquiries.jsx'
import AdminInquiryDetail from './AdminInquiryDetail.jsx'

// Poora admin hissa yahan hai. App.jsx ise "lazy" (zaroorat padne par) load karta hai,
// isliye public visitors ko admin ka code download hi nahi hota.
// Paths yahan /admin ke andar ke relative hain: "login" ka matlab /admin/login.
function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="inquiries/:id" element={<AdminInquiryDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default AdminApp