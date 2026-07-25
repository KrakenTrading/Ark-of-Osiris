/* Ark of Osiris — plan store. Plain JS, attaches to window.OLStore.
   The static taxonomy (LANES / OBJ / ROLE) lives in data.js as window.BP.
   The *editable* plan (slots / roster / anubis / meta) is persisted here.

   MULTI-KINGDOM: every browser key is namespaced by the active kingdom id
   (window.OLSession.id), so each kingdom keeps its own local copy, published
   snapshot and organiser session. window.OLSession is set by the gate before
   the app mounts. */
(function () {
  let _n = 0;
  function uid(p) { return (p || "id") + Date.now().toString(36) + (_n++).toString(36); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // active kingdom id (falls back to "default" before the gate runs)
  function kid() {
    return (window.OLSession && window.OLSession.id) || "default";
  }

  // namespaced storage keys
  const PLAN_BASE = "ol_ark_plan_v3";
  const PUB_BASE  = "ol_ark_published_v3";
  const PW_BASE   = "ol_ark_org_pw";
  const planKey = () => PLAN_BASE + ":" + kid();
  const pubKey  = () => PUB_BASE + ":" + kid();
  const pwKey   = () => PW_BASE + ":" + kid();

  // Preset teleport drop options (5-min troop-spawn cadence from 47:40)
  const TP_WHEN = [
    "Immediately",
    "1st Spawn · 47:40",
    "2nd Spawn · 42:40",
    "3rd Spawn · 37:40",
    "4th Spawn · 32:40",
    "5th Spawn · 27:40",
    "6th Spawn · 22:40",
    "7th Spawn · 17:40",
    "8th Spawn · 12:40",
  ];

  function defaultPlan() {
    // Prefer the baked-in seed (the live published plan) when present.
    if (window.BP && window.BP.SEED_PLAN) {
      const p = clone(window.BP.SEED_PLAN);
      p.version = p.version || 2;
      p.slots.forEach((s) => {
        if (!s.uid) s.uid = uid("s");
        if (s.anubis == null) s.anubis = false;
        if (s.tile === undefined) s.tile = null;
        if (s.marker == null) s.marker = "";
      });
      p.roster.forEach((r) => { if (!r.uid) r.uid = uid("r"); });
      if (!p.meta) p.meta = { title: "Ark of Osiris", weekLabel: "", matchTimeUTC: "" };
      if (!p.anubis) p.anubis = clone(window.BP.ANUBIS);
      return p;
    }
    const slots = clone(window.BP.SLOTS).map((s) =>
      Object.assign({ uid: uid("s"), marker: "", anubis: false, tile: null }, s)
    );
    const roster = clone(window.BP.ROSTER).map((r) =>
      Object.assign({ uid: uid("r") }, r)
    );
    const anubis = clone(window.BP.ANUBIS);
    const meta = clone((window.BP && window.BP.META) || {
      title: "Ark of Osiris",
      weekLabel: "",
      matchTimeUTC: "", // datetime-local string, interpreted as UTC
    });
    return { version: 2, slots, roster, anubis, meta };
  }

  function migrate(p) {
    if (!p || !Array.isArray(p.slots) || !Array.isArray(p.roster)) return defaultPlan();
    // ensure every slot/roster row has a uid
    p.slots.forEach((s) => { if (!s.uid) s.uid = uid("s"); if (s.anubis == null) s.anubis = false; });
    p.roster.forEach((r) => { if (!r.uid) r.uid = uid("r"); });
    if (!p.meta) p.meta = { title: "Ark of Osiris", weekLabel: "", matchTimeUTC: "" };
    if (!p.anubis) p.anubis = clone(window.BP.ANUBIS);
    return p;
  }

  function loadPlan() {
    try {
      const raw = localStorage.getItem(planKey());
      if (!raw) return defaultPlan();
      return migrate(JSON.parse(raw));
    } catch (e) { return defaultPlan(); }
  }

  function savePlan(p) {
    try { localStorage.setItem(planKey(), JSON.stringify(p)); } catch (e) {}
  }

  // "publishedJSON" = a stringified snapshot of the plan last known to be live,
  // used to detect unpublished local edits (dirty state).
  function loadPub() { try { return localStorage.getItem(pubKey()) || ""; } catch (e) { return ""; } }
  function savePub(json) { try { localStorage.setItem(pubKey(), json || ""); } catch (e) {} }

  // organiser session (password kept for the tab session so Publish doesn't re-prompt)
  function loadPw() { try { return sessionStorage.getItem(pwKey()) || ""; } catch (e) { return ""; } }
  function savePw(pw) { try { if (pw) sessionStorage.setItem(pwKey(), pw); else sessionStorage.removeItem(pwKey()); } catch (e) {} }

  // remembered kingdom + view login, so members aren't re-prompted every visit
  const SESSION_KEY = "ol_ark_session_v1";
  function loadSession() {
    try { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }
  function saveSession(s) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // Parse a datetime-local string ("2026-06-14T14:00") as UTC → epoch ms (or null)
  function parseUTC(v) {
    if (!v) return null;
    let s = v.trim();
    if (s.length === 16) s += ":00"; // add seconds
    const ms = Date.parse(s + "Z");
    return isNaN(ms) ? null : ms;
  }

  window.OLStore = {
    uid, clone, defaultPlan, loadPlan, savePlan, parseUTC, TP_WHEN,
    loadPub, savePub, loadPw, savePw,
    loadSession, saveSession, clearSession,
  };
})();
