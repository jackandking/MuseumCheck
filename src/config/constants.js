/**
 * Application Constants and Configuration
 * Centralized configuration for the MuseumCheck application
 */

// UI Timing Constants
const UI_CONSTANTS = {
    ANIMATION: {
        HIGHLIGHT_DURATION: 2000,           // Duration for element highlighting (ms)
        TRANSITION_DURATION: 300,           // Standard transition duration (ms)
        MODAL_OPEN_DELAY: 500,             // Delay before opening modal (ms)
        NOTIFICATION_DURATION: 800,         // Quick firework animation duration for task completion (ms) - v2 style
        NOTIFICATION_DURATION_LARGE: 1200   // Quick firework animation duration for museum visits (ms) - v2 style
    },
    
    COLORS: {
        HIGHLIGHT_DEFAULT: 'rgba(59, 130, 246, 0.2)',  // Default highlight color
        TRANSITION_PROPERTY: 'background-color 0.3s ease-in-out'  // Standard transition
    }
};

// Remote Storage Configuration
const REMOTE_STORAGE_CONFIG = {
    API_ENDPOINT: 'https://rlyhccdr2g.execute-api.us-west-2.amazonaws.com/default/keyValueStore',
    FIREWORK_KEY: 'museumcheck-firework',
    DOWNLOAD_INTERVAL: 10000,  // 10 seconds
    DEFAULT_FIREWORK_EXPIRATION: 60, // Default: 1 minute in seconds (used if user setting not found)
    TIMESTAMP_2124: 4866674732  // Default expiration timestamp (Unix timestamp in SECONDS - year 2124)
};

// DOM Selector Constants for better maintainability
const DOM_SELECTORS = {
    AGE_GROUP: {
        RADIO_BUTTONS: 'input[name="ageGroup"]',
        CHECKED_RADIO: 'input[name="ageGroup"]:checked',
        OPTIONS: '.age-option',
        SELECTED_OPTION: '.age-option.selected'
    },
    
    SEARCH: {
        INPUT: '#museumSearch',
        CLEAR_BUTTON: '#clearSearch'
    },
    
    MODALS: {
        MUSEUM_MODAL: '#museumModal',
        MUSEUM_MODAL_CLOSE: '#museumModal .close',
        ACHIEVEMENT_MODAL: '#achievementModal',
        ACHIEVEMENT_MODAL_CLOSE: '#achievementModal .close',
        ASSESSMENT_HISTORY_MODAL: '#assessmentHistoryModal',
        ASSESSMENT_HISTORY_MODAL_CLOSE: '#assessmentHistoryModal .close'
    },
    
    BUTTONS: {
        ACHIEVEMENT: '#achievementButton',
        ASSESSMENT_HISTORY: '#assessmentHistoryButton'
    },
    
    ELEMENTS: {
        NOTIFICATION: '#notification',
        MUSEUM_GRID: '#museumGrid'
    }
};

// Application Configuration Constants
const APP_CONFIG = {
    LOCAL_STORAGE_KEYS: {
        VISITED_MUSEUMS: 'visitedMuseums',
        MUSEUM_CHECKLISTS: 'museumChecklists',
        CURRENT_AGE: 'currentAge',
        ASSESSMENT_HISTORY: 'museumCheckAssessmentHistory',
        SHARING_STATE: 'museumCheckSharingState',
        SORT_PREFERENCE: 'museumSortPreference',
        FAVORITE_MUSEUMS: 'favoriteMuseums',
        BROWSED_MUSEUMS: 'browsedMuseums',  // Museums the user has viewed (with timestamps)
        CONTRIBUTED_TREASURES: 'contributedTreasures',  // User-contributed treasures
        CONTRIBUTED_MUSEUM_PHOTOS: 'contributedMuseumPhotos',  // User-contributed museum entrance photos
        MUSEUM_POSTERS: 'museumPosters'  // Generated museum check-in posters
    },
    
    AGE_GROUPS: ['3-6', '7-12', '13-18'],   // Supported age groups
    DEFAULT_AGE: '7-12',                    // Default age group for new users
    
    SEARCH: {
        MIN_QUERY_LENGTH: 0,                // Minimum characters to trigger search
        DEBOUNCE_DELAY: 300                 // Search input debounce delay (ms)
    },
    
    // Treasure Contributor Configuration
    TREASURE_CONTRIBUTOR: {
        REQUIRED_TREASURES: 3,              // Default number of treasures required to complete
        FILE_UPLOAD_ENDPOINT: 'https://letmetry.cloud/image/upload',  // File upload API
        MAX_FILE_SIZE_MB: 10                // Maximum file size in MB
    },
    
    // Internationalization
    LOCALE: 'zh-CN'                         // Default locale for date formatting
};

// Export for module usage (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UI_CONSTANTS,
        REMOTE_STORAGE_CONFIG,
        DOM_SELECTORS,
        APP_CONFIG
    };
}
