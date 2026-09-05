/* =========================================
   TASK 4 - WEATHER DASHBOARD
   ========================================= */

// ---------- DOM ELEMENTS ----------

const weatherForm =
    document.getElementById("weather-form");

const cityInput =
    document.getElementById("city-input");

const weatherStatus =
    document.getElementById("weather-status");

const weatherCard =
    document.getElementById("weather-card");

const locationName =
    document.getElementById("location-name");

const locationCountry =
    document.getElementById("location-country");

const weatherIcon =
    document.getElementById("weather-icon");

const weatherDescription =
    document.getElementById("weather-description");

const temperature =
    document.getElementById("temperature");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("wind-speed");

const feelsLike =
    document.getElementById("feels-like");

const cloudCover =
    document.getElementById("cloud-cover");

const weatherTime =
    document.getElementById("weather-time");


// ---------- API ENDPOINTS ----------

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ---------- WEATHER CODE ----------

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Depositing rime fog",
            icon: "🌫️"
        },

        51: {
            description: "Light drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Slight rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy rain",
            icon: "🌧️"
        },

        71: {
            description: "Slight snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy snow",
            icon: "❄️"
        },

        80: {
            description: "Slight rain showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate rain showers",
            icon: "🌧️"
        },

        82: {
            description: "Violent rain showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with hail",
            icon: "⛈️"
        },

        99: {
            description: "Thunderstorm with heavy hail",
            icon: "⛈️"
        }

    };


    return weatherCodes[code] || {
        description: "Unknown weather",
        icon: "🌍"
    };

}


// ---------- FIND CITY ----------

async function getCityCoordinates(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to search for the city."
        );

    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            "City not found. Please check the city name."
        );

    }


    return data.results[0];

}


// ---------- GET WEATHER ----------

async function getWeather(latitude, longitude) {

    const url =
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,wind_speed_10m&timezone=auto`;

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to retrieve weather data."
        );

    }


    const data =
        await response.json();


    if (!data.current) {

        throw new Error(
            "Weather data is unavailable."
        );

    }


    return data;

}


// ---------- DISPLAY WEATHER ----------

function displayWeather(location, data) {

    const current =
        data.current;


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    locationName.textContent =
        location.name;


    locationCountry.textContent =
        `${location.admin1 || ""}, ${location.country}`;


    weatherIcon.textContent =
        weatherInfo.icon;


    weatherDescription.textContent =
        weatherInfo.description;


    temperature.textContent =
        `${Math.round(current.temperature_2m)}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;


    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;


    cloudCover.textContent =
        `${current.cloud_cover}%`;


    weatherTime.textContent =
        `Updated: ${current.time}`;


    weatherCard.hidden = false;


    weatherStatus.textContent =
        `Weather loaded successfully for ${location.name}.`;

}


// ---------- ERROR DISPLAY ----------

function displayError(error) {

    weatherCard.hidden = true;


    weatherStatus.textContent =
        error.message ||
        "Something went wrong. Please try again.";

}


// ---------- FORM EVENT ----------

weatherForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (!city) {

            weatherStatus.textContent =
                "Please enter a city name.";

            cityInput.focus();

            return;

        }


        weatherStatus.textContent =
            "Loading weather data...";


        weatherCard.hidden = true;


        try {

            // First API call:
            // city name → latitude & longitude

            const location =
                await getCityCoordinates(city);


            // Second API call:
            // coordinates → weather data

            const weather =
                await getWeather(
                    location.latitude,
                    location.longitude
                );


            displayWeather(
                location,
                weather
            );

        }


        catch (error) {

            console.error(
                "Weather error:",
                error
            );


            displayError(error);

        }

    }
);
