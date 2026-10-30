# შრიფტი — LGV Anastasia 2025 Geo

საიტის მთავარი შრიფტია **LGV Anastasia 2025 Geo**:
<https://typeface.ge/ka/font/LGV+Anastasia+2025+Geo>

შრიფტის ფაილები რეპოზიტორიაში **არ არის ატვირთული** — ისინი ლიცენზირებულია და
typeface.ge-დან უნდა ჩამოტვირთოთ თქვენივე ლიცენზიით.

## როგორ დავამატო

1. ჩამოტვირთეთ შრიფტი typeface.ge-დან.
2. საჭიროების შემთხვევაში დააკონვერტირეთ ვებ-ფორმატში (`.woff2` / `.woff`) —
   მაგალითად, <https://transfonter.org> ან `fonttools`:

   ```bash
   pip install fonttools brotli
   pyftsubset LGVAnastasia2025Geo-Regular.ttf \
     --output-file=lgv-anastasia-2025-geo-regular.woff2 --flavor=woff2 \
     --unicodes="U+0020-007E,U+10A0-10FF,U+1C90-1CBF,U+2000-206F,U+20BE"
   ```

   > `U+10A0-10FF` და `U+1C90-1CBF` — ქართული ასომთავრული/მხედრული და მთავრული,
   > `U+20BE` — ლარის სიმბოლო (₾).

3. ფაილები განათავსეთ **ამ დირექტორიაში** ზუსტად ამ სახელებით:

   | ფაილი                                      | წონა (`font-weight`) |
   |--------------------------------------------|----------------------|
   | `lgv-anastasia-2025-geo-regular.woff2`     | 400                  |
   | `lgv-anastasia-2025-geo-medium.woff2`      | 500                  |
   | `lgv-anastasia-2025-geo-semibold.woff2`    | 600                  |
   | `lgv-anastasia-2025-geo-bold.woff2`        | 700                  |

   `.woff` ვერსიები არასავალდებულოა (ძველი ბრაუზერების სარეზერვო ვარიანტი),
   სახელები იგივეა `.woff` გაფართოებით.

4. სხვა არაფრის შეცვლა საჭირო არ არის — `@font-face` წესები უკვე აღწერილია
   `assets/css/style.css`-ის დასაწყისში.

## სანამ ფაილებს დაამატებთ

შრიფტის დასტა აღწერილია ასე:

```
"LGV Anastasia 2025 Geo" → "Noto Sans Georgian" → "BPG Arial" → system-ui
```

ანუ ფაილების გარეშეც საიტი სწორად გამოჩნდება — ჩაირთვება **Noto Sans Georgian**
(იტვირთება Google Fonts-იდან თითოეული გვერდის `<head>`-ში). თუ მომხმარებელს
LGV Anastasia სისტემაში აქვს დაინსტალირებული, `local()` წესი მას მაშინვე აიღებს.

## Google Fonts-ის გამორთვა

როცა LGV Anastasia-ს ფაილებს დაამატებთ და სარეზერვო შრიფტი აღარ დაგჭირდებათ,
წაშალეთ ეს სამი სტრიქონი ყველა `.html` ფაილიდან:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:...">
```
