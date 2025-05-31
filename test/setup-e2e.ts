import { execSync } from 'child_process'
import 'dotenv/config'

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()
const schemaName = 'db_nestcleantest'

if (!process.env.DATABASE_URL) {
  throw new Error('Please provider a DATABASE_URL envirioment variable')
}

function generateUniqueDataBaseUrl(schemaName: string) {
  let url = process.env.DATABASE_URL

  url = url?.replace('database=db_nestclean', `database=${schemaName}`)

  return url?.toString()
}

beforeAll(async () => {
  const dataBaseConnectionString = generateUniqueDataBaseUrl(schemaName)

  process.env.DATABASE_URL = dataBaseConnectionString

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  try {
    await prisma.$executeRawUnsafe(`
            USE master;
            DECLARE @kill varchar(max) = '';  
            SELECT @kill = @kill + 'KILL ' + CONVERT(varchar(5), session_id) + ';'  
            FROM sys.dm_exec_sessions 
            WHERE database_id = DB_ID('${schemaName}');
            
            IF @kill <> '' BEGIN
                EXEC(@kill);
            END
            
            DROP DATABASE IF EXISTS ${schemaName};
        `)
    await prisma.$disconnect()
  } catch (error) {
    console.log(error)
  }
})
