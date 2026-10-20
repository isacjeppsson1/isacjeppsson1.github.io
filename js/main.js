/* ============================================================
   Elin & Isac — Bröllopssajt
   ============================================================ */

/* >>> EDIT <<<  Centralt konfiguration. Ändra dessa värden för att anpassa sajten. */
const CONFIG = {
  // Bröllopsdatum & -tid (lokal tid). Format: ÅÅÅÅ-MM-DDTHH:MM:SS
  weddingDate: "2027-07-17T14:00:00",
  // Mottagare för RSVP-formuläret (öppnar besökarens e-postapp)
  rsvpEmail: "elin.and.isac@example.com",
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCountdown();
  initReveal();
  initRSVP();
});

/* ---------- Klistrad navigering ---------- */
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

/* ---------- Nedräkning ---------- */
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

/* ---------- Visa vid scroll ---------- */
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

/* ---------- RSVP-formulär ---------- */
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
      `Namn: ${data.get("name")}`,
      `E-post: ${data.get("email")}`,
      `Deltar: ${data.get("attending")}`,
      `Gäster: ${data.get("guests")}`,
      `Meddelande: ${data.get("message") || "-"}`,
    ];
    const subject = `RSVP — ${data.get("name")}`;
    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.location.href = mailto;
    status.textContent =
      "Tack! Din e-postapp bör öppnas med din RSVP redo att skickas.";
    form.reset();
  });
}
