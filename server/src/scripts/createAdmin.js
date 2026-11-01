// Pehla admin banane ki script. Password terminal mein chhupa ke puchti hai.
// Chalane ka tareeka (server folder se):
//   node --env-file=.env src/scripts/createAdmin.js
//
// Password bhoolne par:
//   node --env-file=.env src/scripts/createAdmin.js --reset-password
//
// Password kahin print ya save nahi hota (na .env mein, na log mein). Sirf uska bcrypt hash database mein jata hai.

import readline from 'node:readline/promises'
import { env } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import Admin from '../models/Admin.js'
import { deleteAdminSessions } from '../services/sessionService.js'
import { emailPattern } from '../utils/validators.js'
import { MAX_PASSWORD_BYTES, MIN_PASSWORD_LENGTH, hashPassword } from '../utils/password.js'

const RESET_MODE = process.argv.includes('--reset-password')

const COMMON_PASSWORDS = new Set([
  'password1234',
  'password12345',
  'qwertyuiop12',
  'admin1234567',
  'changeme1234',
  'iloveyou1234',
  '123456789012',
])

// Password type karte waqt screen par kuch nahi dikhta
function askHidden(question) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin

    if (!stdin.isTTY) {
      reject(new Error('This script must be run in an interactive terminal.'))
      return
    }

    process.stdout.write(question)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')

    let input = ''

    function cleanup() {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.off('data', onData)
    }

    function onData(chunk) {
      for (const char of chunk) {
        if (char === '\u0003') {
          // Ctrl + C
          cleanup()
          process.stdout.write('\n')
          process.exit(1)
        } else if (char === '\r' || char === '\n') {
          cleanup()
          process.stdout.write('\n')
          resolve(input)
          return
        } else if (char === '\u007f' || char === '\b') {
          input = input.slice(0, -1) // Backspace
        } else {
          input += char
        }
      }
    }

    stdin.on('data', onData)
  })
}

// Kamzor password par message deta hai, theek ho toh ''
function checkPasswordStrength(password, email) {
  const lower = password.toLowerCase()
  const localPart = email.split('@')[0].toLowerCase()

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    return `Password is too long (maximum ${MAX_PASSWORD_BYTES} bytes).`
  }
  if (new Set(password).size < 5) {
    return 'Password uses too few different characters.'
  }
  if (COMMON_PASSWORDS.has(lower)) {
    return 'This password is too common.'
  }
  if (localPart.length >= 4 && lower.includes(localPart)) {
    return 'Password must not contain your email name.'
  }
  return ''
}

async function readNewPassword(email) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const password = await askHidden('New password (typing is hidden): ')
    const problem = checkPasswordStrength(password, email)
    if (problem) {
      console.log(`  ${problem}`)
      continue
    }

    const again = await askHidden('Repeat the password: ')
    if (again !== password) {
      console.log('  The two passwords do not match. Try again.')
      continue
    }

    return password
  }

  throw new Error('Too many attempts. Run the script again.')
}

async function run() {
  await connectDB()

  try {
    console.log(`Database: ${env.mongodbDbName}`)
    const adminCount = await Admin.countDocuments()

    if (!RESET_MODE && adminCount > 0) {
      console.log('An admin already exists. This script only creates the first admin.')
      console.log('To change the password, run it with --reset-password.')
      return
    }
    if (RESET_MODE && adminCount === 0) {
      console.log('No admin exists yet. Run the script without --reset-password.')
      return
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const email = (await rl.question('Admin email: ')).trim().toLowerCase()

    if (!emailPattern.test(email) || email.length > 254) {
      rl.close()
      throw new Error('That does not look like a valid email address.')
    }

    const action = RESET_MODE ? 'Reset the password' : 'Create the admin'
    const confirm = await rl.question(`${action} in database "${env.mongodbDbName}"? Type YES to continue: `)
    rl.close()

    if (confirm.trim() !== 'YES') {
      console.log('Cancelled. Nothing was changed.')
      return
    }

    if (RESET_MODE) {
      const admin = await Admin.findOne({ email })
      if (!admin) {
        throw new Error('No admin found with that email.')
      }

      const password = await readNewPassword(email)
      const passwordHash = await hashPassword(password)

      await Admin.updateOne({ _id: admin._id }, { passwordHash })
      await deleteAdminSessions(admin._id) // purane saare login band
      console.log('Password updated. All existing logins for this admin were signed out.')
    } else {
      const password = await readNewPassword(email)
      const passwordHash = await hashPassword(password)

      await Admin.create({ email, passwordHash, name: 'Admin' })
      console.log(`Admin created: ${email}`)
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