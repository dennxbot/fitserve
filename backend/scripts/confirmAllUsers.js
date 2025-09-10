const { supabaseAdmin } = require('../config/supabaseClient');

async function confirmAllUsers() {
  try {
    console.log('Fetching all users...');
    
    // Get all users
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError.message);
      return;
    }
    
    console.log(`Found ${users.users.length} users`);
    
    // Confirm email for all unconfirmed users
    for (const user of users.users) {
      if (!user.email_confirmed_at) {
        console.log(`Confirming email for user: ${user.email}`);
        
        const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.error(`Failed to confirm ${user.email}:`, confirmError.message);
        } else {
          console.log(`✅ Confirmed email for ${user.email}`);
        }
      } else {
        console.log(`✅ Email already confirmed for ${user.email}`);
      }
    }
    
    console.log('\nEmail confirmation process completed!');
  } catch (error) {
    console.error('Script error:', error.message);
  }
}

confirmAllUsers();