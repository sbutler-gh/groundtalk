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
              latlng: JSON.parse(form.latlng)
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

    let swap = `<script onload="renderCalendar();" src='https://cdn.jsdelivr.net/npm/fullcalendar/index.global.min.js'></script>
    <script onload="renderCalendar();" src='https://cdn.jsdelivr.net/npm/@fullcalendar/google-calendar@6.1.8/index.global.min.js'></script>
    <!-- <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/icalendar@6.1.8/index.global.min.js'></script> -->
    <script type='text/javascript'  type="module">

    console.log('blah')
      
        function renderCalendar() {

          console.log('rendercalendar')
      
          const calendarEl = document.getElementById('calendar')
          console.log('rendering');
      
          var calendar = new FullCalendar.Calendar(calendarEl, {
            googleCalendarApiKey: '${process.env.GOOGLE_CALENDAR_API_KEY}',
            // initialView: 'listWeek',
            eventSources: [
              {
                googleCalendarId: '72dh5ehol3oufbkusqagta0qf8@group.calendar.google.com'
              },
              // {
              // url: 'https://350santafe.org/events/?ical=1.ics',
              // format: 'ics'
              // }
              // {
              //   googleCalendarId: 'efgh5678@group.calendar.google.com',
              //   className: 'nice-event'
              // }
            ],
            eventMouseEnter: function(info) {
  
              const popup = document.getElementById('popup');

              let title = info.event.title;
              let start = info.event.start;
              let description = info.event.extendedProps.description;
              let left = info.jsEvent.pageX;
              let top = info.jsEvent.pageY
              
              popup.innerHTML = "<h4>" + title + "</h4><sub-title><em>" + start + "</em></sub-title><p>" + description + "</p>"
  
                Object.assign(popup.style, {
              left: left + "px",
              top: top + "px",
              display: 'block'
              })
  
              console.log(popup);
              },
          });
      
          calendar.render();
        }

              
      document.addEventListener('DOMContentLoaded', function() {

        console.log('loaded');
            
        renderCalendar();

    });
      </script>
  </head>
  <body>
    <main>
  <h2>You're in!</h2>

  <p><em><strong>${data.user.email}</strong><br> registered at ${data.user.email_confirmed_at}</em></p>
  
  <p>Whatever this becomes, you're part of it now.</p>
  
  <p>The power in Twitter was our communities.  If we want to change stories, cultures, and narratives – for the worlds we want to live in — we have to build that again.
      
  <p>So ask others to join this with you — because you own it too.
  
    <p>And that's why this will be different.</p>
  
    <p>Here's the text you can share with others — on social media, email, text, posters — to help them find this cooperative and make this happen together:
  
  <p>And here are some examples of what this could look like:
    
    <h3>Events</h3>
  
        <div id='calendar'></div>
        <div id="popup"></div>
  
        <p>Have calendars for events or groups, organizations, actions you want to share?  Just add the link <a>here!</a></p>
  
  
    <h3>Resources</h3>
  
    <div class="cards-container">
    <!-- <iframe src="https://threadreaderapp.com/thread/1570122141525512192.html"></iframe> -->
    <div class="card">
      <h4>Hugelkultur Bed Tutorial
        <sub-title>by @TheLastFarm</sub-title>
      </h4>
    </div>
  
    <div class="card">
      <h4>DIY Air Filter Build
        <!-- <sub-title>via Instructables</sub-title> -->
      </h4>
    </div>
  
    <div class="card">
      <h4>Ecosocial Game
        <!-- <sub-title>via Instructables</sub-title> -->
      </h4>
    </div>
  
    <div class="card">
      <h4>DIY Solar Water Heater Build
        <sub-title>by OpenSourceLowTech.org</sub-title>
      </h4>
    </div>
  
    <div class="card">
      <h4>Open-source Trash Recycler
        <sub-title>by Sam Smith (Magic Tool Bus)</sub-title>
      </h4>
    </div>
  <br>
  
  <p>Have resources you would add?  Put the details <a>here!</a></p>
  
    <a href="">Add a resource</a>
  
    </div>
  
    <h3>Education + Curriculums</h3>
  
    <div class="cards-container">
  
      <div class="card">
        <h4>Community Mapping Workshop
          <sub-title>Introduction to Bioregions and Local Watersheds</sub-title>
        </h4>
      </div>
  
    <div class="card">
      <h4>Community Mapping Workshop
        <sub-title>Introduction to Bioregions and Local Watersheds</sub-title>
      </h4>
    </div>
  
    <div class="card">
      <h4>Grassroots Theatre Workshop
        <sub-title>Introduction to Bioregions and Local Watersheds</sub-title>
      </h4>
    </div>
  
    <div class="card">
      <h4>Anti-Racist Facilitation Guide for Co-op Development
        <sub-title>by Solidarity Resource</sub-title>
      </h4>
    </div>
    
    </div>
  
    <br>
  
    <p>Have curriculums or educational items you would add or suggest? Put the details <a>here!</a></p>
  
    <a href="">Add a resource</a>
  
    <h3>Organizing locally, regionally, and beyond</h3>
  
    <p>Have your own ideas to share?  Paste them below.
  
  
  
  <p>In terms of next steps, once enough people have signed up with interest, we'll probably organize some online events to gather and connect further.</p>
  
  
  
  <p>Like, you'll</p>
  
  <p>The power in Twitter was our communities.  The power in streaming was expanding our access to art and stories.</p>
  
  <p>Whatever this becomes, you're part of it now.</p>`

    return {
      statusCode: 200,
      body: (JSON.stringify(data), swap)
    };
  }
  };