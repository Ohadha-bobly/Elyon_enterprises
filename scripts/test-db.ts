// test-db.ts
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env or .env.local
dotenv.config({ path: './.env' }); // change to './.env.local' if you use that

// Grab Supabase credentials from env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in your environment variables.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection and count rows in the 'users' table
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');

    const { data, count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact' }); // count all rows

    if (error) throw error;

    console.log('✅ Supabase connection successful!');
    console.log(`✅ Users table has ${count} rows`);
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    process.exit(1);
  }
}

// Run the test
testConnection();
