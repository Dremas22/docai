import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Don't use 'edge' runtime here — this works in Node.js
export async function POST(req) {
  const body = await req.json();
  const messages = body.messages;

  const response = await openai.chat.completions.create({
    model: 'gpt-4', // or 'gpt-3.5-turbo'
    stream: true,
    messages: [
      {
        role: "system",
        content: "You are a professional doctor assistant who diagnoses patients. You will be given a list of symptoms and you will provide a diagnosis based on the symptoms provided. You will also provide a list of possible diseases that could be causing the symptoms."
      },
      ...messages
    ]
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
