// NTRN Tech theme switcher for the blog hosting trial.
// Load it in <head> (not deferred) so the stored theme applies before first paint.
// Contract for sites:
//   - <html data-theme="nostromo|graphite|warehouse|squall|paper">: the NTRN Tech theme (tokens.css keys on it).
//   - <html saved-theme="dark|light">: light/dark mode derived from the theme (Quartz keys code highlighting on it).
//   - <html data-ntrn-mode="dark|light">: same mode, for sites whose own CSS needs a non-Quartz hook.
//   - any <select data-ntrn-theme> on the page becomes the switcher (options filled in if empty).
//   - ?theme=<name> in the URL selects and stores a theme (shareable previews, headless screenshots).
//   - fires document "themechange" ({detail: {theme: mode}}, Quartz convention) and retunes a giscus iframe.
(function () {
  var KEY = "ntrn-theme";
  var THEMES = ["nostromo", "graphite", "warehouse", "squall", "paper"];
  var LIGHT = { paper: true };

  function stored() {
    try {
      var q = new URLSearchParams(location.search).get("theme");
      if (THEMES.indexOf(q) >= 0) localStorage.setItem(KEY, q);
      var t = localStorage.getItem(KEY);
      return THEMES.indexOf(t) >= 0 ? t : THEMES[0];
    } catch (e) {
      return THEMES[0];
    }
  }

  function mode(theme) {
    return LIGHT[theme] ? "light" : "dark";
  }

  function giscusTheme(theme) {
    return LIGHT[theme] ? "noborder_light" : "noborder_dark";
  }

  function apply(theme, announce) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("saved-theme", mode(theme));
    root.setAttribute("data-ntrn-mode", mode(theme));
    if (!announce) return;
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: mode(theme) } }));
    var frame = document.querySelector("iframe.giscus-frame");
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme(theme) } } }, "https://giscus.app");
    }
  }

  function bind() {
    var current = stored();
    apply(current, false);
    var selects = document.querySelectorAll("select[data-ntrn-theme]");
    for (var i = 0; i < selects.length; i++) {
      var sel = selects[i];
      if (!sel.options.length) {
        for (var j = 0; j < THEMES.length; j++) sel.add(new Option(THEMES[j], THEMES[j]));
      }
      sel.value = current;
      if (sel.getAttribute("data-ntrn-bound")) continue;
      sel.setAttribute("data-ntrn-bound", "1");
      sel.addEventListener("change", function (ev) {
        var t = ev.target.value;
        try {
          localStorage.setItem(KEY, t);
        } catch (e) {}
        apply(t, true);
      });
    }
  }

  window.NTRNTrial = { themes: THEMES, current: stored, mode: mode, giscusTheme: giscusTheme };
  apply(stored(), false);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
  document.addEventListener("nav", bind); // Quartz SPA navigation re-renders the page body
})();
