# Leaderboard User Stats Bug Report

**Date**: February 9, 2026  
**Status**: 🐛 Bug Identified  
**Severity**: Medium  
**Reporter**: @jackandking  

## Bug Description

The leaderboard page displays empty/placeholder data ("-") in the "我的排名" (My Rank) section instead of showing actual user statistics.

## Visual Evidence

**Current Behavior (Bug):**

![Leaderboard Bug - Empty User Stats](https://github.com/user-attachments/assets/59555ec4-19a2-474b-a308-8567acd0808d)

As shown in the screenshot:
- **Rank**: Shows "第 - 名" (literally "Rank - position") instead of actual rank number
- **Score**: Shows "-" instead of actual visit count
- This occurs for both museum visits and pet rankings tabs

## Root Cause Analysis

After investigating the code, I found the issue in the data flow:

### Issue 1: Sample Data Format Mismatch

**Location**: `js/leaderboard-page.js:254-283`

The `loadSampleData()` function provides sample data in a simplified format:

```javascript
loadSampleData: function(isInitial) {
    const sampleData = this.currentTab === 'pet' ? {
        items: [
            { nickname: '小淘气', petLevel: 5, rank: 1 },
            // ... more items
        ],
        userStats: { rank: 12, score: 1 }  // ⬅️ This userStats is provided but not used!
    } : {
        items: [
            { nickname: '小淘气', visits: 3, rank: 1 },
            // ... more items
        ],
        userStats: { rank: 15, score: 0 }  // ⬅️ This userStats is provided but not used!
    };

    this.handleDataResponse(sampleData, isInitial);
}
```

### Issue 2: handleDataResponse Expects API Format

**Location**: `js/leaderboard-page.js:167-237`

The `handleDataResponse()` expects items in API format with `sortKey` and `value` fields:

```javascript
handleDataResponse: function(data, isInitial) {
    const userRecords = items.map(item => {
        try {
            const value = JSON.parse(item.value);  // ⬅️ Expects stringified JSON
            const sortKey = item.sortKey || item.sk || '';  // ⬅️ Expects sortKey field
            
            let userId = sortKey;
            if (sortKey.startsWith('user-')) {
                userId = sortKey.replace('user-', '');
            }
            
            return {
                userId: userId,
                nickname: value.nickname || value.userName || 'Anonymous',
                visits: value.visitedCount || 0,
                petLevel: value.petLevel || 1,
                rank: 0
            };
        } catch (e) {
            console.warn('[LeaderboardPage] Failed to parse item value:', e);
            return null;  // ⬅️ Parse fails, returns null
        }
    }).filter(item => item !== null);
    
    // ... later ...
    this.updateUserStats(this.getCurrentUserStats(userRecords));
}
```

### Issue 3: getCurrentUserStats Can't Find User

**Location**: `js/leaderboard-page.js:240-252`

Even if parsing succeeded, `getCurrentUserStats()` looks for current user ID in records:

```javascript
getCurrentUserStats: function(records) {
    const currentUserId = localStorage.getItem('userName') || 'user';
    const userRecord = records.find(record => record.userId === currentUserId);
    
    if (userRecord) {
        return {
            rank: userRecord.rank,
            score: this.currentTab === 'visits' ? userRecord.visits : userRecord.petLevel
        };
    }
    
    return { rank: '-', score: '-' };  // ⬅️ Returns "-" when user not found
}
```

**The Problem**: 
1. Sample data items don't have `value` and `sortKey` fields (causes parse failures)
2. Even if parsed, sample items don't have a `userId` matching `localStorage.getItem('userName')`
3. The provided `userStats` in sample data is completely ignored
4. Result: `getCurrentUserStats()` returns `{ rank: '-', score: '-' }`

## Console Warnings

The browser console shows multiple parsing warnings:

```
[WARNING] [LeaderboardPage] Failed to parse item value: SyntaxError: "undefined" is not valid JSON
```

This confirms that `handleDataResponse()` is trying to parse sample data as if it were API data.

## Why Tests Didn't Catch This

The existing E2E tests only validated that UI elements are **visible**, not that they contain **meaningful data**:

```typescript
// Old test (insufficient)
test('should display user stats card', async ({ page }) => {
    const rankSection = page.locator('#myRank');
    await expect(rankSection).toBeVisible();  // ✅ Passes - element exists
    
    const scoreSection = page.locator('#myScore');
    await expect(scoreSection).toBeVisible();  // ✅ Passes - element exists
    
    // ❌ Missing: No validation of actual content
});
```

## Proposed Fixes

### Option 1: Fix Sample Data Format (Recommended)

Update `loadSampleData()` to provide data in the expected API format:

```javascript
loadSampleData: function(isInitial) {
    const currentUserId = localStorage.getItem('userName') || 'user';
    
    const sampleData = this.currentTab === 'pet' ? {
        items: [
            {
                sortKey: `user-${currentUserId}`,
                value: JSON.stringify({
                    nickname: '我',
                    userId: currentUserId,
                    petLevel: 1,
                    lastUpdate: Date.now()
                })
            },
            {
                sortKey: 'user-user1',
                value: JSON.stringify({
                    nickname: '小淘气',
                    userId: 'user1',
                    petLevel: 5,
                    lastUpdate: Date.now()
                })
            },
            // ... more items
        ]
    } : {
        items: [
            {
                sortKey: `user-${currentUserId}`,
                value: JSON.stringify({
                    nickname: '我',
                    userId: currentUserId,
                    visitedCount: 0,
                    lastUpdate: Date.now()
                })
            },
            {
                sortKey: 'user-user1',
                value: JSON.stringify({
                    nickname: '小淘气',
                    userId: 'user1',
                    visitedCount: 3,
                    lastUpdate: Date.now()
                })
            },
            // ... more items
        ]
    };
    
    this.handleDataResponse(sampleData, true);
}
```

### Option 2: Use Provided userStats

Modify `handleDataResponse()` to accept and use the provided `userStats`:

```javascript
handleDataResponse: function(data, isInitial) {
    // ... existing parsing code ...
    
    if (isInitial) {
        this.allData = userRecords;
        this.renderLeaderboard(userRecords);
        
        // Use provided userStats if available, otherwise calculate from records
        const userStats = data.userStats || this.getCurrentUserStats(userRecords);
        this.updateUserStats(userStats);
        
        this.updateLastRefreshTime();
    }
    // ...
}
```

### Option 3: Handle Both Formats

Add format detection to support both API and sample data formats:

```javascript
handleDataResponse: function(data, isInitial) {
    let items = [];
    let isSampleFormat = false;
    
    if (data && data.items && Array.isArray(data.items)) {
        items = data.items;
        
        // Detect if this is sample data format (objects without value/sortKey)
        if (items.length > 0 && items[0].nickname && !items[0].value) {
            isSampleFormat = true;
        }
    }
    
    const userRecords = isSampleFormat 
        ? this.parseSampleData(items)
        : this.parseAPIData(items);
    
    // ... rest of the code
}
```

## Impact

**User Experience Impact**: Medium
- Users see placeholder data instead of their actual ranking
- May confuse users about whether their data is being tracked
- Reduces motivation to engage with the leaderboard feature

**Frequency**: 100%
- Occurs every time the page loads with fallback sample data
- Occurs when API is unavailable (offline mode, network issues)

## Test Enhancement

Added new E2E test to catch this issue:

```typescript
test('should display user stats with actual data, not empty dashes', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const myRank = page.locator('#myRank');
    const rankText = await myRank.textContent();
    
    // Validate rank shows actual data, not "第 - 名"
    const hasValidRank = rankText?.includes('未上榜') || 
                        (rankText?.includes('第') && 
                         rankText?.includes('名') && 
                         !rankText?.includes('-'));
    
    expect(hasValidRank).toBe(true);  // This will fail with current bug
});
```

## Recommendation

**Fix Priority**: High  
**Recommended Solution**: Option 1 (Fix Sample Data Format)

**Rationale**:
1. Maintains consistent data flow through existing code paths
2. No changes needed to core parsing logic
3. Sample data will work exactly like real API data
4. Easiest to test and maintain

## Next Steps

1. ✅ Document bug (this report)
2. ⏳ Implement fix (Option 1 recommended)
3. ⏳ Update E2E tests to validate fix
4. ⏳ Run full test suite
5. ⏳ Manual testing to confirm user stats display correctly

---

**Bug Tracking**: Issue identified during comprehensive leaderboard testing  
**Related PR**: #[PR_NUMBER] - Test: Add comprehensive E2E test suite for leaderboard feature
