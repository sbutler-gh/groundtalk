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
    // console.log(event.httpMethod);
    let ts = event.queryStringParameters.ts.substring(0,26);
    console.log(ts);

    if (ts != 0) {

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
                swap = swap + `<div class="post">
                    <p class="by">${messages[i].by}
                    <p class="ts">${messages[i].ts}
                    <p>${messages[i].txt}
                </div><br>`
            }
        
            return {
              statusCode: 200,
              body: (JSON.stringify(messages), swap)
            };
          }

    }
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
                swap = swap + `<div class="post">
                    <p class="by">${messages[i].by}
                    <p class="ts">${messages[i].ts}
                    <p>${messages[i].txt}
                </div><br>`
            }
        
            return {
              statusCode: 200,
              body: (JSON.stringify(messages), swap)
            };
          }
    }

  };