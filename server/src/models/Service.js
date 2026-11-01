import mongoose from 'mongoose'
import { slugPattern } from '../utils/validators.js'

const serviceSchema = new mongoose.Schema(
  {
    // Frontend ke site.js mein isse "id" kehte hain. API mein slug ko id bana ke bhejenge (Day 16).
    // /start-project?service=<slug> aur Inquiry.projectType isi slug ko use karte hain.
    slug: {
      type: String,
      required: [true, 'Slug is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [60, 'Slug must be 60 characters or fewer.'],
      match: [slugPattern, 'Slug can only have lowercase letters, numbers and hyphens.'],
    },

    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters.'],
      maxlength: [100, 'Title must be 100 characters or fewer.'],
    },

    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      maxlength: [300, 'Description must be 300 characters or fewer.'],
    },

    // Lucide icon ka naam (jaise "Globe"). Frontend ke icons.js mein na mile toh default icon dikhta hai.
    icon: {
      type: String,
      trim: true,
      default: 'Code',
      maxlength: [40, 'Icon name is too long.'],
      match: [/^[A-Za-z0-9]+$/, 'Icon name can only have letters and numbers.'],
    },

    // false ho toh website par nahi dikhegi
    enabled: { type: Boolean, default: true },

    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

serviceSchema.index({ order: 1 })

export default mongoose.model('Service', serviceSchema)