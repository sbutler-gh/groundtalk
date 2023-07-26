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

    const { data: message, error } = await supabase
    .from("messages")
    .insert({id: id, txt: form.txt, ref: form?.ref, by: form?.by, by_id: form?.by_id})
    .select()
  
  if (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } else {
    // let swap = `<p style="color: green"><em>Success!</em>

    let username = message[0].by.match(/^([^@]*)@/)[1];

    let swap;
    let reply;

    if (message[0].ref == "null") {

      swap = `<div id=${message[0].id} ref=${message[0].ref} class="post">
          <p class="by" user="${message[0].by_id}">${username}
          <p class="txt">${message[0].txt}
          <p class="ts">${message[0].id}</p><br>
          <button class="toggleReply" onclick=toggleReply(event);>Reply</button>
          <button class="relation children" onclick='showChildren(event,'${message[0].id}')'>Show children</button>
      </div>
      `
    }
    else {

      reply = 1;

      var stringVariable = message[0].ref;
      let parent = stringVariable.substring(0, stringVariable.lastIndexOf('-'));
      
      swap = `<div id=${message[0].id} ref=${message[0].ref} class="post">
    <button class="relation parent" onclick=showParent(event,'${parent}')>Show thread</button>
          <p class="by" user="${message[0].by_id}">${username}
          <p class="txt">${message[0].txt}
          <p class="ts">${message[0].id}</p><br>
          <button class="toggleReply" onclick=toggleReply(event);>Reply</button>
          <button class="relation children" onclick=showChildren(event,'${message[0].ref}')>Show repliess</button>
      </div>
      `
    }

    return {
      statusCode: 200,
      body: (JSON.stringify(message), reply, swap)
    };
  }
  };