import Service from '../models/Service.js'

// GET /api/services: sirf enabled services, order se.
// Frontend ke purane format ke hisaab se slug ko "id" naam se bhejte hain.
export async function listServices(req, res) {
  const services = await Service.find({ enabled: true })
    .sort({ order: 1, createdAt: 1 })
    .lean()

  res.status(200).json({
    success: true,
    data: {
      services: services.map((service) => ({
        id: service.slug,
        title: service.title,
        description: service.description,
        icon: service.icon,
      })),
    },
  })
}