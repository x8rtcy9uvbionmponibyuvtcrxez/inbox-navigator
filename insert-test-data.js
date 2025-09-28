const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function insertTestData() {
  console.log('🔧 Inserting test data...');
  
  const prisma = new PrismaClient();

  try {
    // Read the SQL file
    const sql = fs.readFileSync('./insert-test-data.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length === 0) continue;
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.log(`⚠️  Statement ${i + 1} failed (might be expected):`, error.message);
      }
    }
    
    console.log('🎉 Test data insertion completed!');
    
  } catch (error) {
    console.error('❌ Error inserting test data:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestData();
