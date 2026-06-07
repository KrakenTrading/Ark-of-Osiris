import { getStore } from "@netlify/blobs";

const PASSWORD = process.env.OL_EDIT_PASSWORD || "osiris";
const STORE = "ark-of-osiris";
const KEY = "current";

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
    try {
      const data = await store.get(KEY, { type: "json" });
      if (!data) return json({ ok: true, plan: null, savedAt: null });
      if (data.plan) return json({ ok: true, plan: data.plan, savedAt: data.savedAt || null });
      return json({ ok: true, plan: data, savedAt: null });
    } catch (e) {
      return json({ ok: true, plan: null, savedAt: null });
    }
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch (e) { return json({ ok: false, error: "bad-json" }, 400); }
    if (!body || body.password !== PASSWORD) return json({ ok: false, error: "unauthorized" }, 401);
    if (body.action === "verify") return json({ ok: true });
    if (body.action === "publish") {
      if (!body.plan || typeof body.plan !== "object") return json({ ok: false, error: "no-plan" }, 400);
      const savedAt = Date.now();
      await store.setJSON(KEY, { plan: body.plan, savedAt });
      return json({ ok: true, savedAt });
    }
    return json({ ok: false, error: "unknown-action" }, 400);
  }
  return json({ ok: false, error: "method-not-allowed" }, 405);
};
