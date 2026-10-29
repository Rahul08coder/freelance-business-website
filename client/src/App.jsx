import { Routes, Route, Link } from 'react-router-dom'
import { siteConfig } from './config/site.js'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Portfolio from './pages/Portfolio.jsx'
import StartProject from './pages/StartProject.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import NotFound from './pages/NotFound.jsx'
import UiTest from './pages/UiTest.jsx'

function App() {
  return (
    <div>
      {/* Temporary nav: Day 5 mein real Navbar se replace hoga */}
      <nav className="flex flex-wrap items-center gap-4 border-b border-line p-4 text-sm">
        <Link to="/" className="font-semibold text-accent-600">
          {siteConfig.brandName}
        </Link>
        {siteConfig.navLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            {link.label}
          </Link>
        ))}
        <Link to={siteConfig.cta.path}>{siteConfig.cta.label}</Link>
        {siteConfig.footerLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            {link.label}
          </Link>
        ))}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/start-project" element={<StartProject />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Temporary: Day 11 mein hata denge */}
          <Route path="/ui-test" element={<UiTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App