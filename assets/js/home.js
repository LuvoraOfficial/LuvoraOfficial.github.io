document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ORIGINAL LUVORA — REVEAL ANIMATION
     ========================================================= */

  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.12
  });

  document
    .querySelectorAll(
      ".reveal, .occasion-card, .template-card, .mini-steps > div"
    )
    .forEach((el) => observer.observe(el));


  /* =========================================================
     FALLING ROSE PETALS
     ========================================================= */

  const layer = document.querySelector(".petal-layer");

  if (layer) {
    const reducedMotion = window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (!reducedMotion) {

      const count = window
        .matchMedia("(max-width: 600px)")
        .matches ? 8 : 17;

      const fragment = document.createDocumentFragment();

      for (let i = 0; i < count; i++) {

        const petal = document.createElement("span");
        petal.className = "petal";

        const size = 13 + Math.random() * 22;
        const fall = 9 + Math.random() * 8;
        const delay = -(Math.random() * fall);
        const drift = -80 + Math.random() * 170;
        const rotation = -35 + Math.random() * 70;
        const opacity = 0.45 + Math.random() * 0.45;

        const blur =
          Math.random() > 0.68
            ? `${(Math.random() * 1.1).toFixed(2)}px`
            : "0px";

        petal.style.setProperty(
          "--size",
          `${size.toFixed(1)}px`
        );

        petal.style.setProperty(
          "--fall",
          `${fall.toFixed(2)}s`
        );

        petal.style.setProperty(
          "--delay",
          `${delay.toFixed(2)}s`
        );

        petal.style.setProperty(
          "--drift",
          `${drift.toFixed(0)}px`
        );

        petal.style.setProperty(
          "--rotate",
          `${rotation.toFixed(0)}deg`
        );

        petal.style.setProperty(
          "--opacity",
          opacity.toFixed(2)
        );

        petal.style.setProperty(
          "--blur",
          blur
        );

        petal.style.setProperty(
          "--left",
          `${Math.random() * 100}%`
        );

        fragment.appendChild(petal);
      }

      layer.appendChild(fragment);
    }
  }


  /* =========================================================
     OCCASION STORIES
     ========================================================= */

  const occasionStories = {

    birthday: {
      image: "assets/images/birthday-bloom.jpg",

      enTitle: "A Day Made for You",

      enMessage:
        "Some people make life brighter just by being in it. Today is all about celebrating you, your beautiful heart, and every little thing that makes you special. You deserve all the love in the world.",

      bnTitle: "তোমার জন্য সাজানো একটি দিন",

      bnMessage:
        "কিছু মানুষ শুধু জীবনে থাকার কারণেই পৃথিবীটাকে আরও সুন্দর করে তোলে। আজকের দিনটা শুধু তোমার জন্য—তোমার সুন্দর মন, তোমার হাসি আর তোমার প্রতিটি বিশেষ মুহূর্তের উদযাপন। তুমি পৃথিবীর সব ভালোবাসা পাওয়ার যোগ্য।"
    },


    anniversary: {
      image: "assets/images/our-forever.jpg",

      enTitle: "Still Choosing You",

      enMessage:
        "Every year, our story grows a little deeper. Through every laugh, every little argument, and every quiet moment, my heart keeps choosing you. Here's to all the chapters we've written and the forever still waiting for us.",

      bnTitle: "আজও তোমাকেই বেছে নিই",

      bnMessage:
        "প্রতি বছর আমাদের ভালোবাসার গল্পটা আরও গভীর হয়। প্রতিটি হাসি, ছোট্ট অভিমান আর নীরব মুহূর্তের মাঝেও আমার হৃদয় বারবার তোমাকেই বেছে নেয়। আমাদের একসঙ্গে লেখা প্রতিটি অধ্যায় আর সামনে অপেক্ষা করে থাকা অনন্ত ভালোবাসার জন্য।"
    },


    valentine: {
      image: "assets/images/love-notes.jpg",

      enTitle: "A Little More Love",

      enMessage:
        "If I could give you one thing, it would be the chance to see yourself through my eyes. Maybe then you'd understand how special you are to me. Today, tomorrow, and in every little moment in between—my heart is yours.",

      bnTitle: "আরও একটু ভালোবাসা",

      bnMessage:
        "তোমাকে যদি একটা জিনিস দিতে পারতাম, তাহলে দিতাম আমার চোখে নিজেকে দেখার সুযোগ। তাহলে হয়তো বুঝতে পারতে, তুমি আমার কাছে কতটা বিশেষ। আজ, আগামীকাল, আর মাঝের প্রতিটি ছোট্ট মুহূর্তে—আমার হৃদয়টা তোমারই।"
    },


    justbecause: {
      image: "assets/images/little-reasons.jpg",

      enTitle: "Just Because, Always",

      enMessage:
        "No special date. No big reason. I just wanted to remind you that you matter to me, that your smile makes my day, and that having you in my life is a gift I never want to take for granted. Just because I love you.",

      bnTitle: "শুধু তোমার জন্য, সবসময়",

      bnMessage:
        "আজ কোনো বিশেষ দিন নয়, বড় কোনো কারণও নেই। শুধু মনে করিয়ে দিতে চাই, তুমি আমার কাছে কতটা গুরুত্বপূর্ণ। তোমার হাসি আমার দিনটা সুন্দর করে দেয়, আর তোমাকে জীবনে পাওয়াটা এমন এক উপহার, যেটাকে আমি কখনও সাধারণভাবে নিতে চাই না। শুধু তোমাকে ভালোবাসি বলেই।"
    }

  };


  /* =========================================================
     OCCASION MODAL ELEMENTS
     ========================================================= */

  const occasionModal =
    document.getElementById("occasionModal");

  const occasionModalTitle =
    document.getElementById("occasionModalTitle");

  const occasionModalMessage =
    document.getElementById("occasionModalMessage");

  const occasionModalImage =
    document.getElementById("occasionModalImage");

  const occasionLanguage =
    document.getElementById("occasionLanguage");


  /* =========================================================
     SAFETY CHECK
     Prevent errors if modal HTML is not added yet.
     ========================================================= */

  if (
    !occasionModal ||
    !occasionModalTitle ||
    !occasionModalMessage ||
    !occasionModalImage ||
    !occasionLanguage
  ) {
    return;
  }


  /* =========================================================
     OCCASION STATE
     ========================================================= */

  let activeOccasion = null;
  let occasionLang = "en";


  /* =========================================================
     RENDER STORY
     ========================================================= */

  function renderOccasionStory() {

    const story = occasionStories[activeOccasion];

    if (!story) return;

    occasionModalTitle.textContent =
      occasionLang === "en"
        ? story.enTitle
        : story.bnTitle;

    occasionModalMessage.textContent =
      occasionLang === "en"
        ? story.enMessage
        : story.bnMessage;

    occasionLanguage.textContent =
      occasionLang === "en"
        ? "বাংলা"
        : "English";
  }


  /* =========================================================
     OPEN OCCASION MODAL
     ========================================================= */

  document
    .querySelectorAll(".occasion-cover[data-occasion]")
    .forEach((card) => {

      card.addEventListener("click", () => {

        activeOccasion =
          card.dataset.occasion;

        occasionLang = "en";

        const story =
          occasionStories[activeOccasion];

        if (!story) return;

        occasionModalImage.src =
          story.image;

        occasionModalImage.alt =
          story.enTitle;

        renderOccasionStory();

        occasionModal.classList.add("is-open");

        occasionModal.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.classList.add(
          "occasion-modal-open"
        );

        const closeButton =
          document.querySelector(
            ".occasion-modal-close"
          );

        if (closeButton) {
          closeButton.focus();
        }
      });
    });


  /* =========================================================
     ENGLISH ↔ BENGALI
     ========================================================= */

  occasionLanguage.addEventListener(
    "click",
    () => {

      occasionLang =
        occasionLang === "en"
          ? "bn"
          : "en";

      renderOccasionStory();
    }
  );


  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  function closeOccasionModal() {

    occasionModal.classList.remove(
      "is-open"
    );

    occasionModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "occasion-modal-open"
    );

    activeOccasion = null;
  }


  /* =========================================================
     CLOSE BUTTON / BACKDROP
     ========================================================= */

  occasionModal
    .querySelectorAll("[data-close-occasion]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        closeOccasionModal
      );

    });


  /* =========================================================
     ESC KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        occasionModal.classList.contains("is-open")
      ) {
        closeOccasionModal();
      }

    }
  );

});


/* ===== MOBILE NAVBAR TOGGLE ===== */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    if (
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });document.addEventListener("touchmove", () => {
  closeMenu();
}, { passive: true });



  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
});

/* =====================================
   LUVORA — MY SURPRISE LINKS RECOVERY
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("recoveryModal");
  const openBtn = document.getElementById("openRecoveryBtn");
  const navBtn = document.getElementById("openRecoveryNav");
  const closeBtn = document.getElementById("closeRecoveryBtn");
  const statusBox = document.getElementById("recoveryStatus");
  const listBox = document.getElementById("recoveryList");

  if (!modal || !statusBox || !listBox) return;

  const STORAGE_KEY = "luvoraRecoveryTokens";

  function getSavedTokens() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      if (!Array.isArray(saved)) return [];

      const valid = saved.filter(item =>
        item &&
        typeof item.token === "string" &&
        item.token.length >= 20 &&
        item.created_at &&
        Date.now() - new Date(item.created_at).getTime() <=
          30 * 24 * 60 * 60 * 1000
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid.slice(-100)));

      return valid.map(item => item.token);
    } catch (error) {
      console.error("Recovery storage error:", error);
      return [];
    }
  }

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    loadRecoveryLinks();

    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (openBtn) {
    openBtn.addEventListener("click", openModal);
  }

  if (navBtn) {
    navBtn.addEventListener("click", event => {
      event.preventDefault();
      openModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.querySelectorAll("[data-recovery-close]").forEach(element => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  function showStatus(message) {
    statusBox.textContent = message;
  }

  function createAction(label, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;

    if (className) {
      button.className = className;
    }

    button.addEventListener("click", onClick);

    return button;
  }

  async function copyLink(url, button) {
    try {
      await navigator.clipboard.writeText(url);

      const originalText = button.textContent;
      button.textContent = "Copied!";

      setTimeout(() => {
        button.textContent = originalText;
      }, 1800);

    } catch (error) {
      window.prompt("Copy your surprise link:", url);
    }
  }

  async function shareLink(url, name) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "A Surprise from Luvora",
          text: `Take a look at ${name}'s surprise!`,
          url: url
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      window.open(
        "https://wa.me/?text=" + encodeURIComponent(
          `Here's a special surprise: ${url}`
        ),
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  function renderLinks(links) {
    listBox.replaceChildren();

    if (!Array.isArray(links) || links.length === 0) {
      showStatus("No paid surprise links were found on this browser yet.");
      return;
    }

    showStatus(
      `${links.length} surprise ${links.length === 1 ? "link" : "links"} found.`
    );

    links.forEach(link => {
      if (!link || typeof link.share_url !== "string") return;

      const card = document.createElement("article");
      card.className = "recovery-card";

      const title = document.createElement("h3");
      title.textContent = link.name || "My Surprise";

      const template = document.createElement("p");
      template.textContent = link.template
        ? `Template: ${link.template}`
        : "Your personal surprise";

      const date = document.createElement("p");

      if (link.created_at) {
        const createdDate = new Date(link.created_at);

        date.textContent = !isNaN(createdDate.getTime())
          ? `Created: ${createdDate.toLocaleDateString("en-IN")}`
          : "";
      }

      const actions = document.createElement("div");
      actions.className = "recovery-actions";

      const openLink = document.createElement("a");
      openLink.href = link.share_url;
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";
      openLink.textContent = "Open Surprise";

      const copyButton = createAction(
        "Copy Link",
        "recovery-secondary",
        function () {
          copyLink(link.share_url, this);
        }
      );

      const shareButton = createAction(
        "Share",
        "recovery-secondary",
        () => shareLink(link.share_url, link.name || "your surprise")
      );

      actions.append(openLink, copyButton, shareButton);
      card.append(title, template, date, actions);
      listBox.appendChild(card);
    });
  }

  async function loadRecoveryLinks() {
    listBox.replaceChildren();

    const tokens = getSavedTokens();

    if (tokens.length === 0) {
      showStatus(
        "No saved recovery information was found on this browser. If you have already paid, contact Luvora Support with your payment transaction ID or screenshot."
      );
      return;
    }

    showStatus("Looking for your surprise links...");

    try {
      const config = window.SUPABASE_CONFIG;

      if (!config || !config.url || !config.publishableKey) {
        throw new Error("Website configuration is missing.");
      }

      const response = await fetch(
        `${config.url}/functions/v1/recover-links`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": config.publishableKey,
            "Authorization": `Bearer ${config.publishableKey}`
          },
          body: JSON.stringify({ tokens })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Recovery request failed.");
      }

      renderLinks(result.links);

    } catch (error) {
      console.error("Luvora recovery error:", error);

      showStatus(
        "We couldn't retrieve your links right now. Please try again later or contact Luvora Support."
      );
    }
  }
});
