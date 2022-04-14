//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
//const request = require('request');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_field: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]

  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us14.api.mailchimp.com/3.0/lists/c7c0415de8';

  const options = {
    method: 'POST',
    auth: 'john:d9de033b291fd985600509ff8c29005d-us141'
  };

  const request = https.request(url, options, (response) =>{

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on('data', (data) =>{
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post('/failure', (req,res) => {
  res.redirect('/');
});



app.listen(port, () => {
  console.log('Example app listening on port ${port}');
});

//API Key: d9de033b291fd985600509ff8c29005d-us14
