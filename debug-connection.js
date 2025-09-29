require('dotenv').config();
const { Client } = require('pg');

async function debugConnection() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Connection string:', connectionString);
  
  // Parse the connection string manually
  const url = new URL(connectionString);
  console.log('Parsed URL:');
  console.log('  Protocol:', url.protocol);
  console.log('  Hostname:', url.hostname);
  console.log('  Port:', url.port);
  console.log('  Username:', url.username);
  console.log('  Password:', url.password ? '[HIDDEN]' : 'none');
  console.log('  Database:', url.pathname.substring(1));
  console.log('  Search params:', url.search);
  
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('\nTesting database connection...');
    await client.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query successful:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await client.end();
  }
}

debugConnection();
