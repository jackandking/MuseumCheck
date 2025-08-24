# MuseumCheck - Museum Checklist Web Application

MuseumCheck is a web application designed to help parents and children track visits to museums in China. The application provides age-appropriate checklists for different museums and uses only local storage for data persistence.

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Current Repository State

**IMPORTANT**: This repository is in early development stage with minimal initial setup. The current repository contains only:
- README.md with basic project title
- This copilot-instructions.md file

## Project Vision (from Issue #1)

The application aims to solve the problem of children not enjoying museum visits by providing:
- A master checklist showing major museums in China that users can check off when visited
- Two types of checklists per museum: one for parents (preparation and guidance) and one for children
- Age-appropriate variations of checklists
- Local storage only (no backend server required)

## Development Environment Setup

### Prerequisites
Since this will be a web application, ensure you have:
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code recommended)
- Basic HTTP server for local development

### Initial Setup Commands
Run these commands to set up a local development environment:

```bash
# Navigate to repository root
cd /home/runner/work/MuseumCheck/MuseumCheck

# Create basic web application structure (when implementing)
mkdir -p src/{html,css,js}
mkdir -p assets/{images,icons}
mkdir -p docs

# Set up basic HTML structure
touch src/html/index.html
touch src/css/styles.css
touch src/js/app.js
touch src/js/museums.js
touch src/js/storage.js
```

### Local Development Server
For local development, use one of these approaches:

**Option 1: Python HTTP Server (most common)**
```bash
# Python 3 (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Python 2 (fallback)
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js HTTP Server**
```bash
# Install http-server globally
npm install -g http-server
# Run server
http-server -p 8000
```

**Option 3: Live Server (VS Code Extension)**
- Install Live Server extension in VS Code
- Right-click index.html and select "Open with Live Server"

## Build and Test Process

### Current State - No Build Process
**IMPORTANT**: Currently there is no build system, package.json, or automated tests. The application is intended to be a simple client-side web application.

### Future Build Considerations
When the application is implemented, consider:
- No build process needed for basic HTML/CSS/JS
- Optional: Add bundling with Webpack or Vite for optimization
- Optional: Add CSS preprocessing with Sass/Less
- Optional: Add JavaScript minification for production

### Testing Strategy
**Manual Testing Required**: Since this is a client-side application with local storage:

1. **Functionality Testing**:
   - Load the application in browser
   - Test museum checklist interactions
   - Verify local storage persistence
   - Test across different browsers

2. **Data Persistence Testing**:
   - Add museums to checklist
   - Close and reopen browser
   - Verify data persists using browser DevTools > Application > Local Storage

3. **Responsive Design Testing**:
   - Test on desktop browsers
   - Test on mobile browsers
   - Verify responsive design works across screen sizes

## Validation Scenarios

### Core User Workflows to Test
Always test these complete scenarios after making changes:

1. **Parent Workflow**:
   - Open application
   - Browse available museums
   - Select a museum to visit
   - Review parent preparation checklist
   - Mark items as completed
   - Verify data persists after browser refresh

2. **Child Workflow**:
   - Access child-friendly museum checklist
   - Mark visited exhibits/activities
   - View progress visualization
   - Check persistence across sessions

3. **Museum Discovery**:
   - Browse museum list
   - Filter by location/type (future feature)
   - View museum details
   - Add to personal checklist

### Browser Compatibility Testing
Test in these browsers (minimum):
- Chrome/Chromium (latest)
- Firefox (latest)  
- Safari (latest, if on macOS)
- Edge (latest)

## Common Development Tasks

### Working with Local Storage
```javascript
// Example patterns for museum checklist data
localStorage.setItem('visitedMuseums', JSON.stringify(museumArray));
const visited = JSON.parse(localStorage.getItem('visitedMuseums') || '[]');
```

### File Structure Validation
Always check these key files exist:
```
/home/runner/work/MuseumCheck/MuseumCheck/
├── README.md
├── .github/
│   └── copilot-instructions.md
└── src/ (when implemented)
    ├── html/
    │   └── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── app.js
        ├── museums.js
        └── storage.js
```

## Development Guidelines

### Code Standards
- Use modern ES6+ JavaScript features
- Follow consistent indentation (2 or 4 spaces)
- Use semantic HTML elements
- Follow CSS BEM methodology for class naming
- Comment complex logic, especially local storage operations

### Data Structure Considerations
Plan for these data structures:
- Museum information (name, location, description, checklists)
- User progress (visited museums, completed checklist items)
- Age-appropriate content variations

### Performance Considerations
- Minimize HTTP requests (consider inlining small assets)
- Optimize images for web
- Use efficient local storage patterns
- Consider offline functionality (Service Worker for future enhancement)

## Troubleshooting

### Common Issues

**Local Storage Not Working**:
- Check browser privacy settings
- Ensure using HTTPS or localhost (some browsers restrict file:// protocol)
- Clear browser cache and try again

**Application Not Loading**:
- Check browser console for errors (F12 > Console)
- Verify all file paths are correct
- Ensure HTTP server is running on correct port

**Data Loss**:
- Local storage is domain-specific
- Private/incognito browsing may not persist data
- Browser storage limits may cause data eviction

## Future Development Phases

### Phase 1: Basic Implementation
- Create HTML structure for museum list
- Implement basic CSS styling
- Add JavaScript for local storage

### Phase 2: Enhanced Features  
- Add museum details pages
- Implement parent/child checklist variations
- Add age-appropriate content filtering

### Phase 3: Polish & Optimization
- Responsive design improvements
- Performance optimization
- Enhanced user experience features

## Repository Commands Reference

### Current Repository State Check
```bash
# Check repository status
git status

# View repository contents
ls -la /home/runner/work/MuseumCheck/MuseumCheck/

# Check current branch
git branch -a
```

### Development Server Commands
```bash
# Quick development server (Python 3)
cd /home/runner/work/MuseumCheck/MuseumCheck
python3 -m http.server 8000
# Server starts in ~1-2 seconds, access at http://localhost:8000
```

**NEVER CANCEL**: Development servers start quickly (1-2 seconds), but if implementing build processes in the future, allow adequate time for any bundling operations.

## Key Project Information

- **Primary Language**: HTML/CSS/JavaScript (client-side only)
- **Data Storage**: Browser Local Storage (no backend required)
- **Target Users**: Parents and children visiting museums in China
- **Architecture**: Single Page Application (SPA) or simple multi-page site
- **Deployment**: Static hosting (GitHub Pages, Netlify, etc.)

## Notes for Future Contributors

- This project uses Chinese language content for museum information
- Consider accessibility features for children of different ages
- Local storage has size limitations (~5-10MB per domain)
- Test thoroughly across different devices and browsers
- Keep the interface simple and intuitive for parent-child usage

Always validate your changes by running through the complete user scenarios listed above before committing code.