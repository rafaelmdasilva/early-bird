import "./App.css";
import Weather from "./components/Weather";
import Background from "./components/Background";
import { useState } from "react";

function App() {
  const [conditionsData, setConditionsData] = useState({});

  const handleCurrentConditions = (condition, localtime, is_day, sunrise, sunset) => {
    //callback function to fetch conditionsData data and pass down to background
    setConditionsData({
      condition: condition,
      local_hour: localtime.slice(11, -3).padStart(2, 0),
      local_minute: localtime.slice(14),
      is_day: is_day,
      sunrise_hour: sunrise.slice(0, -3),
      sunrise_minute: sunrise.slice(3),
      sunset_hour: sunset.slice(0, -3),
      sunset_minute: sunset.slice(3),
    });
  };

  return (
    <div className="main">
      <Background conditionsData={conditionsData} />
      <Weather onCurrentConditions={handleCurrentConditions} />
    </div>
  );
}

export default App;
