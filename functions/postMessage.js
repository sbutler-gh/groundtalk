require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// get current latest index
// next
// if error/conflict, try again .. keep trying

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    const form = querystring.parse(event.body);
    console.log(form);

    // console.log(form.id);

    // let id = form.id;

    let id = new Date().toISOString();

    console.log(id);

    const { data, error } = await supabase
    .from("messages")
    .insert({id: id, txt: form.txt, ref: form?.ref})
    .select()
  
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } else {
    // let swap = `<p style="color: green"><em>Success!</em>

    let swap = `<div id=${data[0].id} ref=${data[0].ref} class="post">
    <p class="by">${data[0].by}
    <p class="ts">${data[0].id}
    <p class="txt">${form.txt}</p><br>
    <button onclick=toggleReply(event);>Reply</button>
    </div>`;

    return {
      statusCode: 200,
      body: (JSON.stringify(data), swap)
    };
  }
  };