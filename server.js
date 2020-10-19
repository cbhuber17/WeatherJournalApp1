// Local server to allow an app to run locally in a browser
// Servers receive requests, processes them and returns a response

// API endpoint for this project
// This will hold all of the data for each weather API call and journal entry
let projectData = [];

// Use express to build web apps and APIs
// Easy access to web application settings like port numbers
// HTTP routes and requests
// Allows middleware to be integrated
const express = require('express');

// The app of this project will use express
const app = express();

// Body parser is middleware (to handle HTTP POST request)
// This extracts the entire body portion of an incoming request stream and exposes it on req.body.
// Helps parse things like strings and json so the servers can talk to each other
const bodyParser = require('body-parser');

// Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
// and exposes the resulting object (containing the keys and values) on req.body.
// Parses data that is passed through routes on the server
app.use(bodyParser.urlencoded({ extended: false }));

// Of course we will use JSON format in JS!
app.use(bodyParser.json());

// CORS allows communication across the web
// CORS is a mechanism which aims to allow requests made on behalf of you and at the same time block some requests made by
// rogue JS and is triggered whenever you are making an HTTP request to:
// - a different domain (eg. site at example.com calls api.com)
// - a different sub domain (eg. site at example.com calls api.example.com)
// - a different port (eg. site at example.com calls example.com:3001)
// - a different protocol (eg. site at https://example.com calls http://example.com)
// This mechanism prevents attackers that plant scripts on various websites (eg. in ads displayed via Google Ads)
//  to make an AJAX call to www.yourbank.com and in case you were logged in making a transaction using *your* credentials.
// Lets the browser and server talk to each other without security interruptions.
const cors = require('cors');
app.use(cors());

// The app will be used inside the website folder
app.use(express.static('website'));

// Port to use
const port = 8000;

// Start up the server
const server = app.listen(port, listening);

// Show the server is running
function listening() {
    console.log(`Server running on port ${port}`);
};

// GET route for the server
app.get('/all', getData);

// req - request
// res - response
function getData(req, res) {
    res.send(projectData);
}

// POST route for the server
app.post('/add', postData);

// req - request
// res - response
function postData(req, res) {

    // Store the request in the projectData array on the server - this allows history to be recalled
    projectData.push(req.body);

    // If you don't send a response, you'll get POST net::ERR_EMPTY_RESPONSE when awaiting a POST response (after about 2 min)
    res.send({ msg: "Received" });

    // Show the data on the server
    console.log(projectData);
}