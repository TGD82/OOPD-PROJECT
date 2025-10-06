// Board.js - Encapsulation of game board logic
export const CellType = {
  EMPTY: 0,
  WALL: 1,
  PELLET: 2,
  POWER_PELLET: 3,
  GHOST_HOUSE: 4,
  BONUS_FRUIT: 5
};

export default class Board {
  constructor(layout) {
    this.grid = layout.map(row => [...row]); // Deep copy
    this.originalGrid = layout.map(row => [...row]);
    this.totalPellets = this.countPellets();
    this.pelletsEaten = 0;
  }

  getWidth() {
    return this.grid[0]?.length || 0;
  }

  getHeight() {
    return this.grid.length;
  }

  getCellType(x, y) {
    if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight()) {
      return CellType.WALL;
    }
    return this.grid[y][x];
  }

  isWall(x, y) {
    return this.getCellType(x, y) === CellType.WALL;
  }

  isPellet(x, y) {
    return this.getCellType(x, y) === CellType.PELLET;
  }

  isPowerPellet(x, y) {
    return this.getCellType(x, y) === CellType.POWER_PELLET;
  }

  isBonusFruit(x, y) {
    return this.getCellType(x, y) === CellType.BONUS_FRUIT;
  }

  isGhostHouse(x, y) {
    return this.getCellType(x, y) === CellType.GHOST_HOUSE;
  }

  setCellType(x, y, type) {
    if (x >= 0 && x < this.getWidth() && y >= 0 && y < this.getHeight()) {
      this.grid[y][x] = type;
    }
  }

  removePellet(x, y) {
    if (this.isPellet(x, y) || this.isPowerPellet(x, y)) {
      this.grid[y][x] = CellType.EMPTY;
      this.pelletsEaten++;
      return true;
    }
    return false;
  }

  removeBonusFruit(x, y) {
    if (this.isBonusFruit(x, y)) {
      this.grid[y][x] = CellType.EMPTY;
      return true;
    }
    return false;
  }

  spawnBonusFruit(x, y) {
    if (this.getCellType(x, y) === CellType.EMPTY) {
      this.setCellType(x, y, CellType.BONUS_FRUIT);
    }
  }

  countPellets() {
    let count = 0;
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell === CellType.PELLET || cell === CellType.POWER_PELLET) {
          count++;
        }
      }
    }
    return count;
  }

  isLevelComplete() {
    return this.pelletsEaten >= this.totalPellets;
  }

  reset() {
    this.grid = this.originalGrid.map(row => [...row]);
    this.pelletsEaten = 0;
  }

  getGrid() {
    return this.grid;
  }

  // Find valid spawn points for entities
  findEmptySpaces() {
    const spaces = [];
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        if (this.getCellType(x, y) === CellType.EMPTY || 
            this.getCellType(x, y) === CellType.PELLET) {
          spaces.push({ x, y });
        }
      }
    }
    return spaces;
  }
}