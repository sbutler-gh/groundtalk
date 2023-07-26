require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    // console.log(event);

    // console.log('test');

    const form = event.queryStringParameters;
    console.log(form.username)
    console.log(form.email)
    console.log(form.id)


    const { data, error } = await supabase
    .from('profiles')
    .update({ username: form.username })
    .eq('email', form.email)

      if (error) {
        console.log(error);

        return {
          statusCode: 500,
          body: JSON.stringify(error),
        };
      } else {
        console.log(JSON.stringify(data))
        return {
            statusCode: 200,
            body: (JSON.stringify(data))
          };
      }
    }