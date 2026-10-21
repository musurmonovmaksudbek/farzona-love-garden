"use strict";
/* ===== SOZLAMALAR — faqat shu yerni o‘zgartiring ===== */
const CONFIG = {
  AUDIO_SRC: "./assets/music.mp3",          // musiqa fayli yo‘li
  TRACK_TITLE: "Ja tebia liubliu",          // pleyerda ko‘rinadigan nom
  START_AT: 110,                            // 01:50 = 110 soniya
  API_URL: "https://farzona-message.musurmonovmaksudbek.workers.dev",                              // Worker URL, masalan: https://farzona-message.NOM.workers.dev
  MAX_LEN: 1000
};

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Gul illyustratsiyalari (SVG) ===== */
const ring = (n, rx, ry, d, fill, op = 1) => Array.from({ length: n }, (_, i) =>
  `<ellipse cx="0" cy="${-d}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${op}" transform="rotate(${(360 / n) * i})"/>`).join("");
const FLOWERS = {
  rose: (a = "#C9879E", b = "#E7B4C6") => ring(5, 15, 17, 15, a) + ring(5, 11, 13, 9, b) + ring(4, 6, 8, 3, a, .9) + `<circle r="3" fill="#8a4a63"/>`,
  peony: (a = "#F5DCE5", b = "#E9B7CA") => ring(9, 12, 20, 18, a, .95) + ring(8, 10, 16, 11, b) + ring(6, 7, 10, 5, a) + `<circle r="3" fill="#C6A66B"/>`,
  tulip: (a = "#C9879E", b = "#F5DCE5") => `<path d="M-17-4Q-20-32 0-38Q20-32 17-4Q0 16-17-4Z" fill="${a}"/><path d="M-7-4Q-5-30 0-38Q7-28 7-4Q0 10-7-4Z" fill="${b}"/>`,
  lily: (a = "#FFFFFF", b = "#E9B7CA") => ring(6, 7, 26, 24, a) + ring(6, 2.5, 20, 18, b, .8) + `<circle r="3" fill="#C6A66B"/>`,
  daisy: () => ring(14, 4, 15, 19, "#FFFFFF") + `<circle r="9" fill="#C6A66B"/>`,
  lotus: (a = "#F5DCE5") => ring(8, 8, 22, 20, a, .9) + ring(5, 6, 14, 10, "#C9879E", .8)
};
const NAMES = { rose: "Atirgul", peony: "Pion", tulip: "Lola", lily: "Nilufar", daisy: "Moychechak", lotus: "Lotos" };
const flower = (t, size = 100, a, b) => `<svg viewBox="-50 -50 100 100" width="${size}" height="${size}" aria-hidden="true">${FLOWERS[t](a, b)}</svg>`;

function bouquet(seed, types, mode) {
  let s = seed * 9301 + 49297;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const el = document.createElement("div");
  el.className = "bouquet";
  const html = (types.concat(types)).map((t, i) => {
    const size = 70 + r() * 110, x = mode === "bottom" ? r() * 100 : (i % 2 ? 72 + r() * 28 : r() * 28);
    const y = mode === "bottom" ? 78 + r() * 18 : r() * 90, d = (r() * 6).toFixed(1);
    return `<div class="fl" style="width:${size}px;height:${size}px;left:calc(${x}% - ${size / 2}px);top:calc(${y}% - ${size / 2}px);animation-delay:-${d}s;transform:rotate(${r() * 60}deg)">${flower(t, size)}</div>`;
  }).join("");
  el.innerHTML = mode === "layers"
    ? [0, 1, 2].map(k => `<div class="layer" data-depth="${(k + 1) * 14}">${html}</div>`).join("") : html;
  return el;
}

/* ===== Sahnalar ===== */
const SCENES = [
  { k: "Taklifnoma", t: "Bu sahifa faqat sen uchun", p: ["Kichik bog‘ ochildi. Har bir sahifasi yumshoq so‘z va samimiy niyat bilan tayyorlandi.", "Shoshilmay aylanib chiq, Farzona."], fl: ["rose", "peony"], th: 0, al: "c" },
  { k: "Gullar bog‘i", t: "Xush kelibsan", p: ["Bu yerda har bir gul bir kayfiyatni eslatadi: biri sokin, biri quvnoq, biri mehribon.", "Umid qilamanki, bu bog‘ yuzingga tabassum olib keladi."], fl: ["rose", "peony", "tulip", "lily", "daisy", "lotus"], th: 1, al: "l", mode: "wide" },
  { k: "Esda qoladigan uchrashuv", t: "Kutilmagan uchrashuv", p: ["Ba’zi uchrashuvlar rejalashtirilmaydi, ammo xotirada uzoq qoladi.", "Seni uchratgan lahza menga shunday bo‘ldi: oddiy kun birdan boshqacha eslab qoldi."], fl: ["tulip", "daisy"], th: 2, al: "r" },
  { k: "Nafosating", t: "Sening nafosating", p: ["Muomalangdagi xotirjamlik, so‘zlaringdagi hurmat va odobing menga alohida taassurot qoldirdi.", "Haqiqiy nafosat tashqi ko‘rinishda emas, odamga munosabatda bilinadi."], fl: ["lily", "rose"], th: 3, al: "c" },
  { k: "Teran fikr", t: "O‘ylaydigan aql", p: ["Suhbatda o‘ylab gapirish, tinglay bilish va fikrni chiroyli ifodalash kamdan-kam uchraydi.", "Sen bilan gaplashish menga zavq bag‘ishladi."], fl: ["peony", "daisy"], th: 4, al: "l" },
  { k: "Sokin taassurot", t: "Qisqa uchrashuv, uzoq iz", p: ["Qisqa muloqot ham o‘ylarda uzoq qolishi mumkin ekan.", "Men buni ortiqcha ma’no yuklamasdan, shunchaki samimiy aytmoqchiman."], fl: ["lotus", "rose"], th: 5, al: "r" },
  { k: "Maktub", t: "Aytolmagan so‘zlarim", type: "words", lines: ["Ba’zan gapirish oson emas.", "So‘zlar tilimda to‘xtab qoladi,", "yuragimda esa aniq turadi.", "Shuning uchun yozdim.", "Qog‘oz sabrli, u shoshirmaydi."], fl: ["rose", "lily"], th: 6, al: "c" },
  { k: "Kichik sir", t: "Ochish uchun bos", type: "secret", front: "Bitta sirim bor...", back: "Seni uchratganimdan xursandman va seni yaxshiroq tanishni istardim. Buni ochiq, hurmat bilan aytgim keldi.", fl: ["rose", "daisy"], th: 3, al: "c" },
  { k: "Gullar tili", t: "Gullar nima deydi", type: "gallery", fl: [], th: 1, al: "c" },
  { k: "Atirgul rangli she’r", t: "Atirgul rangidagi she’r", type: "poem", lines: ["Tong kabi sokin kirding xayolimga,", "Gul kabi nozik edi so‘zing, odobing.", "Shoshmayman, qalbga yo‘l ochar vaqt,", "Mayin bir tabassum bo‘lsin sovg‘ang.", "", "Gul ochilar o‘z vaqtini kutib,", "Samimiy so‘z ham pishar sekin.", "Agar xohlasang, suhbat davom etsin,", "Bir choy, ikki so‘z, yengil kayfiyat."], fl: ["rose", "peony"], th: 2, al: "c" },
  { k: "Sehrli bog‘", t: "Bog‘ jonlanadi", p: ["Sichqonchani yoki barmog‘ingni siljit: gullar qatlamma-qatlam harakatlanadi."], mode: "layers", fl: ["rose", "peony", "tulip", "lily", "daisy", "lotus"], th: 4, al: "c" },
  { k: "Musiqa xonasi", t: "Musiqa xonasi", type: "music", p: ["Bu qo‘shiq men tanlagan kuy. Tinglamoqchi bo‘lsang, pastdagi pleyerdan ham boshqarishing mumkin."], fl: ["lotus", "daisy"], th: 5, al: "c" },
  { k: "Maktub", t: "Farzonaga xat", type: "letter", fl: ["tulip", "rose"], th: 6, al: "c" },
  { k: "Xarakter go‘zalligi", t: "Eng chiroyli narsa", p: ["Mehribonlik, odob va aql birga bo‘lganda inson alohida nur taratadi.", "Men aynan shu fazilatlarni qadrlayman."], fl: ["lily", "peony"], th: 0, al: "l" },
  { k: "Sokinlik", t: "Bir nafas", type: "calm", p: ["Chuqur nafas ol. Sekin chiqar."], fl: [], th: 4, al: "c" },
  { k: "Kichik tilak", t: "Kichik tilagim", p: ["Sening kunlaring tinch, ishlaring baraka, yuraging xotirjam bo‘lsin.", "Hayotingda ko‘plab chiroyli lahzalar bo‘lsin, Farzona."], fl: ["daisy", "tulip", "rose"], th: 2, al: "r" },
  { k: "Shoshilmaymiz", t: "Shoshilishga hojat yo‘q", p: ["Hurmat, rostgo‘ylik va tabiiylik. Tanishuv shu uch narsadan boshlanadi, deb o‘ylayman.", "Hech narsani majburlamayman. Sening qulaying men uchun muhim."], fl: ["lotus", "lily"], th: 5, al: "l" },
  { k: "Yana bir suhbat", t: "Yana bir suhbat?", p: ["Sen bilan yana gaplashishni istardim: kitob, sayohat, kundalik mayda gaplar haqida.", "Faqat sen xohlasang."], fl: ["peony", "daisy"], th: 1, al: "c" },
  { k: "Taklifim", t: "Yana ko‘rishsak bo‘ladimi?", type: "invite", p: ["Qulay vaqtda, jamoat joyida, bir piyola choy ustida suhbatlashsak, xursand bo‘lardim."], fl: ["rose", "lily"], th: 3, al: "c" },
  { k: "Yangi sahifa", t: "Farzona, endi sening fikringni ham eshitgim keladi...", type: "form", p: ["Agar xohlasang, bu yerga o‘z fikrlaringni yozishing mumkin. Xabaringni o‘qishdan xursand bo‘laman."], fl: ["rose", "tulip", "daisy"], th: 6, al: "c", mode: "bottom" }
];
const GALLERY = [
  ["rose", "Atirgul", "Ko‘p madaniyatlarda muhabbat va hurmat ramzi sifatida talqin qilinadi."],
  ["peony", "Pion", "Sharqda ko‘pincha farovonlik va baxt bilan bog‘lanadi."],
  ["tulip", "Lola", "Bahor, mehr va nafosat timsoli sifatida qaraladi."],
  ["lily", "Nilufar", "Ko‘pincha poklik va ma’naviy yengillik bilan bog‘lanadi."],
  ["daisy", "Moychechak", "Soddalik va samimiylikni eslatadi, deb talqin qilinadi."],
  ["lotus", "Lotos", "Sokinlik va qayta tug‘ilish ramzi sifatida talqin qilinadi."]
];

/* ===== Holat va render ===== */
const stage = $("#stage");
let idx = 0, busy = false;
const pad = n => String(n).padStart(2, "0");

function build(s, i) {
  const sec = document.createElement("section");
  sec.className = `scene t${s.th} ${s.al}`;
  sec.setAttribute("aria-label", `${i + 1}-sahna: ${s.k}`);
  if (s.fl.length) sec.append(bouquet(i + 3, s.fl, s.mode));
  const c = document.createElement("div");
  c.className = "card";
  let h = `<p class="hand">${s.k}</p><h2>${s.t}</h2><div class="rule"></div>`;
  (s.p || []).forEach(p => h += `<p>${p}</p>`);
  if (s.type === "words" || s.type === "poem") h += `<div class="poem">${s.lines.map((l, k) => l ? `<p style="animation-delay:${reduce ? 0 : k * 1.1}s">${l}</p>` : `<div class="gap"></div>`).join("")}</div>`;
  if (s.type === "secret") h += `<button class="flip" aria-pressed="false" id="flip"><span class="in"><span class="f hand">${s.front}</span><span class="b">${s.back}</span></span></button><p class="note">Kartani bosing.</p>`;
  if (s.type === "gallery") h += `<div class="gal">${GALLERY.map((g, k) => `<button aria-pressed="false" data-g="${k}">${flower(g[0], 64)}<b>${g[1]}</b><small>${g[2]}</small></button>`).join("")}</div><p class="note" style="margin-top:14px">Bu madaniy talqinlar, umumiy haqiqat emas.</p>`;
  if (s.type === "music") h += `<button class="btn primary" id="musicGo">Musiqani yoqish</button>`;
  if (s.type === "letter") h += `<button class="env" aria-pressed="false" id="env" aria-label="Xatni ochish"><span class="back"><span class="paper">Aziz Farzona, bu xatni o‘qiyotganingdan xursandman. Seni tanishtirganim uchun emas, balki hurmat bilan yaqinlashishni istaganim uchun yozdim. Qalbimda senga nisbatan iliq va samimiy taassurot bor. Javobing qanday bo‘lishidan qat’i nazar, vaqtingni ajratganing uchun rahmat.</span><span class="lid"></span></span></button><p class="note">Konvertni bosing.</p>`;
  if (s.type === "calm") h += `<div class="breathe" aria-hidden="true"></div><p class="hand">Hech qayerga shoshilmaymiz.</p>`;
  if (s.type === "invite") h += `<div class="choice"><button class="btn primary" data-a="yes">Ha, xursand bo‘lardim</button><button class="btn" data-a="think">O‘ylab ko‘raman</button></div><p class="reply" id="reply" aria-live="polite"></p><p class="note">Bu tugmalar xabar yubormaydi. Javobingni keyingi sahnada yozishing mumkin.</p>`;
  if (s.type === "form") h += formHTML();
  c.innerHTML = h;
  sec.append(c);
  return sec;
}

function show(n, dir = "fwd", first = false) {
  if (busy || n < 0 || n > 19) return;
  const old = stage.firstElementChild, sec = build(SCENES[n], n);
  idx = n;
  sec.className += first ? "" : ` enter ${dir}`;
  stage.append(sec);
  if (old) { old.classList.add("leave"); setTimeout(() => old.remove(), reduce ? 0 : 700); }
  requestAnimationFrame(() => requestAnimationFrame(() => sec.classList.remove("enter")));
  wire(sec, SCENES[n]);
  $("#cur").textContent = pad(n + 1);
  $("#fill").style.width = ((n + 1) / 20) * 100 + "%";
  $("#bar").setAttribute("aria-valuenow", n + 1);
  $("#prev").disabled = n === 0;
  $("#next").disabled = n === 19;
  document.querySelectorAll("#menu button").forEach((b, k) => k === n ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current"));
  busy = true; setTimeout(() => busy = false, reduce ? 0 : 450);
}

function wire(sec, s) {
  const f = $("#flip", sec); if (f) f.onclick = () => f.setAttribute("aria-pressed", f.getAttribute("aria-pressed") !== "true");
  const e = $("#env", sec); if (e) e.onclick = () => e.setAttribute("aria-pressed", e.getAttribute("aria-pressed") !== "true");
  sec.querySelectorAll("[data-g]").forEach(b => b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"));
  const m = $("#musicGo", sec); if (m) m.onclick = () => togglePlay(true);
  sec.querySelectorAll("[data-a]").forEach(b => b.onclick = () => $("#reply", sec).textContent = b.dataset.a === "yes" ? "Rahmat, bu menga juda yoqdi. Keyingi sahnada xohlasang yozib qoldirishing mumkin." : "Albatta, shoshilmasdan o‘yla. Sening qaroring muhim.");
  if (s.mode === "layers") sec.onmousemove = ev => sec.querySelectorAll(".layer").forEach(l => {
    const d = +l.dataset.depth; l.style.transform = `translate(${(ev.clientX / innerWidth - .5) * d}px,${(ev.clientY / innerHeight - .5) * d}px)`;
  });
  if (s.type === "form") wireForm(sec);
}

/* ===== Forma ===== */
function formHTML() {
  return `<form id="mf" novalidate>
  <div id="edit"><label for="msg" class="note">Xabaring</label>
  <textarea id="msg" maxlength="${CONFIG.MAX_LEN + 200}" placeholder="Bu yerga yuragingdagini yoz... shoshilma, hech kim kutib turgani yo‘q."></textarea>
  <div class="meta"><span id="cnt">0 / ${CONFIG.MAX_LEN}</span><span id="verr" class="over"></span></div>
  <button type="button" class="btn primary" id="chk">Yozganimni tekshirish</button></div>
  <div id="prev2" hidden><p class="note">Yuboriladigan xabar:</p><div class="preview" id="pv"></div>
  <button type="button" class="btn" id="back">Ortga qaytib tahrirlash</button> <button type="submit" class="btn primary" id="send">Xabarni yuborish</button></div>
  <input class="hp" name="website" id="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="status" id="st" role="status" aria-live="polite"></p></form>`;
}
function wireForm(sec) {
  const msg = $("#msg", sec), cnt = $("#cnt", sec), verr = $("#verr", sec), st = $("#st", sec), send = $("#send", sec);
  let sending = false, done = false;
  const val = () => { const v = msg.value.trim(); if (!v) return "Avval biror narsa yozing."; if (v.length > CONFIG.MAX_LEN) return `Xabar ${CONFIG.MAX_LEN} belgidan oshmasin.`; return ""; };
  msg.oninput = () => { const n = msg.value.trim().length; cnt.textContent = `${n} / ${CONFIG.MAX_LEN}`; cnt.className = n > CONFIG.MAX_LEN ? "over" : ""; verr.textContent = ""; };
  $("#chk", sec).onclick = () => { const e = val(); verr.textContent = e; if (e) return msg.focus(); $("#pv", sec).textContent = msg.value.trim(); $("#edit", sec).hidden = true; $("#prev2", sec).hidden = false; st.textContent = ""; };
  $("#back", sec).onclick = () => { if (sending) return; $("#prev2", sec).hidden = true; $("#edit", sec).hidden = false; msg.focus(); };
  $("#mf", sec).onsubmit = async ev => {
    ev.preventDefault();
    if (sending || done) return;
    const e = val(); if (e) { st.className = "status err"; st.textContent = e; return; }
    if (!CONFIG.API_URL) { st.className = "status err"; st.textContent = "Xabar yuborish hali sozlanmagan (backend ulanmagan). Matn saqlandi, hech narsa yuborilmadi."; return; }
    sending = true; send.disabled = true; $("#back", sec).disabled = true; st.className = "status"; st.textContent = "Yuborilmoqda...";
    try {
      const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 15000);
      const r = await fetch(CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg.value.trim(), website: $("#hp", sec).value }), signal: ctl.signal });
      clearTimeout(to);
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok === true) {
        done = true; $("#mf", sec).innerHTML = `<p class="status ok" role="status">Xabaring yetib bordi. Vaqting va samimiyliging uchun rahmat. ♡</p>`; return;
      }
      throw new Error(r.status === 429 ? "rate" : j.error || "fail");
    } catch (err) {
      st.className = "status err";
      st.textContent = err.message === "rate" ? "Juda ko‘p urinish bo‘ldi. Birozdan keyin qayta urinib ko‘r." : "Xabarni yuborib bo‘lmadi. Matning saqlandi, birozdan keyin qayta urinib ko‘r.";
      sending = false; send.disabled = false; $("#back", sec).disabled = false;
    }
  };
}

/* ===== Audio ===== */
const audio = $("#audio"), pp = $("#pp"), eq = $("#eq"), mute = $("#mute"), vol = $("#vol");
let audioOK = true;
audio.src = CONFIG.AUDIO_SRC; audio.volume = +vol.value; $("#trackTitle").textContent = CONFIG.TRACK_TITLE;
const seek = () => { if (audio.duration > CONFIG.START_AT + 5 && audio.currentTime < CONFIG.START_AT) audio.currentTime = CONFIG.START_AT; };
audio.addEventListener("loadedmetadata", seek);
audio.addEventListener("ended", () => { if (audio.duration > CONFIG.START_AT + 5) audio.currentTime = CONFIG.START_AT; audio.play().catch(() => {}); });
audio.addEventListener("play", () => { pp.textContent = "❚❚"; pp.setAttribute("aria-label", "To‘xtatish"); eq.classList.add("on"); });
audio.addEventListener("pause", () => { pp.textContent = "▶"; pp.setAttribute("aria-label", "Ijro etish"); eq.classList.remove("on"); });
audio.addEventListener("error", () => { audioOK = false; pp.disabled = true; const m = $("#aerr"); m.hidden = false; m.textContent = "Musiqa fayli topilmadi."; eq.classList.remove("on"); });
async function togglePlay(forcePlay) {
  if (!audioOK) return;
  if (audio.paused || forcePlay === true && audio.paused) { seek(); try { await audio.play(); } catch { const m = $("#aerr"); m.hidden = false; m.textContent = "Brauzer ijroga ruxsat bermadi."; } }
  else if (forcePlay !== true) audio.pause();
}
pp.onclick = () => togglePlay();
mute.onclick = () => { audio.muted = !audio.muted; mute.setAttribute("aria-pressed", audio.muted); mute.setAttribute("aria-label", audio.muted ? "Ovozni yoqish" : "Ovozni o‘chirish"); };
vol.oninput = () => { audio.volume = +vol.value; if (audio.muted && audio.volume > 0) mute.onclick(); };

/* ===== Kirish ===== */
const intro = $("#intro");
for (let i = 0; i < 22; i++) { const p = document.createElement("span"); p.className = "p" + (i % 3 ? "" : " d"); p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${8 + Math.random() * 8}s;animation-delay:-${Math.random() * 12}s;transform:scale(${.6 + Math.random()})`; $("#introPetals").append(p); }
function enter() {
  togglePlay(true);
  intro.classList.add("out"); $("#app").hidden = false;
  setTimeout(() => { intro.remove(); stage.focus({ preventScroll: true }); }, reduce ? 0 : 900);
}
$("#seal").onclick = () => { $(".intro-body").classList.add("open"); $("#reveal").hidden = false; $("#enter").focus(); };
$("#enter").onclick = enter;
$("#skip").onclick = enter;

/* ===== Navigatsiya ===== */
$("#prev").onclick = () => show(idx - 1, "back");
$("#next").onclick = () => show(idx + 1, "fwd");
$("#restart").onclick = () => show(0, "back");
const menu = $("#menu");
menu.innerHTML = SCENES.map((s, i) => `<button data-i="${i}" aria-label="${i + 1}-sahna: ${s.k}">${pad(i + 1)}</button>`).join("");
menu.onclick = e => { const b = e.target.closest("[data-i]"); if (b) { const n = +b.dataset.i; show(n, n > idx ? "fwd" : "back"); menu.hidden = true; $("#menuBtn").setAttribute("aria-expanded", "false"); } };
$("#menuBtn").onclick = () => { menu.hidden = !menu.hidden; $("#menuBtn").setAttribute("aria-expanded", String(!menu.hidden)); };
document.addEventListener("keydown", e => {
  if (/^(TEXTAREA|INPUT|SELECT)$/.test(e.target.tagName) || intro.isConnected && !intro.classList.contains("out")) return;
  if (e.key === "ArrowRight") show(idx + 1, "fwd"); else if (e.key === "ArrowLeft") show(idx - 1, "back"); else if (e.key === "Escape") { menu.hidden = true; }
});
show(0, "fwd", true);
