````instructions
# MuseumCheck - Museum Checklist Web Application

MuseumCheck is a fully functional web application designed to help parents and children track visits to museums in China. The application provides age-appropriate checklists for different museums and uses only local storage for data persistence.

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## 🚫 CRITICAL: 文档创建规范 (Documentation Rules)

**⚠️ 强制执行：禁止在根目录创建新的 Markdown 文件！**

所有新文档必须创建在 `docs/` 目录的相应子目录中：
- `docs/architecture/` - 架构设计文档
- `docs/features/` - 功能说明文档  
- `docs/guides/` - 开发指南和教程
- `docs/api/` - API 接口文档
- `docs/reports/` - 进度报告和总结

**详细规范**: 查看 [.github/copilot-instructions-docs.md](.github/copilot-instructions-docs.md)

**例外**: 仅 `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `LICENSE.md` 允许在根目录。

---

## 🏗️ CRITICAL: 架构决策规范 (Architecture Decision Rules)

**⚠️ 强制执行：任何涉及架构决策的实现必须先明确标注并确认！**

### 何时需要标注架构决策？

当实现涉及以下任何一项时，**必须**在实施前明确列出架构决策并等待确认：

1. **全局状态管理** - 添加/修改全局变量、window对象属性、localStorage键名
2. **脚本加载策略** - 改变脚本加载顺序、位置、时机（sync/async/defer）
3. **API设计变更** - 新增/修改公共API、函数签名、事件接口
4. **数据流向改变** - 修改数据存储位置、数据流转路径、存储适配器
5. **代码组织结构** - 文件移动、目录结构调整、模块拆分/合并
6. **跨页面功能** - 影响多个页面的功能实现、共享组件设计
7. **第三方依赖** - 引入新依赖库、升级主要版本、替换现有库
8. **性能关键路径** - 改变首屏加载逻辑、关键渲染路径、缓存策略

### 架构决策标注格式

在实施计划中使用专门章节标注：

```markdown
## 🏗️ 架构决策（Architecture Decisions）

**必须明确确认以下架构决策后才能实施：**

1. **决策标题** - 决策内容描述
   - **理由**：为什么做这个决策
   - **影响范围**：影响哪些文件/模块
   - **替代方案**：考虑过哪些其他方案
   - **风险**：潜在风险和缓解措施

2. **决策标题2** - ...
```

### 架构决策审查清单

实施前必须回答：
- [ ] 这个决策是否影响系统的长期可维护性？
- [ ] 是否有更简单的实现方式？
- [ ] 是否与现有架构模式一致？
- [ ] 是否引入新的复杂性？值得吗？
- [ ] 是否考虑了向后兼容性？
- [ ] 是否有明确的回滚策略？

**原则**: 架构决策应该减少复杂性而非增加复杂性。优先选择简单、一致、可维护的方案。

---

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

### Letmetry Web Service API (from /api-docs)

The project integrates with the Letmetry Web Service. The live Swagger UI at `https://letmetry.cloud/api-docs/` documents the available endpoints. Key endpoints and their request/parameter formats (discovered from the embedded OpenAPI document) are summarized below — use these when calling the remote service.

- `POST /mysql/query` (MySQL)
    - Content-Type: `application/json`
    - Body schema: `{ "sql": "<SQL string>", "params": [ ... ] }`
    - `sql` (string, required): SQL statement to execute (e.g., `SELECT * FROM users WHERE id = ?`).
    - `params` (array, optional): Parameter values for prepared statements.
    - Responses: `200` → JSON array (rows); `500` → `{ error, sqlMessage, sql }`.

- `POST /mysql/getById`
    - Body: `{ "table": "<table>", "id": <id> }` → returns single record.

... (file continues with merged content)
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

### Letmetry Web Service API (from /api-docs)

The project integrates with the Letmetry Web Service. The live Swagger UI at `https://letmetry.cloud/api-docs/` documents the available endpoints. Key endpoints and their request/parameter formats (discovered from the embedded OpenAPI document) are summarized below — use these when calling the remote service.

- `POST /mysql/query` (MySQL)
    - Content-Type: `application/json`
    - Body schema: `{ "sql": "<SQL string>", "params": [ ... ] }`
    - `sql` (string, required): SQL statement to execute (e.g., `SELECT * FROM users WHERE id = ?`).
    - `params` (array, optional): Parameter values for prepared statements.
    - Responses: `200` → JSON array (rows); `500` → `{ error, sqlMessage, sql }`.

- `POST /mysql/getById`
    - Body: `{ "table": "<table>", "id": <id> }` → returns single record.

- `POST /mysql/insert` / `POST /mysql/update` / `POST /mysql/delete`
    - Insert: `{ "table": "<table>", "data": { ... } }` → returns `{ insertId }`.
    - Update: `{ "table": "<table>", "id": <id>, "data": { ... } }` → returns `{ affectedRows }`.
    - Delete: `{ "table": "<table>", "id": <id> }` → returns `{ affectedRows }`.

- `POST /ai/chat`
    - Body: `{ "message": "..." }` → AI chat request; returns JSON object.

- `POST /image/search`
    - Body: `{ "keyword": "...", "count": <number> }` → returns `{ success, images: [...] }`.

- `POST /image/upload`
    - Content-Type: `multipart/form-data`
    - Form field: `file` (binary) — required. Saves to server images directory.
    - Responses: `200` → `{ success, filename, originalname, path, size }`, `409` on name conflict.

- `POST /file/upload`
    - Content-Type: `multipart/form-data`
    - Form field: `file` (binary) — required. General file upload endpoint.
    - Responses: `200` → `{ success, filename, originalname, path, destination }`.

- `GET /file/list`
    - Returns: `{ success: true, files: [ { filename, size, created, modified, ... } ] }`.

- `GET /file/info/{filename}` and `GET /file/download/{filename}`
    - `filename` is a path parameter; used to obtain metadata or download files.

- `POST /museum/search`
    - Body: `{ "museumName": "..." }` → returns structured museum metadata from external sources.

Notes:
- The Swagger UI includes all paths under the `swaggerDoc` object; use the `sql` body key for `/mysql/query` (not `query`) when submitting JSON requests.
- Many endpoints accept JSON request bodies; file uploads use `multipart/form-data` with field name `file`.
- Error responses often include an object with `error` or `sqlMessage` fields for diagnostics.

### MySQL Schema Management via Letmetry API

The Letmetry `/mysql/query` endpoint can be used to perform MySQL schema operations (DDL - Data Definition Language) when needed. This allows database schema changes through curl or JavaScript without direct database access.

#### Common Schema Operations

**Check Current Schema**:
```bash
# View all tables in database
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SHOW TABLES"}'

# Describe table structure
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "DESCRIBE table_name"}'

# Show table creation statement
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SHOW CREATE TABLE table_name"}'
```

**Create Table**:
```bash
# Create new table
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
  }'
```

**Alter Table**:
```bash
# Add new column
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email"}'

# Modify column
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "ALTER TABLE users MODIFY COLUMN username VARCHAR(500) NOT NULL"}'

# Add index
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "ALTER TABLE users ADD INDEX idx_email (email)"}'

# Drop column
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "ALTER TABLE users DROP COLUMN phone"}'
```

**Drop Table**:
```bash
# Drop table (use with caution)
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "DROP TABLE IF EXISTS old_table"}'
```

#### Best Practices for Schema Changes

**1. Always Check Before Modifying**:
```bash
# Verify table exists before altering (example - use actual whitelisted table name)
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SHOW TABLES LIKE \"users\""}'

# Check if column exists before adding (example - validate table/column against whitelist first)
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SHOW COLUMNS FROM users LIKE \"new_column\""}'
```

**2. Use Safe DDL Patterns**:
- ✅ Use `CREATE TABLE IF NOT EXISTS` to avoid errors
- ✅ Use `DROP TABLE IF EXISTS` to handle non-existent tables
- ✅ MySQL does NOT support `ADD COLUMN IF NOT EXISTS` - always check column existence first
- ✅ Check existing schema before modifications to avoid errors

**3. Schema Versioning Strategy**:
```bash
# Create schema_version table to track migrations
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS schema_version (
      version INT PRIMARY KEY,
      description VARCHAR(255),
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )"
  }'

# Record migration
curl -X POST https://letmetry.cloud/mysql/query \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "INSERT INTO schema_version (version, description) VALUES (?, ?)",
    "params": [1, "Initial schema creation"]
  }'
```

**IMPORTANT NOTE on Query Types**:
- **DDL Operations (CREATE, ALTER, DROP)**: Cannot use parameterized queries - must validate via whitelists
- **DML Operations (INSERT, SELECT, UPDATE, DELETE)**: Should ALWAYS use parameterized queries
- The LetmetryAPI.queryMysql() accepts two parameters: `queryMysql(sql, params = [])`
- For DDL: Only the sql parameter is used (after whitelist validation)
- For DML: Both sql and params should be used for security

**4. JavaScript Usage Example**:
```javascript
// Using LetmetryAPI helper from letmetry-cloud-api.js
const LetmetryAPI = require('./letmetry-cloud-api.js');

// IMPORTANT: All examples below show proper security patterns
// - DDL (CREATE/ALTER/DROP): Use whitelist validation, then string interpolation
// - DML (INSERT/SELECT/UPDATE/DELETE): Use parameterized queries with params array
// - LetmetryAPI.queryMysql(sql, params = []) supports both patterns

// Check current schema (DDL - no parameters needed)
async function checkSchema() {
  const tables = await LetmetryAPI.queryMysql('SHOW TABLES');
  console.log('Existing tables:', tables);
  return tables;
}

// Create table safely with whitelist validation
async function createTableIfNeeded(tableName) {
  // SECURITY: Validate table name against whitelist
  const ALLOWED_TABLES = ['users', 'museums', 'achievements'];
  if (!ALLOWED_TABLES.includes(tableName)) {
    throw new Error(`Table ${tableName} not in whitelist`);
  }
  
  // Check if table exists (using validated tableName after whitelist)
  const tables = await LetmetryAPI.queryMysql('SHOW TABLES');
  const tableExists = tables.some(t => Object.values(t)[0] === tableName);
  
  if (!tableExists) {
    // Only use validated tableName in DDL after whitelist check
    await LetmetryAPI.queryMysql(`
      CREATE TABLE ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log(`Table ${tableName} created successfully`);
  } else {
    console.log(`Table ${tableName} already exists`);
  }
}

// Add column if not exists with validation
async function addColumnIfNeeded(tableName, columnName, columnDef) {
  // SECURITY: Validate all identifiers against whitelists
  const ALLOWED_TABLES = ['users', 'museums', 'achievements'];
  const ALLOWED_COLUMNS = ['username', 'email', 'phone', 'created_at'];
  const ALLOWED_DEFS = ['VARCHAR(255)', 'VARCHAR(20)', 'INT', 'TIMESTAMP'];
  
  if (!ALLOWED_TABLES.includes(tableName)) {
    throw new Error(`Table ${tableName} not in whitelist`);
  }
  if (!ALLOWED_COLUMNS.includes(columnName)) {
    throw new Error(`Column ${columnName} not in whitelist`);
  }
  if (!ALLOWED_DEFS.includes(columnDef)) {
    throw new Error(`Column definition ${columnDef} not in whitelist`);
  }
  
  // Check if column exists (safe after all validation)
  const columns = await LetmetryAPI.queryMysql(`SHOW COLUMNS FROM ${tableName}`);
  const columnExists = columns.some(c => c.Field === columnName);
  
  if (!columnExists) {
    // Only use validated identifiers after whitelist check
    await LetmetryAPI.queryMysql(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`
    );
    console.log(`Column ${columnName} added to ${tableName}`);
  } else {
    console.log(`Column ${columnName} already exists in ${tableName}`);
  }
}
```

#### Security Considerations for Schema Changes

**CRITICAL Security Rules**:
- ⚠️ **Never** expose schema modification endpoints to public APIs
- ⚠️ **Never** construct DDL statements from user input without validation
- ⚠️ **Always** validate table/column names against a whitelist
- ⚠️ **Always** use parameterized queries for data manipulation (DML)
- ⚠️ **Never** drop tables in production without explicit confirmation
- ⚠️ **Always** backup data before destructive schema changes

**Safe Pattern for Dynamic Schema Operations**:
```javascript
// Safe: Whitelist allowed table names
const ALLOWED_TABLES = ['users', 'museums', 'achievements'];

async function safeAlterTable(tableName, operation) {
  // Validate table name against whitelist
  if (!ALLOWED_TABLES.includes(tableName)) {
    throw new Error(`Table ${tableName} not in whitelist`);
  }
  
  // SECURITY: Validate operation structure with strict regex patterns
  // Only allow specific, well-formed operations
  const ADD_COLUMN_PATTERN = /^ADD COLUMN [a-zA-Z_][a-zA-Z0-9_]* (VARCHAR\(\d+\)|INT|TIMESTAMP|TEXT|DATETIME|DATE)( NOT NULL| NULL| DEFAULT ('[\w\s-]+'|\d+|CURRENT_TIMESTAMP|NULL))?$/;
  const DROP_COLUMN_PATTERN = /^DROP COLUMN [a-zA-Z_][a-zA-Z0-9_]*$/;
  const ADD_INDEX_PATTERN = /^ADD INDEX [a-zA-Z_][a-zA-Z0-9_]* \([a-zA-Z_][a-zA-Z0-9_]*(, ?[a-zA-Z_][a-zA-Z0-9_]*)*\)$/;
  
  const isValid = 
    ADD_COLUMN_PATTERN.test(operation) ||
    DROP_COLUMN_PATTERN.test(operation) ||
    ADD_INDEX_PATTERN.test(operation);
    
  if (!isValid) {
    throw new Error(`Operation does not match allowed patterns: ${operation}`);
  }
  
  // Execute validated operation
  const sql = `ALTER TABLE ${tableName} ${operation}`;
  return await LetmetryAPI.queryMysql(sql);
}
```

#### Testing Schema Changes

**Validation Steps**:
1. **Test in Development First**: Always test schema changes locally or in dev environment
2. **Verify Structure**: Use `DESCRIBE table_name` to confirm changes
3. **Check Data Integrity**: Ensure existing data is not corrupted
4. **Test Application**: Verify application still works with new schema
5. **Monitor Errors**: Check for SQL errors in response objects

**Example Validation Script**:
```javascript
async function validateSchemaChange(tableName, expectedColumns) {
  // SECURITY: Validate table name against whitelist
  const ALLOWED_TABLES = ['users', 'museums', 'achievements'];
  if (!ALLOWED_TABLES.includes(tableName)) {
    throw new Error(`Table ${tableName} not in whitelist`);
  }
  
  // Get current schema (safe after validation)
  const columns = await LetmetryAPI.queryMysql(`DESCRIBE ${tableName}`);
  
  // Verify expected columns exist
  const columnNames = columns.map(col => col.Field);
  const missing = expectedColumns.filter(col => !columnNames.includes(col));
  
  if (missing.length > 0) {
    console.error('Missing columns:', missing);
    return false;
  }
  
  console.log('Schema validation passed');
  return true;
}

// Usage
await validateSchemaChange('users', ['id', 'username', 'email', 'created_at']);
```

#### Error Handling

The MySQL query API returns errors in this format:
```json
{
  "error": "Error message",
  "sqlMessage": "Detailed SQL error",
  "sql": "The SQL statement that failed"
}
```

**Common Errors and Solutions**:
- `Table already exists`: Use `CREATE TABLE IF NOT EXISTS`
- `Table doesn't exist`: Use `DROP TABLE IF EXISTS`
- `Duplicate column name`: Check if column exists first
- `Syntax error`: Validate SQL syntax before execution
- `Access denied`: Verify API permissions for DDL operations

**Error Handling Pattern**:
```javascript
async function executeSchemaChange(sql) {
  try {
    const result = await LetmetryAPI.queryMysql(sql);
    
    // Check for error in response
    if (result && result.error) {
      console.error('SQL Error:', result.sqlMessage);
      console.error('Failed SQL:', result.sql);
      throw new Error(result.error);
    }
    
    console.log('Schema change executed successfully');
    return result;
  } catch (error) {
    console.error('Schema change failed:', error.message);
    throw error;
  }
}
```

#### When to Use Schema Operations

**Appropriate Use Cases**:
- ✅ Adding new features requiring new tables
- ✅ Adding columns for new functionality
- ✅ Creating indexes for performance optimization
- ✅ Development and testing environments
- ✅ One-time migration scripts

**When NOT to Use**:
- ❌ In production without testing and backup
- ❌ Based on untrusted user input
- ❌ During high-traffic periods
- ❌ Without proper authorization/authentication
- ❌ For frequent schema changes (indicates design issues)

**Migration Best Practice**:
```javascript
// Example migration script structure
async function runMigration(version) {
  // Check if already applied
  const applied = await LetmetryAPI.queryMysql(
    'SELECT version FROM schema_version WHERE version = ?',
    [version]
  );
  
  if (applied.length > 0) {
    console.log(`Migration ${version} already applied`);
    return;
  }
  
  try {
    // Execute schema changes
    await executeSchemaChange(/* your DDL */);
    
    // Record successful migration
    await LetmetryAPI.queryMysql(
      'INSERT INTO schema_version (version, description) VALUES (?, ?)',
      [version, 'Description of changes']
    );
    
    console.log(`Migration ${version} completed successfully`);
  } catch (error) {
    console.error(`Migration ${version} failed:`, error);
    throw error;
  }
}
```


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

### Handling Unrelated Bugs Discovered During Development

**IMPORTANT**: When you discover a bug during development that is **unrelated to your current task**, do NOT attempt to fix it immediately. Instead:

1. **Create a new GitHub issue** to document the unrelated bug
2. **Include in the issue**:
   - Clear description of the bug
   - Steps to reproduce (if known)
   - Expected vs. actual behavior
   - Any relevant code locations or files
3. **Continue with your current task** - stay focused on the original issue
4. **Reference the new issue** in your progress report so stakeholders are aware

**Rationale**: Attempting to fix unrelated bugs can:
- Introduce scope creep and delays
- Make code review more difficult
- Increase risk of unintended side effects
- Complicate rollback if issues arise

**Exception**: If the unrelated bug is a **critical security vulnerability** or **blocks your current task**, escalate immediately to the user for guidance.

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

### Finding Museum and Treasure Photos

**IMPORTANT**: When adding or updating museum data, use the image search tools to find high-quality photos. Two tools are available:

1. **Wikimedia Commons Search** (Recommended first) - Free, no API key required, all images under free licenses
2. **Bing Website Search** (Backup option) - Free browser-based search, use when Wikimedia doesn't have ideal images

#### Tool Selection Strategy

**ALWAYS try Wikimedia Commons first** because:
- ✅ No API key required - works immediately
- ✅ All images are under free licenses (Public Domain, CC0, CC BY-SA)
- ✅ High-quality curated images from cultural institutions
- ✅ No usage restrictions or copyright concerns

**Use Bing Website Search as backup** when:
- ❌ Wikimedia doesn't have images for the specific museum
- ❌ Wikimedia images are low quality or not representative
- ❌ You need more variety or specific angles
- ⚠️  Remember to verify image licenses before using Bing results

#### Option 1: Wikimedia Commons Search (Recommended First)

**Tool Location**: `tools/search-museum-images-wikimedia.js`

**Prerequisites**: None - works immediately, no API key required

**Usage Examples**:

```bash
# Search for museum building photos only
node tools/search-museum-images-wikimedia.js "故宫博物院"

# Search for both museum and treasure photos
node tools/search-museum-images-wikimedia.js "故宫博物院" "清明上河图"

# More examples
node tools/search-museum-images-wikimedia.js "中国国家博物馆" "后母戊鼎"
node tools/search-museum-images-wikimedia.js "上海博物馆" "大克鼎"
```

**Features**:
- Searches multiple query variations for better results
- Returns up to 10 unique images per search
- Includes both Chinese and English search terms
- All results are automatically under free licenses
- Provides image metadata (dimensions, MIME type, source page)

#### Option 2: Bing Website Search (Backup - Free Browser Tool)

**Tool Location**: `tools/bing-image-search-helper.html`

**Prerequisites**: None - completely free, no API key required

**Features**:
- ✅ Completely free - no API key or subscription needed
- ✅ Easy to use - graphical web interface
- ✅ Smart search - automatically optimizes search keywords
- ✅ Opens Bing website with optimized search terms
- ⚠️  Manual selection - browse images and copy URLs manually

**Usage**:

```bash
# Open in browser directly
open tools/bing-image-search-helper.html

# Or through HTTP server
python3 -m http.server 8000
# Then visit: http://localhost:8000/tools/bing-image-search-helper.html
```

**Workflow**:
1. Enter museum and treasure names in the web form
2. Click search button to open Bing with optimized search
3. Browse images, right-click and "Copy Image Address"
4. Paste URL into museum data structure
5. Verify image license on source page

#### Advanced Option: Bing API (For Automation)

**Tool Location**: `tools/search-museum-images.js`

For advanced users who need automated batch processing, there's also a Bing Search API tool available. However, this requires a Bing API key from Azure. For most users, the browser-based helper above is recommended.

**Prerequisites**: Bing Search API key from Azure Cognitive Services

**Usage**: See `tools/README.md` for details on setting up the API key

#### Recommended Workflow for Adding Museum Photos

**Step 1: Try Wikimedia Commons First**
```bash
# Search Wikimedia Commons
node tools/search-museum-images-wikimedia.js "博物馆名称" "镇馆之宝名称"
```

**Step 2: If Wikimedia doesn't have good results, use Bing Website Search**
```bash
# Open the browser-based search helper (no API key needed)
open tools/bing-image-search-helper.html
# Or: python3 -m http.server 8000
# Then visit: http://localhost:8000/tools/bing-image-search-helper.html
```

**Step 3: Review Results**

The tools return multiple image URLs with metadata:
- Full image URL (for museum data)
- Thumbnail URL
- Image dimensions and file size
- Source page URL
- License information (Wikimedia only)

**Step 4: Select Appropriate Images**

Choose images that are:
- High quality and clear
- Properly licensed (public domain, Wikimedia Commons, CC0, CC BY-SA, etc.)
- Representative of the museum/treasure
- Appropriate resolution (typically 800x600 or higher)
- Accessible and stable URLs

**Step 5: Verify Image URLs**

Before adding to museum data:
```bash
node tools/verify-treasure-images.js <image-url>
```

**Step 6: Add to Museum Data**

Copy the selected URLs to the museum structure:
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

**Step 7: Validate Data Quality**
```bash
npm run validate-data
```

#### Best Practices

**Image Selection**:
- ✅ Always prefer Wikimedia Commons images (free licenses, no restrictions)
- ✅ Verify image licenses and permissions for Bing results
- ✅ Use high-resolution images (minimum 800x600 pixels)
- ✅ Choose representative, high-quality photos
- ✅ Verify URLs are accessible before committing
- ✅ Test images load correctly in the application

**License Verification**:
- Wikimedia Commons: All images automatically have free licenses
- Bing Image Search: **MUST** verify license before use (check source page)
- Acceptable licenses: Public Domain, CC0, CC BY, CC BY-SA
- Avoid: Copyrighted images, "All Rights Reserved", watermarked images

**Search Tips**:
- For museum buildings: Search includes terms like "博物馆外观", "建筑", "exterior", "building"
- For treasures: Search includes terms like "文物", "高清", "artifact", "collection"
- Try both Chinese and English terms for better results
- Results are filtered for photos only (Bing has safe search enabled)

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

