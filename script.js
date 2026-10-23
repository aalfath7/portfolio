const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- typing effect ---------- */
const ROLES = {
  en: ["Full Stack Developer", "Laravel & Next.js", "EdTech Builder"],
  id: ["Full Stack Developer", "Laravel & Next.js", "Pembangun EdTech"],
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
document.querySelectorAll(".stats, .skills-grid, .timeline, .cred-list, .project-grid").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((el, i) => el.style.setProperty("--delay", `${i * 0.08}s`));
});

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
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
  "meta.title": "Farhan Abdillah Alfath | Full Stack Developer",
  "meta.desc": "Portofolio Farhan Abdillah Alfath, S.T. — Full Stack Developer (Laravel, Next.js, TypeScript) yang berfokus pada teknologi pendidikan.",
  "nav.about": "Tentang",
  "nav.skills": "Keahlian",
  "nav.experience": "Pengalaman",
  "nav.projects": "Proyek",
  "nav.education": "Pendidikan",
  "nav.contact": "Hubungi Saya",
  "hero.eyebrow": "Terbuka untuk posisi Full Stack Developer",
  "hero.hello": "Halo, saya",
  "hero.desc":
    "Saya membangun sistem web produksi secara end to end, mulai dari desain database dan logika backend hingga frontend responsif dan deployment.",
  "hero.projects": "Lihat Proyek",
  "hero.scroll": "Gulir",
  "badge.dev": "💻 Full Stack Developer",
  "badge.edtech": "🏫 Pembangun EdTech",
  "badge.award": "🏆 Penghargaan AI Nasional",
  "about.title": "Tentang Saya",
  "about.lead":
    "Full Stack Developer dan Sarjana Teknik Informatika dari <mark>Universitas Lampung</mark> (IPK 3.8), berfokus pada teknologi pendidikan.",
  "about.body":
    "Selama 3+ tahun saya membangun dan memelihara sistem web produksi secara end to end. Saya membangun website resmi dan dashboard admin sekolah yang dipakai setiap hari oleh 15+ guru dan staf, dan tiga tahun mengajar IT memberi saya gambaran langsung tentang bagaimana sekolah benar-benar menggunakan sistemnya. Sebelumnya, saya mendapat pengalaman profesional sebagai frontend developer di Suitmedia, agensi digital di Jakarta.",
  "about.body2":
    "Saya terbiasa menjelaskan pekerjaan teknis dengan jelas kepada pengguna non-teknis, dan peduli pada perangkat lunak yang andal, mudah dijalankan, dan nyaman digunakan.",
  "stat.gpa": "IPK Teknik Informatika",
  "stat.years": "Tahun Membangun Sistem Web",
  "stat.users": "Staf Memakai Dashboard Saya Tiap Hari",
  "stat.award": "Lomba Cipta Game AI Nasional",
  "skills.title": "Teknologi &amp; Keahlian",
  "skills.lang": "⌨️ Bahasa Pemrograman",
  "skills.rbac": "Akses berbasis peran",
  "skills.db": "🗄️ Database",
  "skills.tools": "🛠️ Perkakas",
  "skills.git": "Git (branching, PR, code review)",
  "skills.spoken": "🌐 Bahasa",
  "skills.spokenChips": "<span>Indonesia (bahasa ibu)</span><span>Inggris (profesional)</span>",
  "exp.title": "Pengalaman Kerja",
  "role.support": "IT Support Engineer (Lepas)",
  "role.itTeacher": "Guru TIK",
  "role.frontend": "Frontend Developer",
  "date.support": "Jun 2026 – Sekarang",
  "date.teacher": "Jul 2023 – Jun 2026",
  "date.frontend": "Feb 2023 – Jun 2023",
  "pts.support":
    "<li>Menangani masalah perangkat keras, perangkat lunak, dan jaringan untuk pengguna.</li><li>Mendokumentasikan solusi masalah berulang dalam referensi troubleshooting bersama.</li>",
  "pts.teacher":
    "<li>Membangun dan memelihara website resmi serta dashboard admin sekolah yang dipakai 15+ guru dan staf (lihat Proyek).</li><li>Mengelola infrastruktur digital sekolah dan memberikan dukungan teknis kepada guru dan staf.</li><li>Mengajar Teknologi Informasi dan Ilmu Komputer kepada 50+ siswa SMP.</li>",
  "pts.frontend":
    "<li>Membangun 10+ halaman e-commerce responsif yang tampil konsisten di desktop dan mobile.</li><li>Mengintegrasikan 5+ endpoint REST API untuk menampilkan data produk, pengguna, dan transaksi secara dinamis.</li><li>Bekerja dalam tim lintas fungsi dengan alur kerja Git: feature branch, pull request, code review, dan merge.</li>",
  "projects.title": "Proyek Unggulan",
  "filter.all": "Semua",
  "filter.system": "Sistem Web",
  "filter.edu": "EdTech",
  "p1.tag": "Website Sekolah &amp; CMS · Jul 2023 – Jun 2026",
  "p1.title": "Website &amp; Dashboard Admin Sekolah Auladina Indonesia",
  "p1.points":
    "<li>Membangun website resmi sekolah secara end to end, dari database MySQL dan backend CodeIgniter hingga frontend responsif dan SEO-friendly dengan Tailwind CSS.</li><li>Menyediakan halaman publik untuk profil sekolah, berita, galeri, dan informasi PPDB bagi orang tua dan calon siswa.</li><li>Mengembangkan dashboard admin (CMS) yang dipakai 15+ guru dan staf untuk memublikasikan konten dan mengelola data sekolah secara real time.</li><li>Men-deploy situs ke produksi, merilis peningkatan berkelanjutan, dan melatih staf agar dapat mengelola dashboard secara mandiri.</li>",
  "p2.tag": "Manajemen Gudang",
  "p2.title": "Sistem manajemen inventaris",
  "p2.desc": "Aplikasi full-stack untuk inventaris, purchase order, dan validasi stok otomatis.",
  "p3.title": "Website belajar tajwid interaktif",
  "p3.desc":
    "Platform belajar untuk anak, remaja, dan dewasa dengan fitur registrasi email, materi, kuis, papan peringkat, kelas, level, ujian, dan sertifikat otomatis.",
  "p3.chips": "<span>Autentikasi</span><span>Kuis</span><span>Papan Peringkat</span><span>Sertifikat</span>",
  "p4.tag": "Aplikasi Pemantauan Progres",
  "p4.title": "Monitoring progres membaca Al-Qur'an",
  "p4.desc":
    "Aplikasi web yang memantau progres bacaan untuk individu maupun lembaga, dengan visualisasi data dan input harian atau berkala.",
  "p4.chips": "<span>Visualisasi Data</span><span>Banyak Pengguna</span><span>Pemantauan</span>",
  "edu.title": "Pendidikan &amp; Penghargaan",
  "edu.edu": "🎓 Pendidikan",
  "edu.awards": "🏆 Penghargaan",
  "cred.degree": "Sarjana Teknik Informatika (S.T.)",
  "cred.degreeSub": "Universitas Lampung · IPK 3.8/4.0 · Agu 2020 – Nov 2024",
  "cred.dicodingSub": "Dicoding Academy · Kampus Merdeka MSIB · Agu 2022 – Jan 2023",
  "award.game": "Lomba Cipta Game Nasional Powered by AI — Kategori Guru",
  "contact.eyebrow": "Mari bekerja sama",
  "contact.title": 'Mencari developer<br /><span class="accent">atau punya proyek?</span>',
  "contact.sub":
    "Saya terbuka untuk posisi full stack dan frontend, proyek web lepas, maupun pekerjaan teknologi pendidikan. Berdomisili di Lampung, Indonesia.",
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
