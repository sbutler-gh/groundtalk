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

    console.log(event.queryStringParameters.id);

    // This is preparing the ID value, to make sure it will work in the Supabase function below — to only get messages with ID values greater than this one.
    let id = event.queryStringParameters.id.substring(0,23);

    let db = "messages";

    if (event.headers.referer.endsWith('/dev.html')) {
      db = "messages_dev"
      console.log('dev pull')
    }

    console.log(db);

      // id = new Date(id).getTime();

      console.log(id);

      if (id == 0) {
        id = new Date(0).toISOString();
        console.log(id);
      }

        // selecting all messages "greater than" the timestamp value, which means everything posted after the current timestamp
        let { data: messages, error } = await supabase
        .from(db)
        .select(`*,
          profiles(
            username
          )
        `)
        .gt('id', id);

        if (error) {
          console.log(error);
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          } else {
            console.log(messages);

            let swap = "";

            // here, we are preparing the HTML rendering of all the messages from the response, to return them as HTML.

            const map = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#x27;',
              "/": '&#x2F;',
          };

          const reg = /[&<>"'/]/ig;
                    
            for (var i= messages.length - 1; i >= 0; i--) {

            let message = ""

            let replyRef = messages[i].id

            let username = messages[i].profiles.username;

            messages[i].txt.replace(reg, (match)=>(map[match]));

            message = `<div id=${messages[i].id} ref=${messages[i].ref} class="post">`

            if (messages[i]?.ref) {
              var stringVariable = messages[i].ref;
              let parent = stringVariable.substring(0, stringVariable.lastIndexOf('-'));

              replyRef = messages[i].ref

              message = message + `<div class="parentSection"><button class="relation parent" onclick=showParent(event,'${parent}')>Show parent</button></div>`
            }

            let time = new Date(messages[i].id).toUTCString()

            message = message + `<span class="messageHead"><a class="by" href="${messages[i].by}">${username}</a><a href="#${messages[i].id}" class="ts">${time}</a></span>
            <p class="txt">${messages[i].txt}</p>
            <button class="toggle reply"  onclick=toggleReply(event);>Reply</button>
            <div class="repliesSection">
            <button class="relation children" onclick=showChildren(event,'${replyRef}')>Show replies</button>
            </div>
        </div>`

        swap = swap + message;

          }

          console.log(swap);

            return {
              statusCode: 200,
              body: (JSON.stringify(messages), swap)
            };
          }
  };