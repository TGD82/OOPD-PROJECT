import { Entity } from './Entity';

// Dino Class - Inherits from Entity (Inheritance)
export class Dino extends Entity {
  constructor(x, y) {
    super(x, y, 45,50); // Call parent constructor
    this.velocityY = 0;
    this.isJumping = false;
    this.gravity = 0.8;
    this.jumpForce = -15;
    this.groundY = y;
  }

  // Polymorphism - Override update method
  update() {
    if (this.isJumping) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;

      // Check if landed on ground
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
      }
    }
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = this.jumpForce;
      this.isJumping = true;
    }
  }

  reset() {
    this.y = this.groundY;
    this.velocityY = 0;
    this.isJumping = false;
    this.active = true;
  }

  // Encapsulation - Getter for state
  getState() {
    return {
      x: this.x,
      y: this.y,
      isJumping: this.isJumping,
      velocityY: this.velocityY,
    };
  }
}