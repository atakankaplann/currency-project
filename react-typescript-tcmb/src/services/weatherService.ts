import axios from 'axios';

export const getWeather = async (city: string) => {
  const response = await axios.get(`https://api.collectapi.com/weather/getWeather?data.lang=tr&data.city=${city}`, {
    headers: {
      "content-type": "application/json",
      "authorization": "apikey 7bPbFnokR0MTeY2elcUodC:0YMSQ5KwZlMZwXmHfwpoQu"
    }
  });
  return response.data;
};
