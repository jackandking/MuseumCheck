#!/usr/bin/env node
/**
 * V3 Support Validation Tool
 * 
 * This script validates that:
 * 1. All museums with collections data are included in V3_SUPPORTED lists
 * 2. V3_SUPPORTED lists in script.js and single-museum.js are consistent
 * 3. No duplicate entries exist
 * 
 * Usage: node tools/validate-v3-support.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(color + args.join(' ') + colors.reset);
}

function success(...args) { log(colors.green, '✓', ...args); }
function error(...args) { log(colors.red, '✗', ...args); }
function warning(...args) { log(colors.yellow, '⚠', ...args); }
function info(...args) { log(colors.blue, 'ℹ', ...args); }

// Extract V3_SUPPORTED array from a JavaScript file
function extractV3Supported(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/const V3_SUPPORTED = \[([\s\S]*?)\];/);
    
    if (!match) {
      error(`Could not find V3_SUPPORTED in ${filePath}`);
      return null;
    }

    const arrayContent = match[1];
    const museums = arrayContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith("'") || line.startsWith('"'))
      .map(line => {
        const match = line.match(/['"]([^'"]+)['"]/);
        return match ? match[1] : null;
      })
      .filter(id => id !== null);

    return museums;
  } catch (err) {
    error(`Error reading ${filePath}:`, err.message);
    return null;
  }
}

// Extract museums with collections from museums-data.js
function extractMuseumsWithCollections(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const museumsWithCollections = [];
    
    let currentId = null;
    for (let line of lines) {
      const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
      if (idMatch) {
        currentId = idMatch[1];
      }
      
      if (line.includes('collections: [') && currentId) {
        museumsWithCollections.push(currentId);
        currentId = null;
      }
    }
    
    return museumsWithCollections;
  } catch (err) {
    error(`Error reading ${filePath}:`, err.message);
    return null;
  }
}

// Check for duplicates in an array
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = [];
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.push(item);
    } else {
      seen.add(item);
    }
  }
  
  return duplicates;
}

// Main validation logic
function validateV3Support() {
  console.log('\n' + '='.repeat(60));
  log(colors.cyan, 'V3 Support Validation Tool');
  console.log('='.repeat(60) + '\n');

  const rootDir = path.resolve(__dirname, '..');
  const scriptJsPath = path.join(rootDir, 'script.js');
  const singleMuseumJsPath = path.join(rootDir, 'single-museum.js');
  const museumsDataPath = path.join(rootDir, 'museums-data.js');

  // Extract data
  const scriptV3 = extractV3Supported(scriptJsPath);
  const singleV3 = extractV3Supported(singleMuseumJsPath);
  const museumsWithCollections = extractMuseumsWithCollections(museumsDataPath);

  if (!scriptV3 || !singleV3 || !museumsWithCollections) {
    error('Failed to extract data from files. Aborting validation.');
    process.exit(1);
  }

  let hasErrors = false;

  // Check 1: V3_SUPPORTED lists should be identical
  info(`Checking V3_SUPPORTED consistency...`);
  
  const scriptSet = new Set(scriptV3);
  const singleSet = new Set(singleV3);
  
  const inScriptOnly = scriptV3.filter(id => !singleSet.has(id));
  const inSingleOnly = singleV3.filter(id => !scriptSet.has(id));
  
  if (inScriptOnly.length === 0 && inSingleOnly.length === 0) {
    success('V3_SUPPORTED lists are consistent between script.js and single-museum.js');
  } else {
    hasErrors = true;
    error('V3_SUPPORTED lists are NOT consistent!');
    
    if (inScriptOnly.length > 0) {
      warning('  Museums in script.js but NOT in single-museum.js:');
      inScriptOnly.forEach(id => console.log(`    - ${id}`));
    }
    
    if (inSingleOnly.length > 0) {
      warning('  Museums in single-museum.js but NOT in script.js:');
      inSingleOnly.forEach(id => console.log(`    - ${id}`));
    }
  }

  // Check 2: No duplicate entries
  info('\nChecking for duplicate entries...');
  
  const scriptDuplicates = findDuplicates(scriptV3);
  const singleDuplicates = findDuplicates(singleV3);
  
  if (scriptDuplicates.length === 0 && singleDuplicates.length === 0) {
    success('No duplicate entries found');
  } else {
    hasErrors = true;
    error('Duplicate entries found!');
    
    if (scriptDuplicates.length > 0) {
      warning('  Duplicates in script.js:', scriptDuplicates.join(', '));
    }
    
    if (singleDuplicates.length > 0) {
      warning('  Duplicates in single-museum.js:', singleDuplicates.join(', '));
    }
  }

  // Check 3: All museums with collections should be in V3_SUPPORTED
  info('\nChecking museums with collections...');
  
  const collectionsSet = new Set(museumsWithCollections);
  const missingMuseums = museumsWithCollections.filter(id => !scriptSet.has(id));
  const extraMuseums = scriptV3.filter(id => !collectionsSet.has(id));
  
  if (missingMuseums.length === 0) {
    success('All museums with collections are in V3_SUPPORTED');
  } else {
    hasErrors = true;
    error('Some museums with collections are NOT in V3_SUPPORTED!');
    warning('  Missing museums:');
    missingMuseums.forEach(id => console.log(`    - ${id}`));
  }

  if (extraMuseums.length > 0) {
    warning('  Museums in V3_SUPPORTED without collections (may use treasure-workflow-generator):');
    extraMuseums.forEach(id => console.log(`    - ${id}`));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  log(colors.cyan, 'Summary');
  console.log('='.repeat(60));
  console.log(`Museums with collections: ${museumsWithCollections.length}`);
  console.log(`Museums in V3_SUPPORTED (script.js): ${scriptV3.length}`);
  console.log(`Museums in V3_SUPPORTED (single-museum.js): ${singleV3.length}`);
  
  if (hasErrors) {
    console.log('\n');
    error('Validation FAILED! Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n');
    success('All validations PASSED! ✨');
    process.exit(0);
  }
}

// Run validation
if (require.main === module) {
  validateV3Support();
}

module.exports = { validateV3Support };
