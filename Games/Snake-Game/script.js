const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake;
let direction;
let food;
let gameInterval;
let gameStarted = false;
let canChangeDirection = true;

let score = 0;
let highScore = 0;

// Load high score from localStorage on page load
window.onload = () => {
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) highScore = parseInt(savedHighScore);
    drawStartScreen();
    updateScoreboard();
}

function drawStartScreen(text = "Press ENTER to Start") {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Snake Game", canvasSize / 2, 150);

    ctx.font = "18px Arial";
    ctx.fillText(text, canvasSize / 2, 200);
}

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    canChangeDirection = true;
    score = 0;
    updateScoreboard();

    generateFood();

    gameStarted = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 120);
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
    } while (snake && snake.some(part => part.x === newFood.x && part.y === newFood.y));

    food = newFood;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !gameStarted) {
        startGame();
        return;
    }

    if (!gameStarted || !canChangeDirection) return;

    const key = event.key.toLowerCase();

    if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") {
        direction = "LEFT";
        canChangeDirection = false;
    }

    if ((key === "arrowup" || key === "w") && direction !== "DOWN") {
        direction = "UP";
        canChangeDirection = false;
    }

    if ((key === "arrowright" || key === "d") && direction !== "LEFT") {
        direction = "RIGHT";
        canChangeDirection = false;
    }

    if ((key === "arrowdown" || key === "s") && direction !== "UP") {
        direction = "DOWN";
        canChangeDirection = false;
    }
});

function gameLoop() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvasSize ||
        headY >= canvasSize ||
        snake.some(part => part.x === headX && part.y === headY)
    ) {
        clearInterval(gameInterval);
        gameStarted = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }
        drawStartScreen("Game Over - Press ENTER to Restart");
        updateScoreboard();
        return;
    }

    if (headX === food.x && headY === food.y) {
        generateFood();
        score += 1;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }
        updateScoreboard();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    canChangeDirection = true;

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(part.x, part.y, box, box);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

function updateScoreboard() {
    document.getElementById("currentScore").textContent = score;
    document.getElementById("highScore").textContent = highScore;
}