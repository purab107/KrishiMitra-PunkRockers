const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple health-check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'KrishiMitra backend running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/weather/forecast', require('./routes/weather_forecast'));
app.use('/api/market', require('./routes/market'));

// Catch-all 404 handler that returns JSON instead of HTML
app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Not found: ${req.method} ${req.originalUrl}` });
});

// Generic error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ ok: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
