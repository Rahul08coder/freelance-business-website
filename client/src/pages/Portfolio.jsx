import { useState } from 'react'
import { useFetch } from '../hooks/useFetch.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import Section from '../components/ui/Section.jsx'
import LoadingBlock from '../components/ui/LoadingBlock.jsx'
import ErrorBlock from '../components/ui/ErrorBlock.jsx'
import ProjectCard from '../components/projects/ProjectCard.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'

function Portfolio() {
  usePageTitle('Portfolio')

  const { data, loading, error, retry } = useFetch('/projects')
  const [activeCategory, setActiveCategory] = useState('All')

  const projects = data ? data.projects : []

  // Categories projects se apne aap bante hain: ['All', 'Full-stack', 'Frontend']
  const categories = ['All', ...new Set(projects.map((project) => project.category))]

  const visibleProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle="Projects I have built while learning and practising web development."
      />

      <Section>
        {loading && <LoadingBlock label="Loading projects..." />}
        {error && <ErrorBlock message={error.message} onRetry={retry} />}

        {data && (
          <>
            <div
              role="group"
              aria-label="Filter projects by category"
              className="mb-8 flex flex-wrap gap-2"
            >
              {categories.map((category) => {
                const isActive = category === activeCategory
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? 'border-accent-600 bg-accent-600 text-white'
                        : 'border-line bg-white text-ink hover:bg-surface'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            {visibleProjects.length > 0 ? (
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project) => (
                  <li key={project.slug}>
                    <ProjectCard project={project} headingAs="h2" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No projects in this category yet.</p>
            )}

            <p className="mt-10 text-sm text-muted">
              More projects will be added here as I build them.
            </p>
          </>
        )}
      </Section>

      <CtaBanner />
    </>
  )
}

export default Portfolio