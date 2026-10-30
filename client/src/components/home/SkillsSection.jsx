import { skillGroups } from '../../config/content.js'
import Section from '../ui/Section.jsx'

function SkillsSection() {
  return (
    <Section
      title="Skills and technologies"
      subtitle="The tools I use to build websites and web applications."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-base font-semibold">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default SkillsSection