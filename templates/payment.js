/* =========================================================
   LUVORA DRAFT FILE STORAGE
   Reads customer photos and video saved on Birthday page.
   ========================================================= */

const LUVORA_DRAFT_DB = "luvoraDraftDB";
const LUVORA_DRAFT_STORE = "draftFiles";

function openDraftDatabase() {

  return new Promise((resolve, reject) => {

    const request =
      indexedDB.open(LUVORA_DRAFT_DB, 1);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

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

          resolve(
            request.result || null
          );

        };

        request.onerror = () => {

          db.close();

          reject(
            request.error
          );

        };

      });

    });

}

document.addEventListener("DOMContentLoaded", () => {

  const payNowButton =
    document.getElementById("payNowButton");

  const backButton =
    document.getElementById("backButton");


  /* =====================================================
     LOAD CUSTOMER DATA
     ===================================================== */

  let surpriseData = null;

const savedData =
  sessionStorage.getItem("luvoraSurpriseData") ||
  localStorage.getItem("luvoraSurpriseData");
   
  if (savedData) {

    try {

      surpriseData =
        JSON.parse(savedData);

    } catch (error) {

      console.error(
        "Could not read surprise data:",
        error
      );

    }

  }

const customerNameDisplay =
  document.getElementById("customerNameDisplay");

const customerDateDisplay =
  document.getElementById("customerDateDisplay");

if (surpriseData) {

  if (
    customerNameDisplay &&
    surpriseData.name
  ) {
    customerNameDisplay.textContent =
      surpriseData.name;
  }

  if (
    customerDateDisplay &&
    surpriseData.date
  ) {
    customerDateDisplay.textContent =
      surpriseData.date;
  }

}

/* =====================================================
   LOAD SAVED CUSTOMER MEDIA
   ===================================================== */

async function checkSavedMedia() {

  try {

    let photoCount = 0;


    /* Check up to 6 saved photos */

    for (let i = 0; i < 6; i++) {

      const photo =
        await getDraftFile(
          `photo-${i}`
        );

      if (photo) {
        photoCount++;
      }

    }


    /* Check saved video */

    const savedVideo =
      await getDraftFile("video");


    console.log(
      "Luvora draft media:",
      {
        photos: photoCount,
        video: savedVideo
          ? savedVideo.name
          : "No video"
      }
    );


  } catch (error) {

    console.error(
      "Could not load draft media:",
      error
    );

  }

}


checkSavedMedia();


   /* =====================================================
     REAL CASHFREE PAYMENT
     LUVORA — ₹49 PAYMENT LINK
     ===================================================== */

  if (payNowButton) {

    payNowButton.addEventListener("click", async () => {

      if (!surpriseData) {

        alert(
          "Your surprise information could not be found. Please go back and try again."
        );

        return;
      }


      /* -------------------------------------------------
         LOCK BUTTON
      ------------------------------------------------- */

      payNowButton.disabled = true;

      payNowButton.innerHTML =
        `Preparing Payment <span>...</span>`;


      try {

        /* -------------------------------------------------
           GET EXISTING LUVORA SUPABASE CLIENT

           Your website is already connected to Supabase.
        ------------------------------------------------- */

       const client = supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);


        /* -------------------------------------------------
           CUSTOMER DATA
        ------------------------------------------------- */

        const requestData = {

          name:
            surpriseData.name || "",

          birthday_date:
            surpriseData.date || "",

          template:
            surpriseData.template ||
            "birthday-story",

          photos:
            Array.isArray(surpriseData.photos)
              ? surpriseData.photos
              : [],

          video:
            surpriseData.video || ""

        };


        console.log(
          "Luvora payment request:",
          requestData
        );


        /* -------------------------------------------------
           CALL SUPABASE EDGE FUNCTION
        ------------------------------------------------- */

        const { data, error } =
          await client.functions.invoke(
            "create-payment",
            {
              body: requestData
            }
          );


        /* -------------------------------------------------
           SUPABASE ERROR
        ------------------------------------------------- */

        if (error) {

          console.error(
            "create-payment error:",
            error
          );

          throw new Error(
            error.message ||
            "Could not start payment."
          );

        }


        /* -------------------------------------------------
           EDGE FUNCTION ERROR
        ------------------------------------------------- */

        if (
          !data ||
          !data.success ||
          !data.payment_url
        ) {

          console.error(
            "Invalid payment response:",
            data
          );

          throw new Error(
            data?.error ||
            "Payment link could not be created."
          );

        }


        /* -------------------------------------------------
           SAVE PAYMENT INFORMATION LOCALLY
           
           Useful when returning from Cashfree.
        ------------------------------------------------- */

        sessionStorage.setItem(
          "luvoraPaymentData",
          JSON.stringify({

            surprise_id:
              data.surprise_id,

            link_id:
              data.link_id,

            amount:
              data.amount

          })
        );


        console.log(
          "Cashfree payment link created:",
          data.payment_url
        );


        /* -------------------------------------------------
           GO TO CASHFREE
        ------------------------------------------------- */

        window.location.href =
          data.payment_url;


      } catch (error) {

        console.error(
          "Luvora payment error:",
          error
        );


        payNowButton.disabled = false;

        payNowButton.innerHTML =
          `Continue to Payment <span>→</span>`;


        alert(
          error.message ||
          "Unable to start payment. Please try again."
        );

      }

    });

  }


  /* =====================================================
     BACK BUTTON
     ===================================================== */

  if (backButton) {

    backButton.addEventListener("click", () => {

      window.history.back();

    });

  }

});
