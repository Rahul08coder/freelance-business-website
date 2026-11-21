import SiteSettings from '../models/SiteSettings.js'

// GET /api/settings  (public)
// Sirf wahi jo website par dikhta hai: email, location, social links.
// Abhi tak admin ne kuch save nahi kiya ho toh settings: null (frontend apni built-in values dikhata hai).
export async function getPublicSettings(req, res) {
  const doc = await SiteSettings.findOne({ key: 'main' }).lean()

  res.status(200).json({
    success: true,
    data: {
      settings: doc
        ? {
            email: doc.email,
            location: doc.location,
            socials: {
              github: doc.socials?.github ?? '',
              linkedin: doc.socials?.linkedin ?? '',
              twitter: doc.socials?.twitter ?? '',
            },
          }
        : null,
    },
  })
}