import { Code, ExternalLink } from 'lucide-react'
import { projects } from '../../config/content.js'
import Section from '../ui/Section.jsx'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'

const linkClass =
  'inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 transition hover:text-accent-700'

function FeaturedProjects() {
  const featured = projects.filter((project) => project.featured).slice(0, 3)

  return (
    <Section
      title="Featured projects"
      subtitle="A few things I have built while learning and practising full-stack development."
    >
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => {
          const hasLinks = project.githubUrl || project.liveUrl

          return (
            <li key={project.slug}>
              <Card hover className="flex h-full flex-col">
                <h3 className="text-lg font-semibold">{project.title}</h3>
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
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      <Code size={16} aria-hidden="true" />
                      View code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      Live demo
                    </a>
                  )}
                  {!hasLinks && <span className="text-sm text-muted">Links coming soon</span>}
                </div>
              </Card>
            </li>
          )
        })}
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