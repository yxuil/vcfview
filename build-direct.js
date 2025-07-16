#!/usr/bin/env node

/**
 * Build script for direct repository access
 * This creates a build that can be accessed directly from GitHub without Pages
 */

import { execSync } from 'child_process';
import { copyFileSync, cpSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🚀 Building for direct repository access...');

// Clean existing direct build files
if (existsSync('index.html')) {
  rmSync('index.html');
  console.log('🧹 Cleaned existing index.html');
}

if (existsSync('_app')) {
  rmSync('_app', { recursive: true });
  console.log('🧹 Cleaned existing _app directory');
}

// Build the application
console.log('📦 Building application...');
execSync('npm run build', { stdio: 'inherit' });

// Copy files to root for direct access
console.log('📁 Copying files to root directory...');

try {
  // Copy index.html to root
  copyFileSync(join('build', 'index.html'), 'index.html');
  console.log('✅ Copied index.html to root');
  
  // Copy _app directory to root
  cpSync(join('build', '_app'), '_app', { recursive: true });
  console.log('✅ Copied _app directory to root');
  
  console.log('🎉 Direct build completed successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Commit the index.html and _app/ files to your repository');
  console.log('2. Push to GitHub');
  console.log('3. Access your app at: https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/index.html');
  console.log('   Or use: https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/index.html');
  
} catch (error) {
  console.error('❌ Error during build:', error.message);
  process.exit(1);
}