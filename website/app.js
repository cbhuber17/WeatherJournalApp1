const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';

const CITY_QUERY = 'q=';

const ZIP = 'zip=';

const METRIC_UNITS = '&units=metric';

const APP_ID = `&APPID=${OWM_API_KEY}`;

async function getOWMWeatherAPI(city) {
    url = BASE_URL + CITY_QUERY + city + METRIC_UNITS + APP_ID;
    weatherResult = await fetch(url);

    try {
        const weatherData = await weatherResult.json();
        // TBD these are used for later
        // console.log(weatherData);
        // console.log(weatherData.main.temp);
        // console.log(weatherData.dt);
        // const weatherDate = new Date(weatherData.dt * 1000);
        // console.log(weatherDate);
        return weatherData;
    }
    catch (error) {
        console.log('ERROR: Could not get weatherData.  Msg: ' + error);
        alert(`ERROR: Could not get weather data for: ${city}. Please try again later.`);
    }
}

async function postJournalEntryToServer(url, data) {
    // TBD check the data, remove after debugging
    console.log(data);

    // POST journal entry data
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data),
    });
}


// Generate button actions
let generateButton = document.getElementById('generate');
generateButton.addEventListener('click', generateWeather);

function generateWeather() {

    // Get the city from the text box input
    const city = document.getElementById('city').value;
    const feelings = document.getElementById('feelings').value;

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
        // Then grab the necessary data from the weatherData object
        .then(function (weatherData) {

            // TBD check cod is 200?
            temperature = weatherData.main.temp;  // Metric units based on the METRIC_UNITS variable
            weatherTime = new Date(weatherData.dt * 1000); // Unix time since Jan 1, 1970, multiply by 1000 to get the date/time object

            dataToPost = { temperature, weatherTime, feelings };

            postJournalEntryToServer('/add', dataToPost);

        })

}




// Set up a POST route
// TBD document function(s)
// TBD is this needed?
const postData = async function (url = '', data = {}) {
    // TBD check the data, remove after debugging
    console.log(data);

    // Provide a response after (waiting) fetching the URL
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // When we get the data, try to use it
    try {
        const newData = await response.json();
        // TBD check the data, remove after debugging
        console.log(newData);
        return newData;
    }
    catch (error) {
        // TBD handle the error
        console.log('ERROR: could not get new data.  Msg: ' + error);
        // TBD use alert?
    }
}

// postData('/website', { message: 'hi there!!' });