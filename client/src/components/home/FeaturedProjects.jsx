import { projects } from '../../config/content.js'
import Section from '../ui/Section.jsx'
import Button from '../ui/Button.jsx'
import ProjectCard from '../projects/ProjectCard.jsx'

function FeaturedProjects() {
  const featured = projects.filter((project) => project.featured).slice(0, 3)

  return (
    <Section
      title="Featured projects"
      subtitle="A few things I have built while learning and practising full-stack development."
    >
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Button to="/portfolio" variant="outline">
          View all projects
        </Button>
      </div>
    </Section>
  )
}

export default FeaturedProjects