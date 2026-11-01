import { useFetch } from '../../hooks/useFetch.js'
import Section from '../ui/Section.jsx'
import Button from '../ui/Button.jsx'
import LoadingBlock from '../ui/LoadingBlock.jsx'
import ErrorBlock from '../ui/ErrorBlock.jsx'
import ProjectCard from '../projects/ProjectCard.jsx'

function FeaturedProjects() {
  const { data, loading, error, retry } = useFetch('/projects?featured=true')
  const featured = data ? data.projects.slice(0, 3) : []

  return (
    <Section
      title="Featured projects"
      subtitle="A few things I have built while learning and practising full-stack development."
    >
      {loading && <LoadingBlock label="Loading projects..." />}
      {error && <ErrorBlock message={error.message} onRetry={retry} />}

      {data && featured.length === 0 && (
        <p className="text-muted">Projects will be added here soon.</p>
      )}

      {featured.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <Button to="/portfolio" variant="outline">
          View all projects
        </Button>
      </div>
    </Section>
  )
}

export default FeaturedProjects