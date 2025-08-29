# MuseumCheck - Museum Checklist Web Application

MuseumCheck is a fully functional web application designed to help parents and children track visits to museums in China. The application provides age-appropriate checklists for different museums and uses only local storage for data persistence.

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Current Repository State

**IMPORTANT**: This is a COMPLETE, FULLY FUNCTIONAL web application. The repository contains:
- `index.html` - Main application HTML file (4KB)
- `script.js` - Complete JavaScript application logic (124KB, 3,017 lines, 26 museums with detailed checklists)
- `style.css` - Complete CSS styling with responsive design (12KB)
- `README.md` - Comprehensive documentation
- `CNAME` - GitHub Pages deployment configuration (museumcheck.cn)
- `.github/copilot-instructions.md` - This file
- `.github/FUNDING.yml` - GitHub sponsorship configuration

**Live Application**: https://jackandking.github.io/MuseumCheck/ and https://museumcheck.cn

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

### Current State - NO BUILD PROCESS REQUIRED
**CRITICAL**: This application has NO build system, package.json, or automated tests. It is a pure client-side web application that runs directly in browsers.

**What EXISTS**:
- Complete HTML/CSS/JavaScript application
- 26 major Chinese museums with detailed data
- Age-appropriate content for 3 age groups (3-6, 7-12, 13-18 years)
- Full localStorage persistence
- Responsive design
- Google Analytics integration

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

### Manual Testing Strategy (REQUIRED)
Since this is a client-side application, manual testing is the primary validation method:

1. **Core Functionality Testing** (ALWAYS do this):
   - Load application: `python3 -m http.server 8000` then visit http://localhost:8000
   - Test age group selector (3-6岁, 7-12岁, 13-18岁)
   - Click museum cards to open detailed checklists (26 museums available)
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
   - Browse museum list (26 museums should display)
   - Click "故宫博物院" (Forbidden City) to open modal
   - Review parent preparation checklist (age-appropriate items)
   - Check off 2-3 preparation items
   - Switch to "孩子任务" tab, review child tasks
   - Close modal, mark museum as visited (checkbox on museum card)
   - Verify visit counter updates (e.g., "1/26 已参观 (3.8%)")
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
- **26 Major Chinese Museums**: Complete data including locations, descriptions, tags
- **Age-Appropriate Content**: 3 distinct age groups with different complexity levels
- **Dual Checklist System**: Parent preparation + child exploration tasks
- **Progress Tracking**: Visual progress with percentages and counters
- **localStorage Persistence**: All data saved locally, works offline
- **Google Analytics**: Event tracking for user interactions  
- **Responsive Design**: Works on desktop and mobile devices
- **Chinese Language Interface**: Native Chinese UI and content

## Common Development Tasks

### Working with Museum Data
The museums are defined in `script.js` in the `MUSEUMS` array:

```javascript
// Example museum structure (DO NOT modify lightly - contains extensive Chinese content)
{
    id: 'forbidden-city',
    name: '故宫博物院', 
    location: '北京',
    description: '世界上现存规模最大、保存最为完整的木质结构古建筑群',
    tags: ['历史', '建筑', '文物'],
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
- **Museum data**: 26 museums × 3 age groups × 2 checklist types = 156 unique checklists
- **localStorage usage**: Minimal (<1KB typical usage, <100KB theoretical maximum)

### Optimization Notes
- No build process needed (already optimized for static delivery)
- Images are minimal (uses emoji icons and CSS styling)
- Google Analytics loads asynchronously (won't block app startup)
- Chinese text rendering is efficient (native browser support)

## Deployment and Live Environment

### GitHub Pages (ACTIVE)
- **Primary URL**: https://jackandking.github.io/MuseumCheck/
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

### Complete Museum List (26 Museums)
The application includes these major Chinese museums:
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

- [ ] **Server starts in 1-2 seconds**: `python3 -m http.server 8000`
- [ ] **Application loads at http://localhost:8000**
- [ ] **All 26 museums display with Chinese names and locations**  
- [ ] **Age selector works**: Changes between 3-6岁, 7-12岁, 13-18岁
- [ ] **Museum modals open**: Click any museum card opens detailed view
- [ ] **Tab switching works**: "家长准备" and "孩子任务" tabs function
- [ ] **Checklist items can be checked/unchecked**
- [ ] **Visit tracking works**: Museum checkboxes update visit counter
- [ ] **Data persists**: Refresh browser, all progress remains
- [ ] **localStorage contains expected data**: Check DevTools > Application
- [ ] **Progress percentage calculates correctly**: e.g., 1/26 = 3.8%
- [ ] **Chinese text renders properly**: No character encoding issues
- [ ] **Responsive design works**: Test mobile view (DevTools device toggle)
- [ ] **HTTP responses are correct**: 200 OK for assets, 404 for missing files

**CRITICAL**: If any checklist item fails, investigate before making changes. This application is fully functional and extensively tested.

Always validate your changes by running through the complete user scenarios above before committing code.