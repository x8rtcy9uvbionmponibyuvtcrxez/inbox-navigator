const { PrismaClient } = require('@prisma/client');

async function checkTables() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking existing tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('✅ Existing tables:', tables);
    
    // Check if users table exists
    const usersTable = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
    `;
    console.log('✅ Users table columns:', usersTable);
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

