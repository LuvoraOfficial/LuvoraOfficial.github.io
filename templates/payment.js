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


/* =========================================================
   CASHFREE CHECKOUT SDK
   ========================================================= */

function loadCashfreeSDK() {

  return new Promise((resolve, reject) => {

    if (window.Cashfree) {
      resolve();
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://sdk.cashfree.com/js/v3/cashfree.js";

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(
        new Error(
          "Could not load Cashfree Checkout."
        )
      );
    };

    document.head.appendChild(script);

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
    document.getElementById(
      "customerNameDisplay"
    );

  const customerDateDisplay =
    document.getElementById(
      "customerDateDisplay"
    );


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


      for (let i = 0; i < 6; i++) {

        const photo =
          await getDraftFile(
            `photo-${i}`
          );

        if (photo) {
          photoCount++;
        }

      }


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
     CASHFREE PAYMENT
     LUVORA — ₹49
     SANDBOX CHECKOUT
     ===================================================== */

  if (payNowButton) {

    payNowButton.addEventListener(
      "click",
      async () => {

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
             LOAD CASHFREE SDK
          ------------------------------------------------- */

          await loadCashfreeSDK();


          /* -------------------------------------------------
             CREATE SUPABASE CLIENT
          ------------------------------------------------- */

          const client =
            supabase.createClient(
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

            phone:
              surpriseData.phone || "",

            template:
              surpriseData.template ||
              "birthday-story",

            photos:
              Array.isArray(
                surpriseData.photos
              )
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

          const {
            data,
            error
          } =
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
             CHECK PAYMENT RESPONSE
          ------------------------------------------------- */

          if (
            !data ||
            !data.success ||
            !data.payment_session_id
          ) {

            console.error(
              "Invalid payment response:",
              data
            );

            throw new Error(
              data?.error ||
              "Payment session could not be created."
            );

          }


          /* -------------------------------------------------
             SAVE PAYMENT INFORMATION
          ------------------------------------------------- */

          sessionStorage.setItem(
            "luvoraPaymentData",
            JSON.stringify({

              surprise_id:
                data.surprise_id,

              link_id:
                data.link_id,

              order_id:
                data.order_id,

              amount:
                data.amount

            })
          );


          console.log(
            "Cashfree payment session created:",
            data.order_id
          );


          /* -------------------------------------------------
             INITIALIZE CASHFREE
             SANDBOX MODE
          ------------------------------------------------- */

          const cashfree =
            Cashfree({
              mode: "sandbox"
            });


          /* -------------------------------------------------
             OPEN CASHFREE CHECKOUT
          ------------------------------------------------- */

          await cashfree.checkout({

            paymentSessionId:
              data.payment_session_id,

            redirectTarget:
              "_self"

          });


        } catch (error) {

          console.error(
            "Luvora payment error:",
            error
          );


          payNowButton.disabled =
            false;

          payNowButton.innerHTML =
            `Continue to Payment <span>→</span>`;


          alert(
            error.message ||
            "Unable to start payment. Please try again."
          );

        }

      }
    );

  }


  /* =====================================================
     BACK BUTTON
     ===================================================== */

  if (backButton) {

    backButton.addEventListener(
      "click",
      () => {

        window.history.back();

      }
    );

  }

});
