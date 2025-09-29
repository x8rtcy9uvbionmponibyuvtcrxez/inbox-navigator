const { Client } = require('pg');

async function testSupabaseConnection() {
  // Try different connection string formats
  const connectionStrings = [
    // Direct connection
    'postgresql://postgres:79H76pkeBzsD_sn@db.jryyzhofxzjkmkpammct.supabase.co:5432/postgres',
    // Pooler connection
    'postgresql://postgres.jryyzhofxzjkmkpammct:79H76pkeBzsD_sn@aws-1-us-west-1.pooler.supabase.com:6543/postgres',
    // Alternative pooler format
    'postgresql://postgres:79H76pkeBzsD_sn@aws-1-us-west-1.pooler.supabase.com:6543/postgres',
  ];

  for (let i = 0; i < connectionStrings.length; i++) {
    const connectionString = connectionStrings[i];
    console.log(`\n--- Testing connection ${i + 1} ---`);
    console.log(`Connection string: ${connectionString}`);
    
    const client = new Client({
      connectionString: connectionString
    });

    try {
      await client.connect();
      console.log('✅ Connection successful!');
      
      // Test a simple query
      const result = await client.query('SELECT NOW() as current_time');
      console.log('✅ Query successful:', result.rows[0]);
      
      // Test if we can create a table
      await client.query(`
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Table creation successful!');
      
      // Test insert
      await client.query(`
        INSERT INTO test_table (message) VALUES ('Connection test successful')
      `);
      console.log('✅ Insert successful!');
      
      // Test select
      const selectResult = await client.query('SELECT * FROM test_table');
      console.log('✅ Select successful:', selectResult.rows);
      
      console.log('🎉 This connection string works!');
      await client.end();
      return connectionString;
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('Error code:', error.code);
    } finally {
      try {
        await client.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
  
  console.log('\n❌ None of the connection strings worked');
  return null;
}

testSupabaseConnection();

