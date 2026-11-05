import Service from '../models/Service.js'
import { HttpError } from '../utils/HttpError.js'
import { parseServiceCreate, parseServiceUpdate } from '../validation/adminServiceSchema.js'

// Har field hum khud chunte hain (andar ka data galti se bahar nahi jata)
function toAdminService(service) {
  return {
    id: String(service._id),
    slug: service.slug,
    title: service.title,
    description: service.description,
    icon: service.icon,
    enabled: service.enabled,
    order: service.order,
    updatedAt: service.updatedAt,
  }
}

// Slug pehle se kisi aur service ka ho toh slug field ke neeche message dikhao
function rethrowDuplicateSlug(error) {
  if (error?.code === 11000) {
    throw new HttpError(409, 'Validation failed.', [
      { field: 'slug', message: 'This slug is already used by another service.' },
    ])
  }
  throw error
}

// Naya service sabse aakhir mein
async function nextOrder() {
  const last = await Service.findOne().sort({ order: -1 }).select('order').lean()
  return last ? last.order + 1 : 0
}

// GET /api/admin/services  (disabled bhi, id ke saath)
export async function listAllServices(req, res) {
  const services = await Service.find().sort({ order: 1, createdAt: 1 }).limit(100).lean()

  res.status(200).json({
    success: true,
    data: { services: services.map(toAdminService) },
  })
}

// GET /api/admin/services/:id
export async function getServiceById(req, res) {
  const service = await Service.findById(req.params.id).lean()
  if (!service) {
    throw new HttpError(404, 'Service not found.')
  }

  res.status(200).json({ success: true, data: { service: toAdminService(service) } })
}

// POST /api/admin/services
export async function createService(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const input = parseServiceCreate(req.body)

  try {
    const service = await Service.create({
      ...input,
      enabled: input.enabled ?? true,
      order: input.order ?? (await nextOrder()),
    })

    res.status(201).json({ success: true, data: { service: toAdminService(service) } })
  } catch (error) {
    rethrowDuplicateSlug(error)
  }
}

// PATCH /api/admin/services/:id  (jitne fields bheje utne hi badalte hain, slug nahi)
export async function updateService(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const changes = parseServiceUpdate(req.body)

  const service = await Service.findByIdAndUpdate(req.params.id, changes, {
    new: true,
    runValidators: true,
  }).lean()

  if (!service) {
    throw new HttpError(404, 'Service not found.')
  }

  res.status(200).json({ success: true, data: { service: toAdminService(service) } })
}

// DELETE /api/admin/services/:id
export async function deleteService(req, res) {
  const deleted = await Service.findByIdAndDelete(req.params.id).lean()
  if (!deleted) {
    throw new HttpError(404, 'Service not found.')
  }

  res.status(200).json({ success: true, data: { deleted: true } })
}