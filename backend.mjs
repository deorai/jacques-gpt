import express from 'express';
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

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

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Create an array to store message history
const messageHistory = [];

app.post('/chat', async (req, res) => {
  const userInput = req.body.message;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Add user message to message history
    messageHistory.push({ role: 'user', content: userInput });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system', content: "You are a sophisticated french man  called Jacques who only  speaks french. You speak with a refined language. set and generally tend towards sophisticated matters."
        },
        ...messageHistory
      ],
      model: 'gpt-4',
    });

    const response = completion.choices[0].message.content;
    res.json({ message: response });

    // Add GPT-4's response to message history
    messageHistory.push({ role: 'assistant', content: response });


  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'An error occurred' });
  }

});
