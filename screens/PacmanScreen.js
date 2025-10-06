// screens/PacmanScreen.js - Enhanced Pacman Screen with animations
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import GameManager, { GameState } from "../backend/pacman/GameManager";
import { GhostState } from "../backend/pacman/Ghost";

export default function PacmanScreen() {
  const [gameState, setGameState] = useState(null);
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const powerUpPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initialize game
    gameRef.current = new GameManager();
    gameRef.current.start();
    setGameState(gameRef.current.getState());

    // Game loop
    const gameLoop = setInterval(() => {
      if (gameRef.current) {
        gameRef.current.update();
        setGameState({ ...gameRef.current.getState() });
      }
    }, 150); // Update every 150ms

    // Power-up pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(powerUpPulse, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(powerUpPulse, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ])
    );
    pulseAnimation.start();

    return () => {
      clearInterval(gameLoop);
      pulseAnimation.stop();
    };
  }, []);

  const move = (dx, dy) => {
    if (gameRef.current) {
      gameRef.current.movePacman(dx, dy);
      setGameState({ ...gameRef.current.getState() });
    }
  };

  const handleRestart = () => {
    gameRef.current = new GameManager();
    gameRef.current.start();
    setGameState(gameRef.current.getState());
  };

  const handlePause = () => {
    if (gameRef.current) {
      gameRef.current.pause();
      setGameState({ ...gameRef.current.getState() });
    }
  };

  if (!gameState) return null;

  const getCellContent = (cell, x, y) => {
    // Check for Pacman
    if (gameState.pacman.x === x && gameState.pacman.y === y) {
      return gameState.pacman.isPoweredUp ? "😎" : "😃";
    }

    // Check for ghosts
    const ghost = gameState.ghosts.find(g => g.x === x && g.y === y);
    if (ghost) {
      if (ghost.state === GhostState.FRIGHTENED) {
        return "🔵"; // Frightened ghost
      } else if (ghost.state === GhostState.EATEN) {
        return "👀"; // Eaten ghost (eyes only)
      }
      // Normal ghost colors
      const ghostEmojis = {
        red: "🔴",
        pink: "🩷",
        cyan: "🔷",
        orange: "🟠"
      };
      return ghostEmojis[ghost.color] || "👻";
    }

    // Check for bonus fruit
    if (gameState.bonusFruit && gameState.bonusFruit.x === x && gameState.bonusFruit.y === y) {
      return "🍒";
    }

    // Check for board elements
    if (cell === 1) return "⬛"; // Wall
    if (cell === 2) return "·";  // Pellet
    if (cell === 3) return "⚪"; // Power pellet
    if (cell === 4) return "🏠"; // Ghost house
    
    return null; // Empty space
  };

  const getPowerUpTimeBar = () => {
    if (!gameState.pacman.isPoweredUp) return null;
    const percentage = (gameState.pacman.powerUpTimeRemaining / 10000) * 100;
    return (
      <View style={styles.powerUpBar}>
        <Text style={styles.powerUpText}>POWER MODE!</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
      </View>
    );
  };

  const renderGameOverlay = () => {
    if (gameState.gameState === GameState.GAME_OVER) {
      return (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>GAME OVER</Text>
          <Text style={styles.overlayScore}>Final Score: {gameState.score}</Text>
          <Text style={styles.overlayHighScore}>High Score: {gameState.highScore}</Text>
          <TouchableOpacity onPress={handleRestart} style={styles.overlayButton}>
            <Text style={styles.overlayButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (gameState.gameState === GameState.LEVEL_COMPLETE) {
      return (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>LEVEL COMPLETE!</Text>
          <Text style={styles.overlayScore}>Level {gameState.level - 1} Cleared</Text>
          <Text style={styles.overlayText}>Get Ready for Level {gameState.level}...</Text>
        </View>
      );
    }

    if (gameState.isPaused) {
      return (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>PAUSED</Text>
          <TouchableOpacity onPress={handlePause} style={styles.overlayButton}>
            <Text style={styles.overlayButtonText}>RESUME</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.score}>{gameState.score}</Text>
        </View>
        
        <View style={styles.levelContainer}>
          <Text style={styles.label}>LEVEL</Text>
          <Text style={styles.level}>{gameState.level}</Text>
        </View>

        <View style={styles.livesContainer}>
          <Text style={styles.label}>LIVES</Text>
          <Text style={styles.lives}>
            {"😃".repeat(gameState.lives)}
          </Text>
        </View>
      </View>

      {/* High Score */}
      <Text style={styles.highScore}>HIGH SCORE: {gameState.highScore}</Text>

      {/* Power Up Bar */}
      {getPowerUpTimeBar()}

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {gameState.board.map((row, y) => (
            <View key={y} style={styles.row}>
              {row.map((cell, x) => {
                const content = getCellContent(cell, x, y);
                const isPacman = gameState.pacman.x === x && gameState.pacman.y === y;
                const isPowerPellet = cell === 3;
                
                return (
                  <Animated.View
                    key={x}
                    style={[
                      styles.cell,
                      isPacman && gameState.pacman.isPoweredUp && {
                        transform: [{ scale: powerUpPulse }]
                      }
                    ]}
                  >
                    <Text style={[
                      styles.cellText,
                      isPowerPellet && styles.powerPelletText
                    ]}>
                      {content}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>👻 Eaten: {gameState.statistics.ghostsEaten}</Text>
        <Text style={styles.statText}>🍒 Fruits: {gameState.statistics.bonusFruitsEaten}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity 
            onPress={() => move(0, -1)} 
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity 
            onPress={() => move(-1, 0)} 
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity 
            onPress={() => move(1, 0)} 
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity 
            onPress={() => move(0, 1)} 
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pause Button */}
      <TouchableOpacity 
        onPress={handlePause} 
        style={styles.pauseButton}
        activeOpacity={0.7}
      >
        <Text style={styles.pauseButtonText}>
          {gameState.isPaused ? "▶️" : "⏸️"}
        </Text>
      </TouchableOpacity>

      {/* Game Overlay */}
      {renderGameOverlay()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10
  },
  scoreContainer: {
    alignItems: "center"
  },
  levelContainer: {
    alignItems: "center"
  },
  livesContainer: {
    alignItems: "center"
  },
  label: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold"
  },
  score: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold"
  },
  level: {
    color: "#00FF00",
    fontSize: 24,
    fontWeight: "bold"
  },
  lives: {
    fontSize: 20
  },
  highScore: {
    color: "#FF69B4",
    fontSize: 14,
    marginBottom: 10
  },
  powerUpBar: {
    width: "90%",
    alignItems: "center",
    marginBottom: 10
  },
  powerUpText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    overflow: "hidden"
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFD700"
  },
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10
  },
  board: {
    backgroundColor: "#000",
    borderWidth: 3,
    borderColor: "#0000FF",
    borderRadius: 5
  },
  row: {
    flexDirection: "row"
  },
  cell: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  cellText: {
    fontSize: 16,
    textAlign: "center"
  },
  powerPelletText: {
    fontSize: 18
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginVertical: 10
  },
  statText: {
    color: "#FFF",
    fontSize: 12
  },
  controls: {
    alignItems: "center",
    marginTop: 20
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#1E90FF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5
  },
  buttonText: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold"
  },
  spacer: {
    width: 60
  },
  pauseButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF4500",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5
  },
  pauseButtonText: {
    fontSize: 24
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  overlayTitle: {
    color: "#FFD700",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20
  },
  overlayScore: {
    color: "#FFF",
    fontSize: 24,
    marginBottom: 10
  },
  overlayHighScore: {
    color: "#FF69B4",
    fontSize: 18,
    marginBottom: 20
  },
  overlayText: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 20
  },
  overlayButton: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20
  },
  overlayButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold"
  }
});