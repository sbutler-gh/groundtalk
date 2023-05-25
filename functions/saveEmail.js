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

    	// We are expecting last_name to be empty
	// If not, we've caught a bot!
	if (form.last_name) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				status: 500,
				message: "Honeypot triggered"
			})
		};
	}

    const { error } = await supabase
    .from("emails")
    .insert({email: form.email})
  
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } else {
    return {
      statusCode: 200
    };
  }
  };