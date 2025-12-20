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

const openJournalBtn = document.getElementById("openJournalBtn");
const openDoodleBtn = document.getElementById("openDoodleBtn");

// timer vars
let timer = 120; // 2 minutes default
let interval = null;
let running = false;
let streak = 0;

// format time
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
timerEl.textContent = formatTime(timer);

// animate timer (milestones)
function animateTimer() {
  timerEl.classList.remove("animate");
  void timerEl.offsetWidth;
  timerEl.classList.add("animate");
}

// start timer
startBtn.addEventListener("click", () => {
  if (running) return;
  running = true;

  interval = setInterval(() => {
    timer--;

    timerEl.textContent = formatTime(timer);

    // milestone seconds: full minutes or last 5 seconds
    if (timer % 60 === 0 || (timer <= 5 && timer > 0)) animateTimer();

    if (timer <= 0) finishSession();
  }, 1000); // 1 second
});

// finish session
function finishSession() {
  clearInterval(interval);
  running = false;
  streak++;
  streakEl.textContent = streak;
  timerEl.textContent = "🎉 Done!";
  petBounce();
  showRandomFact();
}

// reset timer
resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  running = false;
  timer = 120;
  timerEl.textContent = formatTime(timer);
});

// adjust timer
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
pet.addEventListener("click", () => {
  petBounce();
  showRandomFact();
});

// info popup
infoBtn.addEventListener("click", () => infoPopup.classList.toggle("show"));
closePopup.addEventListener("click", () => infoPopup.classList.remove("show"));

// journal popup
openJournalBtn.addEventListener("click", () => {
  journalInput.value = "";
  journalPopup.classList.add("show");
});
journalClose.addEventListener("click", () => journalPopup.classList.remove("show"));
journalSave.addEventListener("click", () => {
  const entry = journalInput.value.trim();
  if (entry) console.log("Journal entry:", entry);
  journalPopup.classList.remove("show");
});

// doodle popup
let ctx = doodleCanvas.getContext("2d");
let drawing = false;

function resizeCanvas() {
  doodleCanvas.width = doodleCanvas.offsetWidth;
  doodleCanvas.height = 150;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#6b3b6a";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

openDoodleBtn.addEventListener("click", () => {
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
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

// random facts
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
  el.className = "notification";
  el.innerHTML = `<span>${fact}</span><button class="closeNotif">✕</button>`;
  document.body.appendChild(el);

  // position: right side
  el.style.right = "20px";
  el.style.top = `${20 + Math.random() * 100}px`;

  // slide in animation
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(0)";
  });

  // close button
  el.querySelector(".closeNotif").addEventListener("click", () => {
    el.remove();
  });

  // auto remove after 3s
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(100%)";
    setTimeout(() => el.remove(), 300);
  }, 3000);
}
