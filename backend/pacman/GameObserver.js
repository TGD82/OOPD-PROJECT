// GameObserver.js - Observer Pattern for game events

export const GameEvent = {
  PELLET_EATEN: 'pellet_eaten',
  POWER_PELLET_EATEN: 'power_pellet_eaten',
  GHOST_EATEN: 'ghost_eaten',
  PACMAN_DIED: 'pacman_died',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over',
  BONUS_FRUIT_EATEN: 'bonus_fruit_eaten',
  SCORE_CHANGED: 'score_changed',
  LIVES_CHANGED: 'lives_changed'
};

export class GameSubject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(event, data) {
    this.observers.forEach(observer => {
      observer.update(event, data);
    });
  }
}

export class GameObserver {
  update(event, data) {
    throw new Error("Method 'update()' must be implemented");
  }
}

// Sound Observer - would trigger sound effects
export class SoundObserver extends GameObserver {
  update(event, data) {
    switch(event) {
      case GameEvent.PELLET_EATEN:
        this.playSound('pellet');
        break;
      case GameEvent.POWER_PELLET_EATEN:
        this.playSound('powerPellet');
        break;
      case GameEvent.GHOST_EATEN:
        this.playSound('eatGhost');
        break;
      case GameEvent.PACMAN_DIED:
        this.playSound('death');
        break;
      case GameEvent.LEVEL_COMPLETE:
        this.playSound('levelComplete');
        break;
      case GameEvent.BONUS_FRUIT_EATEN:
        this.playSound('eatFruit');
        break;
    }
  }

  playSound(soundName) {
    // Placeholder for actual sound implementation
    console.log(`Playing sound: ${soundName}`);
  }
}

// Score Observer - tracks scoring milestones
export class ScoreObserver extends GameObserver {
  constructor() {
    super();
    this.highScore = 0;
    this.lastExtraLifeScore = 0;
    this.extraLifeInterval = 10000;
  }

  update(event, data) {
    if (event === GameEvent.SCORE_CHANGED) {
      const { score, pacman } = data;
      
      // Update high score
      if (score > this.highScore) {
        this.highScore = score;
      }
      
      // Award extra life every 10,000 points
      if (Math.floor(score / this.extraLifeInterval) > 
          Math.floor(this.lastExtraLifeScore / this.extraLifeInterval)) {
        pacman.addLife();
        console.log('Extra life awarded!');
      }
      
      this.lastExtraLifeScore = score;
    }
  }

  getHighScore() {
    return this.highScore;
  }
}

// Statistics Observer - tracks game statistics
export class StatisticsObserver extends GameObserver {
  constructor() {
    super();
    this.stats = {
      pelletsEaten: 0,
      powerPelletsEaten: 0,
      ghostsEaten: 0,
      deaths: 0,
      levelsCompleted: 0,
      bonusFruitsEaten: 0
    };
  }

  update(event, data) {
    switch(event) {
      case GameEvent.PELLET_EATEN:
        this.stats.pelletsEaten++;
        break;
      case GameEvent.POWER_PELLET_EATEN:
        this.stats.powerPelletsEaten++;
        break;
      case GameEvent.GHOST_EATEN:
        this.stats.ghostsEaten++;
        break;
      case GameEvent.PACMAN_DIED:
        this.stats.deaths++;
        break;
      case GameEvent.LEVEL_COMPLETE:
        this.stats.levelsCompleted++;
        break;
      case GameEvent.BONUS_FRUIT_EATEN:
        this.stats.bonusFruitsEaten++;
        break;
    }
  }

  getStats() {
    return { ...this.stats };
  }

  reset() {
    this.stats = {
      pelletsEaten: 0,
      powerPelletsEaten: 0,
      ghostsEaten: 0,
      deaths: 0,
      levelsCompleted: 0,
      bonusFruitsEaten: 0
    };
  }
}