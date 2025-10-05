import { Dino } from './Dino';
import { Obstacle } from './Obstacle';
import { Ground } from './Ground';


export class GameEngine {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.groundHeight = 50;
    this.groundY = gameHeight - this.groundHeight;
    
 
    this.ground = new Ground(this.groundY, gameWidth, this.groundHeight);
    this.dino = new Dino(50, this.groundY - 5);
    this.obstacles = [];
    
  
    this.score = 0;
    this.highScore = 0;
    this.isRunning = false;
    this.isGameOver = false;
    
 
    this.gameSpeed = 5;
    this.initialSpeed = 5;
    this.speedIncrement = 0.002;
    this.frameCount = 0;
    this.lastObstacleFrame = 0;
    this.minObstacleGap = 100;
  }


  start() {
    this.isRunning = true;
    this.isGameOver = false;
  }


  pause() {
    this.isRunning = false;
  }


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


  update() {
    if (!this.isRunning || this.isGameOver) {
      return;
    }

    this.frameCount++;


    this.dino.update();


    this.gameSpeed += this.speedIncrement;


    this.spawnObstacles();


    this.updateObstacles();


    this.checkCollisions();
  }


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

  
  updateObstacles() {

    this.obstacles.forEach(obstacle => {
      obstacle.update(this.gameSpeed);
      

      if (obstacle.isPassed(this.dino.x)) {
        this.score++;
      }
    });


    this.obstacles = this.obstacles.filter(obstacle => obstacle.active);
  }


  checkCollisions() {
    for (let obstacle of this.obstacles) {
      if (this.dino.checkCollision(obstacle)) {
        this.gameOver();
        break;
      }
    }
  }


  gameOver() {
    this.isGameOver = true;
    this.isRunning = false;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }


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