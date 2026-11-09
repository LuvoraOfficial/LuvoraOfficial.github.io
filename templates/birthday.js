/* =========================================
   LUVORA — RESET GIFT SCREEN ON REFRESH
========================================= */

(() => {
  const navigation = performance.getEntriesByType("navigation")[0];

  const isRefresh = navigation?.type === "reload";
  const isGiftScreen = window.location.hash === "#giftExperience";

  if (isRefresh && isGiftScreen) {
    const birthdayUrl = new URL(window.location.href);

    birthdayUrl.hash = "";

    window.location.replace(birthdayUrl.toString());
  }
})();

/* =========================================================
   LUVORA — CUSTOMIZATION / FINAL SURPRISE MODE
   ========================================================= */

const LUVORA_URL_PARAMS =
  new URLSearchParams(window.location.search);

const LUVORA_SHARE_ID =
  LUVORA_URL_PARAMS.get("id");

const LUVORA_IS_FINAL_SURPRISE =
  Boolean(LUVORA_SHARE_ID);

if (LUVORA_IS_FINAL_SURPRISE) {
  document.documentElement.classList.add("luvora-final-mode");
}

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

/* =========================================
   LUVORA — DRAFT REFRESH CONTROL
========================================= */

async function clearAllDraftFiles() {
  const db = await openDraftDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      LUVORA_DRAFT_STORE,
      "readwrite"
    );

    transaction.objectStore(
      LUVORA_DRAFT_STORE
    ).clear();

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}


/* Clear temporary uploaded files on fresh page load */

const LUVORA_DRAFT_READY = clearAllDraftFiles();

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
  document.getElementById("memoryBook");

const birthdayVideo =
  document.getElementById("birthdayVideo");

const birthdayVideoSource =
  document.getElementById("birthdayVideoSource");

const videoPlaceholder =
  document.getElementById("videoPlaceholder");


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
    BIRTHDAY_CONFIG.name || "My Love";
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
if (balloonContinueButton) {
  balloonContinueButton.classList.add(
    "balloon-continue-hidden"
  );
}

if (balloonStage && balloonMessage) {
  balloonStage.appendChild(balloonMessage);
}

/* =====================================================
   MOBILE BALLOON LAYOUT
===================================================== */

function setupMobileBalloonLayout() {

  if (!balloonStage || window.innerWidth > 800) {
    return;
  }

  balloons.forEach((balloon, index) => {

    if (
      balloon.parentElement?.classList.contains(
        "mobile-balloon-unit"
      )
    ) {
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


/* =====================================================
   DESKTOP MESSAGE CONTAINER
===================================================== */

function getDesktopBalloonMessageList() {

  let list = document.getElementById(
    "desktopBalloonMessages"
  );

  if (list) return list;

  list = document.createElement("div");

  list.id = "desktopBalloonMessages";
  list.className = "desktop-balloon-messages";

  const hint = balloonStage.parentElement.querySelector(
    ".interaction-hint"
  );

  if (hint) {
    hint.insertAdjacentElement("afterend", list);
  } else {
    balloonStage.insertAdjacentElement("afterend", list);
  }

  return list;

}


/* =====================================================
   BALLOON CLICK EVENTS
===================================================== */

balloons.forEach((balloon, index) => {

  balloon.addEventListener("click", () => {

    if (balloon.classList.contains("popped")) {
      return;
    }

    playLuvoraBalloonPop();

    poppedBalloons++;

    const message =
      balloon.dataset.message ||
      BIRTHDAY_CONFIG.balloonMessages[index] ||
      "You are incredibly special. ❤️";


    /* =============================================
       MOBILE — KEEP EVERY MESSAGE
    ============================================= */

    if (window.innerWidth <= 800) {

      const unit = balloon.closest(
        ".mobile-balloon-unit"
      );

      if (
        unit &&
        !unit.querySelector(".mobile-balloon-message")
      ) {

        const messageCard =
          document.createElement("div");

        messageCard.className =
          "mobile-balloon-message";

        messageCard.setAttribute(
          "aria-live",
          "polite"
        );

        const heart =
          document.createElement("span");

        heart.className = "message-heart";
        heart.textContent = "♡";

        const text =
          document.createElement("p");

        text.textContent = message;

        messageCard.appendChild(heart);
        messageCard.appendChild(text);

        unit.appendChild(messageCard);

      requestAnimationFrame(() => {

  messageCard.classList.add("visible");

  setTimeout(() => {

    messageCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }, 250);

});

      }

    }


    /* =============================================
       DESKTOP — KEEP EVERY MESSAGE
    ============================================= */

    else {

      const messageList =
        getDesktopBalloonMessageList();

      const messageCard =
        document.createElement("div");

      messageCard.className =
        "desktop-balloon-message";

      const heart =
        document.createElement("span");

      heart.className = "message-heart";
      heart.textContent = "♡";

      const text =
        document.createElement("p");

      text.textContent = message;

      messageCard.appendChild(heart);
      messageCard.appendChild(text);

      messageList.appendChild(messageCard);
requestAnimationFrame(() => {

  messageCard.classList.add("visible");

  setTimeout(() => {

    messageCard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }, 250);

});    }


    /* =============================================
       BALLOON POP EFFECTS
    ============================================= */

    balloon.classList.add("popped");

    createFloatingHearts(3);
    createMiniConfetti(12);


     /* =============================================
       FINAL MESSAGE — AFTER ALL BALLOONS
    ============================================= */

    if (poppedBalloons === balloons.length) {

      setTimeout(() => {

        // Celebration effects
        createFloatingHearts(10);
        createMiniConfetti(30);

        // Continue button
        if (balloonContinueButton) {

          balloonContinueButton.classList.remove(
            "balloon-continue-hidden"
          );

          requestAnimationFrame(() => {

            setTimeout(() => {

              balloonContinueButton.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });

            }, 500);

          });

        }

      }, 500);

    }

  });

});
        createMiniConfetti(30);


/* =========================================================
   LUVORA — ROYAL LOVE LETTER
   Typing Animation + Personal Editor + Auto Font Size
   ========================================================= */

const letterMessage = document.getElementById("letterMessage");
const editLetterButton = document.getElementById("editLetterButton");
const letterEditor = document.getElementById("letterEditor");
const letterMessageInput = document.getElementById("letterMessageInput");
const saveLetterButton = document.getElementById("saveLetterButton");
const cancelLetterButton = document.getElementById("cancelLetterButton");

const LUVORA_LETTER_STORAGE_KEY = "luvora_personal_love_letter_v1";

let letterTypingTimer = null;
let letterTypingStarted = false;
let letterTypingCancelled = false;


/* ---------------------------------------------------------
   1. GET CURRENT LETTER TEXT
--------------------------------------------------------- */

function getLetterText() {
  if (!letterMessage) return "";

  return Array.from(letterMessage.querySelectorAll("p"))
    .map(function (paragraph) {
      return paragraph.textContent.trim();
    })
    .filter(Boolean)
    .join("\n\n");
}


/* ---------------------------------------------------------
   2. AUTOMATIC FONT SIZE
--------------------------------------------------------- */

function adjustLetterFontSize() {
  if (!letterMessage) return;

  const text = getLetterText();
  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  let fontSize;

  if (wordCount > 180) {
    fontSize = 12;
  } else if (wordCount > 130) {
    fontSize = 13;
  } else if (wordCount > 85) {
    fontSize = 14;
  } else if (wordCount > 45) {
    fontSize = 15;
  } else {
    fontSize = 16;
  }

  const paragraphs = letterMessage.querySelectorAll("p");

  paragraphs.forEach(function (paragraph) {
    paragraph.style.setProperty(
      "font-size",
      `clamp(${Math.max(12, fontSize - 1)}px, ${fontSize}px, ${fontSize}px)`,
      "important"
    );

    paragraph.style.setProperty(
      "line-height",
      "1.65",
      "important"
    );
  });
}


/* ---------------------------------------------------------
   3. DISPLAY LETTER TEXT
--------------------------------------------------------- */

function renderLetterText(text, shouldAnimate) {
  if (!letterMessage) return;

  letterTypingCancelled = true;

  if (letterTypingTimer) {
    clearTimeout(letterTypingTimer);
    letterTypingTimer = null;
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map(function (paragraph) {
      return paragraph.trim();
    })
    .filter(Boolean);

  letterMessage.replaceChildren();

  paragraphs.forEach(function (paragraphText) {
    const paragraph = document.createElement("p");
    paragraph.textContent = shouldAnimate ? "" : paragraphText;
    paragraph.dataset.fullText = paragraphText;

    letterMessage.appendChild(paragraph);
  });

  adjustLetterFontSize();

  if (!shouldAnimate) return;

  letterTypingCancelled = false;

  let paragraphIndex = 0;
  let characterIndex = 0;

  const paragraphElements = letterMessage.querySelectorAll("p");

  function typeNextCharacter() {
    if (letterTypingCancelled) return;

    if (paragraphIndex >= paragraphElements.length) {
      letterTypingTimer = null;
      adjustLetterFontSize();
      return;
    }

    const paragraph = paragraphElements[paragraphIndex];
    const fullText = paragraph.dataset.fullText;

    if (characterIndex < fullText.length) {
      paragraph.textContent += fullText.charAt(characterIndex);
      characterIndex++;

      letterTypingTimer = setTimeout(typeNextCharacter, 13);
    } else {
      paragraphIndex++;
      characterIndex = 0;

      letterTypingTimer = setTimeout(typeNextCharacter, 180);
    }
  }

  typeNextCharacter();
}


function restorePersonalLetter() {
  try {
    localStorage.removeItem(LUVORA_LETTER_STORAGE_KEY);
  } catch (error) {
    console.warn("LUVORA letter reset failed.", error);
  }
}

restorePersonalLetter();

/* ---------------------------------------------------------
   5. OPEN ENVELOPE + START TYPING
--------------------------------------------------------- */

if (loveEnvelope) {
  loveEnvelope.addEventListener("click", function (event) {
    // Do not toggle the envelope when clicking its contents.
    if (event.target.closest("a, input, textarea, select, label")) {
      return;
    }

    const isOpen = loveEnvelope.classList.contains("open");

    if (!isOpen) {
      loveEnvelope.classList.add("open");

      createFloatingHearts(8);

      if (!letterTypingStarted && letterMessage) {
        letterTypingStarted = true;

        const currentText = getLetterText();

        if (currentText) {
          renderLetterText(currentText, true);
        }
      }
    }
  });
}


/* ---------------------------------------------------------
   6. EDIT LETTER
--------------------------------------------------------- */

if (editLetterButton && letterEditor && letterMessageInput) {
  editLetterButton.addEventListener("click", function () {
    letterMessageInput.value = getLetterText();
    letterEditor.hidden = false;
    letterMessageInput.focus();
  });
}


/* ---------------------------------------------------------
   7. SAVE PERSONAL LETTER
--------------------------------------------------------- */

if (saveLetterButton && letterMessageInput) {
  saveLetterButton.addEventListener("click", function () {
    const newText = letterMessageInput.value.trim();

    if (!newText) {
      alert("Please write something for your letter first.");
      letterMessageInput.focus();
      return;
    }

    letterTypingCancelled = true;

    if (letterTypingTimer) {
      clearTimeout(letterTypingTimer);
      letterTypingTimer = null;
    }

    renderLetterText(newText, false);
    letterTypingStarted = true;

    try {
      localStorage.setItem(
        LUVORA_LETTER_STORAGE_KEY,
        newText
      );
    } catch (error) {
      console.warn("LUVORA could not save this letter.", error);
    }

    letterEditor.hidden = true;
  });
}


/* ---------------------------------------------------------
   8. CANCEL EDITING
--------------------------------------------------------- */

if (cancelLetterButton && letterEditor) {
  cancelLetterButton.addEventListener("click", function () {
    letterEditor.hidden = true;
  });
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

BIRTHDAY_CONFIG.photos = uploadedPhotoUrls.slice(0, 4);
  
}

}


/* =========================================================
   LOAD PHOTOS INTO MEMORY BOOK — MAXIMUM 4
========================================================= */

function loadMemoryGallery() {

  if (!memoryGallery) return;

  const photos = (
    BIRTHDAY_CONFIG.photos || []
  ).slice(0, 4);

  const page1 = memoryGallery.querySelector(
    ".memory-page-1"
  );

  const page2 = memoryGallery.querySelector(
    ".memory-page-2"
  );

  const photoSlots = memoryGallery.querySelectorAll(
    ".memory-photo-slot img"
  );

  // Load only uploaded photos
  photoSlots.forEach((image, index) => {

    if (photos[index]) {

      image.src = photos[index];

      image.alt = `Birthday memory ${index + 1}`;

    } else {

      image.removeAttribute("src");

      image.alt = "";

    }

  });

 // Show Page 2 only when exactly 4 photos exist
if (page2) {
  page2.style.display =
    photos.length === 4 ? "" : "none";
}

// Always hide Page 3 and any extra pages
memoryGallery.querySelectorAll(".memory-page").forEach(
  (page, index) => {
    if (index >= 2) {
      page.style.display = "none";
    }
  }
);

  // Page 1 goes directly to Back Cover when only 2 photos exist
  const page1Next = page1?.querySelector(
    ".memory-next-button"
  );

  if (page1Next) {

    page1Next.setAttribute(
      "data-next-page",
      photos.length === 4 ? "2" : "4"
    );

  }

  // Page 2 always goes to Back Cover
  const page2Next = page2?.querySelector(
    ".memory-next-button"
  );

  if (page2Next) {

    page2Next.setAttribute(
      "data-next-page",
      "4"
    );

  }

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
/* =========================================
   LUVORA — MOBILE MEMORY DIARY
========================================= */

const mobileDiary = document.createElement("div");
mobileDiary.className = "mobile-memory-diary";
mobileDiary.setAttribute("aria-live", "polite");


const mobilePhotos = [];

/* =========================================
   REFRESH MOBILE PHOTOS FROM LIVE GALLERY
========================================= */

function refreshMobilePhotos() {

  mobilePhotos.length = 0;

  pages.forEach(page => {

    const photos =
      page.querySelectorAll(".memory-photo-slot img");

    const quotes =
      page.querySelectorAll(".memory-quote");

    photos.forEach((photo, index) => {
if (!photo.src || !photo.getAttribute("src")) {
  return;
}
      mobilePhotos.push({

        src: photo.currentSrc || photo.src,

        alt: photo.alt,

        quote: quotes[index]
          ? quotes[index].querySelector("p")?.innerHTML || ""
          : ""

      });

    });

  });

}

let mobileSlideIndex = 0;

function renderMobileDiary() {
  refreshMobilePhotos();

const item = mobilePhotos[mobileSlideIndex];
console.log("DIARY IMAGE DEBUG:", {
  src: item?.src,
  totalPhotos: mobilePhotos.length
});
console.log("MOBILE DIARY IMAGE:", {
  src: item?.src,
  loaded: item?.src ? mobilePhotos[mobileSlideIndex] : null
});

  if (!item) return;

  mobileDiary.innerHTML = `
    <div class="mobile-diary-thread"></div>

    <article class="mobile-diary-sheet">

      <div class="mobile-diary-tape"></div>

      <div class="mobile-diary-photo">
        <img src="${item.src}" alt="${item.alt}">
      </div>

      <div class="mobile-diary-quote">
        <span>✦</span>
        <p>${item.quote}</p>
      </div>

      <div class="mobile-diary-counter">
        MEMORY ${mobileSlideIndex + 1} / ${mobilePhotos.length}
      </div>

    </article>
  `;
  /* =========================================
     AUTO PHOTO FRAME — PORTRAIT / SQUARE / LANDSCAPE
  ========================================= */

  const diaryPhotoFrame =
    mobileDiary.querySelector(".mobile-diary-photo");

  const diaryImage =
    diaryPhotoFrame?.querySelector("img");

  function setDiaryPhotoFrame() {

    if (!diaryImage || !diaryImage.naturalWidth) return;

    const ratio =
      diaryImage.naturalWidth / diaryImage.naturalHeight;

    diaryPhotoFrame.classList.remove(
      "photo-portrait",
      "photo-square",
      "photo-landscape"
    );

    if (ratio < 0.85) {

      diaryPhotoFrame.classList.add("photo-portrait");

    } else if (ratio <= 1.15) {

      diaryPhotoFrame.classList.add("photo-square");

    } else {

      diaryPhotoFrame.classList.add("photo-landscape");

    }
  }

  if (diaryImage) {

    if (diaryImage.complete && diaryImage.naturalWidth > 0) {

      setDiaryPhotoFrame();

    } else {

      diaryImage.addEventListener(
        "load",
        setDiaryPhotoFrame,
        { once: true }
      );

    }

  }

  bookArea.classList.add("mobile-diary-open");

/* Match diary page with mobile screen height */
requestAnimationFrame(() => {

console.log("COVER DIMENSIONS:", {
  offsetWidth: cover.offsetWidth,
  offsetHeight: cover.offsetHeight,
  clientWidth: cover.clientWidth,
  clientHeight: cover.clientHeight,
  rectWidth: cover.getBoundingClientRect().width,
  rectHeight: cover.getBoundingClientRect().height,
  display: getComputedStyle(cover).display,
  visibility: getComputedStyle(cover).visibility,
  position: getComputedStyle(cover).position,
  parentWidth: cover.parentElement?.offsetWidth,
  parentHeight: cover.parentElement?.offsetHeight
});  


// Desktop design untouched
  if (window.innerWidth > 800) return;

 // Match diary dimensions with the visually scaled cover
// Calculate the exact same scale used by the mobile book
const memorySection =
  document.getElementById("memoriesSection");

const heading =
  memorySection?.querySelector(".section-heading");

const continueButton =
  document.getElementById("memoryContinueButton");

const viewportHeight =
  window.visualViewport?.height || window.innerHeight;

const availableWidth =
  Math.max(280, window.innerWidth - 24);

const headingHeight =
  heading?.getBoundingClientRect().height || 80;

const buttonHeight =
  continueButton?.getBoundingClientRect().height || 48;

const reservedSpace =
  headingHeight + buttonHeight + 60;

const availableBookHeight =
  Math.max(220, viewportHeight - reservedSpace);

const scale = Math.min(
  1,
  availableWidth / 920,
  availableBookHeight / 650
);

// Exact scaled cover dimensions
const coverWidth = 920 * scale;
const coverHeight = 650 * scale; 

const diarySheet =
    mobileDiary.querySelector(".mobile-diary-sheet");

  if (!diarySheet || !coverWidth || !coverHeight) {
  return;
}

mobileDiary.style.width = `${coverWidth}px`;
mobileDiary.style.maxWidth = "none";
mobileDiary.style.boxSizing = "border-box";
console.log("DIARY SCALE DEBUG:", {
  viewportHeight,
  headingHeight,
  buttonHeight,
  reservedSpace,
  availableBookHeight,
  availableWidth,

  widthScale: availableWidth / 920,
  heightScale: availableBookHeight / 650,

  scale,
  calculatedWidth: 920 * scale,
  calculatedHeight: 650 * scale
});

diarySheet.style.setProperty(
  "width",
  `${coverWidth}px`,
  "important"
);

diarySheet.style.setProperty(
  "max-width",
  "none",
  "important"
);

diarySheet.style.boxSizing = "border-box";
diarySheet.style.setProperty(
  "height",
  `${coverHeight}px`,
  "important"
);

diarySheet.style.setProperty(
  "min-height",
  `${coverHeight}px`,
  "important"
);

diarySheet.style.setProperty(
  "max-height",
  `${coverHeight}px`,
  "important"
);

diarySheet.style.setProperty(
  "aspect-ratio",
  "auto",
  "important"
);console.log("DIARY SIZE CHECK:", {
  coverOffsetWidth: cover.offsetWidth,
  coverOffsetHeight: cover.offsetHeight,

  bookOffsetWidth: book.offsetWidth,
  bookOffsetHeight: book.offsetHeight,
  bookRect: book.getBoundingClientRect(),

  bookZoom: getComputedStyle(book).zoom,

  diaryWidth: diarySheet.getBoundingClientRect().width,
  diaryHeight: diarySheet.getBoundingClientRect().height,

  mobileDiaryWidth: mobileDiary.getBoundingClientRect().width,
  mobileDiaryHeight: mobileDiary.getBoundingClientRect().height
});
});}

bookArea.appendChild(mobileDiary);

/* =====================================================
   MOBILE DIARY — TAP / CLICK TO NEXT PHOTO
===================================================== */

mobileDiary.addEventListener("click", function(event) {

  if (!bookArea.classList.contains("mobile-diary-open")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (!mobilePhotos.length) return;

  mobileSlideIndex =
    (mobileSlideIndex + 1) % mobilePhotos.length;

  renderMobileDiary();

});

 /* =======================================================
   MOBILE MEMORY BOOK — FULL SCREEN HEIGHT FIT
======================================================= */

function updateMobileMemoryBookScale() {

  if (window.innerWidth <= 800) {

    const memorySection =
      document.getElementById("memoriesSection");

    const heading =
      memorySection?.querySelector(".section-heading");

    const continueButton =
      document.getElementById("memoryContinueButton");

    const viewportHeight =
      window.visualViewport?.height || window.innerHeight;

    const availableWidth =
      Math.max(280, window.innerWidth - 24);

    const headingHeight =
      heading?.getBoundingClientRect().height || 80;

    const buttonHeight =
      continueButton?.getBoundingClientRect().height || 48;

    const reservedSpace =
      headingHeight +
      buttonHeight +
      90;

    const availableBookHeight =
      Math.max(220, viewportHeight - reservedSpace);

    const widthScale =
      availableWidth / 920;

    const heightScale =
      availableBookHeight / 650;

    const scale =
      Math.min(1, widthScale, heightScale);

    book.style.zoom = String(scale);

    bookArea.style.minHeight =
      `${650 * scale + 24}px`;

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

window.visualViewport?.addEventListener(
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

  const photos =
    page.querySelectorAll(".memory-photo-slot img");

  const quotes =
    page.querySelectorAll(".memory-quote");

  photos.forEach((photo, index) => {

    // Only uploaded photos are included
    if (!photo.getAttribute("src") && !photo.currentSrc) {
      return;
    }

    if (mobilePhotos.length >= 4) {
      return;
    }

    mobilePhotos.push({

      src: photo.currentSrc || photo.src,

      alt: photo.alt,

      quote: quotes[index]
        ? quotes[index].querySelector("p")?.innerHTML || ""
        : ""

    });

  });

});
}

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

if (window.innerWidth <= 800) {

  mobileSlideIndex = 0;

  setTimeout(() => {
    renderMobileDiary();
  }, 450);

  return;
}



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
const photoCount =
  (BIRTHDAY_CONFIG.photos || []).length;

if (
  pageNumber < 1 ||
  pageNumber > 2 ||
  (pageNumber === 2 && photoCount !== 4)
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
bookArea.classList.remove("mobile-diary-open");


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


  if (nextPage === 2) {

  showPage(2);

} else if (nextPage === 4) {

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

    if (event.key !== "ArrowRight") return;

    if (currentPage === 0) {

      openMemoryBook();

    } else if (currentPage === 1) {

      if ((BIRTHDAY_CONFIG.photos || []).length === 4) {
        showPage(2);
      } else {
        showBackCover();
      }

    } else if (currentPage === 2) {

      showBackCover();

    }

  }
);

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "ArrowLeft") return;

    if (currentPage === 4) {

      if ((BIRTHDAY_CONFIG.photos || []).length === 4) {
        showPage(2);
      } else {
        showPage(1);
      }

    } else if (currentPage === 2) {

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
if (window.innerWidth <= 600 && currentPage !== 0) {

  if (swipeDistance < -50) {

    if (mobileSlideIndex < mobilePhotos.length - 1) {

      mobileSlideIndex++;
      renderMobileDiary();

    } else {

      showBackCover();

    }

    return;
  }

  if (swipeDistance > 50) {

    if (currentPage === 4) {

      currentPage = 1;
      mobileSlideIndex = mobilePhotos.length - 1;
      renderMobileDiary();

    } else if (mobileSlideIndex > 0) {

      mobileSlideIndex--;
      renderMobileDiary();

    }

    return;
  }
}
      /* Swipe left → next */

            /* Swipe left → next */

      if (swipeDistance < -50) {

        if (currentPage === 0) {

          openMemoryBook();

        } else if (currentPage === 1) {

          if ((BIRTHDAY_CONFIG.photos || []).length === 4) {

            showPage(2);

          } else {

            showBackCover();

          }

        } else if (currentPage === 2) {

          showBackCover();

        }

      }


      /* Swipe right → previous */

      if (swipeDistance > 50) {

        if (currentPage === 4) {

          if ((BIRTHDAY_CONFIG.photos || []).length === 4) {

            showPage(2);

          } else {

            showPage(1);

          }

        } else if (currentPage === 2) {

          showPage(1);

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

  const wrapper = birthdayVideo.closest(
    ".birthday-video-wrapper"
  );

  /* Detect video orientation after metadata loads */
birthdayVideo.onloadedmetadata = () => {

  const videoWidth = birthdayVideo.videoWidth;
  const videoHeight = birthdayVideo.videoHeight;

  if (!videoWidth || !videoHeight) return;

  const wrapper = birthdayVideo.closest(
    ".birthday-video-wrapper"
  );

  if (!wrapper) return;

  // Detect exact video ratio
  const videoRatio = videoWidth / videoHeight;

  wrapper.style.setProperty(
    "--video-ratio",
    videoRatio
  );

  if (videoHeight > videoWidth) {
    wrapper.classList.add("portrait-video");
  } else {
    wrapper.classList.remove("portrait-video");
  }

}; 

 /* Handle video loading errors */

  birthdayVideo.onerror = () => {

    console.error("Birthday video could not be loaded.");

    if (videoPlaceholder) {
      videoPlaceholder.style.display = "flex";
    }

  };

  /* Load selected video */

  birthdayVideoSource.src = BIRTHDAY_CONFIG.video;

  birthdayVideo.load();

  if (videoPlaceholder) {
    videoPlaceholder.style.display = "none";
  }

}
  

/* =========================================
   11 — PREMIUM PANDA GIFT REVEAL
========================================= */

const pandaGiftReveal =
  document.getElementById("pandaGiftReveal");

const pandaRomanticMessage =
  document.getElementById("pandaRomanticMessage");

if (birthdayWishButton && pandaGiftReveal) {

  birthdayWishButton.addEventListener("click", () => {

    if (
      birthdayWishButton.classList.contains("gift-open")
    ) {
      return;
    }

    // Start opening the box
    birthdayWishButton.classList.add("gift-open");

    // Let the box open before showing the surprise
    setTimeout(() => {

      birthdayWishButton.classList.add("gift-disappear");

      pandaGiftReveal.classList.add("panda-visible");

const giftOpenMessage =
  document.getElementById("giftOpenMessage");

if (giftOpenMessage) {
  setTimeout(() => {
    giftOpenMessage.classList.add("message-revealed");
  }, 1000);
}

const playGiftGameButton =
  document.getElementById("playGiftGameButton");

if (playGiftGameButton) {
  playGiftGameButton.classList.add("show");
}

      createMiniConfetti(45);
      createFloatingHearts(12);

    }, 700);

  });

}

/* =========================================
   PANDA → MYSTERY GIFT GAME
   SAFE CLICK HANDLER
========================================= */

document.addEventListener("click", (event) => {

  const button = event.target.closest("#playGiftGameButton");

  if (!button) return;

  const giftExperience =
    document.getElementById("giftExperience");

  const luvoraGiftGame =
    document.getElementById("luvoraGiftGame");

  if (!giftExperience || !luvoraGiftGame) {
    console.error("Gift Game section not found.");
    return;
  }

  document.documentElement.classList.remove(
    "luvora-cake-return"
  );

  document.documentElement.classList.add(
    "luvora-game-return"
  );

  giftExperience.classList.remove("flow-unlocked");

giftExperience.style.removeProperty("display");

  luvoraGiftGame.classList.add("flow-unlocked");

// Force the Mystery Gift section to become visible
luvoraGiftGame.hidden = false;

luvoraGiftGame.style.setProperty(
  "display",
  "block",
  "important"
);

luvoraGiftGame.style.setProperty(
  "visibility",
  "visible",
  "important"
);

luvoraGiftGame.scrollIntoView({
  behavior: "instant",
  block: "start"
});
});
         
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
RESET SURPRISE INTERACTIONS BEFORE A NEW PREVIEW
========================================================= */

function resetSurpriseInteractions() {

// Reset balloon interactions
poppedBalloons = 0;

balloons.forEach((balloon) => {
balloon.classList.remove("popped");
});

document.querySelectorAll(".mobile-balloon-message")
.forEach((message) => message.remove());

if (balloonMessage) {
balloonMessage.classList.remove(
"visible",
"mobile-final-balloon-message"
);


balloonMessage.style.left = "";
balloonMessage.style.top = "";


}


// Reset love letter
if (loveEnvelope) {
loveEnvelope.classList.remove("open");
}

;


// Reset gift box and panda reveal
if (birthdayWishButton) {
birthdayWishButton.classList.remove(
"magical-wish-ready",
"gift-open",
"gift-disappear"
);
}

if (pandaGiftReveal) {
pandaGiftReveal.classList.remove("panda-visible");
}

// Reset memory book to its cover
const memoryBook = document.getElementById("memoryBook");
const memoryCover = document.getElementById("memoryCover");
const memoryBackCover = document.getElementById("memoryBackCover");

if (memoryBook && memoryCover && memoryBackCover) {

memoryCover.classList.remove("memory-cover-open");
memoryCover.style.display = "flex";
memoryCover.style.pointerEvents = "auto";

memoryBook.querySelectorAll(".memory-page").forEach((page) => {
  page.classList.remove("active");
  page.style.opacity = "0";
  page.style.pointerEvents = "none";
});

memoryBackCover.style.opacity = "0";
memoryBackCover.style.pointerEvents = "none";

}
}



/* =========================================================
   19 — INITIALIZE
   ========================================================= */

function setupCustomizationSystem() {

  // Shared surprise link: editor open korbe na

  if (LUVORA_IS_FINAL_SURPRISE) {
    document.body.classList.add("preview-mode");


  

    const customizationPanel =
      document.getElementById("customizationPanel");

    if (customizationPanel) {
      customizationPanel.style.display = "none";
    }

    return;
  }

  document.body.classList.remove("preview-mode");
  const customizationPanel =
    document.getElementById("customizationPanel");

  if (customizationPanel) {
    customizationPanel.classList.add("active");
  }
 
 const customerName = document.getElementById("customerName");
const customerDate = document.getElementById("customerDate");
const customerYourName = document.getElementById("customerYourName");

const letterSignatureName = document.getElementById("letterSignatureName");


  const customerPhotos = document.getElementById("customerPhotos");
  const customerVideo = document.getElementById("customerVideo");
  const customerPandaMessage = document.getElementById("customerPandaMessage");

  const previewButton =
    document.getElementById("previewSurpriseButton");

  const previewStatus =
    document.getElementById("previewStatus");

  const previewActions =
    document.getElementById("previewActions");

  const previewCreateButton =
    document.getElementById("previewCreateButton");


// =========================================
// CAKE SURPRISE — SAME PAGE TRANSITION
// =========================================

const continueToCakeButton = document.getElementById(
  "continueToCakeButton"
);

if (continueToCakeButton) {
  continueToCakeButton.addEventListener("click", (event) => {
    event.preventDefault();

    const lovedOneName = customerName
      ? customerName.value.trim()
      : "";

    const senderName = customerYourName
      ? customerYourName.value.trim()
      : "";

    const customReward = customRewardInput
      ? customRewardInput.value.trim()
      : "";

    const selectedRewards = getSelectedRewards();

    

    // Hide Video Section
    const videoSection = document.getElementById("videoSection");

    if (videoSection) {
      videoSection.classList.add("birthday-flow-hidden");
    }

    // Reveal Cake Section
    const cakeSection = document.getElementById("cakePageSection");

    if (cakeSection) {
      cakeSection.classList.remove("birthday-flow-hidden");

      void cakeSection.offsetWidth;

      cakeSection.classList.add("birthday-flow-revealed");
    }
  });
}


if (customerDate) {
  customerDate.value = BIRTHDAY_CONFIG.date;
}

  const birthdayName = document.getElementById("birthdayName");
  const birthdayDate = document.getElementById("birthdayDate");
  const finalBirthdayName = document.getElementById("finalBirthdayName");
  const letterRecipients = document.querySelectorAll(".letter-recipient");

/* ==========================================
   LUVORA — SINGLE REWARD SELECTOR
========================================== */

const rewardDropdown = document.getElementById(
  "customerRewardDropdown"
);

const rewardToggle = document.getElementById(
  "customerRewardToggle"
);

const rewardPlaceholder = document.getElementById(
  "customerRewardPlaceholder"
);

const rewardOptionsContainer = document.getElementById(
  "customerRewardOptions"
);

const rewardOptions = document.querySelectorAll(
  "#customerRewardOptions .luvora-reward-option"
);

const customRewardInput = document.getElementById(
  "customerCustomReward"
);

/*
  Return the selected reward.
  Only one predefined reward is allowed.
*/

function getSelectedRewards() {
  const selectedOption = document.querySelector(
    "#customerRewardOptions .luvora-reward-option.is-selected"
  );

  return selectedOption
    ? [selectedOption.dataset.reward]
    : [];
}

/*
  Open or close the dropdown.
*/

function setRewardDropdownOpen(isOpen) {
  if (!rewardToggle || !rewardOptionsContainer) return;

  rewardOptionsContainer.hidden = !isOpen;

  rewardToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );
}

/*
  Clear the predefined reward selection.
*/

function clearSelectedReward() {
  rewardOptions.forEach((option) => {
    option.classList.remove("is-selected");
    option.setAttribute("aria-pressed", "false");
  });

  if (rewardPlaceholder) {
    rewardPlaceholder.textContent =
      "Select a special reward";
  }
}

/*
  Select exactly one predefined reward.
*/

rewardOptions.forEach((option) => {
  option.setAttribute("aria-pressed", "false");

  option.addEventListener("click", () => {
    const rewardName = option.dataset.reward;

    if (!rewardName) return;

    // Remove any previous selection.
    clearSelectedReward();

    // Select this reward.
    option.classList.add("is-selected");

    option.setAttribute("aria-pressed", "true");

    // Display the selected reward in the dropdown.
    if (rewardPlaceholder) {
      rewardPlaceholder.textContent =
        option.querySelector(".luvora-reward-name")
          ?.textContent.trim() || rewardName;
    }

    // A predefined reward and custom text cannot coexist.
    if (customRewardInput) {
      customRewardInput.value = "";
    }

    // Close the dropdown after selection.
    setRewardDropdownOpen(false);
  });
});

/*
  Toggle dropdown visibility.
*/

if (rewardToggle) {
  rewardToggle.addEventListener("click", () => {
    const isOpen =
      rewardToggle.getAttribute("aria-expanded") === "true";

    setRewardDropdownOpen(!isOpen);
  });
}

/*
  Clicking outside the dropdown closes it.
*/

document.addEventListener("click", (event) => {
  if (
    rewardDropdown &&
    !rewardDropdown.contains(event.target)
  ) {
    setRewardDropdownOpen(false);
  }
});

/*
  Typing a custom reward cancels the predefined selection.
*/

if (customRewardInput) {
  customRewardInput.addEventListener("input", () => {
    if (customRewardInput.value.trim()) {
      clearSelectedReward();
    }
  });
}

/* END — LUVORA SINGLE REWARD SELECTOR */

function updateBirthdayName() {

  const name = customerName
    ? customerName.value.trim()
    : "";

  const displayName = name || "My Love";

  // Update main configuration
  BIRTHDAY_CONFIG.name = displayName;

  // Birthday overlay
  const overlayName =
    document.getElementById("overlayBirthdayName");

  if (overlayName) {
    overlayName.textContent = displayName;
  }

  // Birthday hero
  if (birthdayName) {
    birthdayName.textContent = displayName;
  }
// Cake Surprise — personalized birthday name
const cakeBirthdayName =
  document.getElementById("cakeBirthdayName");

if (cakeBirthdayName) {
  cakeBirthdayName.textContent = displayName;
}

  // Love Letter recipient
  letterRecipients.forEach((recipient) => {
    recipient.textContent = displayName;
  });

  // Welcome greeting
  const welcomeRecipientName =
    document.getElementById("welcomeRecipientName");

  if (welcomeRecipientName) {
    welcomeRecipientName.textContent = displayName;
  }

  // Final surprise
  if (finalBirthdayName) {
    finalBirthdayName.textContent = displayName;
  }
}

// Listen for Loved One's Name changes
if (customerName) {

  customerName.addEventListener(
    "input",
    updateBirthdayName
  );

  // Apply initial name
  updateBirthdayName();
}
// Update Love Letter signature and Scratch Card sender name

function updateLetterSignature() {
  const senderName = LUVORA_IS_FINAL_SURPRISE
    ? (BIRTHDAY_CONFIG.senderName || "").trim()
    : (customerYourName
        ? customerYourName.value.trim()
        : "");

  // Save only a non-empty sender name
  if (senderName) {
    sessionStorage.setItem("luvoraSenderName", senderName);
  }

  if (letterSignatureName) {
    letterSignatureName.textContent =
      senderName ? `${senderName} ♡` : "Your Name ♡";
  }

  const scratchSenderName = document.getElementById(
    "luvoraScratchSenderName"
  );

  if (scratchSenderName) {
    scratchSenderName.textContent =
      senderName ||
      sessionStorage.getItem("luvoraSenderName") ||
      "Someone Special";
  }
}if (customerYourName) {
  customerYourName.addEventListener(
    "input",
    updateLetterSignature
  );

  updateLetterSignature();
}



if (customerPhotos) {

  const photoPreview =
    document.getElementById("customPhotoPreview");

 
  let uploadedPhotoUrls = [];

  let uploadedPhotoFiles = [];


  /* =====================================================
     UPDATE PHOTO GALLERY
     ===================================================== */

    function updateCustomPhotos() {

    BIRTHDAY_CONFIG.photos =
      uploadedPhotoUrls.slice(0, 4);

    loadMemoryGallery();
console.log(
  "Memory images:",
  document.querySelectorAll(
    ".memory-photo-slot img"
  ).length
);

console.log("IMAGE STATUS:", [...document.querySelectorAll(".memory-photo-slot img")].map(img => [img.complete, img.naturalWidth, img.naturalHeight]));
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
  uploadedPhotoFiles.length >= 4;

    customerPhotos.disabled =
      reachedLimit;


    if (reachedLimit) {

      customerPhotos.title =
        "Maximum 4 photos allowed";

    } else {

      customerPhotos.title =
        `${4 - uploadedPhotoFiles.length} photo slot(s) remaining`;

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
  4 - uploadedPhotoFiles.length;

if (remainingSlots <= 0) {
  alert("💗 You can select a maximum of 4 photos.");
  customerPhotos.value = "";
  return;
}

if (files.length > remainingSlots) {
  alert(
    `💗 You can add only ${remainingSlots} photo(s).`
  );
}

const filesToAdd =
  files.slice(0, remainingSlots);

// Allow the same file to be selected again if needed.
customerPhotos.value = "";


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

    for (let i = 0; i < 4; i++) {

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


  (async () => {

  try {

    await LUVORA_DRAFT_READY;

uploadedPhotoFiles.length = 0;
uploadedPhotoUrls.length = 0;

updateCustomPhotos();
updatePhotoInputState();

  } catch (error) {

    console.error(
      "LUVORA photo draft initialization failed:",
      error
    );

  }

})();

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
if (birthdayVideoSource) {
  birthdayVideoSource.type =
    file.type || "video/mp4";
}

/* Show selected filename */
if (customVideoName) {
  customVideoName.textContent = file.name;
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

/* =========================================
   RESTORE VIDEO AFTER RETURNING FROM CAKE
========================================= */
    

  }
}

  if (previewButton) {
  previewButton.addEventListener("click", () => {
    const errors = [];

    const name = customerName
      ? customerName.value.trim()
      : "";

    const date = customerDate
      ? customerDate.value.trim()
      : "";

   
    const photoPreview =
      document.getElementById("customPhotoPreview");

    const photoCount = photoPreview
      ? photoPreview.querySelectorAll(".custom-photo-item").length
      : 0;

  
    // Name validation
    if (!name) {
      errors.push("Please enter the name.");
    }

   // Date validation: Year is required

if (
  !date ||
  !/\b\d{4}\b/.test(date) ||
  Number.isNaN(Date.parse(date))
) {
  errors.push(
    "Please enter a valid special date including the year (e.g. 12 October 2026)."
  );
}

 
// LUVORA — ONLY 2 OR 4 PHOTOS ALLOWED
if (![2, 4].includes(photoCount)) {
  errors.push(
    `Please upload exactly 2 or 4 photos. Currently uploaded: ${photoCount}.`
  );
} 

 // Reward selection validation
const selectedRewards = getSelectedRewards();

const customGift = customRewardInput
  ? customRewardInput.value.trim()
  : "";

if (selectedRewards.length === 0 && !customGift) {
  errors.push(
    "Please choose a reward or create a special gift to continue."
  );
}

    // Stop preview if any validation fails
    if (errors.length > 0) {
      if (previewStatus) {
        previewStatus.classList.add("show");
        previewStatus.textContent =
          "Please fix the following errors: " +
          errors.join(" ");
      }

      if (previewActions) {
        previewActions.classList.remove("show");
      }

      document.body.classList.remove("preview-mode");

// Exit Cake-return fullscreen mode
document.documentElement.classList.remove(
"luvora-cake-return",
 "luvora-game-return",
  "luvora-final-surprise-return"
);
document.body.classList.remove(
"luvora-cake-return",
  "luvora-game-return",
  "luvora-final-surprise-return"
);

      if (previewStatus) {
        previewStatus.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      return;
    }

// Hide customization panel when preview starts.
if (customizationPanel) {
  customizationPanel.classList.remove("active");
  customizationPanel.style.display = "none";
}

// =========================================
// LUVORA — RESET BIRTHDAY FLOW FOR NEW PREVIEW
// =========================================

const heroSection = document.getElementById("birthdayHero");
const balloonSection = document.getElementById("balloonSection");

const firstSections = [
  heroSection,
  balloonSection
];

firstSections.forEach(section => {
  if (section) {
    section.classList.remove("birthday-flow-hidden");
  }
});

// Hide all upcoming sections
[
  "luvoraCameraSection",
  "letterSection",
  "memoriesSection",
  "videoSection",
  "cakePageSection",
  "luvoraGiftGame",
  "finalSurprise"
].forEach(id => {
  const section = document.getElementById(id);

  if (!section) return;

  section.classList.add("birthday-flow-hidden");

  section.classList.remove(
    "flow-unlocked",
    "birthday-flow-revealed"
  );
});

// Reset Continue buttons
[
  "balloonContinueButton",
  "cameraContinueButton",
  "letterContinueButton",
  "memoryContinueButton"
].forEach(id => {
  const button = document.getElementById(id);

  if (button) {
    button.disabled = false;
  }
});

resetSurpriseInteractions();
document.body.classList.add("preview-mode");
createFloatingHearts();
createMiniConfetti();

/* Refresh latest customization values before preview */
updateBirthdayName();
updateLetterSignature();

showLuvoraBirthdayOverlay();  });

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

const customRewardText = customRewardInput
  ? customRewardInput.value.trim()
  : "";

const surpriseData = {
  draftId: draftId,

  template: "birthday-story",

  name: name,

  senderName: customerYourName
    ? customerYourName.value.trim()
    : "",

  pandaMessage: customerPandaMessage
    ? customerPandaMessage.value.trim()
    : "",

  date: date,
  letter: (() => {
    const message = document.getElementById("letterMessage");
    if (!message) return "";

    return Array.from(message.querySelectorAll("p"))
      .map(p => p.dataset.fullText || p.textContent)
      .map(text => text.trim())
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 10000);
  })(),

    selectedRewards: customRewardText
    ? []
    : getSelectedRewards(),

  customReward: customRewardText,

  rewardCode: "",

  mediaStorage: "indexeddb"
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

async function loadSharedSurprise() {
  if (!LUVORA_IS_FINAL_SURPRISE) return;

  try {
    const { data, error } =
      await supabaseClient.functions.invoke(
        "get-shared-surprise",
        {
          body: {
            share_id: LUVORA_SHARE_ID
          }
        }
      );

    if (error) {
      console.error(
        "Shared surprise function error:",
        error
      );
      return;
    }

    if (!data?.success || !data?.surprise) {
      console.error(
        "Surprise not found or payment not verified:",
        data?.error
      );
      return;
    }

    const surprise = data.surprise;

// Load the uploaded camera selfie for the paid shared link.
window.sharedCameraSelfie = "";

const cameraSelfieValue =
  typeof surprise.camera_selfie === "string"
    ? surprise.camera_selfie.trim()
    : "";

if (cameraSelfieValue) {
  try {
    // If a signed URL already exists, use it directly.
    if (
      /^https:\/\/[^/]+\/storage\/v1\/object\/sign\/surprise-media\//i
        .test(cameraSelfieValue)
    ) {
      window.sharedCameraSelfie = cameraSelfieValue;
    } else {
      // Otherwise, treat the value as a Storage object path.
      const cameraSelfiePath = cameraSelfieValue
        .replace(/^\/+/, "")
        .replace(/^surprise-media\//i, "");

      const {
        data: selfieUrlData,
        error: selfieUrlError
      } = await supabaseClient
        .storage
        .from("surprise-media")
        .createSignedUrl(cameraSelfiePath, 60 * 60);

      if (selfieUrlError) {
        throw selfieUrlError;
      }

      window.sharedCameraSelfie =
        selfieUrlData?.signedUrl || "";
    }

    console.log(
      "LUVORA shared selfie ready:",
      Boolean(window.sharedCameraSelfie)
    );
  } catch (selfieError) {
    console.error(
      "Shared camera selfie loading failed:",
      selfieError
    );

    window.sharedCameraSelfie = "";
  }
} else {
  console.warn(
    "No camera selfie was found for this shared surprise."
  );
}

    // Hide letter editing controls on the paid shared link.
if (LUVORA_IS_FINAL_SURPRISE) {
  const letterEditTools = document.querySelector(".letter-edit-tools");
  const letterEditor = document.getElementById("letterEditor");

  if (letterEditTools) {
    letterEditTools.hidden = true;
  }

  if (letterEditor) {
    letterEditor.hidden = true;
  }

  const selfieUploadSection = document.querySelector(".luvora-selfie-upload");

  if (selfieUploadSection) {
    selfieUploadSection.hidden = true;
  }

// Hide video upload controls on the paid shared link.
const birthdayVideoUpload = document.querySelector(
  ".birthday-video-upload"
);

if (birthdayVideoUpload) {
  birthdayVideoUpload.hidden = true;
}


// Hide Back to Edit button on the paid final surprise link.
const backToEditButton = document.getElementById(
  "backToEditButton"
);

if (backToEditButton) {
  backToEditButton.hidden = true;
}
}

   // Customer information
BIRTHDAY_CONFIG.name =
  surprise.name || "someone special";

BIRTHDAY_CONFIG.senderName =
  typeof surprise.sender_name === "string"
    ? surprise.sender_name.trim()
    : "";

BIRTHDAY_CONFIG.date =
  surprise.birthday_date || "";

// Load the personalized Love Letter for the paid share link.
if (
  typeof surprise.letter === "string" &&
  surprise.letter.trim()
) {
  renderLetterText(surprise.letter, false);
}

    // Photos and video
    BIRTHDAY_CONFIG.photos =
      Array.isArray(surprise.photos)
        ? surprise.photos
        : [];

    BIRTHDAY_CONFIG.video =
      surprise.video || "";

    // Selected predefined rewards
    BIRTHDAY_CONFIG.selectedRewards =
      Array.isArray(surprise.selected_rewards)
        ? surprise.selected_rewards
        : [];

    // Custom reward or gift card code
    BIRTHDAY_CONFIG.customReward =
      typeof surprise.custom_reward === "string"
        ? surprise.custom_reward.trim()
        : "";

    BIRTHDAY_CONFIG.rewardCode =
      typeof surprise.reward_code === "string"
        ? surprise.reward_code.trim()
        : "";

    // Reward displayed on the scratch card
    BIRTHDAY_CONFIG.reward =
      BIRTHDAY_CONFIG.customReward ||
      BIRTHDAY_CONFIG.rewardCode ||
      BIRTHDAY_CONFIG.selectedRewards[0] ||
      "";

    console.log(
      "Luvora shared reward loaded:",
      {
        selectedRewards:
          BIRTHDAY_CONFIG.selectedRewards,
        customReward:
          BIRTHDAY_CONFIG.customReward,
        rewardCode:
          BIRTHDAY_CONFIG.rewardCode
      }
    );

  } catch (error) {
    console.error(
      "Unable to load shared surprise:",
      error
    );
  }
}


async function initializeBirthdayExperience() {
  const isFinalSurprise = Boolean(LUVORA_SHARE_ID);

  if (isFinalSurprise) {
    document.documentElement.classList.add("luvora-final-mode");
    document.body.classList.add("preview-mode");
  }

 await loadSharedSurprise();

// Apply recipient name to the Cake section
const cakeBirthdayName = document.getElementById(
  "cakeBirthdayName"
);

if (cakeBirthdayName) {
  cakeBirthdayName.textContent =
    BIRTHDAY_CONFIG.name || "My Love";
}

// Apply sender name to Love Letter and Scratch Card
if (typeof updateLetterSignature === "function") {
  updateLetterSignature();
}

// FINAL SURPRISE — VIDEO TO CAKE NAVIGATION
if (LUVORA_IS_FINAL_SURPRISE) {

  const continueToCakeButton =
    document.getElementById("continueToCakeButton");

  if (
    continueToCakeButton &&
    !continueToCakeButton.dataset.finalCakeHandler
  ) {

    continueToCakeButton.dataset.finalCakeHandler = "true";

    continueToCakeButton.addEventListener("click", (event) => {

      event.preventDefault();

      const videoSection =
        document.getElementById("videoSection");

      const cakePageSection =
        document.getElementById("cakePageSection");

      if (videoSection) {
        videoSection.classList.add("birthday-flow-hidden");
      }

      if (cakePageSection) {

        cakePageSection.classList.remove(
          "birthday-flow-hidden"
        );

        void cakePageSection.offsetWidth;

        cakePageSection.classList.add(
          "birthday-flow-revealed"
        );

      }

    });

  }

}

loadCustomerDataFromURL();
loadCustomerPhotosFromURL();
loadBirthdayInformation();

// Populate recipient name on the Welcome Page.
const welcomeRecipientName = document.getElementById(
  "welcomeRecipientName"
);

if (welcomeRecipientName) {
  welcomeRecipientName.textContent =
    BIRTHDAY_CONFIG.name || "My Love";
}
   loadMemoryGallery();
  loadBirthdayVideo();
  setupCustomizationSystem();
  startBackgroundHearts();
  document.documentElement.classList.remove("luvora-page-booting");
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

/* =========================================================
   LUVORA — PREMIUM BIRTHDAY OVERLAY & ARCHERY GAME
========================================================= */

function showLuvoraBirthdayOverlay() {
  const overlay = document.getElementById("luvoraBirthdayOverlay");

  if (!overlay) {
    console.error("Luvora Birthday Overlay not found.");
    return;
  }

  const nameInput = document.getElementById("customerName") || document.getElementById("birthdayName");
const dateInput = document.getElementById("customerDate") || document.getElementById("birthdayDate");

  const nameElement = document.getElementById("overlayBirthdayName");
  const monthElement = document.getElementById("overlayCalendarMonth");
  const daysElement = document.getElementById("overlayCalendarDays");

  const stage = document.getElementById("archeryStage");
  const arrow = document.getElementById("luvoraArrow");
  const bowString = document.getElementById("bowString");
  const instruction = document.getElementById("archeryInstruction");

  if (!nameElement || !monthElement || !daysElement ||
      !stage || !arrow) {
    console.error("Required birthday overlay elements are missing.");
    return;
  }

  /* ---------- OVERLAY DESIGN ---------- */

  if (!document.getElementById("luvoraOverlayGameStyles")) {
    const style = document.createElement("style");
    style.id = "luvoraOverlayGameStyles";

    style.textContent = `
      #luvoraBirthdayOverlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 16px;
        background:
          radial-gradient(ellipse at top, #6b1836 0%, transparent 65%),
          linear-gradient(145deg, #270710, #4a0e1f, #21050d);
        color: #f1e8db;
        isolation: isolate;
      }

      #luvoraBirthdayOverlay[hidden] {
        display: none !important;
      }

      #luvoraBirthdayOverlay .birthday-overlay-content {
        position: relative;
        z-index: 2;
        width: min(100%, 520px);
        max-height: calc(100dvh - 32px);
        overflow-y: auto;
        text-align: center;
        scrollbar-width: thin;
        padding: 12px 10px;
        box-sizing: border-box;
      }

      #luvoraBirthdayOverlay .birthday-overlay-title {
        color: #f1e8db;
      }

      #luvoraBirthdayOverlay #overlayBirthdayName {
        color: #d689a4;
        overflow-wrap: anywhere;
      }

      #luvoraBirthdayOverlay .birthday-couple-image {
        max-width: 100%;
        max-height: 115px;
        object-fit: contain;
      }

      #luvoraBirthdayOverlay .birthday-calendar-days {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 5px;
      }

      #luvoraBirthdayOverlay .luvora-calendar-day {
        position: relative;
        display: grid;
        place-items: center;
        min-height: 30px;
        color: #f1e8db;
        font-size: 13px;
      }

      #luvoraBirthdayOverlay .luvora-birthday-target {
        color: #fff;
        font-weight: 900;
        background: linear-gradient(145deg, #d689a4, #8f244a);
        border: 2px solid #f8e5a9;
        border-radius: 50%;
        box-shadow: 0 0 12px #f8e5a9, inset 0 2px 5px #ffffff55;
        transform: scale(1.08);
      }

      #luvoraBirthdayOverlay .luvora-archery {
        margin: 12px auto;
        max-width: 420px;
      }

      #luvoraBirthdayOverlay .archery-stage {
        position: relative;
        min-height: 100px;
        touch-action: pan-y;
        overflow: visible;
      }

      #luvoraBirthdayOverlay #luvoraBow {
        width: 75px;
        height: 95px;
        display: block;
        margin: 0 auto;
      }

      #luvoraBirthdayOverlay #luvoraArrow {
        width: min(180px, 55vw);
        height: auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: grab;
        touch-action: none;
        z-index: 4;
      }

      #luvoraBirthdayOverlay .luvora-floating-heart {
        position: absolute;
        top: -25px;
        color: #d689a4;
        pointer-events: none;
        animation: luvoraHeartFall linear forwards;
      }

      @keyframes luvoraHeartFall {
        to {
          transform: translate3d(25px, 110vh, 0) rotate(360deg);
          opacity: 0;
        }
      }

  .luvora-flying-arrow {
  position: fixed;
  z-index: 1000002;
  pointer-events: none;
  overflow: visible;
  transform-origin: center;
}

      .luvora-hit-flash {
        position: fixed;
        z-index: 1000003;
        pointer-events: none;
        font-size: 45px;
        animation: luvoraHitFlash .8s ease-out forwards;
      }

      @keyframes luvoraHitFlash {
        0% { transform: scale(.3); opacity: 0; }
        35% { transform: scale(1.5); opacity: 1; }
        100% { transform: scale(2.2); opacity: 0; }
      }

      @media (max-width: 480px) {
        #luvoraBirthdayOverlay {
          padding: 8px;
        }

        #luvoraBirthdayOverlay .birthday-overlay-content {
          max-height: calc(100dvh - 16px);
          padding: 8px 5px;
        }

        #luvoraBirthdayOverlay .birthday-overlay-wish {
          font-size: 12px;
        }

        #luvoraBirthdayOverlay .birthday-calendar-days {
          gap: 3px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ---------- PERSONALIZED NAME ---------- */

 
nameElement.textContent =
  (nameInput && nameInput.value.trim()) ||
  BIRTHDAY_CONFIG.name ||
  "Someone Special";



  /* ---------- PERSONALIZED CALENDAR ---------- */

 function parseBirthdayDate(value) {
  if (!value) return null;

  const input = value.trim();

  // YYYY-MM-DD
  let match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    return makeValidDate(+match[1], +match[2], +match[3]);
  }

  // DD/MM/YYYY or DD-MM-YYYY
  match = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (match) {
    return makeValidDate(+match[3], +match[2], +match[1]);
  }

  // DD Month YYYY, e.g. 17 October 2026
  match = input.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);

  if (match) {
    const months = [
      "january", "february", "march", "april",
      "may", "june", "july", "august",
      "september", "october", "november", "december"
    ];

    const month = months.indexOf(match[2].toLowerCase());

    if (month !== -1) {
      return makeValidDate(+match[3], month + 1, +match[1]);
    }
  }

  // Month DD, YYYY
  match = input.match(/^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/);

  if (match) {
    const months = [
      "january", "february", "march", "april",
      "may", "june", "july", "august",
      "september", "october", "november", "december"
    ];

    const month = months.indexOf(match[1].toLowerCase());

    if (month !== -1) {
      return makeValidDate(+match[3], month + 1, +match[2]);
    }
  }

  return null;

  function makeValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }
}


const birthdayDateValue =
  (dateInput && dateInput.value.trim()) ||
  BIRTHDAY_CONFIG.date ||
  "";

const birthday = parseBirthdayDate(birthdayDateValue);


  daysElement.innerHTML = "";

  if (birthday && !Number.isNaN(birthday.getTime())) {
    monthElement.textContent = birthday.toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    );

    const year = birthday.getFullYear();
    const month = birthday.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement("span");
      blank.className = "luvora-calendar-day";
      daysElement.appendChild(blank);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement("span");
      cell.className = "luvora-calendar-day";
      cell.textContent = day;

      if (day === birthday.getDate()) {
        cell.classList.add("luvora-birthday-target");
        cell.id = "luvoraBirthdayTarget";
       cell.textContent = day;
        cell.setAttribute(
          "aria-label",
          "Birthday: " + birthday.getDate()
        );
        cell.title = "Your special day";
      }

      daysElement.appendChild(cell);
    }
  } else {
    monthElement.textContent = "YOUR SPECIAL DAY";

    const message = document.createElement("p");
    message.textContent =
      "Your birthday date could not be read. Please check the date format.";
    message.style.gridColumn = "1 / -1";
    message.style.fontSize = "12px";
    daysElement.appendChild(message);
  }

  /* ---------- PREPARE THE GAME ---------- */

  overlay.hidden = false;
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("role", "dialog");

  const target = document.getElementById("luvoraBirthdayTarget");

  if (!target) {
    if (instruction) {
      instruction.textContent =
        "Please enter a valid birthday date to play.";
    }
    return;
  }

  if (overlay.dataset.gameReady === "true") return;
  overlay.dataset.gameReady = "true";

  const originalArrowParent = arrow.parentElement;

  arrow.style.display = "block";

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let aimOffset = 0;
  let launching = false;

/* Free-direction aiming: pull the arrow backwards, then release. */

arrow.style.transform = "translate(-50%, -50%) rotate(-90deg)";
arrow.style.transformOrigin = "center center";

arrow.style.cursor = "grab";
arrow.style.touchAction = "none";

let dragDistanceY = 0;
let dragDistanceX = 0;
let aimAngle = -90;
// =========================================
// REALISTIC BOWSTRING PULL & SNAP ANIMATION
// =========================================

let currentStringPull = 0;
let stringAnimationFrame = 0;

function renderBowString(pull) {
  if (!bowString) return;

  const offset = Math.max(0, Math.min(52, pull));

  bowString.setAttribute(
    "d",
    `M 120 18 Q ${120 - offset} 120 120 222`
  );
}

function animateBowStringBack() {
  if (!bowString) return;

  cancelAnimationFrame(stringAnimationFrame);

  const startPull = currentStringPull;
  const startTime = performance.now();
  const duration = 170;

  function frame(now) {
    const progress = Math.min(
      1,
      (now - startTime) / duration
    );

    const eased = 1 - Math.pow(1 - progress, 3);

    currentStringPull = startPull * (1 - eased);

    renderBowString(currentStringPull);

    if (progress < 1) {
      stringAnimationFrame =
        requestAnimationFrame(frame);
    } else {
      currentStringPull = 0;
      renderBowString(0);
    }
  }

  stringAnimationFrame =
    requestAnimationFrame(frame);
}

arrow.addEventListener("pointerdown", function (event) {
  if (launching) return;

  dragging = true;
  startX = event.clientX;
  startY = event.clientY;

  aimOffset = 0;
  dragDistanceX = 0;
  dragDistanceY = 0;
  aimAngle = -90;

  arrow.setPointerCapture?.(event.pointerId);
  arrow.style.cursor = "grabbing";

  event.preventDefault();
});


arrow.addEventListener("pointermove", function (event) {
  if (!dragging || launching) return;

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
// Realistic bowstring tension
const pull = Math.min(
  52,
  Math.max(0, deltaY * 0.75)
);

currentStringPull = pull;
renderBowString(pull);

  dragDistanceX = deltaX;
  dragDistanceY = deltaY;

  // Restrict aiming to a realistic bow angle.
  const rawAngle = Math.atan2(-deltaY, -deltaX) * (180 / Math.PI);

  // Default direction is upward (-90 degrees).
  // Allow aiming only between -135 and -45 degrees.
  aimAngle = Math.max(-135, Math.min(-45, rawAngle));

  aimOffset = aimAngle + 90;

  // Allow only a small downward pull.
  const pullDistance = Math.min(
    8,
    Math.max(0, deltaY * 0.08)
  );

  arrow.style.transform =
    `translate(-50%, calc(-50% + ${pullDistance}px)) rotate(${aimAngle}deg)`;

  event.preventDefault();
});

arrow.addEventListener("pointerup", function (event) {
  if (!dragging || launching) return;

  dragging = false;
  arrow.style.cursor = "grab";

  const pullLength = Math.hypot(dragDistanceX, dragDistanceY);

  if (pullLength < 15) {
animateBowStringBack();
    // Too little pull: don't launch; let the player try again.
    arrow.style.transform =
      "translate(-50%, -50%) rotate(-90deg)";

    aimOffset = 0;
    dragDistanceX = 0;
    dragDistanceY = 0;
    aimAngle = -90;
    return;
  }

  arrow.style.transform =
    `translate(-50%, -50%) rotate(${aimAngle}deg)`;
animateBowStringBack();

  launchArrow(aimOffset);

  event.preventDefault();
});

arrow.addEventListener("pointercancel", function () {
  if (launching) return;

  dragging = false;
  aimOffset = 0;
  dragDistanceX = 0;
  dragDistanceY = 0;
  aimAngle = -90;
  animateBowStringBack();

  arrow.style.cursor = "grab";
  arrow.style.transform =
    "translate(-50%, -50%) rotate(-90deg)";
});

/* =====================================================
   LUVORA — ARROW LAUNCH CONTROLLER

   Controls:
   1. Arrow flight
   2. Original arrow hiding
   3. Miss animation
   4. Empty bow pause
   5. Arrow reload
===================================================== */

function launchArrow(offsetDegrees) {
  if (launching) return;

  launching = true;
  // LUVORA: Prepare birthday music silently
  const birthdayMusic = document.getElementById(
    "luvoraBirthdayMusic"
  );

  if (birthdayMusic) {
    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;
    birthdayMusic.volume = 0;
    birthdayMusic.muted = true;

    // Unlock audio playback during the user's arrow interaction.
    birthdayMusic.play().catch((error) => {
      console.warn(
        "Birthday music preparation failed:",
        error
      );
    });
  }


  if (instruction) {
    instruction.textContent = "Your arrow is flying… ♥";
  }

  const targetRect = target.getBoundingClientRect();
  const arrowRect = arrow.getBoundingClientRect();

  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  const startX = arrowRect.left + arrowRect.width / 2;
  const startY = arrowRect.top + arrowRect.height / 2;

  // Follow the player's actual aiming direction.
  const finalAngle = (-90 + offsetDegrees) * Math.PI / 180;
  const angleDegrees = finalAngle * 180 / Math.PI;

  const travelDistance = Math.hypot(
    window.innerWidth,
    window.innerHeight
  ) * 1.5;

  const endX = startX + Math.cos(finalAngle) * travelDistance;
  const endY = startY + Math.sin(finalAngle) * travelDistance;

  // Check whether the arrow's flight path crosses the heart.
  const vx = endX - startX;
  const vy = endY - startY;
  const lengthSquared = vx * vx + vy * vy;

  const projection = Math.max(0, Math.min(1,
    (
      (targetX - startX) * vx +
      (targetY - startY) * vy
    ) / lengthSquared
  ));

  const closestX = startX + projection * vx;
  const closestY = startY + projection * vy;

  const missDistance = Math.hypot(
    targetX - closestX,
    targetY - closestY
  );

  const hitRadius = Math.max(
  35,
  Math.min(targetRect.width, targetRect.height) * 0.9
);

const isHit = projection > 0 && missDistance <= hitRadius;

  // Stop at the closest point to the heart, not beyond it.
  const hitX = closestX;
  const hitY = closestY;

  // Create a separate arrow above all page content.
  const flyingArrow = arrow.cloneNode(true);

  flyingArrow.removeAttribute("id");
  flyingArrow.classList.add("luvora-flying-arrow");

  Object.assign(flyingArrow.style, {
    position: "fixed",
    display: "block",
    visibility: "visible",
    opacity: "1",
    pointerEvents: "none",
    zIndex: "2147483647",
    width: arrowRect.width + "px",
    height: arrowRect.height + "px",
    maxWidth: "none",
    maxHeight: "none",
    margin: "0",
    left: startX + "px",
    top: startY + "px",
    transformOrigin: "center center",
    transform: `translate(-50%, -50%) rotate(${angleDegrees}deg)`
  });

  document.body.appendChild(flyingArrow);

  arrow.style.setProperty("visibility", "hidden", "important");
  arrow.style.setProperty("opacity", "0", "important");
  arrow.style.setProperty("pointer-events", "none", "important");

  // A successful shot ends at the heart.
  const destinationX = isHit ? hitX : endX;
  const destinationY = isHit ? hitY : endY;

  const flight = flyingArrow.animate(
    [
      { left: startX + "px", top: startY + "px" },
      { left: destinationX + "px", top: destinationY + "px" }
    ],
    {
      duration: isHit
        ? Math.max(250, 1000 * Math.hypot(hitX - startX, hitY - startY) / travelDistance)
        : 1000,
      easing: "linear",
      fill: "forwards"
    }
  );

  flight.onfinish = function () {
    if (isHit) {

      // LUVORA: Start birthday music when the arrow hits the heart.
      if (birthdayMusic) {
        birthdayMusic.pause();
        birthdayMusic.currentTime = 0;
        birthdayMusic.muted = false;
        birthdayMusic.volume = 0.35;

        birthdayMusic.play().catch((error) => {
          console.error(
            "Birthday music could not start:",
            error
          );
        });
      }

      // Freeze the arrow at the heart.
      flyingArrow.style.left = hitX + "px";
      flyingArrow.style.top = hitY + "px";
      flyingArrow.style.zIndex = "2147483647";

      showHitAnimation(hitX, hitY);

      if (instruction) {
        instruction.textContent = "A perfect shot! Love unlocked. 💖";
      }

      // Keep the arrow visible while the love burst plays.
      window.setTimeout(function () {
        overlay.hidden = true;

        flyingArrow.remove();

        arrow.style.transition = "none";
        arrow.style.transform =
          "translate(-50%, -50%) rotate(-90deg)";

        arrow.style.setProperty("visibility", "visible", "important");
        arrow.style.setProperty("opacity", "1", "important");
        arrow.style.setProperty("pointer-events", "auto", "important");

        aimOffset = 0;
        dragDistanceY = 0;
        launching = false;

        delete overlay.dataset.gameReady;
      }, 1200);

      return;
    }

    // Miss: remove the arrow and let the player try again.
    flyingArrow.remove();

    if (instruction) {
      instruction.textContent =
        "You missed! Aim carefully and try again. ♥";
    }

    arrow.style.transition = "none";
    arrow.style.transform =
      "translate(-50%, -50%) rotate(-90deg)";

    arrow.style.setProperty("visibility", "visible", "important");
    arrow.style.setProperty("opacity", "1", "important");
    arrow.style.setProperty("pointer-events", "auto", "important");

    aimOffset = 0;
    dragDistanceY = 0;

    requestAnimationFrame(function () {
      arrow.style.transition = "";
      launching = false;
    });
  };
}

function showHitAnimation(x, y) {
  const burst = document.createElement("div");

  burst.className = "luvora-hit-flash";

  Object.assign(burst.style, {
    position: "fixed",
    left: x + "px",
    top: y + "px",
    transform: "translate(-50%, -50%)",
    zIndex: "2147483647",
    pointerEvents: "none",
    fontSize: "28px",
    whiteSpace: "nowrap",
    animation: "luvoraLoveBurst 900ms ease-out forwards"
  });

  burst.textContent = "💖 ✨ 💘 ✨ 💗";

  document.body.appendChild(burst);

  window.setTimeout(function () {
    burst.remove();
  }, 1000);
}



  /* ---------- FALLING HEARTS ---------- */

  if (!overlay.dataset.heartsStarted) {
    overlay.dataset.heartsStarted = "true";

    const heartContainer = overlay.querySelector(
      ".birthday-floating-hearts"
    );

    if (heartContainer) {
      for (let i = 0; i < 14; i++) {
        const heart = document.createElement("span");

        heart.className = "luvora-floating-heart";
        heart.textContent = i % 2 ? "♡" : "♥";
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDuration =
          (8 + Math.random() * 9) + "s";
        heart.style.animationDelay =
          (-Math.random() * 15) + "s";
        heart.style.fontSize =
          (12 + Math.random() * 16) + "px";

        heartContainer.appendChild(heart);
      }
    }
  }
}

/* ==========================================
   LUVORA — WELCOME SCREEN CONTROLLER
========================================== */

(function () {
  const welcome = document.getElementById("luvoraWelcome");
  const openButton = document.getElementById("openYourSurprise");

  if (!welcome || !openButton) return;

  const params = new URLSearchParams(window.location.search);
  const shareId = params.get("id");

  /*
    Show Welcome only on the final shared surprise link.
    Keep the customization page behavior unchanged.
  */

  if (!shareId) {
    welcome.hidden = true;
    return;
  }

  // Activate final-surprise mode and lock page scrolling.
  document.documentElement.classList.add(
    "luvora-final-mode",
    "luvora-welcome-active"
  );

  welcome.hidden = false;

  // Open the surprise after the button is clicked.
  openButton.addEventListener("click", function () {
    if (document.documentElement.classList.contains("luvora-welcome-open")) {
      return;
    }

    // Create premium golden dust particles.
let dustContainer = welcome.querySelector(".welcome-golden-dust");

if (!dustContainer) {
  dustContainer = document.createElement("div");
  dustContainer.className = "welcome-golden-dust";
  dustContainer.setAttribute("aria-hidden", "true");
  welcome.appendChild(dustContainer);
}

dustContainer.innerHTML = "";

for (let i = 0; i < 44; i++) {
  const dust = document.createElement("span");

  const leftSide = i % 2 === 0;

  dust.style.setProperty(
    "--dust-x",
    leftSide
      ? `${20 + Math.random() * 29}%`
      : `${51 + Math.random() * 29}%`
  );

  dust.style.setProperty(
    "--dust-y",
    `${12 + Math.random() * 76}%`
  );

  dust.style.setProperty(
    "--dust-size",
    `${2 + Math.random() * 3}px`
  );

  dust.style.setProperty(
    "--dust-x-move",
    `${leftSide
      ? -(35 + Math.random() * 100)
      : 35 + Math.random() * 100}px`
  );

  dust.style.setProperty(
    "--dust-y-move",
    `${-25 - Math.random() * 100}px`
  );

  dust.style.setProperty(
    "--dust-duration",
    `${1.0 + Math.random() * 0.9}s`
  );

  dust.style.setProperty(
    "--dust-delay",
    `${Math.random() * 0.45}s`
  );

  dustContainer.appendChild(dust);
}


// 1. Start fading out the Welcome screen.
document.documentElement.classList.add("luvora-welcome-open");

// 2. Wait for the fade-out to finish.
window.setTimeout(function () {

  // Hide the Welcome screen.
  welcome.hidden = true;

  // Remove Welcome-specific page restrictions.
  document.documentElement.classList.remove(
    "luvora-welcome-active",
    "luvora-welcome-open"
  );

  // Open the Birthday Overlay and Archery Game.
  if (typeof showLuvoraBirthdayOverlay === "function") {
    showLuvoraBirthdayOverlay();
  } else {
    console.error("Birthday overlay function not found.");
  }

}, 700);

openButton.blur();});
})();


/* =========================================
   LUVORA — DISABLE OLD TEST DATA PERSISTENCE
   Refresh should start with a clean form.
========================================= */

(function () {
  try {
    localStorage.removeItem("luvora_test_name");
    localStorage.removeItem("luvora_test_date");
  } catch (error) {
    console.warn("Could not clear old test details.", error);
  }
})();

/* =========================================================
   LUVORA — MYSTERY GIFT GAME + SCRATCH REVEAL
   Replace only the previous Mystery Gift module.
   ========================================================= */

(function initLuvoraMysteryGift() {
  "use strict";

  const ROOT_ID = "luvoraGiftGame";

  const GAME_IDS = {
    start: "luvoraGameStart",
    status: "luvoraGameStatus",
    success: "luvoraGameSuccess",
    unlock: "luvoraRewardUnlock",
    retry: "luvoraGameRetry",
    retryText: "luvoraGameRetryText",
    scratchArea: "luvoraScratchArea",
    scratchCard: "luvoraScratchCard",
    scratchCover: "luvoraScratchCover",
    scratchResult: "luvoraScratchResult",
    rewardText: "luvoraScratchRewardText",
    boxes: [
      "luvoraGiftA",
      "luvoraGiftB",
      "luvoraGiftC"
    ]
  };

  const SYMBOLS = ["❤️", "🌹", "💎"];
  const SHUFFLE_DURATION = 700;
  const SHUFFLE_ROUNDS = 2;
  const RETRY_DELAY = 1100;

/* -----------------------------------------
   QUESTION CYCLE — AVOID IMMEDIATE REPEATS
----------------------------------------- */

let questionPool = [];
let lastTargetSymbol = null;

function getNextTargetSymbol() {
  if (questionPool.length === 0) {
    questionPool = SYMBOLS.slice();

for (let i = questionPool.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));

  [questionPool[i], questionPool[j]] =
    [questionPool[j], questionPool[i]];
}

    /*
     * Avoid repeating the previous question
     * when a new question cycle begins.
     */
    if (
      questionPool.length > 1 &&
      questionPool[0] === lastTargetSymbol
    ) {
      [
        questionPool[0],
        questionPool[1]
      ] = [
        questionPool[1],
        questionPool[0]
      ];
    }
  }

  const nextSymbol = questionPool.shift();

  lastTargetSymbol = nextSymbol;

  return nextSymbol;
}


  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        callback,
        { once: true }
      );
    } else {
      callback();
    }
  }

function getRewardData() {
  // 1. Read custom reward from the current form, if available.
  const customInput = document.getElementById(
    "customerCustomReward"
  );

  const customReward = customInput
    ? customInput.value.trim()
    : "";

  if (customReward) {
    return {
      text: customReward,
      copyable: true
    };
  }

  // 2. Read a selected predefined reward in Preview mode.
  const selectedOption = document.querySelector(
    "#customerRewardOptions .luvora-reward-option.is-selected"
  );

  if (selectedOption) {
    return {
      text: selectedOption.dataset.reward || "",
      copyable: false
    };
  }

  // 3. Read rewards loaded from the paid shared link.
  if (typeof BIRTHDAY_CONFIG !== "undefined") {
    const sharedCustomReward =
      typeof BIRTHDAY_CONFIG.customReward === "string"
        ? BIRTHDAY_CONFIG.customReward.trim()
        : "";

    if (sharedCustomReward) {
      return {
        text: sharedCustomReward,
        copyable: true
      };
    }

    const sharedRewardCode =
      typeof BIRTHDAY_CONFIG.rewardCode === "string"
        ? BIRTHDAY_CONFIG.rewardCode.trim()
        : "";

    if (sharedRewardCode) {
      return {
        text: sharedRewardCode,
        copyable: true
      };
    }

    const sharedRewards = Array.isArray(
      BIRTHDAY_CONFIG.selectedRewards
    )
      ? BIRTHDAY_CONFIG.selectedRewards
      : [];

    if (sharedRewards.length && sharedRewards[0]) {
      return {
        text: String(sharedRewards[0]).trim(),
        copyable: false
      };
    }

    // Backward compatibility with the existing reward property.
    if (BIRTHDAY_CONFIG.reward) {
      return {
        text: String(BIRTHDAY_CONFIG.reward).trim(),
        copyable: true
      };
    }
  }

  // 4. Legacy global reward fallback.
  if (window.LUVORA_REWARD) {
    return {
      text: String(window.LUVORA_REWARD).trim(),
      copyable: true
    };
  }

  // 5. Read saved Preview data as a fallback.
  try {
    const raw =
      sessionStorage.getItem("luvoraSurpriseData") ||
      localStorage.getItem("luvoraSurpriseData");

    if (raw) {
      const data = JSON.parse(raw);

      const custom = String(
        data.customReward || ""
      ).trim();

      if (custom) {
        return {
          text: custom,
          copyable: true
        };
      }

      const rewards = Array.isArray(data.selectedRewards)
        ? data.selectedRewards
        : [];

      if (rewards.length && rewards[0]) {
        return {
          text: String(rewards[0]).trim(),
          copyable: false
        };
      }
    }
  } catch (error) {
    console.warn(
      "Could not read Luvora reward data.",
      error
    );
  }

  // No default reward: never show an unrelated old message.
  return {
    text: "",
    copyable: false
  };
}

  function init() {
    const root = document.getElementById(ROOT_ID);

    if (
      !root ||
      root.dataset.luvoraMysteryGiftReady === "true"
    ) {
      return;
    }

    const startButton =
      document.getElementById(GAME_IDS.start);

    const status =
      document.getElementById(GAME_IDS.status);

    const success =
      document.getElementById(GAME_IDS.success);

    const unlockButton =
      document.getElementById(GAME_IDS.unlock);

    const retryPanel =
      document.getElementById(GAME_IDS.retry);

    const retryText =
      document.getElementById(GAME_IDS.retryText);

    const scratchArea =
      document.getElementById(GAME_IDS.scratchArea);

    const scratchCard =
      document.getElementById(GAME_IDS.scratchCard);

    let scratchCover =
      document.getElementById(GAME_IDS.scratchCover);

    const scratchResult =
      document.getElementById(GAME_IDS.scratchResult);

    const rewardText =
      document.getElementById(GAME_IDS.rewardText);
const finalContinueWrap =
  document.getElementById("luvoraFinalContinueWrap");

const finalContinueButton =
  document.getElementById("luvoraFinalContinueButton");

const finalSurprise =
  document.getElementById("finalSurprise");

if (finalContinueButton && finalSurprise) {
  finalContinueButton.addEventListener("click", () => {

    document.documentElement.classList.remove(
      "luvora-game-return",
      "luvora-cake-return"
    );

    document.documentElement.classList.add(
      "luvora-final-surprise-return"
    );

    finalSurprise.classList.add("flow-unlocked");

    if (finalContinueWrap) {
      finalContinueWrap.hidden = true;
    }

    const finalActions =
      document.getElementById("previewActions");

    if (finalActions) {
      finalActions.classList.add("show");
    }

    setTimeout(() => {
      finalSurprise.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 150);

  });
}

    const boxes = GAME_IDS.boxes.map(function (id) {
      return document.getElementById(id);
    });

    if (
      !startButton ||
      !status ||
      !scratchArea ||
      boxes.some(function (box) {
        return !box;
      })
    ) {
      console.warn(
        "Luvora Mystery Gift: required HTML elements are missing."
      );
      return;
    }

    const boxStage =
      root.querySelector(
        ".luvora-gift-stage, " +
        ".luvora-game-stage, " +
        ".luvora-gift-play-area"
      ) || boxes[0].parentElement;

    if (!boxStage) return;

    root.dataset.luvoraMysteryGiftReady = "true";

    const originalScratchParent =
      scratchArea.parentElement;

    const originalScratchNext =
      scratchArea.nextSibling;

    let targetBox = null;
    let targetSymbol = "❤️";

    let roundLocked = true;
    let scratchInitialized = false;

    let roundTimer = null;
    let shuffleTimer = null;
    let consecutiveWrongAnswers = 0;
    let questionChosenEarly = false;

    let scratchCanvas = null;

    /* -----------------------------------------
       COMMON HELPERS
    ----------------------------------------- */

    function setVisible(element, visible) {
      if (!element) return;

      element.hidden = !visible;

      element.setAttribute(
        "aria-hidden",
        String(!visible)
      );
    }

    function setStatus(message, state) {
      status.textContent = message;

      status.dataset.state = state || "info";

      status.setAttribute("role", "status");

      status.setAttribute("aria-live", "polite");
    }

    function clearTimers() {
      if (roundTimer !== null) {
        window.clearTimeout(roundTimer);
        roundTimer = null;
      }

      if (shuffleTimer !== null) {
        window.clearTimeout(shuffleTimer);
        shuffleTimer = null;
      }
    }

    function shuffleArray(items) {
      const result = items.slice();

      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(
          Math.random() * (i + 1)
        );

        [result[i], result[j]] =
          [result[j], result[i]];
      }

      return result;
    }

    function setBoxSymbol(box, symbolValue) {
      box.dataset.symbol = symbolValue;

      let symbol = box.querySelector(
        ".luvora-gift-symbol"
      );

      if (!symbol) {
        symbol = document.createElement("span");

        symbol.className = "luvora-gift-symbol";

        box.appendChild(symbol);
      }

      symbol.textContent = symbolValue;

      symbol.setAttribute("aria-hidden", "true");
    }

    function resetBoxVisuals() {
      boxes.forEach(function (box) {
        box.disabled = true;

        box.classList.remove(
          "is-correct",
          "is-wrong",
          "is-shuffling",
          "is-selected",
          "is-closed"
        );

        box.removeAttribute("aria-pressed");

        box.style.removeProperty("transform");

        box.style.removeProperty("transition");
      });

      boxStage.dataset.gameState = "preview";
    }

    /* -----------------------------------------
       START / RESET A ROUND
    ----------------------------------------- */

    function beginRound(isRestart) {
      clearTimers();

      roundLocked = true;

      targetBox = null;

      targetSymbol = "❤️";

      setVisible(success, false);

      if (success) {
        success.classList.remove("is-unlocked");
      }

      setVisible(scratchArea, false);

      setVisible(startButton, true);

      setVisible(status, true);

      setVisible(retryPanel, false);

      setVisible(boxStage, true);

      boxes.forEach(function (box) {
        setVisible(box, true);
      });

      resetBoxVisuals();

      /*
       * Randomly place the three symbols inside
       * the three existing physical gift boxes.
       */
      const symbolOrder = shuffleArray(SYMBOLS);

      boxes.forEach(function (box, index) {
        setBoxSymbol(box, symbolOrder[index]);
      });

      startButton.disabled = false;

      startButton.textContent = "MIX THE GIFTS";

      startButton.setAttribute(
        "aria-label",
        "Mix the gifts"
      );

      /*
       * IMPORTANT:
       * Unlock the start button for this round.
       * Box clicks remain disabled until the shuffle ends.
       */
      roundLocked = false;
      /*
       * After three consecutive wrong answers,
       * show the question before the next shuffle.
       */
    if (consecutiveWrongAnswers >= 3) {
  questionChosenEarly = true;

  targetSymbol = getNextTargetSymbol();

        targetBox =
          boxes.find(function (box) {
            return box.dataset.symbol === targetSymbol;
          }) || boxes[0];

        let question;

        if (targetSymbol === "❤️") {
          question = "Where is the Love? ❤️";
        } else if (targetSymbol === "🌹") {
          question = "Where is the Rose? 🌹";
        } else {
          question = "Where is the Diamond? 💎";
        }

        startButton.textContent = "START SHUFFLE";

        startButton.setAttribute(
          "aria-label",
          "Start gift shuffle"
        );

        setStatus(
  question + "\nRead carefully. Shuffle starts in 5 seconds!",
  "ready"
);

        startButton.disabled = true;

        roundLocked = true;

        roundTimer = window.setTimeout(function () {
          if (
            boxStage.dataset.gameState !== "preview"
          ) {
            return;
          }

       startButton.disabled = false;

roundLocked = false;

mixGifts();
        }, 5000);

      } else {
        setStatus(
          isRestart
            ? "Try Again! Look at the symbols, then mix the gifts."
            : "Look closely at the three symbols, then mix the gifts.",
          isRestart ? "retry" : "ready"
        );
      }
      }


    /* -----------------------------------------
       PHYSICAL GIFT BOX SHUFFLE
    ----------------------------------------- */

    function mixGifts() {
      if (
        roundLocked ||
        boxStage.dataset.gameState !== "preview"
      ) {
        return;
      }

      roundLocked = true;

      startButton.disabled = true;

      setVisible(startButton, false);

      setVisible(retryPanel, false);

    /*
     * Choose the next target without repeating
     * a question until the question pool is exhausted.
     */

   if (!questionChosenEarly) {
  targetSymbol = getNextTargetSymbol();
}

questionChosenEarly = false;

targetBox =
  boxes.find(function (box) {
    return box.dataset.symbol === targetSymbol;
  }) || boxes[0];

      /*
       * Close the lids and hide the symbols.
       */
      boxStage.dataset.gameState = "mixing";

      boxes.forEach(function (box) {
        box.disabled = true;

        box.classList.add(
          "is-closed",
          "is-shuffling"
        );
      });

      setStatus(
        "Mixing the gifts… watch carefully!",
        "mixing"
      );

      /*
       * DOUBLE SHUFFLE — two consecutive movements
       */

      function performShuffle(remainingRounds) {
        if (remainingRounds <= 0) {
          boxes.forEach(function (box) {
            box.classList.remove("is-shuffling");
            box.style.removeProperty("transform");
            box.style.removeProperty("transition");
            box.disabled = false;
            box.setAttribute("aria-pressed", "false");
          });

          boxStage.dataset.gameState = "guess";

          let question;

          if (targetSymbol === "❤️") {
            question = "Where is the Love? ❤️";
          } else if (targetSymbol === "🌹") {
            question = "Where is the Rose? 🌹";
          } else {
            question = "Where is the Diamond? 💎";
          }

          setStatus(question, "guess");
          roundLocked = false;
          return;
        }

        const originalPositions = new Map();

        boxes.forEach(function (box) {
          originalPositions.set(
            box,
            box.getBoundingClientRect()
          );
        });

        const currentOrder = boxes.slice().sort(function (a, b) {
          const ra = originalPositions.get(a);
          const rb = originalPositions.get(b);

          if (Math.abs(ra.top - rb.top) > 2) {
            return ra.top - rb.top;
          }

          return ra.left - rb.left;
        });

        let newOrder = shuffleArray(currentOrder);

        if (
          newOrder.every(function (box, index) {
            return box === currentOrder[index];
          })
        ) {
          newOrder = [
            currentOrder[1],
            currentOrder[2],
            currentOrder[0]
          ];
        }

        newOrder.forEach(function (box) {
          boxStage.appendChild(box);
        });

        const offsets = new Map();

        boxes.forEach(function (box) {
          const first = originalPositions.get(box);
          const last = box.getBoundingClientRect();

          offsets.set(box, {
            x: first.left - last.left,
            y: first.top - last.top
          });
        });

        boxes.forEach(function (box) {
          const offset = offsets.get(box);

          box.style.transition = "none";

          box.style.transform =
            "translate(" +
            offset.x +
            "px, " +
            offset.y +
            "px)";
        });

        void boxStage.offsetWidth;

        window.requestAnimationFrame(function () {
          boxes.forEach(function (box) {
            box.style.transition =
              "transform " +
              SHUFFLE_DURATION +
              "ms cubic-bezier(.22,.75,.25,1)";

            box.style.transform = "translate(0, 0)";
          });
        });

        shuffleTimer = window.setTimeout(function () {
          boxes.forEach(function (box) {
            box.style.removeProperty("transform");
            box.style.removeProperty("transition");
          });

          performShuffle(remainingRounds - 1);
        }, SHUFFLE_DURATION + 50);
      }

      performShuffle(SHUFFLE_ROUNDS);
      }

    /* -----------------------------------------
       CORRECT ANSWER
    ----------------------------------------- */

   function revealWin(chosenBox) {
  consecutiveWrongAnswers = 0;

  roundLocked = true;

      boxes.forEach(function (box) {
        box.disabled = true;

        box.classList.remove(
          "is-wrong",
          "is-selected"
        );

        if (box === chosenBox) {
          box.classList.add(
            "is-correct",
            "is-selected"
          );

          box.classList.remove("is-closed");
        }
      });

      boxStage.dataset.gameState = "won";

      if (targetSymbol === "❤️") {
        setStatus(
          "You found the Love! Your mystery gift is waiting. 💝",
          "won"
        );
      } else if (targetSymbol === "🌹") {
        setStatus(
          "You found the Rose! Your mystery gift is waiting. 💝",
          "won"
        );
      } else {
        setStatus(
          "You found the Diamond! Your mystery gift is waiting. 💝",
          "won"
        );
      }

      setVisible(success, true);

      if (success) {
        success.classList.add("is-unlocked");
      }

      if (unlockButton) {
        setVisible(unlockButton, true);
      }

// AUTOMATIC SMOOTH SCROLL TO WINNING REWARD
requestAnimationFrame(() => {
  setTimeout(() => {
    success.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 180);
});
    }

    /* -----------------------------------------
   SCRATCH CARD
----------------------------------------- */

function prepareScratchInSameSpot() {
  if (!scratchCard) return;

  if (scratchArea.parentElement !== boxStage) {
    boxStage.appendChild(scratchArea);
  }

  setVisible(boxStage, true);

  boxes.forEach(function (box) {
    setVisible(box, false);
  });

  setVisible(startButton, false);
  setVisible(status, false);
  setVisible(success, false);
  setVisible(retryPanel, false);
  setVisible(scratchArea, true);

  if (scratchResult) {
    setVisible(scratchResult, false);
  }

  const rewardData = getRewardData();

  if (rewardText) {
    rewardText.textContent = rewardData.text;
  }

  const copyRewardButton = document.getElementById(
    "luvoraCopyReward"
  );

  const copyRewardStatus = document.getElementById(
    "luvoraCopyRewardStatus"
  );

  if (copyRewardButton) {
    copyRewardButton.hidden = !(
      rewardData.copyable && rewardData.text
    );
  }

  if (copyRewardStatus) {
    copyRewardStatus.hidden = true;
    copyRewardStatus.textContent = "";
  }

  setupScratchSurface();

  // AUTOMATIC SMOOTH SCROLL TO SCRATCH CARD
  requestAnimationFrame(() => {
    setTimeout(() => {
      scratchArea.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 150);
  });
}

/* -----------------------------------------
   COPY CUSTOM REWARD
----------------------------------------- */

const copyRewardButton = document.getElementById(
  "luvoraCopyReward"
);

const copyRewardStatus = document.getElementById(
  "luvoraCopyRewardStatus"
);

if (
  copyRewardButton &&
  copyRewardButton.dataset.copyHandlerAttached !== "true"
) {
  copyRewardButton.dataset.copyHandlerAttached = "true";

  copyRewardButton.addEventListener("click", async function () {
    const rewardData = getRewardData();

    if (!rewardData.text || !rewardData.copyable) {
      return;
    }

    try {
      await navigator.clipboard.writeText(rewardData.text);

      copyRewardButton.textContent = "Copied! ✓";

      if (copyRewardStatus) {
        copyRewardStatus.textContent = "Reward copied successfully!";
        copyRewardStatus.hidden = false;
      }

      window.setTimeout(function () {
        copyRewardButton.textContent = "Copy Reward";
      }, 1800);
    } catch (error) {
      if (copyRewardStatus) {
        copyRewardStatus.textContent =
          "Copy unavailable. Please select and copy the reward manually.";

        copyRewardStatus.hidden = false;
      }
    }
  });
}

    function setupScratchSurface() {
      if (scratchInitialized || !scratchCard) {
        return;
      }

      scratchInitialized = true;

      /*
       * Reuse the existing canvas if one exists.
       */
      scratchCover =
        document.getElementById(GAME_IDS.scratchCover);

      let canvas = scratchCover;

      if (!(canvas instanceof HTMLCanvasElement)) {
        canvas = document.createElement("canvas");

        canvas.id = GAME_IDS.scratchCover;

        canvas.className = "luvora-scratch-canvas";

        scratchCard.appendChild(canvas);
      }

      scratchCanvas = canvas;

      canvas.setAttribute(
        "aria-label",
        "Scratch here to reveal your mystery gift"
      );

      canvas.setAttribute("role", "button");

      canvas.setAttribute("tabindex", "0");

      const context = canvas.getContext("2d");

      if (!context) {
        canvas.style.display = "none";

        if (scratchResult) {
          setVisible(scratchResult, true);
        }

        return;
      }

      let isScratching = false;
      let revealed = false;
      let lastPoint = null;
      let scratchCount = 0;

      const brushSize = 28;

      function sizeCanvas() {
        const rect = scratchCard.getBoundingClientRect();

        const width = Math.max(
          240,
          Math.round(rect.width || 320)
        );

        const height = Math.max(
          140,
          Math.round(rect.height || 190)
        );

        const dpr = Math.max(
          1,
          Math.min(2, window.devicePixelRatio || 1)
        );

        canvas.width = Math.round(width * dpr);

        canvas.height = Math.round(height * dpr);

        canvas.style.width = "100%";

        canvas.style.height = "100%";

        canvas.style.position = "absolute";

        canvas.style.inset = "0";

        canvas.style.touchAction = "none";

        context.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

        const gradient = context.createLinearGradient(
          0,
          0,
          width,
          height
        );

        gradient.addColorStop(0, "#f8dbe7");

        gradient.addColorStop(0.48, "#dca7bf");

        gradient.addColorStop(1, "#f4d5a1");

        context.globalCompositeOperation = "source-over";

        context.fillStyle = gradient;

        context.fillRect(
          0,
          0,
          width,
          height
        );

        context.fillStyle = "rgba(86, 32, 61, .82)";

        context.font = "600 16px system-ui, sans-serif";

        context.textAlign = "center";

        context.textBaseline = "middle";

        context.fillText(
          "SCRATCH TO REVEAL",
          width / 2,
          height / 2
        );

        context.globalCompositeOperation = "destination-out";

        scratchCount = 0;
      }

      function getPoint(event) {
        const rect = canvas.getBoundingClientRect();

        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }

      function scratchTo(point) {
        if (!lastPoint) {
          lastPoint = point;
        }

        context.beginPath();

        context.lineCap = "round";

        context.lineJoin = "round";

        context.lineWidth = brushSize;

        context.moveTo(
          lastPoint.x,
          lastPoint.y
        );

        context.lineTo(
          point.x,
          point.y
        );

        context.stroke();

        context.beginPath();

        context.arc(
          point.x,
          point.y,
          brushSize / 2,
          0,
          Math.PI * 2
        );

        context.fill();

        lastPoint = point;

        scratchCount++;

        if (scratchCount % 7 === 0) {
          checkRevealProgress();
        }
      }

      function checkRevealProgress() {
        if (revealed) return;

        try {
          const pixels = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          ).data;

          let transparent = 0;

          const stride = 4 * 12;

          for (
            let i = 3;
            i < pixels.length;
            i += stride
          ) {
            if (pixels[i] < 80) {
              transparent++;
            }
          }

          const sampledPixels = Math.ceil(
            pixels.length / stride
          );

          if (
            transparent / sampledPixels > 0.34
          ) {
            revealScratch();
          }
        } catch (error) {
          if (scratchCount > 55) {
            revealScratch();
          }
        }
      }

      function revealScratch() {
        if (revealed) return;

        revealed = true;

        canvas.style.transition = "opacity .35s ease";

        canvas.style.opacity = "0";

        window.setTimeout(function () {
          canvas.style.display = "none";

          if (scratchResult) {
            setVisible(scratchResult, true);
          }

          scratchArea.classList.add("is-revealed");

if (finalContinueWrap) {
  finalContinueWrap.hidden = false;
}

        }, 360);
      }   
      canvas.addEventListener(
        "pointerdown",
        function (event) {
          if (revealed) return;

          isScratching = true;

          lastPoint = getPoint(event);

          try {
            canvas.setPointerCapture(event.pointerId);
          } catch (error) {}

          scratchTo(lastPoint);

          event.preventDefault();
        }
      );

      canvas.addEventListener(
        "pointermove",
        function (event) {
          if (!isScratching || revealed) return;

          scratchTo(getPoint(event));

          event.preventDefault();
        }
      );

      function stopScratch() {
        isScratching = false;
        lastPoint = null;
      }

      canvas.addEventListener("pointerup", stopScratch);

      canvas.addEventListener("pointercancel", stopScratch);

      canvas.addEventListener("pointerleave", stopScratch);

      canvas.addEventListener(
        "keydown",
        function (event) {
          if (
            (event.key === "Enter" || event.key === " ") &&
            !revealed
          ) {
            event.preventDefault();
            revealScratch();
          }
        }
      );

      window.addEventListener(
        "resize",
        function () {
          if (
            !revealed &&
            canvas.style.display !== "none"
          ) {
            sizeCanvas();
          }
        }
      );

      scratchCard.style.position = "relative";

      scratchCard.style.overflow = "hidden";

      sizeCanvas();
    }

    /* -----------------------------------------
       GIFT BOX CLICK HANDLERS
    ----------------------------------------- */

    boxes.forEach(function (box) {
      box.addEventListener("click", function () {
        if (
          roundLocked ||
          box.disabled ||
          boxStage.dataset.gameState !== "guess"
        ) {
          return;
        }

        if (box === targetBox) {
          revealWin(box);
          return;
        }

        /*
         * Wrong answer:
         * show Try Again, then start a fresh round.
         */

        consecutiveWrongAnswers++;
        roundLocked = true;

        box.disabled = true;

        box.classList.add("is-wrong");

        setStatus(
          "Not this one — Try Again!",
          "wrong"
        );

        if (retryText) {
          retryText.textContent = "Try Again!";
        }

        setVisible(retryPanel, Boolean(retryPanel));

        roundTimer = window.setTimeout(
          function () {
            beginRound(true);
          },
          RETRY_DELAY
        );
      });

      box.setAttribute(
        "aria-label",
        "Mystery gift box"
      );

      box.setAttribute(
        "aria-pressed",
        "false"
      );
    });

    /* -----------------------------------------
       BUTTON HANDLERS
    ----------------------------------------- */

    startButton.addEventListener(
      "click",
      mixGifts
    );

    if (unlockButton) {
      unlockButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();

          if (boxStage.dataset.gameState !== "won") {
            return;
          }

          prepareScratchInSameSpot();
        }
      );
    }

    const directScratchTrigger = root.querySelector(
      "[data-luvora-reveal-reward]"
    );

    if (directScratchTrigger) {
      directScratchTrigger.addEventListener(
        "click",
        function (event) {
          event.preventDefault();

          if (boxStage.dataset.gameState !== "won") {
            return;
          }

          prepareScratchInSameSpot();
        }
      );
    }

    /* -----------------------------------------
       RESET EVENT
    ----------------------------------------- */

    root.addEventListener(
      "luvora:mysterygift:reset",
      function () {
        clearTimers();

        if (
          originalScratchParent &&
          scratchArea.parentElement !== originalScratchParent
        ) {
          if (
            originalScratchNext &&
            originalScratchNext.parentNode === originalScratchParent
          ) {
            originalScratchParent.insertBefore(
              scratchArea,
              originalScratchNext
            );
          } else {
            originalScratchParent.appendChild(scratchArea);
          }
        }

        /*
         * Remove only the scratch canvas created by this module.
         * Keep all existing page and birthday elements untouched.
         */
        if (scratchCanvas && scratchCanvas.isConnected) {
          scratchCanvas.remove();
        }

        scratchCanvas = null;

        scratchInitialized = false;

        scratchCover =
          document.getElementById(GAME_IDS.scratchCover);

        scratchArea.classList.remove("is-revealed");

        setVisible(scratchArea, false);

        beginRound(false);
      }
    );

    /* -----------------------------------------
       INITIAL STATE
    ----------------------------------------- */

    setVisible(scratchArea, false);

    setVisible(success, false);

    setVisible(retryPanel, false);

    beginRound(false);
  }

  onReady(init);

})();


/* ================================================
   LUVORA — SLOT PRINT TO ROMANTIC PHOTO CARD
================================================ */

(function () {
  "use strict";

  const section = document.getElementById("luvoraCameraSection");
  if (!section || section.dataset.cameraV3 === "ready") return;
  section.dataset.cameraV3 = "ready";

  const get = (id) => section.querySelector("#" + id);

  const stage = get("luvoraCameraStage");
  const button = get("luvoraPrintButton");
  const flash = get("luvoraCameraFlash");
  const print = get("luvoraCameraPrint");
  const photo = get("luvoraCameraImage");
  const hint = get("luvoraCameraHint");
  const message = get("luvoraRomanticMessage");
  const typing = get("luvoraRomanticTyping");
  const input = get("luvoraSelfieInput");
  const uploadStatus = get("luvoraUploadStatus");
  const uploadButton = get("luvoraUploadButton");
  const uploadSection = section.querySelector(".luvora-selfie-upload");

  // Move selfie upload card above the camera
if (uploadSection && stage) {
  section.insertBefore(uploadSection, stage);
}

  if (
  !stage || !button || !flash || !print || !photo ||
!hint || !message || !typing ||
!input || !uploadStatus || !uploadButton
  ) {
    console.error("LUVORA Camera: Missing required HTML elements.");
    return;
  }

  const cameraImage = button.querySelector(".luvora-camera-image");
  const photoFrame = print.querySelector(".luvora-photo-frame");
  const caption = print.querySelector(".luvora-photo-caption");

  const DEFAULT_SELFIE = "assets/images/selfie.png";

  const LOVE_MESSAGE =
    "If I could keep one moment forever, it would be the one where I'm close to you. You make ordinary moments feel like a beautiful love story.";

  let uploadedURL = null;
  window.sharedCameraSelfie = "";
  let printing = false;
  let printed = false;
  let typingTimer = null;
  let flashTimer = null;
  let revealTimer = null;
  let printAnimationActive = false;


// LUVORA Real Camera Click Sound
const luvoraCameraClickSound = new Audio("assets/musics/click.mp3");

luvoraCameraClickSound.preload = "auto";
luvoraCameraClickSound.volume = 0.8;

function playLuvoraCameraClick() {
  luvoraCameraClickSound.currentTime = 0;

  luvoraCameraClickSound.play().catch((error) => {
    console.warn("Camera sound could not play:", error);
  });
}

     
  /*
    Put the romantic message INSIDE the Polaroid card,
    beneath the photograph and caption.
  */
  if (photoFrame && message.parentElement !== photoFrame) {
    photoFrame.appendChild(message);
  }

  function stopTimers() {
    clearTimeout(typingTimer);
    clearTimeout(flashTimer);
    clearTimeout(revealTimer);

    typingTimer = null;
    flashTimer = null;
    revealTimer = null;
  }

function typeLoveMessage(onComplete) {
  clearTimeout(typingTimer);
  typing.textContent = "";

  let index = 0;
  let typingActive = true;

  function finishTyping() {
    if (!typingActive) return;

    typingActive = false;

    clearTimeout(typingTimer);
    typingTimer = null;

    document.removeEventListener(
      "pointerdown",
      handleScreenTouch,
      true
    );

    typing.textContent = LOVE_MESSAGE;

    if (typeof onComplete === "function") {
      onComplete();
    }
  }

  function handleScreenTouch(event) {
  if (!typingActive) return;

  finishTyping();
}

  document.addEventListener(
    "pointerdown",
    handleScreenTouch,
    true
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    finishTyping();
    return;
  }

  function next() {
    if (!typingActive) return;

    if (index >= LOVE_MESSAGE.length) {
      typingActive = false;
      typingTimer = null;

      document.removeEventListener(
        "pointerdown",
        handleScreenTouch,
        true
      );

      if (typeof onComplete === "function") {
        onComplete();
      }

      return;
    }

    const character = LOVE_MESSAGE[index++];
    typing.textContent += character;

    let delay = 32;

    if (character === ",") delay = 170;
    if (character === ".") delay = 300;

    typingTimer = setTimeout(next, delay);
  }

  next();
}

function completePrintAnimation() {
  if (!printAnimationActive) return;

  printAnimationActive = false;

  clearTimeout(revealTimer);
  revealTimer = null;

  print.classList.remove("is-printing");
  print.classList.add("is-printed");

  stage.classList.add("is-card-revealed");

  setTimeout(function () {

    if (!printed) return;

    typeLoveMessage(function () {

      if (!printed || !uploadSection) return;

      // Show Add Your Selfie card
      uploadSection.classList.add("is-upload-revealed");

      // Show Continue button at the same time
      const continueButton = document.getElementById(
        "cameraContinueButton"
      );

      const continueWrap = continueButton?.closest(
        ".birthday-flow-continue-wrap"
      );

      if (continueWrap) {
        continueWrap.classList.remove(
          "birthday-flow-continue-hidden"
        );
      }

    });

    printing = false;

  }, 250);
}

document.addEventListener(
  "pointerdown",
  function (event) {

    if (!printAnimationActive) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    completePrintAnimation();

  },
  true
);

function restartFlash() {
    flash.classList.remove("is-flashing");
    void flash.offsetWidth;
    flash.classList.add("is-flashing");
  }

  function resetCamera() {

  printAnimationActive = false;

  const cameraContinueButton = document.getElementById(
    "cameraContinueButton"
  );

  const cameraContinueWrap = cameraContinueButton?.closest(
    ".birthday-flow-continue-wrap"
  );

  if (cameraContinueWrap) {
    cameraContinueWrap.classList.add(
      "birthday-flow-continue-hidden"
    );
  }

  // নিচে তোমার আগের resetCamera() code আগের মতোই থাকবে
    if (uploadSection) {
       uploadSection.classList.remove("is-upload-revealed");
       }
    stopTimers();

    printing = false;
    printed = false;

    stage.classList.remove("is-card-revealed");

    button.disabled = false;
    button.style.removeProperty("opacity");
    button.style.removeProperty("visibility");
    button.style.removeProperty("pointer-events");

    hint.style.opacity = "1";

    print.classList.remove("is-printing", "is-printed");

    [
      "top", "width", "opacity", "visibility",
      "transform", "z-index", "animation", "clip-path"
    ].forEach(function (property) {
      print.style.removeProperty(property);
    });

    flash.classList.remove("is-flashing");

    typing.textContent = "";
  }

  async function printMemory() {
    if (printing || printed) return;

    printing = true;
    printed = true;
    button.disabled = true;
    hint.style.opacity = "0";

  const selectedPhoto =
  (LUVORA_IS_FINAL_SURPRISE && window.sharedCameraSelfie)
    ? window.sharedCameraSelfie
    : (uploadedURL || DEFAULT_SELFIE);


    try {
      // Confirm that the selected image is actually available.
      await new Promise(function (resolve, reject) {
        const testImage = new Image();
        testImage.onload = resolve;
        testImage.onerror = reject;
        testImage.src = selectedPhoto;
      });
    } catch (error) {
      console.error("LUVORA photo loading error:", error);

      

      printing = false;
      printed = false;
      button.disabled = false;
      hint.style.opacity = "1";
      return;
    }

    // Do not continue if the camera was reset while loading.
    if (!printing || !printed) return;

    photo.src = selectedPhoto;
photo.alt =
  (LUVORA_IS_FINAL_SURPRISE && window.sharedCameraSelfie) || uploadedURL
    ? "Your uploaded couple selfie"
    : "Our beautiful memory";

  // Instant flash burst, then the print starts.
restartFlash();

flashTimer = setTimeout(function () {

  if (!printing) return;

  print.classList.remove("is-printed");
  print.classList.add("is-printing");

  printAnimationActive = true;

  // Automatically finish after 4.3 seconds
  revealTimer = setTimeout(function () {
    completePrintAnimation();
  }, 4300);

}, 100);
  }

 
  button.addEventListener("click", function () {
    if (printing || printed) return;

    playLuvoraCameraClick();
    printMemory();
  });



  input.addEventListener("change", async function () {
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      input.value = "";
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      uploadStatus.textContent =
        "Please choose an image smaller than 12 MB.";
      input.value = "";
      return;
    }

    uploadButton.style.pointerEvents = "none";
    uploadButton.style.opacity = ".6";


    const newURL = URL.createObjectURL(file);

    try {
      // Confirm that the selected image can be loaded.
      await new Promise(function (resolve, reject) {
        const testImage = new Image();
        testImage.onload = resolve;
        testImage.onerror = reject;
        testImage.src = newURL;
      });

      // Save the selfie for payment and shared-link use.
      await saveDraftFile("camera-selfie", file);

      if (uploadedURL) {
        URL.revokeObjectURL(uploadedURL);
      }

      uploadedURL = newURL;

      resetCamera();

      section.scrollIntoView({
        behavior: "instant",
        block: "start"
      });

    } catch (error) {
      URL.revokeObjectURL(newURL);

      uploadStatus.textContent =
        "Couldn't save your photo. Please try again.";

      console.error(
        "LUVORA: Camera selfie processing failed:",
        error
      );

    } finally {
      uploadButton.style.pointerEvents = "";
      uploadButton.style.opacity = "";
      input.value = "";
    }
  });

  if (cameraImage) {
    cameraImage.addEventListener("error", function () {
      status.textContent = "Check assets/images/camera.png";
    });
  }

  resetCamera();

})();

/* ==========================================
   LUVORA BIRTHDAY MUSIC — MUTE / UNMUTE
   ========================================== */

(function initLuvoraMusicToggle() {
  function setupMusicToggle() {
    const music = document.getElementById("luvoraBirthdayMusic");

    const buttons = document.querySelectorAll(
      "#luvoraMusicToggle, .luvora-music-toggle, [data-music-toggle]"
    );

    if (!music || buttons.length === 0) {
      console.warn("LUVORA music or mute button not found.");
      return;
    }

    function updateButton() {
      buttons.forEach(function (button) {
        button.textContent = music.muted ? "🔇" : "🔊";

        button.setAttribute(
          "aria-label",
          music.muted ? "Unmute birthday music" : "Mute birthday music"
        );

        button.setAttribute(
          "aria-pressed",
          String(!music.muted)
        );
      });
    }

    buttons.forEach(function (button) {
      // Prevent duplicate click listeners.
      if (button.dataset.musicToggleReady === "true") {
        return;
      }

      button.dataset.musicToggleReady = "true";

      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        music.muted = !music.muted;

        updateButton();
      });
    });

    updateButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      setupMusicToggle,
      { once: true }
    );
  } else {
    setupMusicToggle();
  }
})();

// LUVORA Balloon Pop Sound
window.playLuvoraBalloonPop = function () {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!window.luvoraBalloonAudioContext) {
      window.luvoraBalloonAudioContext =
        new AudioContextClass();
    }

    const ctx = window.luvoraBalloonAudioContext;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(700, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      180,
      now + 0.12
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.17);
  } catch (error) {
    console.warn("LUVORA balloon sound unavailable:", error);
  }
};


/* =========================================
   LUVORA — REWARD MODE SWITCH
========================================= */

(() => {

  const listButton = document.getElementById("rewardListMode");
  const customButton = document.getElementById("rewardCustomMode");

  const listContent = document.getElementById("rewardListContent");
  const customContent = document.getElementById("rewardCustomContent");

  if (
    !listButton ||
    !customButton ||
    !listContent ||
    !customContent
  ) {
    return;
  }

  function setRewardMode(mode) {

    const isList = mode === "list";

    listContent.hidden = !isList;
    customContent.hidden = isList;

    listButton.classList.toggle("active", isList);
    customButton.classList.toggle("active", !isList);

    listButton.setAttribute("aria-pressed", String(isList));
    customButton.setAttribute("aria-pressed", String(!isList));

    // Switching to custom mode clears predefined selection.
    if (!isList) {

      document
        .querySelectorAll("#customerRewardOptions .luvora-reward-option")
        .forEach(option => {
          option.classList.remove("is-selected");
          option.setAttribute("aria-pressed", "false");
        });

      const placeholder = document.getElementById(
        "customerRewardPlaceholder"
      );

      if (placeholder) {
        placeholder.textContent = "Select a special reward";
      }

    } else {

      // Switching to list mode clears custom gift text.
      const customInput = document.getElementById(
        "customerCustomReward"
      );

      if (customInput) {
        customInput.value = "";
      }

    }

  }

  listButton.addEventListener("click", () => {
    setRewardMode("list");
  });

  customButton.addEventListener("click", () => {
    setRewardMode("custom");
  });

  // Initial state
  setRewardMode("list");

})();

// =========================================
// BIRTHDAY VIDEO UPLOAD — SELECT / REMOVE
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  const videoInput = document.getElementById("customerVideo");
  const chooseButton = document.querySelector(".video-choose-button");
  const selectedFile = document.getElementById("videoSelectedFile");
  const fileName = document.getElementById("customVideoName");
  const removeButton = document.getElementById("removeCustomerVideo");

  if (!videoInput || !chooseButton || !selectedFile || !fileName || !removeButton) {
    console.error("Birthday video upload elements missing.");
    return;
  }

  videoInput.addEventListener("change", () => {

    const file = videoInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      videoInput.value = "";
      return;
    }

    fileName.textContent = file.name;

    chooseButton.hidden = true;
    selectedFile.hidden = false;

  });

  removeButton.addEventListener("click", async () => {

    videoInput.value = "";

if (typeof currentVideoUrl !== "undefined" && currentVideoUrl) {
  URL.revokeObjectURL(currentVideoUrl);
  currentVideoUrl = "";
}

    const player = document.getElementById("birthdayVideo");
    const source = document.getElementById("birthdayVideoSource");
    const placeholder = document.getElementById("videoPlaceholder");

    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }

    if (source) {
      source.removeAttribute("src");
    }

    if (placeholder) {
      placeholder.style.display = "";
    }

    if (typeof BIRTHDAY_CONFIG !== "undefined") {
      BIRTHDAY_CONFIG.video = "";
    }

    if (typeof deleteDraftFile === "function") {
      try {
        await deleteDraftFile("video");
      } catch (error) {
        console.error(error);
      }
    }

    fileName.textContent = "";
    selectedFile.hidden = true;
    chooseButton.hidden = false;

  });

});

// =========================================
// AUTO HIDE SCROLL INDICATOR
// =========================================

window.addEventListener("scroll", () => {

  const scrollHint = document.querySelector(
    ".birthday-scroll-hint"
  );

  if (!scrollHint) return;

  if (window.scrollY > 30) {
    scrollHint.classList.add("scroll-hint-hidden");
  } else {
    scrollHint.classList.remove("scroll-hint-hidden");
  }

}, { passive: true });

/* =====================================================
LUVORA — SEQUENTIAL BIRTHDAY EXPERIENCE
FADE SECTION + FADE TEXT + ZOOM CONTENT
===================================================== */

(function initBirthdayRevealFlow() {

const flow = [
{
button: "balloonContinueButton",
current: "balloonSection",
next: "luvoraCameraSection"
},
{
button: "cameraContinueButton",
current: "luvoraCameraSection",
next: "letterSection"
},
{
button: "letterContinueButton",
current: "letterSection",
next: "memoriesSection"
},
{
button: "memoryContinueButton",
current: "memoriesSection",
next: "videoSection"
}
];

flow.forEach((step) => {


const button = document.getElementById(step.button);
const currentSection = document.getElementById(step.current);
const nextSection = document.getElementById(step.next);

if (!button || !currentSection || !nextSection) return;

const currentWrap = button.closest(
  ".birthday-flow-continue-wrap"
);

const nextFlow = flow.find(
  item => item.current === step.next
);

const nextButton = nextFlow
  ? document.getElementById(nextFlow.button)
  : null;

const nextWrap = nextButton
  ? nextButton.closest(".birthday-flow-continue-wrap")
  : null;

// Hide upcoming Continue buttons initially
if (nextWrap) {
  nextWrap.classList.add(
    "birthday-flow-continue-hidden"
  );
}
button.addEventListener("click", () => {

  if (button.disabled) return;

  button.disabled = true;
let destinationSection = nextSection;

// FINAL SURPRISE — SKIP VIDEO IF NO VIDEO WAS UPLOADED
if (
  LUVORA_IS_FINAL_SURPRISE &&
  step.button === "memoryContinueButton"
) {

 const videoSourceValue = String(
  BIRTHDAY_CONFIG.video || ""
).trim();

const activeVideoSource = String(
  birthdayVideo?.currentSrc || ""
).trim();

const hasUploadedVideo = Boolean(
  videoSourceValue || activeVideoSource
);

  if (!hasUploadedVideo) {

    // Hide the complete video section
    const videoSection = document.getElementById("videoSection");

    if (videoSection) {
      videoSection.classList.add("birthday-flow-hidden");
    }

    // Direct destination: Cake
    destinationSection = document.getElementById("cakePageSection");

  }

}

if (!destinationSection) return;
  // Hide the current section
  currentSection.classList.add(
    "birthday-flow-hidden"
  );

// Hide Hero together with Balloon
if (step.button === "balloonContinueButton") {
  const heroSection = document.getElementById("birthdayHero");

  if (heroSection) {
    heroSection.classList.add("birthday-flow-hidden");
  }
}

  // Hide its Continue button
  if (currentWrap) {
    currentWrap.classList.add(
      "birthday-flow-continue-hidden"
    );
  }

  // Prepare next section
  destinationSection.classList.remove(
    "birthday-flow-hidden",
    "camera-section-hidden",
    "camera-section-visible",
    "birthday-flow-revealed"
  );

  // Camera reveal compatibility
  if (step.next === "luvoraCameraSection") {
    nextSection.classList.add(
      "camera-section-visible"
    );
  }

  // Trigger entrance animations
  void destinationSection.offsetWidth;

 destinationSection.classList.add(
  "birthday-flow-revealed"
);

  // Reveal next Continue button
// Camera button will be revealed when romantic typing starts.
if (nextWrap && step.button !== "balloonContinueButton") {
  nextWrap.classList.remove(
    "birthday-flow-continue-hidden"
  );
}

});

});

})();
/* =========================================
   LUVORA — PRIVATE CINEMA START
========================================= */

(function initPrivateCinema() {

  function setupCinema() {

    const section = document.getElementById("videoSection");
    const invitation = document.getElementById("cinemaInvitation");
    const beginButton = document.getElementById("beginMovieButton");
    const cinemaStage = section?.querySelector(".luvora-projector-stage");

    if (!section || !invitation || !beginButton || !cinemaStage) {
      return;
    }

    beginButton.addEventListener("click", () => {

      if (section.classList.contains("cinema-started")) return;

      beginButton.disabled = true;

      invitation.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      invitation.style.opacity = "0";
      invitation.style.transform = "scale(0.95)";

      setTimeout(() => {

        invitation.style.display = "none";

        section.classList.add("cinema-started");

        cinemaStage.style.animation = "cinemaInvitationEnter 1s ease both";

        cinemaStage.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }, 750);

    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupCinema);
  } else {
    setupCinema();
  }

})();
