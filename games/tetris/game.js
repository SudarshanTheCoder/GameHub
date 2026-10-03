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
function spawnPiece(){
    const pieces = Object.keys(SHAPES);

    // If we dont have a next piece yet , generate one
    if(!nextPiece){
        nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
    }

    // Use the existing nextPiece as current, then roll a new nextPiece
    currentPiece=nextPiece;
    nextPiece= pieces[Math.floor(Math.random() * pieces.length)];

    currentRotation = 0;
    currentX = Math.floor(COLS/2)-1;
    currentY = 0;

    // Check if game over
    if(collision(currentX, currentY , currentRotation)){
        gameOver=true;
        document.getElementById('game-over').classList.remove('hidden');
    }
}

//get current piece shape
function getPieceShape(){
    const rotations = SHAPES[currentPiece];
    return rotations[currentRotation %rotations.length];
}

