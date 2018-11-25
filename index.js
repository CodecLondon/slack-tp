// First we need to import the HTTP module. This module contains all the logic
//for dealing with HTTP requests.
var http = require('http');

// Import express and request modules
// Express is a web application framework that allows us to set up a simple web server.
// It makes it easy to set up the routing logic we need for the requests we'll receive from Slack
var express = require('express');
// request is a convenient module to make HTTP calls. We'll use it to interact with Slack's web API
var request = require('request');


const bodyParser = require("body-parser");


// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to  store them securely in environment variables.
var clientId = '4239438880.476351642193';
var clientSecret = 'f57bb6760b887358c73c137b0d2e3317';

// Instantiates Express and assigns our app variable to it
var app = express();

// For some reason express needs you to tell it to use this json parser or it just sends you random internal crap
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// We define the port we want to listen to. Logically this has to be the same
//port than we specified on ngrok.
const PORT=4040;

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});
// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);
            }
        })
    }
});

// Send request to target process to
// Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
app.post('/command', function(req, res) {
    res.send('Your issue _*"'+ req.body.text + '"*_ has been added to Target Process for tracking!');
    console.log(req.body.text);
});
