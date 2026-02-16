const API_KEY = window.API_KEY || 'e17568e62ee20983aadb425eaf803c43';
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Helper selector
function q(selector) {
    return document.querySelector(selector);
}

/* =========================
   ERROR FUNCTION
========================= */
function showError(message) {
    const display = q('#weather-display');

    const errorHTML = `
        <div class="error-message">
            <h3>❌ Error</h3>
            <p>${message}</p>
        </div>
    `;

    display.innerHTML = errorHTML;
}

/* =========================
   LOADING FUNCTION
========================= */
function showLoading() {
    const display = q('#weather-display');

    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;

    display.innerHTML = loadingHTML;
}

/* =========================
   DISPLAY WEATHER
========================= */
function displayWeather(data) {
    const display = q('#weather-display');
    const cityInput = q('#city-input');

    const name = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    display.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${name}, ${country}</h2>
            <img class="weather-icon" src="${iconUrl}" alt="${desc}">
            <div class="temperature">${temp}°C</div>
            <div class="description">${desc}</div>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${wind} m/s</p>
        </div>
    `;

    // Focus back to input for better UX
    cityInput.focus();
}

/* =========================
   ASYNC WEATHER FUNCTION
========================= */
async function getWeather(city) {
    const searchBtn = q('#search-btn');
    const cityInput = q('#city-input');

    showLoading();

    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        searchBtn.disabled = true;
        searchBtn.textContent = "Searching...";

        const response = await axios.get(url);

        displayWeather(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check spelling.");
        } else {
            showError("Something went wrong. Please try again.");
        }

    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
        cityInput.value = "";
    }
}

/* =========================
   SEARCH FUNCTIONALITY
========================= */
function initSearch() {
    const searchBtn = q('#search-btn');
    const cityInput = q('#city-input');

    searchBtn.addEventListener('click', function () {
        const city = cityInput.value.trim();

        if (!city) {
            showError("Please enter a city name.");
            return;
        }

        if (city.length < 2) {
            showError("City name must be at least 2 characters.");
            return;
        }

        getWeather(city);
    });

    // Enter key support
    cityInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            searchBtn.click();
        }
    });
}

/* =========================
   INITIAL LOAD
========================= */
document.addEventListener('DOMContentLoaded', function () {

    initSearch();

    // Welcome message instead of default city
    q('#weather-display').innerHTML = `
        <div class="welcome-message">
            <p>🌍 Enter a city name to get started!</p>
        </div>
    `;
});
