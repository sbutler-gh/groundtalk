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

    let db = "messages";

    if (event.headers.referer.endsWith('/dev.html')) {
      db = "messages_dev"
    }
  
    const form = querystring.parse(event.body);
    console.log(form);

    // console.log(form.id);

    // let id = form.id;

    let id = new Date().toISOString();

    console.log(id);

    const { data: message, error } = await supabase
    .from(db)
    .insert({id: id, txt: form.txt, ref: form?.ref, by: form?.by})
    .select()
  
  if (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } else {

    let username = form.username;
    let swap = `<div id=${message[0].id} ref=${message[0].ref} class="post">`
    let replyRef = message[0].id
    let reply;
    let time = new Date(message[0].id).toUTCString()

    if (message[0]?.ref) {

      reply = 1;

      replyRef = message[0]?.ref;
      let parent = replyRef.substring(0, replyRef.lastIndexOf('-'));

      swap = swap + `<button class="relation parent" onclick=showParent(event,'${parent}')>Show parent</button> `
    }

    swap = swap + `<span class="messageHead"><a class="by" href="${message[0].by}">${username}</a><a href="#${message[0].id}" class="ts">${time}</a></span>
    <p class="txt">${message[0].txt}</p>
    <button class="toggle reply"  onclick=toggleReply(event);>Reply</button>
    <div class="repliesSection">
    <button class="relation children" onclick=showChildren(event,'${replyRef}')>Show replies</button>
    </div>
</div>`

    return {
      statusCode: 200,
      body: (JSON.stringify(message), reply, swap)
    };
  }
  };