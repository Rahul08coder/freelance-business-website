import mongoose from 'mongoose'
import { emailPattern } from '../utils/validators.js'

// Password hash aur lock ki andar ki cheezein hata ke baaki dikhao.
// Isse JSON response mein ye kabhi nahi jayengi.
function removePrivateFields(doc, ret) {
  delete ret.passwordHash
  delete ret.failedLoginCount
  delete ret.lastFailedLoginAt
  delete ret.lockedUntil
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

    // Galat password ki ginti aur account lock (Day 23)
    failedLoginCount: { type: Number, default: 0 },
    lastFailedLoginAt: { type: Date },
    lockedUntil: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { transform: removePrivateFields },
    toObject: { transform: removePrivateFields },
  }
)

export default mongoose.model('Admin', adminSchema)