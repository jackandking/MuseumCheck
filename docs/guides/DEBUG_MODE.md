# MuseumCheck Debug Mode Guide

## Overview

MuseumCheck provides a comprehensive debug mode for developers to troubleshoot and analyze application behavior. Debug mode includes:

- **VConsole**: Mobile console for viewing logs, network requests, and storage data
- **Performance Monitor**: Real-time performance metrics overlay
- **localStorage Inspector**: View and manage localStorage data
- **Network Logger**: Intercept and log all fetch requests
- **Error Tracker**: Comprehensive error and rejection tracking
- **Debug Control Panel**: UI toggle for all debug features

## Activation

### Method 1: URL Parameter (Simplest)

Add `?debug=true` or `?debug=1` to any page URL:

```
https://museumcheck.cn/?debug=true
https://localhost:8000/index.html?debug=true
https://jackandking.github.io/MuseumCheck/?debug=1
```

The debug mode persists using localStorage until explicitly disabled.

### Method 2: localStorage Flag (Programmatic)

In browser console:

```javascript
// Enable debug mode
localStorage.setItem('mc_debug', '1');
location.reload();

// Disable debug mode
localStorage.removeItem('mc_debug');
location.reload();
```

### Method 3: Programmatic Control

In any page with debug-mode.js loaded:

```javascript
// Enable debug mode
window.MC_debug.enable();

// Disable debug mode
window.MC_debug.disable();
```

## Global Debug API

### `window.MC_debugMode` - Query & Control

```javascript
// Check if debug mode is enabled
const isEnabled = window.MC_debugMode.isEnabled();

// Check with verbose logging
window.MC_debugMode.isEnabled(true);  // Logs detailed status

// Log status with context
window.MC_debugMode.logStatus('museum-loading');
```

### `window.MC_debug` - Control Functions

```javascript
// Enable debug mode
window.MC_debug.enable();

// Disable debug mode (and unload VConsole)
window.MC_debug.disable();
```

## Test Features

All test features are accessible via `window.MC_debugMode.testFeatures`:

### Performance Monitor

Monitor real-time performance metrics:

```javascript
// Enable performance monitor overlay
window.MC_debugMode.testFeatures.performanceMonitor.enable();

// Disable performance monitor
window.MC_debugMode.testFeatures.performanceMonitor.disable();
```

**Displays**:
- Page load time (ms)
- DOM content loaded time (ms)
- JavaScript heap size (MB)
- localStorage key count

### localStorage Inspector

Inspect and manipulate browser storage:

```javascript
// Enable inspector (logs to console)
window.MC_debugMode.testFeatures.localStorageInspector.enable();

// View current storage (logs table to console)
window.MC_debugMode.testFeatures.localStorageInspector.view();

// Clear specific keys by pattern
window.MC_debugMode.testFeatures.localStorageInspector.clear('visitedMuseums');

// Disable inspector
window.MC_debugMode.testFeatures.localStorageInspector.disable();
```

### Network Logger

Log all fetch requests and responses:

```javascript
// Enable network logging
window.MC_debugMode.testFeatures.networkLogger.enable();

// Disable network logging
window.MC_debugMode.testFeatures.networkLogger.disable();
```

**Logs**:
- Request URL and options
- Response status codes
- Request errors and exceptions

### Error Tracker

Enhanced error and promise rejection tracking:

```javascript
// Enable error tracking
window.MC_debugMode.testFeatures.errorTracker.enable();

// Get all captured errors
const errors = window.MC_debugMode.testFeatures.errorTracker.getErrors();

// View in console
console.table(errors);

// Clear error log
window.MC_debugMode.testFeatures.errorTracker.clearErrors();

// Disable error tracking
window.MC_debugMode.testFeatures.errorTracker.disable();
```

**Captures**:
- Unhandled errors with file/line numbers
- Unhandled promise rejections
- Error timestamps

## Debug Control Panel

When debug mode is activated, a floating control panel appears in the bottom-right corner:

```
┌─────────────────────┐
│ 🔧 Debug Tools    × │
│ ☐ Performance Mon.  │
│ ☐ localStorage Insp.│
│ ☐ Network Logger    │
│ ☐ Error Tracker     │
│ ───────────────────│
│ Disable Debug Mode  │
└─────────────────────┘
```

Use the checkboxes to toggle individual features, or click "Disable Debug Mode" to turn off debugging.

## VConsole Integration

VConsole is automatically loaded when debug mode is activated. Access it via:

1. **Mobile**: Look for VConsole button in top-right corner
2. **Desktop**: VConsole displays in a resizable panel

### VConsole Features

- **Console**: View console logs and errors
- **Network**: Inspect fetch/XHR requests
- **Storage**: View and edit localStorage/sessionStorage
- **System**: View browser information

## Common Workflows

### Debugging Museum Data Load Failures

```javascript
// 1. Enable debug mode
?debug=true

// 2. Enable performance monitor
window.MC_debugMode.testFeatures.performanceMonitor.enable();

// 3. Enable network logger
window.MC_debugMode.testFeatures.networkLogger.enable();

// 4. Enable error tracker
window.MC_debugMode.testFeatures.errorTracker.enable();

// 5. Check errors
console.table(window.MC_debugMode.testFeatures.errorTracker.getErrors());
```

### Inspecting localStorage Data

```javascript
// View all localStorage keys and values
window.MC_debugMode.testFeatures.localStorageInspector.view();

// Clear specific museum data
window.MC_debugMode.testFeatures.localStorageInspector.clear('museumChecklists');

// Check state after clearing
window.MC_debugMode.testFeatures.localStorageInspector.view();
```

### Analyzing Performance Issues

```javascript
// Enable performance overlay
?debug=true&perf=true

// In console:
window.MC_debugMode.testFeatures.performanceMonitor.enable();

// Check heap size growth
setInterval(() => {
  const mem = performance.memory;
  console.log('Heap:', Math.round(mem.usedJSHeapSize / 1048576) + 'MB');
}, 1000);
```

### Testing Error Handling

```javascript
// Enable error tracker
window.MC_debugMode.testFeatures.errorTracker.enable();

// Simulate an error
throw new Error('Test error for debugging');

// View captured error
console.table(window.MC_debugMode.testFeatures.errorTracker.getErrors());
```

## Console Shortcuts

When debug mode is active, all debug logs are prefixed with `[MC_debug]` or `[MC_debugMode]`:

```javascript
// Filter logs in console
console.log() // Shows all [MC_debug] logs
```

**Log Categories**:
- `[MC_debug]` - Core debug system messages
- `[MC_debugMode]` - API status messages
- `[MC_debug] ⚡ Performance` - Performance metrics
- `[MC_debug] 📦 localStorage` - Storage operations
- `[MC_debug] 🌐 Fetch` - Network operations
- `[MC_debug] 🔴 Error` - Error tracking

## Technical Details

### Script Loading

Debug mode is initialized from `/js/debug-mode.js`:

- Loaded in `<head>` on all public pages
- Checks URL parameters and localStorage at load time
- Sets up `window.MC_debugMode` and `window.MC_debug` APIs
- Loads VConsole asynchronously from CDN (3.9.0)

### Global Variables

**Set when debug mode is active**:

| Variable | Type | Purpose |
|----------|------|---------|
| `window.__MC_DEBUG` | Boolean | Compatibility flag |
| `window.__MC_VCONSOLE_LOADED` | Boolean | Tracks VConsole loading |
| `window.vConsole` | VConsole | VConsole instance |
| `window.MC_debug` | Object | Control API |
| `window.MC_debugMode` | Object | Query and test features API |

### Performance Impact

- **At Load**: ~2-3ms for parameter checking and flag setup
- **When Enabled**: ~50-100ms for VConsole CDN load
- **During Use**: Minimal overhead (<1% CPU) for logging
- **Memory**: ~5-8MB additional for VConsole and test overlays

## Troubleshooting

### Debug Mode Won't Enable

**Problem**: Adding `?debug=true` doesn't activate debug mode

**Solutions**:
```javascript
// Force enable via console
localStorage.setItem('mc_debug', '1');
location.reload();

// Verify the script is loaded
console.log(window.MC_debugMode);  // Should show object, not undefined
```

### VConsole Not Showing

**Problem**: VConsole fails to load from CDN

**Cause**: Network connectivity or CDN blocked

**Solution**: 
```javascript
// Check VConsole load status
console.log(window.vConsole);  // Should be VConsole instance, not undefined

// Check network logs for CDN errors
window.MC_debugMode.testFeatures.networkLogger.enable();
```

### Test Features Not Working

**Problem**: Control panel appears but toggles don't work

**Solution**:
```javascript
// Verify debug mode is active
window.MC_debugMode.isEnabled(true);

// Manually enable feature
window.MC_debugMode.testFeatures.performanceMonitor.enable();

// Check console for errors
```

## Best Practices

1. **Use URL Parameter for Testing**: `?debug=true` is easiest for quick debugging
2. **Enable Selectively**: Only enable the test features you need to reduce overhead
3. **Check Logs Frequently**: Console logs provide detailed insight into what's happening
4. **Clear Storage When Testing**: Use `localStorageInspector.clear()` to test fresh states
5. **Track Performance**: Enable `performanceMonitor` early to catch load issues

## For Developers

### Adding New Test Features

To extend debug-mode.js with new test features:

```javascript
// Add to testFeatures object in js/debug-mode.js
myNewFeature: {
  enabled: false,
  
  enable() {
    if (this.enabled) return;
    this.enabled = true;
    console.info('[MC_debug] My new feature enabled');
  },
  
  disable() {
    if (!this.enabled) return;
    this.enabled = false;
    console.info('[MC_debug] My new feature disabled');
  }
}
```

### Checking Debug Mode in Application Code

```javascript
// In any page or module:
if (window.MC_debugMode && window.MC_debugMode.isEnabled()) {
  console.log('[DEBUG] This is a debug-only log');
}

// Or use the compatibility flag:
if (window.__MC_DEBUG) {
  // Debug-only code
}
```

## Version Info

- **Version**: 2.0.0
- **Last Updated**: 2026-01-13
- **VConsole**: 3.9.0 (via CDN)
- **Scope**: All public-facing MuseumCheck pages

## Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [Development Guide](./DEVELOPMENT.md)
- [Testing Guide](./TESTING_GUIDE.md)
