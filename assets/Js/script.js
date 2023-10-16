document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = '77dc720f5893406ee0e65c39f87292b4';
    const searchForm = document.querySelector('#search-form');
    const weatherDetails = document.querySelector('#weather-details');
    const forecastDiv = document.querySelector('#forecast');
    const previousSearchesDiv = document.querySelector('#previous-searches');

    // Function to fetch and display weather and forecast
    function fetchWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            })
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
                // Store the last searched city
                localStorage.setItem('lastSearchedCity', city);
            })
            .catch(error => console.error('Error fetching the weather data:', error));
    }

    // Function to display current weather
    function displayWeather(data) {
        const html = `
            <h2>Weather in ${data.name}</h2>
            <p>${data.weather[0].main} - ${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind speed: ${data.wind.speed} meter/sec</p>
        `;
        weatherDetails.innerHTML = html;
    }

    // Function to display 5-day forecast
    function displayForecast(data) {
        let html = '<h3>5-day Forecast:</h3>';
        for (let i = 0; i < data.list.length; i += 8) {
            const dailyData = data.list[i];
            html += `
                <p>
                    <strong>${new Date(dailyData.dt * 1000).toLocaleDateString()}:</strong>
                    ${dailyData.weather[0].main} - ${dailyData.weather[0].description},
                    Temperature: ${dailyData.main.temp} °C
                </p>
            `;
        }
        forecastDiv.innerHTML = html;
    }

    // Function to display previous searches from local storage
    function displayPreviousSearches() {
        const searches = JSON.parse(localStorage.getItem('searches')) || [];
        previousSearchesDiv.innerHTML = '<h3>Previous Searches:</h3>';
        searches.forEach(city => {
            const cityDiv = document.createElement('div');
            cityDiv.textContent = city;
            cityDiv.classList.add('previous-search');
            cityDiv.addEventListener('click', () => {
                fetchWeather(city);
            });
            previousSearchesDiv.appendChild(cityDiv);
        });
    }

    // Event listener for search form submission
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = document.querySelector('#search-input').value;
        fetchWeather(city);

        // Save the search if it's new
        const searches = JSON.parse(localStorage.getItem('searches')) || [];
        if (!searches.includes(city)) {
            searches.push(city);
            localStorage.setItem('searches', JSON.stringify(searches));
        }

        // Display the updated previous searches
        displayPreviousSearches();
    });

    // Fetch weather for the last searched city on load
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
        fetchWeather(lastSearchedCity);
    }

    // Display previous searches on load
    displayPreviousSearches();
});
