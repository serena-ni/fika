// elements
const pet = document.getElementById("pet");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const addBtn = document.getElementById("addBtn");
const subBtn = document.getElementById("subBtn");
const streakEl = document.getElementById("streak");

const infoBtn = document.getElementById("infoBtn");
const infoPopup = document.getElementById("infoPopup");
const closePopup = document.getElementById("closePopup");

const journalPopup = document.getElementById("journalPopup");
const journalInput = document.getElementById("journalInput");
const journalSave = document.getElementById("journalSave");
const journalClose = document.getElementById("journalClose");

const doodlePopup = document.getElementById("doodlePopup");
const doodleCanvas = document.getElementById("doodleCanvas");
const clearDoodle = document.getElementById("clearDoodle");
const closeDoodle = document.getElementById("closeDoodle");

// timer
let timer = 120;
let interval = null;
let running = false;
let streak = 0;

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

timerEl.textContent = formatTime(timer);

// dynamic milestones
function getMilestones() {
  const milestones = [];
  for (let i = 1; i <= timer; i++) {
    if (i % 60 === 0 || i <= 5) milestones.push(i);
  }
  return milestones;
}

function animateTimer() {
  timerEl.classList.remove("animate");
  void timerEl.offsetWidth;
  timerEl.classList.add("animate");
}

// timer functions
function startTimer() {
  if (running) return;
  running = true;

  // immediate timer update
  timerEl.textContent = formatTime(timer);
  if (getMilestones().includes(timer)) animateTimer();

  interval = setInterval(() => {
    timer--;
    timerEl.textContent = formatTime(timer);

    if (getMilestones().includes(timer)) animateTimer();

    if (timer <= 0) finishSession();
  }, 1000);
}

function finishSession() {
  clearInterval(interval);
  running = false;
  streak++;
  streakEl.textContent = streak;
  timerEl.textContent = "🎉 Done!";
  petBounce();
}

function resetTimer() {
  clearInterval(interval);
  running = false;
  timer = 120;
  timerEl.textContent = formatTime(timer);
}

// timer adjustment
addBtn.addEventListener("click", () => {
  if (!running) {
    timer += 30;
    timerEl.textContent = formatTime(timer);
    if (getMilestones().includes(timer)) animateTimer();
  }
});

subBtn.addEventListener("click", () => {
  if (!running) {
    timer = Math.max(10, timer - 30);
    timerEl.textContent = formatTime(timer);
    if (getMilestones().includes(timer)) animateTimer();
  }
});

// pet animation & facts
function petBounce() {
  pet.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.3) rotate(10deg)" },
      { transform: "scale(1)" }
    ],
    { duration: 500, easing: "ease-out" }
  );
}

// random facts
const facts = [
  "Seals can sleep underwater! 🦭",
  "Cats have whiskers to sense their surroundings! 🐱",
  "Bunnies can rotate their ears 180°! 🐰",
  "Your brain forms new connections daily! 🧠",
  "Micro-breaks boost focus by ~20%! 🌟",
  "Fish can recognize faces! 🐟"
];


//notifications
function showNotification(msg) {
  const container = document.createElement("div");
  container.className = "notification";

  const text = document.createElement("span");
  text.textContent = msg;
  container.appendChild(text);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.className = "notification-close";
  closeBtn.addEventListener("click", () => container.remove());
  container.appendChild(closeBtn);

  document.body.appendChild(container);

  // slide in from right
  requestAnimationFrame(() => {
    container.style.transform = "translateX(0)";
    container.style.opacity = "1";
  });

  // remove after 3 seconds
  setTimeout(() => {
    container.style.opacity = "0";
    container.style.transform = "translateX(20px)";
    setTimeout(() => container.remove(), 300);
  }, 3000);
}

// click pet
pet.addEventListener("click", () => {
  petBounce();
  const fact = facts[Math.floor(Math.random() * facts.length)];
  showNotification(fact);
});

// info pop-up
infoBtn.addEventListener("click", () => infoPopup.classList.toggle("show"));
closePopup.addEventListener("click", () => infoPopup.classList.remove("show"));

// journal pop-up
document.getElementById("openJournalBtn").addEventListener("click", () => {
  journalInput.value = "";
  journalPopup.classList.add("show");
});
journalClose.addEventListener("click", () => journalPopup.classList.remove("show"));
journalSave.addEventListener("click", () => {
  const entry = journalInput.value.trim();
  if (entry) console.log("Journal entry:", entry);
  journalPopup.classList.remove("show");
});

// doodle pop-up
let ctx = doodleCanvas.getContext("2d");
let drawing = false;

function resizeCanvas() {
  doodleCanvas.width = doodleCanvas.offsetWidth;
  doodleCanvas.height = 150;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.getElementById("openDoodleBtn").addEventListener("click", () => {
  doodlePopup.classList.add("show");
  resizeCanvas();
});

closeDoodle.addEventListener("click", () => doodlePopup.classList.remove("show"));
clearDoodle.addEventListener("click", () => ctx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height));

doodleCanvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
});
doodleCanvas.addEventListener("mouseup", () => (drawing = false));
doodleCanvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const rect = doodleCanvas.getBoundingClientRect();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#6b3b6a";
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

// start/reset/add/sub
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
