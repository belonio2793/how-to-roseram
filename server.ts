import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// AI Tutorial / Video Script Generator
app.post('/api/generate-tutorial', async (req, res) => {
  try {
    const { topic, audience, format, durationTarget } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Fallback generator will provide curated templates.',
      });
    }

    const systemPrompt = `You are the lead technical instructional designer and video producer for Roseram.com.
Roseram is a browser-first AI workspace featuring:
1. Agentic Coding & IDE (browser file tree, code editor, integrated terminal, Plan -> Build -> Review workflow).
2. Multi-Model Routing Architecture (seamlessly switching or routing between Claude 3.7 Sonnet, GPT-4o, Gemini 2.5 Pro without prompt rewriting).
3. Bounded Automation with Human-in-the-Loop review proposals (reviewing code diff proposals before applying them, interactive terminal during execution, token usage ledger).
4. Responsive Web Application Generation & Live Preview (20+ business templates: storefronts, dashboards, internal tools).
5. Generative Campaign Studio & Marketing Automation (auto-generating search-optimized emails, follow-ups, and social creatives from a public URL).
6. GitHub repository integration & forked branch sync.

Generate an engaging, crystal-clear 4 to 6 scene how-to tutorial video script for:
Topic: "${topic || 'Getting Started with Roseram.com'}"
Audience: "${audience || 'Developer'}"
Video Format: "${format || '16:9'}"
Duration: "${durationTarget || '60 seconds'}"

Return purely valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a step-by-step Roseram.com how-to video script for: "${topic}". Make sure the narration is punchy and actionable. Include simulated UI actions and hotkey/pro tips.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedDuration: { type: Type.INTEGER },
            targetAudience: { type: Type.STRING },
            category: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  narration: { type: Type.STRING },
                  duration: { type: Type.INTEGER },
                  focusArea: {
                    type: Type.STRING,
                    description: 'One of: ide, router, proposals, terminal, preview, campaign, ledger',
                  },
                  codeSnippet: { type: Type.STRING },
                  terminalCommand: { type: Type.STRING },
                  modelSelected: { type: Type.STRING },
                  cursorAction: {
                    type: Type.OBJECT,
                    properties: {
                      target: { type: Type.STRING },
                      actionType: { type: Type.STRING },
                      xPercent: { type: Type.NUMBER },
                      yPercent: { type: Type.NUMBER },
                      label: { type: Type.STRING },
                    },
                    required: ['target', 'actionType', 'xPercent', 'yPercent'],
                  },
                  calloutBadge: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      type: { type: Type.STRING },
                      position: { type: Type.STRING },
                    },
                    required: ['text', 'type', 'position'],
                  },
                },
                required: ['id', 'title', 'subtitle', 'narration', 'duration', 'focusArea'],
              },
            },
          },
          required: ['title', 'description', 'estimatedDuration', 'scenes'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating tutorial:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate tutorial script',
    });
  }
});

// Gemini TTS API
app.post('/api/generate-tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS synthesis' });
    }

    if (!ai) {
      return res.json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured. Falling back to browser speech synthesis.',
      });
    }

    const validVoice = ['Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'].includes(voice)
      ? voice
      : 'Kore';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500), // Keep concise for snappy narration
              speechMetadata: {
                style: 'Clear, modern, engaging software tutorial instructor with friendly professional cadence',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: validVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      return res.json({
        fallback: true,
        message: 'No audio bytes returned by TTS model. Falling back to Web Speech.',
      });
    }
  } catch (error: any) {
    console.error('Error in TTS generation:', error);
    return res.json({
      fallback: true,
      error: error.message,
    });
  }
});

// Serve Vite dev server or static build
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Roseram Video Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
