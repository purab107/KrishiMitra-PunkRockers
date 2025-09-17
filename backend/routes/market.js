const express = require('express');
const router = express.Router();

// GET /api/market/prices
router.get('/prices', (req, res) => {
  // Demo static data; in future this would query a real data source.
  const data = {
    ok: true,
    date: new Date().toISOString(),
    markets: [
      { name: 'रायपुर', crop: 'सोयाबीन', price: 4200, unit: '₹/क्विंटल' },
      { name: 'बिलासपुर', crop: 'सोयाबीन', price: 4150, unit: '₹/क्विंटल' },
      { name: 'राजनांदगांव', crop: 'सोयाबीन', price: 4300, unit: '₹/क्विंटल' },
      { name: 'दुर्ग', crop: 'धान', price: 2200, unit: '₹/क्विंटल' },
    ],
  };
  res.json(data);
});

module.exports = router;
