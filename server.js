const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/tcmb', async (req, res) => {
  try {
    const response = await axios.get('https://www.tcmb.gov.tr/kurlar/today.xml');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Istanbul';
  try {
    const response = await axios.get(`https://api.collectapi.com/weather/getWeather?data.lang=tr&data.city=${city}`, {
      headers: {
        "content-type": "application/json",
        "authorization": "apikey 7bPbFnokR0MTeY2elcUodC:0YMSQ5KwZlMZwXmHfwpoQu"
      }
    });
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message, error.response?.data);
    res.status(500).send('Error fetching weather data');
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));


