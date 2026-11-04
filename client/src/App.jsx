import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Portfolio from './pages/Portfolio.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import StartProject from './pages/StartProject.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import NotFound from './pages/NotFound.jsx'
import LoadingBlock from './components/ui/LoadingBlock.jsx'

// Admin ka code alag "chunk" mein hai. Tab hi download hota hai jab koi /admin kholta hai.
const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'))

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<ProjectDetail />} />
        <Route path="/start-project" element={<StartProject />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin: public Navbar/Footer ke bina */}
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="mx-auto max-w-6xl px-4 py-10">
                <LoadingBlock label="Loading..." />
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default App