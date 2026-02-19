const APP = {
  siteName: "Mac Short Solutions",
  tagline: "Not affiliated with USMA or DoW",
  contactEmail: "MacShortSolutions@gmail.com"
};

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function money(n){
  if (n === null || n === undefined || n === "") return "";
  const x = Number(n);
  if (Number.isNaN(x)) return String(n);
  return x.toLocaleString(undefined, { style:"currency", currency:"USD" });
}

function getTheme(){ return localStorage.getItem("theme") || "dark"; }
function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const btn = $("#themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "☾" : "☀";
}
function initTheme(){
  setTheme(getTheme());
  const btn = $("#themeToggle");
  if (btn) btn.addEventListener("click", ()=> setTheme(getTheme()==="dark" ? "light" : "dark"));
}

async function fetchJson(url){
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return await res.json();
}

async function loadAllProducts(){
  const manifest = await fetchJson("products/products.json");
  const slugs = manifest.products || [];
  const items = [];

  for (const slug of slugs){
    try{
      const p = await fetchJson(`products/${slug}/product.json`);
      p.slug = slug;
      items.push(p);
    }catch(e){
      console.warn("Skipping product", slug, e);
    }
  }

  // default order: created desc then name
  items.sort((a,b)=>{
    const da = a.created ? new Date(a.created).getTime() : 0;
    const db = b.created ? new Date(b.created).getTime() : 0;
    if (db !== da) return db - da;
    return String(a.name||"").localeCompare(String(b.name||""));
  });

  return items;
}

function productPrimaryImage(p){
  const first = (p.images && p.images.length) ? p.images[0] : null;
  return first ? `products/${p.slug}/images/${first}` : null;
}

function uniqueTags(products){
  const set = new Set();
  for (const p of products){
    for (const t of (p.optionalTags||[])) set.add(t);
  }
  return [...set].sort((a,b)=>String(a).localeCompare(String(b)));
}

function applyFiltersSort(products, { q="", tag="all", sort="featured" }){
  let out = [...products];

  const qq = q.trim().toLowerCase();
  if (qq){
    out = out.filter(p=>{
      const name = String(p.name||"").toLowerCase();
      const tags = (p.optionalTags||[]).map(x=>String(x).toLowerCase());
      return name.includes(qq) || tags.some(t=>t.includes(qq));
    });
  }

  if (tag !== "all") out = out.filter(p => (p.optionalTags||[]).includes(tag));

  if (sort === "price-asc") out.sort((a,b)=>Number(a.price||0)-Number(b.price||0));
  else if (sort === "price-desc") out.sort((a,b)=>Number(b.price||0)-Number(a.price||0));
  else if (sort === "name") out.sort((a,b)=>String(a.name||"").localeCompare(String(b.name||"")));
  // else featured: keep current order

  return out;
}

function renderCard(p){
  const img = productPrimaryImage(p);
  const tags = Array.isArray(p.optionalTags) ? p.optionalTags : [];
  return `
    <div class="card" data-slug="${escapeHtml(p.slug)}">
      <div class="thumb">
        ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" loading="lazy">` : ""}
      </div>
      <div class="body">
        <div class="row">
          <div class="n">${escapeHtml(p.name || "Untitled")}</div>
          <div class="p">${escapeHtml(money(p.price))}</div>
        </div>
        <div class="d">${escapeHtml(p.shortDescription || "")}</div>
        ${tags.length ? `<div class="tags">${tags.slice(0,3).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      </div>
    </div>
  `;
}

function openModal(html){
  const modal = $("#modal");
  const body = $("#modalBody");
  if (!modal || !body) return;
  body.innerHTML = html;
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  const modal = $("#modal");
  if (!modal) return;
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

function renderModal(p){
  const images = Array.isArray(p.images) ? p.images : [];
  const imageUrls = images.map(f => `products/${p.slug}/images/${f}`);
  const main = imageUrls[0] || null;
  const tags = Array.isArray(p.optionalTags) ? p.optionalTags : [];
  const video = p.video ? `products/${p.slug}/${p.video}` : null;

  const email = p.contactEmail || APP.contactEmail;
  const subject = `Inquiry: ${p.name || p.slug}`;

  return `
    <div class="modal-grid">
      <div>
        <div class="big" id="bigImg">
          ${main ? `<img src="${escapeHtml(main)}" alt="${escapeHtml(p.name)}">` : ""}
        </div>
        ${imageUrls.length ? `
          <div class="thumbs" id="thumbs">
            ${imageUrls.map((u,i)=>`
              <button class="${i===0?"active":""}" data-src="${escapeHtml(u)}" aria-label="Image ${i+1}">
                <img src="${escapeHtml(u)}" alt="" loading="lazy">
              </button>
            `).join("")}
          </div>
        ` : ""}
        ${video ? `
          <div class="video">
            <video controls preload="metadata">
              <source src="${escapeHtml(video)}" type="video/mp4">
            </video>
          </div>
        ` : ""}
      </div>

      <div>
        <div class="h2">${escapeHtml(p.name || "Untitled")}</div>
        <div class="price">${escapeHtml(money(p.price))} <span class="muted">(display only)</span></div>
        <div class="full">${escapeHtml(p.fullDescription || "")}</div>
        ${tags.length ? `<div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
        <div style="margin-top:12px;">
          <a class="btn" href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}">Email me</a>
          <div class="muted" style="margin-top:8px; font-size:13px;">
            Include the product name + any color/size notes.
          </div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  try{
    // basic top text
    $("#siteName").textContent = APP.siteName;
    $("#siteTagline").textContent = APP.tagline;

    // footer email
    const footerLink = $("#footerEmailLink");
    if (footerLink){
      footerLink.textContent = APP.contactEmail;
      footerLink.href = `mailto:${encodeURIComponent(APP.contactEmail)}?subject=${encodeURIComponent("Inquiry")}`;
    }

    // theme
    initTheme();

    // modal close handlers
    $("#modal")?.addEventListener("click", (e)=>{
      if (e.target?.dataset?.close === "true") closeModal();
    });
    document.addEventListener("keydown", (e)=>{
      if (e.key === "Escape") closeModal();
    });
    $all("[data-close='true']").forEach(btn => btn.addEventListener("click", closeModal));

    const products = await loadAllProducts();

    // tag dropdown
    const tagSel = $("#tagSelect");
    const tags = uniqueTags(products);
    tagSel.innerHTML = `<option value="all">All tags</option>` + tags.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");

    const state = { q:"", tag:"all", sort:"featured" };
    const grid = $("#productsGrid");
    const count = $("#resultsCount");

    function render(){
      const filtered = applyFiltersSort(products, state);
      count.textContent = `${filtered.length} item${filtered.length===1?"":"s"}`;
      grid.innerHTML = filtered.map(renderCard).join("") || `<div class="muted">No matches.</div>`;
    }

    $("#searchInput").addEventListener("input", (e)=>{ state.q = e.target.value; render(); });
    $("#tagSelect").addEventListener("change", (e)=>{ state.tag = e.target.value; render(); });
    $("#sortSelect").addEventListener("change", (e)=>{ state.sort = e.target.value; render(); });

    // click cards -> open modal
    grid.addEventListener("click", (e)=>{
      const card = e.target.closest(".card[data-slug]");
      if (!card) return;
      const slug = card.getAttribute("data-slug");
      const p = products.find(x => x.slug === slug);
      if (!p) return;

      openModal(renderModal(p));

      // thumbnail swapping inside modal
      const thumbs = $("#thumbs");
      const big = $("#bigImg");
      if (thumbs && big){
        thumbs.addEventListener("click", (ev)=>{
          const btn = ev.target.closest("button[data-src]");
          if (!btn) return;
          $all("#thumbs button").forEach(b=>b.classList.remove("active"));
          btn.classList.add("active");
          const src = btn.getAttribute("data-src");
          big.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(p.name)}">`;
        }, { once:false });
      }
    });

    render();
  }catch(err){
    console.error(err);
    const root = $("#pageError");
    if (root){
      root.textContent = `Load error: ${err?.message || String(err)} (Tip: open via http(s), not file://)`;
    }
  }
});

