// Services aur projects ko database mein daalta hai.
// Chalane ka tareeka (server folder se):
//   node --env-file=.env src/scripts/seedContent.js
//
// Safe hai: jo slug pehle se database mein hai use chhedta nahi (tumhare edits bache rehte hain).
// Dobara chalane par duplicate nahi banta.

import { env } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import Service from '../models/Service.js'
import Project from '../models/Project.js'
import { seedServices, seedProjects } from '../data/seedData.js'

async function seedCollection(Model, items, label) {
  let created = 0
  let skipped = 0

  for (const [index, item] of items.entries()) {
    const exists = await Model.exists({ slug: item.slug })
    if (exists) {
      skipped += 1
      continue
    }
    // order = list mein position. Chhota number pehle dikhta hai.
    await Model.create({ ...item, order: index })
    created += 1
  }

  console.log(`${label}: ${created} created, ${skipped} already existed (not changed)`)
}

async function run() {
  await connectDB()
  console.log(`Seeding database: ${env.mongodbDbName}`)

  try {
    await seedCollection(Service, seedServices, 'Services')
    await seedCollection(Project, seedProjects, 'Projects')
  } finally {
    await disconnectDB()
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:')
    console.error(error.message)
    process.exit(1)
  })