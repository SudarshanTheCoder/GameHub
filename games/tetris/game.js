// Game constants
const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 30;

// Tetromino shapes and colors
const SHAPES = {
    I: [
        [[1,1,1,1]],
        [[1],
         [1],
         [1],
         [1]]
    ],
    O: [
        [[1,1],
         [1,1]]
    ],
    T: [
        [[0,1,0],
         [1,1,1]],
        [[1,0],
         [1,1],
         [1,0]],
        [[1,1,1],
         [0,1,0]],
        [[0,1],
         [1,1],
         [0,1]]
    ],
    S: [
        [[0,1,1],
         [1,1,0]],
        [[1,0],
         [1,1],
         [0,1]]
    ],
    Z: [
        [[1,1,0],
         [0,1,1]],
        [[0,1],
         [1,1],
         [1,0]]
    ],
    J: [
        [[1,0,0],
         [1,1,1]],
        [[1,1],
         [1,0],
         [1,0]],
        [[1,1,1],
         [0,0,1]],
        [[0,1],
         [0,1],
         [1,1]]
    ],
    L: [
        [[0,0,1],
         [1,1,1]],
        [[1,0],
         [1,0],
         [1,1]],
        [[1,1,1],
         [1,0,0]],
        [[1,1],
         [0,1],
         [0,1]]
    ]
};

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let currentX = 0;
let currentY = 0;
let currentRotation = 0;
let score = 0;
let gameOver = false;
let dropCounter = 0;
let dropInterval = 1000; // milliseconds
let lastTime = 0;
let gameStarted = false;

// Initialize game board
function initBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

// Initialize game
function init() {
    initBoard();
    score = 0;
    gameOver = false;
    dropCounter = 0;
    lastTime = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('game-over').classList.add('hidden');
    spawnPiece();
    createBoard();
    updateDisplay();
}

// Create visual board
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            gameBoard.appendChild(cell);
        }
    }

    // Build next piece preview grid (4x4)
    const nextBoard = document.getElementById('next-piece');
    if (nextBoard) {
        nextBoard.innerHTML = '';
        for (let i = 0; i < 4 * 4; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            nextBoard.appendChild(cell);
        }
    }
}

// Spawn a new piece
function spawnPiece() {
    const pieces = Object.keys(SHAPES);

    // If we don't have a next piece yet, generate one
    if (!nextPiece) {
        nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
    }

    // Use the existing nextPiece as current, then roll a new nextPiece
    currentPiece = nextPiece;
    nextPiece = pieces[Math.floor(Math.random() * pieces.length)];

    currentRotation = 0;
    currentX = Math.floor(COLS / 2) - 1;
    currentY = 0;
    
    // Check if game over
    if (collision(currentX, currentY, currentRotation)) {
        gameOver = true;
        document.getElementById('game-over').classList.remove('hidden');
    }
}

// Get current piece shape
function getPieceShape() {
    const rotations = SHAPES[currentPiece];
    return rotations[currentRotation % rotations.length];
}

// Check collision
function collision(x, y, rotation) {
    const shape = SHAPES[currentPiece][rotation % SHAPES[currentPiece].length];
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Lock piece to board
function lockPiece() {
    const shape = getPieceShape();
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const y = currentY + row;
                const x = currentX + col;
                
                if (y >= 0) {
                    board[y][x] = currentPiece;
                }
            }
        }
    }
    
    clearLines();
    spawnPiece();
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // Check the same row again
        }
    }
    
    if (linesCleared > 0) {
        // Update score
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] || 0;
        document.getElementById('score').textContent = score;
    }
}

// Move piece
function movePiece(dx, dy) {
    if (gameOver) return;
    
    const newX = currentX + dx;
    const newY = currentY + dy;
    
    if (!collision(newX, newY, currentRotation)) {
        currentX = newX;
        currentY = newY;
        return true;
    }
    
    return false;
}

// Rotate piece
function rotatePiece() {
    if (gameOver) return;
    
    const newRotation = (currentRotation + 1) % SHAPES[currentPiece].length;
    
    if (!collision(currentX, currentY, newRotation)) {
        currentRotation = newRotation;
        return true;
    }
    
    // Try wall kicks
    if (!collision(currentX - 1, currentY, newRotation)) {
        currentX -= 1;
        currentRotation = newRotation;
        return true;
    }
    
    if (!collision(currentX + 1, currentY, newRotation)) {
        currentX += 1;
        currentRotation = newRotation;
        return true;
    }
    
    return false;
}

// Drop piece
function dropPiece() {
    if (gameOver) return;
    
    if (!movePiece(0, 1)) {
        lockPiece();
    }
}

// Update display
function updateDisplay() {
    // Clear board
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.className = 'cell';
            if (board[row][col]) {
                cell.classList.add('filled', board[row][col]);
            }
        }
    }
    
    // Draw current piece
    if (currentPiece && !gameOver) {
        const shape = getPieceShape();
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const y = currentY + row;
                    const x = currentX + col;
                    
                    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
                        const cell = document.getElementById(`cell-${y}-${x}`);
                        cell.classList.add('filled', currentPiece);
                    }
                }
            }
        }
    }

    // Draw next piece preview (in 4x4 grid)
    const nextBoard = document.getElementById('next-piece');
    if (nextBoard) {
        const cells = nextBoard.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.className = 'cell';
        });

        if (nextPiece) {
            const rotations = SHAPES[nextPiece];
            const shape = rotations[0]; // Just use first rotation for preview
            const offsetY = Math.floor((4 - shape.length) / 2);
            const offsetX = Math.floor((4 - shape[0].length) / 2);

            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const y = offsetY + row;
                        const x = offsetX + col;
                        const index = y * 4 + x;
                        const cell = cells[index];
                        if (cell) {
                            cell.classList.add('filled', nextPiece);
                        }
                    }
                }
            }
        }
    }
}

// Game loop
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (!gameOver) {
        dropCounter += deltaTime;
        
        if (dropCounter > dropInterval) {
            dropPiece();
            dropCounter = 0;
        }
        
        updateDisplay();
    }
    
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    // Ignore controls until the game has started
    if (!gameStarted) return;

    if (gameOver && e.key.toLowerCase() === 'r') {
        init();
        return;
    }
    
    if (gameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            updateDisplay();
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            updateDisplay();
            break;
        case 'ArrowDown':
            dropPiece();
            updateDisplay();
            break;
        case 'ArrowUp':
        case ' ':
            e.preventDefault();
            rotatePiece();
            updateDisplay();
            break;
    }
});

// Wire up start button and start game on click
window.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            if (gameStarted) return;
            gameStarted = true;
            init();
            gameLoop();
            startButton.style.display = 'none';
        });
    }
});