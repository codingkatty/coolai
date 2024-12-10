const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = user;
    next();
  });
}

module.exports = { generateToken, verifyToken };