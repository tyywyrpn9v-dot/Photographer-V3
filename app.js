const THEME_KEY = "iphone18proTheme.v5";
const FAV_KEY = "iphone18proFavorites.v5";
const app = document.querySelector("#app");
const state = {
  scenes: [],
  recipes: [],
  q: "",
  mode: "photo",
  modeFor: "",
  fav: new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")),
};

const SKIP = new Set(["style", "histogram", "format", "aspect", "texture", "grain", "tone"]);

const CAP = {
  aperture: ["◎", "鏡頭光圈", "Aperture"],
  depth: ["🌀", "景深", "Depth"],
  shutter: ["⏱️", "快門速度", "Shutter"],
  night: ["🌙", "夜間模式", "Night Mode"],
  ev: ["☀️", "曝光", "Exposure"],
  focus: ["🎯", "對焦", "Focus"],
  wb: ["🌡️", "白平衡", "White Balance"],
  zoom: ["🔍", "變焦", "Zoom"],
  mp: ["📐", "解析度", "Resolution"],
  format: ["🗂️", "格式", "Format"],
  style: ["🎨", "風格", "Style"],
  texture: ["✨", "質感", "Texture"],
  grain: ["🌫️", "顆粒", "Grain"],
  tone: ["◐", "色調", "Tone"],
  histogram: ["📊", "長條圖", "Histogram"],
  live: ["📸", "原況照片", "Live Photo"],
  burst: ["⚡", "連拍", "Burst"],
  timer: ["⏳", "計時器", "Timer"],
  grid: ["▦", "格線", "Grid"],
  "portrait-mode": ["👤", "人像模式", "Portrait"],
  macro: ["🔬", "微距", "Macro"],
  tripod: ["📍", "腳架", "Tripod"],
  flash: ["💡", "閃光燈", "Flash"],
  aspect: ["▭", "比例", "Aspect"],
};

const EDIT = {
  exposure: ["☀️", "曝光", "Exposure"],
  brilliance: ["✨", "鮮明度", "Brilliance"],
  highlights: ["🔆", "亮部", "Highlights"],
  shadows: ["🌘", "陰影", "Shadows"],
  contrast: ["◐", "對比", "Contrast"],
  brightness: ["💡", "亮度", "Brightness"],
  "black-point": ["⚫", "黑點", "Black Point"],
  saturation: ["🎨", "飽和度", "Saturation"],
  vibrance: ["🌈", "自然飽和度", "Vibrance"],
  warmth: ["🌡️", "色溫", "Warmth"],
  tint: ["🟣", "色調", "Tint"],
  sharpness: ["🔪", "銳利度", "Sharpness"],
  definition: ["🔎", "清晰度", "Definition"],
  "noise-reduction": ["🧹", "雜訊降低", "Noise Reduction"],
  vignette: ["◉", "暈影", "Vignette"],
  "white-balance": ["🌡️", "白平衡", "White Balance"],
  "live-photo": ["📸", "原況照片", "Live Photo"],
  style: ["🎨", "風格", "Style"],
};

const TAGS = {
  sunrise: ["暖色", "光線", "風景"],
  "blue-sky": ["明亮", "風景"],
  overcast: ["冷色", "風景"],
  sunset: ["暖色", "光線"],
  "milky-way": ["夜景"],
  moon: ["夜景"],
  "city-night": ["夜景", "暖色"],
  "car-trails": ["夜景", "動態"],
  "silky-water": ["水", "風景"],
  "water-splash": ["水", "動態"],
  starburst: ["夜景"],
  backlight: ["光線"],
  dark: ["夜景"],
  portrait: ["人物"],
  "env-portrait": ["人物", "風景"],
  "tilt-shift": ["風景"],
  "japanese-fresh": ["日系", "明亮"],
  mountain: ["風景"],
  seascape: ["風景", "水", "暖色"],
  fog: ["冷色", "風景"],
  architecture: ["風景"],
  street: ["動態"],
  sports: ["動態"],
  food: ["食物", "暖色"],
  macro: ["微距"],
  "video-24p": ["影片"],
};

const EFFECT = { natural: "自然", bright: "明亮", cool: "冷色", warm: "暖色", drama: "戲劇", japanese: "日系" };
const ROW3 = ["自然", "明亮", "冷色", "暖色", "戲劇", "日系", "風景", "夜景", "人物", "動態", "水", "光線", "食物", "微距", "影片"];
const MODES = [
  ["timelapse", "⏱️", "縮時", "Time-lapse"],
  ["slomo", "🐢", "慢動作", "Slo-mo"],
  ["cinematic", "🎬", "電影", "Cinematic"],
  ["video", "🎥", "影片", "Video"],
  ["photo", "📷", "照片", "Photo"],
  ["portrait", "👤", "人像", "Portrait"],
  ["spatial", "🕶️", "空間", "Spatial"],
  ["pano", "🌐", "全景", "Pano"],
];
const LIGHTS = ["自然光", "攝影棚燈光", "輪廓光", "舞台燈光", "舞台燈光單色", "高調燈光單色"];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({
  "&": "\u0026amp;", "<": "\u0026lt;", ">": "\u0026gt;", '"': "\u0026quot;", "'": "\u0026#39;",
}[m]));

function label(map, id) {
  const x = map[id];
  return x ? `${x[0]} ${x[1]}（${x[2]}）` : id;
}

function route() {
  const path = (location.hash.replace(/^#/, "") || "/all").split("?")[0];
  const p = path.split("/").filter(Boolean).map(decodeURIComponent);
  const name = p[0] || "all";
  if (name === "scene") return { page: "scene", id: p[1] || "" };
  if (name === "recipe") return { page: "recipe", id: p[1] || "" };
  if (name === "guide") return { page: "guide", filter: "all" };
  if (name === "capture") return { page: "list", filter: "capture" };
  if (name === "edit") return { page: "list", filter: "edit" };
  if (name === "favorites") return { page: "list", filter: "favorites" };
  if (name === "tag") return { page: "list", filter: p[1] || "all" };
  return { page: "list", filter: "all" };
}

function saveFav() { localStorage.setItem(FAV_KEY, JSON.stringify([...state.fav])); }
function favId(kind, id) { return kind + ":" + id; }
function toggleFav(key) {
  state.fav.has(key) ? state.fav.delete(key) : state.fav.add(key);
  saveFav();
  render();
}
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  localStorage.setItem(THEME_KEY, name);
  document.querySelectorAll("[data-theme-btn]").forEach((b) => b.classList.toggle("active", b.dataset.themeBtn === name));
  const color = { light: "#f3f1ec", dark: "#121110", outdoor: "#ffffff" }[name] || "#f3f1ec";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

function sceneTags(s) { return ["拍攝", ...(TAGS[s.id] || [])]; }
function recipeTags(r) {
  const extra = (r.familyTags || []).map((t) => EFFECT[t] || t);
  return ["後製", ...extra.filter((t, i, a) => a.indexOf(t) === i)];
}
function rowsOf(s) {
  return [...(s.must || []), ...(s.options || [])].filter((r) => r && !SKIP.has(r.id));
}
function glanceScene(s) {
  return rowsOf(s).slice(0, 4).map((r) => `${CAP[r.id]?.[1] || r.id} ${r.value}`).join(" · ") || "打開查看拍攝設定";
}
function styleValue(r) {
  const n = r.photographicStyle && r.photographicStyle.cinematic;
  return n === 0 || n ? String(n) : "";
}
function editPairs(r) {
  return Object.entries(r.adjustments || {}).filter(([, v]) => v !== 0 && v !== "0" && v != null && v !== "");
}
function glanceRecipe(r) {
  const bits = [];
  const sv = styleValue(r);
  if (sv) bits.push(`風格 ${sv}`);
  editPairs(r).slice(0, 3).forEach(([k, v]) => bits.push(`${EDIT[k]?.[1] || k} ${v}`));
  return bits.join(" · ") || r.line || r.want || "打開查看後製設定";
}
function hit(text) {
  const q = state.q.trim().toLowerCase();
  return !q || text.toLowerCase().includes(q);
}

function card(kind, id, title, img, tags, glance) {
  const key = favId(kind, id);
  const on = state.fav.has(key);
  const href = kind === "scene" ? `#/scene/${encodeURIComponent(id)}` : `#/recipe/${encodeURIComponent(id)}`;
  const badges = tags.map((t) => {
    const dest = t === "拍攝" ? "#/capture" : t === "後製" ? "#/edit" : `#/tag/${encodeURIComponent(t)}`;
    return `<a class="tag ${t === "拍攝" || t === "後製" ? "stage" : ""}" href="${dest}">${esc(t)}</a>`;
  }).join("");
  return `<article class="item">
    <button type="button" class="fav ${on ? "on" : ""}" data-fav="${esc(key)}" aria-label="收藏">${on ? "★" : "☆"}</button>
    <a href="${href}"><img class="shot" src="${esc(img)}" alt="${esc(title)}"></a>
    <div class="pad">
      <div class="badges">${badges}</div>
      <a class="text-link" href="${href}"><h2>${esc(title)}</h2><p class="glance"><b>一眼睇晒</b><br>${esc(glance)}</p></a>
    </div>
  </article>`;
}

function listPage(filter) {
  const scenes = state.scenes.filter((s) => {
    if (filter === "edit") return false;
    if (filter === "favorites" && !state.fav.has(favId("scene", s.id))) return false;
    if (filter !== "all" && filter !== "capture" && filter !== "favorites" && !sceneTags(s).includes(filter)) return false;
    return hit([s.title, s.description, s.fit, glanceScene(s), sceneTags(s).join(" ")].join(" "));
  });
  const recipes = state.recipes.filter((r) => {
    if (filter === "capture") return false;
    if (filter === "favorites" && !state.fav.has(favId("recipe", r.id))) return false;
    if (filter !== "all" && filter !== "edit" && filter !== "favorites" && !recipeTags(r).includes(filter)) return false;
    return hit([r.name, r.want, r.line, r.fit, glanceRecipe(r), recipeTags(r).join(" ")].join(" "));
  });
  const cards = [
    ...scenes.map((s) => card("scene", s.id, s.title || s.name, `examples/${s.id}.jpg`, sceneTags(s), glanceScene(s))),
    ...recipes.map((r) => card("recipe", r.id, r.name, r.image || "", recipeTags(r), glanceRecipe(r))),
  ];
  const chip = (href, id, text) => `<a class="chip ${filter === id ? "active" : ""}" href="${href}">${text}</a>`;
  return `<div class="search"><input id="q" type="search" placeholder="搜尋名稱、參數、設定" value="${esc(state.q)}" enterkeyhint="search"></div>
    <div class="filters">
      <div class="filter-row two">${chip("#/all", "all", "▦ 全部")}${chip("#/favorites", "favorites", "☆ 收藏 " + state.fav.size)}</div>
      <div class="filter-row two">${chip("#/capture", "capture", "📷 拍攝")}${chip("#/edit", "edit", "✏️ 後製")}</div>
      <div class="filter-row scroll">${ROW3.map((t) => chip(`#/tag/${encodeURIComponent(t)}`, t, t)).join("")}</div>
    </div>
    ${cards.length ? `<div class="grid">${cards.join("")}</div>` : `<div class="empty">沒有符合的項目。</div>`}
    <p class="guide-link"><a href="#/guide">通用功能說明</a></p>`;
}

function table(rows, withWhy, map) {
  if (!rows.length) return "";
  const head = withWhy ? "<th>參數</th><th>設定</th><th>原因</th>" : "<th>參數</th><th>設定</th>";
  const body = rows.map((r) => withWhy
    ? `<tr><td>${label(map, r.id)}</td><td><strong>${esc(r.value)}</strong></td><td>${esc(r.why || "")}</td></tr>`
    : `<tr><td>${label(map, r.id)}</td><td><strong>${esc(r.value)}</strong></td></tr>`).join("");
  return `<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function section(title, hint, rows, withWhy, map) {
  if (!rows.length) return "";
  return `<section class="block"><h2>${title}</h2><p class="sub">${hint.replace("N", String(rows.length))}</p>${table(rows, withWhy, map)}</section>`;
}

function modeBar(id) {
  if (state.modeFor !== id) {
    state.modeFor = id;
    state.mode = id === "video-24p" ? "video" : id === "portrait" || id === "env-portrait" ? "portrait" : "photo";
  }
  const buttons = MODES.map(([mid, icon, zh, en]) =>
    `<button type="button" class="mode-btn ${state.mode === mid ? "active" : ""}" data-mode="${mid}"><span>${icon} ${zh}</span><small>${en}</small></button>`).join("");
  const lights = state.mode === "portrait"
    ? `<div class="lights">${LIGHTS.map((n, i) => `<span>${i + 1} ${esc(n)}</span>`).join("")}</div>`
    : "";
  return `<section class="modes"><h2>拍攝模式（Capture Mode）</h2><div class="mode-grid">${buttons}</div>${lights}</section>`;
}

function scenePage(id) {
  const s = state.scenes.find((x) => x.id === id);
  if (!s) return `<div class="empty">找不到這個項目。<p><a href="#/all">返回</a></p></div>`;
  const must = (s.must || []).filter((r) => !SKIP.has(r.id));
  const options = (s.options || []).filter((r) => !SKIP.has(r.id));
  const notes = (s.notes || []).map((n) => `<li>${esc(typeof n === "string" ? n : n.text || "")}</li>`).join("");
  const flow = (s.flow || []).filter((n) => typeof n === "string" && !n.includes("長條圖")).map((n) => `<li>${esc(n)}</li>`).join("");
  return `<a class="back" href="#/capture">← 返回</a>
    <header class="detail-head"><div class="badges">${sceneTags(s).map((t) => `<a class="tag" href="${t === "拍攝" ? "#/capture" : `#/tag/${encodeURIComponent(t)}`}">${esc(t)}</a>`).join("")}</div>
    <h1>${esc(s.title || s.name)}</h1></header>
    <img class="hero-shot" src="examples/${esc(s.id)}.jpg" alt="">
    <section class="info">
      <div><b>說明</b><p>${esc(s.description || "")}</p></div>
      <div><b>適合場景</b><p>${esc(s.fit || "")}</p></div>
      <div><b>避免事項</b><p>${esc(s.avoid || "")}</p></div>
    </section>
    ${modeBar(s.id)}
    ${section("必須", "先完成以下 N 項", must, true, CAP)}
    ${section("選項", "有需要再加入以下 N 項", options, true, CAP)}
    ${flow ? `<section class="block"><h2>操作次序</h2><ol class="flow">${flow}</ol></section>` : ""}
    ${notes ? `<section class="block"><h2>注意</h2><ul class="notes">${notes}</ul></section>` : ""}`;
}

function recipePage(id) {
  const r = state.recipes.find((x) => x.id === id);
  if (!r) return `<div class="empty">找不到這個項目。<p><a href="#/all">返回</a></p></div>`;
  const sv = styleValue(r);
  const must = [];
  if (sv) must.push({ id: "style", value: sv, why: "" });
  editPairs(r).forEach(([k, v]) => must.push({ id: k, value: v }));
  const options = sv ? [] : [{ id: "style", value: "0–100，無指定強度" }];
  return `<a class="back" href="#/edit">← 返回</a>
    <header class="detail-head"><div class="badges">${recipeTags(r).map((t) => `<a class="tag" href="${t === "後製" ? "#/edit" : `#/tag/${encodeURIComponent(t)}`}">${esc(t)}</a>`).join("")}</div>
    <h1>${esc(r.name)}</h1></header>
    ${r.image ? `<img class="hero-shot" src="${esc(r.image)}" alt="">` : ""}
    <section class="info">
      <div><b>說明</b><p>${esc(r.want || r.line || "")}</p></div>
      <div><b>適合場景</b><p>${esc(r.fit || "")}</p></div>
      <div><b>避免事項</b><p>${esc(r.avoid || "")}</p></div>
    </section>
    <p class="note">Photos 的風格（Style）只調 0–100，不能再調 Tone、Color、Palette、Texture。這和相機的 Photographic Styles 是兩套控制。場景頁不指定風格。</p>
    ${section("必須", "先完成以下 N 項", must, false, EDIT)}
    ${section("選項", "有需要再加入以下 N 項", options, false, EDIT)}`;
}

function guidePage() {
  const hist = [["貼近左邊", "暗部多。留意陰影死黑。"], ["中間", "整體較均衡。"], ["貼近右邊", "亮部多。留意高光過曝。"]];
  return `<a class="back" href="#/all">← 返回</a>
    <header class="detail-head"><h1>通用功能說明</h1><p class="lead">長條圖、格式、比例每個場景都一樣，所以不放進個別項目。</p></header>
    <section class="guide-card"><h2>📊 長條圖（Histogram）</h2><p>用來判斷明暗分布，不是「開或關」。平常可以開著。</p>
      <div class="hist">${hist.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("")}</div></section>
    <section class="guide-card"><h2>🗂️ 格式（Format） · ▭ 比例（Aspect）</h2>
      <p>比例預設 4:3。16:9 和 1:1 只在構圖需要時用。</p>
      <p>日常用高效率 HEIF。光線夠、要裁切才用 48MP。需要大幅後期才用 ProRAW。最相容才選 JPG。</p></section>
    <section class="guide-card"><h2>📷 拍攝時才有</h2><p>鏡頭光圈、快門速度、夜間模式、對焦、景深、閃光燈、原況照片、連拍、計時器、腳架。這些不會出現在後製項目。</p></section>
    <section class="guide-card"><h2>✏️ 相簿 Edit 才有</h2><p>曝光、鮮明度、亮部、陰影、對比、亮度、黑點、飽和度、自然飽和度、色溫、色調、銳利度、清晰度、雜訊降低、暈影。風格只留 0–100。</p></section>`;
}

let lastPage = "";
function render() {
  const r = route();
  const pageKey = r.page + ":" + (r.id || r.filter || "");
  const jump = pageKey !== lastPage;
  lastPage = pageKey;
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const on = r.filter === "capture" ? a.dataset.nav === "capture" : r.filter === "edit" ? a.dataset.nav === "edit" : a.dataset.nav === "all";
    a.classList.toggle("active", on);
  });
  const searching = document.activeElement && document.activeElement.id === "q";
  const pos = searching ? document.activeElement.selectionStart : 0;
  if (r.page === "scene") app.innerHTML = scenePage(r.id);
  else if (r.page === "recipe") app.innerHTML = recipePage(r.id);
  else if (r.page === "guide") app.innerHTML = guidePage();
  else app.innerHTML = listPage(r.filter);
  if (searching) {
    const q = document.querySelector("#q");
    if (q) { q.focus(); q.setSelectionRange(pos, pos); }
  } else if (jump) window.scrollTo(0, 0);
}

document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) { e.preventDefault(); e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
  const mode = e.target.closest("[data-mode]");
  if (mode) { e.preventDefault(); state.mode = mode.dataset.mode; render(); return; }
  const theme = e.target.closest("[data-theme-btn]");
  if (theme) { e.preventDefault(); setTheme(theme.dataset.themeBtn); }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "q") { state.q = e.target.value; render(); }
});
window.addEventListener("hashchange", render);

async function boot() {
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  setTheme(localStorage.getItem(THEME_KEY) || "light");
  if (!location.hash) location.hash = "#/all";
  try {
    const [scenes, recipes] = await Promise.all([
      fetch("data/scenes.json").then((r) => { if (!r.ok) throw new Error("scenes.json"); return r.json(); }),
      fetch("data/recipes.json").then((r) => { if (!r.ok) throw new Error("recipes.json"); return r.json(); }),
    ]);
    state.scenes = scenes.scenes || [];
    state.recipes = recipes.recipes || [];
    render();
  } catch (err) {
    app.innerHTML = `<div class="error">資料載入失敗：${esc(err.message)}</div>`;
  }
}
boot();
