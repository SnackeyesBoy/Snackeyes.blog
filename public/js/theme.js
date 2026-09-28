const translations = {
  zh: {
    "nav.about": "關於", "nav.works": "作品", "nav.blog": "Blog", "nav.contact": "聯絡",
    "home.directions": "我持續在做的事", "home.research.title": "Research / 研究", "home.research.body": "生醫影像與訊號處理、眼動與智慧計算。",
    "home.development.title": "Development / 開發", "home.development.body": "將技術想法整理成清楚、好用的網頁介面。",
    "home.photography.title": "Photography / 攝影", "home.photography.body": "用街拍和旅行日誌，保存走過城市的光線。",
    "home.portfolio.title": "研究與開發作品集", "home.portfolio.body": "作品頁正在準備中...", "home.portfolio.cta": "前往作品集",
    "home.journal": "攝影日誌", "home.allPosts": "查看全部文章", "home.read": "閱讀文章",
    "resume.title": "履歷下載", "resume.preview": "預覽", "resume.download": "下載 PDF",
    "contact.title": "一起做點有意思的事", "contact.intro": "歡迎聊研究、開發、攝影，或一杯好咖啡！", "contact.introEn": "Open to conversations about research, development, photography, and good coffee."
  },
  en: {
    "nav.about": "About", "nav.works": "Works", "nav.blog": "Blog", "nav.contact": "Contact",
    "home.directions": "What I keep working on", "home.research.title": "Research", "home.research.body": "Biomedical imaging, signal processing, eye tracking, and intelligent computing.",
    "home.development.title": "Development", "home.development.body": "Turning technical ideas into clear, useful web interfaces.",
    "home.photography.title": "Photography", "home.photography.body": "Recording cities through street photography and travel journals.",
    "home.portfolio.title": "Research & development portfolio", "home.portfolio.body": "The works page is being prepared...", "home.portfolio.cta": "View works",
    "home.journal": "Photography journal", "home.allPosts": "View all posts", "home.read": "Read post",
    "resume.title": "Resume", "resume.preview": "Preview", "resume.download": "Download PDF",
    "contact.title": "Let's make something meaningful.", "contact.intro": "Open to conversations about research, development, photography, and good coffee.", "contact.introEn": ""
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector("#theme-toggle");
  const languageToggle = document.querySelector("#language-toggle");
  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".nav-links");

  const applyTheme = (theme) => {
    body.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("theme", theme);
  };
  applyTheme(localStorage.getItem("theme") || "dark");
  themeToggle?.addEventListener("click", (event) => {
    const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      applyTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    body.style.setProperty("--theme-reveal-x", `${rect.left + rect.width / 2}px`);
    body.style.setProperty("--theme-reveal-y", `${rect.top + rect.height / 2}px`);
    body.style.setProperty("--theme-reveal-color", nextTheme === "light" ? "#ffffff" : "#121212");
    body.classList.add("is-theme-revealing");

    window.setTimeout(() => applyTheme(nextTheme), 500);
    window.setTimeout(() => body.classList.remove("is-theme-revealing"), 620);
  });

  const applyLanguage = (language) => {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = translations[language][element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-resume-language]").forEach((element) => {
      element.hidden = element.dataset.resumeLanguage !== language;
    });
    if (languageToggle) languageToggle.textContent = language === "zh" ? "EN" : "中文";
    localStorage.setItem("language", language);
  };
  applyLanguage(localStorage.getItem("language") || "zh");
  languageToggle?.addEventListener("click", () => applyLanguage((localStorage.getItem("language") || "zh") === "zh" ? "en" : "zh"));

  menu?.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks?.classList.toggle("active");
  });
  document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", () => {
    menu?.classList.remove("is-active");
    menuLinks?.classList.remove("active");
  }));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-scramble]").forEach((scrambleElement) => {
    const target = scrambleElement.dataset.scramble;
    if (!target || reducedMotion) return;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    const runScramble = () => {
      let frame = 0;
      const timer = window.setInterval(() => {
        scrambleElement.textContent = `# ${target.split("").map((letter, index) => index < frame ? letter : glyphs[Math.floor(Math.random() * glyphs.length)]).join("")}`;
        frame += 0.34;
        if (frame < target.length) return;
        window.clearInterval(timer);
        scrambleElement.textContent = `# ${target}`;
        window.setTimeout(runScramble, 1800);
      }, 42);
    };
    runScramble();
  });
  const revealTargets = document.querySelectorAll([
    "main .hero", "main .section", "main .profile-header", "main .page-scramble-header", "main .about-introduction", "main .resume-section", "main .blog-profile",
    "main .contact-page", "main .blog-page-header", "main .featured-post", "main .blog-section-heading",
    "main .post-card", "main footer"
  ].join(", "));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    revealTargets.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 70}ms`);
    });
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
    revealTargets.forEach((element) => observer.observe(element));
  }
});

const loader = document.querySelector("#page-loader");
if (loader) {
  const finishPageLoad = () => document.body.classList.add("page-ready");
  try {
    if (sessionStorage.getItem("snackeyes-home-visited")) {
      finishPageLoad();
    } else {
      sessionStorage.setItem("snackeyes-home-visited", "true");
      window.setTimeout(finishPageLoad, 1500);
    }
  } catch {
    window.setTimeout(finishPageLoad, 1500);
  }
}
