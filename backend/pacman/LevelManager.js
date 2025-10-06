// LevelManager.js - Manages game levels and difficulty progression
import { CellType } from "./Board.js";

export default class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.maxLevel = 10;
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  nextLevel() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
    }
    return this.currentLevel;
  }

  reset() {
    this.currentLevel = 1;
  }

  // Get level layout (can expand with more complex levels)
  getLevelLayout(level = this.currentLevel) {
    // Basic layout that scales with difficulty
    const layouts = [
      this.getLevel1Layout(),
      this.getLevel2Layout(),
      this.getLevel3Layout()
    ];
    
    // Cycle through layouts for higher levels
    const layoutIndex = (level - 1) % layouts.length;
    return layouts[layoutIndex];
  }

  getLevel1Layout() {
    return [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 3, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 3, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, 1, 4, 1, 1, 2, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 3, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 3, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
  }

  getLevel2Layout() {
    return [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 3, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 3, 1],
      [1, 2, 1, 1, 1, 2, 1, 0, 1, 2, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 2, 1, 1, 1, 4, 1, 1, 1, 2, 1, 2, 1],
      [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
      [1, 2, 1, 2, 1, 1, 1, 4, 1, 1, 1, 2, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 2, 1, 0, 1, 2, 1, 1, 1, 2, 1],
      [1, 3, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
  }

  getLevel3Layout() {
    return [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
      [1, 3, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 3, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 2, 1, 1, 2, 4, 2, 1, 1, 2, 1, 1, 1],
      [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
      [1, 1, 1, 2, 1, 1, 2, 4, 2, 1, 1, 2, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 3, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 3, 1],
      [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
  }

  // Get difficulty modifiers based on level
  getDifficultyModifiers() {
    return {
      ghostSpeed: 0.8 + (this.currentLevel * 0.05),
      ghostChaseTime: 20000 - (this.currentLevel * 1000),
      ghostScatterTime: 7000 - (this.currentLevel * 200),
      powerPelletDuration: 10000 - (this.currentLevel * 300),
      bonusFruitSpawnChance: 0.1 + (this.currentLevel * 0.02)
    };
  }

  // Bonus fruit points based on level
  getBonusFruitPoints() {
    const basePoints = 100;
    return basePoints + (this.currentLevel * 50);
  }

  shouldSpawnBonusFruit(pelletsEaten, totalPellets) {
    // Spawn fruit at 50 pellets and 100 pellets
    return pelletsEaten === 50 || pelletsEaten === 100;
  }
}