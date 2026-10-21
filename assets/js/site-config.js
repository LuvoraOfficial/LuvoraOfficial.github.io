window.SITE_CONFIG = {
  brandName: "Luvora",
  tagline: "Turn Moments Into Memories.",
  copyrightYear: "2026"
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-site-brand]").forEach(el => {
    el.textContent = window.SITE_CONFIG.brandName;
  });
  document.querySelectorAll("[data-site-tagline]").forEach(el => {
    el.textContent = window.SITE_CONFIG.tagline;
  });
  document.querySelectorAll("[data-site-year]").forEach(el => {
    el.textContent = window.SITE_CONFIG.copyrightYear;
  });
});

/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

window.SUPABASE_CONFIG = {
  url: "https://yyxcoojwjihimfhnjkhg.supabase.co",
  publishableKey: "sb_publishable_mz1iukZ_LByi-5YK82fhKw_FxcnX1X7"
};