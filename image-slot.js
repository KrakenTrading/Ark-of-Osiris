/* OL · Ark of Osiris — kingdom gate + app root. Babel JSX.
   Loaded LAST (after app.jsx). Shows a kingdom picker + view-password login,
   and only mounts <App/> once the visitor has unlocked a kingdom. Each kingdom's
   plan is isolated server-side behind its own view + edit passwords. */
const { useState: useG, useEffect: useGE, useRef: useGR } = React;

// Labels shown only when there's no server (local preview). Names only — never passwords.
const OFFLINE_KINGDOMS = [
  { id: "2924", name: "Kingdom 2924" },
  { id: "3793", name: "Kingdom 3793" },
];

function Gate({ onEnter }) {
  const [phase, setPhase] = useG("loading"); // loading | pick
  const [kingdoms, setKingdoms] = useG([]);
  const [offline, setOffline] = useG(false);
  const [picked, setPicked] = useG(null);
  const [pw, setPw] = useG("");
  const [busy, setBusy] = useG(false);
  const [err, setErr] = useG("");
  const pwRef = useGR(null);

  const enterNow = (id, viewPw, list, local) => {
    const k = (list || []).find((x) => String(x.id) === String(id)) || { id, name: id };
    window.OLStore.saveSession({ id: k.id, name: k.name, viewPw });
    onEnter({ id: k.id, name: k.name, viewPw, local: !!local });
  };

  useGE(() => {
    let alive = true;
    (async () => {
      const saved = window.OLStore.loadSession();
      const list = await window.OLCloud.listKingdoms();
      if (!alive) return;

      if (list) {
        // online: real kingdom list from the server
        setKingdoms(list);
        setOffline(false);
        // auto-enter a remembered kingdom if its view password still checks out
        if (saved && saved.viewPw && list.some((k) => String(k.id) === String(saved.id))) {
          const r = await window.OLCloud.view(saved.id, saved.viewPw);
          if (!alive) return;
          if (r.ok) { enterNow(saved.id, saved.viewPw, list, false); return; }
        }
        const param = new URLSearchParams(location.search).get("k");
        const pre =
          (param && list.find((k) => String(k.id) === param)) ? param :
          (saved && list.find((k) => String(k.id) === String(saved.id))) ? saved.id :
          (list.length === 1 ? list[0].id : null);
        setPicked(pre);
        setPhase("pick");
      } else {
        // offline / local preview: no server to check passwords
        setOffline(true);
        if (saved) { enterNow(saved.id, saved.viewPw || "", OFFLINE_KINGDOMS, true); return; }
        setKingdoms(OFFLINE_KINGDOMS);
        setPicked(OFFLINE_KINGDOMS.length === 1 ? OFFLINE_KINGDOMS[0].id : null);
        setPhase("pick");
      }
    })();
    return () => { alive = false; };
  }, []);

  const choose = (id) => { setPicked(id); setErr(""); setTimeout(() => pwRef.current && pwRef.current.focus(), 30); };

  const submit = async () => {
    if (!picked) { setErr("Pick your kingdom first."); return; }
    if (offline) { enterNow(picked, pw.trim(), kingdoms, true); return; }
    if (!pw.trim()) { setErr("Enter your kingdom's view password."); return; }
    setBusy(true); setErr("");
    const r = await window.OLCloud.view(picked, pw.trim());
    setBusy(false);
    if (r.ok) enterNow(picked, pw.trim(), kingdoms, false);
    else if (r.offline) enterNow(picked, pw.trim(), kingdoms, true);
    else setErr("That password didn't match this kingdom. Try again.");
  };

  if (phase === "loading") {
    return (
      <div className="gate-veil">
        <div className="gate-card gate-loading">
          <div className="gate-crest">OL</div>
          <p className="gate-loadtxt">Loading kingdoms…</p>
        </div>
      </div>
    );
  }

  const pickedName = (kingdoms.find((k) => String(k.id) === String(picked)) || {}).name;

  return (
    <div className="gate-veil">
      <div className="gate-card">
        <div className="gate-head">
          <div className="gate-crest">OL</div>
          <div>
            <h2 className="gate-title">Ark of Osiris</h2>
            <p className="gate-sub">Select your kingdom, then enter its view password.</p>
          </div>
        </div>

        {offline && (
          <div className="gate-offline">
            Local preview — no server reachable, so passwords aren't checked here.
            On the live site each kingdom is locked to its own credentials.
          </div>
        )}

        <div className="gate-kingdoms">
          {kingdoms.length === 0 && <div className="gate-empty">No kingdoms configured yet.</div>}
          {kingdoms.map((k) => (
            <button
              key={k.id}
              className={"gate-k" + (String(picked) === String(k.id) ? " on" : "")}
              onClick={() => choose(k.id)}
            >
              <span className="gate-k-name">{k.name}</span>
              <span className="gate-k-mark">{String(picked) === String(k.id) ? "●" : "›"}</span>
            </button>
          ))}
        </div>

        {picked && (
          <div className="gate-login">
            <label className="gate-lbl">{offline ? "View password (skipped offline)" : pickedName + " · view password"}</label>
            <div className="gate-pw-row">
              <input
                ref={pwRef} type="password" className="minput" placeholder={offline ? "(any — local preview)" : "View password"}
                value={pw} onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              />
              <button className="btn btn-add gate-enter" disabled={busy} onClick={submit}>
                {busy ? "Checking…" : "Enter"}
              </button>
            </div>
            {err && <div className="gate-err">{err}</div>}
          </div>
        )}

        <p className="gate-foot">Members get the <b>view</b> password. Organisers also get an <b>edit</b> password to publish changes.</p>
      </div>
    </div>
  );
}

function Root() {
  const [session, setSession] = useG(null);

  if (!session) {
    return <Gate onEnter={(s) => { window.OLSession = s; setSession(s); }} />;
  }
  const switchKingdom = () => {
    window.OLStore.clearSession();
    window.OLStore.savePw("");
    window.OLSession = null;
    setSession(null);
  };
  return <App key={session.id} session={session} onSwitch={switchKingdom} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
