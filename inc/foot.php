  </main>


  <footer class="site-footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <a class="brand" href="/"><img class="brand__logo" src="assets/img/logo/webico-horizontal-white.svg" alt="Webico" width="152" height="38"></a>
          <p class="footer__about">ციფრული სააგენტო თბილისიდან. ვქმნით ვებსაიტებს, ვზრდით
            ორგანულ ტრაფიკს და ვმართავთ სარეკლამო კამპანიებს გაზომვადი შედეგისთვის.</p>
          <div class="socials">
            <a href="https://facebook.com" aria-label="Facebook" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
            <a href="https://instagram.com" aria-label="Instagram" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.9 8H4v12h2.9V8zM5.4 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 20h-2.9v-6.1c0-1.5-.6-2.4-1.8-2.4-1 0-1.5.6-1.8 1.3V20h-2.9V8h2.9v1.3c.6-.9 1.6-1.6 3.1-1.6 2.3 0 3.4 1.5 3.4 4.4V20z"/></svg></a>
            <a href="https://youtube.com" aria-label="YouTube" rel="noopener noreferrer" target="_blank">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.8C18.4 5 12 5 12 5s-6.4 0-7.9.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.8c1.5.5 7.9.5 7.9.5s6.4 0 7.9-.5a2.5 2.5 0 0 0 1.7-1.8C22 15.2 22 12 22 12zM10 15.2V8.8l5.3 3.2-5.3 3.2z"/></svg></a>
          </div>
        </div>

        <div>
          <h4>სერვისები</h4>
          <ul class="footer__list">
            <li><a href="/service-web-development">ვებსაიტების დიზაინი და შექმნა</a></li>
            <li><a href="/service-seo">SEO ოპტიმიზაცია</a></li>
            <li><a href="/service-marketing">ციფრული მარკეტინგი</a></li>
            <li><a href="/service-branding">ბრენდის ვიზუალური იდენტობა</a></li>
          </ul>
        </div>

        <div>
          <h4>კომპანია</h4>
          <ul class="footer__list">
            <li><a href="/about">ჩვენ შესახებ</a></li>
            <li><a href="/services">ყველა სერვისი</a></li>
            <li><a href="/work">ნამუშევრები</a></li>
            
            <li><a href="/#faq">კითხვები</a></li>
            <li><a href="/contact">კონტაქტი</a></li>
          </ul>
        </div>

        <div class="footer__contact">
          <h4>კონტაქტი</h4>
          <p><a href="tel:+99532200000"><?= cms_setting("phone", "+995 32 2 00 00 00") ?></a></p>
          <p><a href="mailto:<?= cms_setting("email", "hello@webico.io") ?>"><?= cms_setting("email", "hello@webico.io") ?></a></p>
          <p><?= cms_setting("address", "ჭავჭავაძის გამზირი 45, თბილისი 0179") ?></p>
          <p>ორშ–პარ, 10:00–19:00</p>
        </div>
      </div>

      <div class="footer__bottom">
        <span>&copy; <span id="year">2026</span> ვებიკო. ყველა უფლება დაცულია.</span>
        <span class="footer__credit">
          <a href="/contact">კონფიდენციალურობის პოლიტიკა</a>
          <a href="/contact">წესები და პირობები</a>
        </span>
      </div>
    </div>
  </footer>

  <script src="assets/js/main.js?v=0e4de5cc"></script>
</body>
</html>
