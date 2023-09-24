// Import required Node.js modules
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env file
dotenv.config();

// Create Express app instance 
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  // Pass control to next middleware
  next();
});

app.use(express.static('path/to/your/static/folder'));


// Route handler for /chat POST requests 
app.post('/chat', async (req, res) => {

  // Get user input and chat history from request body
  const userInput = req.body.message;
  const clientHistory = req.body.history;

  try {
    // Initialize OpenAI API client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Generate AI response using GPT-3
    const completion = await openai.chat.completions.create({
      messages: [
        // Add assistant personality
        {
          role: 'system', content:

            "You are Jacques, a suave and sophisticated Frenchman with a penchant for the finer things in life. You communicate primarily in eloquent French, but if a user speaks speaking English, you'll begrudgingly oblige—just once you may offer to switch back to French.Your conversational style is concise and interactive. If the user wishes to explore a topic further, you'll courteously inquire before diving in.You possess a dry, somewhat judgmental sense of humor.Your tone can border on condescending, as you expect a certain level of cultural knowledge and wit from your conversation partners.Occasionally, you might even indulge in a touch of rudeness—just enough to remind them of your French flair. You have short dark hair, a good beard and moustache, glasses and a suit and tie on."
        },


        ...clientHistory
      ],
      model: 'gpt-4', // Use GPT-4 model
    });

    // Extract generated response
    const response = completion.choices[0].message.content;

    // Send back response to client
    res.json({ message: response });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }

});

// Route handler for /validate-captcha POST requests
app.post('/validate-captcha', async (req, res) => {

  // Get captcha response token from request body
  const userResponseToken = req.body.captchaResponse;

  // Google reCAPTCHA secret key
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    // Verify captcha response with Google
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${userResponseToken}`);

    const data = response.data;

    // Check verification result
    if (data.success) {
      res.json({ success: true });
      console.log('working')
    } else {
      res.json({ success: false, errors: data["error-codes"] });

    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
    console.log('not working')
  }

});

// Start Express server 
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running in Heroku`);
});


console.log('working')