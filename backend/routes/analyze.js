const express = require('express');
const path = require('path');
const fs = require('fs');
const { parseAllFiles, buildContext } = require('../services/fileParser');
const { analyzeProject } = require('../services/claudeService');

const router = express.Router();

// POST /api/analyze
// Takes file paths, parses them, sends to Claude
router.post('/', async (req, res) => {
  try {
    const { files } = req.body;

    // Validate input
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided for analysis' });
    }

    console.log(`Analyzing ${files.length} files...`);

    // Step 1 — Parse all files into readable text
    const parsedFiles = parseAllFiles(files);

    // Step 2 — Build combined context string
    const context = buildContext(parsedFiles);

    // Step 3 — Get file names for Claude prompt
    const fileNames = parsedFiles.map(f => f.name).join(', ');

    console.log('Sending to Groq for analysis...');

    // Step 4 — Send to Claude and get analysis
    const analysis = await analyzeProject(context, fileNames);

    // Step 5 — Clean up uploaded files after analysis
    for (const file of files) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.warn(`Could not delete temp file: ${file.path}`);
      }
    }

    console.log('Analysis complete!');

    res.json({
      success: true,
      analysis
    });

  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({
      error: err.message || 'Analysis failed'
    });
  }
});

module.exports = router;