const apiKey = '673863623995150a2a9fde0dfc9b0c7a';

document.querySelector('#getWeather').addEventListener('click', addCity);

function addCity() {
    const city = document.querySelector('#input').value.trim();
    if (!city) return;

    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (cities.includes(city)) return;

    if (cities.length >= 10) {
        alert('You can only add up to 10 cities.');
        return;
    }

    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    displayCities();
    fetchWeather(city);
    document.querySelector('#input').value = '';
}

function removeCity(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities = cities.filter(c => c !== city);
    localStorage.setItem('cities', JSON.stringify(cities));
    displayCities();
    document.querySelector('#weatherInfo').innerHTML = '';
}

function displayCities() {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    const weatherList = document.querySelector('#weatherList');
    weatherList.innerHTML = '';

    cities.forEach(city => {
        const div = document.createElement('div');
        div.className = 'weather-item';
        div.innerHTML = `
            <span>${city}</span>
            <button onclick="removeCity('${city}')">Remove</button>
        `;
        div.addEventListener('click', () => fetchWeather(city));
        weatherList.appendChild(div);
    });
}

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const weatherInfo = document.querySelector('#weatherInfo');
            weatherInfo.innerHTML = '';

            const cityName = document.createElement('h2');
            cityName.textContent = data.name;
            weatherInfo.appendChild(cityName);

            const temperature = document.createElement('p');
            temperature.textContent = `Temperature: ${Math.round(data.main.temp - 273.15)}°C`;
            weatherInfo.appendChild(temperature);

            const humidity = document.createElement('p');
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            weatherInfo.appendChild(humidity);

            const weatherIcon = document.createElement('img');
            weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            weatherInfo.appendChild(weatherIcon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    displayCities();
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (cities.length > 0) {
        fetchWeather(cities[0]);
    }
});
