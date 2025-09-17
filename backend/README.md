KrishiMitra - Backend (demo)

Quick start

1. Install dependencies

   cd backend; npm install

2. Run in development (auto-restart on changes)

   npm run dev

3. Health-check

   GET http://localhost:5000/

API (demo)

- POST /api/auth/login
  - body: { username, password }
  - demo credentials: { username: 'User', password: 'Password' }

- GET /api/crops/recommend
  - query: soilType, pH, season
  - example: /api/crops/recommend?soilType=loam&pH=7&season=kharif

- GET /api/weather
   - proxy to OpenWeatherMap Current Weather API
   - query params: lat & lon OR q (city name). Units set to metric.
   - example: /api/weather?q=Raipur,IN
   - requires environment variable: OPENWEATHER_API_KEY


Notes

This is a minimal demo backend to get you started. I can:
- add real auth with JWT and persistent users
- wire a database (Postgres, MongoDB)
- add ML/model endpoints for crop recommendation

Tell me which direction you prefer and I'll scaffold it next.
