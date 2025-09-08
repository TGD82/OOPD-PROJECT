import Entity from "./Entity.js";

export default class Ghost extends Entity {
  constructor(x, y, color) {
    super(x, y);
    this.color = color;
  }
  moveAI(board) {
    const moves = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    const random = moves[Math.floor(Math.random() * moves.length)];
    super.move(random.dx, random.dy, board);
  }
}
