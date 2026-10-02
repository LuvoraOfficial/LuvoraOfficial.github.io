/* =========================================================
   LUVORA — BIRTHDAY STORY
   BIRTHDAY PAGE INTERACTION ENGINE
   ========================================================= */

const supabaseClient = supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);

async function testSupabaseConnection() {

  try {

    const { data, error } =
      await supabaseClient
        .from("surprises")
        .select("id")
        .limit(1);

    if (error) {
      console.error(
        "Supabase connection test failed:",
        error
      );
      return;
    }

    console.log(
      "✅ Luvora connected to Supabase successfully."
    );

  } catch (error) {

    console.error(
      "Supabase connection error:",
      error
    );

  }

}

testSupabaseConnection();

/* =========================================================
   01 — BASIC CONFIGURATION
   ========================================================= */

const BIRTHDAY_CONFIG = {

  /* Default customer information.
     Later the editor can replace these automatically. */

  name: "My Love",

  date: "",

  /* Balloon messages */

  balloonMessages: [
    "You make my world brighter every single day. ❤️",
    "Your smile is still my favourite thing in the world. ✨",
    "You deserve every beautiful thing life has to offer. 🌷",
    "Life feels a little sweeter because you're in it. 💕",
    "If I could give you one thing, it would be the ability to see yourself through my eyes. 💗"
  ],

  /* Customer photos can later be inserted here */

  photos: [
  "assets/images/birthday/demo-1.jpg",
  "assets/images/birthday/demo-2.jpg",
  "assets/images/birthday/demo-3.jpg",
  "assets/images/birthday/demo-4.jpg",
  "assets/images/birthday/demo-5.jpg",
  "assets/images/birthday/demo-6.jpg"
],

  /* Customer video can later be inserted here */

  video: ""

};

/* =========================================================
   01B — TEMPORARY DRAFT STORAGE
   Keeps customer photos and video available
   while moving between Birthday and Payment pages.
   ========================================================= */

const LUVORA_DRAFT_DB = "luvoraDraftDB";
const LUVORA_DRAFT_STORE = "draftFiles";

function openDraftDatabase() {

  return new Promise((resolve, reject) => {

    const request =
      indexedDB.open(LUVORA_DRAFT_DB, 1);

    request.onupgradeneeded = (event) => {

      const db = event.target.result;

      if (!db.objectStoreNames.contains(LUVORA_DRAFT_STORE)) {

        db.createObjectStore(
          LUVORA_DRAFT_STORE
        );

      }

    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

  });

}


function saveDraftFile(key, file) {

  return openDraftDatabase()
    .then((db) => {

      return new Promise((resolve, reject) => {

        const transaction =
          db.transaction(
            LUVORA_DRAFT_STORE,
            "readwrite"
          );

        const store =
          transaction.objectStore(
            LUVORA_DRAFT_STORE
          );

        store.put(file, key);

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };

        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };

      });

    });

}


function getDraftFile(key) {

  return openDraftDatabase()
    .then((db) => {

      return new Promise((resolve, reject) => {

        const transaction =
          db.transaction(
            LUVORA_DRAFT_STORE,
            "readonly"
          );

        const store =
          transaction.objectStore(
            LUVORA_DRAFT_STORE
          );

        const request =
          store.get(key);

        request.onsuccess = () => {
          db.close();
          resolve(request.result || null);
        };

        request.onerror = () => {
          db.close();
          reject(request.error);
        };

      });

    });

}


function deleteDraftFile(key) {

  return openDraftDatabase()
    .then((db) => {

      return new Promise((resolve, reject) => {

        const transaction =
          db.transaction(
            LUVORA_DRAFT_STORE,
            "readwrite"
          );

        const store =
          transaction.objectStore(
            LUVORA_DRAFT_STORE
          );

        store.delete(key);

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };

        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };

      });

    });

}


/* =========================================================
   02 — DOM ELEMENTS
   ========================================================= */

const birthdayName =
  document.getElementById("birthdayName");

const birthdayDate =
  document.getElementById("birthdayDate");

const finalBirthdayName =
  document.getElementById("finalBirthdayName");

const startSurpriseButton =
  document.getElementById("startSurpriseButton");

const balloonSection =
  document.getElementById("balloonSection");

const balloonStage =
  document.getElementById("balloonStage");

const balloons =
  document.querySelectorAll(".birthday-balloon");

const balloonMessage =
  document.getElementById("balloonMessage");

const balloonMessageText =
  document.getElementById("balloonMessageText");

const loveEnvelope =
  document.getElementById("loveEnvelope");

const letterRecipient =
  document.querySelector(".letter-recipient");

const memoryGallery =
  document.getElementById("memoryGallery");

const birthdayVideo =
  document.getElementById("birthdayVideo");

const birthdayVideoSource =
  document.getElementById("birthdayVideoSource");

const videoPlaceholder =
  document.getElementById("videoPlaceholder");

const cakeSection =
  document.getElementById("cakeSection");

const candles =
  document.querySelectorAll(".cake-candle");

const birthdayWishButton =
  document.getElementById("birthdayWishButton");

const wishMessage =
  document.getElementById("wishMessage");

const floatingHearts =
  document.getElementById("floatingHearts");

const confettiContainer =
  document.getElementById("confettiContainer");

/* =========================================================
   03 — INITIAL CUSTOMER DATA
   ========================================================= */

function loadCustomerDataFromURL() {
  const params = new URLSearchParams(window.location.search);

  const name = params.get("name");
  const date = params.get("date");

  if (name && name.trim()) {
    BIRTHDAY_CONFIG.name = name.trim();
  }

  if (date && date.trim()) {
    BIRTHDAY_CONFIG.date = date.trim();
  }
}

function loadBirthdayInformation() {

  if (birthdayName) {
    birthdayName.textContent =
      BIRTHDAY_CONFIG.name;
  }

  if (birthdayDate) {
    birthdayDate.textContent =
      BIRTHDAY_CONFIG.date;
  }

  if (finalBirthdayName) {
    finalBirthdayName.textContent =
      BIRTHDAY_CONFIG.name;
  }

  if (letterRecipient) {
    letterRecipient.textContent =
      BIRTHDAY_CONFIG.name;
  }

}


/* =========================================================
   04 — START SURPRISE
   ========================================================= */

if (startSurpriseButton) {

  startSurpriseButton.addEventListener(
    "click",
    () => {

      if (balloonSection) {

        balloonSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

      createFloatingHearts(6);

    }
  );

}


/* =========================================================
   05 — BALLOON SYSTEM
   ========================================================= */

let poppedBalloons = 0;

if (balloonStage && balloonMessage) {
  balloonStage.appendChild(balloonMessage);
}

/* =========================================================
   MOBILE BALLOON LAYOUT
   Each balloon gets its own fixed slot so popping one
   never moves or replaces another balloon's message.
   Desktop keeps the original single-message system.
   ========================================================= */

function setupMobileBalloonLayout() {

  if (!balloonStage || window.innerWidth > 800) {
    return;
  }

  balloons.forEach((balloon, index) => {

    if (balloon.parentElement?.classList.contains("mobile-balloon-unit")) {
      return;
    }

    const unit = document.createElement("div");
    unit.className = "mobile-balloon-unit";
    unit.dataset.balloonIndex = String(index);

    balloon.parentNode.insertBefore(unit, balloon);
    unit.appendChild(balloon);

  });
}

setupMobileBalloonLayout();

balloons.forEach((balloon, index) => {

  balloon.addEventListener("click", () => {

    if (balloon.classList.contains("popped")) {
      return;
    }

    poppedBalloons++;

    const message =
      balloon.dataset.message ||
      BIRTHDAY_CONFIG.balloonMessages[index] ||
      "You are incredibly special. ❤️";

    /* =====================================================
       MOBILE — KEEP EVERY POPPED MESSAGE
       ===================================================== */

    if (window.innerWidth <= 800) {

      const unit =
        balloon.closest(".mobile-balloon-unit");

      if (unit && !unit.querySelector(".mobile-balloon-message")) {

        const messageCard = document.createElement("div");
        messageCard.className = "mobile-balloon-message";
        messageCard.setAttribute("aria-live", "polite");

        const heart = document.createElement("span");
        heart.className = "message-heart";
        heart.textContent = "♡";

        const text = document.createElement("p");
        text.textContent = message;

        messageCard.appendChild(heart);
        messageCard.appendChild(text);
        unit.appendChild(messageCard);

        requestAnimationFrame(() => {
          messageCard.classList.add("visible");
        });
      }

    } else {

      if (balloonMessageText) {
        balloonMessageText.textContent = message;
      }

      /*
       * Desktop keeps the original single-message behaviour.
       */
      if (balloonStage && balloonMessage) {

        const balloonRect =
          balloon.getBoundingClientRect();

      const stageRect =
        balloonStage.getBoundingClientRect();

      const messageLeft =
        balloonRect.left -
        stageRect.left +
        balloonRect.width / 2;

      const messageTop =
        balloonRect.top -
        stageRect.top -
        125;

      balloonMessage.style.left =
        `${messageLeft}px`;

        balloonMessage.style.top =
          `${Math.max(20, messageTop)}px`;
      }

      if (balloonMessage) {
        balloonMessage.classList.remove("visible");

        requestAnimationFrame(() => {
          balloonMessage.classList.add("visible");
        });
      }
    }

    balloon.classList.add("popped");

    createFloatingHearts(3);
    createMiniConfetti(12);

    /*
     * Keep the last balloon's own message visible
     * for a while before showing the final message.
     */
    if (poppedBalloons === balloons.length) {

      setTimeout(() => {

        if (balloonMessage) {
          balloonMessage.classList.remove("visible");
        }

        setTimeout(() => {

          if (balloonMessageText) {
            balloonMessageText.textContent =
              "You found every little message. But this is only the beginning... 💖";
          }

          if (balloonMessage) {
            if (window.innerWidth <= 800) {
              balloonMessage.classList.add("mobile-final-balloon-message");
              balloonMessage.style.left = "50%";
              balloonMessage.style.top = "100%";
            }

            balloonMessage.classList.add("visible");
          }

          createFloatingHearts(10);
          createMiniConfetti(30);

        }, 450);

      }, 2300);
    }

  });

});


/* =========================================================
   06 — ENVELOPE / LOVE LETTER
   ========================================================= */

if (loveEnvelope) {

  loveEnvelope.addEventListener(
    "click",
    () => {

      const isOpen =
        loveEnvelope.classList.contains("open");

      if (!isOpen) {

        loveEnvelope.classList.add("open");

        createFloatingHearts(8);

      }

    }
  );

}

/* =========================================================
   07 — MEMORY BOOK
   ========================================================= */

function loadCustomerPhotosFromURL() {

  const params =
    new URLSearchParams(window.location.search);

  const photos =
    params.get("photos");

  if (!photos) return;

  const photoList =
    photos
      .split(",")
      .map(photo => photo.trim())
      .filter(photo => photo);

  if (photoList.length > 0) {

    BIRTHDAY_CONFIG.photos =
      photoList.slice(0, 6);

  }

}


/* =========================================================
   LOAD PHOTOS INTO MEMORY BOOK
   ========================================================= */

function loadMemoryGallery() {

  if (!memoryGallery) {
    return;
  }

  const photoSlots =
    memoryGallery.querySelectorAll(
      ".memory-photo-slot img"
    );

  if (!photoSlots.length) {
    return;
  }

  const photos =
    BIRTHDAY_CONFIG.photos || [];

  /*
    Maximum 6 photos:

    Photo 1 + 2 → Page 1
    Photo 3 + 4 → Page 2
    Photo 5 + 6 → Page 3
  */

  photoSlots.forEach((image, index) => {

    if (photos[index]) {

      image.src =
        photos[index];

      image.alt =
        `Birthday memory ${index + 1}`;

    }

  });

}

/* =========================================================
   MEMORY BOOK — INTERACTION ENGINE
   ========================================================= */

function initMemoryBook() {

  const bookArea =
    document.getElementById("memoryBookArea");

  const book =
    document.getElementById("memoryBook");

  const cover =
    document.getElementById("memoryCover");

  const backCover =
    document.getElementById("memoryBackCover");

  if (
    !bookArea ||
    !book ||
    !cover ||
    !backCover
  ) {
    console.warn(
      "Memory Book elements were not found."
    );
    return;
  }


  const pages =
    Array.from(
      book.querySelectorAll(".memory-page")
    );


  if (!pages.length) {
    console.warn(
      "Memory Book pages were not found."
    );
    return;
  }


  /* =======================================================
     STATE

     0 = Cover
     1 = Page 1
     2 = Page 2
     3 = Page 3
     4 = Back Cover
     ======================================================= */

  let currentPage = 0;

  /* =======================================================
     MOBILE DIARY SCALE
     Keep the complete diary interaction/layout intact.
     On mobile only, compress the visual height to create
     a wider landscape presentation. Desktop is untouched.
     ======================================================= */

  function updateMobileMemoryBookScale() {

    if (window.innerWidth <= 800) {

      const availableWidth =
        Math.max(300, window.innerWidth - 24);

      const scale =
        Math.min(1, availableWidth / 920);

      book.style.zoom = String(scale);

      bookArea.style.minHeight =
        `${650 * scale * 0.8 + 24}px`;

    } else {

      book.style.zoom = "";
      bookArea.style.minHeight = "";

    }
  }

  updateMobileMemoryBookScale();

  window.addEventListener(
    "resize",
    updateMobileMemoryBookScale,
    { passive: true }
  );


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  function setInitialState() {

    currentPage = 0;

    cover.classList.remove(
      "memory-cover-open"
    );

    cover.style.display = "flex";
    cover.style.pointerEvents = "auto";

    pages.forEach(page => {

      page.classList.remove("active");

      page.style.opacity = "0";
      page.style.pointerEvents = "none";

    });

    backCover.style.opacity = "0";
    backCover.style.pointerEvents = "none";

  }


  setInitialState();


  /* =======================================================
     OPEN COVER
     ======================================================= */

  function openMemoryBook() {

    if (currentPage !== 0) {
      return;
    }

    currentPage = 1;

    cover.classList.add(
      "memory-cover-open"
    );


    /*
      Wait until the cover has started
      opening before showing Page 1.
    */

    setTimeout(() => {

      pages.forEach((page, index) => {

        if (index === 0) {

          page.classList.add("active");

          page.style.opacity = "1";
          page.style.pointerEvents = "auto";

        } else {

          page.classList.remove("active");

          page.style.opacity = "0";
          page.style.pointerEvents = "none";

        }

      });

    }, 450);

  }


  /* =======================================================
     SHOW PAGE
     ======================================================= */

  function showPage(pageNumber) {

    if (
      pageNumber < 1 ||
      pageNumber > 3
    ) {
      return;
    }


    currentPage = pageNumber;


    /* Hide back cover */

    backCover.style.opacity = "0";
    backCover.style.pointerEvents = "none";


    /* Show selected page */

    pages.forEach((page, index) => {

      if (index === pageNumber - 1) {

        page.classList.add("active");

        page.style.opacity = "1";
        page.style.pointerEvents = "auto";

      } else {

        page.classList.remove("active");

        page.style.opacity = "0";
        page.style.pointerEvents = "none";

      }

    });

  }


  /* =======================================================
     SHOW BACK COVER
     ======================================================= */

  function showBackCover() {

    currentPage = 4;


    pages.forEach(page => {

      page.classList.remove("active");

      page.style.opacity = "0";
      page.style.pointerEvents = "none";

    });


    backCover.style.opacity = "1";
    backCover.style.pointerEvents = "auto";

  }


  /* =======================================================
     COVER CLICK
     ======================================================= */

  cover.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();

      openMemoryBook();

    }
  );


  /* =======================================================
     NEXT BUTTONS
     ======================================================= */

  const nextButtons =
    book.querySelectorAll(
      ".memory-next-button"
    );


  nextButtons.forEach(button => {

    button.addEventListener(
      "click",
      function(event) {

        event.preventDefault();
        event.stopPropagation();


        const nextPage =
          Number(
            button.getAttribute(
              "data-next-page"
            )
          );


        if (
          nextPage === 2 ||
          nextPage === 3
        ) {

          showPage(nextPage);

        } else if (
          nextPage === 4
        ) {

          showBackCover();

        }

      }
    );

  });


  /* =======================================================
     KEYBOARD — RIGHT ARROW
     ======================================================= */

  document.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key !== "ArrowRight"
      ) {
        return;
      }


      if (currentPage === 0) {

        openMemoryBook();

      } else if (
        currentPage === 1
      ) {

        showPage(2);

      } else if (
        currentPage === 2
      ) {

        showPage(3);

      } else if (
        currentPage === 3
      ) {

        showBackCover();

      }

    }
  );


  /* =======================================================
     KEYBOARD — LEFT ARROW
     ======================================================= */

  document.addEventListener(
    "keydown",
    function(event) {

      if (
        event.key !== "ArrowLeft"
      ) {
        return;
      }


      if (currentPage === 4) {

        showPage(3);

      } else if (
        currentPage === 3
      ) {

        showPage(2);

      } else if (
        currentPage === 2
      ) {

        showPage(1);

      }

    }
  );


  /* =======================================================
     TOUCH / SWIPE SUPPORT
     ======================================================= */

  let touchStartX = 0;
  let touchEndX = 0;


  bookArea.addEventListener(
    "touchstart",
    function(event) {

      if (
        !event.touches ||
        !event.touches.length
      ) {
        return;
      }

      touchStartX =
        event.touches[0].clientX;

    },
    { passive: true }
  );


  bookArea.addEventListener(
    "touchend",
    function(event) {

      if (
        !event.changedTouches ||
        !event.changedTouches.length
      ) {
        return;
      }

      touchEndX =
        event.changedTouches[0].clientX;


      const swipeDistance =
        touchEndX - touchStartX;


      /* Swipe left → next */

      if (swipeDistance < -50) {

        if (currentPage === 0) {

          openMemoryBook();

        } else if (
          currentPage < 3
        ) {

          showPage(
            currentPage + 1
          );

        } else if (
          currentPage === 3
        ) {

          showBackCover();

        }

      }


      /* Swipe right → previous */

      if (swipeDistance > 50) {

        if (currentPage === 4) {

          showPage(3);

        } else if (
          currentPage > 1
        ) {

          showPage(
            currentPage - 1
          );

        }

      }

    },
    { passive: true }
  );

}


/* =========================================================
   START MEMORY BOOK
   ========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initMemoryBook,
    { once: true }
  );

} else {

  initMemoryBook();

}

/* =========================================================
   08 — VIDEO SYSTEM
   ========================================================= */

function loadBirthdayVideo() {

  if (!birthdayVideo || !birthdayVideoSource) {
    return;
  }

  if (!BIRTHDAY_CONFIG.video) {
    return;
  }

  birthdayVideoSource.src =
    BIRTHDAY_CONFIG.video;

  birthdayVideo.load();

  if (videoPlaceholder) {
    videoPlaceholder.style.display =
      "none";
  }

  /* =====================================================
     DETECT VIDEO ORIENTATION
     ===================================================== */

  birthdayVideo.onloadedmetadata = () => {

    const videoWidth =
      birthdayVideo.videoWidth;

    const videoHeight =
      birthdayVideo.videoHeight;

    if (!videoWidth || !videoHeight) {
      return;
    }

    const wrapper =
      birthdayVideo.closest(
        ".birthday-video-wrapper"
      );

    if (!wrapper) {
      return;
    }

    /* Portrait / Reel video */

    if (videoHeight > videoWidth) {

      wrapper.classList.add(
        "portrait-video"
      );

    } else {

      wrapper.classList.remove(
        "portrait-video"
      );

    }

  };

}


/* =========================================================
   09 — CANDLE SYSTEM
   ========================================================= */

let blownCandles = 0;

candles.forEach((candle) => {

  candle.addEventListener("click", () => {

    if (candle.classList.contains("blown")) {
      return;
    }

    candle.classList.add("blown");

    blownCandles++;

    createSmoke(candle);

    /* =====================================================
       LAST CANDLE — INSTANT MAGICAL REVEAL
       ===================================================== */

    if (blownCandles === candles.length) {

      // No pause — reveal starts immediately
      magicalCakeReveal();

      createMiniConfetti(45);
      createFloatingHearts(15);

    }

  });

});

/* =========================================================
   REALISTIC CANDLE SMOKE
   ========================================================= */

function createSmoke(candle) {

  if (!candle) return;

  const flame =
    candle.querySelector(".candle-flame");

  const smoke =
    document.createElement("div");

  smoke.className = "realistic-candle-smoke";

  const flameRect =
    flame
      ? flame.getBoundingClientRect()
      : candle.getBoundingClientRect();

  smoke.style.left =
    `${flameRect.left + flameRect.width / 2}px`;

  smoke.style.top =
    `${flameRect.top + flameRect.height / 2}px`;

  document.body.appendChild(smoke);

  smoke.animate(
    [
      {
        opacity: 0,
        transform:
          "translate(-50%, 0) scale(0.35)"
      },

      {
        opacity: 0.42,
        transform:
          "translate(-50%, -35px) scale(1)"
      },

      {
        opacity: 0.22,
        transform:
          "translate(-42%, -85px) scale(1.6)"
      },

      {
        opacity: 0,
        transform:
          "translate(-60%, -135px) scale(2.3)"
      }
    ],
    {
      duration: 1800,
      easing: "ease-out",
      fill: "forwards"
    }
  );

  setTimeout(() => {
    smoke.remove();
  }, 1900);

}


/* =========================================================
   MAGICAL CAKE REVEAL
   ========================================================= */

function magicalCakeReveal() {

  const cakeScene = document.querySelector(".cake-scene");
  const cake = document.querySelector(".birthday-cake");

  if (!cakeScene || !cake) return;

  /* Prevent the magical reveal from running twice */

  if (cakeScene.classList.contains("magical-reveal")) {
    return;
  }

  cakeScene.classList.add("magical-reveal");
  cake.classList.add("cake-magical-glow");


  /* =====================================================
     LIGHT BURST
     ===================================================== */

  const burst = document.createElement("div");

  burst.className = "cake-light-burst";

  cakeScene.appendChild(burst);

  setTimeout(() => {
    burst.remove();
  }, 1400);


  /* =====================================================
     SPARKLES
     ===================================================== */

  for (let i = 0; i < 40; i++) {

    const sparkle =
      document.createElement("span");

    sparkle.className =
      "cake-sparkle";

    sparkle.style.setProperty(
      "--spark-x",
      `${(Math.random() - 0.5) * 460}px`
    );

    sparkle.style.setProperty(
      "--spark-y",
      `${(Math.random() - 0.5) * 350}px`
    );

    sparkle.style.setProperty(
      "--spark-delay",
      `${Math.random() * 0.45}s`
    );

    cakeScene.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 1900);
  }


  /* =====================================================
     FLOATING HEARTS
     ===================================================== */

  for (let i = 0; i < 14; i++) {

    const heart =
      document.createElement("span");

    heart.className =
      "cake-reveal-heart";

    heart.textContent = "♥";

    heart.style.setProperty(
      "--heart-x",
      `${(Math.random() - 0.5) * 380}px`
    );

    heart.style.setProperty(
      "--heart-y",
      `${-100 - Math.random() * 220}px`
    );

    heart.style.setProperty(
      "--heart-delay",
      `${Math.random() * 0.4}s`
    );

    cakeScene.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2300);
  }


  /* =====================================================
     WISH BUTTON REVEAL
     ===================================================== */

  setTimeout(() => {

    if (birthdayWishButton) {

      birthdayWishButton.classList.add(
        "magical-wish-ready"
      );

    }

  }, 600);

}

/* =========================================================
   11 — BIRTHDAY WISH
   ========================================================= */

if (birthdayWishButton) {

  birthdayWishButton.addEventListener(
    "click",
    () => {

      /** Prevent opening the gift twice.*/

      if (
        birthdayWishButton.classList.contains(
          "gift-open"
        )
      ) {
        return;
      }

           birthdayWishButton.classList.add(
        "gift-open"
      );

      /*
       * Let the lid open first.
       */
      setTimeout(() => {

        if (wishMessage) {
          wishMessage.classList.add(
            "visible"
          );
        }

        createMiniConfetti(45);
        createFloatingHearts(12);

      }, 850);
    }
  );

}

         
/* =========================================================
   12 — FLOATING HEART GENERATOR
   ========================================================= */

function createFloatingHearts(amount = 5) {

  if (!floatingHearts) {
    return;
  }

  for (let i = 0; i < amount; i++) {

    const heart =
      document.createElement("span");

    heart.className =
      "floating-heart";

    const symbols = [
      "♡",
      "♥",
      "❤",
      "✦"
    ];

    heart.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];

    heart.style.left =
      `${Math.random() * 100}%`;

    heart.style.animationDuration =
      `${4 + Math.random() * 4}s`;

    heart.style.fontSize =
      `${12 + Math.random() * 18}px`;

    heart.style.animationDelay =
      `${Math.random() * 0.7}s`;

    floatingHearts.appendChild(heart);

    setTimeout(() => {

      heart.remove();

    }, 8500);

  }

}


/* =========================================================
   13 — CONFETTI GENERATOR
   ========================================================= */

function createMiniConfetti(amount = 20) {

  if (!confettiContainer) {
    return;
  }

  for (let i = 0; i < amount; i++) {

    const piece =
      document.createElement("span");

    piece.className =
      "confetti-piece";

    const shapes = [
      "4px",
      "7px",
      "10px"
    ];

    piece.style.width =
      shapes[
        Math.floor(
          Math.random() *
          shapes.length
        )
      ];

    piece.style.height =
      `${8 + Math.random() * 10}px`;

    piece.style.left =
      `${Math.random() * 100}%`;

    piece.style.opacity =
      `${0.5 + Math.random() * 0.5}`;

    piece.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    piece.style.background =
      getConfettiColor();

    piece.style.animationDuration =
      `${2.5 + Math.random() * 2.5}s`;

    piece.style.animationDelay =
      `${Math.random() * 0.4}s`;

    confettiContainer.appendChild(piece);

    setTimeout(() => {

      piece.remove();

    }, 6000);

  }

}


/* =========================================================
   14 — CONFETTI COLORS
   ========================================================= */

function getConfettiColor() {

  const colors = [
    "#ffd1e1",
    "#ff9fc3",
    "#d9c1ff",
    "#ffe4a6",
    "#a9dcff",
    "#ffffff"
  ];

  return colors[
    Math.floor(
      Math.random() *
      colors.length
    )
  ];

}



/* =========================================================
   16 — SECTION REVEAL ANIMATION
   ========================================================= */

const revealSections =
  document.querySelectorAll(
    ".birthday-section, .final-surprise"
  );

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "section-visible"
          );

        }

      });

    },
    {
      threshold: 0.12
    }
  );


revealSections.forEach((section) => {

  revealObserver.observe(section);

});


/* =========================================================
   17 — ADD REVEAL CSS THROUGH JAVASCRIPT
   ========================================================= */

const revealStyle =
  document.createElement("style");

revealStyle.textContent = `

  .birthday-section,
  .final-surprise {
    opacity: 0;
    transform: translateY(30px);
    transition:
      opacity 1s ease,
      transform 1s ease;
  }

  .birthday-section.section-visible,
  .final-surprise.section-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .birthday-hero {
    opacity: 1 !important;
    transform: none !important;
  }

`;

document.head.appendChild(revealStyle);


/* =========================================================
   18 — GENTLE BACKGROUND HEARTS
   ========================================================= */

let backgroundHeartTimer;

function startBackgroundHearts() {

  backgroundHeartTimer =
    setInterval(() => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        createFloatingHearts(1);

      }

    }, 3500);

}


/* =========================================================
   19 — INITIALIZE
   ========================================================= */

function setupCustomizationSystem() {
  const editButton = document.getElementById("editSurpriseButton");
  const customizationPanel = document.getElementById("customizationPanel");

  const customerName = document.getElementById("customerName");
  const customerDate = document.getElementById("customerDate");
  const customerPhotos = document.getElementById("customerPhotos");
  const customerVideo = document.getElementById("customerVideo");

  const previewButton =
    document.getElementById("previewSurpriseButton");

  const previewStatus =
    document.getElementById("previewStatus");

  const previewActions =
    document.getElementById("previewActions");

  const backToEditButton =
    document.getElementById("backToEditButton");

  const previewCreateButton =
    document.getElementById("previewCreateButton");

if (customerName) {
  customerName.value = BIRTHDAY_CONFIG.name;
}

if (customerDate) {
  customerDate.value = BIRTHDAY_CONFIG.date;
}

  const birthdayName = document.getElementById("birthdayName");
  const birthdayDate = document.getElementById("birthdayDate");
  const finalBirthdayName = document.getElementById("finalBirthdayName");
  const letterRecipients = document.querySelectorAll(".letter-recipient");


if (editButton && customizationPanel) {
  editButton.addEventListener("click", () => {

    document.body.classList.remove("preview-mode");

    if (previewActions) {
      previewActions.classList.remove("show");
    }

    customizationPanel.scrollIntoView({
      behavior: "auto",
      block: "start"
    });

  });
} 

function updateBirthdayName() {

  const name =
    customerName
      ? customerName.value.trim()
      : "";

  if (!name) return;

  if (birthdayName) {
    birthdayName.textContent = name;
  }

  letterRecipients.forEach((recipient) => {
    recipient.textContent = name;
  });
}


if (customerName) {

  customerName.addEventListener(
    "input",
    updateBirthdayName
  );

  updateBirthdayName();
}


if (customerPhotos) {

  const photoPreview =
    document.getElementById("customPhotoPreview");

  const DEMO_PHOTOS = [
    "assets/images/birthday/demo-1.jpg",
    "assets/images/birthday/demo-2.jpg",
    "assets/images/birthday/demo-3.jpg",
    "assets/images/birthday/demo-4.jpg",
    "assets/images/birthday/demo-5.jpg",
    "assets/images/birthday/demo-6.jpg"
  ];

  let uploadedPhotoUrls = [];

  let uploadedPhotoFiles = [];


  /* =====================================================
     UPDATE PHOTO GALLERY
     ===================================================== */

  function updateCustomPhotos() {

    BIRTHDAY_CONFIG.photos =
      DEMO_PHOTOS.map(
        (demoPhoto, index) =>
          uploadedPhotoUrls[index] || demoPhoto
      );

    loadMemoryGallery();


    /* ===================================================
       UPDATE SMALL PHOTO PREVIEWS
       =================================================== */

    if (photoPreview) {

      photoPreview.innerHTML = "";

      uploadedPhotoUrls.forEach(
        (photoUrl, index) => {

          const photoItem =
            document.createElement("div");

          photoItem.className =
            "custom-photo-item";


          const image =
            document.createElement("img");

          image.src = photoUrl;

          image.alt =
            `Selected photo ${index + 1}`;


          const removeButton =
            document.createElement("button");

          removeButton.type = "button";

          removeButton.className =
            "remove-custom-photo";

          removeButton.setAttribute(
            "aria-label",
            `Remove photo ${index + 1}`
          );

          removeButton.textContent = "×";


          removeButton.addEventListener(
            "click",
            async () => {

              URL.revokeObjectURL(
                photoUrl
              );

              uploadedPhotoUrls.splice(
                index,
                1
              );

              uploadedPhotoFiles.splice(
                index,
                1
              );


              /* Remove the corresponding
                 saved file */

              await deleteDraftFile(
                `photo-${index}`
              );


              /* Re-save remaining photos
                 with correct positions */

              for (
                let i = 0;
                i < uploadedPhotoFiles.length;
                i++
              ) {

                await saveDraftFile(
                  `photo-${i}`,
                  uploadedPhotoFiles[i]
                );

              }


              updateCustomPhotos();

              updatePhotoInputState();

            }
          );


          photoItem.appendChild(image);

          photoItem.appendChild(
            removeButton
          );

          photoPreview.appendChild(
            photoItem
          );

        }
      );

    }

  }


  /* =====================================================
     PHOTO INPUT STATE
     ===================================================== */

  function updatePhotoInputState() {

    const reachedLimit =
      uploadedPhotoFiles.length >= 6;

    customerPhotos.disabled =
      reachedLimit;


    if (reachedLimit) {

      customerPhotos.title =
        "Maximum 6 photos allowed";

    } else {

      customerPhotos.title =
        `${6 - uploadedPhotoFiles.length} photo slot(s) remaining`;

    }

  }


  /* =====================================================
     PHOTO FILE SELECTION
     ===================================================== */

  customerPhotos.addEventListener(
    "change",
    async () => {

      const files =
        Array.from(
          customerPhotos.files
        );

      if (files.length === 0) {
        return;
      }


      const remainingSlots =
        6 - uploadedPhotoFiles.length;


      const filesToAdd =
        files.slice(
          0,
          remainingSlots
        );


      for (const file of filesToAdd) {

        const photoUrl =
          URL.createObjectURL(file);


        uploadedPhotoUrls.push(
          photoUrl
        );


        uploadedPhotoFiles.push(
          file
        );


        /* Save the actual file,
           not just the preview URL */

        const photoIndex =
          uploadedPhotoFiles.length - 1;


        await saveDraftFile(
          `photo-${photoIndex}`,
          file
        );

      }


      /* Reset file input so the
         same file can be selected again */

      customerPhotos.value = "";


      updateCustomPhotos();

      updatePhotoInputState();

    }
  );


  /* =====================================================
     RESTORE SAVED PHOTOS
     ===================================================== */

  async function restoreSavedPhotos() {

    for (let i = 0; i < 6; i++) {

      const file =
        await getDraftFile(
          `photo-${i}`
        );


      if (!file) {
        break;
      }


      const photoUrl =
        URL.createObjectURL(file);


      uploadedPhotoFiles.push(
        file
      );

      uploadedPhotoUrls.push(
        photoUrl
      );

    }


    updateCustomPhotos();

    updatePhotoInputState();

  }


  restoreSavedPhotos();

}

if (customerVideo) {

    /* =====================================================
     VIDEO CUSTOMIZATION
     ===================================================== */

  if (customerVideo) {

    const customVideoName =
      document.getElementById("customVideoName");

    let currentVideoUrl = "";


    /* ===================================================
       VIDEO FILE SELECTION
       =================================================== */

    customerVideo.addEventListener(
      "change",
      async () => {

        const file =
          customerVideo.files[0];

        if (!file) {
          return;
        }


        /* Remove previous preview URL */

        if (currentVideoUrl) {

          URL.revokeObjectURL(
            currentVideoUrl
          );

        }


        /* Create new preview URL */

        currentVideoUrl =
          URL.createObjectURL(file);


        BIRTHDAY_CONFIG.video =
          currentVideoUrl;


        /* Show selected filename */

        if (customVideoName) {

          customVideoName.textContent =
            `Selected: ${file.name}`;

        }


        /* Save actual video file */

        try {

          await saveDraftFile(
            "video",
            file
          );

        } catch (error) {

          console.error(
            "Could not save video:",
            error
          );

        }


        loadBirthdayVideo();

      }
    );


    /* ===================================================
       RESTORE SAVED VIDEO
       =================================================== */

    async function restoreSavedVideo() {

      try {

        const savedVideo =
          await getDraftFile("video");


        if (!savedVideo) {
          return;
        }


        currentVideoUrl =
          URL.createObjectURL(
            savedVideo
          );


        BIRTHDAY_CONFIG.video =
          currentVideoUrl;


        if (customVideoName) {

          customVideoName.textContent =
            `Selected: ${savedVideo.name}`;

        }


        loadBirthdayVideo();

      } catch (error) {

        console.error(
          "Could not restore saved video:",
          error
        );

      }

    }


    restoreSavedVideo();

  }
}

  if (previewButton) {

  previewButton.addEventListener("click", () => {

    if (previewStatus) {
      previewStatus.classList.add("show");
      previewStatus.textContent =
        "✨ Your personalized preview is ready.";
    }

    if (previewActions) {
      previewActions.classList.add("show");
    }

    document.body.classList.add("preview-mode");

    const hero =
      document.getElementById("birthdayHero");

    if (hero) {
      hero.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    createFloatingHearts();
    createMiniConfetti();

  });

}


if (backToEditButton) {
  backToEditButton.addEventListener("click", () => {

    if (previewActions) {
      previewActions.classList.remove("show");
    }

document.body.classList.remove("preview-mode");

    if (previewStatus) {
      previewStatus.classList.remove("show");
    }

    if (customizationPanel) {
      customizationPanel.classList.add("active");

      customizationPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

/* =========================================================
   CREATE SURPRISE → SAVE DATA → PAYMENT
   ========================================================= */

const createSurpriseButton =
  document.getElementById("previewCreateButton");

if (createSurpriseButton) {

  createSurpriseButton.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      /* =================================================
         GET CUSTOMER INFORMATION
         ================================================= */

      const name =
        customerName
          ? customerName.value.trim()
          : "";

      const date =
        customerDate
          ? customerDate.value
          : "";

       if (!name) {
  alert("Please enter a name.");
  return;
}

if (!date) {
  alert("Please select the special date.");
  return;
}

      /* =================================================
         CREATE TEMPORARY DRAFT ID
         ================================================= */

      const draftId =
        "draft-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 10);

      /* =================================================
         CREATE SURPRISE DATA
         ================================================= */

      const surpriseData = {

        draftId: draftId,

        template:
          "birthday-story",

        name:
           name,

        date:
         date,

        mediaStorage:
          "indexeddb"

      };

      /* =================================================
         SERIALIZE DATA
         ================================================= */

      const serializedData =
        JSON.stringify(
          surpriseData
        );

      /* =================================================
         SAVE TO SESSION STORAGE
         ================================================= */

      sessionStorage.setItem(
        "luvoraSurpriseData",
        serializedData
      );

      /* =================================================
         BACKUP COPY
         ================================================= */

      localStorage.setItem(
        "luvoraSurpriseData",
        serializedData
      );

      /* =================================================
         VERIFY DATA WAS SAVED
         ================================================= */

      const savedData =
        sessionStorage.getItem(
          "luvoraSurpriseData"
        ) ||
        localStorage.getItem(
          "luvoraSurpriseData"
        );

      if (!savedData) {

        alert(
          "Your surprise information could not be saved. Please try again."
        );

        return;

      }

      /* =================================================
         CONTINUE TO PAYMENT
         ================================================= */

      window.location.href =
        "payment.html";

    }
  );

}
    }

 function initializeBirthdayExperience() {
  loadCustomerDataFromURL();
  loadCustomerPhotosFromURL();
  loadBirthdayInformation();
  loadMemoryGallery();
  loadBirthdayVideo();
  setupCustomizationSystem();
  startBackgroundHearts();
}


/* =========================================================
   20 — START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeBirthdayExperience
  );

} else {

  initializeBirthdayExperience();

}
