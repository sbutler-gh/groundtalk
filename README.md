# groundtalk

Here is for the [home page](public/index.html) and the [app page](public/feed.html).  In the functions folder, you can find the code for the functions and requests to the DB.  Made with HTMX, Supabase, and Netlify functions, and hosted on Netlify.

## Active pages in this respository

public/index.html, public/dev.html, functions/getMessages.js, functions/postMessage.js, functions/signInWithOtp, functions/signInWithRefreshToken, functions/UpdateUsername

(there are some other files in the repository, referencing works in development)

## Architecture

Here is a screenshot which explains the architecture.  You have two types of messages: top-level posts, which have a ref value of **null**, and other posts which have a **ref** value — meaning it's a reply under some other post.

![groundtalk-db](https://github.com/sbutler-gh/groundtalk/assets/46165064/32524d5b-4f9f-4ffa-850d-b5ff295fa4f2)

The reason it's structured this way, is because it supports retrieving nested discussions directly from the HTML content on the page — it doesn't require any further trips to the database.

**Timestamptz as unique id:** When you load https://groundtalk.land/, it checks if you have any posts previously saved in localStorage.  It finds the timestamp value (a div attribute) of the latest post, and then only retrieves newer messages than that from the backend.  That gives an idea about how the app currently works.

Using timestamptz as unique id is a choice for minimalism, which may not be "correct", but I think it's a design constraint that's interesting to explore further.  Minimalism and conviviality is a higher priority in this context than chance of collisions, which could hopefully be mitigated if two posts ever occurred at the same millisecond anyway?  Another reason for timestamptz over a snowflake format is the human readability of it, which has benefits in its own right I think (e.g. in offline or low-energy settings, to interact with the data without requiring it to be parsed).

Here's the link to the post on the live page displayed in this screenshot above.  You might need to load the content of the page, before the anchor tag works.

https://groundtalk.land/#2023-08-21T09:59:52.795+00:00

You can then click "Show replies" to see the nested comment tree, and "Show parent" on any of the comments to see the parent.

Here's a quick demo.  Basically a hacker news like UI, except it doesn't require any further trips to the backend to load discussions because it's all in the hypermedia and stored locally.


https://github.com/sbutler-gh/groundtalk/assets/46165064/0c40f448-bd31-4128-bf58-72708be8b971

