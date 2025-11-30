/**
 * Tests for leaderboard rank change notification feature
 * 
 * When a museum is checked in (auto or manual), the leaderboard should be updated
 * and a notification should show the user's rank change.
 */

describe('Leaderboard Rank Change Notification', () => {
    describe('autoSubmitScore method returns rank info', () => {
        test('autoSubmitScore method should return rank change information', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the autoSubmitScore method
            const methodStart = scriptContent.indexOf('async autoSubmitScore()');
            expect(methodStart).toBeGreaterThan(0);
            
            // Get the method body
            const methodEnd = scriptContent.indexOf('class MuseumCheckApp', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check that it fetches old rank before submitting
            expect(methodBody).toContain('oldRank');
            
            // Check that it fetches new rank after submitting
            expect(methodBody).toContain('newRank');
            
            // Check that it calculates rank change
            expect(methodBody).toContain('rankChange');
            
            // Check that it returns success and rank info
            expect(methodBody).toContain('success: true');
            expect(methodBody).toContain('isNewEntry');
        });
        
        test('autoSubmitScore should handle first-time entry', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the autoSubmitScore method
            const methodStart = scriptContent.indexOf('async autoSubmitScore()');
            const methodEnd = scriptContent.indexOf('class MuseumCheckApp', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for handling of new entry (no old rank)
            expect(methodBody).toContain('isNewEntry: !oldRank && newRank');
        });
        
        test('autoSubmitScore should calculate rank improvement correctly', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the autoSubmitScore method
            const methodStart = scriptContent.indexOf('async autoSubmitScore()');
            const methodEnd = scriptContent.indexOf('class MuseumCheckApp', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for rank change calculation (oldRank - newRank, so #5 to #3 = 2)
            expect(methodBody).toContain('oldRank - newRank');
        });
    });
    
    describe('showAutoCheckinNotification method', () => {
        test('should exist and show rank change info', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Check for method definition
            expect(scriptContent).toContain('showAutoCheckinNotification(museum, rankResult)');
        });
        
        test('should show first-time ranking message', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the showAutoCheckinNotification method
            const methodStart = scriptContent.indexOf('showAutoCheckinNotification(museum, rankResult)');
            const methodEnd = scriptContent.indexOf('showManualCheckinRankNotification', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for first-time ranking message
            expect(methodBody).toContain('首次登榜');
            expect(methodBody).toContain('isNewEntry');
        });
        
        test('should show rank improvement message', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the showAutoCheckinNotification method
            const methodStart = scriptContent.indexOf('showAutoCheckinNotification(museum, rankResult)');
            const methodEnd = scriptContent.indexOf('showManualCheckinRankNotification', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for rank improvement message
            expect(methodBody).toContain('排名上升');
            expect(methodBody).toContain('rankChange > 0');
        });
        
        test('should show rank maintained message', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the showAutoCheckinNotification method
            const methodStart = scriptContent.indexOf('showAutoCheckinNotification(museum, rankResult)');
            const methodEnd = scriptContent.indexOf('showManualCheckinRankNotification', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for rank maintained message
            expect(methodBody).toContain('保持第');
            expect(methodBody).toContain('rankChange === 0');
        });
    });
    
    describe('showManualCheckinRankNotification method', () => {
        test('should exist for manual check-in', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Check for method definition
            expect(scriptContent).toContain('showManualCheckinRankNotification(museum, rankResult)');
        });
        
        test('should show first-time ranking message for manual check-in', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the showManualCheckinRankNotification method
            const methodStart = scriptContent.indexOf('showManualCheckinRankNotification(museum, rankResult)');
            const methodEnd = scriptContent.indexOf('toggleFavorite(museumId)', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for first-time ranking message
            expect(methodBody).toContain('首次登上排行榜');
            expect(methodBody).toContain('isNewEntry');
        });
        
        test('should show rank improvement for manual check-in', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the showManualCheckinRankNotification method
            const methodStart = scriptContent.indexOf('showManualCheckinRankNotification(museum, rankResult)');
            const methodEnd = scriptContent.indexOf('toggleFavorite(museumId)', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for rank improvement message
            expect(methodBody).toContain('排名上升');
            expect(methodBody).toContain('rankChange > 0');
        });
    });
    
    describe('Auto check-in uses rank notification', () => {
        test('checkAutoCheckin should call showAutoCheckinNotification', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the checkAutoCheckin method
            const methodStart = scriptContent.indexOf('checkAutoCheckin(museumId, museum, ageGroup)');
            const methodEnd = scriptContent.indexOf('showAutoCheckinNotification(museum, rankResult)', methodStart);
            
            // The showAutoCheckinNotification should be called within checkAutoCheckin
            expect(methodEnd).toBeGreaterThan(methodStart);
        });
        
        test('checkAutoCheckin should await leaderboard submission', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find the checkAutoCheckin method
            const methodStart = scriptContent.indexOf('checkAutoCheckin(museumId, museum, ageGroup)');
            const methodEnd = scriptContent.indexOf('showAutoCheckinNotification(museum, rankResult)', methodStart);
            const methodBody = scriptContent.substring(methodStart, methodEnd);
            
            // Check for proper async handling of leaderboard submission
            expect(methodBody).toContain('.then(result =>');
            expect(methodBody).toContain('autoSubmitScore()');
        });
    });
    
    describe('Manual check-in uses rank notification', () => {
        test('toggleMuseumVisit should call showManualCheckinRankNotification', () => {
            const fs = require('fs');
            const path = require('path');
            const scriptPath = path.join(__dirname, '..', 'script.js');
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            
            // Find toggleMuseumVisit method
            const methodStart = scriptContent.indexOf('toggleMuseumVisit(museumId)');
            expect(methodStart).toBeGreaterThan(0);
            
            // Check that showManualCheckinRankNotification is called
            const notificationCall = scriptContent.indexOf('showManualCheckinRankNotification(museum, result)', methodStart);
            expect(notificationCall).toBeGreaterThan(methodStart);
        });
    });
});
