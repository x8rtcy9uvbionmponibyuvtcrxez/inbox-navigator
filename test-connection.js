const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Testing database connection...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query successful:', result.rows[0]);
    
    // Check if we can create a simple table
    console.log('Testing table creation...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Table creation successful!');
    
    // Test insert
    await client.query(`
      INSERT INTO test_connection (message) VALUES ('Connection test successful')
    `);
    console.log('✅ Insert successful!');
    
    // Test select
    const selectResult = await client.query('SELECT * FROM test_connection');
    console.log('✅ Select successful:', selectResult.rows);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();

