import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BLOCK_SHAPES = {
  'DOT': [[1]],
  'SQUARE_2X2': [[1, 1], [1, 1]],
  'SMALL_L_DOWN_RIGHT': [[1, 0], [1, 0], [1, 1]],
  'SMALL_L_DOWN_LEFT': [[0, 1], [0, 1], [1, 1]],
  'SMALL_L_UP_RIGHT': [[1, 1], [1, 0], [1, 0]],
  'SMALL_L_UP_LEFT': [[1, 1], [0, 1], [0, 1]],
  'LINE_3_VERTICAL': [[1], [1], [1]],
  'LINE_3_HORIZONTAL': [[1, 1, 1]],
  'LINE_4_VERTICAL': [[1], [1], [1], [1]],
  'LINE_4_HORIZONTAL': [[1, 1, 1, 1]],
  'LINE_5_VERTICAL': [[1], [1], [1], [1], [1]],
  'LINE_5_HORIZONTAL': [[1, 1, 1, 1, 1]],
  'CORNER': [[1, 1], [1, 0]],
  'SQUARE_3X3': [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  'LARGE_L_DOWN_RIGHT': [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
  'LARGE_L_UP_RIGHT': [[1, 1, 1], [1, 0, 0], [1, 0, 0]],
  'LARGE_L_DOWN_LEFT': [[0, 0, 1], [0, 0, 1], [1, 1, 1]],
  'LARGE_L_UP_LEFT': [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
  'T_SHAPE_DOWN': [[1, 1, 1], [0, 1, 0]],
  'T_SHAPE_UP': [[0, 1, 0], [1, 1, 1]],
  'T_SHAPE_LEFT': [[1, 0], [1, 1], [1, 0]],
  'T_SHAPE_RIGHT': [[0, 1], [1, 1], [0, 1]],
  'DIAGONAL_DOWN_RIGHT': [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  'DIAGONAL_UP_RIGHT': [[0, 0, 1], [0, 1, 0], [1, 0, 0]],
  'DIAGONAL_DOWN_LEFT': [[0, 0, 1], [0, 1, 0], [1, 0, 0]],
  'DIAGONAL_UP_LEFT': [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
};

class Block {
    constructor(shape) {
        this.shape = shape;
    }
}

class BlockGenerator {
    constructor() {
        this.allBlocks = Object.values(BLOCK_SHAPES).map(shape => new Block(shape));
    }
    getRandomBlock() {
        const randomIndex = Math.floor(Math.random() * this.allBlocks.length);
        return this.allBlocks[randomIndex];
    }
    getNewBlockSet() {
        return [this.getRandomBlock(), this.getRandomBlock(), this.getRandomBlock()];
    }
}

class Grid {
    constructor(size = 9) {
        this.size = size;
        this.matrix = Array(size).fill(null).map(() => Array(size).fill(0));
    }
    clone() {
        const newGrid = new Grid(this.size);
        newGrid.matrix = JSON.parse(JSON.stringify(this.matrix));
        return newGrid;
    }
    canPlaceBlock(block, startRow, startCol) {
        for (let r = 0; r < block.shape.length; r++) {
            for (let c = 0; c < block.shape[r].length; c++) {
                if (block.shape[r][c] === 1) {
                    const boardRow = startRow + r;
                    const boardCol = startCol + c;
                    if (boardRow >= this.size || boardCol >= this.size || this.matrix[boardRow][boardCol] === 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    placeBlock(block, startRow, startCol) {
        for (let r = 0; r < block.shape.length; r++) {
            for (let c = 0; c < block.shape[r].length; c++) {
                if (block.shape[r][c] === 1) {
                    this.matrix[startRow + r][startCol + c] = 1;
                }
            }
        }
    }
    clearFullLines() {
        let clearedCells = 0;
        for (let r = 0; r < this.size; r++) {
            if (this.matrix[r].every(cell => cell === 1)) {
                this.matrix[r] = Array(this.size).fill(0);
                clearedCells += this.size;
            }
        }
        for (let c = 0; c < this.size; c++) {
            let fullColumn = true;
            for (let r = 0; r < this.size; r++) {
                if (this.matrix[r][c] === 0) {
                    fullColumn = false;
                    break;
                }
            }
            if (fullColumn) {
                for (let r = 0; r < this.size; r++) {
                    this.matrix[r][c] = 0;
                }
                clearedCells += this.size;
            }
        }
        return clearedCells;
    }
}

const blockGenerator = new BlockGenerator();

const Cell = ({ value }) => {
    const cellStyle = value === 1 ? styles.filledCell : styles.emptyCell;
    return <View style={[styles.cell, cellStyle]} />;
};

const BlockComponent = ({ block, onSelect, isSelected }) => {
    const wrapperStyle = isSelected ? [styles.blockWrapper, styles.selectedBlock] : styles.blockWrapper;
    return (
        <TouchableOpacity onPress={onSelect} style={wrapperStyle}>
            {block.shape.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cellValue, colIndex) => (
                        <View
                            key={colIndex}
                            style={[
                                styles.blockCell,
                                cellValue === 1 ? styles.filledBlockCell : styles.emptyBlockCell,
                            ]}
                        />
                    ))}
                </View>
            ))}
        </TouchableOpacity>
    );
};

const Blockoduko = () => {
    const [grid, setGrid] = useState(new Grid());
    const [availableBlocks, setAvailableBlocks] = useState([]);
    const [score, setScore] = useState(0);
    const [selectedBlock, setSelectedBlock] = useState(null);

    useEffect(() => {
        setAvailableBlocks(blockGenerator.getNewBlockSet());
    }, []);

    const handleCellPress = (rowIndex, colIndex) => {
        if (!selectedBlock) {
            Alert.alert("No Block Selected", "Please select a block from the bottom first.");
            return;
        }
        if (grid.canPlaceBlock(selectedBlock, rowIndex, colIndex)) {
            const newGrid = grid.clone();
            newGrid.placeBlock(selectedBlock, rowIndex, colIndex);
            const clearedCells = newGrid.clearFullLines();
            if (clearedCells > 0) {
                setScore(prev => prev + clearedCells);
            }
            setGrid(newGrid);
            const remainingBlocks = availableBlocks.filter(b => b !== selectedBlock);
            setSelectedBlock(null);
            if (remainingBlocks.length === 0) {
                setAvailableBlocks(blockGenerator.getNewBlockSet());
            } else {
                setAvailableBlocks(remainingBlocks);
            }
        } else {
            Alert.alert("Invalid Move", "Cannot place the block here.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Blockodoku</Text>
            <Text style={styles.score}>Score: {score}</Text>
            <View>
                {grid.matrix.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cellValue, colIndex) => (
                            <TouchableOpacity key={colIndex} onPress={() => handleCellPress(rowIndex, colIndex)}>
                                <Cell value={cellValue} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
            <Text style={styles.instructions}>Select a block, then tap the grid to place it.</Text>
            <View style={styles.blockContainer}>
                {availableBlocks.map((block, index) => (
                    <BlockComponent
                        key={index}
                        block={block}
                        isSelected={block === selectedBlock}
                        onSelect={() => setSelectedBlock(block)}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    score: {
        fontSize: 24,
        marginBottom: 20,
        color: '#555',
    },
    instructions: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#eee',
    },
    emptyCell: {
        backgroundColor: '#fff',
    },
    filledCell: {
        backgroundColor: '#00bcd4',
    },
    blockContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        width: '100%',
        paddingVertical: 20,
        marginTop: 10,
        height: 120,
    },
    blockWrapper: {
        padding: 5,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    selectedBlock: {
        borderColor: '#00bcd4',
        transform: [{ scale: 1.1 }],
    },
    blockCell: {
        width: 18,
        height: 18,
    },
    emptyBlockCell: {
        backgroundColor: 'transparent',
    },
    filledBlockCell: {
        backgroundColor: '#ffc107',
        borderWidth: 1,
        borderColor: '#e0a800',
    },
});

export default Blockoduko;
