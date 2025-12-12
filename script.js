/* elements */
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

/* timer */
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

function animateTimer() {
  timerEl.classList.remove("animate");
  void timerEl.offsetWidth;
  timerEl.classList.add("animate");
}

startBtn.addEventListener("click", () => {
  if (running) return;
  running = true;

  interval = setInterval(() => {
    timer--;
    timerEl.textContent = formatTime(timer);
    animateTimer();

    if (timer <= 0) finishSession();
  }, 1000);
});

function finishSession() {
  running = false;
  clearInterval(interval);
  streak++;
  streakEl.textContent = streak;
  timerEl.textContent = "🎉 Done!";
  petBounce();
}

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  running = false;
  timer = 120;
  timerEl.textContent = formatTime(timer);
});

addBtn.addEventListener("click", () => {
  if (!running) {
    timer += 30;
    timerEl.textContent = formatTime(timer);
    animateTimer();
  }
});

subBtn.addEventListener("click", () => {
  if (!running) {
    timer = Math.max(10, timer - 30);
    timerEl.textContent = formatTime(timer);
    animateTimer();
  }
});

/* PET */
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

pet.addEventListener("click", () => {
  petBounce();
  showRandomFact();
});

/* info popup */
infoBtn.addEventListener("click", () => {
  infoPopup.classList.toggle("show");
});
closePopup.addEventListener("click", () => {
  infoPopup.classList.remove("show");
});

/* journal popup */
document.getElementById("openJournalBtn").addEventListener("click", () => {
  journalInput.value = "";
  journalPopup.classList.add("show");
});
journalClose.addEventListener("click", () => journalPopup.classList.remove("show"));
journalSave.addEventListener("click", () => {
  let entry = journalInput.value.trim();
  if (entry) console.log("Journal entry:", entry);
  journalPopup.classList.remove("show");
});

/* doodle */
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

/* RANDOM FACT */
const facts = [
  "Seals can sleep underwater! 🦭",
  "Cats have whiskers to sense their surroundings! 🐱",
  "Bunnies can rotate their ears 180°! 🐰",
  "Your brain forms new connections daily! 🧠",
  "Micro-breaks boost focus by ~20%! 🌟",
  "Fish can recognize faces! 🐟"
];

function showRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  const el = document.createElement("div");
  el.textContent = fact;

  el.style.position = "fixed";
  el.style.bottom = "150px";
  el.style.left = "50%";
  el.style.transform = "translateX(-50%)";
  el.style.background = "var(--accent2)";
  el.style.color = "#6b3b6a";
  el.style.padding = "8px 12px";
  el.style.borderRadius = "12px";
  el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  el.style.opacity = "0";
  el.style.transition = "all 0.3s ease";

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(-10px)";
  });

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => el.remove(), 300);
  }, 2500);
}
