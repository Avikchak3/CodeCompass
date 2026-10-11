const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

// Base function to call Groq API
const callGroq = async (systemPrompt, userMessage) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error('Groq API Error:', err.response?.data || err.message);
    throw new Error('Failed to get response from Groq API');
  }
};

// Analyze the full project
const analyzeProject = async (context, fileNames) => {
  const system = `You are a senior software developer helping onboard a new developer to a project. 
You will analyze the provided codebase and give clear, beginner-friendly guidance.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`;

  const user = `Analyze this project and return a JSON object with exactly this structure:
{
  "projectName": "string",
  "projectType": "string (e.g. React Web App, Python REST API)",
  "summary": "2-3 sentence plain english description",
  "stack": [
    {"name": "string", "version": "string or ?", "role": "string", "usage": 0-100}
  ],
  "roadmap": [
    {
      "step": 1,
      "title": "string",
      "description": "string (2-3 sentences, beginner friendly)",
      "tag": "string (e.g. Start here, Setup, Core Logic)",
      "color": "#hexcolor"
    }
  ],
  "keyFiles": [
    {
      "path": "string (filename)",
      "importance": "Critical | Important | Reference",
      "why": "string (one line reason)",
      "description": "2-3 sentences about what this file does"
    }
  ],
  "mermaidDiagram": "valid mermaid flowchart TD with 5-8 nodes showing architecture"
}

Files in project: ${fileNames}

File contents:
${context.slice(0, 15000)}

Rules:
- roadmap must have 5-7 steps in logical order for a new developer
- keyFiles must be top 5 most important files
- Be specific to the actual files uploaded, not generic
- mermaidDiagram must be valid mermaid syntax`;

  const raw = await callGroq(system, user);

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    throw new Error('Groq returned invalid JSON');
  }
};

// Chat about the project
const chatAboutProject = async (context, chatHistory, newMessage) => {
  const system = `You are a helpful senior developer helping onboard a junior developer to a project.
You have full access to the project files below. Answer questions clearly and practically.
Always refer to the actual code when possible. Keep answers concise and beginner-friendly.

PROJECT FILES:
${context.slice(0, 12000)}`;

  try {
    const messages = [
      { role: 'system', content: system },
      ...chatHistory,
      { role: 'user', content: newMessage }
    ];

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        max_tokens: 1000,
        messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error('Groq Chat Error:', err.response?.data || err.message);
    throw new Error('Failed to get chat response');
  }
};

module.exports = { analyzeProject, chatAboutProject };
