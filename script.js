const pet = document.getElementById("pet");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const addBtn = document.getElementById("addBtn");
const subBtn = document.getElementById("subBtn");
const streakEl = document.getElementById("streak");

const catMessageEl = document.getElementById("catMessage");
const catTextEl = catMessageEl.querySelector(".cat-text");
const catCloseBtn = catMessageEl.querySelector(".cat-close");

let timer = 120;
let interval = null;
let running = false;
let streak = 0;
let messageTimeout = null;

const catMessages = [
  "you’re doing great 🐾",
  "tiny break, big brain",
  "hi there",
  "keep going 🌱",
  "nice work"
];

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

timerEl.textContent = formatTime(timer);

startBtn.onclick = () => {
  if (running) return;
  running = true;

  interval = setInterval(() => {
    timer--;
    timerEl.textContent = formatTime(timer);
    if (timer <= 0) finishSession();
  }, 1000);
};

function finishSession() {
  clearInterval(interval);
  running = false;
  streak++;
  streakEl.textContent = streak;
  timer = 120;
}

resetBtn.onclick = () => {
  clearInterval(interval);
  running = false;
  timer = 120;
  timerEl.textContent = formatTime(timer);
};

addBtn.onclick = () => {
  if (!running) {
    timer += 30;
    timerEl.textContent = formatTime(timer);
  }
};

subBtn.onclick = () => {
  if (!running) {
    timer = Math.max(10, timer - 30);
    timerEl.textContent = formatTime(timer);
  }
};

function showCatMessage() {
  const msg = catMessages[Math.floor(Math.random() * catMessages.length)];
  const side = Math.random() > 0.5 ? "left" : "right";

  catTextEl.textContent = msg;
  catMessageEl.className = `cat-message ${side} show`;

  clearTimeout(messageTimeout);
  messageTimeout = setTimeout(hideCatMessage, 2200);
}

function hideCatMessage() {
  catMessageEl.classList.remove("show");
}

pet.onclick = showCatMessage;
catCloseBtn.onclick = hideCatMessage;
