/* ==========================================================================
   ორბიტა — საიტის ინტერაქცია
   ==========================================================================
   ლიდების ფორმის მიმღები მისამართი.
   მაგ.: "https://formspree.io/f/xxxxxxx" ან თქვენი backend-ის endpoint.
   ცარიელი მნიშვნელობისას ფორმა მუშაობს სადემონსტრაციო რეჟიმში —
   ვალიდაცია სრულად მუშაობს, მონაცემები კონსოლში იბეჭდება.
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = "";

(function () {
  "use strict";

  /* ---------------------------------------------------------------- utils */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ----------------------------------------------- 1. მობილური ნავიგაცია */
  function initNav() {
    const toggle = $(".nav__toggle");
    const links  = $("#nav-links");
    if (!toggle || !links) return;

    const close = () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) close();
    });
  }

  /* --------------------------------------- 2. მიმდინარე გვერდი ნავიგაციაში */
  function initActiveLink() {
    let path = window.location.pathname.split("/").pop();
    if (!path) path = "index.html";

    $$("#nav-links a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      if (href === path) a.classList.add("is-active");
      // სერვისის შიდა გვერდზე „სერვისები“ აქტიურად რჩება
      if (href === "services.html" && path.startsWith("service-")) {
        a.classList.add("is-active");
      }
    });
  }

  /* ------------------------------------------- 3. Header-ის ჩრდილი სქროლზე */
  function initStickyHeader() {
    const header = $(".site-header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------- 4. FAQ აკორდეონი */
  function initAccordion() {
    $$(".faq__q").forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";

        // ერთი ბლოკის ფარგლებში მხოლოდ ერთი პასუხი იყოს ღია
        const group = btn.closest(".faq");
        if (group && !open) {
          $$(".faq__q", group).forEach((other) => {
            if (other === btn) return;
            other.setAttribute("aria-expanded", "false");
            const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
            if (otherPanel) otherPanel.setAttribute("data-open", "false");
          });
        }

        btn.setAttribute("aria-expanded", String(!open));
        panel.setAttribute("data-open", String(!open));
      });
    });
  }

  /* ------------------------------------------------- 5. გამოჩენა სქროლზე */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.revealDelay || 0);
        setTimeout(() => el.classList.add("is-visible"), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    items.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------- 6. ციფრების ანიმაცია */
  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    nums.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------- 7. ლიდების ფორმები */
  const MSG = {
    required: "ეს ველი სავალდებულოა",
    email: "მიუთითეთ სწორი ელფოსტა, მაგ.: name@company.ge",
    phone: "მიუთითეთ სწორი ტელეფონის ნომერი",
    short: "ტექსტი ძალიან მოკლეა — მინიმუმ 10 სიმბოლო",
    consent: "გთხოვთ, დაეთანხმოთ პირობებს",
    fail: "ფორმის გაგზავნა ვერ მოხერხდა. დაგვიკავშირდით: hello@orbita.ge"
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const PHONE_RE = /^[+()\d][\d\s()\-]{7,19}$/;

  function setError(field, message) {
    field.classList.add("has-error");
    const box = $(".field__error", field);
    if (box) box.textContent = message;
    const input = $("input, select, textarea", field);
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    field.classList.remove("has-error");
    const input = $("input, select, textarea", field);
    if (input) input.removeAttribute("aria-invalid");
  }

  function validateInput(input) {
    const field = input.closest(".field");
    if (!field) return true;

    const value = input.value.trim();
    const required = input.hasAttribute("required");

    if (required && !value) { setError(field, MSG.required); return false; }
    if (!value) { clearError(field); return true; }

    if (input.type === "email" && !EMAIL_RE.test(value)) { setError(field, MSG.email); return false; }
    if (input.type === "tel" && !PHONE_RE.test(value)) { setError(field, MSG.phone); return false; }
    if (input.tagName === "TEXTAREA" && required && value.length < 10) { setError(field, MSG.short); return false; }

    clearError(field);
    return true;
  }

  function validateForm(form) {
    let valid = true;
    let firstBad = null;

    $$("input, select, textarea", form).forEach((input) => {
      if (input.type === "hidden" || input.closest(".hp-field")) return;

      if (input.type === "checkbox") {
        if (input.hasAttribute("required") && !input.checked) {
          valid = false;
          const label = input.closest(".checkbox");
          if (label) label.style.color = "var(--danger)";
          if (!firstBad) firstBad = input;
        } else {
          const label = input.closest(".checkbox");
          if (label) label.style.color = "";
        }
        return;
      }

      if (!validateInput(input)) {
        valid = false;
        if (!firstBad) firstBad = input;
      }
    });

    if (firstBad) {
      firstBad.focus({ preventScroll: true });
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return valid;
  }

  function showStatus(form, type, text) {
    const box = $(".form-status", form);
    if (!box) return;
    box.className = "form-status is-visible form-status--" + type;
    box.textContent = text;
  }

  function showSuccess(form) {
    const name = (form.elements.name && form.elements.name.value.trim()) || "";
    const title = name ? "მადლობა, " + name + "!" : "მადლობა!";
    const wrap = document.createElement("div");
    wrap.className = "form-success";
    wrap.setAttribute("role", "status");
    wrap.innerHTML =
      '<div class="form-success__icon">' +
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      "</div>" +
      "<h3>" + title + "</h3>" +
      "<p>თქვენი განაცხადი მიღებულია. ჩვენი გუნდი 24 საათის განმავლობაში დაგიკავშირდებათ " +
      "სამუშაო დღეებში.</p>";
    form.replaceWith(wrap);
    wrap.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function initForms() {
    $$("form[data-lead-form]").forEach((form) => {
      form.setAttribute("novalidate", "novalidate");

      // ველიდან გასვლისას ვამოწმებთ
      $$("input, select, textarea", form).forEach((input) => {
        input.addEventListener("blur", () => {
          if (input.type !== "checkbox") validateInput(input);
        });
        input.addEventListener("input", () => {
          const field = input.closest(".field");
          if (field && field.classList.contains("has-error")) validateInput(input);
        });
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // spam-ის მარტივი ფილტრი
        const honey = form.querySelector('input[name="company_website"]');
        if (honey && honey.value) return;

        if (!validateForm(form)) {
          showStatus(form, "error", "გთხოვთ, შეავსოთ მონიშნული ველები.");
          return;
        }

        const btn = $('button[type="submit"]', form);
        const label = btn ? btn.textContent : "";
        if (btn) {
          btn.dataset.loading = "true";
          btn.textContent = "იგზავნება…";
        }

        const data = Object.fromEntries(new FormData(form).entries());
        data.page = window.location.pathname;
        data.source = form.dataset.leadForm || "website";

        try {
          if (FORM_ENDPOINT) {
            const res = await fetch(FORM_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("HTTP " + res.status);
          } else {
            // სადემონსტრაციო რეჟიმი
            console.info("[ორბიტა] ლიდის მონაცემები:", data);
            await new Promise((r) => setTimeout(r, 600));
          }
          showSuccess(form);
        } catch (err) {
          console.error(err);
          if (btn) {
            btn.dataset.loading = "false";
            btn.textContent = label;
          }
          showStatus(form, "error", MSG.fail);
        }
      });
    });
  }

  /* -------------------------------------------- 8. წელი ფუტერში + სერვისი */
  function initMisc() {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    // ?service=seo → ფორმაში წინასწარ შერჩეული სერვისი
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    if (service) {
      $$('select[name="service"]').forEach((select) => {
        const match = Array.from(select.options).find((o) => o.value === service);
        if (match) select.value = service;
      });
    }
  }

  /* ------------------------------------------------------------ bootstrap */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initActiveLink();
    initStickyHeader();
    initAccordion();
    initReveal();
    initCounters();
    initForms();
    initMisc();
  });
})();
