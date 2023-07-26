require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
      }

    console.log('test');

    console.log(event.queryStringParameters.refresh_token);
    // console.log(event.queryStringParameters.access_token);

    let refresh_token = event.queryStringParameters.refresh_token;

    // const { data, error } = await supabase.auth.exchangeCodeForSession(event.queryStringParameters.access_token)

    // const { user, session, error } = await supabase.auth.signIn({
    //     refreshToken: event.queryStringParameters.refresh_token,
    //   });

    const { data, error } = await supabase.auth.refreshSession({ refresh_token })
    const { session, user } = data

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(error),
        };
      } else {
        console.log(JSON.stringify(user))
        let result = {
            access_token: session.access_token,
            id: user.id,
            email: user.email,
            username: user.user_metadata.username
         }
         console.log(result);

        return {
            statusCode: 200,
            body: (JSON.stringify(session))
          };
      }
    }