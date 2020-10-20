# Weather Journal App

## Description
This project creates an asynchronous web app that uses a web API and user data to dynamically update the UI.  A local server running on *Node* and *Express* must be used as this server holds the data from the API and the input from the web page.

## Requirements
This project runs on a local server using Node.  An OWM API key is required from here: [OpenWeatherMap.org](https://openweathermap.org/).

## Installation
Install the following node packages:

```
npm install express
```
```
npm install cors
```
```
npm install body-parser
```
After installation, the server is established with the following command:

```
node server.js
```

Refer to details inside package.json.

## Guidance
Once the server is running, open the web page to the same port as the server, and enter in a valid city and journal entry (cannot be blank).

An American zip code can also be entered (leave city blank), but note if a city is provided, it will take precedence.

The page will dynamically return the current weather for the city (or zip) and add the journal entry next to the weather.