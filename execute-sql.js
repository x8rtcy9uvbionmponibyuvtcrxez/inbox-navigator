const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function executeSQL() {
  console.log('🚀 Executing comprehensive database schema...');
  
  const prisma = new PrismaClient();

  try {
    // Read the SQL file
    const sql = fs.readFileSync('./create-tables.sql', 'utf8');
    
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
        // Continue with other statements
      }
    }
    
    console.log('🎉 Database schema execution completed!');
    
    // Test the connection
    console.log('🔍 Testing database connection...');
    const result = await prisma.$queryRaw`SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';`;
    console.log('✅ Database test successful:', result);
    
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

executeSQL();
