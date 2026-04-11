const fs = require('fs');
const path = require('path');

// File types we can read as text
const TEXT_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.kt',
  '.go', '.rs', '.c', '.cpp', '.h', '.cs', '.php', '.rb',
  '.swift', '.md', '.txt', '.json', '.yaml', '.yml',
  '.toml', '.env', '.sh', '.bash', '.html', '.css',
  '.xml', '.sql', '.gitignore', '.config', '.properties',
  '.gradle', '.mvn', '.dockerfile', '.tf', '.vue'
];

// Check if file is readable as text
const isTextFile = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  return TEXT_EXTENSIONS.includes(ext);
};

// Format file size nicely
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

// Parse a single file
const parseFile = (filePath, originalName) => {
  try {
    const stats = fs.statSync(filePath);
    const size = stats.size;

    // Skip files larger than 500KB
    if (size > 512000) {
      return {
        name: originalName,
        content: `[Skipped — file too large: ${formatSize(size)}]`,
        size: formatSize(size),
        readable: false
      };
    }

    if (!isTextFile(originalName)) {
      return {
        name: originalName,
        content: `[Binary file — cannot read as text: ${formatSize(size)}]`,
        size: formatSize(size),
        readable: false
      };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      name: originalName,
      content: content.slice(0, 5000), // max 5000 chars per file
      size: formatSize(size),
      readable: true
    };

  } catch (err) {
    return {
      name: originalName,
      content: `[Error reading file: ${err.message}]`,
      size: '?',
      readable: false
    };
  }
};

// Parse all uploaded files
const parseAllFiles = (files) => {
  const results = [];

  for (const file of files) {
    const parsed = parseFile(file.path, file.originalname);
    results.push(parsed);
  }

  return results;
};

// Build a combined context string for Claude
const buildContext = (parsedFiles) => {
  let context = '';

  for (const file of parsedFiles) {
    context += `\n\n=== FILE: ${file.name} ===\n`;
    context += file.content;
  }

  return context;
};

module.exports = { parseAllFiles, buildContext, isTextFile };