const express = require('express');
const { chatAboutProject } = require('../services/claudeService');

const router = express.Router();

// POST /api/chat
// Takes message + chat history + project context, returns Claude's reply
router.post('/', async (req, res) => {
  try {
    const { message, chatHistory, context } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!context) {
      return res.status(400).json({ error: 'Project context is missing' });
    }

    console.log(`Chat message received: "${message.slice(0, 50)}..."`);

    // Send to Claude with full project context
    const reply = await chatAboutProject(
      context,
      chatHistory || [],
      message
    );

    console.log('Chat reply generated');

    res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({
      error: err.message || 'Chat failed'
    });
  }
});

module.exports = router;