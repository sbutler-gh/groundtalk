require('dotenv').config();
const querystring = require('querystring');


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// get current latest index
// next
// if error/conflict, try again .. keep trying
// send email, with html — open link, respond in page.

// groups is different case

exports.handler = async (event) => {

    let to_email_decode = "";

    let email = "samabc@gt.sambutler.us"
    let message_id = new Date().toISOString();
    // let ref_value = "null";
    // let txt_value = "null";

    let ref_value = "2023-08-04T09:00:32.822+00:00-2-2"
    let txt_value = "0-2-2-10";

    let { data, error } = await supabase
  .rpc('insert_dev_message_username_fn', {
    message_id, 
    email, 
    ref_value, 
    txt_value
  })

  // let { data, error } = await supabase
  // .rpc('get_uuid_from_email_or_create_user', {
  //   email
  // })

  if (error) console.error(error)
else console.log(data)


// if (error) console.error("error" + error)
// else console.log("data" + data)

    // return {
    //   statusCode: 200,
    //   body: (JSON.stringify(message), reply, swap)
    // };
  };

      // if (to_email_decode is timestamp) {
    //     // top-level reply
    //     // check how many others satisfy regex = new RegExp(/:00-\d+$/i);
    //     // add suffix

    //     // -1
    //     // -2
    //     // -3
    //     // -4
    //     // -5
    // }

    // else {
    //     // not top-level reply
    //     // parent is 2023-08-02T20:50:31.521+00:00-1-4-3

        
    //     // parent is 2023-08-02T20:50:31.521+00:00-1-4

    //     // parent is 2023-08-02T20:50:31.521+00:00-4-5

    //     // parent is 2023-08-02T20:50:31.521+00:00-4-1-2

    //     // drop integer and last dash, count how many
    // }