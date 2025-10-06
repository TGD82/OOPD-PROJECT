// Pacman.js - Player character with enhanced abilities
import Entity from "./Entity.js";
import { CellType } from "./Board.js";

export default class Pacman extends Entity {
  constructor(x, y) {
    super(x, y, 1);
    this.score = 0;
    this.lives = 3;
    this.isPoweredUp = false;
    this.powerUpTimer = 0;
    this.powerUpDuration = 10000; // 10 seconds
    this.ghostsEaten = 0;
    this.consecutiveGhostBonus = 200; // Starts at 200, doubles each ghost
  }

  update(board, pacman = null) {
    this.move(board);
    this.eat(board);
    this.updatePowerUp();
  }

  eat(board) {
    const x = this.x;
    const y = this.y;

    if (board.isPellet(x, y)) {
      board.removePellet(x, y);
      this.score += 10;
      return 'pellet';
    } else if (board.isPowerPellet(x, y)) {
      board.removePellet(x, y);
      this.score += 50;
      this.activatePowerUp();
      return 'power-pellet';
    } else if (board.isBonusFruit(x, y)) {
      board.removeBonusFruit(x, y);
      this.score += 100;
      return 'bonus-fruit';
    }
    return null;
  }

  activatePowerUp() {
    this.isPoweredUp = true;
    this.powerUpTimer = Date.now();
    this.ghostsEaten = 0;
    this.consecutiveGhostBonus = 200;
  }

  updatePowerUp() {
    if (this.isPoweredUp) {
      const elapsed = Date.now() - this.powerUpTimer;
      if (elapsed >= this.powerUpDuration) {
        this.isPoweredUp = false;
        this.ghostsEaten = 0;
      }
    }
  }

  getPowerUpTimeRemaining() {
    if (!this.isPoweredUp) return 0;
    const elapsed = Date.now() - this.powerUpTimer;
    return Math.max(0, this.powerUpDuration - elapsed);
  }

  eatGhost() {
    if (this.isPoweredUp) {
      const bonus = this.consecutiveGhostBonus * Math.pow(2, this.ghostsEaten);
      this.score += bonus;
      this.ghostsEaten++;
      return bonus;
    }
    return 0;
  }

  loseLife() {
    this.lives--;
    this.isPoweredUp = false;
    this.reset();
  }

  isAlive() {
    return this.lives > 0;
  }

  addLife() {
    this.lives++;
  }

  reset() {
    super.reset();
    this.isPoweredUp = false;
    this.ghostsEaten = 0;
  }

  getState() {
    return {
      ...this.getPosition(),
      score: this.score,
      lives: this.lives,
      isPoweredUp: this.isPoweredUp,
      powerUpTimeRemaining: this.getPowerUpTimeRemaining(),
      direction: this.direction
    };
  }
}