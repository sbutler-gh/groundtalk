require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // console.log('test');

    // console.log(event);

    let id = event.path.substring(1);

    console.log(id);

        let { data: message, error } = await supabase
        .from(db)
        .select(`*,
          profiles(
            username
          )
        `)
        .eq('id', id);

        if (error) {
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          } else {
            console.log(message);

            let message = ""

            let replyRef = message[0].id

            let username = message[0].profiles.username;

            message = `<div id=${message[0].id} ref=${message[0].ref} class="post">`

            if (message[0]?.ref) {
              var stringVariable = message[0].ref;
              let parent = stringVariable.substring(0, stringVariable.lastIndexOf('-'));

              replyRef = message[0].ref

              message = message + `<div class="parentSection"><button class="relation parent" onclick=showParent(event,'${parent}')>Show parent</button></div>`
            }

            let time = new Date(message[0].id).toUTCString()

            message = message + `<span class="messageHead"><a class="by" href="${message[0].by}">${username}</a><a href="#${message[0].id}" class="ts">${time}</a></span>
            <p class="txt">${message[0].txt}</p>
            <button class="toggle reply"  onclick=toggleReply(event);>Reply</button>
            <div class="repliesSection">
            <button class="relation children" onclick=showChildren(event,'${replyRef}')>Show replies</button>
            </div>
        </div>`
        
            return {
              statusCode: 200,
              body: (JSON.stringify(message), message)
            };
          }
}