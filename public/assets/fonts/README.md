# შრიფტები

- **Gilroy GEO Heavy** — h1/h2 და ფუტერის სლოგანი (`gilroy-geo-heavy.woff2` / `.woff`).
- **BPG LE Studio 02 Caps** — h3/h4 და eyebrow-ები (`bpg-le-studio-02-caps.woff2` / `.woff`).

- **Dachi The Lynx** (typeface.ge) — სათაურები, მენიუ, სერვისები, ღილაკები.
  ფაილები: `dachi-the-lynx.woff2` და `dachi-the-lynx.woff` (დაკონვერტირებულია ორიგინალი `.otf`-იდან).
  შრიფტს ერთი წონა აქვს; `@font-face`-ში `font-weight: 100 900`, რომ ბრაუზერმა ყალბი bold არ დახატოს.
- **Noto Sans Georgian** (Google Fonts) — ტექსტი.

ახალი შრიფტის დამატება: `pip install fonttools brotli`, შემდეგ

```bash
python3 -c "from fontTools.ttLib import TTFont as F
for fl in ('woff2','woff'):
    f=F('Font.otf'); f.flavor=fl; f.save('font.'+fl)"
```
