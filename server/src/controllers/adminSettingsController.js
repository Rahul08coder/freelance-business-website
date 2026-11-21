import SiteSettings from '../models/SiteSettings.js'
import { HttpError } from '../utils/HttpError.js'
import { parseSettingsUpdate } from '../validation/adminSettingsSchema.js'

// Har field hum khud chunte hain
function toAdminSettings(doc) {
  return {
    email: doc.email,
    location: doc.location,
    socials: {
      github: doc.socials?.github ?? '',
      linkedin: doc.socials?.linkedin ?? '',
      twitter: doc.socials?.twitter ?? '',
    },
    updatedAt: doc.updatedAt,
  }
}

// GET /api/admin/settings
export async function getAdminSettings(req, res) {
  const doc = await SiteSettings.findOne({ key: 'main' }).lean()

  res.status(200).json({
    success: true,
    data: { settings: doc ? toAdminSettings(doc) : null },
  })
}

// PATCH /api/admin/settings
// Jitne fields bheje utne hi badalte hain (social links ke andar bhi). Document na ho toh ban jata hai.
export async function updateAdminSettings(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const changes = parseSettingsUpdate(req.body)

  // $set ke liye "socials.github" jaise naam banate hain, taaki ek link badalne par baaki na mitein.
  // Naam Zod ke 3 fixed naamon se aate hain, user ke diye nahi.
  const set = {}
  if (changes.email !== undefined) set.email = changes.email
  if (changes.location !== undefined) set.location = changes.location
  if (changes.socials) {
    for (const [name, value] of Object.entries(changes.socials)) {
      set[`socials.${name}`] = value
    }
  }

  if (Object.keys(set).length === 0) {
    throw new HttpError(400, 'No changes were sent.')
  }

  const doc = await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    { $set: set },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean()

  res.status(200).json({ success: true, data: { settings: toAdminSettings(doc) } })
}