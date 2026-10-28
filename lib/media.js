'use strict';
/** ფოტოების ატვირთვა — ტიპი დგინდება შიგთავსით (magic bytes) და არა გაფართოებით */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { UPLOADS_DIR, UPLOADS_URL, slug } = require('./core');

const MAX_UPLOAD = 25 * 1024 * 1024;
const MAX_IMAGE = 6 * 1024 * 1024;

function sniff(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length >= 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.length >= 12 && buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'webp';
  if (buf.length >= 12 && buf.slice(4, 8).toString() === 'ftyp') return 'mp4';
  if (buf.length >= 4 && buf.slice(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return 'webm';
  const head = buf.slice(0, 1024).toString('utf8').replace(/^﻿/, '').trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head)) return 'svg';
  return null;
}

/** file: multer-ის ობიექტი (memory storage) → {ok, file} | {ok:false, error} */
function upload(file, prefix = 'img') {
  if (!file || !file.buffer || !file.size) return { ok: false, error: 'ფაილი არ აირჩიეთ' };
  if (file.size > MAX_UPLOAD) return { ok: false, error: 'ფაილი 25 MB-ზე დიდია' };
  const ext = sniff(file.buffer);
  if (!ext) return { ok: false, error: 'დაშვებულია მხოლოდ JPG, PNG, WebP, SVG, MP4 და WebM' };
  if (!['mp4', 'webm'].includes(ext) && file.size > MAX_IMAGE) return { ok: false, error: 'ფოტო 6 MB-ზე დიდია' };
  if (ext === 'svg' && /<script|javascript:|on\w+\s*=|<foreignObject/i.test(file.buffer.toString('utf8'))) {
    return { ok: false, error: 'SVG შეიცავს სკრიპტს — აიკრძალა' };
  }
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const name = (slug(prefix) || 'img') + '-' + crypto.randomBytes(5).toString('hex') + '.' + ext;
    fs.writeFileSync(path.join(UPLOADS_DIR, name), file.buffer, { mode: 0o644 });
    return { ok: true, file: UPLOADS_URL + '/' + name };
  } catch {
    return { ok: false, error: 'ფაილის შენახვა ვერ მოხერხდა' };
  }
}

function list() {
  let files = [];
  try { files = fs.readdirSync(UPLOADS_DIR); } catch { return []; }
  return files.filter((f) => /\.(jpe?g|png|webp|svg|mp4|webm)$/i.test(f))
    .map((f) => ({ name: f, url: UPLOADS_URL + '/' + f, time: fs.statSync(path.join(UPLOADS_DIR, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);
}

function remove(name) {
  name = path.basename(String(name || ''));
  if (!/^[\w.-]+\.(jpe?g|png|webp|svg|mp4|webm)$/i.test(name)) return false;
  try { fs.unlinkSync(path.join(UPLOADS_DIR, name)); return true; } catch { return false; }
}

module.exports = { upload, list, remove, MAX_UPLOAD };
