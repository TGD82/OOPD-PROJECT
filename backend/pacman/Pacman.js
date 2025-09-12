import Entity from "./Entity.js";

export default class Pacman extends Entity {
  constructor(x, y) {
    super(x, y);
    this.score = 0;
  }
  eat(board) {
    if (board.isPellet(this.x, this.y)) {
      board.removePellet(this.x, this.y);
      this.score += 10;
    }
  }
}
