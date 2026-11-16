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
  initDropdown();
  initSubmitButton();
  initRSVP();
});

/* ---------- Klistrad navigering ---------- */
function initNav() {
  const nav = document.querySelector(".nav");
  const heroImg = document.querySelector(".hero__bg");

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle("is-scrolled", scrolled);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (heroImg) {
    const imgObserver = new IntersectionObserver(
      ([entry]) => {
        heroImg.classList.toggle("is-visible", entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    imgObserver.observe(heroImg);
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        hero.classList.toggle("is-hidden", entry.intersectionRatio < 0.5);
      },
      { threshold: [0, 0.5, 1] }
    );
    heroObserver.observe(hero);
  }

  const rsvpSection = document.getElementById("rsvp");
  if (rsvpSection) {
    const io = new IntersectionObserver(
      ([entry]) => nav.classList.toggle("is-hidden", entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(rsvpSection);
  }
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

/* ---------- Anpassad dropdown (Kommer du?) ---------- */
function initDropdown() {
  const dropdown = document.getElementById("attendingDropdown");
  if (!dropdown) return;
  const trigger = dropdown.querySelector(".dropdown__trigger");
  const valueEl = dropdown.querySelector(".dropdown__value");
  const hidden = dropdown.querySelector('input[name="attending"]');
  const options = Array.from(dropdown.querySelectorAll(".dropdown__option"));

  const close = () => {
    dropdown.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    dropdown.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };

  trigger.addEventListener("click", () => {
    dropdown.classList.contains("is-open") ? close() : open();
  });

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const value = opt.dataset.value;
      valueEl.textContent = value;
      hidden.value = value;
      options.forEach((o) => o.setAttribute("aria-selected", o === opt ? "true" : "false"));
      dropdown.classList.remove("has-error");
      hidden.dispatchEvent(new Event("change", { bubbles: true }));
      close();
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  const form = dropdown.closest("form");
  if (form) {
    form.addEventListener("reset", () => {
      valueEl.textContent = "Välj…";
      hidden.value = "";
      options.forEach((o) => o.setAttribute("aria-selected", "false"));
      dropdown.classList.remove("has-error");
    });
  }
}

/* ---------- Disable submit until required fields are filled ---------- */
function initSubmitButton() {
  const form = document.getElementById("rsvpForm");
  const button = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !button) return;

  const nameEl = form.querySelector('input[name="name"]');
  const emailEl = form.querySelector('input[name="email"]');
  const attendingEl = form.querySelector('input[name="attending"]');
  const minglingEl = form.querySelector('input[name="favoriteMinglingSong"]');
  const songEl = form.querySelector('input[name="favoriteSong"]');

  const update = () => {
    const attending = attendingEl.value.trim();
    const needsSongs = attending !== "" && attending !== "Nej, tyvärr";
    const songsOk =
      !needsSongs ||
      (minglingEl.value.trim() !== "" && songEl.value.trim() !== "");
    button.disabled = !(
      nameEl.value.trim() !== "" &&
      emailEl.value.trim() !== "" &&
      attending !== "" &&
      songsOk
    );
  };

  [nameEl, emailEl, attendingEl, minglingEl, songEl].forEach((f) => {
    if (!f) return;
    f.addEventListener("input", update);
    f.addEventListener("change", update);
  });
  form.addEventListener("reset", update);

  update();
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
    const attendingEl = form.querySelector('input[name="attending"]');
    if (!attendingEl.value) {
      const dd = document.getElementById("attendingDropdown");
      if (dd) dd.classList.add("has-error");
      status.textContent = "Vänligen ange om du kommer.";
      return;
    }
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      attending: data.get("attending"),
      favoriteSong: data.get("favoriteSong") || "",
      favoriteMinglingSong: data.get("favoriteMinglingSong") || "",
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
