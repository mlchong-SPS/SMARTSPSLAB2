/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // API router FIRST
  app.post('/api/explain', async (req, res) => {
    try {
      const { questionDetail, systemPrompt, lang } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      // Handle sandbox demo mode visually and prevent crashing
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
        return res.json({
          explanation: lang === 'zh'
            ? '💡 **演示模式开启**。后台检测到未配置您的开发密匙。请在右侧菜单选择「设置 > 密匙配置」，添加您的密钥以查看完整的 AI 个性化科学讲解！'
            : lang === 'ms'
            ? '💡 **Modo Demo Diaktifkan**. Kunci secrets API tidak dikonfigurasikan di latar belakang. Sila pergi ke tab "Settings > Secrets" untuk mula mengaktifkan bimbingan sains AI tersuai!'
            : '💡 **AI Sandbox Mode Active**. No live Gemini API Key detected in settings. Please configure your key in **Settings > Secrets** to activate real-time personalized tutoring and custom analogies.'
        });
      }

      // Initialize Google GenAI client cleanly on the server-side 
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Request text explanation from gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: questionDetail,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6
        }
      });

      res.json({ explanation: response.text });
    } catch (err: any) {
      console.error('AI Tutor Query Error:', err);
      res.status(550).json({ error: err.message || 'Error occurred querying the Gemini agent.' });
    }
  });

  // Health endpoint checks
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Download static standalone HTML file route
  app.get('/api/download-html', (req, res) => {
    const filePath = path.join(process.cwd(), 'smart-sps-lab.html');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="smart-sps-lab.html"');
      res.sendFile(filePath);
    } else {
      res.status(404).send('Standalone HTML bundle has not been built yet. Please complete the compilation process.');
    }
  });

  // Vite middleware for development vs static build router in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Science Process Skills server running at http://localhost:${PORT}`);
  });
}

startServer();
