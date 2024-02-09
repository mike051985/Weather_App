// Geolocated Weather
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("geo-weather").innerHTML = `
                <img class="geo-icon" src=${iconUrl} />
                <p class="geo-temp">${Math.round(data.main.temp)}°C</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

// Hide Geolocated Weather
const geoWeather = document.querySelector("#geo-weather")

document.querySelector(".search-btn").addEventListener("click", (e) => {
    e.preventDefault()
    geoWeather.classList.add("hide-geo-weather")
})


//Selected City Weather

// Get weather data from Open Weather API
function getWeather() {
    const apiKey = "f73ddcfc164f42dc60c736700cc1df5c";
    const cityName = document.getElementById("city-name").value;

    if (!cityName) {
        alert("Please enter a city");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                alert("Error fetching current weather data. Please try again.");
            })

    fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayHourlyForecast(data.list);
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                alert("Error fetching hourly forecast data. Please try again.");
            })

}

// Display weather data
function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    // Clear previous content
    weatherInfoDiv.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";
    tempDivInfo.innerHTML = "";

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

// Display hourly forecast weather data
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Show image icon
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
