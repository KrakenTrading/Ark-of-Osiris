/* OL · Ark of Osiris — admin (god mode). Manage kingdoms live, no redeploy.
   Password-gated by OL_ADMIN_PASSWORD (server-side). Babel JSX. */
const { useState: useA, useEffect: useAE, useRef: useAR } = React;

function AdminApp() {
  const [pw, setPw] = useA("");
  const [authed, setAuthed] = useA(false);
  const [busy, setBusy] = useA(false);
  const [err, setErr] = useA("");
  const [kingdoms, setKingdoms] = useA([]);
  const [envLocked, setEnvLocked] = useA(false);
  const [offline, setOffline] = useA(false);
  const [draft, setDraft] = useA({ id: "", name: "", view: "", edit: "" });
  const [showPw, setShowPw] = useA({});

  const load = async (password) => {
    setBusy(true); setErr("");
    const r = await window.OLCloud.adminList(password);
    setBusy(false);
    if (r.offline) { setOffline(true); setErr("No server reachable — deploy to Netlify to use admin."); return; }
    if (!r.ok) { setErr("Wrong admin password."); return; }
    setAuthed(true); setKingdoms(r.kingdoms); setEnvLocked(r.envLocked);
    try { localStorage.setItem("ol_admin_pw", password); } catch (e) {}
  };

  useAE(() => {
    let saved = "";
    try { saved = localStorage.getItem("ol_admin_pw") || ""; } catch (e) {}
    if (saved) { setPw(saved); load(saved); }
  }, []);

  const patchLocal = (id, field, val) => {
    setKingdoms((ks) => ks.map((k) => (String(k.id) === String(id) ? { ...k, [field]: val } : k)));
  };

  const saveKingdom = async (k) => {
    setBusy(true); setErr("");
    try {
      await window.OLCloud.adminUpdate(pw, k);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const removeKingdom = async (id, name) => {
    if (!confirm('Delete "' + name + '"? Its plan data will be removed too. This cannot be undone.')) return;
    setBusy(true); setErr("");
    try {
      const r = await window.OLCloud.adminDelete(pw, id);
      setKingdoms(r.kingdoms);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const createKingdom = async () => {
    if (!draft.name.trim()) { setErr("Give the new kingdom a name."); return; }
    setBusy(true); setErr("");
    try {
      const r = await window.OLCloud.adminCreate(pw, draft);
      setKingdoms(r.kingdoms);
      setDraft({ id: "", name: "", view: "", edit: "" });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const toggleShow = (id) => setShowPw((s) => ({ ...s, [id]: !s[id] }));

  if (!authed) {
    return (
      <div className="ga-veil">
        <div className="ga-card">
          <h2 className="ga-title">God Mode</h2>
          <p className="ga-sub">Admin access — manage every kingdom on this site.</p>
          {offline && <div className="ga-offline">No server reachable. Admin only works once deployed to Netlify.</div>}
          <input
            type="password" className="ga-input" placeholder="Admin password" value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") load(pw); }}
          />
          <button className="ga-btn ga-btn-primary" disabled={busy} onClick={() => load(pw)}>
            {busy ? "Checking…" : "Enter"}
          </button>
          {err && <div className="ga-err">{err}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="ga-wrap">
      <header className="ga-head">
        <div>
          <h1 className="ga-h1">Kingdom admin</h1>
          <p className="ga-sub">Create, edit and remove kingdoms — live, no redeploy.</p>
        </div>
        <a className="ga-link" href="index.html">← Back to site</a>
      </header>

      {envLocked && (
        <div className="ga-banner">
          <b>OL_KINGDOMS env var is set</b> — it overrides the self-service list below. Remove that
          environment variable in Netlify to manage kingdoms from here instead.
        </div>
      )}
      {err && <div className="ga-err ga-err-block">{err}</div>}

      <div className="ga-table-wrap">
        <table className="ga-table">
          <thead>
            <tr><th>Name</th><th>ID / link</th><th>View password</th><th>Organiser password</th><th></th></tr>
          </thead>
          <tbody>
            {kingdoms.map((k) => (
              <tr key={k.id}>
                <td><input className="ga-cell" value={k.name} disabled={envLocked}
                  onChange={(e) => patchLocal(k.id, "name", e.target.value)}
                  onBlur={() => saveKingdom(k)} /></td>
                <td>
                  <code className="ga-id">{k.id}</code>
                  <a className="ga-copylink" href={"index.html?k=" + encodeURIComponent(k.id)} target="_blank" rel="noreferrer">open ↗</a>
                </td>
                <td className="ga-pwcell">
                  <input className="ga-cell" type={showPw[k.id] ? "text" : "password"} value={k.view} disabled={envLocked}
                    onChange={(e) => patchLocal(k.id, "view", e.target.value)}
                    onBlur={() => saveKingdom(k)} />
                </td>
                <td className="ga-pwcell">
                  <input className="ga-cell" type={showPw[k.id] ? "text" : "password"} value={k.edit} disabled={envLocked}
                    onChange={(e) => patchLocal(k.id, "edit", e.target.value)}
                    onBlur={() => saveKingdom(k)} />
                </td>
                <td className="ga-actions">
                  <button className="ga-icon" title="Show/hide passwords" onClick={() => toggleShow(k.id)}>{showPw[k.id] ? "🙈" : "👁"}</button>
                  {!envLocked && <button className="ga-icon ga-danger" title="Delete kingdom" onClick={() => removeKingdom(k.id, k.name)}>✕</button>}
                </td>
              </tr>
            ))}
            {kingdoms.length === 0 && <tr><td colSpan={5} className="ga-empty">No kingdoms yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {!envLocked && (
        <div className="ga-new">
          <h3 className="ga-h3">Add a new kingdom</h3>
          <div className="ga-new-row">
            <input className="ga-input sm" placeholder="Kingdom name (e.g. 4108)" value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <input className="ga-input sm" placeholder="View password (blank = random)" value={draft.view}
              onChange={(e) => setDraft({ ...draft, view: e.target.value })} />
            <input className="ga-input sm" placeholder="Organiser password (blank = random)" value={draft.edit}
              onChange={(e) => setDraft({ ...draft, edit: e.target.value })} />
            <button className="ga-btn ga-btn-primary" disabled={busy} onClick={createKingdom}>+ Create</button>
          </div>
          <p className="ga-hint">Leave a password blank to auto-generate one — it'll show in the table above once created.</p>
        </div>
      )}

      <p className="ga-foot">Share <code>index.html?k=&lt;id&gt;</code> to deep-link a kingdom straight to its picker entry.
      Keep this admin password secret — anyone with it can see and edit every kingdom's passwords.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
