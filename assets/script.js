const locationForm = document.querySelector("#location-form");
const locationSearch = document.querySelector("#location-form__search");
const locationError = document.querySelector(".location-error");

const city = document.querySelector(".weather-card__city");
const state = document.querySelector(".weather-card__state");
const temperature = document.querySelector(".weather-card__temperature");
const description = document.querySelector(".weather-card__description");
const feelsLike = document.querySelector(".weather-card__feels-like");
const pressure = document.querySelector(".weather-card__pressure");
const humidity = document.querySelector(".weather-card__humidity");

const apiKey = "ce00ef44568239e9f3d5333568586eb5";

// Returns longitudes and latitudes of a city
async function locationToCoordinates(queryCity) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${queryCity}&limit=1&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const location = await res.json();

    //   Update city and State on screen
    city.textContent = location[0].name;
    state.textContent = location[0].state;

    return ({ lat, lon } = location[0]);
  } catch (err) {
    locationError.textContent =
      "Location not found, Please enter a valid location!";
  }
}

// Returns current weather of a city
async function getWeatherData(queryCity) {
  const { lat, lon } = await locationToCoordinates(queryCity);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  //   Make the fetch request to openweathermap.org
  try {
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {}
}

locationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  //   Resets error message
  locationError.textContent = "";
  try {
    //   Destructures relevant weather info from the response
    const {
      main,
      weather: [{ description: conditions }],
    } = await getWeatherData(locationSearch.value);

    //   Updates content on screen with the recived weather data
    temperature.textContent = `${Math.round(main.temp)}°C`;
    description.textContent = main.conditions;
    feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
    pressure.textContent = `${main.pressure} hPa`;
    humidity.textContent = `${main.humidity}%`;
  } catch (err) {}
});
