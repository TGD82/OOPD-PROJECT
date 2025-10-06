// Ghost.js - State Pattern for ghost behavior
import Entity from "./Entity.js";
import { 
  BlinkyStrategy, 
  PinkyStrategy, 
  InkyStrategy, 
  ClydeStrategy,
  FrightenedStrategy,
  ScatterStrategy 
} from "./GhostStrategy.js";

export const GhostState = {
  CHASE: 'chase',
  SCATTER: 'scatter',
  FRIGHTENED: 'frightened',
  EATEN: 'eaten',
  IN_HOUSE: 'in_house'
};

export const GhostType = {
  BLINKY: 'blinky',
  PINKY: 'pinky',
  INKY: 'inky',
  CLYDE: 'clyde'
};

export default class Ghost extends Entity {
  constructor(x, y, type, homeX, homeY) {
    super(x, y, 0.8);
    this.type = type;
    this.homeX = homeX;
    this.homeY = homeY;
    this.state = GhostState.SCATTER;
    this.color = this.getColorByType(type);
    
    // Set AI strategy based on type
    this.chaseStrategy = this.getStrategyByType(type);
    this.scatterStrategy = new ScatterStrategy(homeX, homeY);
    this.frightenedStrategy = new FrightenedStrategy();
    
    this.currentStrategy = this.scatterStrategy;
    this.frightenedTimer = 0;
    this.eatenTimer = 0;
    this.releaseTimer = 0;
  }

  getColorByType(type) {
    const colors = {
      [GhostType.BLINKY]: 'red',
      [GhostType.PINKY]: 'pink',
      [GhostType.INKY]: 'cyan',
      [GhostType.CLYDE]: 'orange'
    };
    return colors[type] || 'red';
  }

  getStrategyByType(type) {
    const strategies = {
      [GhostType.BLINKY]: new BlinkyStrategy(),
      [GhostType.PINKY]: new PinkyStrategy(),
      [GhostType.INKY]: new InkyStrategy(),
      [GhostType.CLYDE]: new ClydeStrategy()
    };
    return strategies[type] || new BlinkyStrategy();
  }

  setState(newState) {
    this.state = newState;
    
    switch(newState) {
      case GhostState.CHASE:
        this.currentStrategy = this.chaseStrategy;
        this.speed = 0.8;
        break;
      case GhostState.SCATTER:
        this.currentStrategy = this.scatterStrategy;
        this.speed = 0.8;
        break;
      case GhostState.FRIGHTENED:
        this.currentStrategy = this.frightenedStrategy;
        this.speed = 0.5; // Slower when frightened
        this.frightenedTimer = Date.now();
        break;
      case GhostState.EATEN:
        this.speed = 1.5; // Faster when returning home
        this.eatenTimer = Date.now();
        break;
      case GhostState.IN_HOUSE:
        this.speed = 0;
        break;
    }
  }

  update(board, pacman, ghosts = []) {
    // Update state timers
    this.updateStateTimers(pacman);
    
    // Move based on current state
    if (this.state === GhostState.EATEN) {
      this.returnToHouse(board);
    } else if (this.state !== GhostState.IN_HOUSE) {
      this.moveAI(board, pacman, ghosts);
    }
  }

  updateStateTimers(pacman) {
    // Check if frightened mode should end
    if (this.state === GhostState.FRIGHTENED) {
      if (!pacman.isPoweredUp) {
        this.setState(GhostState.CHASE);
      }
    }
    
    // Check if ghost has returned to house after being eaten
    if (this.state === GhostState.EATEN) {
      if (this.x === this.homeX && this.y === this.homeY) {
        this.setState(GhostState.SCATTER);
      }
    }
  }

  moveAI(board, pacman, ghosts) {
    // Get Blinky for Inky's strategy
    const blinky = ghosts.find(g => g.type === GhostType.BLINKY);
    
    // Get next move from current strategy
    let nextMove;
    if (this.type === GhostType.INKY && this.state === GhostState.CHASE) {
      nextMove = this.currentStrategy.getNextMove(this, board, pacman, blinky);
    } else {
      nextMove = this.currentStrategy.getNextMove(this, board, pacman);
    }
    
    if (nextMove) {
      this.setDirection(nextMove.dx, nextMove.dy);
      this.move(board);
    }
  }

  returnToHouse(board) {
    // Move directly towards home position
    const dx = this.homeX - this.x;
    const dy = this.homeY - this.y;
    
    if (dx !== 0) {
      this.setDirection(Math.sign(dx), 0);
    } else if (dy !== 0) {
      this.setDirection(0, Math.sign(dy));
    }
    
    this.move(board);
  }

  onPowerPelletEaten() {
    if (this.state === GhostState.CHASE || this.state === GhostState.SCATTER) {
      this.setState(GhostState.FRIGHTENED);
      // Reverse direction
      this.direction.dx *= -1;
      this.direction.dy *= -1;
    }
  }

  onEaten() {
    this.setState(GhostState.EATEN);
  }

  isVulnerable() {
    return this.state === GhostState.FRIGHTENED;
  }

  isDangerous() {
    return this.state === GhostState.CHASE || this.state === GhostState.SCATTER;
  }

  reset() {
    super.reset();
    this.setState(GhostState.SCATTER);
  }

  getState() {
    return {
      ...this.getPosition(),
      type: this.type,
      color: this.color,
      state: this.state,
      isVulnerable: this.isVulnerable(),
      direction: this.direction
    };
  }
}