// Base Class - Parent of all game entities
export class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = true;
  }

  // Encapsulation - Getter methods
  getPosition() {
    return { x: this.x, y: this.y };
  }

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
  }

  // Virtual method - will be overridden by child classes (Polymorphism)
  update() {
    // To be implemented by child classes
  }

  // Check collision with another entity
  checkCollision(otherEntity) {
    const bounds1 = this.getBounds();
    const bounds2 = otherEntity.getBounds();

    return (
      bounds1.left < bounds2.right &&
      bounds1.right > bounds2.left &&
      bounds1.top < bounds2.bottom &&
      bounds1.bottom > bounds2.top
    );
  }

  destroy() {
    this.active = false;
  }
}