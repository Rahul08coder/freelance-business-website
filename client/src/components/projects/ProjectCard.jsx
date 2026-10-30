import { Link } from 'react-router-dom'
import { Code, ExternalLink } from 'lucide-react'
import Card from '../ui/Card.jsx'

const linkClass =
  'inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 transition hover:text-accent-700'

// headingAs: Home par 'h3' (section ke h2 ke neeche), Portfolio par 'h2'.
// Isse heading ka order sahi rehta hai (accessibility).
function ProjectCard({ project, headingAs = 'h3' }) {
  const Heading = headingAs
  const hasExternalLinks = project.githubUrl || project.liveUrl

  return (
    <Card hover className="flex h-full flex-col">
      <Heading className="text-lg font-semibold">
        <Link to={`/portfolio/${project.slug}`} className="transition hover:text-accent-600">
          {project.title}
        </Link>
      </Heading>
      <p className="mt-2 text-sm text-muted">{project.description}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
        {project.tech.map((item) => (
          <li
            key={item}
            className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
        <Link to={`/portfolio/${project.slug}`} className={linkClass}>
          View details
        </Link>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Code size={16} aria-hidden="true" />
            View code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <ExternalLink size={16} aria-hidden="true" />
            Live demo
          </a>
        )}
        {!hasExternalLinks && <span className="text-sm text-muted">Links coming soon</span>}
      </div>
    </Card>
  )
}

export default ProjectCard