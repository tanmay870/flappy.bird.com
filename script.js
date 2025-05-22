const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const instructionsDisplay = document.getElementById('instructions');
const startButton = document.getElementById('startButton');

// Game variables
let birdX = 50;
let birdY = 150;
let birdVelocity = 0;
const gravity = 0.4;
const jumpStrength = -7;

let pipes = [];
const pipeWidth = 50;
const pipeGap = 120; // Gap between top and bottom pipe
const pipeSpeed = 2;
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

// Images (replace with actual image paths if you have them)
// For simplicity, we'll draw colored rectangles for now.
// If you have images, uncomment and load them:
// const birdImg = new Image(Flappy Bird Blue Video Games Flying - Sprite Transparent PNG);
// birdImg.src = 'bird.png';
// const pipeNorthImg = new Image();
// pipeNorthImg.src = 'pipeNorth.png';
// const pipeSouthImg = new Image();
// pipeSouthImg.src = 'pipeSouth.png';
// const backgroundImg = new Image();
// backgroundImg.src = 'background.png';

// Function to draw the bird
function drawBird() {
    ctx.fillStyle = 'yellow'; // Bird color
    ctx.fillRect(birdX, birdY, 30, 24); // Bird size
    // If you have an image:
    // ctx.drawImage(birdImg, birdX, birdY, 30, 24);
}

// Function to draw pipes
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];

        // Top pipe
        ctx.fillStyle = 'green'; // Pipe color
        ctx.fillRect(p.x, 0, pipeWidth, p.y);
        // If you have an image for top pipe:
        // ctx.drawImage(pipeNorthImg, p.x, 0, pipeWidth, p.y);

        // Bottom pipe
        ctx.fillRect(p.x, p.y + pipeGap, pipeWidth, canvas.height - (p.y + pipeGap));
        // If you have an image for bottom pipe:
        // ctx.drawImage(pipeSouthImg, p.x, p.y + pipeGap, pipeWidth, canvas.height - (p.y + pipeGap));
    }
}

// Function to update game state
function update() {
    if (!gameStarted) return; // Don't update if game hasn't started

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // If you have a background image:
    // ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Bird physics
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Check for ground collision
    if (birdY + 24 > canvas.height) { // 24 is bird height
        birdY = canvas.height - 24;
        gameOver = true;
    }
    // Check for ceiling collision
    if (birdY < 0) {
        birdY = 0;
        birdVelocity = 0;
    }

    // Pipe generation
    if (frame % 90 === 0) { // Generate a new pipe every 90 frames
        let minY = 50; // Minimum pipe height from top
        let maxY = canvas.height - pipeGap - 50; // Maximum pipe height from top
        let randomPipeHeight = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        pipes.push({
            x: canvas.width, // Start pipe from right edge
            y: randomPipeHeight, // Height of the top pipe
            passed: false // To track if bird has passed it for score
        });
    }

    // Move and remove pipes
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= pipeSpeed;

        // Collision detection with pipes
        if (
            birdX < p.x + pipeWidth &&
            birdX + 30 > p.x && // 30 is bird width
            (birdY < p.y || birdY + 24 > p.y + pipeGap) // 24 is bird height
        ) {
            gameOver = true;
        }

        // Check if bird passed pipe for score
        if (p.x + pipeWidth < birdX && !p.passed) {
            score++;
            p.passed = true;
            scoreDisplay.textContent = `Score: ${score}`;
        }

        // Remove off-screen pipes
        if (p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--; // Adjust index after removal
        }
    }

    drawBird();
    drawPipes();

    if (gameOver) {
        endGame();
    } else {
        frame++;
        requestAnimationFrame(update); // Loop the game
    }
}

// Function to handle bird jump
function jump() {
    if (gameStarted && !gameOver) {
        birdVelocity = jumpStrength;
    }
}

// Event listeners for jumping
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});
canvas.addEventListener('click', jump); // Click on canvas to jump

// Function to start the game
function startGame() {
    // Reset game state
    birdY = 150;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = true;
    scoreDisplay.textContent = `Score: ${score}`;

    instructionsDisplay.style.display = 'none'; // Hide instructions
    startButton.style.display = 'none'; // Hide start button

    update(); // Start the game loop
}

// Function to end the game
function endGame() {
    gameStarted = false;
    instructionsDisplay.textContent = `Game Over! Your Score: ${score}`;
    instructionsDisplay.style.display = 'block';
    startButton.textContent = 'Play Again';
    startButton.style.display = 'block';
}

// Initial state before game starts
instructionsDisplay.style.display = 'block';
startButton.style.display = 'block';
startButton.addEventListener('click', startGame);

// Optional: Load images before starting game (if you choose to use images)
// Promise.all([
//     new Promise(resolve => birdImg.onload = resolve),
//     new Promise(resolve => pipeNorthImg.onload = resolve),
//     new Promise(resolve => pipeSouthImg.onload = resolve),
//     new Promise(resolve => backgroundImg.onload = resolve)
// ]).then(() => {
//     // All images loaded, enable start button or draw initial screen
//     // (For this basic version, we just let the start button handle it)
// }).catch(error => console.error("Error loading images:", error));