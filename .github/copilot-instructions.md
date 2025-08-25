# MuseumCheck - Museum Checklist Web Application

MuseumCheck is a fully functional web application designed to help parents and children track visits to museums in China. The application provides age-appropriate checklists for different museums and uses only local storage for data persistence.

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Current Repository State

**IMPORTANT**: This is a COMPLETE, FULLY FUNCTIONAL web application. The repository contains:
- `index.html` - Main application HTML file
- `script.js` - Complete JavaScript application logic (54KB+, 16 museums with detailed checklists)
- `style.css` - Complete CSS styling with responsive design
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
- 16 major Chinese museums with detailed data
- Age-appropriate content for 3 age groups (3-6, 7-12, 13-18 years)
- Full localStorage persistence
- Responsive design
- Google Analytics integration

### Manual Testing Strategy (REQUIRED)
Since this is a client-side application, manual testing is the primary validation method:

1. **Core Functionality Testing** (ALWAYS do this):
   - Load application: `python3 -m http.server 8000` then visit http://localhost:8000
   - Test age group selector (3-6岁, 7-12岁, 13-18岁)
   - Click museum cards to open detailed checklists  
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
   - Browse museum list (16 museums should display)
   - Click "故宫博物院" (Forbidden City) to open modal
   - Review parent preparation checklist (age-appropriate items)
   - Check off 2-3 preparation items
   - Switch to "孩子任务" tab, review child tasks
   - Close modal, mark museum as visited (checkbox on museum card)
   - Verify visit counter updates (e.g., "1/16 已参观 (6%)")
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
├── index.html             # Complete HTML application (2KB)
├── script.js              # Full JavaScript logic (54KB+, 1300+ lines)
├── style.css              # Complete responsive CSS (5KB+)
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
- **16 Major Chinese Museums**: Complete data including locations, descriptions, tags
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
- **File sizes**: index.html (2KB), script.js (54KB), style.css (5KB)
- **Museum data**: 16 museums × 3 age groups × 2 checklist types = 96 unique checklists
- **localStorage usage**: Minimal (<1KB typical usage, <50KB theoretical maximum)

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

## Validation Checklist (RUN AFTER ANY CHANGES)

- [ ] **Server starts in 1-2 seconds**: `python3 -m http.server 8000`
- [ ] **Application loads at http://localhost:8000**
- [ ] **All 16 museums display with Chinese names and locations**  
- [ ] **Age selector works**: Changes between 3-6岁, 7-12岁, 13-18岁
- [ ] **Museum modals open**: Click any museum card opens detailed view
- [ ] **Tab switching works**: "家长准备" and "孩子任务" tabs function
- [ ] **Checklist items can be checked/unchecked**
- [ ] **Visit tracking works**: Museum checkboxes update visit counter
- [ ] **Data persists**: Refresh browser, all progress remains
- [ ] **localStorage contains expected data**: Check DevTools > Application
- [ ] **Progress percentage calculates correctly**: e.g., 1/16 = 6%
- [ ] **Chinese text renders properly**: No character encoding issues
- [ ] **Responsive design works**: Test mobile view (DevTools device toggle)

**CRITICAL**: If any checklist item fails, investigate before making changes. This application is fully functional and extensively tested.

Always validate your changes by running through the complete user scenarios above before committing code.