require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',
  },
})

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    console.log('test');

    const form = querystring.parse(event.body);
    console.log(form.email);

    const { user, session, error } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: {
            emailRedirectTo: 'http://localhost:8888/feed.html',
          },
      })

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(error),
        };
      } else {
        console.log(JSON.stringify(user))
        let swap = `<p style="color: green">Check email for link</p>`

        return {
            statusCode: 200,
            body: (JSON.stringify(user), swap)
          };
      }
    }