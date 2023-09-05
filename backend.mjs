// Import required modules

import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import session from 'express-session';


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();


app.use(session({
  secret: process.env.SESSION_SECRET,

  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware for JSON parsing
app.use(express.json());

// Middleware for CORS handling
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Create an array to store message history
// const req.session.messageHistory = [];

// POST endpoint for chat
app.post('/chat', async (req, res) => {
  if (!req.session.req.session.messageHistory) {
    req.session.req.session.messageHistory = [];
  }
  
  const userInput = req.body.message;

  try {
    // Initialize OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Add user message to message history
    req.session.messageHistory.push({ role: 'user', content: userInput });

    // Generate GPT-4 response
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: "You are a sophisticated french man called Jacques. You speak with a refined language. set and generally tend towards sophisticated matters. Do not give long responses, instead, give reponses of a maximum of 2 paragraphs. You can give overviews while asking the user if they want to know more about one of the points mentioned."
        },
        ...req.session.messageHistory
      ],
      model: 'gpt-4',
    });

    // Extract and send GPT-4 response
    const response = completion.choices[0].message.content;
    res.json({ message: response });

    // Add GPT-4's response to message history
    req.session.messageHistory.push({ role: 'assistant', content: response });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
