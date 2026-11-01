import mongoose from 'mongoose'
import { PROJECT_CATEGORIES } from '../config/constants.js'
import { isEmptyOrHttpUrl, slugPattern } from '../utils/validators.js'

function maxItems(limit, label) {
  return {
    validator: (value) => value.length <= limit,
    message: `A project can have at most ${limit} ${label}.`,
  }
}

const urlField = {
  type: String,
  trim: true,
  default: '',
  maxlength: [300, 'Link is too long.'],
  validate: {
    validator: isEmptyOrHttpUrl,
    message: 'Link must start with http:// or https://',
  },
}

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters.'],
      maxlength: [100, 'Title must be 100 characters or fewer.'],
    },

    // URL mein use hota hai: /portfolio/taskflow
    slug: {
      type: String,
      required: [true, 'Slug is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [80, 'Slug must be 80 characters or fewer.'],
      match: [slugPattern, 'Slug can only have lowercase letters, numbers and hyphens.'],
    },

    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: { values: PROJECT_CATEGORIES, message: 'Category is not valid.' },
    },

    // Card par dikhne wala chhota text
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      maxlength: [300, 'Description must be 300 characters or fewer.'],
    },

    // Detail page ka lamba text
    overview: {
      type: String,
      required: [true, 'Overview is required.'],
      trim: true,
      maxlength: [3000, 'Overview must be 3000 characters or fewer.'],
    },

    features: {
      type: [{ type: String, trim: true, maxlength: [200, 'A feature must be 200 characters or fewer.'] }],
      default: [],
      validate: maxItems(15, 'features'),
    },

    tech: {
      type: [{ type: String, trim: true, maxlength: [40, 'A technology name must be 40 characters or fewer.'] }],
      default: [],
      validate: maxItems(15, 'technologies'),
    },

    githubUrl: urlField,
    liveUrl: urlField,

    featured: { type: Boolean, default: false },

    // Chhota number pehle dikhta hai
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Home par featured projects, aur list ko order se sort karne ke liye
projectSchema.index({ featured: 1, order: 1 })
projectSchema.index({ order: 1, createdAt: -1 })

export default mongoose.model('Project', projectSchema)