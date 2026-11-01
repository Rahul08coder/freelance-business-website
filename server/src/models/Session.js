import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    // Cookie wale token ka SHA-256 hash. Asli token database mein kabhi nahi rakhte.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
)

// MongoDB expiresAt aate hi document khud delete kar deta hai (TTL index).
// Ye check har minute chalta hai, isliye hum query mein bhi expiresAt dekhte hain.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Admin ki saari sessions ek saath hatane ke liye (password reset par)
sessionSchema.index({ admin: 1 })

export default mongoose.model('Session', sessionSchema)