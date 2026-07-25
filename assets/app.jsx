/* OL · Ark of Osiris — app shell, plan state, context, countdown + shared-cloud wiring. Babel JSX. */
const { useState: useS, useMemo: useM, useRef: useR, useEffect: useE } = React;
const PlanCtx = window.PlanCtx;

const BASE_TABS = [
  { id: "board", label: "Battle Board" },
  { id: "teleport", label: "Teleport Order" },
  { id: "roster", label: "Roster" },
  { id: "map", label: "Map" },
  { id: "legend", label: "Legend" },
];

function scrollToCard(uid) {
  const el = document.getElementById("card-" + uid);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: y, behavior: "smooth" });
}
function nextLabel(lane, slots) {
  const taken = new Set(slots.map((s) => s.slot));
  let i = slots.filter((s) => s.lane === lane).length + 1;
  while (taken.has(lane + i)) i++;
  return lane + i;
}
function nextTp(slots) { return slots.reduce((mx, s) => Math.max(mx, s.tp || 0), 0) + 1; }

/* ---------- search ---------- */
function SearchBar({ onSelect }) {
  const { plan } = window.usePlan();
  const assignment = window.useAssignment();
  const [q, setQ] = useS("");
  const [focus, setFocus] = useS(false);
  const matches = useM(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return plan.roster
      .filter((r) => (r.name || "").toLowerCase().includes(t))
      .map((r) => ({ name: r.name, slot: assignment[(r.name || "").toLowerCase()] || null }))
      .slice(0, 7);
  }, [q, plan.roster, assignment]);
  const pick = (m) => { setQ(""); setFocus(false); if (m.slot) onSelect(m.slot.uid); };
  return (
    <div className="search">
      <span className="search-ico">⌕</span>
      <input
        value={q} placeholder="Find your name…"
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        onKeyDown={(e) => { if (e.key === "Enter" && matches[0]) pick(matches[0]); }}
      />
      {focus && matches.length > 0 && (
        <div className="search-pop">
          {matches.map((m) => (
            <button key={m.name} className="search-item" onMouseDown={() => pick(m)}>
              <span className="si-name">{m.name}</span>
              {m.slot ? <span className="si-slot">{m.slot.slot}</span> : <span className="si-res">reserve</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- root ---------- */
function App({ session, onSwitch }) {
  const [plan, setPlan] = useS(() => window.OLStore.loadPlan());
  const [tab, setTab] = useS("board");
  const [selected, setSelected] = useS(null);
  const [openSlot, setOpenSlot] = useS(null);

  // cloud / organiser state
  const [cloudStatus, setCloudStatus] = useS("loading"); // loading | live | empty | offline
  const [signedIn, setSignedIn] = useS(() => !!window.OLStore.loadPw());
  const [pubJSON, setPubJSON] = useS(() => window.OLStore.loadPub());
  const [pubState, setPubState] = useS("idle"); // idle | publishing | done | error
  const [pubMsg, setPubMsg] = useS("");
  const [savedLabel, setSavedLabel] = useS("");
  const [cloudNewer, setCloudNewer] = useS(false);
  const [publishedAt, setPublishedAt] = useS(null);
  const [modalOpen, setModalOpen] = useS(false);
  const [modalBusy, setModalBusy] = useS(false);
  const [modalErr, setModalErr] = useS("");

  // autosave working copy
  useE(() => { window.OLStore.savePlan(plan); }, [plan]);

  const dirty = useM(() => JSON.stringify(plan) !== pubJSON, [plan, pubJSON]);

  // on mount: pull the shared plan
  useE(() => {
    let alive = true;
    (async () => {
      const res = await window.OLCloud.view(session.id, session.viewPw);
      if (!alive) return;
      const avail = window.OLCloud.isAvailable();
      if (res && res.plan) {
        const cloud = res.plan;
        const cloudJSON = JSON.stringify(cloud);
        const localJSON = JSON.stringify(plan);
        const prevPub = window.OLStore.loadPub();
        const signed = !!window.OLStore.loadPw();
        const localDirty = localJSON !== prevPub;
        if (!signed || !localDirty) {
          setPlan(cloud); setPubJSON(cloudJSON); window.OLStore.savePub(cloudJSON);
        } else if (cloudJSON !== prevPub) {
          setCloudNewer(true);
        }
        setPublishedAt(res.savedAt || null);
        setCloudStatus("live");
      } else {
        setCloudStatus(avail === false ? "offline" : "empty");
      }
    })();
    return () => { alive = false; };
  }, []);

  const api = useM(() => ({
    plan,
    updateMeta: (patch) => setPlan((p) => ({ ...p, meta: { ...p.meta, ...patch } })),
    updateAnubis: (patch) => setPlan((p) => ({ ...p, anubis: { ...p.anubis, ...patch } })),
    updateSlot: (uid, patch) => setPlan((p) => ({ ...p, slots: p.slots.map((s) => (s.uid === uid ? { ...s, ...patch } : s)) })),
    addSlot: (lane) => setPlan((p) => ({
      ...p,
      slots: [...p.slots, {
        uid: window.OLStore.uid("s"), lane, slot: nextLabel(lane, p.slots),
        player: "", marker: "", roleLabel: "Fill", role: "FILL", obj: [], tile: null,
        anubis: false, tp: nextTp(p.slots), tpWhen: "Immediately", enter: "", start: [], rest: [],
      }],
    })),
    removeSlot: (uid) => setPlan((p) => ({ ...p, slots: p.slots.filter((s) => s.uid !== uid) })),
    updatePlayer: (uid, patch) => setPlan((p) => ({ ...p, roster: p.roster.map((r) => (r.uid === uid ? { ...r, ...patch } : r)) })),
    addPlayer: (data) => setPlan((p) => ({
      ...p,
      roster: [...p.roster, Object.assign({ uid: window.OLStore.uid("r"), name: "", power: null, marches: null, rally: "No", garrison: "No", vote: "yes" }, data || {})],
    })),
    removePlayer: (uid) => setPlan((p) => ({ ...p, roster: p.roster.filter((r) => r.uid !== uid) })),
    ensurePlayer: (name) => setPlan((p) => {
      const nm = (name || "").trim();
      if (!nm) return p;
      if (p.roster.some((r) => (r.name || "").toLowerCase() === nm.toLowerCase())) return p;
      return { ...p, roster: [...p.roster, { uid: window.OLStore.uid("r"), name: nm, power: null, marches: null, rally: "No", garrison: "No", vote: "yes" }] };
    }),
    resetDefaults: () => setPlan(window.OLStore.defaultPlan()),
    clearAssignments: () => setPlan((p) => ({ ...p, slots: p.slots.map((s) => ({ ...s, player: "" })) })),
    replacePlan: (p) => setPlan(p),
  }), [plan]);

  const slotsByLane = useM(() => {
    const g = { A: [], B: [], C: [], D: [] };
    plan.slots.forEach((s) => { (g[s.lane] || (g[s.lane] = [])).push(s); });
    Object.values(g).forEach((arr) => arr.sort((a, b) => (a.tp || 0) - (b.tp || 0)));
    return g;
  }, [plan.slots]);

  const counts = useM(() => {
    const assignedNames = new Set(plan.slots.filter((s) => s.player).map((s) => s.player.toLowerCase()));
    const reserves = plan.roster.filter((r) => !assignedNames.has((r.name || "").toLowerCase())).length;
    const openSeats = plan.slots.filter((s) => !s.player).length;
    return { slots: plan.slots.length, reserves, openSeats };
  }, [plan.slots, plan.roster]);

  const focusSlot = (uid) => {
    setTab("board"); setSelected(uid); setOpenSlot(uid);
    setTimeout(() => scrollToCard(uid), 120);
  };
  const toggleCard = (uid) => { setOpenSlot((cur) => (cur === uid ? null : uid)); setSelected(uid); };

  /* ----- organiser actions ----- */
  const doSignIn = async (pw) => {
    setModalBusy(true); setModalErr("");
    const res = await window.OLCloud.verify(session.id, pw);
    setModalBusy(false);
    if (res.ok || res.offline) {
      window.OLStore.savePw(pw); setSignedIn(true); setModalOpen(false);
      if (res.offline) setCloudStatus("offline");
    } else {
      setModalErr("That password didn't match. Try again.");
    }
  };
  const doSignOut = () => { window.OLStore.savePw(""); setSignedIn(false); setPubState("idle"); if (tab === "manage") setTab("board"); };
  const doPublish = async () => {
    const pw = window.OLStore.loadPw();
    if (!pw) { setModalOpen(true); return; }
    setPubState("publishing"); setPubMsg("");
    try {
      const r = await window.OLCloud.publish(session.id, pw, plan);
      const js = JSON.stringify(plan);
      setPubJSON(js); window.OLStore.savePub(js);
      setPubState("done"); setCloudNewer(false); setCloudStatus("live");
      setPublishedAt(r.savedAt || Date.now());
      const t = new Date(r.savedAt || Date.now());
      setSavedLabel("Published " + t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setPubState("error");
      setPubMsg(e.offline ? "No server reachable — deploy to Netlify first." : (e.message || "Publish failed"));
    }
  };
  const doLoadLatest = async () => {
    const res = await window.OLCloud.view(session.id, session.viewPw);
    if (res && res.plan) { const js = JSON.stringify(res.plan); setPlan(res.plan); setPubJSON(js); window.OLStore.savePub(js); setCloudNewer(false); setPublishedAt(res.savedAt || null); }
  };

  const TABS = signedIn ? [...BASE_TABS, { id: "manage", label: "⚙ Manage" }] : BASE_TABS;

  return (
    <PlanCtx.Provider value={api}>
      <div className="app">
        <header className="hero">
          <div className="hero-top">
            <div className="brand">
              <div className="crest">OL</div>
              <div className="brand-txt">
                <h1>Ark of Osiris</h1>
                <p>{plan.meta.weekLabel ? plan.meta.weekLabel : "Lane assignments · teleport order · garrison & rally calls"}</p>
              </div>
            </div>
            <div className="hero-actions">
              <button className="kingdom-chip" onClick={onSwitch} title="Switch kingdom / sign out of this view">
                <span className="kc-lbl">Kingdom</span>
                <span className="kc-name">{session.name}</span>
                <span className="kc-switch">Switch</span>
              </button>
              <window.CloudPill status={cloudStatus} />
              <window.PublishedStamp ts={publishedAt} status={cloudStatus} />
              <window.OrganiserBar
                signedIn={signedIn} dirty={dirty} pubState={pubState} pubMsg={pubMsg}
                offline={cloudStatus === "offline"} cloudNewer={cloudNewer} savedLabel={savedLabel}
                onSignIn={() => { setModalErr(""); setModalOpen(true); }}
                onPublish={doPublish} onSignOut={doSignOut} onLoadLatest={doLoadLatest}
              />
              <SearchBar onSelect={focusSlot} />
            </div>
          </div>

          <div className="hero-bar">
            <div className="match-chip">
              <span className="mc-ico">⏱</span>
              <window.Countdown iso={plan.meta.matchTimeUTC} />
            </div>
            <div className="hero-stats">
              <span><b>{counts.slots}</b> seats</span>
              <span className="dot">·</span>
              <span><b>4</b> lanes</span>
              <span className="dot">·</span>
              <span><b>{counts.openSeats}</b> open</span>
              <span className="dot">·</span>
              <span><b>{counts.reserves}</b> reserves</span>
            </div>
          </div>
        </header>

        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>

        <main className="content">
          {tab === "board" && (
            <>
              <AnubisBanner />
              <div className="board">
                {["A", "B", "C", "D"].map((L) => (
                  <LaneColumn key={L} laneId={L} slots={slotsByLane[L]} selected={selected} openSlot={openSlot} onToggle={toggleCard} />
                ))}
              </div>
            </>
          )}
          {tab === "teleport" && <TeleportTimeline onPick={focusSlot} />}
          {tab === "roster" && <RosterTable onPick={focusSlot} />}
          {tab === "map" && <MapTab />}
          {tab === "legend" && <Legend />}
          {tab === "manage" && signedIn && <window.Manage onJump={focusSlot} />}
        </main>

        <footer className="foot">
          OL alliance · Ark of Osiris — weekly battle plan. {signedIn ? "Edit in Manage, then Publish to push it live for everyone." : "Tap any card for full orders."}
        </footer>
      </div>

      <window.SignInModal
        open={modalOpen} busy={modalBusy} error={modalErr} offline={cloudStatus === "offline"}
        kingdomName={session.name}
        onClose={() => setModalOpen(false)} onSubmit={doSignIn}
      />
    </PlanCtx.Provider>
  );
}

/* App is mounted by <Root/> in gate.jsx once a kingdom is unlocked. */
