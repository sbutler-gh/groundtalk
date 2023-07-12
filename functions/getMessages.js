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

    console.log(event.queryStringParameters.ts);
    let ts = event.queryStringParameters.ts.substring(0,26);
    console.log(ts);

    // ts is 0 by default.  if it's *not* 0, that means there was message(s) found in the cache, and ts equals the timestamp of the latest message in the cache (#0 in the array)

    if (ts != 0) {

        // selecting all messages "greater than" the timestamp value, which means everything posted after the current timestamp
        let { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .gt('ts', ts);

        if (error) {
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          } else {
            console.log(messages);
        
            let swap = "";
        
            for (var i= messages.length - 1; i >= 0; i--) {
                swap = swap + `<div id=${messages[i].id} class="post">
                    <p class="by">${messages[i].by}
                    <p class="ts">${messages[i].ts}
                    <p class="txt">${messages[i].txt}
                </div>`
            }
        
            return {
              statusCode: 200,
              body: (JSON.stringify(messages), swap)
            };
          }

    }

    // if ts=0 (default value), we retrieve all the messages from the database
    else {
        let { data: messages, error } = await supabase
        .from('messages')
        .select('*')

        if (error) {
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          } else {
            console.log(messages);
        
            let swap = "";
        
            for (var i= messages.length - 1; i >= 0; i--) {
                swap = swap + `<div id=${messages[i].id} class="post">
                    <p class="by">${messages[i].by}
                    <p class="ts">${messages[i].ts}
                    <p class="txt">${messages[i].txt}
                </div>`
            }
        
            return {
              statusCode: 200,
              body: (JSON.stringify(messages), swap)
            };
          }
    }

  };