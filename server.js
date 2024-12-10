const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { generateToken, verifyToken } = require('./token');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('api_tokens').select('*').limit(1);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error('Supabase Test Error:', err);
    res.status(500).json({ error: 'Supabase connection failed.' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('Signup request received:', { email, password });

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('Signup response data:', data);
    console.log('Signup response error:', error);

    if (error) {
      console.error('Error during signup:', error.message);
      return res.status(400).json({ error: error.message || 'Signup failed.' });
    }

    if (data && data.user) {
      console.log('User signed up successfully:', data.user);
      res.json({ user: data.user });
    } else {
      console.warn('Signup response does not contain user data:', data);
      res.status(400).json({ error: 'Signup failed to return user data.' });
    }
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Login response data:', data);
    console.log('Login response error:', error);

    if (error) {
      console.error('Error during login:', error.message);
      return res.status(400).json({ error: error.message || 'Login failed.' });
    }

    if (data && data.user) {
      const token = generateToken(data.user);
      console.log('Generated JWT Token:', token);

      const { error: insertError } = await supabase
        .from('api_tokens')
        .insert([{ user_id: data.user.id, token }]);

      console.log('Insert into api_tokens error:', insertError);

      if (insertError) {
        console.error('Error storing API token:', insertError.message);
        return res.status(500).json({ error: 'Failed to store API token' });
      }

      console.log('Login successful, token generated:', token);
      res.json({ token });
    } else {
      console.warn('Login response does not contain user data:', data);
      res.status(400).json({ error: 'Login failed to return user data.' });
    }
  } catch (err) {
    console.error('Unexpected error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/generate', verifyToken, async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('Generating response for prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    console.log('Generated response:', response);
    
    res.json({ 
      success: true,
      response: response 
    });

  } catch (err) {
    console.error('Error generating response:', err);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: err.message 
    });
  }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });