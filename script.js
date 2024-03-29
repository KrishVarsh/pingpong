const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "snow";
const paddle1Color = "lightgreen";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = { width: 25, height: 100, x: 0, y: 0 };
let paddle2 = { width: 25, height: 100, x: gameWidth - 25, y: gameHeight - 100 };
let isPaused = false;
let touch1 = null;
let touch2 = null;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
pauseBtn.addEventListener("click", togglePause);
gameBoard.addEventListener("touchstart", handleTouchStart);
gameBoard.addEventListener("touchmove", handleTouchMove);
gameStart();

function gameStart() {
  createBall();
  nextTick();
}

function handleTouchStart(event) {
    event.preventDefault();
    const touchY = event.touches[0].clientY;
    const middleY = gameHeight / 2;
  
    if (touchY < middleY) {
      paddle1.y = touchY - paddle1.height / 2;
    } else {
      paddle2.y = touchY - paddle2.height / 2;
    }
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const touchY = event.touches[0].clientY;
    
    // Calculate the new position for the green paddle
    const minYGreen = 0;
    const maxYGreen = gameHeight - paddle1.height;
    paddle1.y = clamp(touchY - paddle1.height / 2, minYGreen, maxYGreen);
  
    // Calculate the new position for the red paddle
    const minYRed = 0;
    const maxYRed = gameHeight - paddle2.height;
    paddle2.y = clamp(touchY - paddle2.height / 2, minYRed, maxYRed);
  }
  
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  

// Rest of the code...


function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Play" : "Pause";
    if (!isPaused) {
        nextTick();
    }
}

function nextTick() {
    intervalID = setInterval(() => {
        if (!isPaused) {
            clearBoard();
            drawPaddles();
            moveBall();
            drawBall(ballX, ballY);
            checkCollision();
        }
    }, 10);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles() {
    ctx.strokeStyle = paddleBorder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ballSpeed = 1;
    if (Math.round(Math.random()) == 1) {
        ballXDirection = 1;
    } else {
        ballXDirection = -1;
    }
    if (Math.round(Math.random()) == 1) {
        ballYDirection = Math.random() * 1;
    } else {
        ballYDirection = Math.random() * -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
}

function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function checkCollision() {
    if (ballY <= 0 + ballRadius) {
        ballYDirection *= -1;
    }
    if (ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }
    if (ballX <= 0) {
        player2Score += 1;
        updateScore();
        createBall();
        return;
    }
    if (ballX >= gameWidth) {
        player1Score += 1;
        updateScore();
        createBall();
        return;
    }
    if (ballX <= paddle1.x + paddle1.width + ballRadius) {
        if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
            ballX = paddle1.x + paddle1.width + ballRadius;
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
    if (ballX >= paddle2.x - ballRadius) {
        if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
            ballX = paddle2.x - ballRadius;
            ballXDirection *= -1;
            ballSpeed += 1;
        }
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;
    switch (keyPressed) {
        case paddle1Up:
            if (paddle1.y > 0) {
                paddle1.y -= paddleSpeed;
            }
            break;
        case paddle1Down:
            if (paddle1.y < gameHeight - paddle1.height) {
                paddle1.y += paddleSpeed;
            }
            break;
        case paddle2Up:
            if (paddle2.y > 0) {
                paddle2.y -= paddleSpeed;
            }
            break;
        case paddle2Down:
            if (paddle2.y < gameHeight - paddle2.height) {
                paddle2.y += paddleSpeed;
            }
            break;
    }
}

function updateScore() {
    scoreText.textContent = `${player1Score}:${player2Score}`;
  }
  

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1 = { width: 25, height: 100, x: 0, y: gameHeight / 2 - 50 };
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight / 2 - 50,
    };
    ballSpeed = 1;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    clearInterval(intervalID);
    gameStart();
}
