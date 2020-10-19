const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';

const CITY_QUERY = 'q=';

const METRIC_UNITS = '&units=metric';

const APP_ID = `&APPID=${OWM_API_KEY}`;

const ICON_URL = 'http://openweathermap.org/img/wn/';

/*
* Async function that makes the API call to OWM using the city as the input
* @param  {String} city - A city name (that is supported by OWM API call)
* @return {Object} - Weather data from the API call (if API call is successful)
*/
async function getOWMWeatherAPI(city) {
    url = BASE_URL + CITY_QUERY + city + METRIC_UNITS + APP_ID;
    weatherResult = await fetch(url);

    try {
        const weatherData = await weatherResult.json();
        return weatherData;
    }
    catch (error) {
        console.log('ERROR: Could not get weatherData.  Msg: ' + error);
        alert(`ERROR: Could not get weather data for: ${city}. Please try again later.`);
    }
}

/*
* Async function to post data to the server (weather and journal entry)
* @param {String} url - URL location on the server (needs to match the location in server.js)
* @data {Object} url - Data containing the weather and journal entry
* @return {Object} - Response from the server
*/
async function postJournalEntryToServer(url, data) {

    // POST journal entry data
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data),
    });

    // Try to process the response
    try {
        const newData = await response.json();
        return newData;
    }
    catch (error) {
        console.log('ERROR: could not get new data in postJournalEntryToServer().  Msg: ' + error);
        alert('Could not POST data to server.  Make sure the server is up and running.');
    }
}

/*
* Function to capture the API call based on the input city and journal entry
*/
function captureAPIandEntry() {

    // Get the city and journal entry from the text box inputs
    const city = document.getElementById('city').value;
    const feelings = document.getElementById('feelings').value;

    // Make sure they have data filled out
    if (city === '') {
        alert('Please enter a city.');
        return;
    }

    if (feelings === '') {
        alert('Please enter in a journal entry.')
        return;
    }

    // Returns weatherData from the API call
    getOWMWeatherAPI(city)

        // First chained promise --> then grab the necessary data from the returned weatherData object
        .then(function (weatherData) {

            // Check the HTML response status code, only process OK (200) data
            if (weatherData.cod == 200) {
                const temperature = weatherData.main.temp;  // Metric units based on the METRIC_UNITS variable
                const weatherTime = new Date(weatherData.dt * 1000); // Unix time since Jan 1, 1970, multiply by 1000 to get the date/time object
                const weatherTimeMDY = weatherTime.toString();
                const weatherIconCode = weatherData.weather[0].icon;
                const weatherDescription = weatherData.weather[0].description;
                const weatherCity = weatherData.name;
                const weatherCountry = weatherData.sys.country;

                const dataToPost = { temperature, weatherTimeMDY, weatherIconCode, weatherDescription, weatherCity, weatherCountry, feelings };

                // POST the external API data to the server
                postJournalEntryToServer('/add', dataToPost)

                    // Second chained promise --> grab the data from the local server and update the UI accordingly
                    .then(getJournalEntryFromServer('/all'))
            }
            else {
                alert('Invalid city entered.  Try again.');
                return;
            }
        })
}

/*
* Async function to get the data from the local server
* @param {String} url - URL location on the server (needs to match the location in server.js)
*/
async function getJournalEntryFromServer(url) {

    // GET the data and use it to dynamically update the UI.
    const request = await fetch(url);

    try {
        const allData = await request.json();

        updateUI(allData);
    }
    catch (error) {
        console.log('ERROR: could not get allData in getJournalEntryFromServer().  Msg: ' + error);
        alert('Could not GET data from server.  Make sure the server is up and running.');
    }
}

/*
* Function to update the UI:
* - Add the latest entry to the recent HTML class
* - Add other entries to the history (stores up to a max of 3 historical entires)
*/
function updateUI(allData) {

    // Variables for dynamically updating the UI for the most recent entry and the 3 historical entries
    let elementId = '';
    let locationId = '';
    let iconId = '';
    let tempId = '';
    let dateId = '';
    let contentId = '';
    let entryDivs = ``;
    let iconImg = ``;

    // Most recent entry is at the end of the array, work backwards to get the most recent to the least recent
    for (let i = allData.length - 1; i >= 0; i--) {

        // Switch statement will define the IDs for each HTML element
        switch (i) {
            case allData.length - 1:
                elementId = "recent";
                locationId = "location";
                iconId = "icon";
                tempId = "temp";
                dateId = "date";
                contentId = "content"
                break;
            case allData.length - 2:
                elementId = "history1";
                locationId = "location1";
                iconId = "icon1";
                tempId = "temp1";
                dateId = "date1";
                contentId = "content1"
                break;
            case allData.length - 3:
                elementId = "history2";
                locationId = "location2";
                iconId = "icon2";
                tempId = "temp2";
                dateId = "date2";
                contentId = "content2"
                break;
            case allData.length - 4:
                elementId = "history3";
                locationId = "location3";
                iconId = "icon3";
                tempId = "temp3";
                dateId = "date3";
                contentId = "content3"
                break;

            default:
                elementId = '';
                break;
        }

        // Only display the last 3 histories
        if (elementId === '') {
            break;
        }

        // The DIVs for each entry container
        entryDivs = `<div class="weather">
                         <div id="${locationId}"></div>
                         <div id="${iconId}"></div>
                         <div id="${tempId}"></div>
                         <div id="${dateId}"></div>
                     </div>
                     <div id="${contentId}" class="content"></div>`;

        //  Put these DIVs in each container
        document.getElementById(elementId).innerHTML = entryDivs;

        // Grab the weather icon (URL) from the API
        iconImg = ICON_URL + allData[i].weatherIconCode + '@2x.png';

        // Dynamically update the HTML for the recent entry and historical entires (if any)
        document.getElementById(locationId).innerHTML = `<h3>Current weather in ${allData[i].weatherCity} ${allData[i].weatherCountry}</h3>`;
        document.getElementById(iconId).innerHTML = `<img class="weatherIcon" src="${iconImg}" alt="Current weather">`;
        document.getElementById(tempId).innerHTML = allData[i].temperature.toFixed(0) + ' °C ' + allData[i].weatherDescription;
        document.getElementById(dateId).innerHTML = allData[i].weatherTimeMDY;
        document.getElementById(contentId).innerHTML = '<h3>Entry:</h3><p>' + allData[i].feelings + '</p>';
    }
}

/*
* Function is the main entry point in this app
*/
function main() {

    // Generate button actions
    const generateButton = document.getElementById('generate');
    generateButton.addEventListener('click', captureAPIandEntry);
}

main();