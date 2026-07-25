/* OL · Ark of Osiris — cloud / organiser UI. Babel JSX. Exports to window. */
const { useState: useCS, useEffect: useCE, useRef: useCR } = React;

/* live/offline pill shown in the header for everyone */
function CloudPill({ status }) {
  const map = {
    loading: ["loading", "Connecting…"],
    live: ["live", "Live plan"],
    empty: ["live", "Live · not published yet"],
    offline: ["offline", "Local only"],
  };
  const [cls, label] = map[status] || map.offline;
  return (
    <span className={"cloud-pill cp-" + cls} title={
      cls === "live" ? "Everyone sees this same plan from the server."
      : "No shared server reachable — changes save only in this browser."
    }>
      <i className="cp-dot"></i>{label}
    </span>
  );
}

/* organiser controls (only mounted when relevant) */
function OrganiserBar({ signedIn, dirty, pubState, pubMsg, offline, cloudNewer, savedLabel, onSignIn, onPublish, onSignOut, onLoadLatest }) {
  if (!signedIn) {
    return <button className="org-btn" onClick={onSignIn} title="Organiser sign-in">⚿ Organiser</button>;
  }
  let label = "Up to date", disabled = true, cls = "pub-clean";
  if (offline) { label = "Local only"; disabled = true; cls = "pub-offline"; }
  else if (pubState === "publishing") { label = "Publishing…"; disabled = true; cls = "pub-busy"; }
  else if (pubState === "error") { label = "Retry publish"; disabled = false; cls = "pub-error"; }
  else if (dirty) { label = "Publish changes"; disabled = false; cls = "pub-dirty"; }
  else if (pubState === "done") { label = "Published ✓"; disabled = true; cls = "pub-done"; }

  return (
    <div className="org-bar">
      <span className="org-tag">Organiser</span>
      <button className={"pub-btn " + cls} disabled={disabled} onClick={onPublish}>
        {dirty && !offline && pubState !== "publishing" && <i className="pub-dot"></i>}
        {label}
      </button>
      <button className="org-out" title="Sign out" onClick={onSignOut}>✕</button>
      {cloudNewer && (
        <div className="org-warn">
          Someone else published a newer plan. <button onClick={onLoadLatest}>Load latest</button>
        </div>
      )}
      {pubState === "error" && pubMsg && <div className="org-err">{pubMsg}</div>}
      {!dirty && !offline && savedLabel && pubState !== "error" && <span className="org-saved">{savedLabel}</span>}
    </div>
  );
}

/* password modal */
function SignInModal({ open, busy, error, offline, kingdomName, onClose, onSubmit }) {
  const [pw, setPw] = useCS("");
  const ref = useCR(null);
  useCE(() => { if (open) { setPw(""); setTimeout(() => ref.current && ref.current.focus(), 30); } }, [open]);
  if (!open) return null;
  const submit = () => { if (pw.trim()) onSubmit(pw.trim()); };
  return (
    <div className="modal-veil" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3>Organiser sign-in</h3>
        <p className="modal-sub">
          {kingdomName ? <>Enter the <b>{kingdomName}</b> organiser password to edit{!offline && " and publish it live"}.</> :
            <>Enter the organiser password to edit the plan{!offline && " and publish it live for everyone"}.</>}
        </p>
        <input
          ref={ref} type="password" className="minput modal-input" placeholder="Organiser password"
          value={pw} onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
        />
        {error && <div className="modal-err">{error}</div>}
        {offline && <div className="modal-note">No shared server detected — you can still edit, but changes stay in this browser only.</div>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-add" disabled={busy || !pw.trim()} onClick={submit}>{busy ? "Checking…" : "Unlock"}</button>
        </div>
      </div>
    </div>
  );
}

/* "updated X ago" — visible to everyone so players know the plan is current */
function PublishedStamp({ ts, status }) {
  const [, tick] = useCS(0);
  useCE(() => { const t = setInterval(() => tick((n) => n + 1), 30000); return () => clearInterval(t); }, []);
  if (!ts || (status !== "live" && status !== "empty")) return null;
  const diff = Date.now() - ts;
  let rel;
  if (diff < 60000) rel = "just now";
  else { const m = Math.floor(diff / 60000); if (m < 60) rel = m + "m ago";
    else { const h = Math.floor(m / 60); if (h < 24) rel = h + "h ago";
      else { const d = Math.floor(h / 24); rel = d < 7 ? d + "d ago" : new Date(ts).toLocaleDateString(); } } }
  return <span className="pub-stamp" title={"Plan last published " + new Date(ts).toLocaleString()}>Updated {rel}</span>;
}

Object.assign(window, { CloudPill, OrganiserBar, SignInModal, PublishedStamp });
