// Pre-selects a language content-tab from a URL (`?lang=python` or `#python`)
// and remembers the choice across pages, so deep links from the per-language
// READMEs land on the right tab. Works with Material's `content.tabs.link`,
// which syncs same-labelled tabs across each page.
(function () {
  "use strict";

  var NAMES = {
    php: "PHP",
    js: "JavaScript",
    javascript: "JavaScript",
    node: "JavaScript",
    ts: "JavaScript",
    python: "Python",
    py: "Python",
    java: "Java",
  };
  var KEY = "cosmo-lang";

  function desiredLabel() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get("lang") || window.location.hash.replace(/^#/, "")).toLowerCase();
    if (NAMES[q]) return NAMES[q];
    return sessionStorage.getItem(KEY);
  }

  function apply(label) {
    if (!label) return;
    document.querySelectorAll(".tabbed-set .tabbed-labels > label").forEach(function (el) {
      if (el.textContent.trim() !== label) return;
      var input = document.getElementById(el.getAttribute("for"));
      if (input && !input.checked) el.click();
    });
  }

  function remember() {
    document.querySelectorAll(".tabbed-set .tabbed-labels > label").forEach(function (el) {
      el.addEventListener("click", function () {
        var t = el.textContent.trim();
        for (var k in NAMES) {
          if (NAMES[k] === t) {
            sessionStorage.setItem(KEY, t);
            break;
          }
        }
      });
    });
  }

  function init() {
    var label = desiredLabel();
    apply(label);
    if (label) sessionStorage.setItem(KEY, label);
    remember();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();