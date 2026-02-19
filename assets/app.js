/* =========================================================
   Zero-build GitHub Pages shopfront
   - Loads products/products.json (manifest)
   - Loads each product's /products/<slug>/product.json
   - Renders cards, detail view, search, tags, sort
   ========================================================= */

const APP = {
  siteName: "Mac Short Solutions",
  tagline: "Solving problems since 2026",
  contactEmail: "MacShortSolutions@gmail.com", // used on Contact page
};

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function money(n){
  if (n === null || n === undefined || n === "") return "";
  const x = Number(n);
  if (Number.isNaN(x)) return String(n);
  return x.toLocaleString(undefined, { style:"currency", currency:"USD" });
}

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function getTheme(){
  return localStorage.getItem("theme") || "dark";
}
function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const btn = $("#themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "☾ Dark" : "☀ Light";
}
function initTheme(){
  setTheme(getTheme());
  const btn = $("#themeToggle");
  if (btn){
    btn.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }
}

async function fetchJson(url){
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return await res.json();
}

/** Loads all products via manifest -> product.json per slug */
async function loadAllProducts(){
  const manifest = await fetchJson("products/products.json");
  const slugs = manifest.products || [];
  const items = [];
  for (const slug of slugs){
    try{
      const p = await fetchJson(`products/${slug}/product.json`);
      p.slug = slug;
      items.push(p);
    }catch(err){
      console.warn("Skipping product:", slug, err);
    }
  }
  // default sort: newest first if "created" exists, else by name
  items.sort((a,b)=>{
    const da = a.created ? new Date(a.created).getTime() : 0;
    const db = b.created ? new Date(b.created).getTime() : 0;
    if (db !== da) return db - da;
    return String(a.name||"").localeCompare(String(b.name||""));
  });
  return items;
}

function productPrimaryImage(product){
  // IMPORTANT: browsers cannot list folders, so product.json must list images.
  const first = (product.images && product.images.length) ? product.images[0] : null;
  if (!first) return null;
  return `products/${product.slug}/images/${first}`;
}

function renderProductCard(product){
  const img = productPrimaryImage(product);
  const tags = Array.isArray(product.optionalTags) ? product.optionalTags : [];
  return `
    <a class="card product-card" href="product.html?slug=${encodeURIComponent(product.slug)}">
      <div class="thumb">
        ${img
          ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)}" loading="lazy">`
          : `<div class="notice">No image set</div>`
        }
      </div>
      <div class="pc-body">
        <div class="pc-top">
          <div class="pc-name">${escapeHtml(product.name || "Untitled")}</div>
          <div class="pc-price">${escapeHtml(money(product.price))}</div>
        </div>
        <p class="pc-desc">${escapeHtml(product.shortDescription || "")}</p>
        ${tags.length ? `<div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      </div>
    </a>
  `;
}

function applyFiltersSort(products, { q="", tag="all", sort="featured" }){
  let out = [...products];

  // search by name (and optionally tags)
  const qq = q.trim().toLowerCase();
  if (qq){
    out = out.filter(p=>{
      const name = String(p.name||"").toLowerCase();
      const tags = (p.optionalTags||[]).map(x=>String(x).toLowerCase());
      return name.includes(qq) || tags.some(t=>t.includes(qq));
    });
  }

  // tag filter
  if (tag !== "all"){
    out = out.filter(p => (p.optionalTags||[]).includes(tag));
  }

  // sort
  if (sort === "price-asc"){
    out.sort((a,b)=>Number(a.price||0)-Number(b.price||0));
  } else if (sort === "price-desc"){
    out.sort((a,b)=>Number(b.price||0)-Number(a.price||0));
  } else if (sort === "name"){
    out.sort((a,b)=>String(a.name||"").localeCompare(String(b.name||"")));
  } else {
    // "featured": keep default load order (already sorted by created/name)
  }

  return out;
}

function uniqueTags(products){
  const set = new Set();
  for (const p of products){
    for (const t of (p.optionalTags||[])) set.add(t);
  }
  return [...set].sort((a,b)=>String(a).localeCompare(String(b)));
}

/* -------------------------
   Page initializers
   ------------------------- */

async function initCommon(){
  initTheme();

  // active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $all(".nav-links a").forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  // fill brand text
  const brandText = $("#brandText");
  if (brandText) brandText.textContent = APP.siteName;

  const tagline = $("#taglineText");
  if (tagline) tagline.textContent = APP.tagline;
}

async function initHome(){
  await initCommon();
  const products = await loadAllProducts();

  // stats
  const statCount = $("#statCount");
  if (statCount) statCount.textContent = `${products.length} items`;
  const statMode = $("#statMode");
  if (statMode) statMode.textContent = `In-person / Email`;
  const statSpeed = $("#statSpeed");
  if (statSpeed) statSpeed.textContent = `By Order`;

  // featured = first 3
  const featured = products.slice(0,3);
  const grid = $("#featuredGrid");
  if (grid){
    grid.innerHTML = featured.map(renderProductCard).join("");
  }
}

async function initProductsPage(){
  await initCommon();
  const products = await loadAllProducts();

  // build tag dropdown
  const tags = uniqueTags(products);
  const tagSel = $("#tagSelect");
  if (tagSel){
    tagSel.innerHTML = `<option value="all">All tags</option>` + tags.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
  }

  const state = {
    q: "",
    tag: "all",
    sort: "featured",
  };

  const grid = $("#productsGrid");
  const count = $("#resultsCount");

  function render(){
    const filtered = applyFiltersSort(products, state);
    if (count) count.textContent = `${filtered.length} result${filtered.length===1?"":"s"}`;
    if (grid) grid.innerHTML = filtered.map(renderProductCard).join("") || `<div class="notice">No products match your filters.</div>`;
  }

  const qInput = $("#searchInput");
  if (qInput){
    qInput.addEventListener("input", (e)=>{ state.q = e.target.value; render(); });
  }

  if (tagSel){
    tagSel.addEventListener("change", (e)=>{ state.tag = e.target.value; render(); });
  }

  const sortSel = $("#sortSelect");
  if (sortSel){
    sortSel.addEventListener("change", (e)=>{ state.sort = e.target.value; render(); });
  }

  render();
}

async function initProductDetail(){
  await initCommon();

  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const wrap = $("#detailWrap");
  if (!slug){
    if (wrap) wrap.innerHTML = `<div class="notice">Missing product slug. Go back to <a href="products.html">Products</a>.</div>`;
    return;
  }

  let product;
  try{
    product = await fetchJson(`products/${slug}/product.json`);
    product.slug = slug;
  }catch(err){
    if (wrap) wrap.innerHTML = `<div class="notice">Couldn’t load this product. Go back to <a href="products.html">Products</a>.</div>`;
    return;
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const tags = Array.isArray(product.optionalTags) ? product.optionalTags : [];
  const videoFile = product.video || null; // optional: "video.mp4"

  const imageUrls = images.map(f => `products/${slug}/images/${f}`);
  const mainUrl = imageUrls[0] || null;

  if (wrap){
    wrap.innerHTML = `
      <div class="breadcrumb"><a href="products.html">Products</a> / ${escapeHtml(product.name || slug)}</div>

      <div class="detail">
        <div class="card gallery">
          <div class="main-image" id="mainImage">
            ${mainUrl ? `<img src="${escapeHtml(mainUrl)}" alt="${escapeHtml(product.name)}">` : `<div class="notice">No images set in product.json</div>`}
          </div>

          ${imageUrls.length ? `
            <div class="thumbs" id="thumbs">
              ${imageUrls.map((u,i)=>`
                <button class="${i===0?"active":""}" data-src="${escapeHtml(u)}" aria-label="View image ${i+1}">
                  <img src="${escapeHtml(u)}" alt="" loading="lazy">
                </button>
              `).join("")}
            </div>
          ` : ""}

          ${videoFile ? `
            <div class="video-wrap">
              <video controls preload="metadata">
                <source src="products/${escapeHtml(slug)}/${escapeHtml(videoFile)}" type="video/mp4">
                Sorry — your browser can’t play this video.
              </video>
            </div>
          ` : ""}
        </div>

        <div class="card detail-info">
          <h2>${escapeHtml(product.name || "Untitled")}</h2>
          <p class="price">${escapeHtml(money(product.price))} <span class="small">(display only)</span></p>
          <p class="full">${escapeHtml(product.fullDescription || "")}</p>

          ${tags.length ? `<div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}

          <div class="contact-box">
            <strong>Interested?</strong>
            <p class="small">Email me at: <a href="mailto:${encodeURIComponent(product.contactEmail || APP.contactEmail)}">${escapeHtml(product.contactEmail || APP.contactEmail)}</a></p>
            <a class="btn primary" href="mailto:${encodeURIComponent(product.contactEmail || APP.contactEmail)}?subject=${encodeURIComponent("Purchase Inquiry: " + (product.name||slug))}">
              Email about this
            </a>
          </div>
        </div>
      </div>
    `;

    // thumbnail click behavior
    const thumbs = $("#thumbs");
    const main = $("#mainImage");
    if (thumbs && main){
      thumbs.addEventListener("click", (e)=>{
        const btn = e.target.closest("button[data-src]");
        if (!btn) return;
        $all("#thumbs button").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        const src = btn.getAttribute("data-src");
        main.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)}">`;
      });
    }
  }
}

async function initContact(){
  await initCommon();
  const emailEl = $("#contactEmail");
  if (emailEl) emailEl.textContent = APP.contactEmail;
  const mailto = $("#mailtoLink");
  if (mailto) mailto.setAttribute("href", `mailto:${encodeURIComponent(APP.contactEmail)}?subject=${encodeURIComponent("Purchase Inquiry")}`);
}

/* -------------------------
   Router by page
   ------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.getAttribute("data-page");
  try{
    if (page === "home") await initHome();
    else if (page === "products") await initProductsPage();
    else if (page === "product") await initProductDetail();
    else if (page === "contact") await initContact();
    else await initCommon();
  }catch(err){
    console.error(err);
    const root = $("#pageError");
    if (root) root.innerHTML = `<div class="notice">Something went wrong loading this page.</div>`;
  }
});



