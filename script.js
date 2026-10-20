const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- typing effect ---------- */
const ROLES = {
  en: ["Educator", "Qur'an Practitioner", "Developer"],
  id: ["Pendidik", "Praktisi Qur'an", "Pengembang"],
};
let roles = ROLES.en;
const typedEl = document.getElementById("typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const word = roles[roleIndex];
  charIndex += deleting ? -1 : 1;
  typedEl.textContent = word.slice(0, charIndex);

  let delay = deleting ? 45 : 90;
  if (!deleting && charIndex === word.length) {
    delay = 1600;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }
  setTimeout(typeLoop, delay);
}

function resetTyping() {
  roleIndex = 0;
  charIndex = 0;
  deleting = false;
  typedEl.textContent = reduceMotion ? roles.join(" • ") : "";
}

if (!reduceMotion) setTimeout(typeLoop, 900);

/* ---------- header, progress bar, active nav ---------- */
const topbar = document.querySelector(".topbar");
const progress = document.querySelector(".scroll-progress");
const navLinks = [...document.querySelectorAll(".nav a:not(.nav-cta)")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  topbar.classList.toggle("scrolled", y > 20);

  let current = null;
  sections.forEach((sec, i) => {
    if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.4) current = i;
  });
  navLinks.forEach((a, i) => a.classList.toggle("active", i === current));
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- mobile menu ---------- */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- reveal on scroll + counters ---------- */
document.querySelectorAll(".stats, .timeline, .cred-list, .project-grid").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((el, i) => el.style.setProperty("--delay", `${i * 0.08}s`));
});

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      const counter = entry.target.querySelector("[data-count]");
      if (counter) animateCount(counter);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- cursor glow ---------- */
const glow = document.querySelector(".cursor-glow");
if (finePointer && !reduceMotion) {
  let gx = 0, gy = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  (function follow() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx - 260}px, ${gy - 260}px)`;
    requestAnimationFrame(follow);
  })();
} else {
  glow.style.display = "none";
}

/* ---------- 3D tilt (photo + project cards) ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    const strength = card.classList.contains("photo-wrap") ? 12 : 6;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * strength}deg) rotateY(${(px - 0.5) * strength}deg)`;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* magnetic buttons */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ---------- awards tabs ---------- */
const tabs = [...document.querySelectorAll(".tab")];
const panels = document.querySelectorAll(".tab-panel");
const indicator = document.querySelector(".tab-indicator");

function moveIndicator(tab) {
  indicator.style.width = `${tab.offsetWidth}px`;
  indicator.style.height = `${tab.offsetHeight}px`;
  indicator.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop - 6}px)`;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === tab.dataset.tab));
    moveIndicator(tab);
  });
});

const syncIndicator = () => moveIndicator(document.querySelector(".tab.active"));
window.addEventListener("resize", syncIndicator);
document.fonts ? document.fonts.ready.then(syncIndicator) : syncIndicator();
syncIndicator();

/* ---------- project filter ---------- */
const filters = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((f) => f.classList.toggle("active", f === btn));
    const cat = btn.dataset.filter;
    projectCards.forEach((card) => {
      const show = cat === "all" || card.dataset.cat === cat;
      card.classList.toggle("hidden", !show);
      if (show) {
        card.animate(
          [
            { opacity: 0, transform: "translateY(20px) scale(0.97)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }
    });
  });
});

/* ---------- copy email + toast ---------- */
const toast = document.getElementById("toast");
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast(`✓ ${email} ${currentLang === "id" ? "disalin" : "copied"}`);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

/* ---------- footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- language toggle (EN default, ID) ---------- */
// English lives in the HTML; only Indonesian is listed here.
const ID = {
  "meta.title": "Farhan Abdillah Alfath | Portofolio",
  "meta.desc": "Portofolio Farhan Abdillah Alfath, S.T. — Pengembang web, pendidik IT, dan pengajar Al-Qur'an.",
  "nav.about": "Tentang",
  "nav.experience": "Pengalaman",
  "nav.awards": "Penghargaan",
  "nav.projects": "Proyek",
  "nav.contact": "Hubungi Saya",
  "hero.eyebrow": "Tersedia untuk kolaborasi &amp; proyek baru",
  "hero.hello": "Halo, saya",
  "hero.projects": "Lihat Proyek",
  "hero.scroll": "Gulir",
  "badge.educator": "🧑‍🏫 Pendidik",
  "badge.quran": "📖 Praktisi Qur'an",
  "badge.dev": "💻 Pengembang",
  "mq.frontend": "Pengembangan Frontend",
  "mq.support": "Dukungan IT",
  "mq.calligraphy": "Kaligrafi",
  "about.title": "Tentang Saya",
  "about.lead":
    "Sarjana Teknik Informatika dari <mark>Universitas Lampung</mark> dengan IPK 3.8, pengembang aplikasi dan pengajar Al-Qur’an.",
  "about.body":
    "Memiliki pengalaman di bidang pengembangan web, dukungan teknologi informasi, pendidikan, dan pengajaran Al-Qur’an. Saya senang membangun produk digital yang membantu orang belajar dengan cara yang lebih efektif dan menyenangkan.",
  "stat.gpa": "IPK Teknik Informatika",
  "stat.quran": "Hafalan Al-Qur'an",
  "stat.roles": "Peran Profesional",
  "stat.awards": "Penghargaan",
  "exp.title": "Pengalaman &amp; Pendidikan",
  "exp.work": "💼 Pengalaman Profesional",
  "exp.edu": "🎓 Pendidikan &amp; Kredensial",
  "role.support": "Teknisi Dukungan Teknologi Informasi",
  "org.axiom": "Lepas (Freelance), Axiom Technologies",
  "role.itTeacher": "Guru TIK",
  "role.quranPractitioner": "Praktisi Pengajar Qur’an",
  "role.quranTeacher": "Pengajar Al-Qur’an",
  "role.frontend": "Pengembang Frontend",
  "cred.degree": "Sarjana Teknik Informatika (S.T.)",
  "cred.degreeSub": "Universitas Lampung · IPK 3.8",
  "cred.hafiz": "Hafaz Al-Qur'an 30 Juz",
  "cred.darulHuffaz": "Lulusan Darul Huffaz Lampung",
  "cred.almahir": "Lulusan Karantina Tahfidz Al-Mahir Bil Qur’an Indonesia",
  "awards.title": "Penghargaan &amp; Prestasi",
  "tab.tech": "💡 Teknologi &amp; Pendidikan",
  "tab.tahfidz": "📖 Tahfidz Al-Qur'an",
  "tab.calligraphy": "🖋️ Seni Kaligrafi",
  "award.game": "Lomba Cipta Game Nasional Powered by AI — Kategori Guru",
  "award.rohis": "Kaligrafi Ikhwan ROHIS Lampung Gema Islam",
  "award.pesantren": "Kaligrafi Kontemporer Festival Pesantren V Se-Lampung",
  "award.teknokrat": "Kaligrafi Pentas Islami Teknokrat Se-Lampung",
  "projects.title": "Proyek Unggulan",
  "filter.all": "Semua",
  "filter.edu": "Edukasi Islami",
  "filter.system": "Sistem Web",
  "p1.title": "Website belajar tajwid interaktif",
  "p1.desc":
    "Platform belajar tajwid untuk anak, remaja, dan dewasa dengan fitur registrasi email, materi, kuis, papan peringkat, kelas, level, ujian, dan sertifikat otomatis.",
  "p1.chips": "<span>Kuis</span><span>Papan Peringkat</span><span>Sertifikat</span>",
  "p2.tag": "Aplikasi Pantau Qur'an",
  "p2.title": "Monitoring progres membaca Al-Qur'an",
  "p2.desc":
    "Aplikasi web yang memantau progres bacaan untuk individu maupun lembaga, dengan visualisasi data dan input harian atau berkala.",
  "p2.chips": "<span>Visualisasi Data</span><span>Banyak Pengguna</span><span>Pemantauan</span>",
  "p3.tag": "Manajemen Gudang",
  "p3.title": "Sistem manajemen inventaris",
  "p3.desc": "Aplikasi full-stack untuk inventaris, purchase order, dan validasi stok otomatis.",
  "p4.tag": "Website Sekolah",
  "p4.title": "Website Sekolah Auladina Indonesia",
  "p4.desc": "Website resmi sekolah dengan dashboard admin untuk pengelolaan data guru dan staf.",
  "contact.eyebrow": "Mari berkolaborasi",
  "contact.title": 'Punya ide proyek<br /><span class="accent">atau kelas Qur\'an?</span>',
  "contact.sub": "Saya terbuka untuk proyek web, pengajaran IT, maupun program tahsin &amp; tahfidz.",
  "contact.copy": "Salin Email",
  "aria.menu": "Buka menu",
  "aria.scroll": "Gulir ke bawah",
  "aria.top": "Kembali ke atas",
  "rank": "Juara",
};

const metaDesc = document.querySelector('meta[name="description"]');
const i18nEls = document.querySelectorAll("[data-i18n]");
const ariaEls = document.querySelectorAll("[data-i18n-aria]");

// Snapshot the English copy from the page so it doesn't have to be duplicated here.
const EN = { "meta.title": document.title, "meta.desc": metaDesc.content, rank: "Place" };
i18nEls.forEach((el) => (EN[el.dataset.i18n] ??= el.innerHTML.trim()));
ariaEls.forEach((el) => (EN[el.dataset.i18nAria] ??= el.getAttribute("aria-label")));

const langToggle = document.getElementById("langToggle");
let currentLang = "en";

function applyLang(lang) {
  const dict = lang === "id" ? ID : EN;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = dict["meta.title"];
  metaDesc.content = dict["meta.desc"];
  document.documentElement.style.setProperty("--rank-label", `"${dict.rank}"`);
  i18nEls.forEach((el) => (el.innerHTML = dict[el.dataset.i18n] ?? EN[el.dataset.i18n]));
  ariaEls.forEach((el) => el.setAttribute("aria-label", dict[el.dataset.i18nAria]));
  langToggle.querySelectorAll(".lang-opt").forEach((o) => o.classList.toggle("active", o.dataset.lang === lang));
  langToggle.setAttribute("aria-label", lang === "id" ? "Ganti ke bahasa Inggris" : "Switch to Indonesian");

  roles = ROLES[lang];
  resetTyping();
  syncIndicator();
  try {
    localStorage.setItem("lang", lang);
  } catch {}
}

langToggle.addEventListener("click", () => {
  document.body.classList.add("lang-switching");
  setTimeout(() => {
    applyLang(currentLang === "en" ? "id" : "en");
    document.body.classList.remove("lang-switching");
  }, 180);
});

// ?lang=id in the URL wins, then the visitor's last choice, then English.
let savedLang = new URLSearchParams(location.search).get("lang");
if (savedLang !== "id" && savedLang !== "en") {
  try {
    savedLang = localStorage.getItem("lang") === "id" ? "id" : "en";
  } catch {
    savedLang = "en";
  }
}
applyLang(savedLang);
