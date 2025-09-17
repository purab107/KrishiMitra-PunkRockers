const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Demo: accept 'User' / 'Password'
  if (username === 'User' && password === 'Password') {
    return res.json({ ok: true, token: 'demo-token', user: { name: 'Demo User' } });
  }

  return res.status(401).json({ ok: false, message: 'Invalid credentials' });
});

module.exports = router;
