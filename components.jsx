/* Ark of Osiris — client side of the shared, per-kingdom plan. Attaches to window.OLCloud.
   Talks to the Netlify function at /.netlify/functions/plan.
   Every kingdom is isolated by its own view + edit passwords (checked server-side).
   Degrades gracefully: with no function reachable (opened locally / in preview), calls
   report "offline" and the app falls back to a local-only preview. */
(function () {
  const ENDPOINT = "/.netlify/functions/plan";
  let available = null; // null = unknown, true = live backend, false = no backend

  // Public list of kingdoms (names only) for the picker. null = offline.
  async function listKingdoms() {
    try {
      const res = await fetch(ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) { available = false; return null; }
      const d = await res.json();
      available = true;
      return Array.isArray(d.kingdoms) ? d.kingdoms : [];
    } catch (e) {
      available = false;
      return null;
    }
  }

  async function post(payload) {
    const res = await fetch(ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) { available = false; const e = new Error("offline"); e.offline = true; throw e; }
    available = true;
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  // Unlock + fetch a kingdom's plan with a view (or edit) password.
  async function view(kingdom, password) {
    try {
      const { status, data } = await post({ action: "view", kingdom, password });
      if (status === 404) return { ok: false, noKingdom: true };
      if (status === 401) return { ok: false };
      return { ok: !!data.ok, plan: data.plan || null, savedAt: data.savedAt || null };
    } catch (e) {
      return { ok: false, offline: true };
    }
  }

  // Verify an organiser (edit) password for a kingdom.
  async function verify(kingdom, password) {
    try {
      const { status, data } = await post({ action: "verify", kingdom, password });
      if (status === 401) return { ok: false };
      if (status === 404) return { ok: false, noKingdom: true };
      return { ok: !!data.ok };
    } catch (e) {
      return { ok: false, offline: true };
    }
  }

  // Publish a new plan for a kingdom (requires the edit password).
  async function publish(kingdom, password, plan) {
    const { status, data } = await post({ action: "publish", kingdom, password, plan });
    if (status === 401) throw new Error("Wrong organiser password");
    if (status === 404) throw new Error("Unknown kingdom");
    if (status >= 400) throw new Error("Publish failed (" + status + ")");
    return data;
  }

  function isAvailable() { return available; }

  // ---- admin (god mode): manage the kingdom list itself, no redeploy needed ----
  async function adminList(password) {
    try {
      const { status, data } = await post({ action: "admin-list", password });
      if (status === 401) return { ok: false };
      return { ok: !!data.ok, kingdoms: data.kingdoms || [], envLocked: !!data.envLocked };
    } catch (e) {
      return { ok: false, offline: true };
    }
  }
  async function adminCreate(password, k) {
    const { status, data } = await post({ action: "admin-create", password, ...k });
    if (status === 401) throw new Error("Wrong admin password");
    if (status >= 400) throw new Error(data.error || "Create failed");
    return data;
  }
  async function adminUpdate(password, k) {
    const { status, data } = await post({ action: "admin-update", password, ...k });
    if (status === 401) throw new Error("Wrong admin password");
    if (status >= 400) throw new Error(data.error || "Update failed");
    return data;
  }
  async function adminDelete(password, id) {
    const { status, data } = await post({ action: "admin-delete", password, id });
    if (status === 401) throw new Error("Wrong admin password");
    if (status >= 400) throw new Error(data.error || "Delete failed");
    return data;
  }

  window.OLCloud = {
    ENDPOINT, listKingdoms, view, verify, publish, isAvailable,
    adminList, adminCreate, adminUpdate, adminDelete,
  };
})();
