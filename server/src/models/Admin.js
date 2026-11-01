import mongoose from 'mongoose'
import { emailPattern } from '../utils/validators.js'

// Password hata ke baaki sab dikhao. Isse JSON response mein hash kabhi nahi jayega.
function removePasswordHash(doc, ret) {
  delete ret.passwordHash
  return ret
}

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email is too long.'],
      match: [emailPattern, 'Please enter a valid email address.'],
    },

    // bcrypt hash (Day 18). Plain password kabhi store nahi hota.
    // select: false: queries mein by default yeh field aata hi nahi.
    // Login ke time .select('+passwordHash') se manga jayega.
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required.'],
      select: false,
    },

    name: {
      type: String,
      trim: true,
      default: 'Admin',
      maxlength: [80, 'Name must be 80 characters or fewer.'],
    },

    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { transform: removePasswordHash },
    toObject: { transform: removePasswordHash },
  }
)

export default mongoose.model('Admin', adminSchema)