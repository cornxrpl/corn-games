/* shared/hub.js — CORN Games Hub: session-only scoring + navigation.
 *
 * Olden-days rules: NO saved high scores, NO database, NO persistence of any
 * kind. Scores live in sessionStorage, which the browser clears when the tab
 * closes. Reloading any hub page wipes all session scores.
 */
(function () {
  "use strict";

  var KEY = "cornHub.sessionScores.v1";

  function readScores() {
    try {
      var raw = window.sessionStorage.getItem(KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function writeScores(scores) {
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(scores));
    } catch (e) {
      /* Storage unavailable: scores just do not persist. */
    }
  }

  function pageWasReloaded() {
    try {
      var nav = performance.getEntriesByType("navigation")[0];
      return !!(nav && nav.type === "reload");
    } catch (e) {
      return false;
    }
  }

  /* Reloading any hub page resets all scores. */
  if (pageWasReloaded()) {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch (e) {}
  }

  function fillMenuSlots() {
    var slots = document.querySelectorAll("[data-hub-score]");
    if (!slots.length) return;
    var scores = readScores();
    slots.forEach(function (el) {
      var id = el.getAttribute("data-hub-score");
      var best = typeof scores[id] === "number" ? scores[id] : null;
      el.textContent = best === null ? "Session best: —" : "Session best: " + best;
    });
  }

  var Hub = {
    /* Record a run's score. Keeps only the session best per game. */
    submitScore: function (gameId, score) {
      var n = Number(score);
      if (!isFinite(n)) return;
      var scores = readScores();
      if (typeof scores[gameId] !== "number" || n > scores[gameId]) {
        scores[gameId] = n;
        writeScores(scores);
      }
    },

    getBest: function (gameId) {
      var scores = readScores();
      return typeof scores[gameId] === "number" ? scores[gameId] : null;
    },

    /* Render the back bar at the top of a game page. Fixed overlay: it never
       reflows the game. The bar itself ignores pointer events except for the
       Back button, so it cannot block game input. */
    menuButton: function (label) {
      function insert() {
        if (!document.body || document.getElementById("hub-back-bar")) return;
        var bar = document.createElement("div");
        bar.id = "hub-back-bar";
        bar.setAttribute(
          "style",
          [
            "position:fixed",
            "top:0",
            "left:0",
            "right:0",
            "z-index:2147483647",
            "display:flex",
            "align-items:center",
            "gap:12px",
            "height:38px",
            "padding:0 12px",
            "box-sizing:border-box",
            "background:rgba(5,20,5,0.72)",
            "pointer-events:none",
            "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
          ].join(";")
        );
        var back = document.createElement("a");
        back.href = "./index.html";
        back.textContent = "← Back to menu";
        back.setAttribute(
          "style",
          [
            "pointer-events:auto",
            "background:#ffe600",
            "color:#0a1f0a",
            "font-weight:700",
            "font-size:14px",
            "text-decoration:none",
            "padding:6px 12px",
            "border-radius:999px",
            "white-space:nowrap",
          ].join(";")
        );
        var title = document.createElement("span");
        title.textContent = label || document.title || "";
        title.setAttribute(
          "style",
          [
            "flex:1",
            "text-align:center",
            "color:#fff",
            "font-size:14px",
            "font-weight:600",
            "white-space:nowrap",
            "overflow:hidden",
            "text-overflow:ellipsis",
            "text-shadow:0 1px 2px rgba(0,0,0,0.6)",
          ].join(";")
        );
        var spacer = document.createElement("span");
        spacer.setAttribute("style", "width:110px;flex:none;");
        bar.appendChild(back);
        bar.appendChild(title);
        bar.appendChild(spacer);
        document.body.insertBefore(bar, document.body.firstChild);
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", insert);
      } else {
        insert();
      }
    },
  };

  window.Hub = Hub;

  /* Menu pages: fill score slots on load and on back/forward restore. */
  document.addEventListener("DOMContentLoaded", fillMenuSlots);
  window.addEventListener("pageshow", fillMenuSlots);
})();
