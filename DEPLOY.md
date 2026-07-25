# Ark of Osiris — Battle Plan (deploy guide)

One site, **multiple kingdoms**. Each kingdom has its own battle plan, completely isolated:
a visitor can't even see a kingdom's plan without that kingdom's **view password**, and only
someone with that kingdom's **edit (organiser) password** can change and publish it.

## How it works
- Visitors land on a **kingdom picker**, choose their kingdom, and enter the **view password**
  to see that kingdom's plan (Battle Board / Teleport / Roster / Map / Legend). The site
  remembers them on that device so they don't re-type it every time.
- An organiser clicks **⚿ Organiser** (top-right), enters that kingdom's **edit password**, and
  the **⚙ Manage** tab unlocks. After editing they click **Publish changes** → it pushes live
  for everyone in *that* kingdom only.
- Each kingdom's plan is stored separately on the server (Netlify Blobs), keyed by kingdom id.
- The **Switch** chip (top-left) returns to the picker to open a different kingdom.

## Setting up your kingdoms — self-service, no redeploy
Go to **`/admin.html`** on your deployed site and sign in with the admin ("god mode") password.
From there you can **add, rename, and delete kingdoms and their view/organiser passwords live** —
no code edits, no redeploy. This is what you use to sell/onboard new kingdoms going forward.

**Set the admin password once:** Netlify → **Site configuration → Environment variables → Add**
- Key: `OL_ADMIN_PASSWORD`
- Value: a strong password only you know

Redeploy once after setting it (env vars need a deploy to take effect). Until you set it, admin
falls back to a placeholder password (`change-me-god-mode`) baked into `plan.mjs` — set your own
before sharing the site publicly.

`netlify/functions/plan.mjs`'s `KINGDOMS_FALLBACK` list is now just **seed data** used the very
first time the store is empty — after that the admin panel's changes are the source of truth,
stored in Netlify Blobs. (An `OL_KINGDOMS` env var, if set, still overrides everything and locks
the admin panel to read-only — only use that if you want kingdoms fixed in an env var instead.)

> Each new kingdom starts with no plan; sign in as its organiser (its edit password) in **Manage**
> and **Publish** to populate it. Plans are fully isolated per kingdom from that point on.

## Deploy to Netlify (recommended: from Git)
1. Put this whole folder in a GitHub repo (or GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
3. Build settings: **no build command**, **publish directory = `.`** (already set in `netlify.toml`). Deploy.
4. Set `OL_ADMIN_PASSWORD` (see above), redeploy once, then go to `/admin.html` to add your kingdoms.
5. Open the site, pick a kingdom, enter its view password. Organisers: **⚿ Organiser** → edit
   password → **Manage** → **Publish**.

> Netlify installs `@netlify/blobs` automatically from `package.json` on a Git deploy.
> Manual drag-and-drop deploys do **not** run install, so use the Git flow for publishing to work.

## Sharing a direct kingdom link
You can link straight to a kingdom (skips picking, still asks for the password):
`https://your-site.netlify.app/?k=k1` — replace `k1` with the kingdom's id.

## Files
- `index.html` — the app (also available as `Battle Plan.html`)
- `admin.html` — god-mode kingdom admin (create/edit/delete kingdoms live)
- `assets/` — app code (data, store, cloud client, gate/picker, admin panel, React components)
- `netlify/functions/plan.mjs` — GET (kingdom list) / POST view + verify + publish + admin-* actions
- `netlify.toml`, `package.json` — Netlify config + the one dependency

## Notes
- Opened locally (file://) or anywhere without the function, the app runs in **local preview**
  mode: the picker still shows, passwords aren't checked, and edits save only to that browser.
- Each visitor's browser keeps a per-kingdom local cache, so the board paints instantly before
  the live plan loads.
- The `deploy/`, `site/`, `github-update/`, `uploads/` folders are older one-file snapshots —
  the live source is the root (`index.html` + `assets/` + `netlify/`). Redeploy from the root.
