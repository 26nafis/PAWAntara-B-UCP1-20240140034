const express = require('express');
const router = express.Router();
const users = require('../../data/users.json');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'fail', message: 'Username dan password wajib diisi' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ status: 'fail', message: 'Kredensial salah' });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  };

  return res.json({
    status: 'success',
    message: 'Login berhasil',
    data: req.session.user
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Gagal logout' });
    }
    res.clearCookie('connect.sid');
    return res.json({ status: 'success', message: 'Logout berhasil' });
  });
});

module.exports = router;