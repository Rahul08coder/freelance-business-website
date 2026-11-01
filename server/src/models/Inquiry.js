import mongoose from 'mongoose'
import {
  BUDGET_VALUES,
  DEADLINE_VALUES,
  INQUIRY_LIMITS,
  INQUIRY_STATUSES,
} from '../config/constants.js'
import { emailPattern, isEmptyOrHttpUrl, slugPattern } from '../utils/validators.js'
import { generateInquiryId } from '../utils/generateInquiryId.js'

const L = INQUIRY_LIMITS

const inquirySchema = new mongoose.Schema(
  {
    // Client ko dikhne wala unique reference ID. Ek baar ban gaya toh badal nahi sakta.
    inquiryId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      default: generateInquiryId,
    },

    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [L.name.min, `Name must be at least ${L.name.min} characters.`],
      maxlength: [L.name.max, `Name must be ${L.name.max} characters or fewer.`],
    },

    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
      maxlength: [L.email.max, 'Email is too long.'],
      match: [emailPattern, 'Please enter a valid email address.'],
    },

    company: {
      type: String,
      trim: true,
      default: '',
      maxlength: [L.company.max, `Company name must be ${L.company.max} characters or fewer.`],
    },

    // Services ka slug (jaise "mern-fullstack") ya "other". Pakka match Day 17 mein hoga.
    projectType: {
      type: String,
      required: [true, 'Project type is required.'],
      trim: true,
      lowercase: true,
      maxlength: [L.projectType.max, 'Project type is too long.'],
      match: [slugPattern, 'Project type is not valid.'],
    },

    budget: {
      type: String,
      required: [true, 'Budget range is required.'],
      enum: { values: BUDGET_VALUES, message: 'Budget range is not valid.' },
    },

    deadline: {
      type: String,
      required: [true, 'Deadline is required.'],
      enum: { values: DEADLINE_VALUES, message: 'Deadline is not valid.' },
    },

    description: {
      type: String,
      required: [true, 'Project description is required.'],
      trim: true,
      minlength: [L.description.min, `Description must be at least ${L.description.min} characters.`],
      maxlength: [L.description.max, `Description must be ${L.description.max} characters or fewer.`],
    },

    referenceUrl: {
      type: String,
      trim: true,
      default: '',
      maxlength: [L.referenceUrl.max, 'Reference link is too long.'],
      validate: {
        validator: isEmptyOrHttpUrl,
        message: 'Reference link must start with http:// or https://',
      },
    },

    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [L.notes.max, `Notes must be ${L.notes.max} characters or fewer.`],
    },

    status: {
      type: String,
      enum: { values: INQUIRY_STATUSES, message: 'Status is not valid.' },
      default: 'new',
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt apne aap
    versionKey: false, // __v field nahi chahiye
  }
)

// Admin list: sabse nayi inquiry pehle
inquirySchema.index({ createdAt: -1 })
// Admin list: status filter ke saath, nayi pehle
inquirySchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('Inquiry', inquirySchema)