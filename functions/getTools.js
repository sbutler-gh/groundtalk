require('dotenv').config();
const querystring = require('querystring');
const fetch = require('node-fetch')
const { Headers } = fetch;


exports.handler = async (event) => {

      const response = await fetch('https://docs.getgrist.com/api/docs/iHLyPNfU5aPQwgwUNQqVKn/tables/Table1/records', { 
    method: 'GET', 
    headers: new Headers({
        'Authorization': 'Bearer d309e3c6db65f8af45e7836edf7f0f2980088ca1'
    })
});

  const res = await response.json();
  let table = res.records;

  let html = ``;

  table.forEach(record => {

    if (record.fields?.live == 1) {
    let recordHTML = `<div id=${record.id}>
    <h3 class="name"><a href="${record.fields.website}">${record.fields.name}</a></h3>
    <div class="tags">
    `

    console.log(record.fields?.tags);

    record.fields?.tags.shift();

    record.fields?.tags.forEach(tag => {
        recordHTML = recordHTML + `<span>${tag}</span>`
    });

    let regex = /(?<!(href=\")|(\>))(https?:\/\/.+\b)/gi;
    console.log(record.fields.description);
    record.fields.description = record.fields.description.replace(/(?<!(href=\")|(\>))(https?:\/\/.+\b)/gi, `<a href="$1">$1</a>`);
    // record.fields.how_to_use = record.fields.how_to_use.replace(/(?<!(href=\")|(\>))(https?:\/\/.+\b)/gi, `-`);
    record.fields.how_to_use = record.fields.how_to_use.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img, '<a href="$1">$1</a>');

    console.log(record.fields.how_to_use);

    recordHTML = recordHTML + `</div>
    <p>${record.fields.description}</p>
    <p><em>How to use</em></p>
    <p>${record.fields.how_to_use}</p>
    </div>`

    html = html + recordHTML;
    }
  })

//   console.log(table);
//   console.log(table.tables[0].fields)


            return {
              statusCode: 200,
              body: (JSON.stringify(res), html)
            };
  };