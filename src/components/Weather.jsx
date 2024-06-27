import styles from "./Weather.module.css";
import { useState, useEffect } from "react";
import ForecastTable from "/src/ForecastTable.json";
import WeatherCard from "./WeatherCard";

import SearchIcon from "/icons/searchbar/svgrepo/Dazzle-Line-Icons/search-alt-svgrepo-com.svg";
import RefreshIcon from "/icons/searchbar/svgrepo/Dazzle-Line-Icons/refresh-cw-alt-svgrepo-com.svg";
import LocationIcon from "/icons/searchbar/svgrepo/Dazzle-Line-Icons/location-pin-svgrepo-com.svg";

import SunriseIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/sunrise.svg";
import SunsetIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/sunset.svg";
import WindWeakIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/windsock-weak.svg";
import WindStrongIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/windsock.svg";
import PrecipitationIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/raindrop-measure.svg";
import HumidityIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/humidity.svg";

const Weather = ({ onCurrentConditions }) => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [metricUnits, setMetricUnits] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHERAPI_API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&alerts=no`;
  const baseUrl = import.meta.env.BASE_URL;

  const handleTimeConversion = (data, format) => {
    const handleFormat = () => {
      switch (format) {
        //switch statement to enforce format passing
        case 12:
          return "en-US";
        case 24:
          return "en-GB";
        default:
          return null;
      }
    };
    const removeSeconds = { hour: "numeric", minute: "numeric" };
    return new Date("0001-01-01 " + data).toLocaleTimeString(
      //dummy date
      handleFormat(),
      removeSeconds
    );
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        console.warn(error.message);
        setLocation("auto:ip");
        //defaults to weather api location
      }
    );
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      onCurrentConditions(
        // data.current.condition.text,
        ForecastTable[data.current.condition.code][data.current.is_day].text,
        data.location.localtime,
        data.current.is_day,
        handleTimeConversion(data.forecast.forecastday[0].astro.sunrise, 24),
        handleTimeConversion(data.forecast.forecastday[0].astro.sunset, 24)
        //sends data back to App
      );

      const weatherData = [];
      const currentDay = 0;
      //(0, 1, 2)
      const currentHour = parseInt(data.location.localtime.slice(11, -3));

      weatherData.push({
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        last_updated: data.current.last_updated.slice(11),
        localtime: data.location.localtime.slice(11).padStart(5, 0),
        is_day: data.current.is_day,

        temp_f: data.current.temp_f,
        temp_c: data.current.temp_c,
        feelslike_f: data.current.feelslike_f,
        feelslike_c: data.current.feelslike_c,
        humidity: data.current.humidity,
        precip_in: data.current.precip_in,
        precip_mm: data.current.precip_mm,
        wind_mph: data.current.wind_mph,
        wind_kph: data.current.wind_kph,

        code: data.current.condition.code,
        // condition: data.current.condition.text,
        // condition_icon: data.current.condition.icon,

        mintemp_f: data.forecast.forecastday[0].day.mintemp_f,
        mintemp_c: data.forecast.forecastday[0].day.mintemp_c,
        maxtemp_f: data.forecast.forecastday[0].day.maxtemp_f,
        maxtemp_c: data.forecast.forecastday[0].day.maxtemp_c,
        sunrise: handleTimeConversion(data.forecast.forecastday[0].astro.sunrise, 24),
        sunset: handleTimeConversion(data.forecast.forecastday[0].astro.sunset, 24),
      });

      for (let index = 1; index <= 6; index++) {
        const hoursAhead = (currentHour + index) % 24;
        //makes sure hours range from 0 to 23

        weatherData.push({
          temp_f: data.forecast.forecastday[currentDay].hour[hoursAhead].temp_f,
          temp_c: data.forecast.forecastday[currentDay].hour[hoursAhead].temp_c,
          feelslike_f: data.forecast.forecastday[currentDay].hour[hoursAhead].feelslike_f,
          feelslike_c: data.forecast.forecastday[currentDay].hour[hoursAhead].feelslike_c,
          humidity: data.forecast.forecastday[currentDay].hour[hoursAhead].humidity,
          precip_in: data.forecast.forecastday[currentDay].hour[hoursAhead].precip_in,
          precip_mm: data.forecast.forecastday[currentDay].hour[hoursAhead].precip_mm,
          wind_mph: data.forecast.forecastday[currentDay].hour[hoursAhead].wind_mph,
          wind_kph: data.forecast.forecastday[currentDay].hour[hoursAhead].wind_kph,

          is_day: data.forecast.forecastday[currentDay].hour[hoursAhead].is_day,
          code: data.forecast.forecastday[currentDay].hour[hoursAhead].condition.code,
          // condition: data.forecast.forecastday[currentDay].hour[hoursAhead].condition.text,
          // condition_icon: data.forecast.forecastday[currentDay].hour[hoursAhead].condition.icon,

          chance_of_rain: data.forecast.forecastday[currentDay].hour[hoursAhead].chance_of_rain,
          chance_of_snow: data.forecast.forecastday[currentDay].hour[hoursAhead].chance_of_snow,
          time: data.forecast.forecastday[currentDay].hour[hoursAhead].time.slice(11),
          //passing only the hours
        });
      }
      setWeather(weatherData);
    } catch (error) {
      console.warn("Failed to fetch weather data from API.", error);
    }
  };

  useEffect(() => {
    location == null && getLocation();
    location !== null && fetchWeather();

    const intervalId = setInterval(fetchWeather, 900000);
    //updates every 15 minutes
    return () => clearInterval(intervalId);
  }, [location]);

  const [locationInput, setLocationInput] = useState("");
  const handleChange = (event) => {
    setLocationInput(event.target.value);
  };
  const handleSend = () => {
    if (locationInput) {
      setLocation(locationInput);
      setLocationInput("");
    }
  };

  if (weather !== null) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <ul className={styles.headerLeft}>
            <li className={styles.searchBar}>
              <button className={styles.searchButton} onClick={handleSend} title="Search">
                <img src={SearchIcon} alt="Search Icon" />
              </button>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="City, Country or ZIP Code"
                value={locationInput}
                onChange={handleChange}
              />
              <button className={styles.refreshButton} onClick={fetchWeather} title="Refresh">
                <img src={RefreshIcon} alt="Refresh Icon" />
              </button>
              <button className={styles.locationButton} onClick={getLocation} title="Get Current Location">
                <img src={LocationIcon} alt="Location Icon" />
              </button>
            </li>
            <li>
              {weather[0].name}, {weather[0].region}
              <br />
              {weather[0].country}
            </li>
          </ul>

          <ul className={styles.headerRight}>
            <li>
              Local Time:&nbsp;
              {metricUnits ? weather[0].localtime : handleTimeConversion(weather[0].localtime, 12)}
              <br />
              Last Updated:&nbsp;
              {metricUnits ? weather[0].last_updated : handleTimeConversion(weather[0].last_updated, 12)}
            </li>
            <li>
              <ul className={styles.switchWrap}>
                <li>Units Toggle</li>
                <li>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={metricUnits}
                      onChange={() => setMetricUnits((prevMetricUnits) => !prevMetricUnits)}
                    ></input>
                    <span className={styles.slider}></span>
                  </label>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className={styles.mainWeather}>
          <ul className={styles.mainForecast}>
            <li>Forecast</li>
            <li>
              <img
                src={`${baseUrl}/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/${
                  ForecastTable[weather[0].code][weather[0].is_day].icon
                }`}
                alt="Forecast icon"
              />
            </li>
            <li>{ForecastTable[weather[0].code][weather[0].is_day].text}</li>
            {/* <li>Considerable Showers of Ice Pellets</li> */}
          </ul>

          <ul>
            <li>Temperature</li>
            <li>
              <ul className={styles.mainTempWrap}>
                <li>{metricUnits ? parseInt(weather[0].temp_c) : parseInt(weather[0].temp_f)}</li>
                <li>
                  <ul className={styles.mainFeelWrap}>
                    <li>{metricUnits ? "°C" : "°F"}</li>
                    <li>
                      {metricUnits ? `${parseInt(weather[0].feelslike_c)}°` : `${parseInt(weather[0].feelslike_f)}°`}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              {metricUnits ? `${weather[0].mintemp_c}°` : `${weather[0].mintemp_f}°`}
              &nbsp;/&nbsp;
              {metricUnits ? `${weather[0].maxtemp_c}°` : `${weather[0].maxtemp_f}°`}
            </li>
          </ul>

          <ul>
            <li>Sunrise</li>
            <li>
              <img src={SunriseIcon} alt="Sunrise Icon" />
            </li>
            <li>{metricUnits ? weather[0].sunrise : handleTimeConversion(weather[0].sunrise, 12)}</li>
          </ul>
          <ul>
            <li>Sunset</li>
            <li>
              <img src={SunsetIcon} alt="Sunset Icon" />
            </li>
            <li>{metricUnits ? weather[0].sunset : handleTimeConversion(weather[0].sunset, 12)}</li>
          </ul>
          <ul>
            <li>Wind</li>
            <li>
              <img src={weather[0].wind_mph <= 25 ? WindWeakIcon : WindStrongIcon} alt="Wind Icon" />
            </li>
            <li>{metricUnits ? `${weather[0].wind_kph}\u00A0km/h` : `${weather[0].wind_mph}\u00A0mph`}</li>
          </ul>
          <ul>
            <li>Precipitation</li>
            <li>
              <img src={PrecipitationIcon} alt="Precipitation Icon" />
            </li>
            <li>{metricUnits ? `${weather[0].precip_mm}\u00A0mm` : `${weather[0].precip_in}\u2033`}</li>
          </ul>
          <ul>
            <li>Humidity</li>
            <li>
              <img src={HumidityIcon} alt="Humidity Icon" />
            </li>
            <li>{weather[0].humidity}%</li>
          </ul>
        </div>

        <div className={styles.hourlyWeather}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <WeatherCard
              key={index}
              weather={weather[index]}
              handleTimeConversion={handleTimeConversion}
              metricUnits={metricUnits}
              ForecastTable={ForecastTable}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }
};

export default Weather;
