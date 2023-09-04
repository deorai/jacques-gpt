// Import required modules
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

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
const messageHistory = [];

// POST endpoint for chat
app.post('/chat', async (req, res) => {
  const userInput = req.body.message;

  try {
    // Initialize OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Add user message to message history
    messageHistory.push({ role: 'user', content: userInput });

    // Generate GPT-4 response
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: "You are a sophisticated french man called Jacques. You speak with a refined language. set and generally tend towards sophisticated matters. Do not give long responses, instead, give reponses of a maximum of 2 paragraphs. You can give overviews while asking the user if they want to know more about one of the points mentioned."
        },
        ...messageHistory
      ],
      model: 'gpt-4',
    });

    // Extract and send GPT-4 response
    const response = completion.choices[0].message.content;
    res.json({ message: response });

    // Add GPT-4's response to message history
    messageHistory.push({ role: 'assistant', content: response });

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
