// Models ka smoke test: database mein test data likhta hai, check karta hai, phir saaf kar deta hai.
// Chalane ka tareeka (server folder se):
//   node --env-file=.env src/scripts/modelsSmokeTest.js

import { env } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import Admin from '../models/Admin.js'
import Inquiry from '../models/Inquiry.js'
import Project from '../models/Project.js'
import Service from '../models/Service.js'
import SiteSettings from '../models/SiteSettings.js'

const MARKER = 'SMOKE TEST: this record was created by the models smoke test script.'
const PROJECT_SLUG = 'smoke-test-project'
const SERVICE_SLUG = 'smoke-test-service'

let passed = 0
let failed = 0

function check(label, condition) {
  if (condition) {
    passed += 1
    console.log(`  PASS  ${label}`)
  } else {
    failed += 1
    console.log(`  FAIL  ${label}`)
  }
}

// Document ko validate karta hai (save nahi karta). Galat fields ke naam ki list deta hai.
async function failedFieldsOf(document) {
  try {
    await document.validate()
    return []
  } catch (error) {
    return Object.keys(error.errors || {})
  }
}

// Asli data wale database par galti se na chale
function assertSafeDatabase() {
  const name = env.mongodbDbName
  const isTestDb = name.endsWith('_dev') || name.endsWith('_test')
  if (env.isProduction || !isTestDb) {
    throw new Error(`Refusing to run: database "${name}" is not a _dev or _test database.`)
  }
}

async function cleanup() {
  await Inquiry.deleteMany({ description: MARKER })
  await Project.deleteMany({ slug: PROJECT_SLUG })
  await Service.deleteMany({ slug: SERVICE_SLUG })
}

async function run() {
  assertSafeDatabase()
  await connectDB()

  try {
    await cleanup() // pichli adhoori run ka kachra hata do

    console.log('\n1. Collections aur indexes banana')
    await Promise.all([Admin, Inquiry, Project, Service, SiteSettings].map((model) => model.init()))
    check('5 models ke collections aur indexes ban gaye', true)

    console.log('\n2. Inquiry: sahi data')
    const inquiry = await Inquiry.create({
      name: '  Test User  ',
      email: 'TEST@Example.com',
      projectType: 'business-website',
      budget: '10k-25k',
      deadline: '1-month',
      description: MARKER,
    })
    check('inquiryId bana (INQ-XXXXXXXX)', /^INQ-[A-HJ-NP-Z2-9]{8}$/.test(inquiry.inquiryId))
    check('status default "new" hai', inquiry.status === 'new')
    check('name trim hua', inquiry.name === 'Test User')
    check('email lowercase hua', inquiry.email === 'test@example.com')
    check('company aur notes default khaali', inquiry.company === '' && inquiry.notes === '')
    check('createdAt set hua', inquiry.createdAt instanceof Date)

    const found = await Inquiry.findOne({ inquiryId: inquiry.inquiryId })
    check('database se wapas padh sake', found?.email === 'test@example.com')

    console.log('\n3. Inquiry: galat data reject hona chahiye')
    const bad = new Inquiry({
      name: 'A',
      email: 'not-an-email',
      projectType: 'Bad Type!',
      budget: 'free',
      deadline: 'yesterday',
      description: 'short',
      referenceUrl: 'javascript:alert(1)',
      status: 'done',
    })
    const failedFields = await failedFieldsOf(bad)
    const expected = ['name', 'email', 'projectType', 'budget', 'deadline', 'description', 'referenceUrl', 'status']
    console.log(`  (reject hue fields: ${failedFields.join(', ')})`)
    check('8 galat fields reject hue', expected.every((field) => failedFields.includes(field)))

    const missingFields = await failedFieldsOf(new Inquiry({}))
    check(
      'required fields khaali hone par reject',
      ['name', 'email', 'projectType', 'budget', 'deadline', 'description'].every((f) => missingFields.includes(f))
    )

    console.log('\n4. Project: unique slug')
    const projectData = {
      title: 'Smoke Test Project',
      slug: PROJECT_SLUG,
      category: 'Frontend',
      description: 'A project created by the smoke test.',
      overview: 'Overview text for the smoke test project.',
      features: ['One', 'Two'],
      tech: ['HTML'],
    }
    const project = await Project.create(projectData)
    check('project bana, featured default false', project.featured === false)
    check('links default khaali', project.githubUrl === '' && project.liveUrl === '')

    let duplicateCode = null
    try {
      await Project.create({ ...projectData, title: 'Another title' })
    } catch (error) {
      duplicateCode = error.code
    }
    check('same slug dobara reject hua (unique index, code 11000)', duplicateCode === 11000)

    console.log('\n5. Service')
    const service = await Service.create({
      slug: SERVICE_SLUG,
      title: 'Smoke Test Service',
      description: 'A service created by the smoke test.',
    })
    check('service bani, enabled default true, icon default Code', service.enabled === true && service.icon === 'Code')

    console.log('\n6. Admin: password hash chhupa rehta hai (save nahi kar rahe)')
    const admin = new Admin({ email: 'Admin@Example.com', passwordHash: 'not-a-real-hash' })
    check('admin email lowercase hua', admin.email === 'admin@example.com')
    check('toJSON mein passwordHash nahi', !('passwordHash' in admin.toJSON()))

    console.log('\n7. SiteSettings: defaults (save nahi kar rahe)')
    const settings = new SiteSettings({})
    check('key "main" aur brandName default sahi', settings.key === 'main' && settings.brandName === 'DevLance')
    const badSettings = new SiteSettings({ socials: { github: 'ftp://example.com' }, email: 'nope' })
    const badSettingsFields = await failedFieldsOf(badSettings)
    check(
      'galat github link aur email reject hue',
      badSettingsFields.includes('socials.github') && badSettingsFields.includes('email')
    )
  } finally {
    console.log('\nSaaf-safai: test data hata raha hoon')
    await cleanup()
    await disconnectDB()
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((error) => {
  console.error('\nSmoke test crash hua:')
  console.error(error.message)
  process.exit(1)
})