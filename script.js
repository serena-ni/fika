const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const addBtn = document.getElementById("addBtn");
const subBtn = document.getElementById("subBtn");
const streakEl = document.getElementById("streak");

const pet = document.getElementById("pet");
const catMessageEl = document.getElementById("catMessage");
const catTextEl = catMessageEl.querySelector(".cat-text");
const catCloseBtn = catMessageEl.querySelector(".cat-close");

/* timer */
let timer = 120;
let running = false;
let interval = null;
let streak = 0;

function format(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2,"0")}:${String(sec % 60).padStart(2,"0")}`;
}

timerEl.textContent = format(timer);

startBtn.onclick = () => {
  if (running) return;
  running = true;

  interval = setInterval(() => {
    timer--;
    timerEl.textContent = format(timer);
    if (timer <= 0) {
      clearInterval(interval);
      running = false;
      streak++;
      streakEl.textContent = streak;
      timer = 120;
    }
  }, 1000);
};

resetBtn.onclick = () => {
  clearInterval(interval);
  running = false;
  timer = 120;
  timerEl.textContent = format(timer);
};

addBtn.onclick = () => !running && (timer += 30, timerEl.textContent = format(timer));
subBtn.onclick = () => !running && (timer = Math.max(10, timer - 30), timerEl.textContent = format(timer));

/* cat messages */
const messages = [
  "you’re doing great",
  "tiny break 🌱",
  "nice work",
  "keep going",
  "proud of you"
];

let msgTimeout;

pet.onclick = () => {
  const side = Math.random() > 0.5 ? "left" : "right";
  catTextEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  catMessageEl.className = `cat-message ${side} show`;
  clearTimeout(msgTimeout);
  msgTimeout = setTimeout(() => catMessageEl.classList.remove("show"), 2000);
};

catCloseBtn.onclick = () => catMessageEl.classList.remove("show");

/* journal */
const journalPopup = document.getElementById("journalPopup");
document.getElementById("openJournalBtn").onclick = () => journalPopup.classList.add("show");
document.getElementById("journalClose").onclick = () => journalPopup.classList.remove("show");
document.getElementById("journalSave").onclick = () => journalPopup.classList.remove("show");

/* doodle */
const doodlePopup = document.getElementById("doodlePopup");
const canvas = document.getElementById("doodleCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;

document.getElementById("openDoodleBtn").onclick = () => {
  doodlePopup.classList.add("show");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

document.getElementById("closeDoodle").onclick = () => doodlePopup.classList.remove("show");
document.getElementById("clearDoodle").onclick = () => ctx.clearRect(0,0,canvas.width,canvas.height);

canvas.onmousedown = e => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

canvas.onmouseup = () => drawing = false;

canvas.onmousemove = e => {
  if (!drawing) return;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#6b3b6a";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};
