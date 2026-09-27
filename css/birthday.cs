/* =========================================================
   LUVORA — BIRTHDAY STORY
   BIRTHDAY PAGE MASTER STYLESHEET
   ========================================================= */


/* =========================================================
   01 — RESET & GLOBAL
   ========================================================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
  font-family: Georgia, "Times New Roman", serif;
  color: #fff;
  background:
    radial-gradient(circle at 50% 15%, rgba(170, 88, 130, 0.30), transparent 35%),
    linear-gradient(180deg, #160d1d 0%, #241126 45%, #120914 100%);
}

button,
a {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid rgba(255, 220, 235, 0.9);
  outline-offset: 5px;
}


/* =========================================================
   02 — BACKGROUND
   ========================================================= */

.birthday-background {
  position: fixed;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 151, 194, 0.08), transparent 25%),
    radial-gradient(circle at 80% 35%, rgba(160, 120, 255, 0.08), transparent 30%),
    linear-gradient(180deg, #180c20, #100811);
}

.background-glow {
  position: absolute;
  width: 35vw;
  height: 35vw;
  max-width: 500px;
  max-height: 500px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.25;
  animation: glowFloat 9s ease-in-out infinite alternate;
}

.glow-one {
  top: 5%;
  left: -10%;
  background: rgba(255, 126, 180, 0.45);
}

.glow-two {
  top: 40%;
  right: -12%;
  background: rgba(144, 112, 255, 0.35);
  animation-delay: -3s;
}

.glow-three {
  bottom: -10%;
  left: 35%;
  background: rgba(255, 190, 112, 0.22);
  animation-delay: -6s;
}

@keyframes glowFloat {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(20px, -25px, 0) scale(1.08);
  }
}


/* =========================================================
   03 — STARS
   ========================================================= */

.stars {
  position: absolute;
  inset: 0;
}

.stars span {
  position: absolute;
  color: rgba(255, 225, 239, 0.55);
  font-size: 14px;
  animation: starTwinkle 3s ease-in-out infinite;
}

.stars span:nth-child(1) {
  top: 12%;
  left: 12%;
}

.stars span:nth-child(2) {
  top: 20%;
  right: 17%;
  animation-delay: -1s;
}

.stars span:nth-child(3) {
  top: 43%;
  left: 7%;
  animation-delay: -2s;
}

.stars span:nth-child(4) {
  top: 52%;
  right: 9%;
  animation-delay: -0.5s;
}

.stars span:nth-child(5) {
  top: 70%;
  left: 18%;
  animation-delay: -1.5s;
}

.stars span:nth-child(6) {
  top: 76%;
  right: 20%;
  animation-delay: -2.5s;
}

.stars span:nth-child(7) {
  top: 90%;
  left: 50%;
  animation-delay: -1.2s;
}

@keyframes starTwinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.25);
  }
}


/* =========================================================
   04 — FLOATING HEARTS & CONFETTI
   ========================================================= */

.floating-hearts,
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: -30px;
  opacity: 0;
  animation: heartRise 6s linear forwards;
  font-size: 20px;
}

@keyframes heartRise {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.6) rotate(0deg);
  }

  15% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
    transform: translateY(-110vh) scale(1.2) rotate(25deg);
  }
}

.confetti-piece {
  position: absolute;
  top: -20px;
  width: 8px;
  height: 14px;
  animation: confettiFall 4s linear forwards;
}

@keyframes confettiFall {
  to {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}


/* =========================================================
   05 — GENERAL SECTION
   ========================================================= */

.birthday-story {
  position: relative;
  width: 100%;
}

.birthday-section {
  position: relative;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 120px 20px;
}

.section-heading {
  max-width: 720px;
  margin: 0 auto 70px;
  text-align: center;
}

.section-eyebrow,
.hero-eyebrow,
.final-eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  color: rgba(255, 210, 227, 0.72);
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
}

.section-heading h2 {
  color: #fff5fa;
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 400;
  line-height: 1.05;
}

.section-heading h2 span {
  display: inline-block;
  margin-left: 8px;
}

.section-heading p {
  max-width: 560px;
  margin: 22px auto 0;
  color: rgba(255, 235, 244, 0.68);
  font-family: Arial, sans-serif;
  font-size: 15px;
  line-height: 1.8;
}


/* =========================================================
   06 — HERO
   ========================================================= */

.birthday-hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 100px 24px;
  overflow: hidden;
  text-align: center;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 850px;
  animation: heroAppear 1.5s ease both;
}

@keyframes heroAppear {
  from {
    opacity: 0;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.birthday-name {
  color: #fff;
  font-size: clamp(65px, 13vw, 150px);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-shadow:
    0 0 30px rgba(255, 161, 203, 0.18),
    0 10px 40px rgba(0, 0, 0, 0.35);
}

.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}

.hero-divider span {
  width: 75px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 205, 225, 0.6)
  );
}

.hero-divider span:last-child {
  transform: rotate(180deg);
}

.hero-divider i {
  color: #ffb5d2;
  font-size: 20px;
  font-style: normal;
  animation: heartPulse 2s ease-in-out infinite;
}

@keyframes heartPulse {
  50% {
    transform: scale(1.25);
  }
}

.birthday-date {
  color: rgba(255, 220, 234, 0.65);
  font-family: Arial, sans-serif;
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-message {
  margin-top: 28px;
  color: rgba(255, 240, 247, 0.78);
  font-size: 18px;
  line-height: 1.8;
}

.hero-message em {
  color: #ffd0e3;
}

.start-surprise-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 22px;
  margin-top: 42px;
  padding: 16px 24px 16px 28px;
  border: 1px solid rgba(255, 220, 235, 0.25);
  border-radius: 100px;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 15px 50px rgba(0, 0, 0, 0.25);
  transition: 0.35s ease;
}

.start-surprise-button strong {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 190, 215, 0.18);
}

.start-surprise-button:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 220, 235, 0.5);
  box-shadow:
    0 15px 60px rgba(255, 126, 180, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.moon-decoration {
  position: absolute;
  width: 320px;
  height: 320px;
  right: 8%;
  top: 18%;
  border-radius: 50%;
  background: rgba(255, 220, 236, 0.025);
  box-shadow:
    0 0 100px rgba(255, 177, 208, 0.08),
    inset 20px 0 60px rgba(255, 255, 255, 0.03);
}

.floating-star {
  position: absolute;
  color: rgba(255, 216, 232, 0.55);
  animation: starFloat 5s ease-in-out infinite;
}

.star-one {
  top: 25%;
  left: 15%;
}

.star-two {
  top: 35%;
  right: 20%;
  animation-delay: -2s;
}

.star-three {
  bottom: 20%;
  left: 25%;
  animation-delay: -4s;
}

@keyframes starFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }

  50% {
    transform: translateY(-15px) rotate(15deg);
  }
}


/* =========================================================
   07 — BALLOONS
   ========================================================= */

.balloon-stage {
  position: relative;
  min-height: 560px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(12px, 4vw, 60px);
  padding: 40px 10px 80px;
}

.birthday-balloon {
  position: relative;
  width: clamp(100px, 12vw, 150px);
  height: clamp(130px, 16vw, 190px);
  border: 0;
  border-radius: 50% 50% 46% 46%;
  transform-origin: center bottom;
  box-shadow:
    inset -22px -25px 35px rgba(0, 0, 0, 0.18),
    inset 18px 12px 25px rgba(255, 255, 255, 0.18),
    0 25px 45px rgba(0, 0, 0, 0.25);
  animation: balloonFloat 4s ease-in-out infinite;
  transition: 0.5s ease;
}

.birthday-balloon::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 50%;
  width: 17px;
  height: 17px;
  transform: translateX(-50%) rotate(45deg);
  background: inherit;
}

.balloon-pink {
  background: linear-gradient(145deg, #ffabc9, #cf4f83);
  animation-delay: -1s;
}

.balloon-purple {
  background: linear-gradient(145deg, #d0b1ff, #8050b4);
  animation-delay: -2.5s;
}

.balloon-gold {
  background: linear-gradient(145deg, #ffe4a7, #c8913b);
  animation-delay: -0.5s;
}

.balloon-blue {
  background: linear-gradient(145deg, #a9ddff, #5476b7);
  animation-delay: -3s;
}

.balloon-rose {
  background: linear-gradient(145deg, #ff9eae, #aa4260);
  animation-delay: -1.7s;
}

.balloon-shine {
  position: absolute;
  top: 18%;
  left: 20%;
  width: 23%;
  height: 32%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.38);
  filter: blur(1px);
  transform: rotate(25deg);
}

.balloon-string {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 1px;
  height: 210px;
  background: rgba(255, 220, 232, 0.4);
}

@keyframes balloonFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-20px) rotate(3deg);
  }
}

.birthday-balloon:hover {
  transform: translateY(-15px) scale(1.04);
}

.birthday-balloon.popped {
  animation: balloonPop 0.45s ease forwards;
}

@keyframes balloonPop {
  30% {
    transform: scale(1.18);
  }

  100% {
    opacity: 0;
    transform: scale(0);
  }
}

.interaction-hint,
.candle-instruction,
.envelope-hint {
  margin-top: 15px;
  color: rgba(255, 221, 235, 0.45);
  font-family: Arial, sans-serif;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-align: center;
  text-transform: uppercase;
}

.balloon-message {
  width: min(650px, 100%);
  margin: 25px auto 0;
  padding: 25px 30px;
  border: 1px solid rgba(255, 210, 230, 0.12);
  border-radius: 25px;
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  opacity: 0;
  transform: translateY(15px);
  transition: 0.5s ease;
}

.balloon-message.visible {
  opacity: 1;
  transform: translateY(0);
}

.message-heart {
  color: #ffb7d1;
  font-size: 25px;
}

.balloon-message p {
  margin-top: 10px;
  color: rgba(255, 237, 245, 0.82);
  font-size: 17px;
  line-height: 1.7;
}


/* =========================================================
   08 — ENVELOPE / LOVE LETTER
   ========================================================= */

.envelope-area {
  position: relative;
  min-height: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1400px;
}

.love-envelope {
  position: relative;
  width: min(560px, 90vw);
  height: 360px;
  border: 0;
  background: transparent;
  perspective: 1400px;
  filter: drop-shadow(0 35px 45px rgba(0, 0, 0, 0.4));
}

.envelope-back,
.envelope-front {
  position: absolute;
  inset: 0;
  border-radius: 12px;
}

.envelope-back {
  background: linear-gradient(145deg, #a84268, #67233f);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -25px 40px rgba(0, 0, 0, 0.15);
}

.envelope-front {
  z-index: 5;
  clip-path: polygon(0 40%, 50% 75%, 100% 40%, 100% 100%, 0 100%);
  background: linear-gradient(145deg, #c45b82, #7c2d4e);
}

.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 7;
  width: 100%;
  height: 65%;
  clip-path: polygon(0 0, 100% 0, 50% 72%);
  background: linear-gradient(180deg, #dc779d, #9d3e61);
  transform-origin: top center;
  transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  backface-visibility: hidden;
}

.love-envelope.open .envelope-flap {
  transform: rotateX(180deg);
  z-index: 2;
}

.envelope-seal {
  position: absolute;
  z-index: 9;
  left: 50%;
  top: 53%;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(255, 231, 240, 0.55);
  border-radius: 50%;
  color: #fff;
  background: #8c3155;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transition: 0.7s ease;
}

.love-envelope.open .envelope-seal {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.4);
}

.letter-paper {
  position: absolute;
  left: 7%;
  bottom: 4%;
  z-index: 4;
  width: 86%;
  height: 88%;
  padding: 30px;
  overflow: hidden;
  border-radius: 5px;
  color: #4b2635;
  text-align: left;
  background:
    linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 242, 247, 0.94));
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform: translateY(30px);
  transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.love-envelope.open .letter-paper {
  transform: translateY(-150px);
}

.letter-inner {
  height: 100%;
  overflow-y: auto;
  padding-right: 8px;
}

.letter-small-title {
  display: block;
  margin-bottom: 18px;
  color: #9c4969;
  font-family: Arial, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.letter-inner p {
  margin: 10px 0;
  font-size: 14px;
  line-height: 1.7;
}

.letter-recipient {
  color: #8e3458;
}

.letter-signature {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  font-style: italic;
}

.letter-signature strong {
  margin-top: 5px;
  color: #8e3458;
}


/* =========================================================
   09 — MEMORIES
   ========================================================= */

.memory-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.memory-placeholder {
  grid-column: 1 / -1;
  min-height: 260px;
  display: grid;
  place-items: center;
  align-content: center;
  padding: 30px;
  border: 1px dashed rgba(255, 210, 230, 0.18);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.025);
}

.memory-placeholder span {
  color: rgba(255, 190, 215, 0.6);
  font-size: 45px;
}

.memory-placeholder p {
  margin-top: 12px;
  color: rgba(255, 230, 240, 0.5);
  font-family: Arial, sans-serif;
  font-size: 13px;
}

.memory-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  aspect-ratio: 4 / 5;
  background: #21131d;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.memory-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.memory-card:hover img {
  transform: scale(1.07);
}

.memory-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 50%,
    rgba(15, 6, 12, 0.55)
  );
}


/* =========================================================
   10 — VIDEO
   ========================================================= */

.birthday-video-wrapper {
  position: relative;
  width: min(850px, 100%);
  margin: 0 auto;
  padding: 12px;
  border: 1px solid rgba(255, 215, 231, 0.15);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.035);
  box-shadow:
    0 35px 80px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.birthday-video {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  min-height: 450px;
  border-radius: 20px;
  background: #090609;
  object-fit: contain;
}

.video-placeholder {
  position: absolute;
  inset: 12px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: rgba(255, 230, 240, 0.55);
  background: rgba(15, 7, 13, 0.88);
  pointer-events: none;
}

.video-placeholder span {
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 210, 230, 0.25);
  border-radius: 50%;
  font-size: 22px;
}

.video-placeholder p {
  font-family: Arial, sans-serif;
  font-size: 12px;
}

/* =========================================================
   11 — REALISTIC 3D HEART CAKE
   ========================================================= */

.cake-scene {
  position: relative;
  min-height: 550px;
  display: grid;
  place-items: center;
  perspective: 1400px;
  overflow: visible;
}

/* Soft light underneath the cake */

.cake-glow {
  position: absolute;
  width: 380px;
  height: 220px;
  border-radius: 50%;
  background:
    radial-gradient(
      ellipse,
      rgba(255, 185, 215, 0.28) 0%,
      rgba(255, 145, 190, 0.12) 45%,
      transparent 75%
    );
  filter: blur(38px);
  transform: translateY(55px);
  pointer-events: none;
}

/* Main cake body */

.birthday-cake {
  position: relative;
  width: 360px;
  height: 350px;
  transform-style: preserve-3d;

  animation:
    heartCakeFloat 5s ease-in-out infinite,
    heartCakeRotate 18s linear infinite;

  transform-origin: center center;
}

/* Gentle floating */

@keyframes heartCakeFloat {

  0%,
  100% {
    transform:
      rotateX(7deg)
      rotateY(-8deg)
      translateY(0);
  }

  50% {
    transform:
      rotateX(9deg)
      rotateY(8deg)
      translateY(-10px);
  }
}

/* Slow premium rotation */

@keyframes heartCakeRotate {

  0% {
    rotate: y -7deg;
  }

  50% {
    rotate: y 7deg;
  }

  100% {
    rotate: y -7deg;
  }
}


/* ---------------------------------------------------------
   CAKE PLATE
   --------------------------------------------------------- */

.cake-plate {
  position: absolute;
  left: 50%;
  bottom: 8px;

  width: 325px;
  height: 52px;

  transform:
    translateX(-50%)
    translateZ(-8px);

  border-radius: 50%;

  background:
    radial-gradient(
      ellipse at 50% 35%,
      rgba(255, 255, 255, 0.8),
      rgba(235, 205, 220, 0.8) 45%,
      rgba(120, 82, 105, 0.9) 100%
    );

  box-shadow:
    0 25px 35px rgba(0, 0, 0, 0.3),
    inset 0 5px 8px rgba(255, 255, 255, 0.55),
    inset 0 -8px 12px rgba(80, 35, 60, 0.18);
}


/* ---------------------------------------------------------
   HEART-SHAPED CAKE LAYERS
   --------------------------------------------------------- */

.cake-bottom,
.cake-middle,
.cake-top {

  position: absolute;

  left: 50%;

  width: 280px;

  transform:
    translateX(-50%)
    rotate(45deg);

  border-radius:
    45% 45% 18% 45%;

  transform-style: preserve-3d;
}


/* Bottom layer */

.cake-bottom {

  bottom: 48px;

  height: 150px;

  z-index: 1;

  background:
    linear-gradient(
      135deg,
      #702d49 0%,
      #a84668 25%,
      #df7d9f 52%,
      #a74466 78%,
      #63263f 100%
    );

  box-shadow:
    inset 12px 10px 20px rgba(255, 255, 255, 0.14),
    inset -15px -18px 28px rgba(60, 10, 30, 0.3),
    0 18px 28px rgba(0, 0, 0, 0.28);
}


/* Middle layer */

.cake-middle {

  bottom: 112px;

  height: 135px;

  z-index: 2;

  background:
    linear-gradient(
      135deg,
      #a63f61 0%,
      #d9668c 25%,
      #f2a5bd 52%,
      #d45c83 76%,
      #8c3151 100%
    );

  box-shadow:
    inset 10px 8px 18px rgba(255, 255, 255, 0.2),
    inset -12px -15px 22px rgba(70, 15, 40, 0.22),
    0 13px 24px rgba(0, 0, 0, 0.22);
}


/* Top heart */

.cake-top {

  bottom: 177px;

  height: 105px;

  z-index: 5;

  background:
    radial-gradient(
      ellipse at 40% 28%,
      #fff1f6 0%,
      #ffd2e2 25%,
      #ef9bb7 65%,
      #b84f74 100%
    );

  box-shadow:
    inset 10px 8px 18px rgba(255, 255, 255, 0.5),
    inset -12px -14px 20px rgba(90, 25, 50, 0.18),
    0 12px 22px rgba(0, 0, 0, 0.22);
}


/* ---------------------------------------------------------
   HEART CAKE ICING
   --------------------------------------------------------- */

.cake-icing {

  position: absolute;

  left: -2%;

  bottom: -16px;

  width: 104%;

  height: 32px;

  border-radius: 50%;

  background:
    linear-gradient(
      180deg,
      #fff0f6,
      #ffd3e2 55%,
      #e996b2
    );

  box-shadow:
    inset 0 5px 7px rgba(255, 255, 255, 0.6),
    0 6px 10px rgba(70, 20, 45, 0.18);
}


/* ---------------------------------------------------------
   CAKE DETAILS
   --------------------------------------------------------- */

.cake-decoration {

  position: relative;

  z-index: 8;

  display: inline-block;

  margin: 0 13px;

  color: #9d315c;

  font-size: 21px;

  transform: rotate(-45deg);

  text-shadow:
    0 2px 5px rgba(90, 20, 50, 0.2);
}


.cake-detail {

  position: absolute;

  width: 25px;
  height: 25px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 30% 25%,
      #fff7fa,
      #ffc8da 55%,
      #d76b91 100%
    );

  box-shadow:
    inset -5px -5px 8px rgba(90, 20, 50, 0.16),
    0 3px 6px rgba(60, 10, 30, 0.16);

  transform: rotate(-45deg);
}


.detail-one {
  left: 35px;
  top: 42px;
}


.detail-two {
  right: 48px;
  top: 28px;
}


.detail-three {
  left: 125px;
  bottom: 18px;
}


/* Ribbon detail */

.cake-ribbon {

  position: absolute;

  left: -3%;

  top: 52px;

  width: 106%;

  height: 17px;

  border-radius: 50%;

  background:
    linear-gradient(
      180deg,
      rgba(255, 239, 246, 0.7),
      rgba(255, 195, 216, 0.35)
    );

  box-shadow:
    0 2px 6px rgba(70, 15, 40, 0.12);

  transform: rotate(-45deg);
}


/* ---------------------------------------------------------
   MOBILE
   --------------------------------------------------------- */

@media (max-width: 700px) {

  .cake-scene {
    min-height: 470px;
    transform: scale(0.86);
  }

}

/* =========================================================
   12 — CANDLES
   ========================================================= */

.cake-candles {
  position: absolute;
  z-index: 10;
  top: 50px;
  left: 50%;
  display: flex;
  gap: 35px;
  transform: translateX(-50%);
}

.cake-candle {
  position: relative;
  width: 20px;
  height: 75px;
  border: 0;
  border-radius: 7px 7px 3px 3px;
  background: repeating-linear-gradient(
    135deg,
    #f4c2d4 0,
    #f4c2d4 8px,
    #b9567b 8px,
    #b9567b 14px
  );
  box-shadow:
    inset 5px 0 8px rgba(255, 255, 255, 0.25),
    inset -5px 0 8px rgba(0, 0, 0, 0.15),
    0 8px 15px rgba(0, 0, 0, 0.2);
}

.candle-flame {
  position: absolute;
  left: 50%;
  top: -32px;
  width: 18px;
  height: 28px;
  transform: translateX(-50%);
  border-radius: 50% 50% 50% 50%;
  background: radial-gradient(
    circle at 50% 70%,
    #fff5bd 0 25%,
    #ffc45e 45%,
    #ff789a 75%
  );
  box-shadow:
    0 0 15px rgba(255, 178, 86, 0.8),
    0 0 35px rgba(255, 121, 159, 0.45);
  animation: flameDance 0.7s ease-in-out infinite alternate;
}

@keyframes flameDance {
  from {
    transform: translateX(-50%) scale(1) rotate(-3deg);
  }

  to {
    transform: translateX(-50%) scale(1.12) rotate(4deg);
  }
}

.cake-candle.blown .candle-flame {
  opacity: 0;
  transform: translateX(-50%) scale(0.2);
  transition: 0.35s ease;
}

.cake-candle.blown::after {
  content: "";
  position: absolute;
  left: 50%;
  top: -28px;
  width: 25px;
  height: 50px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: rgba(220, 220, 220, 0.18);
  filter: blur(8px);
  animation: smokeRise 2s ease-out forwards;
}

@keyframes smokeRise {
  to {
    opacity: 0;
    transform: translate(-50%, -35px) scale(1.5);
  }
}

.birthday-wish-button {
  display: block;
  margin: 20px auto 0;
  padding: 16px 26px;
  border: 1px solid rgba(255, 218, 231, 0.2);
  border-radius: 100px;
  color: #fff;
  background: linear-gradient(
    135deg,
    rgba(255, 144, 184, 0.22),
    rgba(144, 91, 145, 0.22)
  );
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transition: 0.35s ease;
}

.birthday-wish-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(255, 131, 176, 0.15);
}

.wish-message {
  width: min(650px, 100%);
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 22px;
  border: 1px solid rgba(255, 220, 235, 0.12);
  border-radius: 22px;
  color: rgba(255, 235, 245, 0.75);
  background: rgba(255, 255, 255, 0.035);
  opacity: 0;
  transform: translateY(15px);
  transition: 0.5s ease;
}

.wish-message.visible {
  opacity: 1;
  transform: translateY(0);
}


/* =========================================================
   13 — FINAL SURPRISE
   ========================================================= */

.final-surprise {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 120px 25px;
  overflow: hidden;
  text-align: center;
  background:
    radial-gradient(
      circle at center,
      rgba(173, 68, 112, 0.22),
      transparent 50%
    );
}

.final-content {
  position: relative;
  z-index: 2;
  max-width: 760px;
}

.final-surprise h2 {
  color: #fff;
  font-size: clamp(50px, 9vw, 90px);
  font-weight: 400;
  line-height: 1.05;
}

.final-surprise h2 span {
  color: #ffbdd7;
}

.final-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 30px auto;
}

.final-line span {
  width: 100px;
  height: 1px;
  background: rgba(255, 204, 225, 0.3);
}

.final-line i {
  color: #ff9fc3;
  font-style: normal;
}

.final-message {
  color: rgba(255, 235, 244, 0.7);
  font-family: Arial, sans-serif;
  font-size: 15px;
  line-height: 1.9;
}

.final-heart {
  width: 90px;
  height: 90px;
  display: grid;
  place-items: center;
  margin: 35px auto;
  border: 1px solid rgba(255, 200, 222, 0.2);
  border-radius: 50%;
  color: #ffb6d1;
  font-size: 34px;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: 0 0 60px rgba(255, 130, 180, 0.12);
  animation: heartPulse 2s ease-in-out infinite;
}

.final-small-message {
  color: rgba(255, 220, 235, 0.5);
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.8;
}

.replay-button {
  margin-top: 35px;
  padding: 13px 22px;
  border: 1px solid rgba(255, 215, 232, 0.15);
  border-radius: 100px;
  color: rgba(255, 235, 245, 0.75);
  background: rgba(255, 255, 255, 0.04);
  transition: 0.3s ease;
}

.replay-button:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.08);
}

.final-sparkles span {
  position: absolute;
  color: rgba(255, 211, 229, 0.4);
  animation: starFloat 5s ease-in-out infinite;
}

.final-sparkles span:nth-child(1) {
  top: 20%;
  left: 15%;
}

.final-sparkles span:nth-child(2) {
  top: 35%;
  right: 15%;
}

.final-sparkles span:nth-child(3) {
  bottom: 20%;
  left: 20%;
}

.final-sparkles span:nth-child(4) {
  bottom: 30%;
  right: 20%;
}


/* =========================================================
   14 — FOOTER
   ========================================================= */

.birthday-footer {
  padding: 50px 20px 60px;
  text-align: center;
  background: rgba(0, 0, 0, 0.12);
}

.birthday-footer p {
  color: rgba(255, 220, 235, 0.45);
  font-family: Arial, sans-serif;
  font-size: 11px;
}

.birthday-footer p span {
  color: #ffabc9;
}

.birthday-footer a {
  display: inline-block;
  margin-top: 18px;
  color: rgba(255, 220, 235, 0.65);
  font-family: Arial, sans-serif;
  font-size: 11px;
  text-decoration: none;
  transition: 0.3s ease;
}

.birthday-footer a:hover {
  color: #fff;
}


/* =========================================================
   15 — MOBILE RESPONSIVE
   ========================================================= */

@media (max-width: 800px) {

  .birthday-section {
    width: min(100% - 24px, 700px);
    padding: 90px 12px;
  }

  .birthday-hero {
    padding: 80px 18px;
  }

  .moon-decoration {
    width: 220px;
    height: 220px;
    right: -80px;
    top: 15%;
  }

  .balloon-stage {
    min-height: 500px;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 35px 18px;
    padding-bottom: 80px;
  }

  .birthday-balloon {
    width: 105px;
    height: 140px;
  }

  .birthday-balloon:nth-child(4),
  .birthday-balloon:nth-child(5) {
    margin-top: 25px;
  }

  .memory-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .birthday-video {
    min-height: 280px;
  }

  .envelope-area {
    min-height: 570px;
  }

  .love-envelope {
    height: 300px;
  }

  .love-envelope.open .letter-paper {
    transform: translateY(-125px);
  }

  .birthday-cake {
    transform: scale(0.82) rotateX(8deg) rotateY(-8deg);
  }

  @keyframes cakeFloat {
    0%,
    100% {
      transform: scale(0.82) rotateX(8deg) rotateY(-8deg) translateY(0);
    }

    50% {
      transform: scale(0.82) rotateX(10deg) rotateY(8deg) translateY(-12px);
    }
  }

}


/* =========================================================
   16 — SMALL MOBILE
   ========================================================= */

@media (max-width: 480px) {

  .birthday-name {
    font-size: clamp(55px, 18vw, 90px);
  }

  .section-heading {
    margin-bottom: 45px;
  }

  .section-heading h2 {
    font-size: 38px;
  }

  .section-heading p {
    font-size: 13px;
  }

  .hero-message {
    font-size: 15px;
  }

  .balloon-stage {
    min-height: 520px;
    gap: 28px 10px;
  }

  .birthday-balloon {
    width: 88px;
    height: 118px;
  }

  .balloon-string {
    height: 160px;
  }

  .balloon-message {
    padding: 20px;
  }

  .balloon-message p {
    font-size: 14px;
  }

  .love-envelope {
    width: 94vw;
    height: 245px;
  }

  .letter-paper {
    padding: 20px;
  }

  .letter-inner p {
    font-size: 11px;
  }

  .envelope-seal {
    width: 48px;
    height: 48px;
    font-size: 14px;
  }

  .love-envelope.open .letter-paper {
    transform: translateY(-95px);
  }

  .memory-gallery {
    grid-template-columns: 1fr 1fr;
  }

  .birthday-video {
    min-height: 220px;
  }

  .cake-scene {
    min-height: 470px;
  }

  .birthday-cake {
    transform: scale(0.68) rotateX(8deg) rotateY(-8deg);
  }

  @keyframes cakeFloat {
    0%,
    100% {
      transform: scale(0.68) rotateX(8deg) rotateY(-8deg) translateY(0);
    }

    50% {
      transform: scale(0.68) rotateX(10deg) rotateY(8deg) translateY(-10px);
    }
  }

  .final-surprise {
    padding: 90px 18px;
  }

  .final-surprise h2 {
    font-size: 48px;
  }

}


/* =========================================================
   17 — REDUCED MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }

}

/* =========================================
   CUSTOMIZATION PANEL
   ========================================= */

.customization-panel {
  max-width: 1100px;
  margin: 80px auto;
  padding: 70px 30px;
  opacity: 0;
  transform: translateY(35px);
  pointer-events: none;
  max-height: 0;
  overflow: hidden;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease,
    max-height 0.8s ease;
}

.customization-panel.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  max-height: 1200px;
}

.customization-inner {
  max-width: 850px;
  margin: 0 auto;
  padding: 45px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(18px);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.customization-inner h2 {
  margin: 10px 0 12px;
  font-size: clamp(2rem, 5vw, 3.4rem);
  text-align: center;
}

.customization-inner > p {
  max-width: 650px;
  margin: 0 auto 35px;
  text-align: center;
  opacity: 0.8;
  line-height: 1.7;
}

.customization-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.form-group input {
  width: 100%;
  padding: 15px 17px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  outline: none;
  background: rgba(255, 255, 255, 0.09);
  color: inherit;
  font: inherit;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.form-group input:focus {
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.13);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
}

.form-group input::file-selector-button {
  margin-right: 12px;
  padding: 9px 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.15);
  color: inherit;
  font-weight: 600;
}

.form-group small {
  opacity: 0.6;
  font-size: 0.78rem;
}

.customization-actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

#previewSurpriseButton {
  border: none;
  border-radius: 999px;
  padding: 16px 30px;
  cursor: pointer;
  color: inherit;
  background: rgba(255, 255, 255, 0.14);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  font: inherit;
  font-weight: 700;
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

#previewSurpriseButton:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.21);
}

.edit-surprise-button {
  margin-top: 16px;
  padding: 12px 22px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font: inherit;
  font-weight: 600;
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.edit-surprise-button:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}


/* MOBILE */
@media (max-width: 700px) {

  .customization-panel {
    margin: 50px auto;
    padding: 45px 16px;
  }

  .customization-inner {
    padding: 28px 20px;
    border-radius: 24px;
  }

  .customization-form {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  #previewSurpriseButton {
    width: 100%;
  }

}

.custom-photo-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.custom-photo-item {
  position: relative;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.custom-photo-item img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.remove-custom-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.68);
  color: white;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.remove-custom-photo:hover {
  transform: scale(1.12);
  background: rgba(0, 0, 0, 0.85);
}

@media (max-width: 700px) {
  .custom-photo-preview {
    gap: 8px;
  }

  .custom-photo-item {
    width: 62px;
    height: 62px;
  }

  .remove-custom-photo {
    width: 19px;
    height: 19px;
    font-size: 13px;
  }
}


.preview-status {
  margin: 16px 0 0;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.4s ease;
  font-size: 0.9rem;
}

.custom-video-name {
  margin-top: 12px;
  padding: 11px 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.07);
  font-size: 0.82rem;
  line-height: 1.4;
  opacity: 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-video-name:empty {
  display: none;
}

.create-surprise-button {
  margin-left: 12px;
  padding: 16px 28px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  cursor: pointer;
  color: inherit;
  background: rgba(255, 255, 255, 0.16);
  box-shadow:
    0 14px 35px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
  font: inherit;
  font-weight: 700;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.create-surprise-button span {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.25s ease;
}

.create-surprise-button:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.23);
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.create-surprise-button:hover span {
  transform: translateX(4px);
}

@media (max-width: 700px) {
  .customization-actions {
    flex-direction: column;
    gap: 12px;
  }

  .create-surprise-button {
    width: 100%;
    margin-left: 0;
  }
}

.preview-status.show {
  opacity: 0.85;
  transform: translateY(0);
}

.preview-actions {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin: 24px auto 0;
  flex-wrap: wrap;
}

.preview-actions.show {
  display: flex;
}

#backToEditButton,
#previewCreateButton {
  padding: 13px 22px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  cursor: pointer;
  color: inherit;
  background: rgba(255, 255, 255, 0.1);
  font: inherit;
  font-weight: 600;
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

#backToEditButton:hover,
#previewCreateButton:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
}

#previewCreateButton {
  font-weight: 700;
}

@media (max-width: 700px) {
  .preview-actions {
    flex-direction: column;
    width: 100%;
  }

  #backToEditButton,
  #previewCreateButton {
    width: 100%;
  }
}

/* =========================================================
   MAGICAL CAKE REVEAL
   ========================================================= */

.cake-scene.magical-reveal::before {

  content: "";

  position: absolute;

  left: 50%;
  top: 50%;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 220, 236, 0.7) 25%,
      rgba(255, 168, 207, 0.35) 50%,
      transparent 72%
    );

  transform: translate(-50%, -50%) scale(1);

  pointer-events: none;

  z-index: 20;

  animation:
    cakeLightBurst 1.25s
    cubic-bezier(0.2, 0.8, 0.2, 1)
    forwards;
}


@keyframes cakeLightBurst {

  0% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      scale(0.4);
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      scale(18);
  }
}


/* ---------------------------------------------------------
   CAKE MAGICAL ILLUMINATION
   --------------------------------------------------------- */

.birthday-cake.cake-magical-glow {

  animation:
    heartCakeFloat 5s ease-in-out infinite,
    heartCakeRotate 18s linear infinite,
    cakeMagicalGlow 1.5s ease-out forwards;
}


@keyframes cakeMagicalGlow {

  0% {
    filter:
      brightness(1)
      drop-shadow(0 0 0 rgba(255, 180, 215, 0));
  }

  35% {
    filter:
      brightness(1.35)
      drop-shadow(
        0 0 22px rgba(255, 190, 220, 0.75)
      );
  }

  65% {
    filter:
      brightness(1.18)
      drop-shadow(
        0 0 38px rgba(255, 170, 210, 0.55)
      );
  }

  100% {
    filter:
      brightness(1)
      drop-shadow(
        0 0 12px rgba(255, 170, 210, 0.18)
      );
  }
}


/* ---------------------------------------------------------
   SPARKLES
   --------------------------------------------------------- */

.cake-sparkle {

  position: absolute;

  left: 50%;
  top: 50%;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #fff;

  box-shadow:
    0 0 7px rgba(255, 255, 255, 0.95),
    0 0 16px rgba(255, 185, 220, 0.8);

  pointer-events: none;

  z-index: 30;

  animation:
    sparkleBurst 1.35s
    ease-out
    var(--spark-delay)
    forwards;
}


@keyframes sparkleBurst {

  0% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      scale(0);
  }

  15% {
    opacity: 1;
    transform:
      translate(-50%, -50%)
      scale(1.4);
  }

  100% {
    opacity: 0;
    transform:
      translate(
        calc(-50% + var(--spark-x)),
        calc(-50% + var(--spark-y))
      )
      scale(0.15);
  }
}


/* ---------------------------------------------------------
   HEART BURST
   --------------------------------------------------------- */

.cake-reveal-heart {

  position: absolute;

  left: 50%;
  top: 52%;

  color: rgba(255, 180, 215, 0.9);

  font-size: 15px;

  pointer-events: none;

  z-index: 31;

  text-shadow:
    0 0 8px rgba(255, 150, 205, 0.8),
    0 0 18px rgba(255, 150, 205, 0.45);

  animation:
    heartBurst 1.8s
    cubic-bezier(0.2, 0.75, 0.25, 1)
    var(--heart-delay)
    forwards;
}


@keyframes heartBurst {

  0% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      scale(0.3);
  }

  18% {
    opacity: 1;
    transform:
      translate(-50%, -50%)
      scale(1.15);
  }

  100% {
    opacity: 0;
    transform:
      translate(
        calc(-50% + var(--heart-x)),
        calc(-50% + var(--heart-y))
      )
      scale(0.75);
  }
}


/* ---------------------------------------------------------
   WISH BUTTON AFTER REVEAL
   --------------------------------------------------------- */

.birthday-wish-button.magical-wish-ready {

  animation:
    wishButtonReveal 0.8s
    ease-out
    forwards;
}


@keyframes wishButtonReveal {

  0% {
    opacity: 0.7;
    transform: scale(0.96);
  }

  55% {
    opacity: 1;
    transform: scale(1.06);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* =========================================================
   REALISTIC CANDLE SMOKE
   ========================================================= */

.realistic-candle-smoke {

  position: fixed;

  width: 12px;
  height: 12px;

  border-radius: 50%;

  pointer-events: none;

  z-index: 100;

  background:
    radial-gradient(
      circle,
      rgba(245, 245, 245, 0.38),
      rgba(190, 190, 190, 0.18) 45%,
      transparent 75%
    );

  filter: blur(5px);

  transform-origin: center bottom;
}

/* =========================================================
   FINAL CAKE LIGHT BURST
   ========================================================= */

.cake-light-burst {

  position: absolute;

  left: 50%;
  top: 50%;

  width: 40px;
  height: 40px;

  border-radius: 50%;

  transform:
    translate(-50%, -50%)
    scale(0.2);

  background:
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 226, 240, 0.75) 20%,
      rgba(255, 170, 210, 0.3) 48%,
      transparent 72%
    );

  box-shadow:
    0 0 35px rgba(255, 190, 220, 0.7),
    0 0 80px rgba(255, 170, 210, 0.45);

  pointer-events: none;

  z-index: 40;

  animation:
    finalCakeBurst 1.2s
    cubic-bezier(0.15, 0.8, 0.2, 1)
    forwards;
}


@keyframes finalCakeBurst {

  0% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      scale(0.2);
  }

  12% {
    opacity: 1;
  }

  35% {
    opacity: 1;
    transform:
      translate(-50%, -50%)
      scale(5);
  }

  100% {
    opacity: 0;
    transform:
      translate(-50%, -50%)
      scale(16);
  }
}
