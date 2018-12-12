const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const shell = require('shelljs');
const slack = require('./callSlack');

require('dotenv').config();

('use strict');

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

//Check Token for security
app.post('/', function(req, res) {
  var text = req.body.text.toLowerCase();

  if (req.body.token !== process.env.TOKEN) {
    return res.status(401).send({ auth: false, message: 'No token or wrong token provided.' });
  } else {
    res.send('..');

    if (text.includes('redesign') && text.includes('staging')) {
      var testURL = process.env.REDESIGN_STAGING;
    } else if (text.includes('redesign') && text.includes('production')) {
      var testURL = process.env.REDESIGN_PRODUCTION;
    } else if (text.includes('redesign') && text.includes('integration')) {
      var testURL = process.env.REDESIGN_INTEGRATION;
    } else if (text.includes('integration')) {
      var testURL = process.env.INTEGRATION;
    } else if (text.includes('staging')) {
      var testURL = process.env.STAGING;
    } else if (text.includes('production')) {
      var testURL = process.env.PRODUCTION;
    } else {
      var testURL = undefined;
    }

    postToSlack(testURL, req.body.response_url, req.body.user_name, req.body.text);
  }

  // Ability to run Mocha tests(API) from here -->
  app.post('/api', function(req, res, next) {
    res.send('..');
    process.env['TEST_ENVIRONMENT'] = req.body.text;
    shell.exec('mocha');
    postToSlack(testURL, req.body.response_url, req.body.user_name, req.body.text);
  });

  // Ability to check console error from here -->
  app.post('/console', function(req, res) {
    res.send('..');
    let error = shell.exec(`curl --silent ${process.env.ERROR_URL}  | jq '.data[].console[].output' | egrep 'error|Error|Failed|failed' |sort|uniq`)
    postToSlack(testURL, req.body.response_url, req.body.user_name, error);
  });

  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
