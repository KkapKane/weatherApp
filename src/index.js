import "./style.scss";
import clearSky from "./images/01n.svg";
import fewClouds from "./images/02n.svg";
import scatteredClouds from "./images/03n.svg";
import brokenClouds from "./images/04n.svg";
import showerRain from "./images/09n.svg";
import rain from "./images/10n.svg";
import thunderStorm from "./images/11n.svg";
import snow from "./images/13n.svg";
import mist from "./images/50n.svg";
import HumidIcon from "./images/HumidityIcon.svg";
import wind from "./images/wind.svg";

const svgClearSky = new Image();
svgClearSky.src = clearSky;
const svgFewClouds = new Image();
svgFewClouds.src = fewClouds;
const svgScatteredClouds = new Image();
svgScatteredClouds.src = scatteredClouds;
const svgBrokenClouds = new Image();
svgBrokenClouds.src = brokenClouds;
const svgShowerRain = new Image();
svgShowerRain.src = showerRain;
const svgRain = new Image();
svgRain.src = rain;
const svgThunderStorm = new Image();
svgThunderStorm.src = thunderStorm;
const svgSnow = new Image();
svgSnow.src = snow;
const svgMist = new Image();
svgMist.src = mist;
const svgHumid = new Image();
svgHumid.src = HumidIcon;
const svgWind = new Image();
svgWind.src = wind;

const pexelapi = "563492ad6f91700001000001b54b9f60708944ff84a4aa610549b15e";
const Location = document.querySelector(".location");
const description = document.querySelector(".description");
const low = document.querySelector(".low");
const high = document.querySelector(".high");
const currentTemp = document.querySelector(".currentTemp");
const searchLocation = document.querySelector(".searchLocation");
const body = document.querySelector("body");
const ImageDisplay = document.querySelector(".ImageDisplay");
const right = document.querySelector(".right");
const today = document.querySelector(".today");
const currentTime = document.querySelector(".currentTime");
loadingPage();
function loadingPage() {
  document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
      document.querySelector("body").style.visibility = "hidden";

      console.log("not done yet");
    } else {
      document.querySelector("body").style.visibility = "visible";
      document.querySelector(".loadDiv").style.display = "none";
      console.log("done");
    }
  };
}

// finding todays weekday
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function daysFromToday(num) {
  const d = new Date();
  const current = d.getDay();

  let day = weekday[(current + num) % 7];

  return day;
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  var dayofweek = days[a.getDay()];

  console.log(dayofweek);

  return time;
}

const tempArr = [];
// if nothing is in the search input default to seoul
if (searchLocation.value == "") {
  loadingPage();
  searchLocation.value = "Singapore";
  var api_url =
    "https://api.pexels.com/v1/search?query=" +
    searchLocation.value +
    "&per_page=3";
  getWeather("weather").then((weatherData) => {
    console.log(weatherData);
    currentTime.textContent = timeConverter(weatherData.dt);
    today.textContent = daysFromToday(0);
    Location.textContent = weatherData.name;
    description.textContent = weatherData.weather[0].description;
    low.textContent = "low: " + Math.round(weatherData.main.temp_min) + "°F";
    high.textContent = "high: " + Math.round(weatherData.main.temp_max) + "°F";
    currentTemp.textContent =
      "current: " + Math.round(weatherData.main.temp) + "°F";

    console.log(weatherData);
  });
  getForecast();
}

async function getWeather(info) {
  try {
    const weatherUrl =
      "http://api.openweathermap.org/data/2.5/" +
      info +
      "/?q=" +
      searchLocation.value +
      "&APPID=5fcf79260e37e26b97f29d31fea15c63&units=imperial";

    api_url =
      "https://api.pexels.com/v1/search?query=" +
      searchLocation.value +
      "&per_page=5";

    const response = await fetch(weatherUrl, { mode: "cors" });
    const weatherData = await response.json();
    fetchImagesFromPexel();
    return weatherData;
  } catch (error) {
    console.log("error!");
  }
}

//listens to button and grabs value of search bar. sends request to api
document.querySelector("button").addEventListener("click", function () {
  getWeather("weather").then((weatherData) => {
    loadingPage();
    try {
      currentTime.textContent = timeConverter(weatherData.dt);
      today.textContent = daysFromToday(0);
      Location.textContent = weatherData.name;
      description.textContent = weatherData.weather[0].description;
      low.textContent = "low: " + Math.round(weatherData.main.temp_min) + "°F";
      high.textContent =
        "high: " + Math.round(weatherData.main.temp_max) + "°F";
      currentTemp.textContent =
        "current: " + Math.round(weatherData.main.temp) + "°F";
    } catch {
      console.log(weatherData);
      console.log("no good");
    }
    getForecast();
  });
});

//grabs picture of the searched query
const fetchImagesFromPexel = async () => {
  const data = await fetch(api_url, {
    headers: {
      Authorization: pexelapi,
    },
  });

  const { photos } = await data.json();
  var img = new Image();
  img.src = photos[randomNum(1, 4)].src.original;

  ImageDisplay.style.backgroundImage = 'url("' + img.src + '")';

  return photos;
};

function removeAllChild(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function randomNum(min, max) {
  return Math.floor(min + Math.random() * max - min + 1);
}
//gets the forecast and also makes 5 divs to display forecast
function getForecast() {
  getWeather("forecast").then((weatherData) => {
    removeAllChild(right);

    for (let i = 1, j = 1; i < weatherData.list.length; i = i + 8, j++) {
      console.log(weatherData);
      console.log(weatherData.list[i].weather[0].description);
      let code = weatherData.list[i].weather[0].icon;
      console.log(code);

      const forecastDivContainer = document.createElement("div");
      const daydiv = document.createElement("div");
      const currentTemp = document.createElement("div");
      const forecastDescription = document.createElement("div");
      const iconDiv = document.createElement("div");
      const lowest = document.createElement("div");
      const highest = document.createElement("div");
      const humidSymbol = document.createElement("div");
      const humidPercent = document.createElement("div");
      const windIcon = document.createElement("div");
      const windSpeed = document.createElement("div");

      forecastDescription.textContent =
        weatherData.list[i].weather[0].description;
      currentTemp.setAttribute("id", "currentTemp");
      daydiv.setAttribute("id", daysFromToday(i));

      forecastDescription.setAttribute("id", "forecastDescription");
      iconDiv.setAttribute("id", "Icon");
      daydiv.setAttribute("id", "dayDiv");
      lowest.setAttribute("id", "lowest");
      highest.setAttribute("id", "highest");
      humidSymbol.setAttribute("id", "humidSymbol");
      humidPercent.setAttribute("id", "humidPercent");
      windIcon.setAttribute("id", "windIcon");
      windSpeed.setAttribute("id", "windSpeed");

      windSpeed.textContent =
        "Wind Speed" +
        "\r\n" +
        " " +
        Math.round(weatherData.list[i].wind.speed) +
        " " +
        "mph";
      humidPercent.textContent =
        " Humidity" + "\r\n" + " " + weatherData.list[i].main.humidity + "%";
      lowest.textContent =
        "Low" + " " + Math.round(weatherData.list[i].main.temp_min) + "°F";
      highest.textContent =
        "High" + " " + Math.round(weatherData.list[i].main.temp_max) + "°F";
      daydiv.textContent = daysFromToday(j);
      forecastDivContainer.classList.add("forecastDiv");

      currentTemp.textContent =
        Math.round(weatherData.list[i].main.temp) + "°F";
      switch (code) {
        case "01n":
          iconDiv.style.background = 'url("' + clearSky + '")';
          break;
        case "02n":
          iconDiv.style.background = 'url("' + fewClouds + '")';
          break;
        case "03n":
          iconDiv.style.background = 'url("' + scatteredClouds + '")';
          break;
        case "04n":
          iconDiv.style.background = 'url("' + brokenClouds + '")';
          break;
        case "09n":
          iconDiv.style.background = 'url("' + showerRain + '")';
          break;
        case "10n":
          iconDiv.style.background = 'url("' + rain + '")';
          break;
        case "11n":
          iconDiv.style.background = 'url("' + thunderStorm + '")';
          break;
        case "13n":
          iconDiv.style.background = 'url("' + snow + '")';
          break;
        case "50n":
          iconDiv.style.background = 'url("' + mist + '")';
          break;
        case "01d":
          iconDiv.style.background = 'url("' + clearSky + '")';
          break;
        case "02d":
          iconDiv.style.background = 'url("' + fewClouds + '")';
          break;
        case "03d":
          iconDiv.style.background = 'url("' + scatteredClouds + '")';
          break;
        case "04d":
          iconDiv.style.background = 'url("' + brokenClouds + '")';
          break;
        case "09d":
          iconDiv.style.background = 'url("' + showerRain + '")';
          break;
        case "10d":
          iconDiv.style.background = 'url("' + rain + '")';
          break;
        case "11d":
          iconDiv.style.background = 'url("' + thunderStorm + '")';
          break;
        case "13d":
          iconDiv.style.background = 'url("' + snow + '")';
          break;
        case "50d":
          iconDiv.style.background = 'url("' + mist + '")';
          break;
      }

      windIcon.style.background = 'url("' + wind + '")';
      windIcon.style.backgroundRepeat = "no-repeat";
      windIcon.style.backgroundPosition = "center";
      humidSymbol.style.background = 'url("' + HumidIcon + '")';
      humidSymbol.style.backgroundRepeat = "no-repeat";
      humidSymbol.style.backgroundPosition = "center";

      iconDiv.style.backgroundRepeat = "no-repeat";
      iconDiv.style.backgroundPosition = "center";
      forecastDivContainer.appendChild(windSpeed);
      forecastDivContainer.appendChild(windIcon);
      forecastDivContainer.appendChild(humidPercent);
      forecastDivContainer.appendChild(daydiv);
      forecastDivContainer.appendChild(iconDiv);
      forecastDivContainer.appendChild(forecastDescription);
      forecastDivContainer.appendChild(humidSymbol);
      forecastDivContainer.appendChild(currentTemp);
      forecastDivContainer.appendChild(lowest);
      forecastDivContainer.appendChild(highest);
      right.appendChild(forecastDivContainer);
    }
  });
}
