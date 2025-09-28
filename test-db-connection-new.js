const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test;`;
    console.log('✅ Query test successful:', result);
    
    // Test if we can create a simple table
    console.log('🔧 Testing table creation...');
    
    // Try to create a test table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Test table creation successful');
    
    // Clean up test table
    await prisma.$executeRaw`DROP TABLE IF EXISTS test_connection;`;
    console.log('✅ Test table cleanup successful');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
