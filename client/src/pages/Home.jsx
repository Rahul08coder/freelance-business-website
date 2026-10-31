import { usePageTitle } from '../hooks/usePageTitle.js'
import Hero from '../components/home/Hero.jsx'
import ServicesOverview from '../components/home/ServicesOverview.jsx'
import FeaturedProjects from '../components/home/FeaturedProjects.jsx'
import ProcessSection from '../components/home/ProcessSection.jsx'
import SkillsSection from '../components/home/SkillsSection.jsx'
import FAQSection from '../components/home/FAQSection.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'

function Home() {
  usePageTitle()

  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedProjects />
      <ProcessSection />
      <SkillsSection />
      <FAQSection />
      <CtaBanner />
    </>
  )
}

export default Home