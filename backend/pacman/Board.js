export default class Board {
  constructor(layout) {
    this.grid = layout;
  }
  isWall(x, y) {
    return this.grid[y][x] === 1;
  }
  isPellet(x, y) {
    return this.grid[y][x] === 2;
  }
  removePellet(x, y) {
    if (this.isPellet(x, y)) this.grid[y][x] = 0;
  }
  getGrid() {
    return this.grid;
  }
}
