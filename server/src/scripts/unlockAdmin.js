// Admin account ka login lock turant hatane ki script.
// Chalane ka tareeka (server folder se):
//   node --env-file=.env src/scripts/unlockAdmin.js
//
// Lock apne aap 15 minute mein khatam ho jata hai. Ye script sirf jaldi ke liye hai.

import readline from 'node:readline/promises'
import { env } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import Admin from '../models/Admin.js'
import { emailPattern } from '../utils/validators.js'

async function run() {
  await connectDB()

  try {
    console.log(`Database: ${env.mongodbDbName}`)

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const email = (await rl.question('Admin email to unlock: ')).trim().toLowerCase()
    rl.close()

    if (!emailPattern.test(email)) {
      throw new Error('That does not look like a valid email address.')
    }

    const result = await Admin.updateOne(
      { email },
      { $set: { failedLoginCount: 0 }, $unset: { lockedUntil: 1, lastFailedLoginAt: 1 } }
    )

    if (result.matchedCount === 0) {
      console.log('No admin found with that email. Nothing was changed.')
    } else {
      console.log('Done. The login lock was cleared.')
    }
  } finally {
    await disconnectDB()
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\nFailed: ${error.message}`)
    process.exit(1)
  })