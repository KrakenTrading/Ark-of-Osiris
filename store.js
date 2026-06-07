/* OL · Ark of Osiris — Manage (editor) tab + countdown. Babel JSX. Exports to window. */
const { useState: useMS, useMemo: useMM, useEffect: useME, useRef: useMR } = React;

/* ---------- countdown (shared with hero) ---------- */
function fmtUTC(ms) {
  const d = new Date(ms);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false,
  }).format(d) + " UTC";
}
function Countdown({ iso, className }) {
  const ms = window.OLStore.parseUTC(iso);
  const [now, setNow] = useMS(Date.now());
  useME(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!ms) {
    return <span className={"cd " + (className || "")}><span className="cd-none">No match time set</span></span>;
  }
  let diff = ms - now;
  const past = diff <= 0;
  const live = past && (ms - now) > -90 * 60 * 1000;
  diff = Math.abs(diff);
  const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24,
        m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
  return (
    <span className={"cd " + (className || "") + (past ? " is-past" : "")}>
      <span className="cd-when">{fmtUTC(ms)}</span>
      <span className="cd-clock">
        {past ? (live ? <b className="cd-live">● LIVE</b> : <b className="cd-ended">Match ended</b>) : (
          <>
            {d > 0 && <b>{d}<i>d</i></b>}
            <b>{String(h).padStart(2, "0")}<i>h</i></b>
            <b>{String(m).padStart(2, "0")}<i>m</i></b>
            <b>{String(s).padStart(2, "0")}<i>s</i></b>
          </>
        )}
      </span>
    </span>
  );
}

/* ---------- tiny field atoms ---------- */
function Field({ label, children, wide }) {
  return (
    <label className={"fld" + (wide ? " fld-wide" : "")}>
      <span className="fld-lbl">{label}</span>
      {children}
    </label>
  );
}

/* ---------- Manage shell ---------- */
function Manage({ onJump }) {
  const [sub, setSub] = useMS("slots");
  const SUBS = [["slots", "Slots & Lanes"], ["roster", "Roster"], ["match", "Match & Setup"]];
  return (
    <div className="manage-wrap">
      <p className="tab-intro">
        Your control room. Everything here is <b>saved automatically in this browser</b> — set it up once
        each week, then the other tabs show players a clean view. Type a new name anywhere and they’re added to the roster.
      </p>
      <div className="manage-sub">
        {SUBS.map(([k, l]) => (
          <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{l}</button>
        ))}
      </div>
      {sub === "slots" && <SlotsManager onJump={onJump} />}
      {sub === "roster" && <RosterManager />}
      {sub === "match" && <MatchManager />}
    </div>
  );
}

/* ---------- shared roster datalist ---------- */
function RosterDatalist() {
  const { plan } = window.usePlan();
  return (
    <datalist id="roster-datalist">
      {plan.roster.map((r) => <option key={r.uid} value={r.name} />)}
    </datalist>
  );
}

/* ============ SLOTS & LANES ============ */
const LANE_IDS = ["A", "B", "C", "D"];
function SlotsManager({ onJump }) {
  const api = window.usePlan();
  const { plan } = api;
  const byLane = useMM(() => {
    const g = { A: [], B: [], C: [], D: [] };
    plan.slots.forEach((s) => { (g[s.lane] || (g[s.lane] = [])).push(s); });
    Object.values(g).forEach((arr) => arr.sort((a, b) => (a.tp || 0) - (b.tp || 0)));
    return g;
  }, [plan.slots]);

  return (
    <div className="slots-mgr">
      <RosterDatalist />
      <p className="mgr-hint">
        Fill each seat from the dropdown or type a fresh name. Change a seat’s <b>Lane</b> to move it between teams.
        Set the teleport <b>order №</b> and <b>drop wave</b> — the Teleport tab re-sorts itself from these.
      </p>
      {LANE_IDS.map((L) => (
        <div className="lane-block" key={L}>
          <div className="lane-block-head">
            <span className={"lb-letter lane-dot-" + window.BP.LANES[L].accent}>{L}</span>
            <div className="lb-title">
              <b>{window.BP.LANES[L].name}</b>
              <span>{window.BP.LANES[L].geo} · {byLane[L].length} seats</span>
            </div>
            <button className="btn btn-add" onClick={() => api.addSlot(L)}>+ Add seat</button>
          </div>
          <div className="lane-block-body">
            {byLane[L].length === 0 && <div className="lane-empty">No seats yet — add one.</div>}
            {byLane[L].map((s) => <SlotEditor key={s.uid} s={s} api={api} onJump={onJump} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

const OBJ_KEYS = ["DA", "SA", "SOL", "SOW", "OBE", "OUT"];
function SlotEditor({ s, api, onJump }) {
  const [open, setOpen] = useMS(false);
  const set = (patch) => api.updateSlot(s.uid, patch);
  const toggleObj = (k) => {
    const has = (s.obj || []).includes(k);
    set({ obj: has ? s.obj.filter((x) => x !== k) : [...(s.obj || []), k] });
  };
  const linesToText = (a) => (a || []).join("\n");
  const textToLines = (t) => t.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <div className={"slot-editor" + (open ? " is-open" : "")}>
      <div className="se-head">
        <input className="minput se-slotid" value={s.slot} onChange={(e) => set({ slot: e.target.value })} title="Seat label" />
        <input
          className="minput se-player" list="roster-datalist" placeholder="— open seat —"
          value={s.player || ""}
          onChange={(e) => set({ player: e.target.value })}
          onBlur={(e) => api.ensurePlayer(e.target.value)}
        />
        <select className="mselect se-role" value={s.role} onChange={(e) => set({ role: e.target.value })}>
          {Object.keys(window.BP.ROLE).map((k) => <option key={k} value={k}>{window.BP.ROLE[k].label}</option>)}
        </select>
        <select className="mselect se-lane" value={s.lane} onChange={(e) => set({ lane: e.target.value })} title="Lane / team">
          {LANE_IDS.map((L) => <option key={L} value={L}>Lane {L}</option>)}
        </select>
        <button className="btn-icon" title="More" onClick={() => setOpen((o) => !o)}>{open ? "▲" : "▾"}</button>
        <button className="btn-icon btn-danger" title="Remove seat" onClick={() => { if (confirm("Remove seat " + s.slot + "?")) api.removeSlot(s.uid); }}>✕</button>
      </div>

      <div className="se-row2">
        <Field label="TP order №"><input type="number" className="minput tiny" value={s.tp ?? ""} onChange={(e) => set({ tp: e.target.value === "" ? null : parseInt(e.target.value, 10) })} /></Field>
        <Field label="Drop wave">
          <select className="mselect" value={s.tpWhen || "Immediately"} onChange={(e) => set({ tpWhen: e.target.value })}>
            {window.OLStore.TP_WHEN.map((t) => <option key={t} value={t}>{t}</option>)}
            {!window.OLStore.TP_WHEN.includes(s.tpWhen) && s.tpWhen && <option value={s.tpWhen}>{s.tpWhen}</option>}
          </select>
        </Field>
        <Field label="Enter"><input className="minput tiny" value={s.enter || ""} onChange={(e) => set({ enter: e.target.value })} /></Field>
        <label className="se-anubis">
          <input type="checkbox" checked={!!s.anubis} onChange={(e) => set({ anubis: e.target.checked })} />
          <span>☥ Anubis</span>
        </label>
      </div>

      {open && (
        <div className="se-extra">
          <Field label="Role label (free text)" wide>
            <input className="minput" value={s.roleLabel || ""} onChange={(e) => set({ roleLabel: e.target.value })} placeholder="e.g. Garrison obelisk" />
          </Field>
          <div className="se-objs">
            <span className="fld-lbl">Objectives</span>
            <div className="chip-tog-row">
              {OBJ_KEYS.map((k) => (
                <button key={k} className={"chip-tog tone-" + window.BP.OBJ[k].tone + ((s.obj || []).includes(k) ? " on" : "")} onClick={() => toggleObj(k)}>
                  {window.BP.OBJ[k].short}
                </button>
              ))}
            </div>
          </div>
          <div className="se-orders-grid">
            <Field label="Start of match (one order per line)" wide>
              <textarea className="mtextarea" rows="4" defaultValue={linesToText(s.start)} onBlur={(e) => set({ start: textToLines(e.target.value) })} />
            </Field>
            <Field label="Rest of match (one order per line)" wide>
              <textarea className="mtextarea" rows="4" defaultValue={linesToText(s.rest)} onBlur={(e) => set({ rest: textToLines(e.target.value) })} />
            </Field>
          </div>
          <label className="se-marker">
            <span className="fld-lbl">Flag marker</span>
            <input className="minput tiny" value={s.marker || ""} onChange={(e) => set({ marker: e.target.value })} placeholder="★ / ㋛" />
          </label>
          {s.player && <button className="btn btn-ghost se-view" onClick={() => onJump(s.uid)}>View on board →</button>}
        </div>
      )}
    </div>
  );
}

/* ============ ROSTER ============ */
function RosterManager() {
  const api = window.usePlan();
  const { plan } = api;
  const assignment = window.useAssignment();
  const nameRefs = useMR({});

  const add = () => {
    api.addPlayer({});
  };

  return (
    <div className="roster-mgr">
      <div className="rmgr-bar">
        <p className="mgr-hint">
          Players who signed up this week. Add everyone here, then assign them to seats in <b>Slots &amp; Lanes</b>.
          Removing a player leaves their seat open.
        </p>
        <button className="btn btn-add" onClick={add}>+ Add player</button>
      </div>
      <div className="table-scroll">
        <table className="roster-edit">
          <thead>
            <tr>
              <th>Player</th><th>Power</th><th>Marches</th><th>Rally</th><th>Garrison</th><th>Vote</th><th>Seat</th><th></th>
            </tr>
          </thead>
          <tbody>
            {plan.roster.map((r) => {
              const slot = assignment[(r.name || "").toLowerCase()];
              return (
                <tr key={r.uid}>
                  <td><input className="minput" value={r.name} placeholder="name" ref={(el) => (nameRefs.current[r.uid] = el)} onChange={(e) => api.updatePlayer(r.uid, { name: e.target.value })} /></td>
                  <td><input className="minput tiny" type="number" value={r.power ?? ""} onChange={(e) => api.updatePlayer(r.uid, { power: e.target.value === "" ? null : parseFloat(e.target.value) })} /></td>
                  <td><input className="minput tiny" value={r.marches ?? ""} onChange={(e) => api.updatePlayer(r.uid, { marches: e.target.value === "" ? null : e.target.value })} /></td>
                  <td><input className="minput sm" value={r.rally || ""} onChange={(e) => api.updatePlayer(r.uid, { rally: e.target.value })} /></td>
                  <td><input className="minput sm" value={r.garrison || ""} onChange={(e) => api.updatePlayer(r.uid, { garrison: e.target.value })} /></td>
                  <td>
                    <select className="mselect tiny" value={r.vote || "yes"} onChange={(e) => api.updatePlayer(r.uid, { vote: e.target.value })}>
                      <option value="yes">In</option><option value="?">?</option><option value="No">No</option>
                    </select>
                  </td>
                  <td>{slot ? <span className="slot-chip">{slot.slot}</span> : <span className="res-chip">reserve</span>}</td>
                  <td><button className="btn-icon btn-danger" title="Remove player" onClick={() => { if (confirm("Remove " + (r.name || "player") + "?")) api.removePlayer(r.uid); }}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ MATCH & SETUP ============ */
function MatchManager() {
  const api = window.usePlan();
  const { plan } = api;
  const m = plan.meta;
  const a = plan.anubis;
  const updA = (patch) => api.updateAnubis(patch);
  const fileRef = useMR(null);

  const exportPlan = () => {
    const data = JSON.stringify(plan, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const slug = (m.weekLabel || "plan").replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") || "plan";
    const aEl = document.createElement("a");
    aEl.href = url; aEl.download = "ark-of-osiris-" + slug + ".json";
    document.body.appendChild(aEl); aEl.click(); aEl.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  const onImportFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(reader.result);
        if (!p || !Array.isArray(p.slots) || !Array.isArray(p.roster)) throw new Error("bad");
        p.slots.forEach((s) => { if (!s.uid) s.uid = window.OLStore.uid("s"); });
        p.roster.forEach((r) => { if (!r.uid) r.uid = window.OLStore.uid("r"); });
        if (!p.meta) p.meta = { title: "Ark of Osiris", weekLabel: "", matchTimeUTC: "" };
        if (!p.anubis) p.anubis = window.OLStore.defaultPlan().anubis;
        if (confirm("Replace the current plan with the imported file? (Publish afterwards to make it live.)")) api.replacePlan(p);
      } catch (err) {
        alert("That file doesn't look like a valid plan export.");
      }
      e.target.value = "";
    };
    reader.readAsText(f);
  };

  return (
    <div className="match-mgr">
      <div className="mblock">
        <h3>Match &amp; week</h3>
        <div className="mb-grid">
          <Field label="Week / event label" wide>
            <input className="minput" value={m.weekLabel || ""} placeholder="e.g. Week of 14 Jun · Quarter-final" onChange={(e) => api.updateMeta({ weekLabel: e.target.value })} />
          </Field>
          <Field label="Match start (entered as UTC)">
            <input className="minput" type="datetime-local" value={m.matchTimeUTC || ""} onChange={(e) => api.updateMeta({ matchTimeUTC: e.target.value })} />
          </Field>
        </div>
        <div className="cd-preview">
          <span className="cd-preview-lbl">Live countdown</span>
          <Countdown iso={m.matchTimeUTC} className="cd-lg" />
        </div>
        <p className="mgr-note">Times are treated as <b>UTC</b> so everyone across timezones agrees on the clock.</p>
      </div>

      <div className="mblock">
        <h3>Anubis boss</h3>
        <div className="mb-grid">
          <Field label="1st spawn"><input className="minput tiny" value={a.firstSpawn} onChange={(e) => updA({ firstSpawn: e.target.value })} /></Field>
          <Field label="2nd spawn"><input className="minput tiny" value={a.secondSpawn} onChange={(e) => updA({ secondSpawn: e.target.value })} /></Field>
          <Field label="Reward" wide><input className="minput" value={a.reward} onChange={(e) => updA({ reward: e.target.value })} /></Field>
        </div>
        <Field label="Protocol notes (one per line)" wide>
          <textarea className="mtextarea" rows="6" defaultValue={(a.lines || []).join("\n")} onBlur={(e) => updA({ lines: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} />
        </Field>
      </div>

      <div className="mblock">
        <h3>Backup</h3>
        <p className="mgr-note">Download the whole plan as a file (a weekly archive, or to move it to another browser), or load one back in. Importing only changes your working copy — <b>Publish</b> afterwards to push it live.</p>
        <div className="data-actions">
          <button className="btn btn-ghost" onClick={exportPlan}>⭳ Export plan (.json)</button>
          <button className="btn btn-ghost" onClick={() => fileRef.current && fileRef.current.click()}>⭱ Import plan…</button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={onImportFile} />
        </div>
      </div>

      <div className="mblock mblock-danger">
        <h3>New week / reset</h3>
        <p className="mgr-note">Use these to recycle the plan. Everything autosaves to this browser only.</p>
        <div className="data-actions">
          <button className="btn btn-ghost" onClick={() => { if (confirm("Clear every seat's assigned player? (Keeps seats, roles, orders & roster.)")) api.clearAssignments(); }}>Clear all assignments</button>
          <button className="btn btn-danger-solid" onClick={() => { if (confirm("Reset the ENTIRE plan back to the original default? This cannot be undone.")) api.resetDefaults(); }}>Reset to default plan</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Manage, Countdown, fmtUTC, RosterDatalist });
