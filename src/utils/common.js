/**
 * Common Utility Functions
 * Reusable helper functions for DOM operations, storage, validation, and more
 */

// Initialize debug-mode when script bundle loads (if debug flag set by query)
(function(){
    try {
        if (window.__MC_DEBUG === undefined) {
            // if debug-mode.js loaded set window.__MC_DEBUG; otherwise, check URL
            const params = new URLSearchParams(window.location.search);
            if (params.get('debug') === 'true' || params.get('debug') === '1') {
                try { localStorage.setItem('mc_debug','1'); } catch(e){}
                window.__MC_DEBUG = true;
            } else if (localStorage && localStorage.getItem && localStorage.getItem('mc_debug')==='1') {
                window.__MC_DEBUG = true;
            }
        }
        // if debug set and debug-mode.js wasn't present, attempt to load vConsole
        if (window.__MC_DEBUG && !window.__MC_VCONSOLE_LOADED) {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/vconsole@3.9.0/dist/vconsole.min.js';
            s.onload = function(){ try{ window.vConsole = new VConsole({ maxLogNumber: 1000 }); console.info('vConsole enabled (script.js)'); }catch(e){} };
            document.head.appendChild(s);
            window.__MC_VCONSOLE_LOADED = true;
        }
    } catch(e) {}
})();

const UtilityFunctions = {
    // DOM helper functions
    querySelector: (selector) => document.querySelector(selector),
    querySelectorAll: (selector) => document.querySelectorAll(selector),
    getElementById: (id) => document.getElementById(id),
    
    // Age group helper functions  
    getSelectedAgeGroup: () => {
        const checkedRadio = document.querySelector(DOM_SELECTORS.AGE_GROUP.CHECKED_RADIO);
        return checkedRadio ? checkedRadio.value : APP_CONFIG.DEFAULT_AGE;
    },
    
    setSelectedAgeGroup: (ageGroup) => {
        const targetRadio = document.querySelector(`input[name="ageGroup"][value="${ageGroup}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            // Update visual state for browsers that don't support :has()
            document.querySelectorAll(DOM_SELECTORS.AGE_GROUP.OPTIONS).forEach(option => {
                option.classList.remove('selected');
            });
            targetRadio.closest('.age-option')?.classList.add('selected');
        }
    },
    
    // Local storage helper functions
    getFromStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    },
    
    setToStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Error writing to localStorage key "${key}":`, error);
            return false;
        }
    },
    
    // Validation helpers
    isValidAgeGroup: (ageGroup) => APP_CONFIG.AGE_GROUPS.includes(ageGroup),
    
    isValidMuseumId: (museumId, museums) => museums.some(m => m.id === museumId),
    
    // String helpers
    sanitizeString: (str) => str ? str.trim() : '',
    
    truncateString: (str, maxLength) => {
        if (!str || str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    },
    
    // Array helpers
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Event handling helpers
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // UUID generation for unique identifiers
    generateUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    // Generate random nickname ID for new users using UUID substring
    generateRandomNickname: () => {
        // Generate UUID and take a substring to create unique but shorter nickname
        const uuid = UtilityFunctions.generateUUID();
        // Take last 8 characters of UUID (without hyphens) for uniqueness
        const shortId = uuid.replace(/-/g, '').slice(-8);
        return `用户${shortId}`;
    },
    
    // ===== WeChat Environment Detection =====
    // Detect if running in WeChat browser or Mini Program webview
    isWeChatEnvironment: () => {
        const ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') > -1;
    },
    
    isWeChatMiniProgram: () => {
        // Check if running inside WeChat Mini Program webview
        return UtilityFunctions.isWeChatEnvironment() && (
            window.__wxjs_environment === 'miniprogram' ||
            (typeof wx !== 'undefined' && typeof wx.miniProgram !== 'undefined')
        );
    },
    
    // Show a hint message for WeChat users to long-press save
    showWeChatSaveHint: (container) => {
        if (!container) return;
        // Remove any existing hint
        const existingHint = container.querySelector('.wechat-save-hint');
        if (existingHint) existingHint.remove();
        
        const hint = document.createElement('div');
        hint.className = 'wechat-save-hint';
        hint.innerHTML = '📱 <strong>长按图片</strong>可保存到相册';
        // Using CSS class .wechat-save-hint defined in style.css
        container.appendChild(hint);
    },
    
    // Try to send image to Mini Program for saving (if in webview)
    sendImageToMiniProgram: (dataURL, filename) => {
        if (typeof wx !== 'undefined' && wx.miniProgram && typeof wx.miniProgram.postMessage === 'function') {
            try {
                wx.miniProgram.postMessage({ 
                    data: { 
                        action: 'saveImage',
                        image: dataURL,
                        filename: filename || 'poster.png'
                    }
                });
                return true;
            } catch (e) {
                console.warn('Failed to post message to Mini Program:', e);
                return false;
            }
        }
        return false;
    }
};

// Export for module usage (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UtilityFunctions };
}
