require("dotenv").config({ path: ".env.local" })
require("dotenv").config()

const bcrypt = require("bcryptjs")
const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const { Pool } = require("pg")

async function main() {
  const connectionString = process.env.DATABASE_URL
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD
  const username = process.env.ADMIN_USERNAME || "admin"

  if (!connectionString) throw new Error("DATABASE_URL is required")
  if (!password || password.length < 12) {
    throw new Error("Set ADMIN_BOOTSTRAP_PASSWORD to a password of at least 12 characters")
  }

  const pool = new Pool({ connectionString })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  try {
    const password_hash = await bcrypt.hash(password, 12)
    await prisma.admin.upsert({
      where: { username },
      create: { username, password_hash },
      update: { password_hash },
    })
    console.log(`Administrator password updated for "${username}".`)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Admin bootstrap failed")
  process.exitCode = 1
})
