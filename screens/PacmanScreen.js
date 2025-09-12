// screens/PacmanScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import GameManager from "../backend/pacman/GameManager";

const initialLayout = [
  [1,1,1,1,1,1,1],
  [1,2,2,2,2,2,1],
  [1,2,1,1,1,2,1],
  [1,2,2,2,2,2,1],
  [1,1,1,1,1,1,1],
];

export default function PacmanScreen() {
  const [gameState, setGameState] = useState(null);
  const gameRef = useRef(null);

  useEffect(() => {
    gameRef.current = new GameManager(initialLayout);
    setGameState(gameRef.current.getState());

    const interval = setInterval(() => {
      gameRef.current.moveGhosts();
      if (gameRef.current.checkCollision()) {
        clearInterval(interval);
        alert("Game Over!");
      }
      setGameState({ ...gameRef.current.getState() });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const move = (dx, dy) => {
    gameRef.current.movePacman(dx, dy);
    setGameState({ ...gameRef.current.getState() });
  };

  if (!gameState) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {gameState.score}</Text>
      <View style={styles.board}>
        {gameState.board.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((cell, x) => {
              let content = null;
              if (gameState.pacman.x === x && gameState.pacman.y === y) content = "😃";
              else if (gameState.ghosts.some(g => g.x === x && g.y === y)) content = "👻";
              else if (cell === 1) content = "⬛";
              else if (cell === 2) content = "•";
              return <Text key={x} style={styles.cell}>{content}</Text>;
            })}
          </View>
        ))}
      </View>
      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => move(0, -1)} style={styles.button}><Text>↑</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => move(-1, 0)} style={styles.button}><Text>←</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => move(1, 0)} style={styles.button}><Text>→</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => move(0, 1)} style={styles.button}><Text>↓</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#000' },
  score: { fontSize:20, color:'#fff', marginBottom:10 },
  board: { },
  row: { flexDirection:'row' },
  cell: { width:30, height:30, textAlign:'center', fontSize:20 },
  controls: { marginTop:20 },
  button: { margin:5, padding:10, backgroundColor:'#fff', borderRadius:5 },
});
