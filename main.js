// API Configuration
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const cityElement = document.getElementById("city");
const countryElement = document.getElementById("country");
const tempElement = document.getElementById("temp");
const descElement = document.getElementById("description");
const iconElement = document.getElementById("weather-icon");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const forecastContainer = document.getElementById("forecast-container");

// Default location (London)
let currentLocation = "London";

// Fetch Weather Data
async function fetchWeatherData(location) {
    try {
        // Current weather
        const currentResponse = await fetch(
            `${BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`
        );
        const currentData = await currentResponse.json();
        
        if (currentData.cod !== 200) {
            throw new Error(currentData.message);
        }
        
        // Forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${location}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();
        
        return {
            current: currentData,
            forecast: forecastData
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error: " + error.message);
        return null;
    }
}

// Display Weather Data
function displayWeatherData(data) {
    const { current, forecast } = data;
    
    // Current weather
    cityElement.textContent = current.name;
    countryElement.textContent = current.sys.country;
    tempElement.textContent = `${Math.round(current.main.temp)}°C`;
    descElement.textContent = current.weather[0].description;
    iconElement.src = `assets/weather-icons/${current.weather[0].icon}.png`;
    feelsLikeElement.textContent = `${Math.round(current.main.feels_like)}°C`;
    humidityElement.textContent = `${current.main.humidity}%`;
    windElement.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
    
    // Forecast
    forecastContainer.innerHTML = "";
    
    // Get daily forecast (every 24 hours)
    const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0);
    
    dailyForecast.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en", { weekday: "short" });
        
        const forecastCard = document.createElement("div");
        forecastCard.className = "forecast-card";
        forecastCard.innerHTML = `
            <p class="forecast-day">${dayName}</p>
            <img src="assets/weather-icons/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <div class="forecast-temp">
                <span class="max-temp">${Math.round(day.main.temp_max)}°</span>
                <span class="min-temp">${Math.round(day.main.temp_min)}°</span>
            </div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Search Functionality
function handleSearch() {
    const location = searchInput.value.trim();
    if (location) {
        currentLocation = location;
        fetchWeatherData(location)
            .then(data => {
                if (data) {
                    displayWeatherData(data);
                    searchInput.value = "";
                }
            });
    }
}

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearch();
});

// Initialize with default location
fetchWeatherData(currentLocation)
    .then(data => {
        if (data) displayWeatherData(data);
    });