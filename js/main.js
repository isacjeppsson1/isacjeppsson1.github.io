/* ============================================================
   Elin & Isac — Bröllopssajt
   ============================================================ */

/* >>> EDIT <<<  Centralt konfiguration. Ändra dessa värden för att anpassa sajten. */
const CONFIG = {
  // Bröllopsdatum & -tid (lokal tid). Format: ÅÅÅÅ-MM-DDTHH:MM:SS
  weddingDate: "2027-07-17T14:00:00",
  // Google Apps Script webhook för RSVP
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbyRfy189saJeebiy12WEVcs_HQHiZTfmsCR6jZxslribRUAzsAFjDK12jbR5hMvSYbS/exec",
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

  const rsvpSection = document.getElementById("rsvp");
  if (rsvpSection) {
    const io = new IntersectionObserver(
      ([entry]) => nav.classList.toggle("is-hidden", entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(rsvpSection);
  }

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      attending: data.get("attending"),
      guests: data.get("guests"),
      message: data.get("message") || "",
    };

    status.textContent = "Skickar…";
    try {
      await fetch(CONFIG.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
      status.textContent = "Tack! Din RSVP har tagits emot.";
      form.reset();
    } catch {
      status.textContent = "Något gick fel. Försök igen.";
    }
  });
}
