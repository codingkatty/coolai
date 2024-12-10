const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { generateToken, verifyToken } = require('./token');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('Signup request received:', { email, password });

  try {
    const { user, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      console.error('Error during signup:', error.message);
      console.log('Sending error response:', { error: error.message });
      return res.status(400).json({ error: error.message || 'Signup failed.' });
    }
    
    console.log('User signed up successfully:', user);
    res.json({ user });
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password });

  try {
    const { session, error } = await supabase.auth.signIn({ email, password });
    
    if (error) {
      console.error('Error during login:', error.message);
      console.log('Sending error response:', { error: error.message });
      return res.status(400).json({ error: error.message || 'Login failed.' });
    }
    
    const token = generateToken(session.user);
    const { data, error: insertError } = await supabase.from('api_tokens').insert([{ user_id: session.user.id, token }]);
    
    if (insertError) {
      console.error('Error storing API token:', insertError.message);
      return res.status(500).json({ error: 'Failed to store API token' });
    }
    
    console.log('Login successful, token generated:', token);
    res.json({ token });
  } catch (err) {
    console.error('Unexpected error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});