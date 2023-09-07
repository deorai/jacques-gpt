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
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// POST endpoint for chat
app.post('/chat', async (req, res) => {
  const userInput = req.body.message;
  const clientHistory = req.body.history;


  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: "You are a sophisticated french man called Jacques. You speak with a refined language."
        },
        ...clientHistory
      ],
      model: 'gpt-4',
    });

    const response = completion.choices[0].message.content;
    res.json({ message: response });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
