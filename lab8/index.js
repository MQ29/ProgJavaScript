document.querySelector('#getWeather').addEventListener('click', () =>
{
    const apiKey = '673863623995150a2a9fde0dfc9b0c7a';
    const city = document.querySelector('#input').value;
    console.log(city.textContent);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`

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
        cityName.textContent = data.cityName; 
        weatherInfo.appendChild(cityName);

        const temperature = document.createElement('p');
        temperature.textContent = `Temperatura: ${Math.round(data.main.temp - 273.15)}°C`;
        weatherInfo.appendChild(temperature);


    })
    .catch(error => {
        console.error('Wystąpił błąd pobierania danych:', error);
      });
})