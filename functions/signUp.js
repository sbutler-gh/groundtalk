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
			statusCode: 505,
			body: JSON.stringify({
				status: 505,
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
              email: form.email,
              location: form.location,
              project: "groundtalk"
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

    let swap = `
    <div class="swap" style="max-width: 600px; margin: auto;">
  <h2>Welcome!</h2>

  <p><em><strong>${data.user.email}</strong><br> registered at ${data.user.email_confirmed_at}</em></p>
  <p>The power of the Internet is our communities.  If we want to change stories, build movements, and connect, we have to grow <em>us</em> again.</p>

  <p>So ask others to join this with you —&nbsp;because <strong><em>you lead it too.</em></strong></p>
  
  <p><strong>And that's why this will be different.</strong></p>
  
  <p><button onclick="copyContent()">Invite people you want</button> involved, and share with your folks on <a href="mailto:">email</a>, <a>Twitter</a>, <a>LinkedIn</a>, <a>Mastodon</a>, and <a>Reddit</a>. </p>
  
  <p>Want to introduce and connect with others who are interested?  Join the <a href="">chat forum.</a></p>
  
  <p>Want to help build a library of resources — stories, games, events, education, tools, art, collections —&nbsp;to back them up for resiliency?  <a href="">Add to the library.</a></p>

  </div>

  <script>
  let text = document.getElementById('share-text').innerText;
  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
</script>
`
    return {
      statusCode: 200,
      body: (JSON.stringify(data), swap)
    };
  }
  };