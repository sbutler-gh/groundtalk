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
        .from('messages')
        .select('*')
        .eq('id', id);

        if (error) {
            return {
              statusCode: 500,
              body: JSON.stringify(error),
            };
          } else {
            console.log(message);

            // return {
            //     statusCode: 200,
            //     body: JSON.stringify(message)
            //   };

            let swap = `<style>
            div.post {
                background: lightyellow; padding: 1em; border: solid 1px darkgrey; border-radius: 10px; width: 300px; max-width: 100%; margin-bottom: 0.75em;
            }
            p.by {
                font-weight: 600;
            }
            p.ts {
                font-style: italic;
                font-size: 12px;
            }
            </style>
            <div id=${message[0].id} class="post">
            <p class="by">${message[0].by}
            <p class="ts">${message[0].ts}
            <p class="txt">${message[0].txt}
            </div>`
        
            // let swap = "";
        
            // for (var i= messages.length - 1; i >= 0; i--) {
            //     swap = swap + `<div id=${messages[i].id} class="post">
            //         <p class="by">${messages[i].by}
            //         <p class="ts">${messages[i].ts}
            //         <p class="txt">${messages[i].txt}
            //     </div>`
            // }
        
            return {
              statusCode: 200,
              body: (JSON.stringify(message), swap)
            };
          }
}