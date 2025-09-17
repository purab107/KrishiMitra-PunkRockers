// agmarket proxy removed — kept placeholder so repo stays consistent while API key is pending.
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(404).json({ ok: false, message: 'agmarket proxy not enabled' });
});

module.exports = router;
