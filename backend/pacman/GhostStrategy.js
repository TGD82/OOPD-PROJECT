// GhostStrategy.js - Strategy Pattern for different ghost behaviors

// Base Strategy Interface
export class GhostStrategy {
  getNextMove(ghost, board, pacman) {
    throw new Error("Method 'getNextMove()' must be implemented");
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  getValidMoves(ghost, board) {
    const moves = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    return moves.filter(move => {
      const newX = ghost.x + move.dx;
      const newY = ghost.y + move.dy;
      // Don't reverse direction unless necessary
      const isReversal = move.dx === -ghost.direction.dx && move.dy === -ghost.direction.dy;
      return ghost.canMove(newX, newY, board) && !isReversal;
    });
  }
}

// Blinky (Red) - Direct Chase Strategy
export class BlinkyStrategy extends GhostStrategy {
  getNextMove(ghost, board, pacman) {
    const targetX = pacman.x;
    const targetY = pacman.y;
    return this.moveTowardsTarget(ghost, board, targetX, targetY);
  }

  moveTowardsTarget(ghost, board, targetX, targetY) {
    const validMoves = this.getValidMoves(ghost, board);
    if (validMoves.length === 0) return { dx: 0, dy: 0 };

    let bestMove = validMoves[0];
    let minDistance = Infinity;

    for (const move of validMoves) {
      const newX = ghost.x + move.dx;
      const newY = ghost.y + move.dy;
      const distance = this.calculateDistance(newX, newY, targetX, targetY);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }
}

// Pinky (Pink) - Ambush Strategy (targets 4 tiles ahead of Pacman)
export class PinkyStrategy extends GhostStrategy {
  getNextMove(ghost, board, pacman) {
    const targetX = pacman.x + (pacman.direction.dx * 4);
    const targetY = pacman.y + (pacman.direction.dy * 4);
    return this.moveTowardsTarget(ghost, board, targetX, targetY);
  }

  moveTowardsTarget(ghost, board, targetX, targetY) {
    const validMoves = this.getValidMoves(ghost, board);
    if (validMoves.length === 0) return { dx: 0, dy: 0 };

    let bestMove = validMoves[0];
    let minDistance = Infinity;

    for (const move of validMoves) {
      const newX = ghost.x + move.dx;
      const newY = ghost.y + move.dy;
      const distance = this.calculateDistance(newX, newY, targetX, targetY);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }
}

// Inky (Cyan) - Complex Strategy (uses Blinky's position)
export class InkyStrategy extends GhostStrategy {
  getNextMove(ghost, board, pacman, blinky) {
    // Target is based on vector from Blinky to 2 tiles ahead of Pacman, then doubled
    const pivotX = pacman.x + (pacman.direction.dx * 2);
    const pivotY = pacman.y + (pacman.direction.dy * 2);
    
    const blinkyX = blinky ? blinky.x : ghost.x;
    const blinkyY = blinky ? blinky.y : ghost.y;
    
    const targetX = pivotX + (pivotX - blinkyX);
    const targetY = pivotY + (pivotY - blinkyY);
    
    return this.moveTowardsTarget(ghost, board, targetX, targetY);
  }

  moveTowardsTarget(ghost, board, targetX, targetY) {
    const validMoves = this.getValidMoves(ghost, board);
    if (validMoves.length === 0) return { dx: 0, dy: 0 };

    let bestMove = validMoves[0];
    let minDistance = Infinity;

    for (const move of validMoves) {
      const newX = ghost.x + move.dx;
      const newY = ghost.y + move.dy;
      const distance = this.calculateDistance(newX, newY, targetX, targetY);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }
}

// Clyde (Orange) - Shy Strategy (chases when far, runs when close)
export class ClydeStrategy extends GhostStrategy {
  constructor() {
    super();
    this.scatterDistance = 8;
  }

  getNextMove(ghost, board, pacman) {
    const distance = this.calculateDistance(ghost.x, ghost.y, pacman.x, pacman.y);
    
    let targetX, targetY;
    if (distance > this.scatterDistance) {
      // Chase Pacman when far away
      targetX = pacman.x;
      targetY = pacman.y;
    } else {
      // Run to corner when close
      targetX = 0;
      targetY = board.getHeight() - 1;
    }
    
    return this.moveTowardsTarget(ghost, board, targetX, targetY);
  }

  moveTowardsTarget(ghost, board, targetX, targetY) {
    const validMoves = this.getValidMoves(ghost, board);
    if (validMoves.length === 0) return { dx: 0, dy: 0 };

    let bestMove = validMoves[0];
    let minDistance = Infinity;

    for (const move of validMoves) {
      const newX = ghost.x + move.dx;
      const newY = ghost.y + move.dy;
      const distance = this.calculateDistance(newX, newY, targetX, targetY);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }
}

// Frightened Strategy - Random movement when Pacman is powered up
export class FrightenedStrategy extends GhostStrategy {
  getNextMove(ghost, board, pacman) {
    const validMoves = this.getValidMoves(ghost, board);
    if (validMoves.length === 0) return { dx: 0, dy: 0 };
    
    // Random movement
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
}

// Scatter Strategy - Go to home corners
export class ScatterStrategy extends GhostStrategy {
  constructor(cornerX, cornerY) {
    super();
    this.cornerX = cornerX;
    this.cornerY = cornerY;
  }

  getNextMove(ghost, board, pacman) {
    return this.moveTowardsTarget(ghost, board, this.cornerX, this.cornerY);
  }

  moveTowardsTarget(ghost, board, targetX, targetY) {
    const validMoves = this.getValidMoves(ghost, board);
    if (validMoves.length === 0) return { dx: 0, dy: 0 };

    let bestMove = validMoves[0];
    let minDistance = Infinity;

    for (const move of validMoves) {
      const newX = ghost.x + move.dx;
      const newY = ghost.y + move.dy;
      const distance = this.calculateDistance(newX, newY, targetX, targetY);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }
}