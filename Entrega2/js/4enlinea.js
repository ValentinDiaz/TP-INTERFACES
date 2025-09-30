const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const boardSize = 10;
const rows = 6; // Número de filas del tablero
const cols = 7; // Número de columnas del tablero
const cellSize = 86; // Tamaño de cada celda
const spacing = 11;
const pieceSize = cellSize - spacing;
 // Tamaño de cada celda
 canvas.width = 525;
canvas.height = 450;

const boardImg = new Image();
boardImg.src = './assets/images/board.png';

const player1Piece = new Image();
player1Piece.src = './assets/images/MarioCoin.png';

const player2Piece = new Image();
player2Piece.src = './assets/images/BowserCoin.png';

let board = Array(rows).fill().map(() => Array(cols).fill(null));
let currentPlayer = 1;
let timer = 60;

boardImg.onload = () => {
    drawBoard();
};

function drawBoard() {
    ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const piece = board[row][col];
            if (piece === 1) {
                ctx.drawImage(
                    player1Piece, 
                    col * cellSize + spacing / 2, 
                    row * cellSize + spacing / 2, 
                    pieceSize, 
                    pieceSize
                );
            } else if (piece === 2) {
                ctx.drawImage(
                    player2Piece, 
                    col * cellSize + spacing / 2, 
                    row * cellSize + spacing / 2, 
                    pieceSize, 
                    pieceSize
                );
            }
        }
    }
}


function drawHints() {
    ctx.clearRect(0, 0, canvas.width, 50); // Borra la fila superior
    for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize + cellSize / 2, 20);
        ctx.lineTo(i * cellSize + cellSize / 2, 40);
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }
    requestAnimationFrame(drawHints); // Llama de nuevo para la animación
}
drawHints();


function togglePlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}


canvas.addEventListener('click', (event) => {
    const col = Math.floor(event.offsetX / cellSize);
    if (col < 0 || col >= cols) return;

    // Encuentra la fila más baja disponible en la columna seleccionada
    let row = rows - 1;
    while (row >= 0 && board[row][col] !== null) {
        row--;
    }

    if (row < 0) return; // La columna está llena

    // Ejecuta la animación y luego coloca la ficha en el tablero lógico
    animatePieceDrop(row, col, currentPlayer, () => {
        // Actualiza el tablero lógico después de que la animación termine
        board[row][col] = currentPlayer;

        // Verifica si el jugador actual ha ganado
        if (checkWin(row, col, currentPlayer)) {
            alert(`Jugador ${currentPlayer} ha ganado!`);
            resetGame();
            return;
        }

        // Cambia de jugador
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    });
});


function checkWin(row, col, player) {
    return checkDirection(row, col, player, 1, 0) ||  // Horizontal
           checkDirection(row, col, player, 0, 1) ||  // Vertical
           checkDirection(row, col, player, 1, 1) ||  // Diagonal descendente
           checkDirection(row, col, player, 1, -1);   // Diagonal ascendente
}

function checkDirection(row, col, player, rowDir, colDir) {
    let count = 0;

    // Verificar hacia atrás
    for (let i = -3; i <= 3; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }
    return false;
}





function animatePieceDrop(row, col, player, callback) {
    let y = 0;
    const pieceImage = player === 1 ? player1Piece : player2Piece;

    const interval = setInterval(() => {
        drawBoard(); // Redibuja el tablero en cada fotograma
        y += 10; // Ajusta la velocidad de la caída aquí si es necesario

        // Dibuja la ficha en su posición actual con el mismo tamaño y posición que en `drawBoard`
        ctx.drawImage(
            pieceImage, 
            col * cellSize + spacing / 2, 
            y + spacing / 2, 
            pieceSize, 
            pieceSize
        );

        // Si la ficha ha llegado a su posición final
        if (y >= row * cellSize) {
            clearInterval(interval);
            drawBoard(); // Redibuja el tablero final

            // Dibuja la ficha en su posición final solo después de la animación
            ctx.drawImage(
                pieceImage, 
                col * cellSize + spacing / 2, 
                row * cellSize + spacing / 2, 
                pieceSize, 
                pieceSize
            );

            if (callback) callback(); // Ejecuta el callback para continuar después de la animación
        }
    }, 30);
}


document.getElementById('restartButton').addEventListener('click', resetGame);

function resetGame() {
    board = Array(rows).fill().map(() => Array(cols).fill(null)); // Resetea el tablero
    currentPlayer = 1; // Vuelve a poner al jugador 1
    timer=60
    drawBoard(); // Dibuja el tablero vacío
}

function startTimer() {
    const timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').innerText = `Tiempo restante: ${timer}s`;
        if (timer <= 0) {
            alert("Tiempo agotado!");
            clearInterval(timerInterval);
            resetGame();
        }
    }, 1000);
}
startTimer();

document.getElementById('boardSize').addEventListener('change', (e) => {
    const selectedSize = parseInt(e.target.value);
    resetGame();
    inLineToWin = selectedSize;
});