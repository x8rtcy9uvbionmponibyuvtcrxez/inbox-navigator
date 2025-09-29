const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!', result);
    
    // Try to create a simple table
    console.log('Creating test table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Test table created successfully!');
    
    // Try to insert data
    console.log('Inserting test data...');
    await prisma.$executeRaw`
      INSERT INTO test_table (name) VALUES ('test') ON CONFLICT DO NOTHING
    `;
    console.log('✅ Test data inserted successfully!');
    
    // Try to query data
    console.log('Querying test data...');
    const data = await prisma.$queryRaw`SELECT * FROM test_table`;
    console.log('✅ Test data queried successfully!', data);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();