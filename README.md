# Webico — ვებ სააგენტოს საიტი და CMS

webico.io — ქართულენოვანი საიტი ვებ-დეველოპმენტის სააგენტოსთვის: ნამუშევრები, ბლოგი,
ფასები, საიტის კონფიგურატორი, ჩატბოტი ლიდებისთვის, შეხვედრების ონლაინ დაჯავშნა და
მართვის პანელი (`/admin`).

**სტეკი:** Node.js (≥ 20) + Express. მონაცემები ინახება JSON ფაილებში — ბაზა არ სჭირდება.

## ლოკალურად გაშვება

```bash
npm install
npm start            # → http://localhost:3000
```

## Hostinger-ზე გაშვება (Node.js Web App)

1. hPanel → **Websites → Add website → Node.js Apps** (ან არსებულ საიტზე „Deploy Node.js app“).
2. წყარო: **GitHub** → რეპოზიტორია `tamar1818/orbita-website`, ბრენჩი `main`.
3. პარამეტრები:
   - Framework: **Express** (ან „Other“)
   - Node.js version: **20** ან **22**
   - Entry file: `server.js`
   - Build command: ცარიელი (ან `npm install`)
   - Start command: `npm start`
4. **Environment variables** (იხ. ქვემოთ) და **Deploy**.
5. დაუყოვნებლივ გახსენით `https://webico.io/admin` და შექმენით ადმინის პაროლი
   (პირველი გაშვებისას ანგარიშის შექმნა ნებისმიერს შეუძლია, ამიტომ არ დააყოვნოთ).

### გარემოს ცვლადები

| ცვლადი | რისთვის | მაგალითი |
|---|---|---|
| `SMTP_HOST` | ელფოსტის სერვერი (ლიდები, ჯავშნები) | `smtp.hostinger.com` |
| `SMTP_PORT` | პორტი | `465` |
| `SMTP_USER` | საფოსტო ყუთი | `hello@webico.io` |
| `SMTP_PASS` | ამ ყუთის პაროლი | — |
| `MAIL_FROM` | გამგზავნი (არასავალდებულო) | `hello@webico.io` |
| `DATA_DIR` | სად ინახება ლიდები, ჯავშნები, პაროლი და ადმინის ცვლილებები | `/home/uXXXX/webico-data` |
| `UPLOADS_DIR` | ადმინიდან ატვირთული ფოტოები | `/home/uXXXX/webico-data/uploads` |
| `SESSION_SECRET` | ადმინის სესიის გასაღები (არასავალდებულო — თავად იქმნება) | გრძელი შემთხვევითი სტრიქონი |
| `PORT` | Hostinger თავად აყენებს | — |

- **SMTP-ის გარეშე** ფორმები და ჯავშნები მაინც ინახება და ადმინში ჩანს, ოღონდ ელფოსტა არ მოვა.
- **`DATA_DIR`** აუცილებლად მიუთითეთ აპის გარეთ არსებულ საქაღალდეზე. თუ არ მიუთითებთ,
  მონაცემები `content/`-ში ჩაიწერება და ახალი deploy-ისას შეიძლება წაიშალოს.
  `DATA_DIR`-ში ფაილი თუ არ არის, საიტი `content/`-იდან კითხულობს (პროექტები, სტატიები),
  ადმინში პირველი შენახვისას კი ასლი `DATA_DIR`-ში იქმნება.

## სტრუქტურა

```
server.js            მარშრუტები, გადამისამართებები (.html/.php → სუფთა მისამართი), ქეში
lib/                 core (JSON საცავი, ტექსტები), layout (head/ფუტერი), projects, blog,
                     service, booking, mail, auth, media
pages/               დინამიკური გვერდები: მთავარი, ნამუშევრები, პროექტი, ბლოგი, სტატია,
                     ფასები, კონფიგურატორი, სამართლებრივი, sitemap
routes/api.js        /api/lead.php, /api/slots.php, /api/book.php
routes/admin.js      /admin — მართვის პანელი
views/static/        სტატიკური გვერდები (about, services, contact, სერვისები, 404)
data/                სერვისის გვერდების ტექსტები, სამართლებრივი ტექსტები, FAQ
content/             projects.json, posts.json, site.json (საწყისი მონაცემები)
assets/              CSS, JS, ფოტოები, ლოგოები
```

## შრიფტი — LGV Anastasia 2025 Geo

შრიფტის ფაილები რეპოზიტორიაში არ არის (ლიცენზირებულია). იხ. [`assets/fonts/README.md`](assets/fonts/README.md).
სანამ დაამატებთ, საიტი სარეზერვო შრიფტით (Noto Sans Georgian) ჩანს.
