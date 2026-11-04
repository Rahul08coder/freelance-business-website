import Project from '../models/Project.js'
import { HttpError } from '../utils/HttpError.js'
import { parseProjectCreate, parseProjectUpdate } from '../validation/adminProjectSchema.js'

// Har field hum khud chunte hain (andar ka data galti se bahar nahi jata)
function toListItem(project) {
  return {
    id: String(project._id),
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    tech: project.tech,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
    order: project.order,
    updatedAt: project.updatedAt,
  }
}

function toDetail(project) {
  return {
    ...toListItem(project),
    overview: project.overview,
    features: project.features,
    createdAt: project.createdAt,
  }
}

// Slug pehle se kisi aur project ka ho toh (unique index tootna) slug field ke neeche message dikhao
function rethrowDuplicateSlug(error) {
  if (error?.code === 11000) {
    throw new HttpError(409, 'Validation failed.', [
      { field: 'slug', message: 'This slug is already used by another project.' },
    ])
  }
  throw error
}

// Naya project sabse aakhir mein: abhi ke sabse bade order ke baad
async function nextOrder() {
  const last = await Project.findOne().sort({ order: -1 }).select('order').lean()
  return last ? last.order + 1 : 0
}

// GET /api/admin/projects  (saare projects, id ke saath)
export async function listAllProjects(req, res) {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).limit(200).lean()

  res.status(200).json({
    success: true,
    data: { projects: projects.map(toListItem) },
  })
}

// GET /api/admin/projects/:id
export async function getProjectById(req, res) {
  const project = await Project.findById(req.params.id).lean()
  if (!project) {
    throw new HttpError(404, 'Project not found.')
  }

  res.status(200).json({ success: true, data: { project: toDetail(project) } })
}

// POST /api/admin/projects
export async function createProject(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const input = parseProjectCreate(req.body)

  try {
    const project = await Project.create({
      ...input,
      featured: input.featured ?? false,
      order: input.order ?? (await nextOrder()),
    })

    res.status(201).json({ success: true, data: { project: toDetail(project) } })
  } catch (error) {
    rethrowDuplicateSlug(error)
  }
}

// PATCH /api/admin/projects/:id  (jitne fields bheje utne hi badalte hain)
export async function updateProject(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const changes = parseProjectUpdate(req.body)

  try {
    const project = await Project.findByIdAndUpdate(req.params.id, changes, {
      new: true,
      runValidators: true,
    }).lean()

    if (!project) {
      throw new HttpError(404, 'Project not found.')
    }

    res.status(200).json({ success: true, data: { project: toDetail(project) } })
  } catch (error) {
    rethrowDuplicateSlug(error)
  }
}

// DELETE /api/admin/projects/:id
export async function deleteProject(req, res) {
  const deleted = await Project.findByIdAndDelete(req.params.id).lean()
  if (!deleted) {
    throw new HttpError(404, 'Project not found.')
  }

  res.status(200).json({ success: true, data: { deleted: true } })
}