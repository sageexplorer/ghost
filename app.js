var express    = require('express');
var bodyParser = require('body-parser');
var request    = require('request');
var shell      = require('shelljs');
var slack      = require('./callSlack');

require('dotenv').config();

"use strict";

var app = express();
var port = process.env.PORT || 8080;

//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Check Token for security
app.post('/', function (req, res) {

  if (req.body.token !== process.env.TOKEN){
    return res.status(401).send({ auth: false, message: 'No token or wrong token provided.' });
  }
  else {
    res.send("..")

    switch(req.body.text.toLowerCase()){
      case (/production/):{
        var testURL = process.env.PRODUCTION
        break;
      }
      case (/staging/):{
        var testURL = process.env.STAGING
        break;
      }
      case (/integration/):{
        var testURL = process.env.INTEGRATION
        break;
      }
      case (/redesign/):{
        var testURL = process.env.REDESIGN
        break;
      }
      default: {
        var testURL = process.env.STAGING
        break;
      }// last condition close
    }// switch statement close

    // POST TO SLACK //
    postToSlack(testURL,req.body.response_url, req.body.user_name, req.body.text)

    } //POST if/else close

    app.listen(port, function () {
      console.log('Listening on port ' + port);
    })

  });
