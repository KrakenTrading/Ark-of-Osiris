/* Ark of Osiris — client side of the shared plan. Plain JS, attaches to window.OLCloud.
   Talks to the Netlify function at /.netlify/functions/plan.
   Degrades gracefully: if there's no function (opened locally / in preview), every call
   reports "unavailable" and the app falls back to local-only mode. */
(function () {
  const ENDPOINT = "/.netlify/functions/plan";
  let available = null; // null = unknown, true = live backend, false = no backend

  async function get() {
    try {
      const res = await fetch(ENDPOINT, { method: "GET", headers: { "Accept": "application/json" } });
      if (!res.ok) { available = res.status === 404 ? false : available; return null; }
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) { available = false; return null; }
      const data = await res.json();
      available = true;
      return data && data.plan ? { plan: data.plan, savedAt: data.savedAt || null } : null;
    } catch (e) {
      available = false;
      return null;
    }
  }

  async function verify(password) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", password }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) { available = false; return { ok: false, offline: true }; }
      available = true;
      if (res.status === 401) return { ok: false };
      const d = await res.json().catch(() => ({}));
      return { ok: !!d.ok };
    } catch (e) {
      available = false;
      return { ok: false, offline: true };
    }
  }

  async function publish(password, plan) {
    const res = await fetch(ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish", password, plan }),
    });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) { available = false; const e = new Error("offline"); e.offline = true; throw e; }
    available = true;
    if (res.status === 401) throw new Error("Wrong organiser password");
    if (!res.ok) throw new Error("Publish failed (" + res.status + ")");
    return res.json();
  }

  function isAvailable() { return available; }

  window.OLCloud = { ENDPOINT, get, verify, publish, isAvailable };
})();
