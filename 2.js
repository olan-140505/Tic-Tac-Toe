const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

// Inisialisasi
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

// Kombinasi kemenangan
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Render board
function renderBoard() {
  board.innerHTML = "";
  gameBoard.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    if (cell) cellElement.classList.add("taken");
    cellElement.textContent = cell;
    cellElement.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cellElement);
  });
}

// Cek kemenangan
function checkWin() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return gameBoard[a];
    }
  }
  return gameBoard.includes("") ? null : "Tie";
}

// Klik sel
function handleCellClick(index) {
  if (!gameActive || gameBoard[index]) return;
  gameBoard[index] = currentPlayer;
  renderBoard();

  const result = checkWin();
  if (result) {
    gameActive = false;
    statusText.textContent = result === "Tie" ? "It's a tie!" : `${result} wins!`;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = currentPlayer === "X" ? "Your turn!" : "AI's turn!";
  if (currentPlayer === "O") setTimeout(aiMove, 500);
}

// AI logika dengan algoritma Minimax
function aiMove() {
  const bestMove = minimax(gameBoard, "O");
  gameBoard[bestMove.index] = "O";
  renderBoard();

  const result = checkWin();
  if (result) {
    gameActive = false;
    statusText.textContent = result === "Tie" ? "It's a tie!" : `${result} wins!`;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = "Your turn!";
}

// Algoritma Minimax
function minimax(board, player) {
  const availableCells = board.map((cell, index) => (cell === "" ? index : null)).filter((index) => index !== null);

  // Cek jika ada kemenangan atau permainan selesai
  const winner = checkWin();
  if (winner === "X") return { score: -10 };
  if (winner === "O") return { score: 10 };
  if (availableCells.length === 0) return { score: 0 };

  // Simpan skor untuk setiap langkah
  const moves = [];

  availableCells.forEach((index) => {
    const move = { index };
    board[index] = player;

    if (player === "O") {
      const result = minimax(board, "X");
      move.score = result.score;
    } else {
      const result = minimax(board, "O");
      move.score = result.score;
    }

    board[index] = ""; // Undo langkah
    moves.push(move);
  });

  // Pilih langkah terbaik
  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    moves.forEach((move) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((move) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}

// Reset game
resetButton.addEventListener("click", () => {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Your turn!";
  renderBoard();
});

// Render awal
renderBoard();
