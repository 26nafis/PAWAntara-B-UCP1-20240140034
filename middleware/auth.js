// Auth Guard untuk Rute Halaman EJS
const requireAuthPage = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
};

// Auth Guard untuk Rute REST API
const requireAuthApi = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    status: 'fail',
    message: 'Akses ditolak. Silakan login terlebih dahulu.'
  });
};

module.exports = { requireAuthPage, requireAuthApi };