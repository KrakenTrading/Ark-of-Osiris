/* Ark of Osiris — multi-kingdom plan store. Netlify Function (v2).
   Persists ONE plan PER KINGDOM in Netlify Blobs. Each kingdom has two passwords:
     • view — members type this to SEE that kingdom's plan
     • edit — an organiser types this to EDIT & publish that kingdom's plan
   A kingdom's plan is completely isolated: you can't see it without its view password.

   SELF-SERVICE KINGDOMS (no redeploy needed)
   The kingdom list now lives in Netlify Blobs — add/edit/remove kingdoms live
   from /admin.html, no redeploy needed.
   • Sign in to /admin.html with OL_ADMIN_PASSWORD (set in Netlify env vars, redeploy once).
   • KINGDOMS_FALLBACK below is just SEED data used the first time the store is empty.
   • OL_KINGDOMS env var, if set, overrides everything and locks the admin panel read-only. */

import { getStore } from "@netlify/blobs";

const KINGDOMS_FALLBACK = [
  { id: "2924", name: "Kingdom 2924", view: "view-2924", edit: "edit-2924" },
  { id: "3793", name: "Kingdom 3793", view: "view-3793", edit: "edit-3793" },
];

const ADMIN_PASSWORD_FALLBACK = "change-me-god-mode";

const STORE = "ark-of-osiris";
const KINGDOMS_KEY = "kingdoms:list";
const keyFor = (id) => "plan:" + id;

function adminPassword() {
  return process.env.OL_ADMIN_PASSWORD || ADMIN_PASSWORD_FALLBACK;
}

async function loadKingdoms(store) {
  const raw = process.env.OL_KINGDOMS;
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    } catch (e) { /* fall through */ }
  }
  let list = await store.get(KINGDOMS_KEY, { type: "json" });
  if (!Array.isArray(list) || !list.length) {
    list = KINGDOMS_FALLBACK;
    await store.setJSON(KINGDOMS_KEY, list);
  }
  return list;
}
async function saveKingdoms(store, list) {
  await store.setJSON(KINGDOMS_KEY, list);
}
function findKingdom(list, id) {
  return list.find((k) => String(k.id) === String(id)) || null;
}
function publicList(list) {
  return list.map((k) => ({ id: k.id, name: k.name }));
}
function slugify(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "k";
}
function uniqueId(base, list) {
  let id = base, n = 2;
  while (findKingdom(list, id)) { id = base + "-" + n; n++; }
  return id;
}
function genPw() { return Math.random().toString(36).slice(2, 8); }

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: HEADERS });

export default async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: HEADERS });

  const store = getStore(STORE);

  if (req.method === "GET") {
    const list = await loadKingdoms(store);
    return json({ ok: true, kingdoms: publicList(list) });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch (e) { return json({ ok: false, error: "bad-json" }, 400); }
    if (!body || typeof body !== "object") return json({ ok: false, error: "bad-json" }, 400);

    if (typeof body.action === "string" && body.action.startsWith("admin-")) {
      if (body.password !== adminPassword()) return json({ ok: false, error: "unauthorized" }, 401);
      const envLocked = !!process.env.OL_KINGDOMS;
      let list = await loadKingdoms(store);

      if (body.action === "admin-list") {
        return json({ ok: true, kingdoms: list, envLocked });
      }
      if (envLocked) return json({ ok: false, error: "env-locked" }, 400);

      if (body.action === "admin-create") {
        const name = String(body.name || "").trim();
        if (!name) return json({ ok: false, error: "no-name" }, 400);
        const id = uniqueId(slugify(body.id || name), list);
        const view = String(body.view || "").trim() || genPw();
        const edit = String(body.edit || "").trim() || genPw();
        const k = { id, name, view, edit };
        list.push(k);
        await saveKingdoms(store, list);
        return json({ ok: true, kingdom: k, kingdoms: list });
      }
      if (body.action === "admin-update") {
        const k = findKingdom(list, body.id);
        if (!k) return json({ ok: false, error: "no-kingdom" }, 404);
        if (typeof body.name === "string" && body.name.trim()) k.name = body.name.trim();
        if (typeof body.view === "string" && body.view.trim()) k.view = body.view.trim();
        if (typeof body.edit === "string" && body.edit.trim()) k.edit = body.edit.trim();
        await saveKingdoms(store, list);
        return json({ ok: true, kingdom: k, kingdoms: list });
      }
      if (body.action === "admin-delete") {
        const idx = list.findIndex((k) => String(k.id) === String(body.id));
        if (idx === -1) return json({ ok: false, error: "no-kingdom" }, 404);
        list.splice(idx, 1);
        await saveKingdoms(store, list);
        try { await store.delete(keyFor(body.id)); } catch (e) { /* ignore */ }
        return json({ ok: true, kingdoms: list });
      }
      return json({ ok: false, error: "unknown-admin-action" }, 400);
    }

    const list = await loadKingdoms(store);
    const k = findKingdom(list, body.kingdom);
    if (!k) return json({ ok: false, error: "no-kingdom" }, 404);

    const pw = body.password;

    if (body.action === "view") {
      if (pw !== k.view && pw !== k.edit) return json({ ok: false, error: "unauthorized" }, 401);
      try {
        const data = await store.get(keyFor(k.id), { type: "json" });
        if (!data) return json({ ok: true, plan: null, savedAt: null });
        if (data.plan) return json({ ok: true, plan: data.plan, savedAt: data.savedAt || null });
        return json({ ok: true, plan: data, savedAt: null });
      } catch (e) {
        return json({ ok: true, plan: null, savedAt: null });
      }
    }

    if (body.action === "verify") {
      if (pw !== k.edit) return json({ ok: false, error: "unauthorized" }, 401);
      return json({ ok: true });
    }

    if (body.action === "publish") {
      if (pw !== k.edit) return json({ ok: false, error: "unauthorized" }, 401);
      if (!body.plan || typeof body.plan !== "object") return json({ ok: false, error: "no-plan" }, 400);
      const savedAt = Date.now();
      await store.setJSON(keyFor(k.id), { plan: body.plan, savedAt });
      return json({ ok: true, savedAt });
    }

    return json({ ok: false, error: "unknown-action" }, 400);
  }

  return json({ ok: false, error: "method-not-allowed" }, 405);
};
