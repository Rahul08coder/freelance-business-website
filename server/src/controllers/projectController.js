import Project from '../models/Project.js'
import { HttpError } from '../utils/HttpError.js'
import { slugPattern } from '../utils/validators.js'

// Public response mein har field hum khud chunte hain.
// Isse _id, createdAt jaise andar ke fields galti se bahar nahi jate.
function toListItem(project) {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    tech: project.tech,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
  }
}

function toDetail(project) {
  return {
    ...toListItem(project),
    overview: project.overview,
    features: project.features,
  }
}

// GET /api/projects  aur  GET /api/projects?featured=true
export async function listProjects(req, res) {
  const { featured } = req.query
  const filter = {}

  if (featured !== undefined) {
    // featured sirf "true" ya "false" (string) ho sakta hai. Aur kuch aaye toh 400.
    if (featured !== 'true' && featured !== 'false') {
      throw new HttpError(400, 'Query "featured" must be true or false.')
    }
    filter.featured = featured === 'true'
  }

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean()

  res.status(200).json({
    success: true,
    data: { projects: projects.map(toListItem) },
  })
}

// GET /api/projects/:slug
export async function getProject(req, res) {
  const { slug } = req.params

  // Pehle format check, tabhi database se poochho
  if (slug.length > 80 || !slugPattern.test(slug)) {
    throw new HttpError(400, 'Invalid project slug.')
  }

  const project = await Project.findOne({ slug }).lean()
  if (!project) {
    throw new HttpError(404, 'Project not found.')
  }

  res.status(200).json({
    success: true,
    data: { project: toDetail(project) },
  })
}