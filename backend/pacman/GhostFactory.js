// GhostFactory.js - Factory Pattern for creating ghosts
import Ghost, { GhostType } from "./Ghost.js";

export default class GhostFactory {
  static createGhost(type, board) {
    const positions = this.getGhostPositions(board);
    const homeCorners = this.getHomeCorners(board);
    
    switch(type) {
      case GhostType.BLINKY:
        return new Ghost(
          positions.blinky.x, 
          positions.blinky.y, 
          GhostType.BLINKY,
          homeCorners.blinky.x,
          homeCorners.blinky.y
        );
      
      case GhostType.PINKY:
        return new Ghost(
          positions.pinky.x, 
          positions.pinky.y, 
          GhostType.PINKY,
          homeCorners.pinky.x,
          homeCorners.pinky.y
        );
      
      case GhostType.INKY:
        return new Ghost(
          positions.inky.x, 
          positions.inky.y, 
          GhostType.INKY,
          homeCorners.inky.x,
          homeCorners.inky.y
        );
      
      case GhostType.CLYDE:
        return new Ghost(
          positions.clyde.x, 
          positions.clyde.y, 
          GhostType.CLYDE,
          homeCorners.clyde.x,
          homeCorners.clyde.y
        );
      
      default:
        throw new Error(`Unknown ghost type: ${type}`);
    }
  }

  static createAllGhosts(board) {
    return [
      this.createGhost(GhostType.BLINKY, board),
      this.createGhost(GhostType.PINKY, board),
      this.createGhost(GhostType.INKY, board),
      this.createGhost(GhostType.CLYDE, board)
    ];
  }

  static getGhostPositions(board) {
    const width = board.getWidth();
    const height = board.getHeight();
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    return {
      blinky: { x: centerX, y: centerY - 2 },
      pinky: { x: centerX - 1, y: centerY },
      inky: { x: centerX, y: centerY },
      clyde: { x: centerX + 1, y: centerY }
    };
  }

  static getHomeCorners(board) {
    const width = board.getWidth();
    const height = board.getHeight();

    return {
      blinky: { x: width - 2, y: 0 },        // Top right corner
      pinky: { x: 0, y: 0 },                 // Top left corner
      inky: { x: width - 2, y: height - 1 }, // Bottom right corner
      clyde: { x: 0, y: height - 1 }         // Bottom left corner
    };
  }
}