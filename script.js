const GAME_DURATION = 30;
const SPAWN_INTERVAL_MS = 650;
const ACTIVE_DURATION_MS = 900;
const STORAGE_KEY = "whack-a-mole-best-score";

const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const bestScoreElement = document.getElementById("best-score");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const holes = Array.from(document.querySelectorAll(".hole"));

let score = 0;
let timeLeft = GAME_DURATION;
let bestScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
let isRunning = false;
let spawnTimerId = null;
let countdownTimerId = null;
let activeHoleIndex = null;
let activeTimeoutId = null;

bestScoreElement.textContent = String(bestScore);
timeElement.textContent = String(GAME_DURATION);

function setMessage(text) {
  messageElement.textContent = text;
}

function updateScore(nextScore) {
  score = nextScore;
  scoreElement.textContent = String(score);
}

function updateTime(nextTime) {
  timeLeft = nextTime;
  timeElement.textContent = String(timeLeft);
}

function clearActiveHole() {
  if (activeHoleIndex === null) {
    return;
  }

  const activeHole = holes[activeHoleIndex];
  activeHole.classList.remove("up", "hit");
  activeHole.dataset.kind = "normal";
  activeHole.dataset.hit = "false";
  activeHoleIndex = null;

  if (activeTimeoutId) {
    window.clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }
}

function chooseNextHole() {
  const availableIndexes = holes
    .map((_, index) => index)
    .filter((index) => index !== activeHoleIndex);

  const nextIndex =
    availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

  const roll = Math.random();
  let kind = "normal";

  if (roll > 0.87) {
    kind = "bomb";
  } else if (roll > 0.65) {
    kind = "bonus";
  }

  clearActiveHole();

  const hole = holes[nextIndex];
  hole.dataset.kind = kind;
  hole.dataset.hit = "false";
  hole.classList.add("up");
  activeHoleIndex = nextIndex;

  activeTimeoutId = window.setTimeout(() => {
    clearActiveHole();
  }, ACTIVE_DURATION_MS);
}

function stopGame() {
  isRunning = false;
  startButton.disabled = false;

  if (spawnTimerId) {
    window.clearInterval(spawnTimerId);
    spawnTimerId = null;
  }

  if (countdownTimerId) {
    window.clearInterval(countdownTimerId);
    countdownTimerId = null;
  }

  clearActiveHole();

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(STORAGE_KEY, String(bestScore));
    bestScoreElement.textContent = String(bestScore);
    setMessage(`新記録です。${score}点を達成しました。`);
    return;
  }

  setMessage(`終了です。今回のスコアは ${score} 点でした。`);
}

function startGame() {
  if (isRunning) {
    return;
  }

  isRunning = true;
  startButton.disabled = true;
  updateScore(0);
  updateTime(GAME_DURATION);
  clearActiveHole();
  setMessage("もぐらをクリックして高得点を狙いましょう。");
  chooseNextHole();

  spawnTimerId = window.setInterval(() => {
    chooseNextHole();
  }, SPAWN_INTERVAL_MS);

  countdownTimerId = window.setInterval(() => {
    const nextTime = timeLeft - 1;
    updateTime(nextTime);

    if (nextTime <= 0) {
      stopGame();
    }
  }, 1000);
}

function handleHoleClick(event) {
  if (!isRunning) {
    return;
  }

  const hole = event.currentTarget;
  const index = Number(hole.dataset.index);

  if (index !== activeHoleIndex || hole.dataset.hit === "true") {
    return;
  }

  hole.dataset.hit = "true";
  hole.classList.add("hit");

  if (hole.dataset.kind === "bomb") {
    updateScore(Math.max(0, score - 3));
    setMessage("いたずら爆弾です。3点マイナス。");
  } else if (hole.dataset.kind === "bonus") {
    updateScore(score + 3);
    setMessage("金のもぐらです。3点プラス。");
  } else {
    updateScore(score + 1);
    setMessage("ナイスヒット。1点プラス。");
  }

  window.setTimeout(() => {
    clearActiveHole();
  }, 120);
}

holes.forEach((hole) => {
  hole.dataset.kind = "normal";
  hole.dataset.hit = "false";
  hole.addEventListener("click", handleHoleClick);
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  stopGame();
  startGame();
});
