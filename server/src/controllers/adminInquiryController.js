import Inquiry from '../models/Inquiry.js'
import { HttpError } from '../utils/HttpError.js'
import { escapeRegex } from '../utils/escapeRegex.js'
import { parseInquiryListQuery, parseStatusUpdate } from '../validation/adminInquirySchema.js'

// Har field hum khud chunte hain (andar ka data galti se bahar nahi jata)
function toListItem(inquiry) {
  return {
    id: String(inquiry._id),
    inquiryId: inquiry.inquiryId,
    name: inquiry.name,
    email: inquiry.email,
    company: inquiry.company,
    projectType: inquiry.projectType,
    budget: inquiry.budget,
    deadline: inquiry.deadline,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
  }
}

function toDetail(inquiry) {
  return {
    ...toListItem(inquiry),
    description: inquiry.description,
    referenceUrl: inquiry.referenceUrl,
    notes: inquiry.notes,
    updatedAt: inquiry.updatedAt,
  }
}

// GET /api/admin/inquiries?search=&status=&page=&limit=
export async function listInquiries(req, res) {
  const { search, status, page, limit } = parseInquiryListQuery(req.query)

  const filter = {}
  if (status) {
    filter.status = status
  }
  if (search) {
    const pattern = escapeRegex(search)
    filter.$or = ['inquiryId', 'name', 'email', 'company', 'description'].map((field) => ({
      [field]: { $regex: pattern, $options: 'i' },
    }))
  }

  const [rows, total] = await Promise.all([
    Inquiry.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('inquiryId name email company projectType budget deadline status createdAt')
      .lean(),
    Inquiry.countDocuments(filter),
  ])

  res.status(200).json({
    success: true,
    data: {
      inquiries: rows.map(toListItem),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    },
  })
}

// GET /api/admin/inquiries/:id
export async function getInquiry(req, res) {
  const inquiry = await Inquiry.findById(req.params.id).lean()
  if (!inquiry) {
    throw new HttpError(404, 'Inquiry not found.')
  }

  res.status(200).json({ success: true, data: { inquiry: toDetail(inquiry) } })
}

// PATCH /api/admin/inquiries/:id   body: { "status": "contacted" }
export async function updateInquiryStatus(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const { status } = parseStatusUpdate(req.body)

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).lean()

  if (!inquiry) {
    throw new HttpError(404, 'Inquiry not found.')
  }

  res.status(200).json({ success: true, data: { inquiry: toDetail(inquiry) } })
}

// DELETE /api/admin/inquiries/:id
export async function deleteInquiry(req, res) {
  const deleted = await Inquiry.findByIdAndDelete(req.params.id).lean()
  if (!deleted) {
    throw new HttpError(404, 'Inquiry not found.')
  }

  res.status(200).json({ success: true, data: { deleted: true } })
}