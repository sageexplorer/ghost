const axios = require('axios')

async function postToSlack(...args) {
  // POST to Slack, Ghost Inspector
  let ghost_url = args[0]
  let slack_url = args[1]
  let user_name = args[2]
  let body_text = args[3]

  if (await body_text.indexOf("help") >=0 ){
    var newText = "```--- HELP TOPIC --- \n" +
    "To run tests, simply type /test {env} where env is where you want to run tests, like /test staging or /test integration.\n" +
    "To ask for help, type /test help.```"
  } else {
    var newText = 'Test started by '+ user_name + ' is running on ' + body_text
  } //if/else close

  var headers = {
    'Content-type': 'application/json'
  }

  axios.post(slack_url, { headers }, {
    text: newText,
    response_type: "in_channel",
    json: true
  })
  .then(function (response) {
    axios(ghost_url)
  })
  .catch(function (error) {
    console.log(error);
  }); //axios close

}//func close

module.exports = postToSlack();
