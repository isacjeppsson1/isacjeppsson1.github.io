/* ============================================================
   Elin & Isac — Wedding landing page
   ============================================================ */

/* >>> EDIT <<<  Central config. Change these values to customize the page. */
const CONFIG = {
  // Wedding date & time (local time). Format: YYYY-MM-DDTHH:MM:SS
  weddingDate: "2027-06-12T14:00:00",
  // Address used for the map + "Get directions" link
  mapQuery: "Copenhagen, Denmark",
  // Recipient for the RSVP form (opens the visitor's email app)
  rsvpEmail: "elin.and.isac@example.com",
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCountdown();
  initMap();
  initReveal();
  initRSVP();
  initLightbox();
});

/* ---------- Sticky nav ---------- */
function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- Countdown ---------- */
function initCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };
  if (isNaN(target)) return;

  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    let diff = target - Date.now();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent =
        els.mins.textContent = els.secs.textContent = "00";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad(d);
    els.hours.textContent = pad(h);
    els.mins.textContent = pad(m);
    els.secs.textContent = pad(s);
  };

  tick();
  setInterval(tick, 1000);
}

/* ---------- Map + directions ---------- */
function initMap() {
  const q = encodeURIComponent(CONFIG.mapQuery);
  const frame = document.getElementById("mapFrame");
  const btn = document.getElementById("directionsBtn");
  if (frame) frame.src = `https://www.google.com/maps?q=${q}&output=embed`;
  if (btn) btn.href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- RSVP form ---------- */
function initRSVP() {
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const lines = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Attending: ${data.get("attending")}`,
      `Guests: ${data.get("guests")}`,
      `Message: ${data.get("message") || "-"}`,
    ];
    const subject = `RSVP — ${data.get("name")}`;
    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.location.href = mailto;
    status.textContent =
      "Thanks! Your email app should open with your RSVP ready to send.";
    form.reset();
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const close = document.getElementById("lightboxClose");
  if (!box) return;

  const open = (src, alt) => {
    if (!src) return;
    img.src = src;
    img.alt = alt || "";
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
  };
  const hide = () => {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    img.src = "";
  };

  document.querySelectorAll(".gallery__tile").forEach((tile) => {
    const src = tile.dataset.full || tile.querySelector("img")?.src;
    const alt = tile.querySelector("img")?.alt || "Wedding photo";
    tile.addEventListener("click", () => open(src, alt));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(src, alt);
      }
    });
  });

  close.addEventListener("click", hide);
  box.addEventListener("click", (e) => e.target === box && hide());
  document.addEventListener("keydown", (e) => e.key === "Escape" && hide());
}
