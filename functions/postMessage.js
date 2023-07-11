require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    const form = querystring.parse(event.body);
    console.log(form);
    // console.log(form['email']);
    // console.log(form.email);

    const { data, error } = await supabase
    .from("messages")
    .insert({txt: form.txt})
    .select()
  
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } else {
    // let swap = `<p style="color: green"><em>Success!</em>
    let swap = `<div class="post">
    <p class="by">${data[0].by}
    <p class="ts">${data[0].ts}
    <p>${form.txt}
    </div>`;
    return {
      statusCode: 200,
      body: (JSON.stringify(data), swap)
    };
  }
  };