# MuseumCheck - Museum Checklist Web Application

MuseumCheck is a fully functional web application designed to help parents and children track visits to museums in China. The application provides age-appropriate checklists for different museums and uses only local storage for data persistence.

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Current Repository State

**IMPORTANT**: This is a COMPLETE, FULLY FUNCTIONAL web application. The repository contains:
- `index.html` - Main application HTML file (4KB)
- `script.js` - Complete JavaScript application logic (124KB, 3,017 lines, 120 museums with detailed checklists)
- `style.css` - Complete CSS styling with responsive design (12KB)
- `README.md` - Comprehensive documentation
- `CNAME` - GitHub Pages deployment configuration (museumcheck.cn)
- `.github/copilot-instructions.md` - This file
- `.github/FUNDING.yml` - GitHub sponsorship configuration

**Live Application**: 
- **Production**: https://jackandking.github.io/MuseumCheck/ and https://museumcheck.cn
- **Development**: https://jackandking.github.io/MuseumCheckDev/ (check this during development for current state)

## Development Environment Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local HTTP server)
- Text editor or IDE (VS Code recommended)

### NEVER CANCEL Commands and Timing
- **HTTP Server startup**: ~1-2 seconds. NEVER CANCEL.
- **Application loading**: Instantaneous (pure HTML/CSS/JS)
- **No build processes**: This is a static web application with no compilation steps

### Local Development Server
Run this EXACT command (validated and working):

```bash
# Navigate to repository root  
cd /home/runner/work/MuseumCheck/MuseumCheck

# Start HTTP server (takes 1-2 seconds, NEVER CANCEL)
python3 -m http.server 8000
# Access at http://localhost:8000
```

**Alternative methods (if Python unavailable)**:
```bash
# Node.js HTTP Server
npm install -g http-server
http-server -p 8000

# VS Code Live Server
# Install Live Server extension, right-click index.html > "Open with Live Server"
```

## Build and Test Process

### Current State - AUTOMATED TESTING REQUIRED

**IMPORTANT**: While this application has NO build system, it now has a comprehensive unit testing framework to prevent regression issues.

**Testing Framework**:
- **Jest** with jsdom for unit tests
- **Regression tests** for previously fixed bugs  
- **Core functionality tests** for essential features
- **Coverage reporting** to track test completeness

**What EXISTS**:
- Complete HTML/CSS/JavaScript application
- 120 major Chinese museums with detailed data
- Age-appropriate content for 3 age groups (3-6, 7-12, 13-18 years)
- Full localStorage persistence
- Responsive design
- Google Analytics integration
- **Unit test suite with regression tests**

### HTTP Server Test Evidence
When running `python3 -m http.server 8000`, the application serves with proper HTTP responses:

**Successful Responses (200 OK)**:
```
GET / HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.3
Content-type: text/html
Content-Length: 2639

GET /script.js HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.3  
Content-type: text/javascript
Content-Length: 124008

GET /style.css HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.12.3
Content-type: text/css
Content-Length: 8335
```

**Error Responses (404 Not Found)**:
```
GET /nonexistent HTTP/1.0 404 Not Found
Server: SimpleHTTP/0.6 Python/3.12.3
```

**Performance Metrics**:
- Main page load time: ~0.001s
- All assets load with correct MIME types
- No build or compilation errors
- JavaScript loads and executes properly

### Unit Testing Framework (MANDATORY FOR BUG FIXES)

**CRITICAL**: Every bug fix MUST include corresponding unit tests to prevent regression issues.

#### Testing Infrastructure
- **Framework**: Jest with jsdom environment
- **Location**: `/tests/` directory
- **Setup**: `npm install` then `npm test`
- **Coverage**: `npm run test:coverage`

#### Mandatory Testing Requirements

**For ALL Bug Fixes**:
1. **Write Regression Test First**: Create a test that reproduces the bug
2. **Fix the Bug**: Implement your solution
3. **Verify Test Passes**: Ensure the fix makes your test pass
4. **Run Full Test Suite**: Confirm no existing functionality broke

#### Testing Commands
```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

#### Test Categories
- **Core Tests** (`tests/core.test.js`): Essential app functionality
- **Regression Tests** (`tests/regression.test.js`): Previously fixed bugs
- **Feature Tests**: New functionality as it's added

### Manual Testing Strategy (REQUIRED)
Manual testing remains important alongside unit tests:

1. **Core Functionality Testing** (ALWAYS do this):
   - Load application: `python3 -m http.server 8000` then visit http://localhost:8000
   - Test age group selector (3-6岁, 7-12岁, 13-18岁)
   - Click museum cards to open detailed checklists (120 museums available)
   - Test parent preparation vs. child tasks tabs
   - Check/uncheck checklist items and verify they persist
   - Mark museums as visited and verify visit counter updates

2. **Data Persistence Testing** (CRITICAL):
   - Mark several checklist items and museums as visited
   - Refresh browser (F5) or close/reopen tab
   - Verify all data persists using DevTools > Application > Local Storage
   - Check localStorage contains: `visitedMuseums`, `museumChecklists`

3. **Age Group Testing**:
   - Change age selector and reopen museum modals
   - Verify content changes appropriately for different age groups
   - Confirm younger children get simpler tasks, older get complex research projects

## Validation Scenarios

### Complete User Workflows (ALWAYS TEST)
Execute these FULL scenarios after any changes:

1. **Parent Planning Workflow**:
   - Open application at http://localhost:8000  
   - Select child's age group (e.g., "7-12岁 (小学)")
   - Browse museum list (120 museums should display)
   - Click "故宫博物院" (Forbidden City) to open modal
   - Review parent preparation checklist (age-appropriate items)
   - Check off 2-3 preparation items
   - Switch to "孩子任务" tab, review child tasks
   - Close modal, mark museum as visited (checkbox on museum card)
   - Verify visit counter updates (e.g., "1/120 已参观 (0.8%)")
   - Refresh browser - confirm all data persists

2. **Progress Tracking Workflow**:
   - Mark 3 different museums as visited
   - Verify progress counter shows correct percentage
   - Test localStorage persistence by refreshing multiple times
   - Check DevTools > Application > Local Storage for data structure

3. **Age Group Content Validation**:
   - Test same museum (e.g., 故宫博物院) across all 3 age groups
   - Verify age 3-6 shows simple observation tasks ("数一数有多少个门")  
   - Verify age 7-12 shows educational activities ("了解明清两朝历史背景")
   - Verify age 13-18 shows research projects ("深入研究明清政治制度")

### Browser Compatibility Testing
Test in these browsers (minimum):
- **Chrome/Chromium (latest)**: Primary target, full Google Analytics support
- **Firefox (latest)**: Ensure localStorage works correctly
- **Safari (macOS)**: Test Chinese font rendering
- **Edge (Windows)**: Verify Microsoft compatibility

## Technical Architecture

### File Structure (ACTUAL CURRENT STATE)
```
/home/runner/work/MuseumCheck/MuseumCheck/
├── README.md              # Comprehensive documentation  
├── CNAME                  # GitHub Pages domain (museumcheck.cn)
├── index.html             # Complete HTML application (4KB)
├── script.js              # Full JavaScript logic (124KB, 3,017 lines)
├── style.css              # Complete responsive CSS (12KB)
├── package.json           # Testing dependencies and scripts
├── TESTING_GUIDE.md       # Unit testing documentation
├── .gitignore             # Excludes node_modules, coverage
├── tests/                 # Unit testing framework
│   ├── setup.js           # Test configuration and mocks
│   ├── core.test.js       # Core functionality tests
│   └── regression.test.js # Tests for previously fixed bugs
└── .github/
    ├── copilot-instructions.md  # This file
    └── FUNDING.yml         # GitHub sponsorship
```

### Data Architecture
The application manages two localStorage keys:

```javascript
// Visited museums array
localStorage.getItem('visitedMuseums')  
// Example: ["forbidden-city", "national-museum"]

// Checklist completion tracking  
localStorage.getItem('museumChecklists')
// Example: {"forbidden-city-parent-7-12": [0, 2], "forbidden-city-child-7-12": [1]}
```

### Application Features (FULLY IMPLEMENTED)
- **120 Major Chinese Museums**: Complete data including locations, descriptions, tags
- **Age-Appropriate Content**: 3 distinct age groups with different complexity levels
- **Dual Checklist System**: Parent preparation + child exploration tasks
- **Progress Tracking**: Visual progress with percentages and counters
- **localStorage Persistence**: All data saved locally, works offline
- **Google Analytics**: Event tracking for user interactions  
- **Responsive Design**: Works on desktop and mobile devices
- **Chinese Language Interface**: Native Chinese UI and content

## Bug Fix Requirements (MANDATORY PROCESS)

**CRITICAL**: To prevent regression issues where bug fixes break existing functionality, every bug fix must follow this process:

### Required Steps for Bug Fixes

1. **Identify and Document Bug**:
   - Understand the root cause
   - Document expected vs. actual behavior
   - Identify which functions/code areas are affected

2. **Write Regression Test FIRST**:
   ```bash
   # Create test that reproduces the bug
   # Test should FAIL initially (proving the bug exists)
   npm test -- --testNamePattern="your bug description"
   ```

3. **Implement the Fix**:
   - Make minimal code changes to fix the issue
   - Focus on the root cause, not symptoms

4. **Verify Test Now Passes**:
   ```bash
   # Your regression test should now PASS
   npm test -- --testNamePattern="your bug description"
   ```

5. **Run Full Test Suite**:
   ```bash
   # Ensure no existing functionality broke
   npm test
   ```

6. **Manual Validation**:
   - Test the specific bug scenario manually
   - Run through related user workflows
   - Verify fix doesn't introduce new issues

### Example Bug Fix Process

**Bug**: Canvas height not auto-adjusting (fixed in v2.1.3)

```javascript
// 1. Write failing test first
test('should auto-adjust canvas height based on content', () => {
  const canvas = document.createElement('canvas');
  canvas.height = 400;
  
  const contentEndY = 800;
  const newHeight = Math.max(contentEndY + 40, 400);
  canvas.height = newHeight;
  
  expect(canvas.height).toBe(840); // Should pass after fix
});

// 2. Implement fix in script.js
// 3. Verify test passes
// 4. Run full test suite
```

### Test Documentation
- Add test to `tests/regression.test.js` 
- Document the bug and fix in test comments

### No Exceptions Policy
**Every bug fix must include unit tests.** No exceptions, even for "simple" fixes. Historical evidence shows simple fixes often cause unexpected regressions.

## Systematic Issue Detection Requirements (CRITICAL)

**MANDATORY**: Before making ANY changes to the codebase, especially when fixing bugs or adding features involving museum data, you MUST perform comprehensive systematic analysis to identify broader issues.

### Pre-Change Analysis Protocol

**ALWAYS run these checks before making changes:**

1. **Data Integrity Analysis** (MANDATORY):
   ```bash
   # Create and run data validation script
   node /tmp/analyze_duplicates.js
   # Or use provided validation tools
   ```

2. **Systematic Issue Detection**:
   - **Check for duplicate museum names**: Look for identical `name` fields
   - **Check for duplicate museum IDs**: Look for identical `id` fields  
   - **Validate data consistency**: Ensure all required fields present
   - **Check for undefined values**: Find any `undefined` or `null` entries
   - **Verify data counts**: Compare actual vs expected museum counts

3. **Comprehensive Problem Reporting** (MANDATORY):
   - **Document ALL discovered issues**: Not just the specific bug being fixed
   - **Quantify systematic problems**: Provide exact counts and examples
   - **Assess impact scope**: Determine if issues affect user experience
   - **Prioritize fixes**: Address systematic issues before individual bugs

### Data Validation Requirements

**For ANY museum data changes, you MUST:**

```bash
# 1. Run comprehensive duplicate detection
cd /home/runner/work/MuseumCheck/MuseumCheck
node -e "
const fs = require('fs');
const content = fs.readFileSync('script.js', 'utf8');
const startIdx = content.indexOf('const MUSEUMS = [');
const endIdx = content.indexOf('];', startIdx) + 2;
const museums = eval(content.substring(startIdx, endIdx).replace('const MUSEUMS = ', ''));

console.log('Museum count:', museums.length);

// Check duplicates
const names = new Map();
const ids = new Map();
let dupNames = 0, dupIds = 0;

museums.forEach((m, i) => {
  if (names.has(m.name)) { 
    console.log(\`DUPLICATE NAME: \\\${m.name} (index \${names.get(m.name)} and \${i})\`);
    dupNames++;
  } else names.set(m.name, i);
  
  if (ids.has(m.id)) { 
    console.log(\`DUPLICATE ID: \\\${m.id} (index \${ids.get(m.id)} and \${i})\`);
    dupIds++;
  } else ids.set(m.id, i);
});

console.log(\`Total duplicate names: \${dupNames}\`);
console.log(\`Total duplicate IDs: \${dupIds}\`);
"

# 2. Verify no undefined values
grep -n "undefined\|null" script.js | grep -E "(name:|id:|location:)"

# 3. Check expected vs actual counts
echo "Expected museums: Check against documentation"
echo "Actual museums: See count above"
```

### Mandatory Reporting Protocol

**When you discover systematic issues (like 41 duplicate names), you MUST:**

1. **STOP** the current task immediately
2. **DOCUMENT** all discovered issues comprehensively:
   - Exact counts of duplicates
   - Specific examples with line numbers/indices
   - Impact assessment on user experience
   - Recommendation for systematic fix vs. individual fix

3. **REPORT** to user with this format:
   ```
   🚨 SYSTEMATIC DATA QUALITY ISSUE DETECTED
   
   While working on [original task], comprehensive analysis revealed:
   - [X] duplicate museum names
   - [Y] duplicate museum IDs  
   - [Z] undefined/null entries
   - Total museums: [actual] (expected: [expected])
   
   RECOMMENDATION: Address systematic duplication before individual bug fixes.
   This affects user experience through search confusion and data inconsistency.
   
   Specific examples:
   1. [Museum name] appears [X] times with IDs [list]
   2. [Museum ID] used for [Y] different museums
   3. [etc.]
   ```

4. **ASK** user whether to:
   - Fix the systematic issue first (recommended)
   - Continue with original narrow fix (not recommended)
   - Provide additional analysis tools

### Systematic Fix Requirements

**When addressing systematic issues:**

1. **Create comprehensive fix plan**: Address ALL instances, not just individual cases
2. **Preserve data integrity**: Ensure no data loss during deduplication
3. **Update tests**: Ensure tests reflect correct post-fix expectations
4. **Document changes**: Update museum counts and any dependent documentation

### Example: Proper Systematic Response

**BAD** (what happened before):
- Found "首都博物馆" duplicate
- Fixed only that specific duplicate  
- Ignored 40 other duplicate names and 23 other duplicate IDs
- Did not report broader issue

**GOOD** (required approach):
- Found "首都博物馆" duplicate during analysis
- Ran comprehensive duplicate detection
- Discovered 41 duplicate names and 24 duplicate IDs
- Reported systematic issue to user immediately
- Recommended comprehensive deduplication plan
- Asked user for priority guidance before proceeding

### Data Quality Tools

Create these validation scripts in `/tmp/` for analysis:

```javascript
// /tmp/validate_museums.js - Comprehensive validation
// /tmp/analyze_duplicates.js - Duplicate detection  
// /tmp/check_data_integrity.js - Field validation
```

**AVAILABLE TOOLS** (already provided in repository):

```bash
# Quick validation using built-in tools
npm run validate-data      # Comprehensive validation tool
npm run test:data-quality  # Run data quality tests

# Manual validation (as shown in validation checklist)
node -e "/* validation code from checklist */"
```

### Integration with Testing

Add systematic validation to test requirements:

```javascript
// tests/data-quality.test.js
describe('Museum Data Quality', () => {
  test('should have no duplicate museum names', () => {
    // Comprehensive duplicate detection test
  });
  
  test('should have no duplicate museum IDs', () => {
    // ID uniqueness validation test
  });
  
  test('should have expected museum count', () => {
    // Total count validation test
  });
});
```

**CRITICAL**: This systematic approach prevents missing major data quality issues while focusing on individual bugs. Always analyze comprehensively before making changes.

## Common Development Tasks


### Working with Museum Data

The museums are defined in `museums-data.js` in the `MUSEUMS` array:

```javascript
// Example museum structure (DO NOT modify lightly - contains extensive Chinese content)
{
    id: 'forbidden-city',
    name: '故宫博物院', 
    location: '北京',
    description: '世界上现存规模最大、保存最为完整的木质结构古建筑群',
    tags: ['历史', '建筑', '文物'],
    image: 'https://example.com/museum-photo.jpg',  // Museum building photo URL
    collections: [  // Treasures/collections with photos
        {
            name: '《清明上河图》',
            imageUrl: 'https://example.com/treasure-photo.jpg',
            description: 'Description of the treasure'
        }
    ],
    checklists: {
        parent: {
            '3-6': [/* age-appropriate parent preparation tasks */],
            '7-12': [/* more complex preparation tasks */], 
            '13-18': [/* advanced preparation tasks */]
        },
        child: {
            '3-6': [/* simple child observation tasks */],
            '7-12': [/* educational child activities */],
            '13-18': [/* research and analysis projects */]
        }
    }
}
```

### Finding Museum and Treasure Photos (NEW TOOL)

**IMPORTANT**: When adding or updating museum data, use the Bing Image Search tool to find high-quality photos.

#### Using the Museum Image Search Tool

**Tool Location**: `tools/search-museum-images.js`

**Prerequisites**:
- Bing Search API key from Azure Cognitive Services
- Set environment variable: `export BING_SEARCH_API_KEY=your_api_key`

**Getting a Bing API Key**:
1. Go to https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
2. Sign up for a free Azure account
3. Create a Bing Search resource
4. Copy your API key
5. Set it: `export BING_SEARCH_API_KEY=your_key_here`

**Usage Examples**:

```bash
# Search for museum building photos only
node tools/search-museum-images.js "故宫博物院"

# Search for both museum and treasure photos
node tools/search-museum-images.js "故宫博物院" "清明上河图"

# More examples
node tools/search-museum-images.js "中国国家博物馆" "后母戊鼎"
node tools/search-museum-images.js "上海博物馆" "大克鼎"
```

**Demo Version (No API Key Required)**:
```bash
# Test the tool without an API key using mock data
node tools/search-museum-images-demo.js "故宫博物院" "清明上河图"
```

**Workflow for Adding Museum Photos**:

1. **Search for Images**:
   ```bash
   node tools/search-museum-images.js "博物馆名称" "镇馆之宝名称"
   ```

2. **Review Results**: The tool returns multiple image URLs with metadata:
   - Full image URL (for museum data)
   - Thumbnail URL
   - Image dimensions and file size
   - Source page URL

3. **Select Appropriate Images**: Choose images that are:
   - High quality and clear
   - Properly licensed (public domain, Wikimedia Commons, etc.)
   - Representative of the museum/treasure
   - Appropriate resolution (typically 800x600 or higher)

4. **Verify Image URLs**: Before adding to museum data:
   ```bash
   node tools/verify-treasure-images.js <image-url>
   ```

5. **Add to Museum Data**: Copy the selected URLs to the museum structure:
   ```javascript
   {
       id: 'museum-id',
       name: '博物馆名称',
       image: 'URL_FROM_SEARCH_TOOL',  // Museum building photo
       collections: [
           {
               name: '镇馆之宝名称',
               imageUrl: 'URL_FROM_SEARCH_TOOL',  // Treasure photo
               description: '...'
           }
       ]
   }
   ```

6. **Validate Data Quality**:
   ```bash
   npm run validate-data
   ```

**Best Practices**:
- Always verify image licenses and permissions
- Prefer Wikimedia Commons and public domain images
- Use high-resolution images (minimum 800x600)
- Verify URLs are accessible before committing
- Test images load correctly in the application

**Image Search Tips**:
- For museum buildings: Search includes "博物馆外观 建筑" keywords
- For treasures: Search includes "文物 高清" keywords
- Results are filtered for photos only with safe search enabled
- Returns top 5 results by default

### Local Storage Patterns (VALIDATED WORKING)
```javascript
// Load visited museums
const visited = JSON.parse(localStorage.getItem('visitedMuseums') || '[]');

// Save visited museums  
localStorage.setItem('visitedMuseums', JSON.stringify(visitedArray));

// Load checklist progress
const checklists = JSON.parse(localStorage.getItem('museumChecklists') || '{}');

// Save checklist item completion
localStorage.setItem('museumChecklists', JSON.stringify(checklistData));
```

### KV Store API Best Practices (CRITICAL)

The application uses a **3-Tier Museum Data Management System**:
- **Tier 1**: Individual museum static JSON files (`/museums/{museum-id}.json`)
- **Tier 2**: KV store dynamic data (remote storage for dev/debug)
- **Tier 3**: Consolidated `museums-data.js` (fallback)

**CRITICAL KNOWLEDGE**: The KV store API uses **composite keys** (partition key + sort key). This has been a source of bugs multiple times.

#### KV Store Composite Key Structure

**All KV store operations MUST include BOTH `key` AND `sortKey` parameters:**

```javascript
// ✅ CORRECT - Save operation (POST)
const response = await fetch(kvStoreEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        key: 'museum-data-forbidden-city',      // Partition key
        sortKey: 'museum',                       // Sort key (REQUIRED!)
        value: JSON.stringify(museumData),
        expireAt: 4866674732
    })
});

// ✅ CORRECT - Load operation (GET)
const key = 'museum-data-forbidden-city';
const sortKey = 'museum';
const url = `${endpoint}?key=${encodeURIComponent(key)}&sortKey=${encodeURIComponent(sortKey)}`;
const response = await fetch(url, { method: 'GET' });

// ❌ INCORRECT - Missing sortKey parameter
const url = `${endpoint}?key=${encodeURIComponent(key)}`;  // WILL FAIL!
```

#### Common KV Store Patterns

**Museum Data (sortKey: 'museum')**:
```javascript
// Save museum data
await fetch(kvStoreEndpoint, {
    method: 'POST',
    body: JSON.stringify({
        key: `museum-data-${museumId}`,
        sortKey: 'museum',  // Always use 'museum' for museum data
        value: JSON.stringify(data),
        expireAt: timestamp
    })
});

// Load museum data
const url = `${kvStoreEndpoint}?key=museum-data-${museumId}&sortKey=museum`;
const response = await fetch(url);
```

**Leaderboard Data (sortKey: 'user-{userId}')**:
```javascript
// Query all leaderboard entries with wildcard
const url = `${endpoint}?key=museumcheck-leaderboard&sortKey=*`;

// Query specific user entry
const url = `${endpoint}?key=museumcheck-leaderboard&sortKey=user-${userId}`;
```

#### KV Store Checklist for Development

**When writing ANY code that interacts with the KV store API:**

1. ✅ **Always include sortKey in GET requests**: `?key=...&sortKey=...`
2. ✅ **Always include sortKey in POST body**: `{ key: '...', sortKey: '...', ... }`
3. ✅ **Use URL encoding**: `encodeURIComponent()` for both key and sortKey
4. ✅ **Match save/load sortKey values**: Use the same sortKey for saving and loading
5. ✅ **Test with actual data**: Verify the full save → load cycle works
6. ✅ **Add regression tests**: Prevent future sortKey omission bugs

#### Historical Issues (Learn from These)

**Issue #1**: Museum data upload succeeded but reload failed
- **Cause**: `loadFromTier2()` missing `&sortKey=museum` in GET URL
- **Fix**: Added sortKey parameter to match save operation (PR #719)
- **Lesson**: ALWAYS check that GET queries include sortKey

**Issue #2**: Leaderboard showing only local user
- **Cause**: GET request missing sortKey parameter
- **Fix**: Added `&sortKey=*` to query all user records
- **Lesson**: Use sortKey wildcards for range queries

#### Testing KV Store Code

**Required tests for any KV store interaction:**

```javascript
test('should include sortKey parameter in query', async () => {
    await loader.loadFromTier2('forbidden-city');
    
    const fetchCall = fetch.mock.calls[0];
    const url = fetchCall[0];
    
    // Verify both parameters present
    expect(url).toContain('key=museum-data-forbidden-city');
    expect(url).toContain('sortKey=museum');
});
```

**Manual verification steps:**
1. Save data via POST with key + sortKey
2. Immediately try to load via GET with same key + sortKey  
3. Verify 200 response (not 404)
4. Verify returned data matches saved data

## Troubleshooting

### Common Issues (VALIDATED SOLUTIONS)

**Application Not Loading**:
- Ensure Python HTTP server is running: `python3 -m http.server 8000`
- Check browser console for errors (F12 > Console)  
- Verify you're accessing http://localhost:8000 (not file://)
- Google Analytics errors are normal in localhost (blocked by ad blockers)

**Local Storage Not Persisting**:
- Check browser privacy settings (not in incognito/private mode)
- Verify localStorage in DevTools > Application > Local Storage > http://localhost:8000
- Clear browser cache if data appears corrupted
- Some browsers limit localStorage for file:// protocol (use HTTP server)

**Chinese Characters Not Displaying**:
- Ensure browser supports Chinese fonts
- Check HTML meta charset is UTF-8 (already set in index.html)
- Try different browsers if font rendering issues persist

**Modal Not Opening**:  
- Check JavaScript console for errors
- Verify click event handlers are bound correctly
- Clear localStorage if modal state appears stuck

## Performance Considerations

### Application Metrics (MEASURED)
- **Server startup**: 1-2 seconds for Python HTTP server
- **Application load**: Instantaneous (static files)
- **File sizes**: index.html (4KB), script.js (124KB, 3,017 lines), style.css (12KB)
- **Museum data**: 120 museums × 3 age groups × 2 checklist types = 720 unique checklists
- **localStorage usage**: Minimal (<1KB typical usage, <100KB theoretical maximum)

### Optimization Notes
- No build process needed (already optimized for static delivery)
- Images are minimal (uses emoji icons and CSS styling)
- Google Analytics loads asynchronously (won't block app startup)
- Chinese text rendering is efficient (native browser support)

## Deployment and Live Environment

### GitHub Pages (ACTIVE)
- **Production URL**: https://jackandking.github.io/MuseumCheck/
- **Development URL**: https://jackandking.github.io/MuseumCheckDev/ (view current development state here)
- **Custom Domain**: https://museumcheck.cn (configured via CNAME file)  
- **Auto-deployment**: Pushes to main branch auto-deploy to GitHub Pages
- **No build step**: Direct deployment of static files

### Making Changes
When updating the application:

1. **Test locally first**: Always test with local HTTP server
2. **Validate all user workflows**: Run through complete scenarios  
3. **Check localStorage compatibility**: Ensure changes don't break existing data
4. **Test Chinese text rendering**: Verify characters display correctly
5. **Commit and push**: Changes auto-deploy to GitHub Pages

## Key Project Information

- **Primary Language**: HTML/CSS/JavaScript (ES6+, client-side only)
- **Data Storage**: Browser localStorage (5-10MB limit per domain)
- **Target Users**: Chinese families with children visiting museums
- **Architecture**: Single Page Application with modal dialogs
- **Deployment**: Static hosting via GitHub Pages
- **Analytics**: Google Analytics 4 (GA_MEASUREMENT_ID: G-YHF52B1NMH)
- **Domain**: museumcheck.cn (custom domain via CNAME)


## Complete Museum List (120 Museums)
The application includes 120 major Chinese museums covering all provinces and regions, including:
1. 故宫博物院 (Beijing)
2. 中国国家博物馆 (Beijing)
3. 上海博物馆 (Shanghai)
4. 秦始皇帝陵博物院 (Xi'an)
5. 南京博物院 (Nanjing)
6. 湖北省博物馆 (Wuhan)
7. 陕西历史博物馆 (Xi'an)
8. 中国科学技术馆 (Beijing)
9. 苏州博物馆 (Suzhou)
10. 浙江省博物馆 (Hangzhou)
11. 广东省博物馆 (Guangzhou)
12. 四川博物院 (Chengdu)
13. 河南博物院 (Zhengzhou)
14. 辽宁省博物馆 (Shenyang)
15. 山东博物馆 (Jinan)
16. 天津博物馆 (Tianjin)
17. 中国美术馆 (Beijing)
18. 湖南省博物馆 (Changsha)
19. 西藏博物馆 (Lhasa)
20. 新疆维吾尔自治区博物馆 (Urumqi)
21. 云南省博物馆 (Kunming)
22. 内蒙古博物院 (Hohhot)
23. 重庆中国三峡博物馆 (Chongqing)
24. 青海省博物馆 (Xining)
25. 黑龙江省博物馆 (Harbin)
26. 宁夏博物馆 (Yinchuan)

## Validation Checklist (RUN AFTER ANY CHANGES)

**Data Quality Validation (MANDATORY FIRST STEP)**:
- [ ] **Museum data integrity**: Run comprehensive duplicate detection analysis
- [ ] **No duplicate museum names**: Each `name` field appears exactly once
- [ ] **No duplicate museum IDs**: Each `id` field appears exactly once  
- [ ] **No undefined values**: No `undefined`, `null`, or missing critical fields
- [ ] **Expected museum count**: Verify actual count matches documented expectations
- [ ] **Systematic issues identified**: Document any broader data quality problems discovered
- [ ] **Issue reporting complete**: All discovered systematic issues reported to user

```bash
# MANDATORY: Run comprehensive data validation before any changes
cd /home/runner/work/MuseumCheck/MuseumCheck
npm run validate-data

# Alternative: Quick validation with inline script
node -e "
const fs = require('fs');
const content = fs.readFileSync('script.js', 'utf8');
const startIdx = content.indexOf('const MUSEUMS = [');
const endIdx = content.indexOf('];', startIdx) + 2;
const museums = eval(content.substring(startIdx, endIdx).replace('const MUSEUMS = ', ''));

console.log('✅ Museum count:', museums.length);

const names = new Map(); const ids = new Map();
let dupNames = 0, dupIds = 0;

museums.forEach((m, i) => {
  if (names.has(m.name)) { 
    console.log(\`❌ DUPLICATE NAME: \${m.name} (indices \${names.get(m.name)} and \${i})\`);
    dupNames++;
  } else names.set(m.name, i);
  
  if (ids.has(m.id)) { 
    console.log(\`❌ DUPLICATE ID: \${m.id} (indices \${ids.get(m.id)} and \${i})\`);
    dupIds++;
  } else ids.set(m.id, i);
});

console.log(dupNames === 0 ? '✅ No duplicate names' : \`❌ \${dupNames} duplicate names found\`);
console.log(dupIds === 0 ? '✅ No duplicate IDs' : \`❌ \${dupIds} duplicate IDs found\`);
console.log(''); 
console.log('🚨 IF DUPLICATES FOUND: Report systematic issue before proceeding with changes');
"

# Or run data quality tests specifically
npm run test:data-quality
```

**Unit Testing (MANDATORY FOR BUG FIXES)**:
- [ ] **Unit tests exist**: Every bug fix has corresponding regression tests
- [ ] **All tests pass**: `npm test` returns zero exit code  
- [ ] **Coverage adequate**: New/changed code is covered by tests
- [ ] **No test skipping**: All tests are running, none disabled/skipped

**Application Testing**:
- [ ] **Server starts in 1-2 seconds**: `python3 -m http.server 8000`
- [ ] **Application loads at http://localhost:8000**
- [ ] **All museums display correctly**: Verify count matches expected (check data validation above)
- [ ] **Age selector works**: Changes between 3-6岁, 7-12岁, 13-18岁
- [ ] **Museum modals open**: Click any museum card opens detailed view
- [ ] **Tab switching works**: "家长准备" and "孩子任务" tabs function
- [ ] **Checklist items can be checked/unchecked**
- [ ] **Visit tracking works**: Museum checkboxes update visit counter
- [ ] **Data persists**: Refresh browser, all progress remains
- [ ] **localStorage contains expected data**: Check DevTools > Application
- [ ] **Progress percentage calculates correctly**: Based on actual museum count from validation
- [ ] **Chinese text renders properly**: No character encoding issues
- [ ] **Responsive design works**: Test mobile view (DevTools device toggle)
- [ ] **HTTP responses are correct**: 200 OK for assets, 404 for missing files

**CRITICAL**: If any checklist item fails, investigate before making changes. Run data quality validation FIRST to catch systematic issues, then unit tests (`npm test`) to catch issues early, then manually verify functionality.

Always validate your changes by running through the complete user scenarios above before committing code.

## Mobile UX Best Practices (手机用户体验最佳实践)

**CRITICAL**: MuseumCheck is a mobile-first application. **All changes must prioritize mobile experience** and follow these established patterns to maintain the high-quality mobile UX that users depend on.

### Mobile Design Philosophy

**Primary Principle**: **Minimize cognitive load and physical effort** for parents juggling children while navigating museums.

**Core Goals**:
- **Reduce scrolling**: Compact, scannable layouts that fit mobile screens
- **Minimize taps**: Essential actions accessible in 1-2 taps maximum  
- **Eliminate text input**: Use selection-based interactions wherever possible
- **Optimize for one-handed use**: All critical actions within thumb reach
- **Prevent accidental touches**: Adequate spacing between interactive elements

### Responsive Breakpoints (响应式断点)

**Established Breakpoints** (DO NOT CHANGE without comprehensive testing):
```css
/* Small phones (iPhone SE, etc.) */
@media (max-width: 480px) { /* Critical optimizations */ }

/* Standard mobile (iPhone 6+, Android) */  
@media (max-width: 768px) { /* Primary mobile styles */ }

/* Desktop/tablet */
@media (min-width: 769px) { /* Desktop enhancements */ }
```

**Mobile Viewport Priority**: Design for 375px width (iPhone 8/X baseline) first, then scale up.

### Touch Interface Guidelines (触屏界面指南)

#### **Button Sizing and Spacing**
```css
/* MANDATORY: Minimum touch target size */
.touch-target {
    min-width: 44px;   /* Apple HIG requirement */
    min-height: 44px;
    padding: 12px 16px; /* Internal padding for comfort */
}

/* MANDATORY: Minimum spacing between touch targets */
.touch-targets-container {
    gap: 8px; /* Minimum 8px between interactive elements */
}
```

#### **Icon vs. Text Buttons (Mobile Strategy)**
**PRINCIPLE**: Use icons on mobile, text on desktop to optimize space.

```css
/* Example from current implementation */
@media (max-width: 768px) {
    .button-text { display: none; }  /* Hide text labels */
    .button-icon { display: block; } /* Show icon only */
    
    .clear-data-button-icon {
        width: 24px;
        height: 24px;
        /* Emoji icon: 🗑️ */
    }
}
```

**Icon Selection Standards**:
- **🔗** Share/link actions
- **🗑️** Delete/clear actions  
- **✏️** Edit actions
- **📊** Statistics/analytics
- **🎖️** Achievements/rewards
- **➕** Add new item

### Layout Optimization for Mobile (移动端布局优化)

#### **Vertical Stack Principle** 
**RULE**: Convert horizontal layouts to vertical stacks on mobile.

```css
@media (max-width: 768px) {
    .desktop-horizontal {
        flex-direction: column !important;
        gap: 10px;
    }
    
    /* Grid simplification */
    .desktop-grid {
        grid-template-columns: 1fr !important;
        gap: 12px;
    }
}
```

#### **Museum Card Mobile Layout**
**Current Optimized Pattern**:
```css
@media (max-width: 480px) {
    .museum-card {
        padding: 15px;        /* Reduced from desktop 20px */
        margin-bottom: 12px;  /* Tighter spacing */
    }
    
    .museum-card h3 {
        font-size: 1.1em;     /* Smaller title */
        line-height: 1.3;     /* Better readability */
    }
}
```

### Modal and Dialog Optimization (弹窗优化)

#### **Mobile Modal Best Practices**
**CRITICAL**: Mobile modals must feel natural and responsive.

```css
/* Current pattern - DO NOT BREAK */
@media (max-width: 768px) {
    .modal-content {
        width: 95vw !important;  /* Near full-width */
        max-height: 90vh;        /* Prevent overflow */
        margin: 5vh auto;        /* Centered with breathing room */
    }
    
    .modal-header {
        padding: 15px;           /* Reduced padding */
        position: sticky;        /* Keep header visible during scroll */
        top: 0;
        background: white;
        z-index: 10;
    }
}
```

#### **Checklist Item Mobile Optimization**
**Pattern**: Horizontal layout with touch-optimized spacing.
```css
.checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;               /* Minimum touch spacing */
    padding: 12px 15px;      /* Touch-comfortable padding */
    min-height: 44px;        /* Minimum touch target */
}

.checklist-checkbox {
    flex-shrink: 0;          /* Prevent checkbox shrinking */
    margin-top: 2px;         /* Align with text baseline */
}
```

### Typography for Mobile Readability (移动端排版)

#### **Font Size Standards**
```css
/* Prevent iOS zoom - MANDATORY */
input, textarea, select {
    font-size: 16px !important; /* iOS won't zoom if >= 16px */
}

/* Mobile font scaling */
@media (max-width: 768px) {
    h1 { font-size: 1.8em; }     /* Smaller than desktop 2.5em */
    h2 { font-size: 1.5em; }     /* Smaller than desktop 2em */  
    h3 { font-size: 1.2em; }     /* Smaller than desktop 1.5em */
    
    body { 
        font-size: 14px;          /* Base mobile font size */
        line-height: 1.4;         /* Compact line spacing */
    }
}

/* Ultra-small phone optimization */
@media (max-width: 480px) {
    h1 { font-size: 1.6em; }     /* Further reduced */
    body { font-size: 13px; }    /* Smaller base size */
}
```

#### **Chinese Text Optimization**
```css
/* Chinese character display - CRITICAL for this app */
body {
    font-family: -apple-system, BlinkMacSystemFont, 
                 "PingFang SC", "Hiragino Sans GB", 
                 "Microsoft YaHei", sans-serif;
}

/* Better Chinese text wrapping */
.chinese-text {
    word-break: break-all;       /* Wrap Chinese characters properly */
    line-height: 1.6;            /* More space for Chinese readability */
}
```

### Form and Input Mobile Optimization (表单优化)

#### **Search Input Mobile Pattern**
```css
/* Current optimized pattern */
@media (max-width: 480px) {
    .search-input {
        font-size: 16px;         /* Prevent iOS zoom */
        padding: 10px 40px 10px 12px;  /* Touch-optimized padding */
        border-radius: 8px;      /* Finger-friendly corners */
    }
    
    .search-input::placeholder {
        font-size: 14px;         /* Slightly smaller placeholder */
    }
}
```

#### **Age Selector Mobile Layout**
```css
/* Current responsive pattern */
@media (max-width: 768px) {
    .age-options {
        flex-direction: column;   /* Stack vertically */
        gap: 8px;                /* Minimal spacing */
        align-items: center;
    }
    
    .age-option {
        min-width: 200px;        /* Consistent touch target */
        padding: 6px 12px;       /* Reduced from desktop padding */
        font-size: 15px;         /* Readable but compact */
    }
}
```

### Performance Optimization for Mobile (移动端性能)

#### **Animation Guidelines**
**RULE**: Reduce animations on mobile for better performance and battery life.

```css
/* Desktop: Rich animations */
@media (min-width: 769px) {
    .hover-effect {
        transition: all 0.3s ease;
        transform: translateY(-2px);
    }
}

/* Mobile: Simplified animations */
@media (max-width: 768px) {
    .hover-effect {
        transition: background-color 0.2s ease; /* Only color change */
        /* No transform animations */
    }
}
```

#### **Loading States for Mobile**
**CRITICAL**: Mobile users have shorter attention spans and slower connections.

```css
.mobile-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;        /* Compact padding */
    min-height: 200px;         /* Reasonable height */
}

.loading-text {
    font-size: 14px;           /* Smaller text */
    margin-top: 15px;          /* Reduced spacing */
    color: #666;
}
```

### Navigation and Information Architecture (导航优化)

#### **Progressive Disclosure Pattern**
**PRINCIPLE**: Show only essential information first, provide access to details on demand.

**Current Implementation**:
1. **Museum Cards**: Show name, location, basic tags only
2. **Modal on Tap**: Full details, checklists, expert guidance  
3. **Tab System**: Separate parent vs. child content
4. **Expandable Sections**: Expert guidance, settings

#### **Breadcrumb and Back Navigation**
```css
/* Mobile-optimized modal header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.close-button {
    font-size: 24px;          /* Large enough for easy tapping */
    padding: 8px;             /* Extra touch area */
    color: #666;
}
```

### Testing Requirements for Mobile Changes (移动端测试要求)

#### **Mandatory Mobile Testing Checklist**
**EVERY change must be tested on**:

1. **Physical Devices** (if available):
   - iPhone (Safari)  
   - Android phone (Chrome)

2. **Browser DevTools** (minimum requirement):
   ```bash
   # Chrome DevTools mobile simulation
   # F12 > Device Toggle > iPhone 8 (375x667)
   # Test at 375px, 414px, and 480px widths
   ```

3. **Touch Interaction Testing**:
   - All buttons reachable with thumb (one-handed use)
   - No accidental taps between closely spaced elements
   - Scroll performance smooth with no lag
   - Pinch-to-zoom disabled for app content (viewport meta tag)

4. **Performance Testing**:
   ```bash
   # Chrome DevTools Performance tab
   # Throttle CPU: 4x slowdown
   # Throttle Network: Fast 3G
   # Test modal opening/closing performance
   ```

#### **Mobile-Specific User Scenarios** 
**Test these scenarios after ANY UI change**:

1. **Parent with Crying Child Scenario**:
   - Can complete museum check-in in under 10 seconds
   - One-handed operation possible  
   - Large, obvious buttons for critical actions

2. **Museum Visit In-Progress Scenario**:
   - Quick access to child checklist (2 taps max)
   - Easy marking items as complete
   - Progress visible at a glance

3. **Network Interruption Scenario**:
   - App works offline (localStorage-based)
   - No broken states when connection drops
   - Graceful handling of network errors

### Code Review Checklist for Mobile UX (代码审查清单)

**MANDATORY checks before any commit affecting UI**:

- [ ] **Touch targets ≥ 44px**: All interactive elements meet minimum size
- [ ] **Spacing ≥ 8px**: Adequate space between touch targets  
- [ ] **Font size ≥ 16px**: Input fields prevent iOS zoom
- [ ] **Responsive breakpoints**: Changes work at 375px, 768px, 480px
- [ ] **One-handed usability**: Critical actions within thumb reach
- [ ] **Chinese text rendering**: Proper font stacks and line heights
- [ ] **Performance impact**: No new animations/transitions on mobile
- [ ] **Loading states**: Clear feedback for any async operations
- [ ] **Error handling**: Mobile-appropriate error messages and recovery

### Emergency Mobile UX Recovery (紧急修复指南)

**If mobile UX breaks after a change**:

1. **Immediate Rollback**:
   ```bash
   git revert <commit-hash>
   # Test on mobile immediately
   ```

2. **Common Mobile Break Points**:
   - Modal sizing (check viewport units)
   - Touch target sizing (check min-width/height)
   - Font size changes (check for iOS zoom trigger)
   - Flex layout changes (check flex-direction on mobile)

3. **Quick Mobile Test**:
   ```bash
   python3 -m http.server 8000
   # Chrome DevTools > Device Toggle > iPhone 8
   # Test museum card click > modal opens > checklist works
   ```

**Remember**: Mobile users represent 70%+ of MuseumCheck traffic. Mobile experience is not optional – it IS the experience.

