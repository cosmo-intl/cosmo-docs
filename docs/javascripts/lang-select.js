// Page URLs identify the language. Storage is only a convenience for legacy links.
(function () {
  "use strict";
  var aliases = {js: "javascript", node: "javascript", ts: "javascript", py: "python", cs: "csharp", dotnet: "csharp"};
  var languages = ["javascript", "php", "python", "java", "csharp"];
  var labels = {JavaScript: "javascript", PHP: "php", Python: "python", Java: "java", "C#": "csharp"};
  function normalise(value) {
    value = labels[value] || (value || "").toLowerCase();
    return aliases[value] || (languages.indexOf(value) !== -1 ? value : null);
  }
  function stored() {
    try { return normalise(localStorage.getItem("cosmo-lang") || sessionStorage.getItem("cosmo-lang")); }
    catch (_) { return null; }
  }
  function remember(language) {
    try { localStorage.setItem("cosmo-lang", language); } catch (_) { /* Storage may be disabled. */ }
  }
  var picker = document.querySelector(".doc-languages");
  if (!picker) return;
  var url = new URL(window.location.href);
  var requested = normalise(url.searchParams.get("lang")) || normalise(url.hash.slice(1));
  var current = picker.dataset.docLanguage;
  var shared = picker.dataset.docShared === "true";
  var legacy = picker.dataset.docLegacy === "true";
  var select = picker.querySelector('select');
  var isHome = picker.dataset.docSource === "index.md";
  var homeLanguage = requested || (/\/(javascript|php|python|java|csharp)\/$/.test(url.pathname) ? current : null);
  var startButton = document.querySelector("[data-get-started]");
  if (isHome && !homeLanguage) {
    select.value = "";
    select.addEventListener("change", function () {
      url.searchParams.set("lang", select.options[select.selectedIndex].dataset.language);
      window.location.assign(url.href);
    });
    if (startButton) startButton.addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("choose-language").showModal();
    });
    return;
  }
  var desired = isHome ? homeLanguage : requested || ((legacy || shared) ? stored() : null) || current;
  var option = picker.querySelector('[data-language="' + desired + '"]');
  if (!shared && option && (legacy || desired !== current)) {
    var target = new URL(option.value, location.href);
    target.search = url.search;
    target.searchParams.delete("lang");
    if (!normalise(url.hash.slice(1))) target.hash = url.hash;
    window.location.replace(target.href);
    return;
  }
  if (option) select.value = option.value;
  if (isHome && startButton && option) startButton.href = option.value;
  document.documentElement.dataset.docLanguage = desired;
  var repositories = {
    javascript: "cosmo-intl/cosmo-js",
    php: "salarmehr/cosmopolitan",
    python: "cosmo-intl/cosmo-python",
    java: "cosmo-intl/cosmo-java",
    csharp: "cosmo-intl/cosmo-csharp"
  };
  document.querySelectorAll("[data-language-repository]").forEach(function (el) {
    var repository = repositories[desired];
    el.href = "https://github.com/" + repository;
    el.title = "View " + repository + " on GitHub";
    el.querySelector(".md-source__repository").textContent = repository.split("/").pop();
  });
  var apiUrls = {
    javascript: "https://cosmo-intl.github.io/cosmo-js/",
    php: "https://salarmehr.github.io/cosmopolitan/",
    python: "https://cosmo-intl.github.io/cosmo-python/",
    java: "https://cosmo-intl.github.io/cosmo-java/",
    csharp: "https://cosmo-intl.github.io/cosmo-csharp/"
  };
  document.querySelectorAll("[data-api-reference]").forEach(function (el) {
    el.href = apiUrls[desired];
  });
  if (shared) {
    var missing = {
      javascript: ["transliteration-parsing", "negotiation-names"],
      php: ["negotiation-names", "playground"],
      python: ["playground"], java: ["playground"],
      csharp: ["negotiation-names", "playground"]
    };
    document.querySelectorAll(".md-nav a, .md-footer a:not([data-footer-language])").forEach(function (el) {
      var target = new URL(el.href);
      if (target.origin !== location.origin) return;
      target.pathname = target.pathname.replace(/\/(javascript|php|python|java|csharp)\//, "/" + desired + "/");
      el.href = target.href;
      if (missing[desired].some(function (name) { return target.pathname.includes("/" + name + "/"); })) {
        var item = el.closest("li") || el;
        item.hidden = true;
      }
    });
  }
  document.querySelectorAll("[data-footer-language]").forEach(function (el) {
    el.hidden = el.dataset.footerLanguage === desired;
  });
  remember(desired);
  select.addEventListener("change", function () {
    var selected = select.options[select.selectedIndex];
    remember(selected.dataset.language);
    if (isHome) {
      url.searchParams.set("lang", selected.dataset.language);
      window.location.assign(url.href);
    } else {
      window.location.assign(new URL(selected.value, location.href).href);
    }
  });
})();
