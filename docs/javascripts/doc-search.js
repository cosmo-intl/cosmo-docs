// Search only the selected language and the shared reference pages.
(function () {
  "use strict";
  var search = document.querySelector("[data-doc-search]");
  if (!search) return;
  var form = search.querySelector("form");
  var input = form.elements.query;
  var results = document.getElementById("doc-search-results");
  var status = search.querySelector("[data-doc-search-status]");
  var index;
  var revision = 0;
  var timer;
  function plain(html) {
    return new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  }
  function load() {
    if (!index) index = fetch(search.dataset.indexUrl).then(function (response) {
      if (!response.ok) throw new Error("Search index unavailable");
      return response.json();
    }).then(function (data) {
      return data.docs.map(function (entry) {
        return {location: entry.location, title: entry.title, text: plain(entry.text)};
      });
    }).catch(function (error) { index = null; throw error; });
    return index;
  }
  function run() {
    var request = ++revision;
    var query = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (!query) { status.textContent = "Type to search this language"; return; }
    status.textContent = "Searching…";
    load().then(function (entries) {
      if (request !== revision) return;
      var language = document.documentElement.dataset.docLanguage || "javascript";
      var words = query.split(/\s+/);
      var pages = new Map();
      entries.forEach(function (entry) {
        if (!entry.location.startsWith(language + "/") &&
            !/^(?:$|index\.html|parity\/)/.test(entry.location)) return;
        var title = entry.title.toLowerCase();
        var text = entry.text.toLowerCase();
        if (!words.every(function (word) { return title.includes(word) || text.includes(word); })) return;
        var score = words.reduce(function (sum, word) { return sum + (title.includes(word) ? 10 : 1); }, 0);
        var key = entry.location.split("#")[0];
        if (!pages.has(key) || pages.get(key).score < score) pages.set(key, {entry: entry, score: score});
      });
      var matches = Array.from(pages.values()).sort(function (a, b) { return b.score - a.score; }).slice(0, 12);
      matches.forEach(function (match) {
        var entry = match.entry;
        var item = document.createElement("li");
        item.className = "md-search-result__item";
        var link = document.createElement("a");
        link.className = "md-search-result__link";
        link.href = new URL(entry.location, new URL(search.dataset.baseUrl, location.href)).href;
        var heading = document.createElement("div");
        heading.className = "md-search-result__title";
        heading.textContent = entry.title;
        var excerpt = document.createElement("p");
        excerpt.className = "md-search-result__teaser";
        var offset = Math.max(0, entry.text.toLowerCase().indexOf(words[0]) - 50);
        excerpt.textContent = (offset ? "…" : "") + entry.text.slice(offset, offset + 180);
        link.append(heading, excerpt); item.append(link); results.append(item);
      });
      status.textContent = matches.length ? matches.length + " matching pages" : "No matching pages in this language";
    }).catch(function () {
      if (request === revision) status.textContent = "Search could not load. Please try again.";
    });
  }
  input.addEventListener("input", function () { ++revision; clearTimeout(timer); timer = setTimeout(run, 120); });
  input.addEventListener("focus", function () { document.getElementById("__search").checked = true; });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { document.getElementById("__search").checked = false; input.blur(); }
    if (event.key === "ArrowDown" && results.querySelector("a")) { event.preventDefault(); results.querySelector("a").focus(); }
  });
  form.addEventListener("submit", function (event) { event.preventDefault(); run(); });
  form.addEventListener("reset", function () { setTimeout(run, 0); });
})();
