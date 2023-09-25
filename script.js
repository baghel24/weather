const cityInput  = document.querySelector(".city-input")
const searchbutton  = document.querySelector(".search-button")
const livelocationbutton  = document.querySelector(".location-button")
const weatherCardDiv  = document.querySelector(".weather-card")
const currentweatherDiv  = document.querySelector(".curr-weather")

const API_KEY = "c93b7d6cce8390a6d4a8036038fe906f";

const createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0){
        return `<div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Tempreature:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidty}%</h4>
            </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"  alt="cloud"/>
            <h4>${weatherItem.weather[0].description}</h4>
            </div>`;

    }
    else{
    return `<li class="card">
                <h3>Date: ${weatherItem.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"  alt="cloud"/>
                <h4>Tempreature:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidty}%</h4>
            </li>`;
        }
};

const getweatherDetails = (cityName, lat, lon) => {
   const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(WEATHER_API_URL).then(res => res.json()).then(data =>{
        
//filter the forecast to get only forecast per day
        const uniqueForecastDays = [];
        console.log(data);
        const fourDaysforecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        //clearing the previous data
        cityInput.value = "";
        weatherCardDiv.innerHTML = "";
        currentweatherDiv.innerHTML = "";

        // console.log(fourDaysforecast);
        fourDaysforecast.forEach((weatherItem,index) =>{
            if(index===0){
                currentweatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            else{
                weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));

            }
            // createWeatherCard(weatherItem);
        });

    }).catch(() => {
        alert("An error occurred while fetching the weather forecast");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No coordinates find for the ${cityName}`);
        const { name, lat, lon} = data[0];
        getweatherDetails(name, lat, lon);
        // console.log(data);

    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getuserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
                const { name } = data[0];
                getweatherDetails(name, latitude, longitude);
                // console.log(data);
        
            }).catch(() => {
                alert("An error occurred while fetching the citys");
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset the location permission to grant acces again.")
            }
        }
    );
}
livelocationbutton.addEventListener("click", getuserCoordinates);
searchbutton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates())