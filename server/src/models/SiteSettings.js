import mongoose from 'mongoose'
import { isEmptyOrEmail, isEmptyOrHttpUrl } from '../utils/validators.js'

const socialUrl = {
  type: String,
  trim: true,
  default: '',
  maxlength: [300, 'Link is too long.'],
  validate: {
    validator: isEmptyOrHttpUrl,
    message: 'Link must start with http:// or https://',
  },
}

// Sirf ek document hoga (key hamesha "main"). unique: true se doosra ban nahi sakta.
const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },

    brandName: {
      type: String,
      required: [true, 'Brand name is required.'],
      trim: true,
      default: 'DevLance',
      maxlength: [60, 'Brand name must be 60 characters or fewer.'],
    },

    tagline: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Tagline must be 120 characters or fewer.'],
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Description must be 300 characters or fewer.'],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      maxlength: [254, 'Email is too long.'],
      validate: { validator: isEmptyOrEmail, message: 'Please enter a valid email address.' },
    },

    location: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Location must be 100 characters or fewer.'],
    },

    socials: {
      github: socialUrl,
      linkedin: socialUrl,
      twitter: socialUrl,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model('SiteSettings', siteSettingsSchema)