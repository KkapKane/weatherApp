import "./style.scss";

const pexelapi = "563492ad6f91700001000001b54b9f60708944ff84a4aa610549b15e";
const Location = document.querySelector(".location");
const description = document.querySelector(".description");
const low = document.querySelector(".low");
const high = document.querySelector(".high");
const currentTemp = document.querySelector(".currentTemp");
const searchLocation = document.querySelector(".searchLocation");
const body = document.querySelector("body");
const tempArr = [];

if (searchLocation.value == "") {
  searchLocation.value = "pyongyang";

  getWeather("weather").then((weatherData) => {
    console.log(weatherData);

    Location.textContent = "City : " + weatherData.name;
    description.textContent = "forecast: " + weatherData.weather[0].description;
    low.textContent = "low: " + weatherData.main.temp_min + "°F";
    high.textContent = "high: " + weatherData.main.temp_max + "°F";
    currentTemp.textContent = "current: " + weatherData.main.temp + "°F";

    console.log(weatherData);
    console.log("no good");
  });
}

async function getWeather(info) {
  try {
    const weatherUrl =
      "http://api.openweathermap.org/data/2.5/" +
      info +
      "/?q=" +
      searchLocation.value +
      "&APPID=5fcf79260e37e26b97f29d31fea15c63&units=imperial";

    const response = await fetch(weatherUrl, { mode: "cors" });
    const weatherData = await response.json();

    return weatherData;
  } catch (error) {
    console.log("error!");
  }
}

document.querySelector("button").addEventListener("click", function () {
  getWeather("weather").then((weatherData) => {
    try {
      console.log(weatherData);

      Location.textContent = "City : " + weatherData.name;
      description.textContent =
        "forecast: " + weatherData.weather[0].description;
      low.textContent = "low: " + weatherData.main.temp_min + "°F";
      high.textContent = "high: " + weatherData.main.temp_max + "°F";
      currentTemp.textContent = "current: " + weatherData.main.temp + "°F";
    } catch {
      console.log(weatherData);
      console.log("no good");
    }
    getWeather("forecast").then((weatherData) => {
      for (let i = 0; i < weatherData.list.length; i++) {
        const newdiv = document.createElement("div");
        console.log(weatherData);
        newdiv.textContent =
          weatherData.list[i].dt_txt.slice(0, 16) +
          " " +
          "temp: " +
          weatherData.list[i].main.feels_like;
        tempArr.push(weatherData.list[i].dt_txt);
        body.appendChild(newdiv);
      }
      console.log(tempArr[0]);
    });
  });
});
