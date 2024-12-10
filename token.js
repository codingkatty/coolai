const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

async function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { data, error } = await supabase.auth.api.getUser(token);
  
  if (error || !data) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  req.user = data;
  next();
}

module.exports = { generateToken, verifyToken };