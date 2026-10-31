# Webico — ვებ სააგენტოს საიტი და CMS

webico.io — ქართულენოვანი საიტი ვებ-დეველოპმენტის სააგენტოსთვის: ნამუშევრები, ბლოგი,
ფასები, საიტის კონფიგურატორი, ჩატბოტი ლიდებისთვის, შეხვედრების ონლაინ დაჯავშნა და
მართვის პანელი (`/admin`).

**სტეკი:** Next.js 16 (App Router) + React 19, Node.js ≥ 20.9. მონაცემები ინახება JSON ფაილებში — ბაზა არ სჭირდება.
საიტი სერვერზე რენდერდება (ადმინი, API და JSON საცავი სერვერს საჭიროებს), ამიტომ სტატიკური ექსპორტი არ გამოდგება.

## ლოკალურად გაშვება

```bash
npm install
npm run dev          # → http://localhost:3000 (განვითარება)
npm run build && npm start   # production
```

## Hostinger-ზე გაშვება (Node.js Web App)

1. hPanel → **Websites → Add website → Node.js Apps** (ან არსებულ საიტზე „Deploy Node.js app“).
2. წყარო: **GitHub** → რეპოზიტორია `tamar1818/webico-website`, ბრენჩი `main`.
3. პარამეტრები:
   - Framework: **Next.js**
   - Node.js version: **22** (მინ. 20.9)
   - Build command: `npm run build`
   - Output directory: `.next`
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
| `UPLOADS_DIR` | ადმინიდან ატვირთული ფოტოები (ძველი საიტის ფოტოები `assets/img/uploads/`-დან აქ გადაიტანეთ) | `/home/uXXXX/webico-data/uploads` |
| `SESSION_SECRET` | ადმინის სესიის გასაღები (არასავალდებულო — თავად იქმნება) | გრძელი შემთხვევითი სტრიქონი |
| `PORT` | Hostinger თავად აყენებს | — |

- **SMTP-ის გარეშე** ფორმები და ჯავშნები მაინც ინახება და ადმინში ჩანს, ოღონდ ელფოსტა არ მოვა.
- **`DATA_DIR`** აუცილებლად მიუთითეთ აპის გარეთ არსებულ საქაღალდეზე. თუ არ მიუთითებთ,
  მონაცემები `content/`-ში ჩაიწერება და ახალი deploy-ისას შეიძლება წაიშალოს.
  `DATA_DIR`-ში ფაილი თუ არ არის, საიტი `content/`-იდან კითხულობს (პროექტები, სტატიები),
  ადმინში პირველი შენახვისას კი ასლი `DATA_DIR`-ში იქმნება.
- **`UPLOADS_DIR`** ასევე აპის გარეთ უნდა იყოს. თუ არ მიუთითებთ, ფოტოები `uploads/`-ში ინახება
  და deploy-ისას შეიძლება წაიშალოს.

## სტრუქტურა

```
app/                 Next.js მარშრუტები: [[...path]] (ქართული გვერდები), en/ (ინგლისური),
                     admin/, api/, sitemap.xml, not-found.jsx, layout.jsx
proxy.js             301 გადამისამართებები (www, .html/.php → სუფთა მისამართი, ბოლო სლეში), 404
site/                გვერდები (React): მთავარი, ნამუშევრები, ბლოგი, ფასები, /start, ნიშები,
                     სერვისები, static/ (about, services, contact, 404); routes.js, paths.js, meta.js
components/          Shell (ჰედერი, მენიუ, ფუტერი), ბლოკები, ნამუშევრები, სტატიის ბარათები
client/              interactions.js — ბრაუზერის სკრიპტი (მენიუ, ფორმები, ჯავშანი, ჩატი, კონფიგურატორი)
lib/                 core (JSON საცავი, ტექსტები), i18n + localize (EN თარგმანი), projects, blog,
                     booking, mail, auth, media, admin (მართვის პანელი), api, sitemap
data/                სერვისების, ნიშების და სამართლებრივი ტექსტები, FAQ, en/i18n.json (EN ლექსიკონი)
content/             projects.json, posts.json, site.json (საწყისი მონაცემები)
public/              CSS, ფოტოები, ლოგოები, favicon, robots.txt
```

## შრიფტები

სათაურები: Dachi The Lynx (`public/assets/fonts/`), ტექსტი: Noto Sans Georgian. იხ. [`public/assets/fonts/README.md`](public/assets/fonts/README.md).
