import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rhdstfwxovfvuaggjduo.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-wvcuqUEVKiy2aGJ1Bri8Q_6M6KUAu-';
const supabase = createClient(supabaseUrl, supabaseKey);

const users = [
  { email: 'hernanmnavarro@gmail.com', password: '0303456' },
  { email: 'francescoaraujo10@gmail.com', password: '0303456' },
  { email: 'bovettinicolas@gmail.com', password: '0303456' },
  { email: 'superadmin@fiestadedisfracesfdz.com.ar', password: '0303456@Fie' }
]

async function run() {
  for (const u of users) {
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
    })
    if (error) {
      console.log('Error creating', u.email, error.message)
    } else {
      console.log('Created', u.email)
    }
  }
}
run();
