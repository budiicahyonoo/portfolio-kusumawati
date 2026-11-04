import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Menggunakan sslmode=verify-full untuk menghilangkan warning keamanan SSL
  const connectionString = "postgresql://neondb_owner:npg_j6lHLyREk1ZW@ep-holy-wave-azlucile-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full"
  
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma