import styles from "./WeatherCard.module.css";

import RaindropIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/raindrops.svg";
import SnowflakeIcon from "/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/snowflake.svg";

const WeatherCard = ({ weather, handleTimeConversion, metricUnits, ForecastTable }) => {
  const baseUrl = import.meta.env.BASE_URL;

  if (weather !== null) {
    return (
      <div className={styles.hourlyWrapper}>
        <ul className={styles.hourlyHeader}>
          <li>{metricUnits ? weather.time : handleTimeConversion(weather.time, 12)}</li>
          <li>
            <ul className={styles.hourlyHeadContent}>
              <li>
                <img
                  src={`${baseUrl}/icons/weather/Meteocons/weather-icons-dev/production/fill/svg/${
                    ForecastTable[weather.code][weather.is_day].icon
                  }`}
                  alt="Forecast icon"
                />
              </li>
              <li>
                <ul className={styles.hourlyTempWrap}>
                  <li>{metricUnits ? parseInt(weather.temp_c) : parseInt(weather.temp_f)}</li>
                  <li>
                    <ul className={styles.hourlyFeelWrap}>
                      <li>{metricUnits ? "°C" : "°F"}</li>
                      <li>
                        {metricUnits ? `${parseInt(weather.feelslike_c)}°` : `${parseInt(weather.feelslike_f)}°`}
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <ul className={styles.hourlyForecast}>
          <li>{ForecastTable[weather.code][weather.is_day].text}</li>
          {/* <li>Considerable Showers of Ice Pellets</li> */}
        </ul>

        <hr style={{ width: "60%" }} />

        <ul>
          <li>
            Wind:&nbsp;
            {metricUnits ? `${weather.wind_kph}\u00A0km/h` : `${weather.wind_mph}\u00A0mph`}
          </li>
          <li>
            Precipitation:&nbsp;
            {metricUnits ? `${weather.precip_mm}\u00A0mm` : `${weather.precip_in}\u2033`}
          </li>
          <li>Humidity:&nbsp;{weather.humidity}%</li>
          {/* <li>Rain:&nbsp;{weather.chance_of_rain}%</li> */}
          {/* <li>Snow:&nbsp;{weather.chance_of_snow}%</li> */}
        </ul>

        <ul className={styles.hourlyRain}>
          <li>
            <ul>
              <li>
                <img src={RaindropIcon} alt="Raindrops Icon" />
              </li>
              <li>{weather.chance_of_rain}%</li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <img src={SnowflakeIcon} alt="Snowflake Icon" />
              </li>
              <li>{weather.chance_of_snow}%</li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
};
export default WeatherCard;
