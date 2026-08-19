import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure you use the exact setup requested for Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { history, prompt, context } = req.body;

      const systemInstruction = `You are Nexus, the AI assistant for JMIT Smart Campus Command Center. 
You help campus management understand incidents, resource availability, and navigate the campus.
Here is the real-time campus data (JSON):
${JSON.stringify(context, null, 2)}

Be concise, helpful, and professional. Prioritize giving actionable advice regarding incidents and available resources.
If asked about incidents, use the provided JSON to answer accurately. Format output with markdown.`;

      let contents = [];
      if (history && history.length > 0) {
        contents = [...history, { role: 'user', parts: [{ text: prompt }] }];
      } else {
        contents = [{ role: 'user', parts: [{ text: prompt }] }];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      
      if (error?.status === 503 || error?.message?.includes('503')) {
        return res.status(503).json({ error: 'The AI model is currently experiencing high demand. Please wait a moment and try again.' });
      }
      
      res.status(500).json({ error: 'Failed to generate response. Please try again later.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
