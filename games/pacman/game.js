// Game canvas and context setup
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghost");

// Helper function to draw rectangles
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

// Game map data
let map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,2,1,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1,1],
    [0,0,0,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,0,0,0],
    [1,1,1,1,2,1,2,1,1,2,1,1,1,0,0,1,1,1,2,1,1,2,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,0,2,2,2,0,0,0,0,2,2,2,0,1,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,0,0,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1],
    [0,0,0,1,2,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,2,1,0,0,0],
    [1,1,1,1,2,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,2,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1],
    [1,3,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman;
let ghosts = [];
let score = 0;
let lives = 3;
let gameOver = false;
let gameStarted = false;
let level = 1;
let powerMode = false;
let powerModeTimer = 0;

// Initialize game entities and state
function initGame() {
    pacman = new Pacman(250, 350);
    ghosts = [
        new Ghost(250, 200, "red"),
        new Ghost(230, 200, "pink"),
        new Ghost(270, 200, "cyan"),
        new Ghost(250, 180, "orange")
    ];
    score = 0;
    gameOver = false;
    gameStarted = true;
}

// Check collision between Pacman and dots/power pellets
function checkDotCollision() {
    const cellSize = 20;
    let pacmanCellX = Math.floor(pacman.x / cellSize);
    let pacmanCellY = Math.floor(pacman.y / cellSize);

    if (pacmanCellX >= 0 && pacmanCellX < map[0].length && 
        pacmanCellY >= 0 && pacmanCellY < map.length) {
        
        if (map[pacmanCellY][pacmanCellX] === 2) {
            map[pacmanCellY][pacmanCellX] = 0;
            score += 10;
        } else if (map[pacmanCellY][pacmanCellX] === 3) {
            map[pacmanCellY][pacmanCellX] = 0;
            score += 50;
            activatePowerMode();
        }
    }
}
