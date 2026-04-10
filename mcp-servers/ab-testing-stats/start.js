#!/usr/bin/env node

/**
 * Wrapper script that loads .env.local and starts the MCP server
 */

import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');

// Load .env.local
try {
  const envPath = join(projectRoot, '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  }
} catch (error) {
  console.error('Warning: Could not load .env.local:', error.message);
}

// Import and run the actual server
import('./dist/index.js');
