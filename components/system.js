let testButtonOn = false;
let timeId = null;

let currentDifficulty = 0;
let score = 0;

let levelText = document.getElementById("level");
let scoreText = document.getElementById("score");
let gameOverText = document.getElementById("game-over");
let isGameOver = false;

var alanBtnInstance = alanBtn({
  key: "4538cc6940931bd2b5eebd1b842bf46f2e956eca572e1d8b807a3e2338fdd0dc/stage",
  onCommand: function (commandData) {
    if (commandData.command === "go:back") {
      //call client code that will react on the received command
    }
    if (commandData.command === "Left") {
      gameScreen.onEventLeftArrow();
    }
    if (commandData.command === "Right") {
      gameScreen.onEventRightArrow();
    }
    if (commandData.command === "hardDrop") {
      gameScreen.onEventSpace();
    }
    if (commandData.command === "Rotate") {
      gameScreen.onEventUpArrow();
    }
    if (commandData.command === "Hold") {
      gameScreen.onEventShift();
    }
  },
  rootEl: document.getElementById("alan-btn"),
  });

// Define an array to store leaderboard data
let leaderboardData = [];

// Load leaderboard data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('leaderboardData');
  if (storedData) {
    leaderboardData = JSON.parse(storedData);
    updateLeaderboard();
  }
});

// Function to add a player's score to the leaderboard
function addToLeaderboard(name, score) {
  leaderboardData.push({ name, score });
  leaderboardData.sort((a, b) => b.score - a.score); // Sort data in descending order of score

  // Update the leaderboard HTML
  updateLeaderboard();

  // Store leaderboard data in localStorage
  localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

// Function to update the leaderboard HTML
function updateLeaderboard() {
  const leaderboardElement = document.getElementById('leaderboard');
  const tbody = leaderboardElement.querySelector('tbody');

  // Clear existing rows
  tbody.innerHTML = '';

  // Add new rows based on leaderboardData
  leaderboardData.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.name}</td>
      <td>${player.score}</td>
    `;
    tbody.appendChild(row);
  });
}

timeId = setInterval(
  () => gameScreen.flowGravity(),
  timePerLine * Math.pow(increaseSpeedPerDifficulty, currentDifficulty)
);

function levelUp() {
  currentDifficulty++;
  levelText.textContent = `${currentDifficulty}`;
}

function rewindTimer() {
  clearInterval(timeId);
  timeId = setInterval(
    () => gameScreen.flowGravityWithDraw(),
    timePerLine * Math.pow(increaseSpeedPerDifficulty, currentDifficulty)
  );
}

function addScore(removedLineCount) {
  if (removedLineCount > 0) {
    score += removedLineCount * removedLineCount;
    scoreText.textContent = `${score}`;
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(timeId);
  gameOverText.style.visibility = "visible";

  if (score == 0) {
    makeFailEasterEgg();
  }
}

function showNameInputDialog() {
  const name = prompt('Please enter your first initial:');
  if (name) {
    // Name entered, do something with it
    addToLeaderboard(name, score);
     // Assuming addToLeaderboard() is defined elsewhere
  } else {
    // No name entered or canceled, handle accordingly
  }
}


