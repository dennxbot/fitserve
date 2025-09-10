const { supabaseAdmin } = require('../config/supabaseClient');

async function testWeightEntriesSchema() {
  console.log('🔍 Testing weight_entries table schema...\n');
  
  try {
    // Test 1: Check if we can query basic columns
    console.log('✅ Test 1: Basic columns (id, user_id, weight, recorded_at, created_at)');
    const { data: basicData, error: basicError } = await supabaseAdmin
      .from('weight_entries')
      .select('id, user_id, weight, recorded_at, created_at')
      .limit(1);
    
    if (basicError) {
      console.log('❌ Failed:', basicError.message);
    } else {
      console.log('✅ Success: Basic columns accessible');
    }
    
    // Test 2: Check notes column
    console.log('\n✅ Test 2: Notes column');
    const { data: notesData, error: notesError } = await supabaseAdmin
      .from('weight_entries')
      .select('notes')
      .limit(1);
    
    if (notesError) {
      console.log('❌ Notes column not available:', notesError.message);
      console.log('💡 Run manual migration to add notes column');
    } else {
      console.log('✅ Success: Notes column accessible');
    }
    
    // Test 3: Check updated_at column
    console.log('\n✅ Test 3: Updated_at column');
    const { data: updatedData, error: updatedError } = await supabaseAdmin
      .from('weight_entries')
      .select('updated_at')
      .limit(1);
    
    if (updatedError) {
      console.log('❌ Updated_at column not available:', updatedError.message);
      console.log('💡 Run manual migration to add updated_at column');
    } else {
      console.log('✅ Success: Updated_at column accessible');
    }
    
    // Test 4: Test complete schema
    console.log('\n✅ Test 4: Complete schema');
    const { data: fullData, error: fullError } = await supabaseAdmin
      .from('weight_entries')
      .select('*')
      .limit(1);
    
    if (fullError) {
      console.log('❌ Full schema test failed:', fullError.message);
    } else {
      console.log('✅ Success: Full schema accessible');
      if (fullData && fullData.length > 0) {
        console.log('📊 Sample record structure:');
        const sample = fullData[0];
        Object.keys(sample).forEach(key => {
          console.log(`   - ${key}: ${typeof sample[key]} (${sample[key] ? 'has value' : 'null'})`);
        });
      }
    }
    
    console.log('\n🎉 Schema validation completed!');
    
  } catch (error) {
    console.error('💥 Schema test failed:', error);
  }
}

if (require.main === module) {
  testWeightEntriesSchema()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { testWeightEntriesSchema };
