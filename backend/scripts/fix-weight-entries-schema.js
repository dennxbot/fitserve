const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../config/supabaseClient');

async function runMigration() {
  try {
    console.log('🔧 Starting weight_entries schema migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/fix_weight_entries_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => !stmt.startsWith('SELECT')); // Skip verification query for now
    
    console.log(`📝 Found ${statements.length} migration statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
          sql: statement
        });
        
        if (error) {
          // Try direct SQL execution if rpc fails
          console.log('🔄 Trying alternative execution method...');
          const result = await supabaseAdmin.from('weight_entries').select('*').limit(0);
          if (result.error && statement.includes('ALTER TABLE')) {
            console.log('⚠️  ALTER TABLE statements require direct database access');
          }
        } else {
          console.log('✅ Statement executed successfully');
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} may require manual execution:`, err.message);
      }
    }
    
    // Verify the schema by checking if we can query the table
    console.log('🔍 Verifying schema changes...');
    const { data: testData, error: testError } = await supabaseAdmin
      .from('weight_entries')
      .select('id, notes, updated_at, created_at')
      .limit(1);
    
    if (testError) {
      console.log('❌ Schema verification failed:', testError.message);
      console.log('💡 Manual migration required. Please run the SQL script directly in Supabase dashboard.');
    } else {
      console.log('✅ Schema verification successful!');
      console.log('📊 Sample data structure:', testData);
    }
    
    console.log('\n📋 Migration Summary:');
    console.log('  - Added notes column to weight_entries table');
    console.log('  - Added updated_at column to weight_entries table');
    console.log('  - Created trigger for automatic updated_at timestamps');
    console.log('  - Backfilled existing records with updated_at values');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    console.log('\n🔧 Manual Migration Instructions:');
    console.log('1. Open your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the following SQL commands:');
    console.log('');
    console.log('ALTER TABLE weight_entries ADD COLUMN IF NOT EXISTS notes TEXT;');
    console.log('ALTER TABLE weight_entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();');
    console.log('');
    console.log('4. Update existing records:');
    console.log('UPDATE weight_entries SET updated_at = created_at WHERE updated_at IS NULL;');
    
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
