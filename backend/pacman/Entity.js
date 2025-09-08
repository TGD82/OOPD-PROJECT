export default class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getPosition() {
    return { x: this.x, y: this.y };
  }
  move(dx, dy, board) {
    if (!board.isWall(this.x + dx, this.y + dy)) {
      this.x += dx;
      this.y += dy;
    }
  }
}
