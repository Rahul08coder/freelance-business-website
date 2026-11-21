import { Outlet } from 'react-router-dom'
import { SettingsProvider } from '../context/SettingsProvider.jsx'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import ScrollToTop from '../components/layout/ScrollToTop.jsx'

// Har public page ka frame: upar Navbar, beech mein page, neeche Footer.
// <Outlet /> mein current route ka page aa jata hai.
// SettingsProvider contact settings (email, links) ek baar laata hai, aur Footer, Contact, etc. use karte hain.
function MainLayout() {
  return (
    <SettingsProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollToTop />

        {/* Keyboard users ke liye: Tab dabate hi yeh dikhta hai */}
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-accent-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </SettingsProvider>
  )
}

export default MainLayout