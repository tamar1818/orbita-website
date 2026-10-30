'use client';
/** საიტის ინტერაქცია (მენიუ, ფორმები, ჩატბოტი, ჯავშანი, კონფიგურატორი...) — ჰიდრაციის შემდეგ ერთხელ */
import { useEffect } from 'react';

let started = false;

export default function Interactions() {
  useEffect(() => {
    if (started) return;
    started = true;
    import('@/client/interactions').then((m) => m.init());
  }, []);
  return null;
}
