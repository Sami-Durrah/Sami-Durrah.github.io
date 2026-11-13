/* MoviesNook — shared movie catalogue + helpers.
   Movies added from the Admin page are kept in this browser's localStorage. */
// Resolve asset paths from this script's own location, so pages in any folder work.
const ASSETS = new URL(".", document.currentScript.src).href;
const POSTERS = ASSETS + "posters/";

const BASE_MOVIES = [
  { id: "ninjak", title: "Ninjak vs. the Valiant Universe", year: 2018, genre: "Action", price: 3.99, poster: "ninjak-vs-valiant.jpg" },
  { id: "miller", title: "Captain Miller", year: 2024, genre: "Action", price: 4.99, poster: "captain-miller.jpg" },
  { id: "wick", title: "John Wick", year: 2014, genre: "Thriller", price: 3.99, poster: "john-wick.jpg" },
  { id: "avatar2", title: "Avatar: The Way of Water", year: 2022, genre: "Sci-Fi", price: 5.99, poster: "avatar-the-way-of-water.jpg" },
  { id: "jaiho", title: "Jai Ho", year: 2014, genre: "Drama", price: 2.99, poster: "jai-ho.jpg" },
  { id: "thor", title: "Thor: Ragnarok", year: 2017, genre: "Sci-Fi", price: 4.99, poster: "thor-ragnarok.jpg" },
  { id: "looper", title: "Looper", year: 2012, genre: "Sci-Fi", price: 3.49, poster: "looper.jpg" },
  { id: "maharaja", title: "Maharaja", year: 2024, genre: "Thriller", price: 4.99, poster: "maharaja.jpg" },
];

const STORE_KEY = "moviesnook.custom";

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
}
function saveCustom(list) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch { /* storage blocked: keep in memory only */ }
}
function allMovies() { return [...BASE_MOVIES, ...loadCustom()]; }

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function posterSrc(m) { return m.poster ? POSTERS + m.poster : ASSETS + "logo/logo.png"; }

function movieCard(m, withPrice) {
  return `
  <article class="movie" data-genre="${esc(m.genre)}">
    <div class="poster"><img loading="lazy" src="${esc(posterSrc(m))}" alt="${esc(m.title)} poster"></div>
    <span class="rating">${esc(m.genre)}</span>
    <div class="info">
      <h3 title="${esc(m.title)}">${esc(m.title)}</h3>
      <div class="meta">${esc(m.year)}</div>
      ${withPrice ? `<div class="row"><span class="price">$${esc(Number(m.price || 0).toFixed(2))}</span><button class="icon-btn" type="button">Watch</button></div>` : ""}
    </div>
  </article>`;
}

function renderGrid(el, list, withPrice) {
  el.innerHTML = list.length ? list.map((m) => movieCard(m, withPrice)).join("") : `<p class="empty">No movies in this category yet.</p>`;
}

function setupFilters(chipsEl, gridEl, withPrice) {
  const genres = ["All", ...new Set(allMovies().map((m) => m.genre))];
  chipsEl.innerHTML = genres.map((g, i) => `<button class="chip${i ? "" : " active"}" data-g="${esc(g)}">${esc(g)}</button>`).join("");
  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip"); if (!btn) return;
    chipsEl.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
    const g = btn.dataset.g;
    renderGrid(gridEl, g === "All" ? allMovies() : allMovies().filter((m) => m.genre === g), withPrice);
  });
  renderGrid(gridEl, allMovies(), withPrice);
}
