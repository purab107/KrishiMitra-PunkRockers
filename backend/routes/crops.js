const express = require('express');
const router = express.Router();

// GET /api/crops/recommend
// Query params: soilType, pH, season, previousCrop (optional)
router.get('/recommend', (req, res) => {
  const { soilType = 'clay', pH = '6.5', season = 'kharif' } = req.query;

  // Very simple demo logic — replace with ML/model later
  const recommendations = [];
  if (season.toLowerCase() === 'kharif') {
    recommendations.push({ crop: 'Rice', confidence: 0.9 });
    recommendations.push({ crop: 'Maize', confidence: 0.6 });
  } else {
    recommendations.push({ crop: 'Wheat', confidence: 0.85 });
    recommendations.push({ crop: 'Barley', confidence: 0.5 });
  }

  return res.json({ ok: true, soilType, pH, season, recommendations });
});

module.exports = router;
