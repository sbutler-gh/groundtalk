require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    console.log(event);

    console.log('test');

    // When we hit this endpoint, it's because a user is signing up via magic link.
    // If it's a first-time user, we also need to give them a username to submit to the backend.
    // This seems to work when signing in again with the same user, without resetting the username — not exactly sure why, but it works okay.
    const form = querystring.parse(event.body);
    console.log(form.email);
    form.username = form.email.substring(0, form.email.indexOf("@"));
    let random = (+new Date * Math.random()).toString(36).substring(0,4);
    form.username = form.username + random;
    console.log(form.username);

    console.log(event.headers.referer);


    const { user, session, error } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: {
            emailRedirectTo: event.headers.referer,
            data: {
              username: form.username,
              email: form.email,
            }
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