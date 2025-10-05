import { Dino } from './dino';
import { Obstacle } from './Obstacle';
import { Ground } from './Ground';

// Main Game Engine Class - Manages entire game logic
export class GameEngine {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.groundHeight = 50;
    this.groundY = gameHeight - this.groundHeight;
    
    // Initialize game objects (Composition)
    this.ground = new Ground(this.groundY, gameWidth, this.groundHeight);
    this.dino = new Dino(50, this.groundY - 5);
    this.obstacles = [];
    
    // Game state (Encapsulation)
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isGameOver = false;
    
    // Game settings
    this.gameSpeed = 5;
    this.initialSpeed = 5;
    this.speedIncrement = 0.002;
    this.frameCount = 0;
    this.lastObstacleFrame = 0;
    this.minObstacleGap = 100;
  }

  // Start the game
  start() {
    this.isRunning = true;
    this.isGameOver = false;
  }

  // Pause the game
  pause() {
    this.isRunning = false;
  }

  // Reset the game
  reset() {
    this.dino.reset();
    this.obstacles = [];
    this.score = 0;
    this.gameSpeed = this.initialSpeed;
    this.frameCount = 0;
    this.lastObstacleFrame = 0;
    this.isRunning = true;
    this.isGameOver = false;
  }

  // Jump action
  jump() {
    if (!this.isGameOver) {
      if (!this.isRunning) {
        this.start();
      }
      this.dino.jump();
    } else {
      this.reset();
    }
  }

  // Main game loop update
  update() {
    if (!this.isRunning || this.isGameOver) {
      return;
    }

    this.frameCount++;

    // Update dino (Polymorphism - calls overridden update method)
    this.dino.update();

    // Increase game speed gradually
    this.gameSpeed += this.speedIncrement;

    // Spawn new obstacles
    this.spawnObstacles();

    // Update all obstacles
    this.updateObstacles();

    // Check collisions
    this.checkCollisions();
  }

  // Spawn obstacles at intervals
  spawnObstacles() {
    const timeSinceLastObstacle = this.frameCount - this.lastObstacleFrame;
    const minGap = Math.max(50, this.minObstacleGap - Math.floor(this.gameSpeed));
    
    if (timeSinceLastObstacle > minGap) {
      const obstacle = new Obstacle(
        this.gameWidth,
        this.groundY,
        this.gameWidth
      );
      this.obstacles.push(obstacle);
      this.lastObstacleFrame = this.frameCount;
    }
  }

  // Update all obstacles
  updateObstacles() {
    // Update each obstacle (Polymorphism)
    this.obstacles.forEach(obstacle => {
      obstacle.update(this.gameSpeed);
      
      // Check if obstacle was passed
      if (obstacle.isPassed(this.dino.x)) {
        this.score++;
      }
    });

    // Remove inactive obstacles
    this.obstacles = this.obstacles.filter(obstacle => obstacle.active);
  }

  // Check collisions between dino and obstacles
  checkCollisions() {
    for (let obstacle of this.obstacles) {
      if (this.dino.checkCollision(obstacle)) {
        this.gameOver();
        break;
      }
    }
  }

  // Game over logic
  gameOver() {
    this.isGameOver = true;
    this.isRunning = false;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  // Getters for game state (Encapsulation)
  getGameState() {
    return {
      dino: this.dino.getState(),
      obstacles: this.obstacles.map(obs => ({
        x: obs.x,
        y: obs.y,
        width: obs.width,
        height: obs.height,
      })),
      score: this.score,
      highScore: this.highScore,
      isRunning: this.isRunning,
      isGameOver: this.isGameOver,
      groundY: this.groundY,
      groundHeight: this.groundHeight,
    };
  }

  getDinoState() {
    return this.dino.getState();
  }

  getObstacles() {
    return this.obstacles.map(obs => obs.getBounds());
  }

  getScore() {
    return this.score;
  }

  getHighScore() {
    return this.highScore;
  }
}