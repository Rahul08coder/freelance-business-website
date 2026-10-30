import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Code, ExternalLink } from 'lucide-react'
import { projects } from '../config/content.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import Card from '../components/ui/Card.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'
import NotFound from './NotFound.jsx'

const linkClass =
  'inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition hover:text-accent-700'

function ProjectDetail() {
  // URL /portfolio/taskflow ho toh slug = 'taskflow'
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  usePageTitle(project ? project.title : 'Project not found')

  // Galat slug par 404 page dikhao
  if (!project) {
    return <NotFound />
  }

  const hasExternalLinks = project.githubUrl || project.liveUrl

  return (
    <>
      <PageHeader title={project.title} subtitle={project.description} />

      <Section>
        <Link
          to="/portfolio"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition hover:text-accent-700"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to portfolio
        </Link>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 text-muted">{project.overview}</p>

            <h2 className="mt-8 text-xl font-semibold">Key features</h2>
            <ul className="mt-3 space-y-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <Check size={12} aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <Card>
              <h2 className="text-base font-semibold">Project details</h2>

              <p className="mt-4 text-sm font-medium">Category</p>
              <p className="mt-1 text-sm text-muted">{project.category}</p>

              <p className="mt-4 text-sm font-medium">Technologies</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm font-medium">Links</p>
              <div className="mt-2 flex flex-col gap-2">
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
          </aside>
        </div>
      </Section>

      <CtaBanner />
    </>
  )
}

export default ProjectDetail