import { useState, useEffect } from "react";

const Background = ({ conditionsData }) => {
  const updateTimeOfDay = () => {
    const handleTimeInMinutes = (hour, minute) => {
      // converts to minutes
      return parseInt(hour) * 60 + parseInt(minute);
    };

    const local = handleTimeInMinutes(conditionsData.local_hour, conditionsData.local_minute);
    const sunrise = handleTimeInMinutes(conditionsData.sunrise_hour, conditionsData.sunrise_minute);
    const sunset = handleTimeInMinutes(conditionsData.sunset_hour, conditionsData.sunset_minute);

    if (local >= sunrise - 90 && local <= sunrise + 90) {
      return `Sunrise ${conditionsData.condition}`;
    } else if (local >= sunset - 90 && local <= sunset + 90) {
      return `Sunset ${conditionsData.condition}`;
    } else if (conditionsData.is_day == true) {
      return `Nature Day ${conditionsData.condition}`;
    } else {
      return `Nature Night ${conditionsData.condition}`;
    }
    //uses weather data to fetch relevant images
  };

  const [orientation, setOrientation] = useState("landscape");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1536514498073-50e69d39c6cf");
  // const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const url = `https://api.unsplash.com/photos/random/?query=${updateTimeOfDay()}&orientation=${orientation}&count=1&client_id=${accessKey}`;

  const fetchImage = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const img = new Image();
      img.onload = () => {
        setImageUrl(img.src);
      };
      img.src = data[0].urls.regular;
      // only pass data when image fully loads
    } catch (error) {
      console.warn("Failed to fetch image from API.", error);
    }
  };

  useEffect(() => {
    if (conditionsData.condition !== undefined) {
      updateTimeOfDay();
      fetchImage();
    }
  }, [conditionsData]);

  const wrapperBackground = {
    // display: 'flex',
    // alignItems: 'center',
    // flexDirection: 'column',
    // justifyContent: 'center',

    backgroundImage: `url("${imageUrl}")`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    // backgroundAttachment: 'fixed',

    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "0",
    position: "absolute",
    zIndex: "-1",

    transition: "background-image 0.4s ease",
  };

  return <div style={wrapperBackground}></div>;
};

export default Background;
