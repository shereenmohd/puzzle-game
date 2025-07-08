const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const winMessage = document.getElementById("win-message");
const loseMessage = document.getElementById("lose-message");
const restartBtn = document.getElementById("restart-btn");
const restartBtnLose = document.getElementById("restart-btn-lose");
const gameContainer = document.getElementById("game-container");
const timerDisplay = document.getElementById("timer");

const COLORS = ["#bcd9a5", "#f9f885", "#fbbb84", "#edc7f3", "#d7fff7"];
const ROWS = 7;
const COLUMNS = 5;
const TOTAL_BLOCKS = ROWS * COLUMNS;
const GAME_DURATION = 60; // seconds

let selectedBlock = null;
let timer = null;
let timeLeft = GAME_DURATION;
let gameEnded = false;

// Start or restart the game
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
restartBtnLose.addEventListener("click", startGame);

function startGame() {
  // Reset game state
  gameEnded = false;
  timeLeft = GAME_DURATION;
  clearInterval(timer);

  timerDisplay.textContent = formatTime(timeLeft);
  timer = setInterval(updateTimer, 1000);

  winMessage.classList.add("hidden");
  loseMessage.classList.add("hidden");
  board.innerHTML = "";
  gameContainer.classList.remove("hidden");

  // Generate color blocks
  let colorPool = [];
  for (let i = 0; i < ROWS; i++) colorPool.push(...COLORS);
  colorPool = shuffle(colorPool);

  for (let i = 0; i < TOTAL_BLOCKS; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.backgroundColor = colorPool[i];
    block.dataset.index = i;

    block.addEventListener("click", () => handleBlockClick(block));
    board.appendChild(block);
  }
}

function handleBlockClick(block) {
  if (gameEnded) return;

  if (!selectedBlock) {
    selectedBlock = block;
    block.classList.add("selected");
  } else if (selectedBlock === block) {
    block.classList.remove("selected");
    selectedBlock = null;
  } else {
    swapColors(selectedBlock, block);
    selectedBlock.classList.remove("selected");
    selectedBlock = null;
    checkWinCondition();
  }
}

function swapColors(block1, block2) {
  const temp = block1.style.backgroundColor;
  block1.style.backgroundColor = block2.style.backgroundColor;
  block2.style.backgroundColor = temp;
}

function checkWinCondition() {
  const blocks = document.querySelectorAll(".block");

  for (let col = 0; col < COLUMNS; col++) {
    let columnColors = [];
    for (let row = 0; row < ROWS; row++) {
      const index = row * COLUMNS + col;
      columnColors.push(blocks[index].style.backgroundColor);
    }

    const firstColor = columnColors[0];
    if (!columnColors.every(color => color === firstColor)) {
      return;
    }
  }

  // All columns match
  endGame("win");
}

function updateTimer() {
  if (gameEnded) return;

  timeLeft--;
  timerDisplay.textContent = formatTime(timeLeft);

  if (timeLeft <= 0) {
    endGame("lose");
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(1, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `⏱ Time Left: ${mins}:${secs}`;
}

function endGame(result) {
  clearInterval(timer);
  gameEnded = true;

  if (result === "win") {
    winMessage.classList.remove("hidden");
  } else {
    loseMessage.classList.remove("hidden");
  }
}

// Utility: Shuffle array
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}