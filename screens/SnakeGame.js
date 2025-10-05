import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 30;
const CELL_SIZE = 30;
const INITIAL_SPEED = 150;

// ABSTRACTION: Abstract base class for game entities
class GameObject {
  #x;
  #y; // HASH for private
  constructor(x, y) {
    this.#x = x; // ENCAPSULATION: Private properties
    this.#y = y;
  }

  // ENCAPSULATION: Getters and setters
  get x() { return this.#x; }
  get y() { return this.#y; }
  set x(value) { this.#x = value; }
  set y(value) { this.#y = value; }

  // Abstract method to be implemented by subclasses
  getPosition() {
    return { x: this.#x, y: this.#y };
  }

  // Abstract render method
  render() {
    throw new Error('RENDER SHOULD BE IMPLEMENTED BY SUBCLASS');
  }
}

// INHERITANCE: Food inherits from GameObject
class Food extends GameObject {
  #type;
  #points;
  constructor(x, y, type = 'normal') {
    super(x, y);
    this.#type = type;
    this.#points = type === 'special' ? 5 : 1;
  }

  // ENCAPSULATION: Getter for points
  get points() { return this.#points; }
  get type() { return this.#type; }

  // POLYMORPHISM: Override render method
  render() {
    return {
      position: this.getPosition(),
      color: this.#type === 'special' ? '#FFD700' : '#c48080',
      size: this.#type === 'special' ? CELL_SIZE * 1.2 : CELL_SIZE
    };
  }

  // Method to check collision with snake
  isEatenBy(snakeHead) {
    return this.x === snakeHead.x && this.y === snakeHead.y;
  }
}

// INHERITANCE: SnakeSegment inherits from GameObject
class SnakeSegment extends GameObject {
  #isHead;
  constructor(x, y, isHead = false) {
    super(x, y);
    this.#isHead = isHead;
  }

  get isHead() { return this.#isHead; }
  set isHead(value) { this.#isHead = value; }

  // POLYMORPHISM: Override render method
  render() {
    return {
      position: this.getPosition(),
      color: this.#isHead ? '#4ECDC4' : '#45B7AF',
      size: CELL_SIZE
    };
  }
}

// ABSTRACTION & ENCAPSULATION: Snake class managing snake behavior
class Snake {
  #segments;
  #direction;
  #nextDirection;
  #growing;
  
  constructor(initialLength = 3) {
    this.#segments = [];
    this.#direction = { x: 1, y: 0 };
    this.#nextDirection = { x: 1, y: 0 };
    this.#growing = false;
    
    // Initialize snake
    for (let i = 0; i < initialLength; i++) {
      this.#segments.push(
        new SnakeSegment(initialLength - i, Math.floor(GRID_SIZE / 2), i === 0)
      );
    }
  }

  // ENCAPSULATION: Public interface for snake
  get head() { return this.#segments[0]; }
  get body() { return this.#segments; }
  get length() { return this.#segments.length; }

  setDirection(newDirection) {
    // Prevent reversing
    if (newDirection.x !== -this.#direction.x || newDirection.y !== -this.#direction.y) {
      this.#nextDirection = newDirection;
    }
  }

  grow() {
    this.#growing = true;
  }

  move() {
    this.#direction = this.#nextDirection;
    
    const newHead = new SnakeSegment(
      this.head.x + this.#direction.x,
      this.head.y + this.#direction.y,
      true
    );

    this.#segments[0].isHead = false;
    this.#segments.unshift(newHead);

    if (!this.#growing) {
      this.#segments.pop();
    }
    this.#growing = false;
  }

  checkSelfCollision() {
    for (let i = 1; i < this.#segments.length; i++) {
      if (this.head.x === this.#segments[i].x && 
          this.head.y === this.#segments[i].y) {
        return true;
      }
    }
    return false;
  }

  checkWallCollision() {
    return this.head.x < 0 || this.head.x >= GRID_SIZE ||
           this.head.y < 0 || this.head.y >= GRID_SIZE;
  }

  render() {
    return this.#segments.map(segment => segment.render());
  }
}

// ABSTRACTION: Game Manager class
class GameManager {
  #snake;
  #food;
  #score;
  #isRunning;
  #speed;
  
  constructor() {
    this.#snake = new Snake();
    this.#food = null;
    this.#score = 0;
    this.#isRunning = false;
    this.#speed = INITIAL_SPEED;
    this.spawnFood();
  }

  get snake() { return this.#snake; }
  get food() { return this.#food; }
  get score() { return this.#score; }
  get isRunning() { return this.#isRunning; }
  get speed() { return this.#speed; }

  start() { this.#isRunning = true; }
  pause() { this.#isRunning = false; }

  spawnFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
    } while (this.#snake.body.some(seg => seg.x === x && seg.y === y));
    
    const isSpecial = Math.random() < 0.2;
    this.#food = new Food(x, y, isSpecial ? 'special' : 'normal');
  }

  update() {
    if (!this.#isRunning) return { gameOver: false };

    this.#snake.move();

    if (this.#snake.checkWallCollision() || this.#snake.checkSelfCollision()) {
      this.#isRunning = false;
      return { gameOver: true };
    }

    if (this.#food.isEatenBy(this.#snake.head)) {
      this.#score += this.#food.points;
      this.#snake.grow();
      this.spawnFood();
      
      // Increase speed every 5 points
      if (this.#score % 5 === 0) {
        this.#speed = Math.max(50, this.#speed - 10);
      }
    }

    return { gameOver: false };
  }

  reset() {
    this.#snake = new Snake();
    this.#score = 0;
    this.#speed = INITIAL_SPEED;
    this.#isRunning = false;
    this.spawnFood();
  }
}

// Main React Component
export default function SnakeGame() {
  const [gameState, setGameState] = useState(null);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const gameManagerRef = useRef(null);

  useEffect(() => {
    gameManagerRef.current = new GameManager();
    setGameState(gameManagerRef.current);
  }, []);

  useEffect(() => {
    if (!gameState?.isRunning) return;

    const interval = setInterval(() => {
      const result = gameState.update();
      if (result.gameOver) {
        alert(`Game Over! Score: ${gameState.score}`);
      }
      setRenderTrigger(prev => prev + 1);
    }, gameState.speed);

    return () => clearInterval(interval);
  }, [gameState?.isRunning, gameState?.speed, renderTrigger]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameState) return;
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          gameState.snake.setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          gameState.snake.setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          gameState.snake.setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          gameState.snake.setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          gameState.isRunning ? gameState.pause() : gameState.start();
          setRenderTrigger(prev => prev + 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const handleDirection = (direction) => {
    if (gameState) {
      gameState.snake.setDirection(direction);
    }
  };

  const handleStart = () => {
    if (gameState) {
      gameState.start();
      setRenderTrigger(prev => prev + 1);
    }
  };

  const handleReset = () => {
    if (gameState) {
      gameState.reset();
      setRenderTrigger(prev => prev + 1);
    }
  };

  if (!gameState) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Snake Game</h1>
        <div style={styles.scoreBoard}>
          <div style={styles.score}>Score: {gameState.score}</div>
          <div style={styles.info}>Level: {Math.floor((INITIAL_SPEED - gameState.speed) / 10) + 1}</div>
        </div>
      </div>

      <div style={styles.gameBoard}>
        {/* Render Food */}
        {gameState.food && (
          <div
            style={{
              ...styles.gameObject,
              left: `${gameState.food.x * CELL_SIZE}px`,
              top: `${gameState.food.y * CELL_SIZE}px`,
              width: `${gameState.food.render().size}px`,
              height: `${gameState.food.render().size}px`,
              backgroundColor: gameState.food.render().color,
              borderRadius: gameState.food.type === 'special' ? '50%' : '20%',
              boxShadow: gameState.food.type === 'special' ? '0 0 10px #FFD700' : 'none'
            }}
          />
        )}

        {/* Render Snake */}
        {gameState.snake.render().map((segment, idx) => (
          <div
            key={idx}
            style={{
              ...styles.gameObject,
              left: `${segment.position.x * CELL_SIZE}px`,
              top: `${segment.position.y * CELL_SIZE}px`,
              width: `${segment.size}px`,
              height: `${segment.size}px`,
              backgroundColor: segment.color,
              borderRadius: segment.color === '#4ECDC4' ? '50%' : '25%',
              boxShadow: segment.color === '#4ECDC4' ? '0 0 8px #4ECDC4' : 'none',
              border: segment.color === '#4ECDC4' ? '2px solid #fff' : 'none'
            }}
          />
        ))}
      </div>

      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <button
            style={styles.button}
            onClick={() => handleDirection({ x: 0, y: -1 })}
          >
            ↑
          </button>
        </div>
        <div style={styles.controlRow}>
          <button
            style={styles.button}
            onClick={() => handleDirection({ x: -1, y: 0 })}
          >
            ←
          </button>
          <button
            style={{...styles.button, ...styles.actionButton}}
            onClick={gameState.isRunning ? () => { gameState.pause(); setRenderTrigger(p => p + 1); } : handleStart}
          >
            {gameState.isRunning ? '⏸' : '▶'}
          </button>
          <button
            style={styles.button}
            onClick={() => handleDirection({ x: 1, y: 0 })}
          >
            →
          </button>
        </div>
        <div style={styles.controlRow}>
          <button
            style={styles.button}
            onClick={() => handleDirection({ x: 0, y: 1 })}
          >
            ↓
          </button>
        </div>
        <button
          style={{...styles.button, ...styles.resetButton}}
          onClick={handleReset}
        >
            Reset
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 15px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  scoreBoard: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center'
  },
  score: {
    fontSize: '20px',
    color: '#4ECDC4',
    fontWeight: 'bold'
  },
  info: {
    fontSize: '20px',
    color: '#FFD700',
    fontWeight: 'bold'
  },
  gameBoard: {
    width: `${GRID_SIZE * CELL_SIZE}px`,
    height: `${GRID_SIZE * CELL_SIZE}px`,
    backgroundColor: '#16213e',
    position: 'relative',
    border: '3px solid #4ECDC4',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)',
    overflow: 'hidden'
  },
  gameObject: {
    position: 'absolute',
    transition: 'none',
    boxSizing: 'border-box'
  },
  controls: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  },
  controlRow: {
    display: 'flex',
    gap: '5px'
  },
  button: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4ECDC4',
    border: 'none',
    borderRadius: '10px',
    fontSize: '24px',
    color: '#1a1a2e',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  actionButton: {
    backgroundColor: '#FFD700'
  },
  resetButton: {
    width: '130px',
    backgroundColor: '#FF6B6B',
    marginTop: '10px',
    fontSize: '18px'
  },
  legend: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    textAlign: 'center'
  },
  legendText: {
    color: '#fff',
    fontSize: '14px',
    margin: '5px 0'
  },
  oopInfo: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    maxWidth: '600px',
    border: '2px solid #4ECDC4'
  },
  oopTitle: {
    color: '#4ECDC4',
    fontSize: '18px',
    marginTop: '0',
    marginBottom: '15px'
  },
  oopList: {
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: '0',
    paddingLeft: '20px'
  }
};