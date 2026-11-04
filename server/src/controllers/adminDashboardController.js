import Inquiry from '../models/Inquiry.js'
import Project from '../models/Project.js'
import Service from '../models/Service.js'
import { INQUIRY_STATUSES } from '../config/constants.js'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

// GET /api/admin/dashboard
// Sirf ginti aur 5 sabse nayi inquiries. Poora data nahi (wo Part 2 mein, alag route se).
export async function getDashboard(req, res) {
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS)

  // Saari queries ek saath chalti hain (ek ke baad ek nahi), isliye jaldi aati hai
  const [
    total,
    last7Days,
    statusRows,
    recent,
    projectTotal,
    projectFeatured,
    serviceTotal,
    serviceEnabled,
  ] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('inquiryId name projectType status createdAt')
      .lean(),
    Project.countDocuments(),
    Project.countDocuments({ featured: true }),
    Service.countDocuments(),
    Service.countDocuments({ enabled: true }),
  ])

  // Har status ke liye ginti (jis status ki inquiry nahi, uska 0)
  const byStatus = Object.fromEntries(INQUIRY_STATUSES.map((status) => [status, 0]))
  statusRows.forEach((row) => {
    if (row._id in byStatus) {
      byStatus[row._id] = row.count
    }
  })

  res.status(200).json({
    success: true,
    data: {
      inquiries: {
        total,
        last7Days,
        byStatus,
        // Har field hum khud chunte hain (_id jaisa andar ka data bahar nahi jata)
        recent: recent.map((item) => ({
          inquiryId: item.inquiryId,
          name: item.name,
          projectType: item.projectType,
          status: item.status,
          createdAt: item.createdAt,
        })),
      },
      projects: { total: projectTotal, featured: projectFeatured },
      services: { total: serviceTotal, enabled: serviceEnabled },
    },
  })
}