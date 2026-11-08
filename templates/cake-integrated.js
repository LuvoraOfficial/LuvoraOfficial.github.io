(() => {
const cakeSection = document.getElementById('cakePageSection');
if (!cakeSection) return;

const cake = cakeSection.querySelector('#cake');
const candles = [...cakeSection.querySelectorAll('.candle')];
const hint = cakeSection.querySelector('#tapHint');
const reveal = cakeSection.querySelector('#reveal');
const continueButton = cakeSection.querySelector('#continueButton');
const confettiLayer = cakeSection.querySelector('#confettiLayer');
const nameNode = cakeSection.querySelector('#cakeBirthdayName');

if (!cake || !candles.length || !reveal || !continueButton || !nameNode) return;

// =====================================================
// PERSONALIZATION
// =====================================================
const params = new URLSearchParams(location.search);

let customName =
  document.getElementById("customerName")?.value.trim() ||
  params.get("name")?.trim() ||
  "";

try {
  const savedData = JSON.parse(
    sessionStorage.getItem("luvoraCakeReturnData") || "null"
  );

  customName =
    customName ||
    savedData?.lovedOneName?.trim() ||
    "";
} catch (error) {
  console.warn("LUVORA: Could not read saved birthday name.", error);
}

if (customName && nameNode) {
  nameNode.textContent = customName.slice(0, 32);
}

// =====================================================
// AUDIO ENGINE
// =====================================================

let audioContext;

function getAudio() {
try {
audioContext ||= new (
window.AudioContext || window.webkitAudioContext
)();


  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
} catch (_) {
  return null;
}


}

function tone(
frequency,
duration,
type = 'sine',
volume = 0.045,
delay = 0
) {
const ctx = getAudio();
if (!ctx) return;


try {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(
    frequency,
    ctx.currentTime + delay
  );

  gain.gain.setValueAtTime(
    volume,
    ctx.currentTime + delay
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + delay + duration
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration);

} catch (_) {}


}

function sparkleSound() {
[660, 880, 1108, 1320, 1760].forEach((frequency, index) => {
tone(frequency, 0.7, 'sine', 0.035, index * 0.12);
});
}

function magicalBlastSound() {
tone(110, 0.9, 'sine', 0.11);
tone(165, 0.8, 'triangle', 0.075, 0.08);
tone(440, 0.65, 'sine', 0.045, 0.15);
tone(880, 0.9, 'sine', 0.035, 0.3);
tone(1320, 1.1, 'sine', 0.025, 0.55);
}

function finalChime() {
[1046, 1318, 1568, 2093].forEach((frequency, index) => {
tone(frequency, 1.1, 'sine', 0.035, index * 0.16);
});
}

// =====================================================
// LUVORA — HAPPY BIRTHDAY CELEBRATION AUDIO
// =====================================================

let birthdayTuneTimer = null;
let birthdayTuneNodes = [];
let firecrackerTimer = null;
let firecrackerAudio = null;

let backgroundMusic = null;
let previousMusicVolume = null;


// Happy Birthday melody — G major
const birthdayMelody = [
  [587.33, 0.45], [587.33, 0.25],
  [659.25, 0.70], [587.33, 0.70],
  [783.99, 0.70], [739.99, 1.10],

  [587.33, 0.45], [587.33, 0.25],
  [659.25, 0.70], [587.33, 0.70],
  [880.00, 0.70], [783.99, 1.10],

  [587.33, 0.45], [587.33, 0.25],
  [1174.66, 0.70], [987.77, 0.70],
  [783.99, 0.70], [739.99, 0.70],
  [659.25, 1.10],

  [1046.50, 0.45], [1046.50, 0.25],
  [987.77, 0.70], [783.99, 0.70],
  [880.00, 0.70], [783.99, 1.30]
];


// Play one complete magical Happy Birthday melody
function playBirthdayMelodyPhrase() {
  const ctx = getAudio();
  if (!ctx) return;

  let startAt = ctx.currentTime + 0.05;

  birthdayMelody.forEach(([frequency, duration]) => {

    // Magical layered sound
    const layers = [
      { ratio: 1, type: "triangle", volume: 0.050 },
      { ratio: 2, type: "sine", volume: 0.020 },
      { ratio: 3, type: "sine", volume: 0.008 },
      { ratio: 1.003, type: "sine", volume: 0.012 }
    ];

    layers.forEach(layer => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = layer.type;

      oscillator.frequency.setValueAtTime(
        frequency * layer.ratio,
        startAt
      );

      // Smooth magical attack
      gain.gain.setValueAtTime(0.001, startAt);

      gain.gain.linearRampToValueAtTime(
        layer.volume,
        startAt + 0.045
      );

      // Gentle musical decay
      gain.gain.exponentialRampToValueAtTime(
        layer.volume * 0.55,
        startAt + duration * 0.45
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        startAt + duration
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.03);

      birthdayTuneNodes.push(oscillator);

      oscillator.onended = () => {
        birthdayTuneNodes = birthdayTuneNodes.filter(
          node => node !== oscillator
        );
      };
    });

    startAt += duration;
  });

  const phraseDuration = birthdayMelody.reduce(
    (total, note) => total + note[1],
    0
  );

  birthdayTuneTimer = setTimeout(
    playBirthdayMelodyPhrase,
    phraseDuration * 1000
  );
}

// Start all celebration sounds
function startCakeCelebrationAudio() {

  // Lower existing background music
  backgroundMusic = document.getElementById(
    "luvoraBirthdayMusic"
  );

  if (backgroundMusic) {
    previousMusicVolume = backgroundMusic.volume;
    backgroundMusic.volume = 0.035;
  }

  // Start Happy Birthday melody
  playBirthdayMelodyPhrase();

  // Start firecracker sound
  firecrackerAudio = new Audio(
    "assets/musics/firework.mp3"
  );

  firecrackerAudio.loop = false;
  firecrackerAudio.volume = 0.65;

  firecrackerAudio.play().catch(error => {
    console.warn("LUVORA: Firecracker audio could not play.", error);
  });

  // Firecracker stops after 10 seconds
  firecrackerTimer = setTimeout(() => {
    if (firecrackerAudio) {
      firecrackerAudio.pause();
      firecrackerAudio.currentTime = 0;
    }
  }, 10000);
}


// Stop celebration sounds and restore background music
function stopCakeCelebrationAudio() {

  clearTimeout(birthdayTuneTimer);
  clearTimeout(firecrackerTimer);

  birthdayTuneNodes.forEach(node => {
    try {
      node.stop();
    } catch (_) {}
  });

  birthdayTuneNodes = [];

  if (firecrackerAudio) {
    firecrackerAudio.pause();
    firecrackerAudio.currentTime = 0;
    firecrackerAudio = null;
  }

  if (
    backgroundMusic &&
    previousMusicVolume !== null
  ) {
    backgroundMusic.volume = previousMusicVolume;
  }

  previousMusicVolume = null;
}

// =====================================================
// MAGICAL EFFECT STYLES
// =====================================================

const magicCSS = document.createElement('style');

magicCSS.textContent = `
/* FULL SCREEN MAGICAL ATMOSPHERE */


#luvoraMagicOverlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.6s ease;
}

#luvoraMagicOverlay.active {
  opacity: 1;
}

#luvoraMagicOverlay .magic-dim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at center,
      transparent 5%,
      rgba(8, 3, 24, 0.48) 100%
    );
  opacity: 0;
  transition: opacity 0.7s ease;
}

#luvoraMagicOverlay.active .magic-dim {
  opacity: 1;
}

/* MAGICAL FLASH */

.luvora-magic-flash {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  background:
    radial-gradient(
      circle at center,
      rgba(255,255,255,0.95),
      rgba(255,215,150,0.45) 25%,
      transparent 72%
    );
  opacity: 0;
  animation: luvora-flash 1.1s ease-out forwards;
}

@keyframes luvora-flash {
  0% { opacity: 0; }
  12% { opacity: 0.9; }
  35% { opacity: 0.45; }
  100% { opacity: 0; }
}

/* SHOCKWAVES */

.luvora-shockwave {
  position: fixed;
  width: 25px;
  height: 25px;
  border: 2px solid rgba(255, 224, 158, 0.95);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.1);
  box-shadow:
    0 0 15px #ffd88a,
    inset 0 0 12px #fff;
  pointer-events: none;
  animation: luvora-shockwave 1.5s cubic-bezier(.1,.65,.25,1) forwards;
}

@keyframes luvora-shockwave {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(19);
  }
}

/* GOLDEN PARTICLES */

.luvora-magic-particle {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10001;
  pointer-events: none;
  color: var(--particle-color, #ffe4a3);
  font-size: var(--particle-size, 15px);
  text-shadow:
    0 0 5px currentColor,
    0 0 14px currentColor,
    0 0 25px currentColor;
  animation: luvora-particle-flight var(--particle-time, 1.8s)
    cubic-bezier(.12,.65,.25,1) forwards;
  will-change: transform, opacity;
}

@keyframes luvora-particle-flight {
  0% {
    opacity: 0;
    transform: translate(0,0) scale(.2) rotate(0deg);
  }
  12% {
    opacity: 1;
    transform: translate(
      calc(var(--particle-x) * .15),
      calc(var(--particle-y) * .15)
    ) scale(1.25) rotate(80deg);
  }
  100% {
    opacity: 0;
    transform: translate(
      var(--particle-x),
      var(--particle-y)
    ) scale(.1) rotate(var(--particle-rotation));
  }
}

/* FIREWORKS */

.luvora-firework {
  position: fixed;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10002;
}

.luvora-firework-piece {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--firework-color);
  box-shadow: 0 0 9px var(--firework-color);
  animation: luvora-firework-piece 1.2s ease-out forwards;
}

@keyframes luvora-firework-piece {
  0% {
    opacity: 1;
    transform: translate(0,0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(
      var(--firework-x),
      var(--firework-y)
    ) scale(.15);
  }
}

/* GOLDEN RAIN */

.luvora-golden-rain {
  position: fixed;
  top: -25px;
  z-index: 10003;
  pointer-events: none;
  color: var(--rain-color);
  font-size: var(--rain-size);
  text-shadow: 0 0 12px currentColor;
  animation: luvora-rain-fall var(--rain-duration) linear forwards;
}

@keyframes luvora-rain-fall {
  0% {
    opacity: 0;
    transform: translate3d(0,0,0) rotate(0deg);
  }
  10% { opacity: 1; }
  90% { opacity: .9; }
  100% {
    opacity: 0;
    transform: translate3d(var(--rain-drift),110vh,0)
      rotate(650deg);
  }
}

/* CAKE GLOW */

#cake.magical {
  animation: luvora-cake-glow 2.5s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 16px rgba(255,213,145,.7));
}

@keyframes luvora-cake-glow {
  from {
    filter:
      drop-shadow(0 0 12px rgba(255,204,130,.45))
      brightness(1);
  }
  to {
    filter:
      drop-shadow(0 0 34px rgba(255,216,145,.95))
      brightness(1.15);
  }
}

/* REVEAL ENTRANCE */

#reveal.show {
  animation: luvora-grand-reveal 1.5s cubic-bezier(.16,1,.3,1) both;
}

@keyframes luvora-grand-reveal {
  0% {
    opacity: 0;
    transform: translateY(35px) scale(.65);
    filter: blur(12px);
  }
  65% {
    opacity: 1;
    transform: translateY(-5px) scale(1.06);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

#cakeBirthdayName {
  text-shadow:
    0 0 8px #fff,
    0 0 18px #ffd98d,
    0 0 35px #ffb9d5;
}

/* MOBILE PERFORMANCE */

@media (max-width: 600px) {
  .luvora-magic-particle {
    font-size: calc(var(--particle-size, 15px) * .8);
  }

  .luvora-firework-piece {
    width: 3px;
    height: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .luvora-golden-rain,
  .luvora-magic-particle {
    animation-duration: 2s;
  }
}


`;

document.head.appendChild(magicCSS);

// =====================================================
// MAGIC OVERLAY
// =====================================================

const magicOverlay = document.createElement('div');

magicOverlay.id = 'luvoraMagicOverlay';

magicOverlay.innerHTML = `     <div class="magic-dim"></div>
  `;

document.body.appendChild(magicOverlay);

// =====================================================
// EFFECT HELPERS
// =====================================================

function getCakeCenter() {
const rect = cake.getBoundingClientRect();


return {
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2
};


}

function createFlash() {
const flash = document.createElement('div');


flash.className = 'luvora-magic-flash';

document.body.appendChild(flash);

setTimeout(() => flash.remove(), 1200);


}

function createShockwaves() {
const center = getCakeCenter();


[0, 180, 380].forEach((delay, index) => {
  setTimeout(() => {
    const ring = document.createElement('div');

    ring.className = 'luvora-shockwave';

    ring.style.left = `${center.x}px`;
    ring.style.top = `${center.y}px`;

    document.body.appendChild(ring);

    setTimeout(() => ring.remove(), 1700);

  }, delay);
});


}

function createParticleBurst(count = 110) {
const center = getCakeCenter();


const symbols = ['✦', '✧', '✺', '•', '♥', '✴'];

const colors = [
  '#fff1bd',
  '#ffd27f',
  '#ffb8d2',
  '#ffffff',
  '#d9b5ff',
  '#ffe8a6'
];

for (let i = 0; i < count; i++) {
  const particle = document.createElement('span');

  particle.className = 'luvora-magic-particle';

  particle.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  const angle = Math.random() * Math.PI * 2;

  const distance =
    100 + Math.random() * Math.min(window.innerWidth * .65, 420);

  particle.style.left = `${center.x}px`;
  particle.style.top = `${center.y}px`;

  particle.style.setProperty(
    '--particle-x',
    `${Math.cos(angle) * distance}px`
  );

  particle.style.setProperty(
    '--particle-y',
    `${Math.sin(angle) * distance}px`
  );

  particle.style.setProperty(
    '--particle-rotation',
    `${Math.random() * 900 - 450}deg`
  );

  particle.style.setProperty(
    '--particle-color',
    colors[Math.floor(Math.random() * colors.length)]
  );

  particle.style.setProperty(
    '--particle-size',
    `${10 + Math.random() * 17}px`
  );

  particle.style.setProperty(
    '--particle-time',
    `${1.4 + Math.random() * 1.2}s`
  );

  document.body.appendChild(particle);

  setTimeout(() => particle.remove(), 3000);
}

}

function createFirework(x, y, color, count = 38) {
const firework = document.createElement('div');


firework.className = 'luvora-firework';

firework.style.left = `${x}px`;
firework.style.top = `${y}px`;

document.body.appendChild(firework);

for (let i = 0; i < count; i++) {
  const piece = document.createElement('span');

  piece.className = 'luvora-firework-piece';

  const angle = (Math.PI * 2 * i) / count;
  const distance = 45 + Math.random() * 75;

  piece.style.setProperty('--firework-color', color);

  piece.style.setProperty(
    '--firework-x',
    `${Math.cos(angle) * distance}px`
  );

  piece.style.setProperty(
    '--firework-y',
    `${Math.sin(angle) * distance}px`
  );

  firework.appendChild(piece);
}

setTimeout(() => firework.remove(), 1500);


}

function launchFireworks() {
const positions = [
{ x: .19, y: .25, color: '#ffd782' },
{ x: .79, y: .22, color: '#ffb7d5' },
{ x: .5, y: .14, color: '#e4c2ff' },
{ x: .28, y: .43, color: '#fff1b0' },
{ x: .72, y: .40, color: '#ffb5bd' }
];


positions.forEach((position, index) => {
  setTimeout(() => {
    createFirework(
      window.innerWidth * position.x,
      window.innerHeight * position.y,
      position.color,
      38
    );

    tone(700 + index * 130, .3, 'triangle', .025);

  }, index * 430);
});


}

function createGoldenRain() {
const symbols = ['✦', '✧', '♥', '•', '✨'];


const colors = [
  '#ffe6a1',
  '#ffd0e3',
  '#ffffff',
  '#e7c8ff'
];

for (let i = 0; i < 65; i++) {
  setTimeout(() => {
    const piece = document.createElement('span');

    piece.className = 'luvora-golden-rain';

    piece.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    piece.style.left = `${Math.random() * 100}vw`;

    piece.style.setProperty(
      '--rain-color',
      colors[Math.floor(Math.random() * colors.length)]
    );

    piece.style.setProperty(
      '--rain-size',
      `${10 + Math.random() * 17}px`
    );

    piece.style.setProperty(
      '--rain-duration',
      `${3 + Math.random() * 3}s`
    );

    piece.style.setProperty(
      '--rain-drift',
      `${Math.random() * 180 - 90}px`
    );

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 6500);

  }, i * 65);
}


}

function makeConfetti() {
if (!confettiLayer) return;

const symbols = ['✦', '✧', '•', '♥', '✨'];

for (let i = 0; i < 65; i++) {
  const piece = document.createElement('span');

  piece.className = 'confetti-piece';

  piece.textContent = symbols[i % symbols.length];

  piece.style.setProperty(
    '--dx',
    `${(Math.random() - .5) * 700}px`
  );

  piece.style.setProperty(
    '--dy',
    `${-120 - Math.random() * 450}px`
  );

  piece.style.setProperty(
    '--rot',
    `${Math.random() * 720 - 360}deg`
  );

  piece.style.animationDelay =
    `${Math.random() * .55}s`;

  piece.style.fontSize =
    `${10 + Math.random() * 15}px`;

  confettiLayer.appendChild(piece);

  setTimeout(() => piece.remove(), 3000);
}


}

// =====================================================
// GRAND MAGICAL BIRTHDAY SEQUENCE
// =====================================================

let celebrationStarted = false;

function startMagicalCelebration() {
if (celebrationStarted) return;


celebrationStarted = true;
startCakeCelebrationAudio();

hint.style.opacity = '0';
hint.style.pointerEvents = 'none';

// Stage 1: suspense
magicOverlay.classList.add('active');

// Stage 2: grand blast
setTimeout(() => {
  createFlash();
  createShockwaves();
  createParticleBurst(125);
}, 550);

// Stage 3: fireworks
setTimeout(() => {
  launchFireworks();
}, 1000);

// Stage 4: golden rain
setTimeout(() => {
  createGoldenRain();
  makeConfetti();
}, 1750);

// Stage 5: glowing cake
setTimeout(() => {
  cake.classList.add('magical');
}, 1900);
// Stage 6: Complete clean birthday transition
setTimeout(() => {

  magicOverlay.classList.remove('active');

  // Remove all previous cake-related visuals and text together
  cake.classList.add('cake-exit');
  hint.classList.add('hide');

  cakeSection.querySelector('.intro')?.classList.add('intro-exit');
  cakeSection.querySelector('.footer-note')?.classList.add('intro-exit');

  // Get partner's entered name
  const partnerName =
    nameNode.textContent.trim() || 'Ananya';

  // Replace old reveal with new birthday wish
  reveal.innerHTML = `
    <div class="premium-wish">
      <span class="wish-small">A SPECIAL WISH FOR YOU</span>

      <h2>Happy Birthday</h2>

      <div class="wish-divider">
        <span></span> ♡ <span></span>
      </div>

      <div class="premium-partner-name">
        ${partnerName}
      </div>

      <p class="wish-message">
        May every moment of your life be filled with love and happiness.
      </p>
    </div>
  `;

// Keep Continue button inside the birthday reveal
reveal.appendChild(continueButton);
  reveal.classList.remove('show');

  setTimeout(() => {
   cakeSection.classList.add('luvora-single-screen');

reveal.classList.add('show');
finalChime();
  }, 950);

}, 2600);


// Stage 7: Premium Continue button
setTimeout(() => {

  continueButton.innerHTML = `
    <span>CONTINUE THE SURPRISE</span>
    <b>→</b>
  `;

  continueButton.classList.add('show');

}, 5700);
}

// =====================================================
// CAKE BUILD + INTRO TEXT REVEAL
// =====================================================

const cakeIntro = cakeSection.querySelector('.intro');
const lastCandle = cakeSection.querySelector('.candle-three');

function startCakeBuild() {

  // Listen for the final candle landing
  if (lastCandle && cakeIntro) {

    lastCandle.addEventListener('animationend', function (event) {

      // Actual CSS animation name is candle-drop
      if (
        event.target !== lastCandle ||
        event.animationName !== 'candle-drop'
      ) {
        return;
      }

      // Reveal heading and subtitle
      cakeIntro.classList.add('intro-ready');

    });

  }

  // Start cake construction
  cake.classList.add('build');
}

window.addEventListener('load', () => {
  setTimeout(startCakeBuild, 450);
}, { once: true });

// =====================================================
// CANDLE INTERACTIONS
// =====================================================

candles.forEach((candle, index) => {
candle.addEventListener('click', () => {
if (
candle.classList.contains('is-out') ||
celebrationStarted
) return;


  candle.classList.add('is-out');

  tone(520 + index * 110, .18, 'triangle', .035);

  if (
    candles.every(item =>
      item.classList.contains('is-out')
    )
  ) {
    startMagicalCelebration();
  }
});


});

// =========================================
// CONTINUE TO BIRTHDAY GIFT — ZOOM TRANSITION
// =========================================

continueButton.addEventListener("click", () => {
  tone(740, .35, "sine", .035);

  // Stop celebration audio and restore background music
  stopCakeCelebrationAudio();

  const giftBox = document.getElementById("giftExperience"); 

 if (!giftBox) {
    console.error("LUVORA: giftExperience section was not found.");
    return;
  }

  // Hide Cake immediately
  cakeSection.classList.add("birthday-flow-hidden");

  // Reveal Gift Experience with its zoom animation
  giftBox.classList.remove("birthday-flow-hidden");
  giftBox.classList.add("flow-unlocked");
});
})(); 