
import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

// ======= OOP CLASSES ======= //
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

class Snake {
  constructor(initialPos) {
    this.body = [initialPos];
    this.direction = new Point(1, 0); // move right initially
  }

  setDirection(newDir) {
    // prevent reverse direction
    if (this.direction.x === -newDir.x && this.direction.y === -newDir.y) return;
    this.direction = newDir;
  }

  move(grow = false) {
    const head = this.getHead();
    const newHead = new Point(head.x + this.direction.x, head.y + this.direction.y);
    this.body.unshift(newHead);
    if (!grow) {
      this.body.pop();
    }
  }

  getHead() {
    return this.body[0];
  }

  hasCollision() {
    const head = this.getHead();
    return this.body.slice(1).some((p) => p.equals(head));
  }
}

class Food {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.position = this.randomPos();
  }

  randomPos() {
    return new Point(
      Math.floor(Math.random() * this.gridSize),
      Math.floor(Math.random() * this.gridSize)
    );
  }

  relocate(snake) {
    let newPos;
    do {
      newPos = this.randomPos();
    } while (snake.body.some((p) => p.equals(newPos)));
    this.position = newPos;
  }
}

// ======= GAME COMPONENT ======= //
export default class SnakeGame extends Component {
  constructor(props) {
    super(props);
    this.gridSize = 15;
    this.cellSize = 20;

    this.state = {
      snake: new Snake(new Point(5, 5)),
      food: new Food(this.gridSize),
      score: 0,
      gameOver: false,
    };
  }

  componentDidMount() {
    this.gameLoop = setInterval(this.update, 200); // speed control
  }

  componentWillUnmount() {
    clearInterval(this.gameLoop);
  }

  update = () => {
    if (this.state.gameOver) return;

    const snake = this.state.snake;
    const food = this.state.food;

    snake.move();

    const head = snake.getHead();

    // wall collision
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.gridSize ||
      head.y >= this.gridSize ||
      snake.hasCollision()
    ) {
      this.setState({ gameOver: true });
      return;
    }

    // food collision
    if (head.equals(food.position)) {
      snake.move(true); // grow
      food.relocate(snake);
      this.setState((prev) => ({ score: prev.score + 10 }));
    }

    this.setState({ snake, food });
  };

  changeDirection = (dir) => {
    const snake = this.state.snake;
    if (dir === "UP") snake.setDirection(new Point(0, -1));
    if (dir === "DOWN") snake.setDirection(new Point(0, 1));
    if (dir === "LEFT") snake.setDirection(new Point(-1, 0));
    if (dir === "RIGHT") snake.setDirection(new Point(1, 0));
    this.setState({ snake });
  };

  renderGrid() {
    const items = [];

    // snake
    this.state.snake.body.forEach((part, i) => {
      items.push(
        <View
          key={`snake-${i}`}
          style={[
            styles.cell,
            {
              left: part.x * this.cellSize,
              top: part.y * this.cellSize,
              backgroundColor: i === 0 ? "#22c55e" : "#4ade80",
            },
          ]}
        />
      );
    });

    // food
    items.push(
      <View
        key="food"
        style={[
          styles.cell,
          {
            left: this.state.food.position.x * this.cellSize,
            top: this.state.food.position.y * this.cellSize,
            backgroundColor: "#ef4444",
          },
        ]}
      />
    );

    return items;
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: this.gridSize * this.cellSize,
            height: this.gridSize * this.cellSize,
            backgroundColor: "#1e293b",
            position: "relative",
          }}
        >
          {this.renderGrid()}
        </View>

        <Text style={styles.score}>Score: {this.state.score}</Text>
        {this.state.gameOver && <Text style={styles.over}>Game Over</Text>}

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => this.changeDirection("UP")} style={styles.btn}>
            <Text>⬆</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => this.changeDirection("LEFT")} style={styles.btn}>
              <Text>⬅</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeDirection("DOWN")} style={styles.btn}>
              <Text>⬇</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeDirection("RIGHT")} style={styles.btn}>
              <Text>➡</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

// ======= STYLES ======= //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  score: {
    marginTop: 10,
    fontSize: 18,
    color: "#e2e8f0",
  },
  over: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ef4444",
    marginTop: 10,
  },
  controls: {
    marginTop: 20,
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    margin: 6,
    borderRadius: 8,
  },
});
