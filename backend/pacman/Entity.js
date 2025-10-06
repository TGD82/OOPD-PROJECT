// Entity.js - Abstract Base Class with Template Method Pattern
export default class Entity {
  constructor(x, y, speed = 1) {
    if (this.constructor === Entity) {
      throw new Error("Entity is an abstract class and cannot be instantiated directly");
    }
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.speed = speed;
    this.direction = { dx: 0, dy: 0 };
    this.nextDirection = null;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  setDirection(dx, dy) {
    this.direction = { dx, dy };
  }

  setNextDirection(dx, dy) {
    this.nextDirection = { dx, dy };
  }

  canMove(x, y, board) {
    return !board.isWall(x, y) && 
           x >= 0 && x < board.getWidth() && 
           y >= 0 && y < board.getHeight();
  }

  move(board) {
    // Try to move in next direction if set
    if (this.nextDirection) {
      const newX = this.x + this.nextDirection.dx;
      const newY = this.y + this.nextDirection.dy;
      if (this.canMove(newX, newY, board)) {
        this.direction = this.nextDirection;
        this.nextDirection = null;
      }
    }

    // Move in current direction
    const newX = this.x + this.direction.dx;
    const newY = this.y + this.direction.dy;
    
    if (this.canMove(newX, newY, board)) {
      this.x = newX;
      this.y = newY;
      this.handleTunnelWrap(board);
      return true;
    }
    return false;
  }

  handleTunnelWrap(board) {
    // Wrap around screen edges (tunnel effect)
    if (this.x < 0) this.x = board.getWidth() - 1;
    if (this.x >= board.getWidth()) this.x = 0;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.direction = { dx: 0, dy: 0 };
    this.nextDirection = null;
  }

  // Abstract method - must be implemented by subclasses
  update(board, pacman) {
    throw new Error("Method 'update()' must be implemented by subclass");
  }
}