document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameSpeed = 150; // milliseconds
    let gameLoop;
    let gameRunning = false;
    let gameOver = false;
    
    // DOM elements
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    
    // Initialize game
    function initGame() {
        // Create initial snake
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        // Create initial food
        createFood();
        
        // Reset variables
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = score;
        gameOver = false;
        
        // Draw initial state
        draw();
    }
    
    // Create food at random position
    function createFood() {
        // Generate random position
        let foodX, foodY;
        let foodOnSnake;
        
        do {
            foodOnSnake = false;
            foodX = Math.floor(Math.random() * gridWidth);
            foodY = Math.floor(Math.random() * gridHeight);
            
            // Check if food is on snake
            for (let segment of snake) {
                if (segment.x === foodX && segment.y === foodY) {
                    foodOnSnake = true;
                    break;
                }
            }
        } while (foodOnSnake);
        
        food = {x: foodX, y: foodY};
    }
    
    // Draw everything
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Head is a different color
            if (index === 0) {
                ctx.fillStyle = '#4CAF50'; // Green head
            } else {
                ctx.fillStyle = '#8BC34A'; // Lighter green body
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // Draw food
        ctx.fillStyle = '#FF5722'; // Orange food
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
        
        // Draw game over message
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
            
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
            ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 80);
        }
    }
    
    // Update game state
    function update() {
        if (gameOver) return;
        
        // Update direction
        direction = nextDirection;
        
        // Create new head based on direction
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for collisions
        if (checkCollision(head)) {
            gameOver = true;
            gameRunning = false;
            clearInterval(gameLoop);
            draw();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreElement.textContent = score;
            
            // Speed up the game slightly
            if (gameSpeed > 50) {
                gameSpeed -= 2;
                clearInterval(gameLoop);
                gameLoop = setInterval(update, gameSpeed);
            }
            
            // Create new food
            createFood();
        } else {
            // Remove tail if no food was eaten
            snake.pop();
        }
        
        // Draw updated state
        draw();
    }
    
    // Check for collisions
    function checkCollision(head) {
        // Check wall collision
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            return true;
        }
        
        // Check self collision (skip the last segment as it will be removed)
        for (let i = 0; i < snake.length - 1; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // Start button event listener
    startButton.addEventListener('click', () => {
        if (!gameRunning) {
            if (gameOver) {
                initGame();
            }
            gameRunning = true;
            gameLoop = setInterval(update, gameSpeed);
            startButton.textContent = 'Pause';
        } else {
            gameRunning = false;
            clearInterval(gameLoop);
            startButton.textContent = 'Resume';
        }
    });
    
    // Reset button event listener
    resetButton.addEventListener('click', () => {
        clearInterval(gameLoop);
        initGame();
        gameRunning = false;
        startButton.textContent = 'Start Game';
    });
    
    // Initialize game on load
    initGame();
});