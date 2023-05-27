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
    form.username = form.email.match(/^([^@]*)@/)[1];
    console.log(form.username);

    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    let password = generatePassword();
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

    const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: password,
        options: {
            data: {
              username: form.username,
              email: form.email
            }
          }
      })
      
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } else {
    console.log(JSON.stringify(data))
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  }
  };