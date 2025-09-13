import Board from "./Board.js";
import Pacman from "./Pacman.js";
import Ghost from "./Ghost.js";

export default class GameManager {
  constructor(initialLayout) {
    this.board = new Board(initialLayout);
    this.pacman = new Pacman(3, 3);
    this.ghosts = [new Ghost(1, 1, "red"), new Ghost(5, 1, "blue")];
  }

  movePacman(dx, dy) {
    this.pacman.move(dx, dy, this.board);
    this.pacman.eat(this.board);
  }

  moveGhosts() {
    this.ghosts.forEach(g => g.moveAI(this.board));
  }

  checkCollision() {
    return this.ghosts.some(
      g => g.x === this.pacman.x && g.y === this.pacman.y
    );
  }

  getState() {
    return {
      board: this.board.getGrid(),
      pacman: this.pacman.getPosition(),
      ghosts: this.ghosts.map(g => g.getPosition()),
      score: this.pacman.score,
    };
  }
}
