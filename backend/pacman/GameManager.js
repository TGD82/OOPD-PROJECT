// GameManager.js - Main game controller using multiple OOP patterns
import Board from "./Board.js";
import Pacman from "./Pacman.js";
import GhostFactory from "./GhostFactory.js";
import { GhostState } from "./Ghost.js";
import LevelManager from "./LevelManager.js";
import { 
  GameSubject, 
  GameEvent, 
  SoundObserver, 
  ScoreObserver, 
  StatisticsObserver 
} from "./GameObserver.js";

export const GameState = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete'
};

export default class GameManager {
  constructor(initialLayout = null) {
    // Initialize managers
    this.levelManager = new LevelManager();
    
    // Get layout from level manager if not provided
    const layout = initialLayout || this.levelManager.getLevelLayout();
    
    // Initialize game objects
    this.board = new Board(layout);
    this.pacman = new Pacman(7, 5); // Center position
    this.ghosts = GhostFactory.createAllGhosts(this.board);
    
    // Game state
    this.gameState = GameState.READY;
    this.isPaused = false;
    this.lastUpdate = Date.now();
    
    // Ghost mode management
    this.modeTimer = 0;
    this.currentMode = GhostState.SCATTER;
    this.modeDurations = [7000, 20000, 7000, 20000]; // Scatter/Chase alternation
    this.currentModeIndex = 0;
    
    // Bonus fruit management
    this.bonusFruitActive = false;
    this.bonusFruitPosition = null;
    this.bonusFruitTimer = 0;
    this.bonusFruitDuration = 10000;
    
    // Observer pattern - for sound, scoring, statistics
    this.gameSubject = new GameSubject();
    this.soundObserver = new SoundObserver();
    this.scoreObserver = new ScoreObserver();
    this.statsObserver = new StatisticsObserver();
    
    this.gameSubject.attach(this.soundObserver);
    this.gameSubject.attach(this.scoreObserver);
    this.gameSubject.attach(this.statsObserver);
    
    // Collision cooldown
    this.collisionCooldown = false;
    this.collisionCooldownDuration = 1000;
  }

  start() {
    this.gameState = GameState.PLAYING;
    this.lastUpdate = Date.now();
    this.modeTimer = Date.now();
  }

  pause() {
    this.isPaused = !this.isPaused;
    this.gameState = this.isPaused ? GameState.PAUSED : GameState.PLAYING;
  }

  reset() {
    this.pacman.reset();
    this.ghosts.forEach(ghost => ghost.reset());
    this.board.reset();
    this.gameState = GameState.READY;
    this.bonusFruitActive = false;
    this.collisionCooldown = false;
  }

  resetLevel() {
    this.pacman.x = this.pacman.startX;
    this.pacman.y = this.pacman.startY;
    this.pacman.direction = { dx: 0, dy: 0 };
    this.ghosts.forEach(ghost => ghost.reset());
    this.collisionCooldown = false;
  }

  nextLevel() {
    this.levelManager.nextLevel();
    const newLayout = this.levelManager.getLevelLayout();
    this.board = new Board(newLayout);
    this.ghosts = GhostFactory.createAllGhosts(this.board);
    this.resetLevel();
    this.gameState = GameState.READY;
    this.gameSubject.notify(GameEvent.LEVEL_COMPLETE, { 
      level: this.levelManager.getCurrentLevel() 
    });
  }

  update() {
    if (this.gameState !== GameState.PLAYING || this.isPaused) {
      return;
    }

    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    // Update ghost modes (Scatter/Chase alternation)
    this.updateGhostModes();

    // Update Pacman
    this.pacman.update(this.board);

    // Update ghosts
    this.ghosts.forEach(ghost => {
      ghost.update(this.board, this.pacman, this.ghosts);
    });

    // Check collisions
    this.checkCollisions();

    // Manage bonus fruit
    this.manageBonusFruit();

    // Check level complete
    if (this.board.isLevelComplete()) {
      this.gameState = GameState.LEVEL_COMPLETE;
      setTimeout(() => this.nextLevel(), 2000);
    }

    // Notify score change
    this.gameSubject.notify(GameEvent.SCORE_CHANGED, {
      score: this.pacman.score,
      pacman: this.pacman
    });
  }

  updateGhostModes() {
    if (this.pacman.isPoweredUp) {
      // All ghosts should be frightened during power-up
      this.ghosts.forEach(ghost => {
        if (ghost.state !== GhostState.EATEN) {
          if (ghost.state !== GhostState.FRIGHTENED) {
            ghost.onPowerPelletEaten();
          }
        }
      });
      return;
    }

    // Normal mode alternation
    const elapsed = Date.now() - this.modeTimer;
    const currentDuration = this.modeDurations[this.currentModeIndex];

    if (elapsed >= currentDuration) {
      this.currentModeIndex = (this.currentModeIndex + 1) % this.modeDurations.length;
      this.modeTimer = Date.now();
      
      // Toggle between scatter and chase
      this.currentMode = this.currentMode === GhostState.SCATTER ? 
        GhostState.CHASE : GhostState.SCATTER;
      
      // Update all ghosts
      this.ghosts.forEach(ghost => {
        if (ghost.state !== GhostState.EATEN && ghost.state !== GhostState.FRIGHTENED) {
          ghost.setState(this.currentMode);
        }
      });
    }
  }

  manageBonusFruit() {
    const pelletsEaten = this.board.pelletsEaten;
    const totalPellets = this.board.totalPellets;

    // Spawn bonus fruit at specific pellet counts
    if (this.levelManager.shouldSpawnBonusFruit(pelletsEaten, totalPellets)) {
      if (!this.bonusFruitActive) {
        this.spawnBonusFruit();
      }
    }

    // Remove bonus fruit after duration
    if (this.bonusFruitActive) {
      const elapsed = Date.now() - this.bonusFruitTimer;
      if (elapsed >= this.bonusFruitDuration) {
        this.removeBonusFruit();
      }
    }
  }

  spawnBonusFruit() {
    const spaces = this.board.findEmptySpaces();
    if (spaces.length > 0) {
      const randomSpace = spaces[Math.floor(Math.random() * spaces.length)];
      this.bonusFruitPosition = randomSpace;
      this.board.spawnBonusFruit(randomSpace.x, randomSpace.y);
      this.bonusFruitActive = true;
      this.bonusFruitTimer = Date.now();
    }
  }

  removeBonusFruit() {
    if (this.bonusFruitPosition) {
      this.board.removeBonusFruit(this.bonusFruitPosition.x, this.bonusFruitPosition.y);
      this.bonusFruitActive = false;
      this.bonusFruitPosition = null;
    }
  }

  movePacman(dx, dy) {
    if (this.gameState !== GameState.PLAYING) {
      return;
    }

    this.pacman.setNextDirection(dx, dy);
    
    // Try immediate move
    const oldX = this.pacman.x;
    const oldY = this.pacman.y;
    this.pacman.update(this.board);
    
    // Check what was eaten
    const eaten = this.checkPacmanEating();
    
    if (eaten) {
      this.handleEatenItem(eaten);
    }
  }

  checkPacmanEating() {
    const x = this.pacman.x;
    const y = this.pacman.y;

    if (this.board.isPellet(x, y)) {
      this.board.removePellet(x, y);
      this.pacman.score += 10;
      return 'pellet';
    } else if (this.board.isPowerPellet(x, y)) {
      this.board.removePellet(x, y);
      this.pacman.score += 50;
      this.pacman.activatePowerUp();
      return 'power-pellet';
    } else if (this.board.isBonusFruit(x, y)) {
      this.removeBonusFruit();
      this.pacman.score += this.levelManager.getBonusFruitPoints();
      return 'bonus-fruit';
    }
    return null;
  }

  handleEatenItem(itemType) {
    switch(itemType) {
      case 'pellet':
        this.gameSubject.notify(GameEvent.PELLET_EATEN, {});
        break;
      case 'power-pellet':
        this.gameSubject.notify(GameEvent.POWER_PELLET_EATEN, {});
        this.ghosts.forEach(ghost => ghost.onPowerPelletEaten());
        break;
      case 'bonus-fruit':
        this.gameSubject.notify(GameEvent.BONUS_FRUIT_EATEN, {});
        break;
    }
  }

  checkCollisions() {
    if (this.collisionCooldown) return;

    for (const ghost of this.ghosts) {
      if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
        if (ghost.isVulnerable()) {
          // Pacman eats ghost
          const bonus = this.pacman.eatGhost();
          ghost.onEaten();
          this.gameSubject.notify(GameEvent.GHOST_EATEN, { bonus });
        } else if (ghost.isDangerous()) {
          // Ghost catches Pacman
          this.handlePacmanDeath();
          return;
        }
      }
    }
  }

  handlePacmanDeath() {
    this.pacman.loseLife();
    this.gameSubject.notify(GameEvent.PACMAN_DIED, {});
    
    if (!this.pacman.isAlive()) {
      this.gameState = GameState.GAME_OVER;
      this.gameSubject.notify(GameEvent.GAME_OVER, { 
        score: this.pacman.score 
      });
    } else {
      this.resetLevel();
      this.collisionCooldown = true;
      setTimeout(() => {
        this.collisionCooldown = false;
      }, this.collisionCooldownDuration);
    }
  }

  moveGhosts() {
    this.ghosts.forEach(ghost => {
      ghost.update(this.board, this.pacman, this.ghosts);
    });
  }

  getState() {
    return {
      board: this.board.getGrid(),
      pacman: this.pacman.getState(),
      ghosts: this.ghosts.map(g => g.getState()),
      score: this.pacman.score,
      lives: this.pacman.lives,
      level: this.levelManager.getCurrentLevel(),
      gameState: this.gameState,
      isPaused: this.isPaused,
      highScore: this.scoreObserver.getHighScore(),
      statistics: this.statsObserver.getStats(),
      bonusFruit: this.bonusFruitActive ? this.bonusFruitPosition : null
    };
  }

  // Public API for controlling Pacman
  moveUp() { this.movePacman(0, -1); }
  moveDown() { this.movePacman(0, 1); }
  moveLeft() { this.movePacman(-1, 0); }
  moveRight() { this.movePacman(1, 0); }
}