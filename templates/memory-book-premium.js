/* =========================================================
   LUVORA — PREMIUM MEMORY BOOK ENHANCER
   Loads after templates/birthday.js.
   Does not touch Supabase, BIRTHDAY_CONFIG, upload or flow logic.
   ========================================================= */
(() => {
  "use strict";

  const ROOT_ID = "memoriesSection";
  const AREA_ID = "memoryBookArea";
  const SOURCE_SELECTOR = ".memory-page .memory-photo-slot img";
  const QUOTE_EMOJI = ["🌹", "🦋", "🌸", "✦"];

  const waitFor = (test, callback, attempts = 80) => {
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      const value = test();
      if (value) {
        window.clearInterval(timer);
        callback(value);
      } else if (count >= attempts) {
        window.clearInterval(timer);
      }
    }, 250);
  };

  function createParticles(area) {
    if (area.dataset.mbParticlesReady === "true") return;
    area.dataset.mbParticlesReady = "true";
    const symbols = ["✦", "✧", "♡", "♥", "·", "✴"];
    for (let i = 0; i < 22; i += 1) {
      const particle = document.createElement("span");
      particle.className = "mb-particle";
      particle.setAttribute("aria-hidden", "true");
      particle.textContent = symbols[i % symbols.length];
      particle.style.setProperty("--mb-left", `${4 + Math.random() * 92}%`);
      particle.style.setProperty("--mb-duration", `${8 + Math.random() * 8}s`);
      particle.style.setProperty("--mb-delay", `${-Math.random() * 14}s`);
      particle.style.setProperty("--mb-drift", `${-35 + Math.random() * 70}px`);
      particle.style.setProperty("--mb-particle-color", i % 3 === 0 ? "#f2a9d4" : "#d9c1ff");
      particle.style.fontSize = `${8 + Math.random() * 12}px`;
      area.appendChild(particle);
    }
  }

  function collectPhotos(book) {
    const slots = [...book.querySelectorAll(SOURCE_SELECTOR)];
    const output = [];
    slots.forEach((img, index) => {
      const src = img.currentSrc || img.getAttribute("src") || "";
      if (!src || src === window.location.href || img.dataset.mbFailed === "true") return;
      const quoteNode = img.closest(".memory-photo-slot")
        ?.parentElement?.querySelectorAll(".memory-quote")?.[index % 2];
      const page = img.closest(".memory-page");
      const quoteList = page ? [...page.querySelectorAll(".memory-quote")] : [];
      const slotList = page ? [...page.querySelectorAll(".memory-photo-slot img")] : [];
      const slotIndex = slotList.indexOf(img);
      const quote = quoteList[slotIndex]?.querySelector("p")?.innerHTML || "A little moment I will always keep close.";
      const emoji = quoteList[slotIndex]?.querySelector(".quote-decoration")?.textContent?.trim() || QUOTE_EMOJI[index % 4];
      output.push({ src, alt: img.alt || `Memory ${index + 1}`, quote, emoji });
    });
    return output.slice(0, 4);
  }

  function buildMobileExperience(root, area, book) {
    if (area.querySelector(".luvora-mobile-memory")) return;

    const mobile = document.createElement("div");
    mobile.className = "luvora-mobile-memory";
    mobile.setAttribute("aria-label", "Photo memories diary");
    mobile.innerHTML = `
      <p class="mb-mobile-kicker">A LITTLE COLLECTION OF US</p>
      <h3 class="mb-mobile-title">A walk down memory lane</h3>
      <p class="mb-mobile-subtitle">Swipe through the moments worth keeping close ♡</p>
      <div class="mb-track" aria-label="Swipe to browse memories"></div>
      <div class="mb-pagination" aria-label="Memory pagination"></div>
      <p class="mb-swipe-note">SWIPE TO DISCOVER  ·  MADE WITH LOVE</p>`;
    area.appendChild(mobile);

    const track = mobile.querySelector(".mb-track");
    const pagination = mobile.querySelector(".mb-pagination");
    let lastSignature = "";

    function render() {
  const photos = collectPhotos(book);

  // Final message card is always the last slide.
  const slides = [
    ...photos,
    { type: "message" }
  ];

  const signature =
    photos.map(item => item.src).join("||") +
    "||luvora-final-message-card-v1";

  if (!photos.length || signature === lastSignature) return;

  lastSignature = signature;
  track.innerHTML = "";
  pagination.innerHTML = "";

  slides.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "mb-card";

    if (item.type === "message") {
      card.classList.add("mb-card-message");

      card.innerHTML = `
        <div class="mb-message-content">
          <div class="mb-message-main">
            <span class="mb-message-line">You Are One of a Kind.</span>
            <span class="mb-message-line">Keep Shining, Always.</span>
          </div>
          <div class="mb-message-footer">
            <span></span>
          </div>
        </div>`;
    } else {
      card.innerHTML = `
        <div class="mb-card-photo">
          <img loading="eager" alt="">
        </div>
        <div class="mb-card-quote">
          <span class="mb-emoji"></span>
          <p></p>
        </div>`;

      const image = card.querySelector("img");
      image.src = item.src;
      image.alt = item.alt;

      card.querySelector(".mb-emoji").textContent = item.emoji;
      card.querySelector(".mb-card-quote p").innerHTML = item.quote;
    }

    track.appendChild(card);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "mb-dot";

    dot.setAttribute(
      "aria-label",
      item.type === "message"
        ? "Show final birthday message"
        : `Show memory ${index + 1}`
    );

    dot.setAttribute(
      "aria-current",
      index === 0 ? "true" : "false"
    );

    dot.addEventListener("click", () => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    });

    pagination.appendChild(dot);
  });

  updateActive();
}

    function updateActive() {
      const cards = [...track.querySelectorAll(".mb-card")];
      if (!cards.length) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let active = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const currentDistance = Math.abs(cardCenter - center);
        if (currentDistance < distance) { distance = currentDistance; active = index; }
      });
      cards.forEach((card, index) => card.classList.toggle("is-active", index === active));
      [...pagination.children].forEach((dot, index) => dot.setAttribute("aria-current", index === active ? "true" : "false"));
    }

    track.addEventListener("scroll", () => window.requestAnimationFrame(updateActive), { passive: true });
    track.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const cards = [...track.querySelectorAll(".mb-card")];
      const active = cards.findIndex(card => card.classList.contains("is-active"));
      const next = Math.max(0, Math.min(cards.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)));
      cards[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });

    const sourceImages = [...book.querySelectorAll(SOURCE_SELECTOR)];
    sourceImages.forEach(img => {
      img.addEventListener("load", render);
      img.addEventListener("error", () => { img.dataset.mbFailed = "true"; render(); });
    });
    const observer = new MutationObserver(render);
    sourceImages.forEach(img => observer.observe(img, { attributes: true, attributeFilter: ["src"] }));
    render();
    window.setInterval(render, 900);
  }

  function init() {
    const root = document.getElementById(ROOT_ID);
    const area = document.getElementById(AREA_ID);
    const book = document.getElementById("memoryBook");
    if (!root || !area || !book) return false;

    createParticles(area);
    buildMobileExperience(root, area, book);

    const setDeviceMode = () => {
      const phone = window.matchMedia("(max-width: 600px)").matches;
      root.classList.toggle("luvora-memory-phone", phone);
      const mobile = area.querySelector(".luvora-mobile-memory");
      if (mobile) mobile.setAttribute("aria-hidden", String(!phone));
      // The old flipbook script creates a legacy one-photo diary on phones.
      const legacy = area.querySelector(".mobile-memory-diary");
      if (legacy) legacy.setAttribute("aria-hidden", "true");
    };
    setDeviceMode();
    window.addEventListener("resize", setDeviceMode, { passive: true });

    // Keep the page section in the existing birthday flow; no auto-scroll or reveal.
    return true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => waitFor(() => document.getElementById(AREA_ID)?.querySelector(".memory-page"), init), { once: true });
  } else {
    waitFor(() => document.getElementById(AREA_ID)?.querySelector(".memory-page"), init);
  }
})();
