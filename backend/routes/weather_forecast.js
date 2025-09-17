const express = require('express');
const https = require('https');
const router = express.Router();

// GET /api/weather/forecast?lat=...&lon=... or ?q=City
router.get('/', (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, message: 'OPENWEATHER_API_KEY not set on server' });
  }

  const { lat, lon, q } = req.query;
  let url;
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;
  } else {
    const city = q ? encodeURIComponent(q) : 'Raipur,IN';
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  }

  console.log('[forecast] proxying to', url);

  https
    .get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        try {
          const body = JSON.parse(data);
          if (body.cod && Number(body.cod) !== 200) {
            return res.status(Number(body.cod) || 500).json({ ok: false, error: body });
          }

          // Summarize forecast into daily buckets (date string -> {min, max, items})
          const buckets = {};
          (body.list || []).forEach((item) => {
            const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
            if (!buckets[date]) buckets[date] = { min: Infinity, max: -Infinity, items: [] };
            buckets[date].min = Math.min(buckets[date].min, item.main.temp_min);
            buckets[date].max = Math.max(buckets[date].max, item.main.temp_max);
            buckets[date].items.push(item);
          });

          const days = Object.keys(buckets).slice(0, 5).map((date) => {
            const bucket = buckets[date];
            // calculate aggregates and hourly items
            const hours = bucket.items.map((it) => ({
              dt: it.dt,
              time: new Date(it.dt * 1000).toISOString(),
              temp: Math.round(it.main.temp),
              temp_min: Math.round(it.main.temp_min),
              temp_max: Math.round(it.main.temp_max),
              humidity: it.main.humidity,
              wind_speed: it.wind && it.wind.speed,
              rain: (it.rain && (it.rain['1h'] || it.rain['3h'])) || 0,
              pop: typeof it.pop !== 'undefined' ? Math.round(it.pop * 100) : null,
              weather: it.weather && it.weather[0] ? it.weather[0].main : '',
              description: it.weather && it.weather[0] ? it.weather[0].description : '',
            }));

            const precipTotal = hours.reduce((s, h) => s + (h.rain || 0), 0);
            const avgHumidity = Math.round(hours.reduce((s, h) => s + (h.humidity || 0), 0) / hours.length);
            const avgWind = Number((hours.reduce((s, h) => s + (h.wind_speed || 0), 0) / hours.length).toFixed(1));

            // choose representative weather from the hour with highest pop or first
            const rep = hours.reduce((best, h) => {
              if (!best) return h;
              if ((h.pop || 0) > (best.pop || 0)) return h;
              return best;
            }, null) || hours[0];

            return {
              date,
              temp_min: Math.round(bucket.min),
              temp_max: Math.round(bucket.max),
              weather: rep ? rep.weather : '',
              description: rep ? rep.description : '',
              precip_total_mm: Math.round(precipTotal * 10) / 10, // one decimal
              avg_humidity: avgHumidity,
              avg_wind_speed: avgWind,
              hours,
            };
          });

          return res.json({ ok: true, city: body.city, days });
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
