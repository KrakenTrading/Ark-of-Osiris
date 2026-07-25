/* OL · Ark of Osiris — read-only UI components. Babel JSX. Exports to window.
   Reads the live (editable) plan from PlanCtx. Static taxonomy stays on window.BP. */
const { useState, useRef, useEffect, useMemo } = React;
const BP = window.BP;

/* ---------- shared plan context ---------- */
const PlanCtx = React.createContext(null);
function usePlan() { return React.useContext(PlanCtx); }
window.PlanCtx = PlanCtx;
window.usePlan = usePlan;

/* lowercase-name → roster row, and name → assigned slot, derived from the plan */
function useRosterByName() {
  const { plan } = usePlan();
  return useMemo(() => {
    const m = {};
    plan.roster.forEach((r) => { m[(r.name || "").toLowerCase()] = r; });
    return m;
  }, [plan.roster]);
}
function useAssignment() {
  const { plan } = usePlan();
  return useMemo(() => {
    const byName = {}; // lower name → slot object
    plan.slots.forEach((s) => { if (s.player) byName[s.player.toLowerCase()] = s; });
    return byName;
  }, [plan.slots]);
}

/* ---------- small atoms ---------- */
function ObjTag({ k }) {
  const o = BP.OBJ[k];
  if (!o) return null;
  return <span className={"tag tone-" + o.tone} title={o.label}>{o.short}</span>;
}
function RoleBadge({ role }) {
  const r = BP.ROLE[role];
  if (!r) return null;
  return <span className={"role role-" + r.tone}>{r.label}</span>;
}
function Marker({ m }) {
  if (!m) return null;
  return <span className="marker" title="Flagged player">{m}</span>;
}
function VotePip({ v }) {
  const t = v === "No" ? "no" : v === "?" ? "maybe" : "yes";
  const label = v === "No" ? "No" : v === "?" ? "?" : "In";
  return <span className={"pip pip-" + t}>{label}</span>;
}

/* ---------- slot card (read view) ---------- */
function SlotCard({ s, selected, onToggle, open }) {
  const rosterByName = useRosterByName();
  const ros = s.player ? rosterByName[s.player.toLowerCase()] : null;
  const hasOrders = (s.start && s.start.length) || (s.rest && s.rest.length);
  const empty = !s.player;
  return (
    <div
      id={"card-" + s.uid}
      className={"slot-card" + (selected ? " is-selected" : "") + (open ? " is-open" : "") + (empty ? " is-empty" : "")}
      onClick={() => onToggle(s.uid)}
    >
      <div className="slot-top">
        <span className="slot-id">{s.slot}</span>
        <div className="slot-name-wrap">
          <span className="slot-name">{s.player || <em className="unfilled">— open seat —</em>}<Marker m={s.marker} /></span>
          <span className="slot-role-label">{s.roleLabel}</span>
        </div>
        {ros && ros.power != null && <span className="slot-power">{ros.power}<i>pwr</i></span>}
      </div>

      <div className="slot-meta">
        <RoleBadge role={s.role} />
        <div className="tag-row">{(s.obj || []).map((k) => <ObjTag key={k} k={k} />)}</div>
        {s.anubis && <span className="anubis-flag" title="Goes to Anubis boss on first spawn">☥ Anubis</span>}
      </div>

      <div className="slot-orderbar">
        <span className="ob"><i>TP</i><b>№{s.tp}</b></span>
        <span className="ob"><i>Drop</i><b>{(s.tpWhen || "").split(" · ")[0]}</b></span>
        <span className="ob"><i>Enter</i><b>{s.enter}</b></span>
        {hasOrders && <span className="ob-toggle">{open ? "Hide orders ▲" : "Orders ▼"}</span>}
      </div>

      {open && hasOrders && (
        <div className="orders" onClick={(e) => e.stopPropagation()}>
          {s.start && s.start.length > 0 && (
            <div className="order-col">
              <h5>Start of match</h5>
              <ul>{s.start.map((l, i) => <li key={i}>{l}</li>)}</ul>
            </div>
          )}
          {s.rest && s.rest.length > 0 && (
            <div className="order-col">
              <h5>Rest of match</h5>
              <ul>{s.rest.map((l, i) => <li key={i}>{l}</li>)}</ul>
            </div>
          )}
          {(s.tpWhen || "").includes("·") && (
            <div className="order-foot">Teleport drop: <b>{s.tpWhen}</b></div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- lane column ---------- */
const LANE_OBJ = {
  A: ["OBE", "SA", "SOL"],
  B: ["DA", "SOW"],
  C: ["DA", "SOW"],
  D: ["SA", "OBE"],
};
function LaneColumn({ laneId, slots, selected, openSlot, onToggle }) {
  const lane = BP.LANES[laneId];
  return (
    <div className={"lane lane-" + lane.accent}>
      <div className="lane-head">
        <div className="lane-title">
          <span className="lane-letter">{laneId}</span>
          <div>
            <div className="lane-name">{lane.name}</div>
            <div className="lane-geo">{lane.geo}</div>
          </div>
        </div>
        <div className="lane-objs">{LANE_OBJ[laneId].map((k) => <ObjTag key={k} k={k} />)}</div>
      </div>
      <div className="lane-slots">
        {slots.length === 0 && <div className="lane-empty">No slots in this lane yet.</div>}
        {slots.map((s) => (
          <SlotCard
            key={s.uid}
            s={s}
            selected={selected === s.uid}
            open={openSlot === s.uid}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Anubis banner ---------- */
function AnubisBanner() {
  const { plan } = usePlan();
  const a = plan.anubis;
  const assigned = useMemo(
    () => plan.slots.filter((s) => s.anubis && s.player),
    [plan.slots]
  );
  return (
    <div className="anubis">
      <div className="anubis-glyph">☥</div>
      <div className="anubis-body">
        <div className="anubis-head">
          <h3>{a.title}</h3>
          <div className="anubis-times">
            <span><i>1st spawn</i><b>{a.firstSpawn}</b></span>
            <span><i>2nd spawn</i><b>{a.secondSpawn}</b></span>
            <span className="reward"><i>reward</i><b>{a.reward}</b></span>
          </div>
        </div>
        <ul className="anubis-lines">{a.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
        <div className="anubis-who">
          Assigned:{" "}
          {assigned.length
            ? assigned.map((s, i) => (
                <span key={s.uid}><b>{s.player} ({s.slot})</b>{i < assigned.length - 1 ? ", " : ""}</span>
              ))
            : <span>— flag obelisk garrisons in Manage —</span>}
          {assigned.length > 0 && " — obelisk garrisons."}
        </div>
      </div>
    </div>
  );
}

/* ---------- Teleport timeline (grouped by drop phase) ---------- */
const PHASE_ORDER = ["Immediately", "1st Spawn", "2nd Spawn", "3rd Spawn", "4th Spawn", "5th Spawn", "6th Spawn", "7th Spawn", "8th Spawn"];
function TeleportTimeline({ onPick }) {
  const { plan } = usePlan();
  const groups = useMemo(() => {
    const by = {};
    plan.slots.forEach((s) => {
      const key = (s.tpWhen || "Immediately").split(" · ")[0];
      (by[key] = by[key] || []).push(s);
    });
    Object.values(by).forEach((arr) => arr.sort((a, b) => (a.tp || 0) - (b.tp || 0)));
    const ordered = PHASE_ORDER.filter((p) => by[p]).map((p) => {
      const time = (by[p][0].tpWhen || "").split(" · ")[1] || null;
      return { phase: p, time, slots: by[p] };
    });
    // include any non-standard phases at the end
    Object.keys(by).forEach((p) => {
      if (!PHASE_ORDER.includes(p)) ordered.push({ phase: p, time: null, slots: by[p] });
    });
    return ordered;
  }, [plan.slots]);
  return (
    <div className="tl-wrap">
      <p className="tab-intro">
        Execution order, top to bottom. Everyone in <b>Immediately</b> drops at match start; each spawn
        block teleports in on its troop wave (the clock counts down). № = your in-game teleport seat.
      </p>
      {groups.map((g, gi) => (
        <div className="tl-phase" key={g.phase}>
          <div className="tl-phead">
            <span className="tl-pstep">{gi + 1}</span>
            <span className="tl-pname">{g.phase}</span>
            {g.time && <span className="tl-ptime">{g.time}</span>}
            <span className="tl-pcount">{g.slots.length} {g.slots.length === 1 ? "drop" : "drops"}</span>
          </div>
          <div className="timeline">
            {g.slots.map((s) => (
              <button key={s.uid} className="tl-row" onClick={() => onPick(s.uid)}>
                <span className="tl-no">№{s.tp}</span>
                <span className={"tl-lane lane-dot-" + BP.LANES[s.lane].accent}>{s.slot}</span>
                <span className="tl-name">{s.player || <em className="unfilled">open seat</em>}<Marker m={s.marker} /></span>
                <span className="tl-role"><RoleBadge role={s.role} /></span>
                <span className="tl-enter">enter {s.enter}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Map & references ---------- */
function MapTab() {
  return (
    <div className="maptab">
      <p className="tab-intro">
        Priority teleport &amp; placement. <b>Top team</b> takes the left (Shrine of Life / Desert Altar),
        <b> bottom team</b> the right (Shrine of War / Sky Altar). Each circled number is a teleport seat —
        solid circles drop first, dashed circles ride in on the troop-spawn time shown.
      </p>
      <figure className="map-figure">
        <img src={window.OL_MAP_IMG || "assets/teleport-map.png"} alt="Priority teleports and placement — top team and bottom team" />
      </figure>
      <div className="map-legend">
        <span><i className="ml-dot ml-top"></i>Top team — A &amp; B lanes (Shrine of Life / Desert Altar)</span>
        <span><i className="ml-dot ml-bot"></i>Bottom team — C &amp; D lanes (Shrine of War / Sky Altar)</span>
      </div>
      <div className="map-grid">
        <image-slot id="ol-map-extra" style={{ width: "100%", height: "300px", display: "block" }} radius="14" placeholder="Drop another reference (optional)"></image-slot>
      </div>
    </div>
  );
}

/* ---------- Roster table (read view) ---------- */
function RosterTable({ onPick }) {
  const { plan } = usePlan();
  const assignment = useAssignment();
  const [sort, setSort] = useState({ key: "power", dir: -1 });
  const [filter, setFilter] = useState("all"); // all | assigned | reserve

  const withSlot = useMemo(
    () => plan.roster.map((r) => ({ ...r, _slot: assignment[(r.name || "").toLowerCase()] || null })),
    [plan.roster, assignment]
  );
  const rows = useMemo(() => {
    let r = [...withSlot];
    if (filter === "assigned") r = r.filter((x) => x._slot);
    if (filter === "reserve") r = r.filter((x) => !x._slot);
    const { key, dir } = sort;
    r.sort((a, b) => {
      let va = a[key], vb = b[key];
      if (key === "power" || key === "marches") { va = parseFloat(va) || -1; vb = parseFloat(vb) || -1; }
      else { va = ("" + va).toLowerCase(); vb = ("" + vb).toLowerCase(); }
      return va < vb ? dir : va > vb ? -dir : 0;
    });
    return r;
  }, [withSlot, sort, filter]);

  const head = (key, label) => (
    <th
      className={"sortable" + (sort.key === key ? " active" : "")}
      onClick={() => setSort((s) => ({ key, dir: s.key === key ? -s.dir : -1 }))}
    >
      {label}{sort.key === key ? (sort.dir === -1 ? " ▾" : " ▴") : ""}
    </th>
  );

  const assigned = withSlot.filter((r) => r._slot).length;
  return (
    <div className="roster-wrap">
      <div className="roster-bar">
        <div className="seg">
          {[["all", "All " + plan.roster.length], ["assigned", "Assigned " + assigned], ["reserve", "Reserve " + (plan.roster.length - assigned)]].map(([k, l]) => (
            <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="table-scroll">
        <table className="roster">
          <thead>
            <tr>
              {head("name", "Player")}
              {head("power", "Power")}
              {head("marches", "Marches")}
              {head("rally", "Rally")}
              {head("garrison", "Garrison")}
              <th>Slot</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.uid} className={!r._slot ? "is-reserve" : ""} onClick={() => r._slot && onPick(r._slot.uid)}>
                <td className="rn">{r.name}</td>
                <td className="num">{r.power != null ? r.power : "—"}</td>
                <td className="num">{r.marches != null ? r.marches : "—"}</td>
                <td className="cap">{r.rally}</td>
                <td className="cap">{r.garrison}</td>
                <td>{r._slot ? <span className="slot-chip" onClick={(e) => { e.stopPropagation(); onPick(r._slot.uid); }}>{r._slot.slot}</span> : <span className="res-chip">reserve</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Legend ---------- */
function Legend() {
  return (
    <div className="legend">
      <div className="legend-grid">
        <section>
          <h4>Objectives</h4>
          <ul className="gloss">
            <li><span className="tag tone-desert">DA</span> Desert Altar</li>
            <li><span className="tag tone-sky">SA</span> Sky Altar</li>
            <li><span className="tag tone-life">SoL</span> Shrine of Life</li>
            <li><span className="tag tone-war">SoW</span> Shrine of War</li>
            <li><span className="tag tone-obelisk">Obelisk</span> Capture &amp; garrison points</li>
            <li><span className="tag tone-neutral">Outpost</span> Outposts &amp; Ark</li>
          </ul>
        </section>
        <section>
          <h4>Roles</h4>
          <ul className="gloss">
            <li><span className="role role-garrison">Garrison</span> Hold a building defensively</li>
            <li><span className="role role-rally">Rally</span> Lead the attack on a target</li>
            <li><span className="role role-fill">Fill</span> Reinforce rallies &amp; garrisons, push line</li>
            <li><span className="role role-disrupt">Disrupt</span> Raid outposts, Ark-run, harass</li>
          </ul>
        </section>
        <section className="geo-card">
          <h4>Lane geography <span>(our side)</span></h4>
          <div className="geo-map">
            <div className="geo-lane gl-obelisk"><b>A</b><span>outer L</span></div>
            <div className="geo-lane gl-desert"><b>B</b><span>inner L</span></div>
            <div className="geo-mid">MID · Ark · Anubis</div>
            <div className="geo-lane gl-desert"><b>C</b><span>inner R</span></div>
            <div className="geo-lane gl-sky"><b>D</b><span>outer R</span></div>
          </div>
          <p className="geo-note">
            A &amp; D are the outer lanes (Obelisk → Sky push). B &amp; C are the inner lanes feeding the Desert Altar &amp; War shrine.
          </p>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, {
  ObjTag, RoleBadge, Marker, VotePip, SlotCard, LaneColumn,
  AnubisBanner, TeleportTimeline, RosterTable, Legend, MapTab,
  useRosterByName, useAssignment,
});
