import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

import "dotenv/config"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Calls Google Gemini directly
  const result = await streamText({
    model: google('gemini-2.5-flash'), // or 'gemini-1.5-pro'
    messages: convertToCoreMessages(messages),
  });

  // Returns the stream automatically in the correct format
  return result.toTextStreamResponse();
}