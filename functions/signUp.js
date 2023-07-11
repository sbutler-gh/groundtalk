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

    let copy_text = `We need low and resilient infrastructures.  We need our own social media and networks, if we want them.

    And we need to organize to make it happen.
    
    Want a network for ourselves — built for low-energy and resilience, led by workers and people, in service of the worlds we want to make?
    
    Join to get involved, at one of the smallest websites on the Internet:
    
    https://groundtalk.land`;

    let swap = `
    <div class="swap" style="max-width: 600px; margin: auto;">
  <h2>Welcome!</h2>

  <p><em><strong>${data.user.email}</strong><br> registered at ${data.user.email_confirmed_at}</em></p>
<p>The power of the Internet is our communities.  If we want to change stories, build movements, and connect, we have to grow <em>us</em> again.

<p>So invite others who you want to be involved — because <strong><em>you lead this too.</em></strong>

<p><strong>And that's why this will be different.</strong>

<p style="line-height:29px">You can invite people via <a href="mailto:?subject=A%20low-tech%20social%20media%20cooperative%2C%20want%20to%20join%3F&body=This%20is%20a%20cool%20project%20I%20found%20%E2%80%93%20https%3A%2F%2Fgroundtalk.land.%20%20Here%20are%20more%20details%2C%20anybody%20can%20join%2C%20and%20I%20wanted%20to%20invite%20some%20people%20who%20I%20want%20to%20be%20part%20of%20this%20...%0A%0AWe%20need%20low%20and%20resilient%20infrastructures.%20%20We%20need%20our%20own%20social%20media%20and%20networks%2C%20if%20we%20want%20them.%0A%0AAnd%20we%20need%20to%20organize%20to%20make%20it%20happen.%0A%0AWant%20a%20network%20for%20ourselves%20%E2%80%94%20built%20for%20low-energy%20and%20resilience%2C%20led%20by%20workers%20and%20people%2C%20in%20service%20of%20the%20worlds%20we%20want%20to%20make%3F%0A%0AJoin%20to%20get%20involved%2C%20at%20one%20of%20the%20smallest%20websites%20on%20the%20Internet%3A%0A%0Ahttps%3A%2F%2Fgroundtalk.land">✉️ email</a>, 
  <a target="_blank" href="https://twitter.com/sambutlerUS/status/1674486797756145687">🐦 Twitter</a>, <a href="https://kolektiva.social/@sambutlerUS/110629019246561817" target="_blank">🐘 Mastodon</a>, <a href="">Facebook</a>, or <button onclick="copyContent()">copy an invite message</button> to post anywhere.</p>

<p>💬 Want to introduce and connect with others involved?  <a href="https://www.linen.dev/s/people/c/welcome">Join the chat</a> — <em>1000x lighter than Slack!</em>

<p>📚 Want to help build a library of resources — stories, games, events, education, tools, art, collections, proposals, and more?  <a href="https://docs.google.com/spreadsheets/d/1oaA7dLz8Scv3mH42Jq_jjfDLvKk4D3umrCArQomqMCE/edit?usp=sharing">Go to the library.</a>
<br>
<br>
`
    return {
      statusCode: 200,
      body: (JSON.stringify(data), swap)
    };
  }
  };