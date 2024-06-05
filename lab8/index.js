const apiKey = '673863623995150a2a9fde0dfc9b0c7a';

document.querySelector('#getWeather').addEventListener('click', addCity);
setInterval(updateWeatherForAllCities, 300000); // co 5 minut

//asynchronicznosc, gdyz komunikujemy sie z serwerem i oczekujemy na odopwiedz z API

async function addCity() {
    const city = document.querySelector('#input').value.trim();
    if (!city) return;

    try {
        const validCity = await validateCity(city); 
        if (!validCity) {
            alert('City not found. Please enter a valid city.');
            return;
        }

        let cities = JSON.parse(localStorage.getItem('cities')) || [];
        if (cities.includes(city)) return;

        if (cities.length >= 10) {
            alert('You can only add up to 10 cities.');
            return;
        }

        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities)); //serializacja 
        displayCities();
        await fetchWeather(city);
        document.querySelector('#input').value = ''; 
    } catch (error) {
        console.error('Error adding city:', error);
    }
}

async function validateCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data.name.toLowerCase() === city.toLowerCase();
    } catch (error) {
        console.error('Error validating city:', error);
        return false;
    }
}

function removeCity(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities = cities.filter(c => c !== city);
    localStorage.setItem('cities', JSON.stringify(cities));
    displayCities();
    document.querySelector('#weatherInfo').innerHTML = '';
}

function displayCities() {
    const cities = JSON.parse(localStorage.getItem('cities')) || []; //deserializacja
    const weatherList = document.querySelector('#weatherList');
    weatherList.innerHTML = '';

    cities.forEach((city) => {
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

async function fetchWeather(city) {
    const cachedWeather = getCachedWeather(city);
    if (cachedWeather) {
        displayWeather(cachedWeather);
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        cacheWeather(city, data);
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
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

    fetchHourlyForecast(data.name);
}

function cacheWeather(city, data) {
    const cache = JSON.parse(localStorage.getItem('weatherCache')) || {};
    cache[city] = {
        data,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('weatherCache', JSON.stringify(cache));
}

function getCachedWeather(city) {
    const cache = JSON.parse(localStorage.getItem('weatherCache')) || {};
    if (cache[city] && (new Date().getTime() - cache[city].timestamp) < 300000) {
        return cache[city].data;
    }
    return null;
}

async function updateWeatherForAllCities() {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    for (const city of cities) {
        await fetchWeather(city);
    }
}

async function fetchHourlyForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayHourlyForecast(data);
    } catch (error) {
        console.error('Error fetching hourly forecast:', error);
    }
}

function displayHourlyForecast(data) {
    const ctx = document.querySelector('#weatherChart').getContext('2d');
    const labels = data.list.slice(0, 12).map(entry => new Date(entry.dt * 1000).getHours() + ':00');
    const temps = data.list.slice(0, 12).map(entry => Math.round(entry.main.temp - 273.15));

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayCities();
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (cities.length > 0) {
        fetchWeather(cities[0]);
    }
});
