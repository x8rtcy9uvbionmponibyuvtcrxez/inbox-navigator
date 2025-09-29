const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.jryyzhofxzjkmkpammct:79H76pkeBzsD_sn@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=disable'
});

async function createTable() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    await client.query('CREATE TABLE IF NOT EXISTS "Ping" (id TEXT PRIMARY KEY, message TEXT DEFAULT \'ok\', created_at TIMESTAMP DEFAULT NOW())');
    console.log('✅ Created Ping table');
    
    const result = await client.query('INSERT INTO "Ping" (id, message) VALUES ($1, $2) RETURNING *', ['test-123', 'hello world']);
    console.log('✅ Inserted test row:', result.rows[0]);
    
    const select = await client.query('SELECT * FROM "Ping"');
    console.log('✅ Selected rows:', select.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createTable();
