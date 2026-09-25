/* ==========================================================================
   ორბიტა — საიტის ინტერაქცია
   ==========================================================================
   ლიდების ფორმის მიმღები მისამართი.
   მაგ.: "https://formspree.io/f/xxxxxxx" ან თქვენი backend-ის endpoint.
   ცარიელი მნიშვნელობისას ფორმა მუშაობს სადემონსტრაციო რეჟიმში —
   ვალიდაცია სრულად მუშაობს, მონაცემები კონსოლში იბეჭდება.
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = "/api/lead.php";

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
    const norm = (v) => v.replace(/\/+$/, "").split("/").pop().replace(/\.html$/, "");
    const path = norm(window.location.pathname);

    $$("#nav-links a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      if (norm(href) === path) a.classList.add("is-active");
    });

    // mega-menu-ს ღილაკი ბმული არაა — მას data-nav-match ანიშნებს
    $$("#nav-links [data-nav-match]").forEach((el) => {
      const match = el.dataset.navMatch;
      if (path === match || path.indexOf(match.replace(/s$/, "") + "-") === 0) {
        el.classList.add("is-active");
      }
    });
  }

  /* ------------------------------------------- 3. Header-ის ჩრდილი სქროლზე */
  function initStickyHeader() {
    const header = $(".site-header");
    if (!header) return;

    /* ქვემოთ სქროლისას ჰედერი იმალება, ზემოთ სქროლისას ან გაჩერებისას ბრუნდება.
       არ ვმალავთ, როცა მენიუ ღიაა ან ფოკუსი ჰედერშია (კლავიატურით ნავიგაცია). */
    const busy = () =>
      header.matches(":focus-within") ||
      !!$(".nav__links.is-open", header) ||
      !!$(".nav__item.is-open", header);

    let lastY = window.scrollY;
    let idle;
    let ticking = false;

    const show = () => header.classList.remove("is-hidden");

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;

      header.classList.toggle("is-stuck", y > 8);

      if (y < 140 || busy()) show();
      else if (dy > 4) header.classList.add("is-hidden");
      else if (dy < -4) show();

      lastY = y;
      clearTimeout(idle);
      idle = setTimeout(show, 320);   // სქროლი გაჩერდა — ნავიგაცია ბრუნდება
    };

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    header.addEventListener("focusin", show);
    update();
  }

  /* ------------------------ ტექსტის „გადახვევა“ hover-ზე (ნავიგაცია, ღილაკები) */
  function initTextRoll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$(".nav__links > li > a, a.btn, [data-roll]").forEach((el) => {
      if (el.querySelector(".roll")) return;
      const node = Array.from(el.childNodes).find(
        (n) => n.nodeType === 3 && n.textContent.trim()
      );
      if (!node) return;
      const text = node.textContent.trim();
      const wrap = document.createElement("span");
      wrap.className = "roll";
      const a = document.createElement("span");
      a.className = "roll__a";
      a.textContent = text;
      const b = document.createElement("span");
      b.className = "roll__b";
      b.setAttribute("aria-hidden", "true");
      b.textContent = text;
      wrap.append(a, b);
      node.replaceWith(wrap);
    });
  }

  /* ----------------------- hero-ში მბრუნავი სიტყვა (data-rotate="ა|ბ|გ") */
  function initRotator() {
    $$("[data-rotate]").forEach((el) => {
      const words = el.dataset.rotate.split("|").map((w) => w.trim()).filter(Boolean);
      if (words.length < 2) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      /* სიგანე რბილად იცვლება შემდეგი სიტყვის ზომაზე — სათაური არ „ხტება“ */
      const word = el.querySelector(".rotator__word") || el;
      let widths = [];
      const measure = () => {
        const probe = el.cloneNode(true);
        probe.removeAttribute("data-rotate");
        probe.style.cssText = "position:absolute;visibility:hidden;width:auto;min-width:0;white-space:nowrap;";
        el.parentNode.appendChild(probe);
        const pw = probe.querySelector(".rotator__word") || probe;
        widths = words.map((w) => { pw.textContent = w; return probe.getBoundingClientRect().width; });
        probe.remove();
        el.style.width = Math.ceil(widths[i]) + "px";
      };

      let i = 0;
      const tick = () => {
        if (document.hidden) return;
        const next = (i + 1) % words.length;
        el.style.width = Math.ceil(widths[next]) + "px";
        el.classList.add("is-out");
        setTimeout(() => {
          i = next;
          word.textContent = words[i];
          el.classList.remove("is-out");
          el.classList.add("is-in");
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("is-in")));
        }, 300);
      };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure); else measure();
      window.addEventListener("resize", measure, { passive: true });
      setInterval(tick, 2600);
    });
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
    fail: "ფორმის გაგზავნა ვერ მოხერხდა. დაგვიკავშირდით: hello@webico.io"
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


  /* ------------------------------------------------------- 9. კარუსელი */
  function initCarousels() {
    $$("[data-carousel]").forEach((root) => {
      const track = $("[data-carousel-track]", root);
      const prev  = $("[data-carousel-prev]", root);
      const next  = $("[data-carousel-next]", root);
      const dotsBox = $("[data-carousel-dots]", root);
      if (!track) return;

      const slides = $$(".carousel__slide", track);
      if (slides.length < 2) {
        const controls = $(".carousel__controls", root);
        if (controls) controls.hidden = true;
        return;
      }

      // რამდენი სლაიდი ჩანს ერთდროულად
      const perView = () => {
        const w = slides[0].getBoundingClientRect().width;
        return Math.max(1, Math.round(track.clientWidth / (w + 22)));
      };

      // წერტილები — თითო "გვერდზე", და არა თითო სლაიდზე
      let dots = [];
      const buildDots = () => {
        if (!dotsBox) return;
        const pages = Math.max(1, slides.length - perView() + 1);
        dotsBox.innerHTML = "";
        dots = [];
        for (let i = 0; i < pages; i++) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "carousel__dot";
          b.setAttribute("aria-label", "სლაიდი " + (i + 1));
          b.addEventListener("click", () => goTo(i));
          dotsBox.appendChild(b);
          dots.push(b);
        }
      };

      const index = () => {
        const w = slides[0].getBoundingClientRect().width + 22;
        return Math.round(track.scrollLeft / w);
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const goTo = (i) => {
        const w = slides[0].getBoundingClientRect().width + 22;
        const max = Math.max(0, slides.length - perView());
        const target = Math.min(Math.max(0, i), max);
        track.scrollTo({ left: target * w, behavior: reduced ? "auto" : "smooth" });
        // მდგომარეობას მაშინვე ვანახლებთ — არ ველოდებით სქროლის დასრულებას
        paint(target);
      };

      // ღილაკებისა და წერტილების დახატვა კონკრეტული ინდექსისთვის
      const paint = (i) => {
        const max = Math.max(0, slides.length - perView());
        if (prev) prev.disabled = i <= 0;
        if (next) next.disabled = i >= max;
        dots.forEach((d, n) => d.setAttribute("aria-current", String(n === i)));
      };

      const sync = () => paint(index());

      if (prev) prev.addEventListener("click", () => goTo(Math.max(0, index() - 1)));
      if (next) next.addEventListener("click", () => goTo(index() + 1));

      // კლავიატურა
      track.setAttribute("tabindex", "0");
      track.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); goTo(index() + 1); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(Math.max(0, index() - 1)); }
      });

      // სქროლზე პირდაპირ ვასინქრონებთ (rAF-ზე დამოკიდებულების გარეშე)
      let ticking = false;
      track.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        setTimeout(() => { sync(); ticking = false; }, 90);
      }, { passive: true });

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { buildDots(); sync(); }, 150);
      });

      buildDots();
      sync();
    });
  }

  /* ------------------------------------------ 10. პორტფოლიოს ფილტრი */
  function initFilters() {
    const group = $("[data-filter-group]");
    if (!group) return;

    const buttons = $$("[data-filter]", group);
    const items = $$("[data-category]");
    const empty = $("[data-filter-empty]");
    const live = $("[data-filter-status]");

    const apply = (value) => {
      let shown = 0;
      items.forEach((el) => {
        const match = value === "all" || el.dataset.category.split(" ").includes(value);
        el.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === value)));
      if (empty) empty.hidden = shown > 0;
      if (live) live.textContent = shown + " " + (group.dataset.filterNoun || "პროექტი");
    };

    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));

    // თითო ფილტრის რაოდენობა
    buttons.forEach((b) => {
      const v = b.dataset.filter;
      const n = v === "all" ? items.length
        : items.filter((el) => el.dataset.category.split(" ").includes(v)).length;
      const badge = $(".filter__count", b);
      if (badge) badge.textContent = n;
    });

    apply("all");
  }

  /* ---------------------------------------- 11. გუნდის ბარათის გაშლა */
  function initTeamCards() {
    $$("[data-member-toggle]").forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.setAttribute("data-open", String(!open));
        const label = $(".member__toggle-label", btn);
        if (label) label.textContent = open ? "მეტის ნახვა" : "დახურვა";
      });
    });
  }


  /* ---------------------------------------------------- 12. Mega-menu */
  function initMegaMenu() {
    const triggers = $$("[data-mega-trigger]");
    if (!triggers.length) return;

    const isDesktop = () => window.matchMedia("(min-width: 881px)").matches;
    const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    triggers.forEach((trigger) => {
      const item = trigger.closest(".nav__item");
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!item || !panel) return;

      let closeTimer;

      const open = () => {
        clearTimeout(closeTimer);
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      };
      const close = () => {
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      };
      const toggle = () => (item.classList.contains("is-open") ? close() : open());

      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        toggle();
      });

      // დესკტოპზე — hover, მცირე დაყოვნებით, რომ კურსორმა პანელამდე მიაღწიოს
      item.addEventListener("mouseenter", () => {
        if (isDesktop() && canHover()) open();
      });
      item.addEventListener("mouseleave", () => {
        if (!isDesktop() || !canHover()) return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(close, 140);
      });

      // ფოკუსი გავიდა მენიუდან — იხურება
      item.addEventListener("focusout", (e) => {
        if (!item.contains(e.relatedTarget)) close();
      });

      // ბმულზე დაჭერისას იხურება (მობილურის drawer-ისთვისაც)
      panel.addEventListener("click", (e) => {
        if (e.target.closest("a")) close();
      });

      document.addEventListener("click", (e) => {
        if (!item.contains(e.target)) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && item.classList.contains("is-open")) {
          close();
          trigger.focus();
        }
      });

      window.addEventListener("resize", close);
    });
  }

  /* ------------------------------- სკროლის პროგრესი და მიმაგრებული CTA */
  function initScrollUi() {
    const bar    = $(".scroll-progress");
    const sticky = $(".sticky-cta");
    if (!bar && !sticky) return;

    /* ზღვარი, რომლის შემდეგაც ზოლი ჩნდება — hero-ს სიმაღლე ან ერთი ეკრანი */
    const anchor = $(".hero, .page-hero");
    const trigger = () => (anchor ? anchor.offsetHeight : window.innerHeight) * 0.75;

    let ticking = false;
    const paint = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y   = window.scrollY;

      if (bar) bar.style.setProperty("--progress", max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);

      if (sticky) {
        /* ფუტერთან მიახლოებისას ვმალავთ — იქ ისედაც არის კონტაქტი */
        const nearEnd = max > 0 && max - y < 160;
        sticky.classList.toggle("is-visible", y > trigger() && !nearEnd);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ------------------ სექციის სათაურები: სიტყვები რიგრიგობით ამოდის */
  function initSplit() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$(".section-head h2, .faq-split__head h2, [data-split]").forEach((h) => {
      if (h.dataset.split === "done" || !h.closest("[data-reveal]")) return;
      h.dataset.split = "done";
      let w = 0;
      Array.from(h.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
            const sp = document.createElement("span");
            sp.className = "split-w";
            sp.style.setProperty("--w", w++);
            sp.textContent = part;
            frag.append(sp);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          n.classList.add("split-w");
          n.style.setProperty("--w", w++);
        }
      });
    });
  }

  /* ---------------------------------------- სტატიის ბმულის კოპირება */
  function initCopyLink() {
    $$("[data-copy-link]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const out = btn.closest(".share") && $(".share__done", btn.closest(".share"));
        try {
          await navigator.clipboard.writeText(btn.dataset.copyLink);
          if (out) out.textContent = "ბმული დაკოპირდა";
        } catch (e) {
          if (out) out.textContent = btn.dataset.copyLink;
        }
        if (out) setTimeout(() => { out.textContent = ""; }, 2600);
      });
    });
  }

  /* --------------------------- სარჩევი: მიმდინარე ქვესათაურის მონიშვნა */
  function initToc() {
    const links = $$(".toc a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const heads = Array.from(map.keys()).map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove("is-current"));
        const a = map.get(e.target.id);
        if (a) a.classList.add("is-current");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    heads.forEach((h) => io.observe(h));
  }

  /* ------------------------------------------ შეხვედრის დაჯავშნა (/contact) */
  function initBooking() {
    const root = $("[data-booking]");
    if (!root) return;

    const daysBox = $("[data-booking-days]", root);
    const timesBox = $("[data-booking-times]", root);
    const pick = $("[data-booking-pick]", root);
    const form = $("[data-booking-form]", root);
    const done = $("[data-booking-done]", root);
    const label = $("[data-booking-label]", root);
    let days = [];
    let sel = { date: "", time: "" };

    const fmtDay = (d) => d.dow + ", " + d.day + " " + d.month;

    const renderTimes = () => {
      const day = days.find((d) => d.date === sel.date);
      timesBox.innerHTML = "";
      if (!day || !day.slots.length) {
        const p = document.createElement("p");
        p.className = "booking__empty";
        p.textContent = "ამ დღეს თავისუფალი დრო აღარ არის — აირჩიეთ სხვა დღე.";
        timesBox.append(p);
        return;
      }
      day.slots.forEach((t) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "booking__time";
        b.textContent = t;
        b.setAttribute("aria-pressed", String(sel.time === t));
        b.addEventListener("click", () => {
          sel.time = t;
          label.textContent = fmtDay(day) + " · " + t;
          $$(".booking__time", timesBox).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          pick.hidden = true;
          form.hidden = false;
          $("input[name=name]", form).focus({ preventScroll: true });
          root.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        timesBox.append(b);
      });
    };

    const renderDays = () => {
      daysBox.innerHTML = "";
      days.forEach((d) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "booking__day";
        b.disabled = !d.slots.length;
        b.setAttribute("aria-pressed", String(sel.date === d.date));
        b.setAttribute("aria-label", fmtDay(d) + (d.slots.length ? ", " + d.slots.length + " თავისუფალი დრო" : ", დაკავებულია"));
        b.innerHTML = "<small></small><b></b><small></small>";
        b.children[0].textContent = d.dow;
        b.children[1].textContent = d.day;
        b.children[2].textContent = d.month;
        b.addEventListener("click", () => {
          sel = { date: d.date, time: "" };
          $$(".booking__day", daysBox).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          renderTimes();
        });
        daysBox.append(b);
      });
      const active = $(".booking__day[aria-pressed=true]", daysBox);
      if (active) daysBox.scrollLeft = active.offsetLeft - daysBox.offsetLeft - 8;
    };

    const load = async (keepDate) => {
      try {
        const res = await fetch("/api/slots.php", { headers: { Accept: "application/json" } });
        const data = await res.json();
        days = data.days || [];
        $$("[data-booking-mins]").forEach((el) => { el.textContent = data.slot || 30; });
        const first = days.find((d) => d.slots.length);
        if (!keepDate || !days.some((d) => d.date === sel.date && d.slots.length)) {
          sel = { date: first ? first.date : "", time: "" };
        }
        renderDays();
        renderTimes();
      } catch (e) {
        daysBox.innerHTML = "";
        const p = document.createElement("p");
        p.className = "booking__empty";
        p.textContent = "კალენდარი ვერ ჩაიტვირთა. დაგვირეკეთ ან შეავსეთ ფორმა ქვემოთ.";
        daysBox.append(p);
      }
    };

    const scrollDays = (dir) => daysBox.scrollBy({ left: dir * daysBox.clientWidth * 0.8, behavior: "smooth" });
    $("[data-booking-prev]", root).addEventListener("click", () => scrollDays(-1));
    $("[data-booking-next]", root).addEventListener("click", () => scrollDays(1));

    $("[data-booking-change]", root).addEventListener("click", () => {
      form.hidden = true;
      pick.hidden = false;
      sel.time = "";
      renderTimes();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const btn = $("button[type=submit]", form);
      const text = btn.textContent;
      btn.disabled = true;
      btn.textContent = "იჯავშნება…";
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.date = sel.date;
      payload.time = sel.time;
      try {
        const res = await fetch("/api/book.php", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          showStatus(form, "error", "ეს დრო ახლახან დაიკავეს — აირჩიეთ სხვა.");
          await load(true);
          form.hidden = true;
          pick.hidden = false;
          return;
        }
        if (!res.ok || !data.ok) throw new Error(data.error || "error");
        form.hidden = true;
        done.hidden = false;
        done.innerHTML =
          '<span class="booking__check" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' +
          "<h3></h3><p class=\"booking__when\"></p><p>დადასტურება გამოგიგზავნეთ ელფოსტაზე. ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ.</p>" +
          '<div class="btn-row"><a class="btn btn--primary" target="_blank" rel="noopener">კალენდარში დამატება</a><a class="btn btn--ghost" href="/work">ნამუშევრების ნახვა</a></div>';
        $("h3", done).textContent = "მადლობა, " + payload.name + "! შეხვედრა დაჯავშნილია.";
        $(".booking__when", done).textContent = data.label + " (თბილისის დროით)";
        const cal = $("a.btn--primary", done);
        if (data.gcal) cal.href = data.gcal; else cal.remove();
        done.focus();
      } catch (err) {
        showStatus(form, "error", "ჯავშანი ვერ გაიგზავნა. სცადეთ თავიდან ან დაგვირეკეთ.");
      } finally {
        btn.disabled = false;
        btn.textContent = text;
      }
    });

    load(false);
  }

  /* ---------------------------------------------- ჩატბოტი — ლიდის შეგროვება */
  function initChatbot() {
    if (document.body.dataset.noChat !== undefined) return;
    const store = {
      get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
      set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
      sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
      sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ICON_CHAT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    const ICON_X = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    const ICON_SEND = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

    const wrap = document.createElement("div");
    wrap.className = "chat";
    wrap.innerHTML =
      '<p class="chat__nudge" hidden><button type="button" class="chat__nudge-close" aria-label="დახურვა">' + ICON_X + '</button><span>გაქვთ პროექტი? 👋 ორ წუთში გავარკვიოთ, რა გჭირდებათ.</span></p>' +
      '<button class="chat__launcher" type="button" aria-expanded="false" aria-controls="chat-panel" aria-label="ჩატის გახსნა">' + ICON_CHAT + '</button>' +
      '<section class="chat__panel" id="chat-panel" role="dialog" aria-label="ვებიკოს ასისტენტი" hidden>' +
        '<header class="chat__head"><span class="chat__avatar" aria-hidden="true">W</span>' +
        '<span><b>ვებიკოს ასისტენტი</b><small>გუნდი გპასუხობთ 1 სამუშაო დღეში</small></span>' +
        '<button class="chat__close" type="button" aria-label="ჩატის დახურვა">' + ICON_X + '</button></header>' +
        '<div class="chat__log" role="log" aria-live="polite"></div>' +
        '<div class="chat__chips"></div>' +
        '<form class="chat__form" hidden novalidate><label class="sr-only" for="chat-input">პასუხი</label>' +
        '<input id="chat-input" class="chat__input" autocomplete="off">' +
        '<button class="chat__send" type="submit" aria-label="გაგზავნა">' + ICON_SEND + '</button></form>' +
        '<p class="chat__hint" hidden></p>' +
      '</section>';
    document.body.append(wrap);

    const launcher = $(".chat__launcher", wrap);
    const panel = $(".chat__panel", wrap);
    const log = $(".chat__log", wrap);
    const chips = $(".chat__chips", wrap);
    const form = $(".chat__form", wrap);
    const input = $(".chat__input", wrap);
    const hint = $(".chat__hint", wrap);
    const nudge = $(".chat__nudge", wrap);

    const answers = {};
    let step = -1;
    let started = false;
    let busy = false;

    const STEPS = [
      { key: "service",
        ask: () => ["გამარჯობა! 👋 მე ვებიკოს ასისტენტი ვარ.",
                    "რამდენიმე მოკლე კითხვით გავიგებ, რა გჭირდებათ, და ჩვენი გუნდი დაგიკავშირდებათ. რით შეგვიძლია დაგეხმაროთ?"],
        chips: ["ახალი ვებსაიტი", "ონლაინ მაღაზია", "SEO", "ციფრული მარკეტინგი", "ბრენდინგი", "სხვა"] },
      { key: "website",
        ask: () => ["კარგი! უკვე გაქვთ ვებსაიტი? თუ კი, ჩაწერეთ მისამართი."],
        input: { type: "text", placeholder: "example.ge", inputmode: "url" },
        chips: ["ჯერ არ მაქვს"] },
      { key: "budget",
        ask: () => ["დაახლოებით რა ბიუჯეტზე ფიქრობთ?"],
        chips: ["1 500 ₾-მდე", "1 500 – 5 000 ₾", "5 000 – 15 000 ₾", "15 000 ₾-ზე მეტი", "ჯერ არ ვიცი"] },
      { key: "timeline",
        ask: () => ["როდის გსურთ დაწყება?"],
        chips: ["რაც შეიძლება მალე", "1–3 თვეში", "ჯერ ვარკვევ"] },
      { key: "name",
        ask: () => ["გმადლობთ! როგორ მოგმართოთ?"],
        input: { type: "text", placeholder: "თქვენი სახელი", autocomplete: "name" },
        check: (v) => (v.length >= 2 ? "" : "გთხოვთ, ჩაწეროთ სახელი") },
      { key: "email",
        ask: (a) => ["სასიამოვნოა, " + a.name + "! რომელ ელფოსტაზე მოგწეროთ?"],
        input: { type: "email", placeholder: "name@company.ge", autocomplete: "email", inputmode: "email" },
        check: (v) => (EMAIL_RE.test(v) ? "" : "ელფოსტა არასწორია — შეამოწმეთ, გთხოვთ") },
      { key: "phone",
        ask: () => ["ტელეფონსაც თუ დაგვიტოვებთ, უფრო სწრაფად დაგიკავშირდებით. (არასავალდებულო)"],
        input: { type: "tel", placeholder: "+995 5XX XX XX XX", autocomplete: "tel", inputmode: "tel" },
        chips: ["გამოტოვება"],
        check: (v) => (PHONE_RE.test(v) ? "" : "ნომერი არასწორია — ან დააჭირეთ „გამოტოვებას“") },
      { key: "message",
        ask: () => ["ბოლო კითხვა: კიდევ რამე ხომ არ გვინდა ვიცოდეთ?"],
        input: { type: "text", placeholder: "მოკლედ აღწერეთ ამოცანა…" },
        chips: ["არა, სულ ესაა"] },
    ];
    const SKIP = { website: "ჯერ არ მაქვს", phone: "გამოტოვება", message: "არა, სულ ესაა" };

    const scroll = () => { log.scrollTop = log.scrollHeight; };
    const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

    const bubble = (text, who) => {
      const p = document.createElement("p");
      p.className = "chat__msg chat__msg--" + who;
      p.textContent = text;
      log.append(p);
      scroll();
      return p;
    };

    const say = async (lines) => {
      for (const line of lines) {
        const typing = document.createElement("p");
        typing.className = "chat__msg chat__msg--bot chat__typing";
        typing.setAttribute("aria-label", "იწერება");
        typing.innerHTML = "<i></i><i></i><i></i>";
        log.append(typing);
        scroll();
        await wait(Math.min(1100, 350 + line.length * 9));
        typing.remove();
        bubble(line, "bot");
      }
    };

    const setChips = (list, onPick) => {
      chips.innerHTML = "";
      (list || []).forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chat__chip";
        b.textContent = c;
        b.addEventListener("click", () => onPick(c));
        chips.append(b);
      });
    };

    const setInput = (cfg) => {
      hint.hidden = true;
      if (!cfg) { form.hidden = true; return; }
      form.hidden = false;
      input.value = "";
      input.type = cfg.type === "email" ? "email" : cfg.type === "tel" ? "tel" : "text";
      input.placeholder = cfg.placeholder || "";
      input.setAttribute("autocomplete", cfg.autocomplete || "off");
      if (cfg.inputmode) input.setAttribute("inputmode", cfg.inputmode); else input.removeAttribute("inputmode");
      if (!panel.hidden) input.focus({ preventScroll: true });
    };

    const ask = async (i) => {
      step = i;
      const s = STEPS[i];
      setChips([]);
      setInput(null);
      busy = true;
      await say(s.ask(answers));
      busy = false;
      setChips(s.chips, (c) => answer(c));
      setInput(s.input);
      if (!s.input && chips.firstChild) chips.firstChild.focus({ preventScroll: true });
    };

    const answer = async (raw) => {
      if (busy || step < 0) return;
      const s = STEPS[step];
      const value = raw.trim();
      const skipped = SKIP[s.key] === value;
      if (!value) return;
      if (s.check && !skipped) {
        const err = s.check(value);
        if (err) { hint.textContent = err; hint.hidden = false; input.focus(); return; }
      }
      bubble(value, "me");
      answers[s.key] = skipped ? "" : value;
      if (step + 1 < STEPS.length) ask(step + 1);
      else submit();
    };

    const submit = async () => {
      setChips([]);
      setInput(null);
      busy = true;
      await say(["ვაგზავნი…"]);
      const a = answers;
      const payload = {
        name: a.name, email: a.email, phone: a.phone || "",
        service: a.service, budget: a.budget, timeline: a.timeline, website: a.website || "",
        message: a.message || "", source: "chatbot", page: location.pathname,
      };
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error("send");
        store.set("webico_chat_done", a.name);
        await say(["მადლობა, " + a.name + "! 🎉 თქვენი მოთხოვნა მივიღეთ.",
                   "ჩვენი გუნდი ერთ სამუშაო დღეში მოგწერთ " + a.email + "-ზე. თუ გინდათ, ზარის დრო ახლავე დაჯავშნეთ."]);
        busy = false;
        setChips(["📅 ზარის დაჯავშნა", "ნამუშევრების ნახვა"], (c) => {
          location.href = c.indexOf("ზარის") > -1 ? "/contact#booking" : "/work";
        });
      } catch (e) {
        await say(["სამწუხაროდ, შეტყობინება ვერ გაიგზავნა. სცადეთ თავიდან ან მოგვწერეთ პირდაპირ: hello@webico.io"]);
        busy = false;
        setChips(["თავიდან ცდა"], () => submit());
      }
    };

    const start = async () => {
      if (started) return;
      started = true;
      const prev = store.get("webico_chat_done");
      if (prev) {
        busy = true;
        await say(["კიდევ ერთხელ გამარჯობა, " + prev + "! 👋 თქვენი მოთხოვნა უკვე მივიღეთ და მალე დაგიკავშირდებით."]);
        busy = false;
        setChips(["ახალი მოთხოვნა", "📅 ზარის დაჯავშნა"], (c) => {
          if (c === "ახალი მოთხოვნა") ask(0); else location.href = "/contact#booking";
        });
        return;
      }
      ask(0);
    };

    const open = () => {
      panel.hidden = false;
      wrap.classList.add("is-open");
      launcher.setAttribute("aria-expanded", "true");
      launcher.setAttribute("aria-label", "ჩატის დახურვა");
      launcher.innerHTML = ICON_X;
      nudge.hidden = true;
      store.sset("webico_nudge", "1");
      start();
      setTimeout(() => (form.hidden ? (chips.firstChild || $(".chat__close", wrap)) : input).focus({ preventScroll: true }), 50);
    };
    const close = () => {
      panel.hidden = true;
      wrap.classList.remove("is-open");
      launcher.setAttribute("aria-expanded", "false");
      launcher.setAttribute("aria-label", "ჩატის გახსნა");
      launcher.innerHTML = ICON_CHAT;
      launcher.focus({ preventScroll: true });
    };

    launcher.addEventListener("click", () => (panel.hidden ? open() : close()));
    $(".chat__close", wrap).addEventListener("click", close);
    wrap.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
    form.addEventListener("submit", (e) => { e.preventDefault(); answer(input.value); });
    nudge.addEventListener("click", (e) => {
      if (e.target.closest(".chat__nudge-close")) { nudge.hidden = true; store.sset("webico_nudge", "1"); return; }
      open();
    });
    $$('a[href="#chat"], [data-open-chat]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(); }));

    // ერთხელ სესიაში, მცირე დაყოვნებით — არა კონტაქტის გვერდზე და არა იმათთვის, ვინც უკვე მოგვწერა
    if (!store.sget("webico_nudge") && !store.get("webico_chat_done") && !/\/contact/.test(location.pathname)) {
      setTimeout(() => { if (panel.hidden) nudge.hidden = false; }, 15000);
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
    initCarousels();
    initFilters();
    initTeamCards();
    initMegaMenu();
    initScrollUi();
    initTextRoll();
    initRotator();
    initSplit();
    initCopyLink();
    initToc();
    initBooking();
    initChatbot();
  });
})();
