# Ark of Osiris — Battle Plan (deploy guide)

A shared weekly battle plan for the OL alliance. Everyone who opens the site sees the
**same live plan**. Only someone with the **organiser password** can edit and publish it.

## How it works
- The plan is stored on the server (Netlify Blobs) by one small function: `netlify/functions/plan.mjs`.
- Visitors get a clean, read-only view (Battle Board / Teleport / Roster / Map / Legend).
- An organiser clicks **⚿ Organiser** (top-right), enters the password, and the **⚙ Manage** tab unlocks.
- After editing, they click **Publish changes** → it pushes live for everyone.

## Deploy to Netlify (recommended: from Git)
1. Put this whole folder in a GitHub repo (or GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
3. Build settings: **no build command**, **publish directory = `.`** (already set in `netlify.toml`). Deploy.
4. Set the organiser password: **Site configuration → Environment variables → Add**:
   - Key: `OL_EDIT_PASSWORD`
   - Value: *your secret password*
   Then **Deploys → Trigger deploy → Deploy site** so it takes effect.
5. Open the site, click **⚿ Organiser**, enter the password, edit in **Manage**, and **Publish**.

> Netlify installs `@netlify/blobs` automatically from `package.json` on a Git deploy.
> Manual drag-and-drop deploys do **not** run install, so use the Git flow above for the
> publish feature to work. (Drag-and-drop still works for a view-only copy.)

## Changing the password
Either update the `OL_EDIT_PASSWORD` environment variable in Netlify (then redeploy),
or edit the fallback constant near the top of `netlify/functions/plan.mjs`.

## Files
- `index.html` — the app (also available as `Battle Plan.html`)
- `assets/` — app code (data, store, cloud client, React components)
- `netlify/functions/plan.mjs` — GET (read plan) / POST publish + verify (password-gated)
- `netlify.toml`, `package.json` — Netlify config + the one dependency

## Notes
- Opened locally (file://) or anywhere without the function, the app runs in **Local only**
  mode: fully usable, but edits save just to that browser and there's no Publish.
- Each visitor's browser also keeps a local cache, so the board paints instantly before the
  live plan loads.
