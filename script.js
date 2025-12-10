const pet = document.getElementById('pet');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerEl = document.getElementById('timer');
const streakEl = document.getElementById('streak');

let timer = 120; // 2 minutes
let running = false;
let streak = 0;
let interval = null;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  if (running) return;
  running = true;
  timer = 120;
  timerEl.textContent = formatTime(timer);

  interval = setInterval(() => {
    timer--;
    timerEl.textContent = formatTime(timer);
    if (timer <= 0) finishSession();
  }, 1000);
}

function finishSession() {
  clearInterval(interval);
  running = false;
  streak++;
  streakEl.textContent = streak;
  timerEl.textContent = "🎉 Done!";
  petAnimate();
}

function resetTimer() {
  clearInterval(interval);
  running = false;
  timer = 120;
  timerEl.textContent = formatTime(timer);
}

function petAnimate() {
  pet.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
    { duration: 500 }
  );
}

pet.addEventListener('click', () => {
  if (running) petAnimate();
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
