#!/usr/bin/env node

/**
 * Version validation script for MuseumCheck
 * 
 * This script validates that version information is consistent across files
 * and helps developers ensure version updates are complete.
 * 
 * Usage: node validate-version.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function validateVersionConsistency() {
    log('\n🔍 Validating MuseumCheck version consistency...', 'blue');
    
    try {
        // Read script.js to extract version information
        const scriptPath = path.join(__dirname, 'script.js');
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        
        // Extract RECENT_CHANGES object
        const versionRegex = /version:\s*["']([^"']+)["']/;
        const dateRegex = /lastUpdate:\s*["']([^"']+)["']/;
        
        const versionMatch = scriptContent.match(versionRegex);
        const dateMatch = scriptContent.match(dateRegex);
        
        if (!versionMatch || !dateMatch) {
            log('❌ Error: Could not extract version information from script.js', 'red');
            return false;
        }
        
        const currentVersion = versionMatch[1];
        const lastUpdate = dateMatch[1];
        
        log(`📋 Found version information:`, 'blue');
        log(`   Version: ${currentVersion}`, 'green');
        log(`   Last Update: ${lastUpdate}`, 'green');
        
        let hasIssues = false;
        
        // Enhanced date validation
        log(`\n📅 Validating dates...`, 'blue');
        const currentDate = new Date();
        const lastUpdateDate = new Date(lastUpdate);
        
        // Check if lastUpdate is in the future
        if (lastUpdateDate > currentDate) {
            log(`❌ Error: lastUpdate date is in the future: ${lastUpdate}`, 'red');
            hasIssues = true;
        }
        
        // Extract and validate all dates in RECENT_CHANGES
        const changesRegex = /changes:\s*\[([\s\S]*?)\]/;
        const changesMatch = scriptContent.match(changesRegex);
        if (changesMatch) {
            const changesContent = changesMatch[1];
            const entryDateRegex = /date:\s*["'](\d{4}-\d{2}-\d{2})["']/g;
            let match;
            const futureDates = [];
            const invalidDates = [];
            
            while ((match = entryDateRegex.exec(changesContent)) !== null) {
                const entryDate = match[1];
                const date = new Date(entryDate);
                
                // Check if date is valid
                if (isNaN(date.getTime())) {
                    invalidDates.push(entryDate);
                } else if (date > currentDate) {
                    futureDates.push(entryDate);
                }
            }
            
            if (futureDates.length > 0) {
                log(`❌ Error: Found ${futureDates.length} future date(s) in changelog:`, 'red');
                futureDates.forEach(date => log(`   - ${date}`, 'red'));
                hasIssues = true;
            }
            
            if (invalidDates.length > 0) {
                log(`❌ Error: Found ${invalidDates.length} invalid date(s) in changelog:`, 'red');
                invalidDates.forEach(date => log(`   - ${date}`, 'red'));
                hasIssues = true;
            }
            
            if (futureDates.length === 0 && invalidDates.length === 0) {
                log(`✅ All changelog dates are valid and not in the future`, 'green');
            }
        }
        
        // Read index.html to check for hardcoded versions
        const htmlPath = path.join(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Look for any hardcoded version numbers that don't match the pattern
        const hardcodedVersions = htmlContent.match(/v\d+\.\d+\.\d+/g) || [];
        const hardcodedDates = htmlContent.match(/\d{4}-\d{2}-\d{2}/g) || [];
        
        log(`\n🔍 Checking for hardcoded values in HTML...`, 'blue');
        
        // Check if there are any hardcoded versions that don't match expected placeholders
        const expectedPlaceholders = ['v0.0.0']; // Our placeholder version
        const unexpectedVersions = hardcodedVersions.filter(v => !expectedPlaceholders.includes(v));
        
        if (unexpectedVersions.length > 0) {
            log(`⚠️  Warning: Found unexpected hardcoded versions in HTML:`, 'yellow');
            unexpectedVersions.forEach(v => log(`   - ${v}`, 'yellow'));
            log(`   These should be replaced with placeholders and updated via JavaScript.`, 'yellow');
            hasIssues = true;
        }
        
        // Check if there are any hardcoded dates that aren't placeholders
        const expectedDatePlaceholders = ['...']; // Our placeholder text
        const unexpectedDates = hardcodedDates.filter(d => d !== lastUpdate && !expectedDatePlaceholders.includes(d));
        
        if (unexpectedDates.length > 0) {
            log(`⚠️  Warning: Found unexpected hardcoded dates in HTML:`, 'yellow');
            unexpectedDates.forEach(d => log(`   - ${d}`, 'yellow'));
            hasIssues = true;
        }
        
        if (!hasIssues) {
            log(`✅ Version consistency check passed!`, 'green');
            log(`   All version information is properly centralized in script.js`, 'green');
        }
        
        // Provide guidance for developers
        log(`\n📝 To update the version:`, 'blue');
        log(`   1. Edit the RECENT_CHANGES object in script.js`, 'blue');
        log(`   2. Update the version field: version: "${currentVersion}" → "x.x.x"`, 'blue');
        log(`   3. Update the lastUpdate field: lastUpdate: "${lastUpdate}" → "YYYY-MM-DD"`, 'blue');
        log(`   4. Add new entry to changes array with your update details`, 'blue');
        log(`   5. Run this script again to validate: node validate-version.js`, 'blue');
        
        return !hasIssues;
        
    } catch (error) {
        log(`❌ Error validating version: ${error.message}`, 'red');
        return false;
    }
}

// Run validation
if (require.main === module) {
    const success = validateVersionConsistency();
    process.exit(success ? 0 : 1);
}

module.exports = { validateVersionConsistency };