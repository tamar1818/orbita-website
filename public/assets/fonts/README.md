# შრიფტები

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
