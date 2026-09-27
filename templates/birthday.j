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

  date: "A very special day",

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

const replayButton =
  document.getElementById("replayButton");


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

balloons.forEach((balloon, index) => {

  balloon.addEventListener("click", () => {

    /* Prevent clicking the same balloon twice */

    if (balloon.classList.contains("popped")) {
      return;
    }

    poppedBalloons++;

    /* Get message */

    const message =
      balloon.dataset.message ||
      BIRTHDAY_CONFIG.balloonMessages[index] ||
      "You are incredibly special. ❤️";

    /* Show message */

    if (balloonMessageText) {
      balloonMessageText.textContent =
        message;
    }

    if (balloonMessage) {
      balloonMessage.classList.add("visible");
    }

    /* Pop animation */

    balloon.classList.add("popped");

    /* Small celebration */

    createFloatingHearts(3);

    createMiniConfetti(12);

    /* After all balloons */

    if (poppedBalloons === balloons.length) {

      setTimeout(() => {

        if (balloonMessageText) {

          balloonMessageText.textContent =
            "You found every little message. But this is only the beginning... 💖";

        }

        createFloatingHearts(10);
        createMiniConfetti(30);

      }, 600);

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
   07 — MEMORY GALLERY
   ========================================================= */

function loadCustomerPhotosFromURL() {
  const params = new URLSearchParams(window.location.search);
  const photos = params.get("photos");

  if (!photos) return;

  const photoList = photos
    .split(",")
    .map(photo => photo.trim())
    .filter(photo => photo);

  if (photoList.length > 0) {
    BIRTHDAY_CONFIG.photos = photoList;
  }
}

function loadMemoryGallery() {

  if (!memoryGallery) {
    return;
  }

  /* If there are no customer photos,
     keep the beautiful placeholder. */

  if (
    !BIRTHDAY_CONFIG.photos ||
    BIRTHDAY_CONFIG.photos.length === 0
  ) {
    return;
  }

  memoryGallery.innerHTML = "";

  BIRTHDAY_CONFIG.photos
    .slice(0, 6)
    .forEach((photo, index) => {

      const card =
        document.createElement("div");

      card.className =
        "memory-card";

      const image =
        document.createElement("img");

      image.src = photo;

      image.alt =
        `Birthday memory ${index + 1}`;

      image.loading = "lazy";

      card.appendChild(image);

      memoryGallery.appendChild(card);

    });

}


/* =========================================================
   08 — VIDEO SYSTEM
   ========================================================= */

function loadBirthdayVideo() {

  if (
    !birthdayVideo ||
    !birthdayVideoSource
  ) {
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

      if (wishMessage) {

        wishMessage.classList.add("visible");

      }

      createMiniConfetti(80);
      createFloatingHearts(20);

      /* Scroll slightly so the message
         becomes visible */

      setTimeout(() => {

        if (wishMessage) {

          wishMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

      }, 250);


      /* Show preview actions
         after the final birthday wish */

      setTimeout(() => {

        if (previewActions) {

          previewActions.classList.add("show");

          previewActions.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

      }, 900);

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
   15 — REPLAY EXPERIENCE
   ========================================================= */

if (replayButton) {

  replayButton.addEventListener(
    "click",
    () => {

      /* Reset balloons */

      balloons.forEach((balloon) => {

        balloon.classList.remove("popped");

      });

      poppedBalloons = 0;


      /* Reset balloon message */

      if (balloonMessage) {
        balloonMessage.classList.remove(
          "visible"
        );
      }


      /* Reset envelope */

      if (loveEnvelope) {
        loveEnvelope.classList.remove(
          "open"
        );
      }


      /* Reset candles */

      candles.forEach((candle) => {

        candle.classList.remove("blown");

      });

      blownCandles = 0;


      /* Reset wish */

      if (wishMessage) {
        wishMessage.classList.remove(
          "visible"
        );
      }


      /* Return to top */

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


      /* Small restart celebration */

      setTimeout(() => {

        createFloatingHearts(10);

      }, 800);

    }
  );

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
      customizationPanel.classList.toggle("active");

      customizationPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  if (customerName) {
    customerName.addEventListener("input", () => {
      const name = customerName.value.trim();

      if (!name) return;

      if (birthdayName) birthdayName.textContent = name;
      if (finalBirthdayName) finalBirthdayName.textContent = name;

      letterRecipients.forEach((recipient) => {
        recipient.textContent = name;
      });
    });
  }

  if (customerDate) {
    customerDate.addEventListener("input", () => {
      const date = customerDate.value.trim();

      if (!date) return;

      if (birthdayDate) birthdayDate.textContent = date;
    });
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

  const customVideoName =
    document.getElementById("customVideoName");

  let currentVideoUrl = "";


  /* =====================================================
     VIDEO FILE SELECTION
     ===================================================== */

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


      /* Show only the filename */

      if (customVideoName) {

        customVideoName.textContent =
          `Selected: ${file.name}`;

      }


      /* Save the actual video file */

      await saveDraftFile(
        "video",
        file
      );


      loadBirthdayVideo();

    }
  );


  /* =====================================================
     RESTORE SAVED VIDEO
     ===================================================== */

  async function restoreSavedVideo() {

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

  }


  restoreSavedVideo();

}
 
  const previewButton = document.getElementById("previewSurpriseButton");
  const previewStatus = document.getElementById("previewStatus");

const previewActions =
  document.getElementById("previewActions");

const backToEditButton =
  document.getElementById("backToEditButton");

const previewCreateButton =
  document.getElementById("previewCreateButton");

 if (previewButton) {
  previewButton.addEventListener("click", () => {

    if (previewStatus) {
      previewStatus.classList.add("show");
      previewStatus.textContent =
        "✨ Your personalized preview is ready.";
    }

      if (customizationPanel) {
      customizationPanel.classList.remove("active");
    }

    const hero = document.getElementById("birthdayHero");

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

const createSurpriseButton =
  document.getElementById("createSurpriseButton");

if (createSurpriseButton) {

  createSurpriseButton.addEventListener(
    "click",
    () => {

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
         SAVE CUSTOMIZATION DATA
         ================================================= */

      const surpriseData = {

        draftId: draftId,

        template:
          "birthday-story",

        name:
          name ||
          BIRTHDAY_CONFIG.name,

        date:
          date ||
          BIRTHDAY_CONFIG.date,

        mediaStorage:
          "indexeddb"

      };


      sessionStorage.setItem(
        "luvoraSurpriseData",
        JSON.stringify(
          surpriseData
        )
      );


      /* =================================================
         CONTINUE TO PAYMENT
         ================================================= */

      window.location.href =
        "payment.html";

    }
  );

}

if (previewCreateButton) {
  previewCreateButton.addEventListener("click", () => {

    const createButton =
      document.getElementById("createSurpriseButton");

    if (createButton) {
      createButton.click();
    }
  });
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
