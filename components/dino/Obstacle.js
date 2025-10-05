import { Entity } from './Entity';

// Obstacle Class - Inherits from Entity (Inheritance)
export class Obstacle extends Entity {
  constructor(x, groundY, gameWidth) {
    // components/dino/Obstacle.js mein Line 6
    // components/dino/Obstacle.js - Line 5
const height = Math.random() > 0.5 ? 70 : 50;
const yOffset = Math.floor(Math.random() * 15) - 15; 
    const y = groundY + yOffset;
    super(x, y, 50, height);
    this.gameWidth = gameWidth;
    this.passed = false;
  }

  // Polymorphism - Override update method
  update(speed) {
    this.x -= speed;
    
    // Check if obstacle is off screen
    if (this.x + this.width < 0) {
      this.destroy();
    }
  }

  isPassed(dinoX) {
    if (!this.passed && this.x + this.width < dinoX) {
      this.passed = true;
      return true;
    }
    return false;
  }

  getHeight() {
    return this.height;
  }
}