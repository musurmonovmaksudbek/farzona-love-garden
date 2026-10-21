# Farzona — Gullar bog‘i

20 sahnali statik sayt (HTML/CSS/JS) + Cloudflare Worker orqali Telegramga xabar yuborish.

## 1. Musiqa
Fayl allaqachon `assets/music.mp3` sifatida qo‘yilgan. Almashtirish uchun:
- yangi faylni `assets/` ga qo‘ying;
- `script.js` boshidagi `CONFIG` ni o‘zgartiring: `AUDIO_SRC`, `TRACK_TITLE`, `START_AT` (soniyada, 01:50 = 110).
Musiqa foydalanuvchi tugmani bosmaguncha boshlanmaydi.

## 2. GitHub Pages
1. GitHub'da `farzona-love-garden` nomli repozitoriy yarating (Public).
2. Papka ichidagi hamma fayllarni (shu jumladan `.github/`) yuklang, `main` filiali.
3. **Settings → Pages → Source: GitHub Actions** ni tanlang.
4. **Actions** bo‘limida "Deploy to GitHub Pages" tugashini kuting. Sayt: `https://USERNAME.github.io/farzona-love-garden/`.
Eslatma: mp3 ~5 MB, GitHub uchun muammo emas.

## 3. Telegram bot (xavfsiz usul)
Token hech qachon GitHub'ga, `script.js` ga yoki chatga yozilmaydi.
1. Telegramda **@BotFather** → `/newbot` (yoki mavjud bot uchun `/revoke`) → yangi token oling.
2. O‘zingiz botga kirib **/start** yuboring.
3. Chat ID: brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching (faqat o‘z kompyuteringizda), javobdagi `"chat":{"id":...}` raqami sizning chat ID'ingiz.
4. Kompyuteringizda: `npm i -g wrangler`, so‘ng `cd worker`.
5. `wrangler.toml` dagi `ALLOWED_ORIGIN` ni `https://USERNAME.github.io` ga o‘zgartiring.
6. `wrangler login`, `wrangler secret put TELEGRAM_BOT_TOKEN`, `wrangler secret put TELEGRAM_CHAT_ID` (qiymatni so‘ralganda kiritasiz).
7. `wrangler deploy` — oxirida Worker manzili chiqadi.
8. `script.js` dagi `CONFIG.API_URL` ga shu manzilni yozing, commit qiling.
9. Saytda forma orqali sinov xabari yuboring va Telegramda kelganini tekshiring. Kelmaguncha "ishlayapti" demang.

Himoya: faqat ruxsat etilgan origin, uzunlik va format tekshiruvi, HTML escape, IP bo‘yicha 10 daqiqada 3 ta limit (oddiy, xotirada), honeypot. Qo‘shimcha: Cloudflare dashboard → Security → WAF → Rate limiting qoidasi qo‘shing. Token va xabar matni loglanmaydi.

## Hozirgi holat
`CONFIG.API_URL` bo‘sh: forma "hali sozlanmagan" deydi va hech narsa yubormaydi, soxta muvaffaqiyat ko‘rsatmaydi.
