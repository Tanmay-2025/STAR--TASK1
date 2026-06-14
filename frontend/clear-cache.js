#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to clear Next.js cache (.next folder)
 * Run with: node clear-cache.js
 */

const nextDir = path.join(__dirname, '.next');

function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Deleting ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log('✅ Cache cleared successfully!');
  } else {
    console.log('ℹ️  No .next cache folder found.');
  }
}

console.log('🧹 Clearing Next.js cache...');
deleteDirectory(nextDir);
console.log('🚀 You can now run "npm run dev" for a fresh start!');
