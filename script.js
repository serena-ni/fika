const pet = document.getElementById('pet');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerEl = document.getElementById('timer');
const streakEl = document.getElementById('streak');

const addBtn = document.getElementById('addBtn');
const subBtn = document.getElementById('subBtn');

const infoBtn = document.getElementById('infoBtn');
const infoPopup = document.getElementById('infoPopup');
const closePopup = document.getElementById('closePopup');

const journalPopup = document.getElementById('journalPopup');
const journalInput = document.getElementById('journalInput');
const journalSave = document.getElementById('journalSave');
const journalClose = document.getElementById('journalClose');
const doodleCanvas = document.getElementById('doodleCanvas');

let timer = 120; // 2 min
let running = false;
let streak = 0;
let interval = null;

// canvas doodle setup
const ctx = doodleCanvas.getContext('2d');
let drawing = false;

function resizeCanvas() { doodleCanvas.width = doodleCanvas.offsetWidth; doodleCanvas.height = 120; ctx.lineWidth = 2; ctx.strokeStyle = '#6b3b6a'; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

doodleCanvas.addEventListener('mousedown', ()=>drawing=true);
doodleCanvas.addEventListener('mouseup', ()=>drawing=false);
doodleCanvas.addEventListener('mouseleave', ()=>drawing=false);
doodleCanvas.addEventListener('mousemove', e=>{
  if (!drawing) return;
  const rect = doodleCanvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});
// touch support
doodleCanvas.addEventListener('touchstart', e=>{drawing=true;e.preventDefault();});
doodleCanvas.addEventListener('touchend', ()=>drawing=false);
doodleCanvas.addEventListener('touchmove', e=>{
  if (!drawing) return;
  const rect = doodleCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});

// timer format
function formatTime(seconds){ const m=String(Math.floor(seconds/60)).padStart(2,'0'); const s=String(seconds%60).padStart(2,'0'); return `${m}:${s}`; }
function animateTimer(){ timerEl.classList.remove('animate'); void timerEl.offsetWidth; timerEl.classList.add('animate'); }

// timer functions
function startTimer(){
  if(running) return;
  running=true; timerEl.textContent=formatTime(timer);
  interval=setInterval(()=>{
    timer--; timerEl.textContent=formatTime(timer); animateTimer();
    if(timer<=0) finishSession();
  },1000);
}

function finishSession(){
  clearInterval(interval); running=false; streak++; streakEl.textContent=streak; timerEl.textContent="🎉 Done!"; petBounce(); showJournal();
}

function resetTimer(){ clearInterval(interval); running=false; timer=120; timerEl.textContent=formatTime(timer); }

function petBounce(){ pet.animate([{transform:'scale(1) rotate(0deg)'},{transform:'scale(1.3) rotate(15deg)'},{transform:'scale(1) rotate(0deg)'}],{duration:500,easing:'ease-out'});}
pet.addEventListener('click', ()=>{ if(running) petBounce(); showRandomFact(); });

// --- Timer adjust ---
addBtn.addEventListener('click', ()=>{ if(!running){ timer+=30;if(timer>3600) timer=3600; timerEl.textContent=formatTime(timer); animateTimer(); }});
subBtn.addEventListener('click', ()=>{ if(!running){ timer-=30;if(timer<10) timer=10; timerEl.textContent=formatTime(timer); animateTimer(); }});

// --- Start / Reset ---
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// --- Info popup ---
infoBtn.addEventListener('click', ()=>infoPopup.classList.add('show'));
closePopup.addEventListener('click', ()=>infoPopup.classList.remove('show'));

// --- Journal popup ---
function showJournal(){ journalInput.value=''; ctx.clearRect(0,0,doodleCanvas.width,doodleCanvas.height); journalPopup.classList.add('show'); }
function closeJournal(){ journalPopup.classList.remove('show'); }
journalSave.addEventListener('click', ()=>{
  const entry=journalInput.value.trim();
  if(entry){ console.log("Journal entry:", entry); }
  closeJournal();
});
journalClose.addEventListener('click', closeJournal);

// random fact on pet click
const facts=[
  "Seals can sleep underwater! 🦭",
  "Cats have whiskers to sense their surroundings! 🐱",
  "Bunnies can rotate their ears 180°! 🐰",
  "Your brain forms new connections daily! 🧠",
  "Micro-breaks boost focus by ~20%! 🌟",
  "Fish can recognize faces! 🐟"
];
function showRandomFact(){
  const fact=facts[Math.floor(Math.random()*facts.length)];
  const temp=document.createElement('div');
  temp.textContent=fact;
  temp.style.position='fixed'; temp.style.bottom='150px'; temp.style.left='50%'; temp.style.transform='translateX(-50%)';
  temp.style.background='var(--accent2)'; temp.style.color='#6b3b6a'; temp.style.padding='8px 12px'; temp.style.borderRadius='12px';
  temp.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; temp.style.opacity='0'; temp.style.transition='opacity 0.3s ease, transform 0.3s ease';
  document.body.appendChild(temp);
  requestAnimationFrame(()=>{ temp.style.opacity='1'; temp.style.transform='translateX(-50%) translateY(-10px)'; });
  setTimeout(()=>{ temp.style.opacity='0'; temp.style.transform='translateX(-50%) translateY(-20px)'; setTimeout(()=>temp.remove(),300); },2500);
}
