/* ==========================================================================
   Webico — საიტის ინტერაქცია
   ==========================================================================
   ლიდების ფორმის მიმღები მისამართი.
   მაგ.: "https://formspree.io/f/xxxxxxx" ან თქვენი backend-ის endpoint.
   ცარიელი მნიშვნელობისას ფორმა მუშაობს სადემონსტრაციო რეჟიმში —
   ვალიდაცია სრულად მუშაობს, მონაცემები კონსოლში იბეჭდება.
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = "/api/lead.php";

/** React-ის ჰიდრაციის შემდეგ ერთხელ ეშვება (components/Interactions.jsx) */
export function init() {

  /* ---------------------------------------------------------------- utils */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ინგლისური ვერსია (/en): სკრიპტის ტექსტები T()-ით ითარგმნება */
  const EN = document.documentElement.lang === "en";
  const TR = {
"პროექტი": "projects",
"მეტის ნახვა": "Read more",
"დახურვა": "Close",
"ბმული დაკოპირდა": "Link copied",
"WordPress-ის მოვლა": "WordPress care",
"ინდივიდუალური საიტის მოვლა": "Custom site care",
"SEO და მოვლა": "SEO and care",
"საიტი გამოწერით / მოვლა": "Website subscription / care",
"მაინტერესებს: „": "I'm interested in: “",
"სლაიდი ": "Slide ",
"თქვენი ბიზნესი": "Your business",
"ბიზნესი": "Business",
"პაკეტი": "Plan",
"დამატებები": "Add-ons",
"სტილი": "Style",
"₾ / წელი": "GEL / year",
"₾ / თვე": "GEL / month",
"თვეში ": "Instead of ",
" ₾-ის ნაცვლად 12 თვეს 10 თვის ფასად იხდით.": " GEL a month, you pay for 10 months and get 12.",
"წლიურად თუ გადაიხდით, ორი თვე უფასოა.": "Pay yearly and get two months free.",
"ნაბიჯი ": "Step ",
"მიუთითეთ სახელი.": "Please enter your name.",
"მიუთითეთ ტელეფონის ნომერი.": "Please enter your phone number.",
"ელფოსტა არასწორია.": "The email address is not valid.",
"უფასო ნიმუშის მოთხოვნა (/start)": "Free sample request (/en/start)",
"ბიზნესი: ": "Business: ",
"პაკეტი: ": "Plan: ",
" — ჩართვა ": " — setup ",
" ₾ / თვე": " GEL / month",
"დამატებები: ": "Add-ons: ",
"სტილი: ": "Style: ",
", ფერი ": ", colour ",
"გადახდა: ": "Payment: ",
"წლიური — ": "yearly — ",
" ₾ / წელი": " GEL / year",
"თვიური — ": "monthly — ",
"კომენტარი: ": "Comment: ",
"იგზავნება…": "Sending…",
"საიტი — ": "Website — ",
" ₾/თვე": " GEL/month",
" (წლიური)": " (yearly)",
"ვერ გაიგზავნა. სცადეთ თავიდან ან მოგვწერეთ WhatsApp-ზე.": "Couldn't send. Try again or message us on WhatsApp.",
"ნიმუშის მიღება": "Get my sample",
"ამ დღეს თავისუფალი დრო აღარ არის — აირჩიეთ სხვა დღე.": "No free times left on this day. Please choose another day.",
" თავისუფალი დრო": " free slots",
", დაკავებულია": ", fully booked",
"კალენდარი ვერ ჩაიტვირთა. დაგვირეკეთ ან შეავსეთ ფორმა ქვემოთ.": "The calendar couldn't load. Call us or fill in the form below.",
"იჯავშნება…": "Booking…",
"ეს დრო ახლახან დაიკავეს — აირჩიეთ სხვა.": "This time was just taken. Please choose another.",
"<h3></h3><p class=\"booking__when\"></p><p>დადასტურება გამოგიგზავნეთ ელფოსტაზე. ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ.</p>": "<h3></h3><p class=\"booking__when\"></p><p>We've sent a confirmation to your email. A member of our team will contact you at the agreed time.</p>",
"<div class=\"btn-row\"><a class=\"btn btn--primary\" target=\"_blank\" rel=\"noopener\">კალენდარში დამატება</a><a class=\"btn btn--ghost\" href=\"/work\">ნამუშევრების ნახვა</a></div>": "<div class=\"btn-row\"><a class=\"btn btn--primary\" target=\"_blank\" rel=\"noopener\">Add to calendar</a><a class=\"btn btn--ghost\" href=\"/en/work\">See our work</a></div>",
"მადლობა, ": "Thank you, ",
"! შეხვედრა დაჯავშნილია.": "! Your meeting is booked.",
" (თბილისის დროით)": " (Tbilisi time)",
"ჯავშანი ვერ გაიგზავნა. სცადეთ თავიდან ან დაგვირეკეთ.": "The booking couldn't be sent. Try again or call us.",
"<p class=\"chat__nudge\" hidden><button type=\"button\" class=\"chat__nudge-close\" aria-label=\"დახურვა\">": "<p class=\"chat__nudge\" hidden><button type=\"button\" class=\"chat__nudge-close\" aria-label=\"Close\">",
"</button><span>გაქვთ პროექტი? 👋 ორ წუთში გავარკვიოთ, რა გჭირდებათ.</span></p>": "</button><span>Got a project? 👋 Let's figure out what you need in two minutes.</span></p>",
"<button class=\"chat__launcher\" type=\"button\" aria-expanded=\"false\" aria-controls=\"chat-panel\" aria-label=\"ჩატის გახსნა\">": "<button class=\"chat__launcher\" type=\"button\" aria-expanded=\"false\" aria-controls=\"chat-panel\" aria-label=\"Open chat\">",
"<section class=\"chat__panel\" id=\"chat-panel\" role=\"dialog\" aria-label=\"ვებიკოს ასისტენტი\" hidden>": "<section class=\"chat__panel\" id=\"chat-panel\" role=\"dialog\" aria-label=\"Webico assistant\" hidden>",
"<span><b>ვებიკოს ასისტენტი</b><small>გუნდი გპასუხობთ 1 სამუშაო დღეში</small></span>": "<span><b>Webico assistant</b><small>The team replies within 1 business day</small></span>",
"<button class=\"chat__close\" type=\"button\" aria-label=\"ჩატის დახურვა\">": "<button class=\"chat__close\" type=\"button\" aria-label=\"Close chat\">",
"<form class=\"chat__form\" hidden novalidate><label class=\"sr-only\" for=\"chat-input\">პასუხი</label>": "<form class=\"chat__form\" hidden novalidate><label class=\"sr-only\" for=\"chat-input\">Answer</label>",
"<button class=\"chat__send\" type=\"submit\" aria-label=\"გაგზავნა\">": "<button class=\"chat__send\" type=\"submit\" aria-label=\"Send\">",
"გამარჯობა! 👋 მე ვებიკოს ასისტენტი ვარ.": "Hi! 👋 I'm the Webico assistant.",
"რამდენიმე მოკლე კითხვით გავიგებ, რა გჭირდებათ, და ჩვენი გუნდი დაგიკავშირდებათ. რით შეგვიძლია დაგეხმაროთ?": "With a few short questions I'll find out what you need, and our team will get in touch. How can we help?",
"ახალი ვებსაიტი": "New website",
"ონლაინ მაღაზია": "Online store",
"ციფრული მარკეტინგი": "Digital marketing",
"ბრენდინგი": "Branding",
"სხვა": "Other",
"კარგი! უკვე გაქვთ ვებსაიტი? თუ კი, ჩაწერეთ მისამართი.": "Great! Do you already have a website? If so, type the address.",
"ჯერ არ მაქვს": "Not yet",
"დაახლოებით რა ბიუჯეტზე ფიქრობთ?": "Roughly what budget do you have in mind?",
"1 500 ₾-მდე": "Up to 1,500 GEL",
"15 000 ₾-ზე მეტი": "Over 15,000 GEL",
"ჯერ არ ვიცი": "Not sure yet",
"როდის გსურთ დაწყება?": "When would you like to start?",
"რაც შეიძლება მალე": "As soon as possible",
"1–3 თვეში": "In 1–3 months",
"ჯერ ვარკვევ": "Still exploring",
"გმადლობთ! როგორ მოგმართოთ?": "Thanks! What should we call you?",
"თქვენი სახელი": "Your name",
"გთხოვთ, ჩაწეროთ სახელი": "Please enter your name",
"სასიამოვნოა, ": "Nice to meet you, ",
"! რომელ ელფოსტაზე მოგწეროთ?": "! Which email should we write to?",
"ელფოსტა არასწორია — შეამოწმეთ, გთხოვთ": "That email doesn't look right. Please check it",
"ტელეფონსაც თუ დაგვიტოვებთ, უფრო სწრაფად დაგიკავშირდებით. (არასავალდებულო)": "If you leave a phone number too, we can get back to you faster. (Optional)",
"გამოტოვება": "Skip",
"ნომერი არასწორია — ან დააჭირეთ „გამოტოვებას“": "That number doesn't look right, or tap “Skip”",
"ბოლო კითხვა: კიდევ რამე ხომ არ გვინდა ვიცოდეთ?": "Last question: is there anything else we should know?",
"მოკლედ აღწერეთ ამოცანა…": "Briefly describe the task…",
"არა, სულ ესაა": "No, that's all",
"იწერება": "Typing",
"ვაგზავნი…": "Sending…",
"! 🎉 თქვენი მოთხოვნა მივიღეთ.": "! 🎉 We've received your request.",
"ჩვენი გუნდი ერთ სამუშაო დღეში მოგწერთ ": "Our team will write to you at ",
"-ზე. თუ გინდათ, ზარის დრო ახლავე დაჯავშნეთ.": " within one business day. If you like, book a call time right now.",
"📅 ზარის დაჯავშნა": "📅 Book a call",
"ნამუშევრების ნახვა": "See our work",
"ზარის": "call",
"სამწუხაროდ, შეტყობინება ვერ გაიგზავნა. სცადეთ თავიდან ან მოგვწერეთ პირდაპირ: hello@webico.io": "Sorry, the message couldn't be sent. Try again or email us directly: hello@webico.io",
"თავიდან ცდა": "Try again",
"კიდევ ერთხელ გამარჯობა, ": "Hello again, ",
"! 👋 თქვენი მოთხოვნა უკვე მივიღეთ და მალე დაგიკავშირდებით.": "! 👋 We already have your request and will be in touch soon.",
"ახალი მოთხოვნა": "New request",
"ჩატის დახურვა": "Close chat",
"ჩატის გახსნა": "Open chat"
};
  const T = (s) => (EN && TR[s]) || s;
  const P = (p) => (EN ? "/en" + p : p);

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
      if (!href || href.startsWith("#") || href.startsWith("http") || a.classList.contains("lang-switch")) return;
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
  const MSG = EN ? {
    required: "This field is required",
    email: "Enter a valid email, e.g. name@company.com",
    phone: "Enter a valid phone number",
    short: "Please write at least 10 characters",
    consent: "Please accept the terms",
    fail: "Something went wrong. Email us at hello@webico.io",
    check: "Please fill in the highlighted fields.",
    sending: "Sending…"
  } : {
    check: "გთხოვთ, შეავსოთ მონიშნული ველები.",
    sending: "იგზავნება…",
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
    const title = EN ? (name ? "Thank you, " + name + "!" : "Thank you!") : (name ? "მადლობა, " + name + "!" : "მადლობა!");
    const wrap = document.createElement("div");
    wrap.className = "form-success";
    wrap.setAttribute("role", "status");
    wrap.innerHTML =
      '<div class="form-success__icon">' +
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      "</div>" +
      "<h3>" + title + "</h3>" +
      (EN ? "<p>We have your message and will reply within one business day.</p>"
        : "<p>თქვენი განაცხადი მიღებულია. ჩვენი გუნდი 24 საათის განმავლობაში დაგიკავშირდებათ " +
      "სამუშაო დღეებში.</p>");
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
          showStatus(form, "error", MSG.check);
          return;
        }

        const btn = $('button[type="submit"]', form);
        const label = btn ? btn.textContent : "";
        if (btn) {
          btn.dataset.loading = "true";
          btn.textContent = MSG.sending;
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
          b.setAttribute("aria-label", T("სლაიდი ") + (i + 1));
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
      if (live) live.textContent = shown + " " + (group.dataset.filterNoun || T("პროექტი"));
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
        if (label) label.textContent = open ? T("მეტის ნახვა") : T("დახურვა");
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
          if (out) out.textContent = T("ბმული დაკოპირდა");
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
  /* ---------- /plans: თვიური/წლიური გადართვა; ?plan= — პაკეტი ჯავშნის ფორმაში ---------- */


  /* კურსორის წარწერა ნამუშევრებზე და სერვისების სურათი */
  function initPointer() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const en = document.documentElement.lang === "en";
    const items = $$(".svc-work__item, .showcase__item, .case-card, .work-card, .work-tile");
    if (items.length) {
      const tag = document.createElement("div");
      tag.className = "cursor-tag";
      tag.setAttribute("aria-hidden", "true");
      tag.textContent = en ? "View" : "ნახვა";
      document.body.append(tag);
      items.forEach((el) => {
        el.setAttribute("data-cursor", "");
        el.addEventListener("mouseenter", () => tag.classList.add("is-on"));
        el.addEventListener("mouseleave", () => tag.classList.remove("is-on"));
      });
      document.addEventListener("mousemove", (e) => {
        tag.style.setProperty("--x", e.clientX + "px");
        tag.style.setProperty("--y", e.clientY + "px");
      }, { passive: true });
    }

    const rows = $$(".svc-list [data-preview]");
    if (!rows.length) return;
    const box = document.createElement("div");
    box.className = "svc-preview";
    box.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.alt = "";
    box.append(img);
    document.body.append(box);
    rows.forEach((row) => {
      const pre = new Image();
      pre.src = row.dataset.preview;
      row.addEventListener("mouseenter", () => {
        img.src = row.dataset.preview;
        box.style.setProperty("--r", (Math.random() * 6 - 3).toFixed(1) + "deg");
        box.classList.add("is-on");
      });
      row.addEventListener("mouseleave", () => box.classList.remove("is-on"));
      row.addEventListener("mousemove", (e) => {
        box.style.setProperty("--x", e.clientX + "px");
        box.style.setProperty("--y", e.clientY + "px");
      }, { passive: true });
    });
  }

  /* დიდი სტეიტმენტი: სიტყვები სქროლისას მუქდება */
  function initStatement() {
    const el = $("[data-statement]");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    const spans = words.map((w, i) => {
      const s = document.createElement("span");
      s.textContent = w;
      el.append(s, i < words.length - 1 ? " " : "");
      return s;
    });
    el.classList.add("is-split");
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("is-on", i < lit));
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* პროექტების ვიდეოები: იკვრება მხოლოდ ეკრანზე ყოფნისას, შემცირებული მოძრაობისას — არა */
  function initVideos() {
    const vids = $$("video[data-autoplay]");
    if (!vids.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); } else v.pause();
    }), { threshold: 0.25 });
    vids.forEach((v) => { v.preload = "auto"; io.observe(v); });
  }

  function initPlans() {
    const bill = $("[data-bill]");
    if (bill) {
      const btns = $$("[data-bill-set]", bill);
      btns.forEach((btn) => btn.addEventListener("click", () => {
        const mode = btn.dataset.billSet;
        btns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        $$(".plans .price__amount").forEach((el) => {
          el.querySelector("b").textContent = el.dataset[mode];
          const unit = el.querySelector("span");
          unit.textContent = unit.dataset[mode === "year" ? "unitYear" : "unitMonth"];
        });
      }));
    }
    const plan = new URLSearchParams(location.search).get("plan");
    if (EN) {
      const en = { start: "Starter package", business: "Business package", shop: "Store package", wordpress: "WordPress maintenance", custom: "Custom site maintenance", seo: "SEO and maintenance" };
      const box = document.getElementById("en-contact-message");
      if (plan && en[plan] && box && !box.value) box.value = "I'm interested in: " + en[plan];
      return;
    }
    const names = { wordpress: T("WordPress-ის მოვლა"), custom: T("ინდივიდუალური საიტის მოვლა"), seo: T("SEO და მოვლა") };
    if (!plan || !names[plan]) return;
    const topic = document.getElementById("bk-topic");
    if (topic) topic.value = T("საიტი გამოწერით / მოვლა");
    const msg = T("მაინტერესებს: „") + names[plan] + "“";
    ["bk-message", "contact-message"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && !el.value) el.value = msg;
    });
  }

  /* ---------- /start: უფასო ნიმუშის მოთხოვნა ---------- */
  function initConfigurator() {
    const form = $("[data-cfg]");
    if (!form) return;
    let conf;
    try { conf = JSON.parse(form.dataset.cfgConf); } catch (e) { return; }
    const F = (n) => form.elements[n];
    const steps = $$(".cfg__step", form);
    const total = steps.length;
    const bar = $("[data-cfg-bar]", form);
    const count = $("[data-cfg-count]", form);
    const back = $("[data-cfg-back]", form);
    const next = $("[data-cfg-next]", form);
    const submit = $("[data-cfg-submit]", form);
    const errBox = $("[data-cfg-error]", form);
    let cur = 1;
    let pkgTouched = new URLSearchParams(location.search).has("pkg");

    const val = (n) => (form.querySelector('[name="' + n + '"]:checked') || {}).value || "";
    const vals = (n) => $$('[name="' + n + '"]:checked', form).map((i) => i.value);
    const business = () => (F("business").value.trim() || T("თქვენი ბიზნესი"));
    const styleName = () => { const s = form.querySelector('[name="design"]:checked'); return s ? s.closest("label").querySelector(".design__label b").textContent : "—"; };

    const calc = () => {
      const p = conf.packages[val("pkg")] || { name: "", setup: 0, month: 0 };
      const addonsList = vals("addons").map((k) => conf.addons[k]).filter(Boolean);
      const month = p.month + addonsList.reduce((s, a) => s + a[1], 0);
      const year = val("billing") === "year";
      return { p, addonsList, month, year, shown: year ? month * 10 : month };
    };

    const renderPreview = () => {
      const t = conf.types[val("type")] || ["", ""];
      form.style.setProperty("--cfg-c", val("color") || "#7c5cff");
      $$("[data-cfg-brand]", form).forEach((el) => { el.textContent = business(); });
      $$("[data-cfg-headline]", form).forEach((el) => { el.textContent = t[1]; });
    };

    const renderSummary = () => {
      const c = calc();
      const t = conf.types[val("type")] || [""];
      const rows = [
        [T("ბიზნესი"), business() + " · " + t[0]],
        [T("პაკეტი"), c.p.name],
        [T("დამატებები"), c.addonsList.map((a) => a[0]).join(", ") || "—"],
        [T("სტილი"), styleName()],
      ];
      const ul = $("[data-cfg-summary]", form);
      ul.innerHTML = "";
      rows.forEach(([k, v]) => {
        const li = document.createElement("li");
        const b = document.createElement("b"); b.textContent = k;
        const sp = document.createElement("span"); sp.textContent = v;
        li.append(b, sp); ul.append(li);
      });
      $("[data-cfg-setup]", form).textContent = c.p.setup;
      $("[data-cfg-total]", form).textContent = c.shown;
      $("[data-cfg-unit]", form).textContent = c.year ? T("₾ / წელი") : T("₾ / თვე");
      $("[data-cfg-note]", form).textContent = c.year
        ? T("თვეში ") + c.month + T(" ₾-ის ნაცვლად 12 თვეს 10 თვის ფასად იხდით.")
        : T("წლიურად თუ გადაიხდით, ორი თვე უფასოა.");
    };

    const show = (n) => {
      cur = n;
      steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
      bar.style.width = (n / total) * 100 + "%";
      count.textContent = T("ნაბიჯი ") + n + " / " + total;
      back.hidden = n === 1;
      next.hidden = n === total;
      submit.hidden = n !== total;
      if (n === 4) renderPreview();
      if (n === total) renderSummary();
      const top = form.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    };

    const fail = (msg) => { errBox.textContent = msg; errBox.hidden = false; };

    next.addEventListener("click", () => show(Math.min(total, cur + 1)));
    back.addEventListener("click", () => show(Math.max(1, cur - 1)));
    form.addEventListener("change", (e) => {
      if (e.target.name === "pkg") pkgTouched = true;
      // ბიზნესის ტიპის მიხედვით პაკეტის შეთავაზება, სანამ მომხმარებელი თავად არ აირჩევს
      if (e.target.name === "type" && !pkgTouched) {
        const want = e.target.value === "shop" ? "shop" : e.target.value === "other" ? "start" : "business";
        const r = form.querySelector('[name="pkg"][value="' + want + '"]');
        if (r) r.checked = true;
      }
      if (cur === 4) renderPreview();
      if (cur === total) renderSummary();
    });
    F("business").addEventListener("input", renderPreview);
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && cur < total) { e.preventDefault(); next.click(); }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errBox.hidden = true;
      const name = F("name").value.trim();
      const phone = F("phone").value.trim();
      const email = F("email").value.trim();
      if (!name) return fail(T("მიუთითეთ სახელი."));
      if (phone.replace(/\D/g, "").length < 9) return fail(T("მიუთითეთ ტელეფონის ნომერი."));
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(T("ელფოსტა არასწორია."));

      const c = calc();
      const t = conf.types[val("type")] || [""];
      const lines = [
        T("უფასო ნიმუშის მოთხოვნა (/start)"),
        T("ბიზნესი: ") + business() + " (" + t[0] + ")",
        T("პაკეტი: ") + c.p.name + T(" — ჩართვა ") + c.p.setup + " ₾, " + c.p.month + T(" ₾ / თვე"),
        T("დამატებები: ") + (c.addonsList.map((a) => a[0] + " +" + a[1] + " ₾").join(", ") || "—"),
        T("სტილი: ") + styleName() + T(", ფერი ") + val("color"),
        T("გადახდა: ") + (c.year ? T("წლიური — ") + c.shown + T(" ₾ / წელი") : T("თვიური — ") + c.month + T(" ₾ / თვე")),
      ];
      const msg = F("message").value.trim();
      if (msg) lines.push("", T("კომენტარი: ") + msg);

      submit.disabled = true;
      submit.textContent = T("იგზავნება…");
      try {
        const res = await fetch("/api/lead.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, phone, email,
            company: business(),
            service: T("საიტი — ") + c.p.name,
            budget: c.p.setup + " ₾ + " + c.month + T(" ₾/თვე") + (c.year ? T(" (წლიური)") : ""),
            message: lines.join("\n"),
            source: "configurator",
            page: location.pathname,
            company_website: F("company_website").value,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error();
        form.hidden = true;
        const done = $("[data-cfg-done]");
        done.hidden = false;
        done.focus();
        if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { value: c.p.setup, currency: "GEL" });
        if (typeof window.fbq === "function") window.fbq("track", "Lead");
      } catch (err) {
        fail(T("ვერ გაიგზავნა. სცადეთ თავიდან ან მოგვწერეთ WhatsApp-ზე."));
        submit.disabled = false;
        submit.textContent = T("ნიმუშის მიღება");
      }
    });

    show(1);
  }

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
        p.textContent = T("ამ დღეს თავისუფალი დრო აღარ არის — აირჩიეთ სხვა დღე.");
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
        b.setAttribute("aria-label", fmtDay(d) + (d.slots.length ? ", " + d.slots.length + T(" თავისუფალი დრო") : T(", დაკავებულია")));
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
        const res = await fetch("/api/slots.php" + (EN ? "?lang=en" : ""), { headers: { Accept: "application/json" } });
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
        p.textContent = T("კალენდარი ვერ ჩაიტვირთა. დაგვირეკეთ ან შეავსეთ ფორმა ქვემოთ.");
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
      btn.textContent = T("იჯავშნება…");
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.date = sel.date;
      payload.time = sel.time;
      payload.lang = EN ? "en" : "ka";
      try {
        const res = await fetch("/api/book.php", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          showStatus(form, "error", T("ეს დრო ახლახან დაიკავეს — აირჩიეთ სხვა."));
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
          T("<h3></h3><p class=\"booking__when\"></p><p>დადასტურება გამოგიგზავნეთ ელფოსტაზე. ჩვენი გუნდის წევრი დათქმულ დროს დაგიკავშირდებათ.</p>") +
          T('<div class="btn-row"><a class="btn btn--primary" target="_blank" rel="noopener">კალენდარში დამატება</a><a class="btn btn--ghost" href="/work">ნამუშევრების ნახვა</a></div>');
        $("h3", done).textContent = T("მადლობა, ") + payload.name + T("! შეხვედრა დაჯავშნილია.");
        $(".booking__when", done).textContent = data.label + T(" (თბილისის დროით)");
        const cal = $("a.btn--primary", done);
        if (data.gcal) cal.href = data.gcal; else cal.remove();
        done.focus();
      } catch (err) {
        showStatus(form, "error", T("ჯავშანი ვერ გაიგზავნა. სცადეთ თავიდან ან დაგვირეკეთ."));
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
      T('<p class="chat__nudge" hidden><button type="button" class="chat__nudge-close" aria-label="დახურვა">') + ICON_X + T('</button><span>გაქვთ პროექტი? 👋 ორ წუთში გავარკვიოთ, რა გჭირდებათ.</span></p>') +
      T('<button class="chat__launcher" type="button" aria-expanded="false" aria-controls="chat-panel" aria-label="ჩატის გახსნა">') + ICON_CHAT + '</button>' +
      T('<section class="chat__panel" id="chat-panel" role="dialog" aria-label="ვებიკოს ასისტენტი" hidden>') +
        '<header class="chat__head"><span class="chat__avatar" aria-hidden="true">W</span>' +
        T('<span><b>ვებიკოს ასისტენტი</b><small>გუნდი გპასუხობთ 1 სამუშაო დღეში</small></span>') +
        T('<button class="chat__close" type="button" aria-label="ჩატის დახურვა">') + ICON_X + '</button></header>' +
        '<div class="chat__log" role="log" aria-live="polite"></div>' +
        '<div class="chat__chips"></div>' +
        T('<form class="chat__form" hidden novalidate><label class="sr-only" for="chat-input">პასუხი</label>') +
        '<input id="chat-input" class="chat__input" autocomplete="off">' +
        T('<button class="chat__send" type="submit" aria-label="გაგზავნა">') + ICON_SEND + '</button></form>' +
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
        ask: () => [T("გამარჯობა! 👋 მე ვებიკოს ასისტენტი ვარ."),
                    T("რამდენიმე მოკლე კითხვით გავიგებ, რა გჭირდებათ, და ჩვენი გუნდი დაგიკავშირდებათ. რით შეგვიძლია დაგეხმაროთ?")],
        chips: [T("ახალი ვებსაიტი"), T("ონლაინ მაღაზია"), "SEO", T("ციფრული მარკეტინგი"), T("ბრენდინგი"), T("სხვა")] },
      { key: "website",
        ask: () => [T("კარგი! უკვე გაქვთ ვებსაიტი? თუ კი, ჩაწერეთ მისამართი.")],
        input: { type: "text", placeholder: "example.ge", inputmode: "url" },
        chips: [T("ჯერ არ მაქვს")] },
      { key: "budget",
        ask: () => [T("დაახლოებით რა ბიუჯეტზე ფიქრობთ?")],
        chips: [T("1 500 ₾-მდე"), "1 500 – 5 000 ₾", "5 000 – 15 000 ₾", T("15 000 ₾-ზე მეტი"), T("ჯერ არ ვიცი")] },
      { key: "timeline",
        ask: () => [T("როდის გსურთ დაწყება?")],
        chips: [T("რაც შეიძლება მალე"), T("1–3 თვეში"), T("ჯერ ვარკვევ")] },
      { key: "name",
        ask: () => [T("გმადლობთ! როგორ მოგმართოთ?")],
        input: { type: "text", placeholder: T("თქვენი სახელი"), autocomplete: "name" },
        check: (v) => (v.length >= 2 ? "" : T("გთხოვთ, ჩაწეროთ სახელი")) },
      { key: "email",
        ask: (a) => [T("სასიამოვნოა, ") + a.name + T("! რომელ ელფოსტაზე მოგწეროთ?")],
        input: { type: "email", placeholder: "name@company.ge", autocomplete: "email", inputmode: "email" },
        check: (v) => (EMAIL_RE.test(v) ? "" : T("ელფოსტა არასწორია — შეამოწმეთ, გთხოვთ")) },
      { key: "phone",
        ask: () => [T("ტელეფონსაც თუ დაგვიტოვებთ, უფრო სწრაფად დაგიკავშირდებით. (არასავალდებულო)")],
        input: { type: "tel", placeholder: "+995 5XX XX XX XX", autocomplete: "tel", inputmode: "tel" },
        chips: [T("გამოტოვება")],
        check: (v) => (PHONE_RE.test(v) ? "" : T("ნომერი არასწორია — ან დააჭირეთ „გამოტოვებას“")) },
      { key: "message",
        ask: () => [T("ბოლო კითხვა: კიდევ რამე ხომ არ გვინდა ვიცოდეთ?")],
        input: { type: "text", placeholder: T("მოკლედ აღწერეთ ამოცანა…") },
        chips: [T("არა, სულ ესაა")] },
    ];
    const SKIP = { website: T("ჯერ არ მაქვს"), phone: T("გამოტოვება"), message: T("არა, სულ ესაა") };

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
        typing.setAttribute("aria-label", T("იწერება"));
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
      await say([T("ვაგზავნი…")]);
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
        await say([T("მადლობა, ") + a.name + T("! 🎉 თქვენი მოთხოვნა მივიღეთ."),
                   T("ჩვენი გუნდი ერთ სამუშაო დღეში მოგწერთ ") + a.email + T("-ზე. თუ გინდათ, ზარის დრო ახლავე დაჯავშნეთ.")]);
        busy = false;
        setChips([T("📅 ზარის დაჯავშნა"), T("ნამუშევრების ნახვა")], (c) => {
          location.href = c.indexOf(T("ზარის")) > -1 ? P("/contact#booking") : P("/work");
        });
      } catch (e) {
        await say([T("სამწუხაროდ, შეტყობინება ვერ გაიგზავნა. სცადეთ თავიდან ან მოგვწერეთ პირდაპირ: hello@webico.io")]);
        busy = false;
        setChips([T("თავიდან ცდა")], () => submit());
      }
    };

    const start = async () => {
      if (started) return;
      started = true;
      const prev = store.get("webico_chat_done");
      if (prev) {
        busy = true;
        await say([T("კიდევ ერთხელ გამარჯობა, ") + prev + T("! 👋 თქვენი მოთხოვნა უკვე მივიღეთ და მალე დაგიკავშირდებით.")]);
        busy = false;
        setChips([T("ახალი მოთხოვნა"), T("📅 ზარის დაჯავშნა")], (c) => {
          if (c === T("ახალი მოთხოვნა")) ask(0); else location.href = P("/contact#booking");
        });
        return;
      }
      ask(0);
    };

    const open = () => {
      panel.hidden = false;
      wrap.classList.add("is-open");
      launcher.setAttribute("aria-expanded", "true");
      launcher.setAttribute("aria-label", T("ჩატის დახურვა"));
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
      launcher.setAttribute("aria-label", T("ჩატის გახსნა"));
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
      setTimeout(() => { if (panel.hidden) nudge.hidden = false; }, location.pathname === "/" ? 6000 : 15000);
    }
  }

  /* ------------------------------------------------------------ bootstrap */
  {
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
    initPointer();
    initStatement();
    initVideos();
    initBooking();
    initPlans();
    initConfigurator();
    initChatbot();
  }
}
