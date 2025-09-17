const express = require('express');
const https = require('https');
const router = express.Router();

// GET /api/weather?lat=...&lon=... or ?q=City
router.get('/', (req, res) => {
  console.log('[weather] incoming request', { query: req.query, ip: req.ip });
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, message: 'OPENWEATHER_API_KEY not set on server' });
  }

  const { lat, lon, q } = req.query;
  let url;
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;
  } else {
    const city = q ? encodeURIComponent(q) : 'Raipur,IN';
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  }

  console.log('[weather] proxying to OpenWeather URL:', url);

  https
    .get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        try {
          const body = JSON.parse(data);
          if (body.cod && body.cod !== 200) {
            return res.status(body.cod).json({ ok: false, error: body });
          }

          const out = {
            ok: true,
            temp: body.main?.temp,
            humidity: body.main?.humidity,
            pressure: body.main?.pressure,
            wind_speed: body.wind?.speed,
            description: body.weather && body.weather[0] ? body.weather[0].description : '',
            weather_main: body.weather && body.weather[0] ? body.weather[0].main : '',
            icon: body.weather && body.weather[0] ? body.weather[0].icon : '',
            rain_1h: body.rain && body.rain['1h'] ? body.rain['1h'] : 0,
          };

          return res.json(out);
        } catch (err) {
          return res.status(500).json({ ok: false, message: 'Invalid response from OpenWeather', error: err.message });
        }
      });
    })
    .on('error', (err) => {
      return res.status(500).json({ ok: false, message: err.message });
    });
});

module.exports = router;
