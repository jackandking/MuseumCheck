/**
 * Unified Game Architecture - Game Manager
 * 统一游戏架构 - 游戏管理器
 * 
 * Central management for all mini-games:
 * - Game registration and creation
 * - Game state coordination
 * - Unified interface for game operations
 * - Backward compatibility layer
 */

class GameManager {
    static games = new Map();
    static currentGame = null;
    static gameClasses = new Map();
    static initialized = false;
    
    /**
     * Initialize the game manager
     */
    static init() {
        if (this.initialized) return;
        
        // Register built-in game classes
        this.registerBuiltinGames();
        
        this.initialized = true;
        console.log('GameManager initialized with games:', Array.from(this.gameClasses.keys()));
    }
    
    /**
     * Register a game class
     * @param {string} gameType - Game type identifier
     * @param {Class} GameClass - Game class constructor
     */
    static registerGame(gameType, GameClass) {
        this.gameClasses.set(gameType, GameClass);
        console.log(`GameManager: Registered game class for ${gameType}`);
    }
    
    /**
     * Register built-in game classes (backward compatibility)
     */
    static registerBuiltinGames() {
        // Register migrated games with new unified architecture
        this.registerGame('puzzle', UnifiedPuzzleGame);
        
        // For now, register placeholder classes that wrap existing functions for other games
        this.registerGame('maze', MazeGameWrapper);
        this.registerGame('shooting', ShootingGameWrapper);
        this.registerGame('space-invaders', SpaceInvadersGameWrapper);
        this.registerGame('tank-battle', TankBattleGameWrapper);
        this.registerGame('minesweeper', MinesweeperGameWrapper);
        this.registerGame('snake', SnakeGameWrapper);
        
        console.log('GameManager: Registered games - puzzle (new), others (wrappers)');
    }
    
    /**
     * Start a game
     * @param {string} gameType - Type of game to start
     * @param {number} taskIndex - Task index for difficulty
     * @param {Object} options - Additional options
     */
    static async startGame(gameType, taskIndex = 0, options = {}) {
        if (!this.initialized) {
            this.init();
        }
        
        // Close current game if any
        if (this.currentGame) {
            this.currentGame.close();
        }
        
        const GameClass = this.gameClasses.get(gameType);
        if (!GameClass) {
            console.error(`GameManager: No game class registered for ${gameType}`);
            return null;
        }
        
        try {
            const game = new GameClass(gameType, options);
            await game.init(taskIndex, options);
            game.start();
            
            this.currentGame = game;
            this.games.set(gameType, game);
            
            console.log(`GameManager: Started ${gameType} game`);
            return game;
        } catch (error) {
            console.error(`GameManager: Failed to start ${gameType} game:`, error);
            return null;
        }
    }
    
    /**
     * End the current game
     * @param {Object} result - Game result
     */
    static endGame(result = {}) {
        if (!this.currentGame) {
            console.warn('GameManager: No current game to end');
            return false;
        }
        
        const success = this.currentGame.complete(result);
        if (success) {
            this.currentGame = null;
        }
        
        return success;
    }
    
    /**
     * Close the current game
     */
    static closeGame() {
        if (!this.currentGame) {
            console.warn('GameManager: No current game to close');
            return false;
        }
        
        this.currentGame.close();
        this.currentGame = null;
        return true;
    }
    
    /**
     * Reset the current game
     */
    static resetGame() {
        if (!this.currentGame) {
            console.warn('GameManager: No current game to reset');
            return false;
        }
        
        this.currentGame.reset();
        return true;
    }
    
    /**
     * Get the current game instance
     */
    static getCurrentGame() {
        return this.currentGame;
    }
    
    /**
     * Check if a game is currently active
     */
    static isGameActive() {
        return this.currentGame && this.currentGame.state === 'playing';
    }
    
    /**
     * Get game instance by type
     * @param {string} gameType - Game type
     */
    static getGame(gameType) {
        return this.games.get(gameType);
    }
    
    /**
     * Get all active games
     */
    static getAllGames() {
        return Array.from(this.games.values());
    }
    
    /**
     * Cleanup all games
     */
    static cleanup() {
        for (const game of this.games.values()) {
            game.close();
        }
        
        this.games.clear();
        this.currentGame = null;
        console.log('GameManager: All games cleaned up');
    }
    
    /**
     * Get available game types
     */
    static getAvailableGames() {
        return Array.from(this.gameClasses.keys());
    }
    
    /**
     * Check if a game type is available
     * @param {string} gameType - Game type to check
     */
    static isGameAvailable(gameType) {
        return this.gameClasses.has(gameType);
    }
}

// ===== Backward Compatibility Layer =====

/**
 * Base wrapper class for migrating existing games
 * Provides bridge between old function-based games and new class-based system
 */
class GameWrapper extends BaseGame {
    constructor(gameType, config) {
        super(gameType, config);
        this.oldInitFunction = null;
        this.oldResetFunction = null;
        this.oldCloseFunction = null;
    }
    
    /**
     * Set the old function references
     */
    setOldFunctions(initFn, resetFn, closeFn) {
        this.oldInitFunction = initFn;
        this.oldResetFunction = resetFn;
        this.oldCloseFunction = closeFn;
    }
    
    async onInit(taskIndex, options) {
        // Call old init function if available
        if (this.oldInitFunction && typeof this.oldInitFunction === 'function') {
            try {
                await this.oldInitFunction(taskIndex, options);
            } catch (error) {
                console.error(`[${this.gameType}] Old init function error:`, error);
            }
        }
    }
    
    onReset() {
        // Call old reset function if available
        if (this.oldResetFunction && typeof this.oldResetFunction === 'function') {
            try {
                this.oldResetFunction();
            } catch (error) {
                console.error(`[${this.gameType}] Old reset function error:`, error);
            }
        }
    }
    
    onClose() {
        // Call old close function if available
        if (this.oldCloseFunction && typeof this.oldCloseFunction === 'function') {
            try {
                this.oldCloseFunction();
            } catch (error) {
                console.error(`[${this.gameType}] Old close function error:`, error);
            }
        }
    }
}

// Specific wrapper classes for each game type
class PuzzleGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initPuzzleGame === 'function') {
            this.setOldFunctions(initPuzzleGame, resetPuzzle, closePuzzleGame);
        }
    }
}

class MazeGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initMazeGame === 'function') {
            this.setOldFunctions(initMazeGame, resetMaze, closeMazeGame);
        }
    }
}

class ShootingGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initShootingGame === 'function') {
            this.setOldFunctions(initShootingGame, resetShootingGame, closeShootingGame);
        }
    }
}

class SpaceInvadersGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initSpaceInvadersGame === 'function') {
            this.setOldFunctions(initSpaceInvadersGame, null, closeSpaceInvadersGame);
        }
    }
}

class TankBattleGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initTankBattleGame === 'function') {
            this.setOldFunctions(initTankBattleGame, resetTankBattleGame, closeTankBattleGame);
        }
    }
}

class MinesweeperGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initMinesweeperGame === 'function') {
            this.setOldFunctions(initMinesweeperGame, resetMinesweeper, closeMinesweeperGame);
        }
    }
}

class SnakeGameWrapper extends GameWrapper {
    constructor(gameType, config) {
        super(gameType, config);
        if (typeof initSnakeGame === 'function') {
            this.setOldFunctions(initSnakeGame, resetSnake, closeSnakeGame);
        }
    }
}

// ===== Global Interface for Backward Compatibility =====

/**
 * Global function to start games (backward compatible)
 * @param {string} gameType - Game type
 * @param {number} taskIndex - Task index
 * @param {Object} options - Options
 */
window.startUnifiedGame = function(gameType, taskIndex = 0, options = {}) {
    return GameManager.startGame(gameType, taskIndex, options);
};

/**
 * Global function to end current game (backward compatible)
 */
window.endUnifiedGame = function(result = {}) {
    return GameManager.endGame(result);
};

/**
 * Global function to close current game (backward compatible)
 */
window.closeUnifiedGame = function() {
    return GameManager.closeGame();
};

/**
 * Global function to reset current game (backward compatible)
 */
window.resetUnifiedGame = function() {
    return GameManager.resetGame();
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GameManager.init());
} else {
    GameManager.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameManager, BaseGame, GameWrapper };
} else if (typeof window !== 'undefined') {
    window.GameManager = GameManager;
}
