#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSS/JS-ის ვერსიის განახლება ყველა HTML-ში.

  python3 tools/bump-assets.py

ვერსია არის style.css + main.js-ის შემცველობის ჰეში, ამიტომ ავტომატურად
იცვლება მხოლოდ მაშინ, როცა ფაილი რეალურად შეიცვალა. ეს აუცილებელია:
.htaccess-ში CSS/JS ქეშირებულია, და ვერსიის გარეშე ბრაუზერი ძველ სტილს
ხატავს ახალ HTML-ზე.
"""
import glob, hashlib, io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def bump():
    parts = []
    for rel in ("assets/css/style.css", "assets/js/main.js"):
        with open(os.path.join(ROOT, rel), "rb") as fh:
            parts.append(fh.read())
    ver = hashlib.sha1(b"".join(parts)).hexdigest()[:8]

    changed = 0
    targets = sorted(glob.glob(os.path.join(ROOT, "*.html"))
                     + glob.glob(os.path.join(ROOT, "*.php"))
                     + glob.glob(os.path.join(ROOT, "inc", "*.php")))
    for path in targets:
        html = io.open(path, encoding="utf-8").read()
        new = re.sub(r'(assets/css/style\.css)(\?v=[^"]*)?', r'\1?v=' + ver, html)
        new = re.sub(r'(assets/js/main\.js)(\?v=[^"]*)?', r'\1?v=' + ver, new)
        if new != html:
            io.open(path, "w", encoding="utf-8").write(new)
            changed += 1
    return ver, changed


if __name__ == "__main__":
    ver, changed = bump()
    print("  ✓ asset version: %s (%d ფაილი განახლდა)" % (ver, changed))
