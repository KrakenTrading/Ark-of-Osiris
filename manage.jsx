/* OL — Ark of Osiris battle plan. Static taxonomy + the default (seed) plan.
   Plain JS, attaches to window.BP. Editable copies live in window.OLStore. */
(function () {
  // ---- Lane geography (left -> right as seen on OUR side) -------------------
  const LANES = {
    A: { id: "A", name: "A Lane", geo: "Outer lane — OUR left", accent: "obelisk" },
    B: { id: "B", name: "B Lane", geo: "Inner lane — OUR left", accent: "desert" },
    C: { id: "C", name: "C Lane", geo: "Inner lane — OUR right", accent: "desert" },
    D: { id: "D", name: "D Lane", geo: "Outer lane — OUR right", accent: "sky" },
  };

  // ---- Objective glossary --------------------------------------------------
  const OBJ = {
    DA:  { key: "DA",  label: "Desert Altar",  short: "DA",  tone: "desert" },
    SA:  { key: "SA",  label: "Sky Altar",     short: "SA",  tone: "sky" },
    SOL: { key: "SOL", label: "Shrine of Life",short: "SoL", tone: "life" },
    SOW: { key: "SOW", label: "Shrine of War", short: "SoW", tone: "war" },
    OBE: { key: "OBE", label: "Obelisk",       short: "Obelisk", tone: "obelisk" },
    OUT: { key: "OUT", label: "Outpost / Ark", short: "Outpost", tone: "neutral" },
  };

  // Role taxonomy
  const ROLE = {
    GARRISON: { key: "GARRISON", label: "Garrison", tone: "garrison" },
    RALLY:    { key: "RALLY",    label: "Rally",    tone: "rally" },
    FILL:     { key: "FILL",     label: "Fill",     tone: "fill" },
    DISRUPT:  { key: "DISRUPT",  label: "Disrupt",  tone: "disrupt" },
    FLEX:     { key: "FLEX",     label: "Flex",     tone: "disrupt" },
  };

  // ---- The 30 battle slots -------------------------------------------------
  // marker: ★ = leadership / flagged, ㋛ = noted
  const SLOTS = [
    // ===== A LANE (outer left — Obelisk / Sky push) =====
    {
      lane: "A", slot: "A1", player: "Senex", marker: "★", roleLabel: "Garrison obelisk",
      role: "GARRISON", obj: ["OBE", "SOL"], tile: 44, anubis: true,
      tp: 10, tpWhen: "Immediately", enter: "15",
      start: ["Fast T1 march to capture Obelisk", "Garrison the Obelisk", "Join A3 rally", "2 marches to SoL"],
      rest: ["Hold Garrison on Obelisk", "1 march fills A2 Obelisk rally", "3 marches to SA / SoL"],
    },
    {
      lane: "A", slot: "A2", player: "NightxReaper", roleLabel: "Rally Obelisk",
      role: "RALLY", obj: ["OBE", "SA"], tile: 43, anubis: false,
      tp: 11, tpWhen: "Immediately", enter: "16",
      start: ["Rally enemy Obelisk", "All marches to SA"],
      rest: ["Rally enemy Obelisk", "Defend SoL", "Remaining marches to enemy SA if possible"],
    },
    {
      lane: "A", slot: "A3", player: "DarkGiyu", roleLabel: "Rally SA",
      role: "RALLY", obj: ["SA", "OBE"], tile: 68, anubis: false,
      tp: 12, tpWhen: "Immediately", enter: "17",
      start: ["Rally Home Obelisk (Inf)", "All marches to enemy SA"],
      rest: ["Rally SA", "Garrison SA with another march", "Remaining marches to enemy SA"],
    },
    {
      lane: "A", slot: "A4", player: "BO", roleLabel: "Fill",
      role: "FILL", obj: ["SA"], tile: 14, anubis: false,
      tp: 5, tpWhen: "Immediately", enter: "18",
      start: ["1 march joins A3 rally", "Stay in Obelisk until safe", "Remaining marches to enemy SA"],
      rest: ["Remaining marches to enemy SA", "1 march fills SoL", "1 march fills SA"],
    },
    {
      lane: "A", slot: "A5", player: "Kayy Muteki", roleLabel: "Fill",
      role: "FILL", obj: [], tile: 41, anubis: false,
      tp: 13, tpWhen: "2nd Spawn · 42:40", enter: "8",
      start: [], rest: [],
    },

    // ===== B LANE (inner left — Desert Altar / War shrine) =====
    {
      lane: "B", slot: "B1", player: "Duong Tank", roleLabel: "Fill",
      role: "FILL", obj: ["DA"], anubis: false,
      tp: 1, tpWhen: "Immediately", enter: "ASAP",
      start: ["1 march joins B3 rally", "1 march garrisons B2 DA (Inf)", "Rest of marches to DA"],
      rest: ["1 march fills B3 rally (inf)", "1 march garrisons B2 DA (Inf)", "Rest of marches to DA / SoW"],
    },
    {
      lane: "B", slot: "B2", player: "Ku", roleLabel: "Garrison DA",
      role: "GARRISON", obj: ["DA", "OBE"], anubis: false,
      tp: 2, tpWhen: "Immediately", enter: "22",
      start: ["Garrison in DA (Inf)", "One march fills Obelisk", "Rest of marches to DA"],
      rest: ["Garrison in DA (Inf)", "Rest of marches defend DA", "One march fills B3 rally or A2 Obelisk"],
    },
    {
      lane: "B", slot: "B3", player: "Ace", roleLabel: "Rally SoW",
      role: "RALLY", obj: ["SOW", "DA"], anubis: false,
      tp: 3, tpWhen: "Immediately", enter: "23",
      start: ["Rally SoW", "4 marches to DA"],
      rest: ["1 march garrisons B2 DA (inf)", "Rally enemy SoW (inf)", "3 marches to SoW", "Ball to Ark if needed"],
    },
    {
      lane: "B", slot: "B4", player: "Alice Prime", marker: "㋛", roleLabel: "Fill",
      role: "FILL", obj: ["DA"], anubis: false,
      tp: 4, tpWhen: "Immediately", enter: "24",
      start: ["1 march to A3 rally (inf)", "All marches to DA"],
      rest: ["1 march fills B2 DA garrison", "4 marches defend SoW / DA", "Ball to Ark if needed"],
    },
    {
      lane: "B", slot: "B5", player: "A9 Prime", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], anubis: false,
      tp: 6, tpWhen: "1st Spawn · 47:40", enter: "9",
      start: ["1 march joins A2 rally (arch)", "1 march joins Obelisk garrison", "Rest of marches to DA"],
      rest: ["Defend DA", "Push / defend SoW", "Fill B2 DA garrison & B3 SoW rally", "Ball to Ark"],
    },
    {
      lane: "B", slot: "B6", player: "Eragon Prime", marker: "★", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], anubis: false,
      tp: 7, tpWhen: "3rd Spawn · 37:40", enter: "10",
      start: ["1 march joins A2 rally (arch)", "1 march joins Obelisk garrison", "Rest of marches to DA"],
      rest: ["Defend DA", "Push / defend SoW", "Fill B2 DA garrison & B3 SoW rally", "Ball to Ark"],
    },
    {
      lane: "B", slot: "B7", player: "Devil", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], anubis: false,
      tp: 8, tpWhen: "4th Spawn · 32:40", enter: "1",
      start: [],
      rest: ["Defend DA", "Push / defend SoW", "Fill B2 DA garrison & B3 SoW rally", "Ball to Ark"],
    },
    {
      lane: "B", slot: "B8", player: "Jodocast", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], anubis: false,
      tp: 9, tpWhen: "5th Spawn · 27:40", enter: "2",
      start: [],
      rest: ["Defend DA", "Push / defend SoW", "Fill B2 DA garrison & A2 Obelisk rally", "Ball to Ark"],
    },
    {
      lane: "B", slot: "B9", player: "LOTTERIA", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], anubis: false,
      tp: 14, tpWhen: "7th Spawn · 17:40", enter: "4",
      start: ["All marches to DA"],
      rest: ["Defend DA", "Push / defend SoW", "Fill B2 DA garrison & A2 Obelisk rally", "Ball to Ark"],
    },
    {
      lane: "B", slot: "Disrupt", player: "GariBAN", roleLabel: "Disrupt — take buildings",
      role: "DISRUPT", obj: ["OUT"], anubis: false,
      tp: 15, tpWhen: "7th Spawn · 17:40", enter: "3",
      start: ["1× rally enemy Outpost", "Disrupt enemy Outposts — take every Outpost with your marches"],
      rest: ["All marches Ark-running", "Keep taking enemy Outposts"],
    },

    // ===== C LANE (inner right — Desert Altar / War shrine) =====
    {
      lane: "C", slot: "C1", player: "English", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "OBE"], tile: 11, anubis: false,
      tp: 16, tpWhen: "Immediately", enter: "19",
      start: ["T1 march to Home Obelisk", "Rest of marches to enemy DA"],
      rest: ["Push enemy DA", "1 march fills SoW", "1 march fills rally"],
    },
    {
      lane: "C", slot: "C2", player: "FORCEXIII", roleLabel: "Garrison SoW / Rally DA",
      role: "GARRISON", obj: ["SOW", "DA"], tile: 21, anubis: false,
      tp: 17, tpWhen: "Immediately", enter: "14",
      start: ["Garrison mixed SoW", "Rally DA (Cav)", "3 marches to DA"],
      rest: ["Rally enemy DA (inf)", "3 marches to DA", "Keep garrison on SoW"],
    },
    {
      lane: "C", slot: "C3", player: "HORNY RABBIT", roleLabel: "Garrison DA",
      role: "GARRISON", obj: ["DA"], tile: 3, anubis: false,
      tp: 18, tpWhen: "Immediately", enter: "13",
      start: ["1 march fills C2 rally (for garrison)", "3 marches to DA"],
      rest: ["Garrison enemy DA (Inf)", "1 march fills C2 rally or D2 Obelisk"],
    },
    {
      lane: "C", slot: "C4", player: "乂 코로나 乂", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], tile: 23, anubis: false,
      tp: 20, tpWhen: "Immediately", enter: "12",
      start: ["1 march to D3 rally", "Rest of marches to enemy DA"],
      rest: ["1 march fills Obelisk", "4 marches defend SoW / push DA"],
    },
    {
      lane: "C", slot: "C5", player: "IVGI", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], tile: 38, anubis: false,
      tp: 21, tpWhen: "1st Spawn · 47:40", enter: "11",
      start: ["1 march joins D2 Obelisk rally (Inf)", "Rest of marches to enemy DA"],
      rest: ["Defend SoW", "Push / defend DA", "Fill C2 DA garrison or D2 Obelisk rally", "Ball to Ark"],
    },
    {
      lane: "C", slot: "C6", player: "ConstantinePrime", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], tile: 66, anubis: false,
      tp: 22, tpWhen: "3rd Spawn · 37:40", enter: "7",
      start: [],
      rest: ["Defend SoW", "Push / defend DA", "Fill C2 DA garrison or D2 Obelisk rally", "Ball to Ark"],
    },
    {
      lane: "C", slot: "C7", player: "Royal Prime", marker: "★", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], tile: 31, anubis: false,
      tp: 23, tpWhen: "4th Spawn · 32:40", enter: "ASAP",
      start: [],
      rest: ["Defend SoW", "Push / defend DA", "Fill C2 DA garrison or D2 Obelisk rally", "Ball to Ark"],
    },
    {
      lane: "C", slot: "C8", player: "KATTY PRIMES", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], tile: 18, anubis: false,
      tp: 24, tpWhen: "5th Spawn · 27:40", enter: "6",
      start: [],
      rest: ["Defend SoW", "Push / defend DA", "Fill C2 DA garrison or D2 Obelisk rally", "Ball to Ark"],
    },
    {
      lane: "C", slot: "C9", player: "Player456", roleLabel: "Fill",
      role: "FILL", obj: ["DA", "SOW"], tile: 20, anubis: false,
      tp: 29, tpWhen: "7th Spawn · 17:40", enter: "ASAP",
      start: ["All marches to enemy DA"],
      rest: ["Defend SoW", "Push / defend DA", "Rally troops to Ark", "Fill C2 DA garrison or D2 rally"],
    },
    {
      lane: "C", slot: "Flex", player: "G H E T T O", roleLabel: "Flex — take buildings",
      role: "FLEX", obj: ["OUT"], tile: 22, anubis: false,
      tp: 30, tpWhen: "8th Spawn · 12:40", enter: "5",
      start: ["1 march to disrupt rally", "Rest of marches help where needed"],
      rest: ["All marches Ark-running", "Take enemy Outposts"],
    },

    // ===== D LANE (outer right — Sky / Obelisk push) =====
    {
      lane: "D", slot: "D1", player: "Force13-CPT", roleLabel: "Garrison obelisk",
      role: "GARRISON", obj: ["OBE", "SA"], tile: 27, anubis: true,
      tp: 19, tpWhen: "Immediately", enter: "27",
      start: ["Garrison Obelisk (inf)", "Join D3 first rally (inf)", "3 marches to SA"],
      rest: ["Garrison Obelisk (inf)", "Fill D2 Obelisk rally", "3 marches to SA"],
    },
    {
      lane: "D", slot: "D2", player: "Kraken", roleLabel: "Rally Cav",
      role: "RALLY", obj: ["OBE", "SA"], tile: 6, anubis: false,
      tp: 25, tpWhen: "Immediately", enter: "26",
      start: ["Rally enemy Obelisk (cav)", "Fill D3 garrison", "Rest of marches to enemy SA"],
      rest: ["Rally enemy Obelisk (cav)", "Fill D3 garrison", "Rest of marches to enemy SA"],
    },
    {
      lane: "D", slot: "D3", player: "Satan Himself", roleLabel: "Garrison SA",
      role: "GARRISON", obj: ["SA"], tile: 26, anubis: false,
      tp: 26, tpWhen: "Immediately", enter: "25",
      start: ["Rally Home Obelisk (Inf)", "Rest of marches to SA"],
      rest: ["Garrison SA (Inf)", "Defend SA with all marches"],
    },
    {
      lane: "D", slot: "D4", player: "DrEvilPrime", marker: "★", roleLabel: "Fill",
      role: "FILL", obj: ["SA", "OBE"], tile: 19, anubis: false,
      tp: 27, tpWhen: "Immediately", enter: "21",
      start: ["1 march joins D3 rally", "Rest of marches to SA"],
      rest: ["All marches to SA", "Always fill Obelisk & SA garrison", "Defend / retake every building in your line"],
    },
    {
      lane: "D", slot: "D5", player: "MrKienDZ", roleLabel: "Fill",
      role: "FILL", obj: [], tile: 45, anubis: false,
      tp: 28, tpWhen: "2nd Spawn · 42:40", enter: "20",
      start: [], rest: [],
    },
  ];

  // ---- Anubis boss protocol (shared by obelisk garrisons) ------------------
  const ANUBIS = {
    title: "Anubis Boss",
    firstSpawn: "40:30",
    secondSpawn: "22:00",
    reward: "+15% points generation (minimum)",
    lines: [
      "On the FIRST spawn (40:30) all flagged marches go to the Anubis boss.",
      "Killing it grants +15% points generation.",
      "AOE hits 2 random marches every 40 seconds.",
      "If your march is targeted → GET OUT FAST.",
      "Leave 1–2 marches to defend the line if needed.",
      "Second spawn (22:00) is optional — not necessary to do it.",
    ],
  };

  // ---- Roster (Name, Power, Marches, Rally, Garrison, Vote) -----------------
  // slot = assigned battle slot id, or null = reserve / bench
  const ROSTER = [
    { name: "Ace", power: 254, marches: 6, rally: "Yes", garrison: "Yes", vote: "yes", slot: "B3" },
    { name: "Ku", power: 195, marches: null, rally: "Yes (arch)", garrison: "Yes (inf · Gorgo Hera)", vote: "yes", slot: "B2" },
    { name: "Satan Himself", power: 181, marches: "5+?", rally: "Yes", garrison: "Yes?", vote: "yes", slot: "D3" },
    { name: "Duong Tank", power: 178, marches: 6, rally: "No", garrison: "No", vote: "yes", slot: "B1" },
    { name: "English", power: 170, marches: null, rally: "—", garrison: "—", vote: "yes", slot: "C1" },
    { name: "DarkGiyu", power: 161, marches: 7, rally: "Yes (arch?)", garrison: "—", vote: "yes", slot: "A3" },
    { name: "Kobbie Prime", power: 159, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "FORCEXIII", power: 149, marches: 7, rally: "Yes (cav)", garrison: "Yes?", vote: "yes", slot: "C2" },
    { name: "Alice Prime", power: 149, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "B4" },
    { name: "SeNex", power: 143, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "A1" },
    { name: "DevilheurnPrime", power: 141, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "MrKienDZ", power: 140, marches: 6, rally: "No", garrison: "Yes (maybe inf)", vote: "yes", slot: "D5" },
    { name: "Kraken", power: 140, marches: 5, rally: "Yes ?", garrison: "—", vote: "yes", slot: "D2" },
    { name: "A9 Prime", power: 135, marches: null, rally: "—", garrison: "—", vote: "yes", slot: "B5" },
    { name: "NightxReaper", power: 126, marches: 7, rally: "—", garrison: "—", vote: "yes", slot: "A2" },
    { name: "Force13-CPT", power: 125, marches: 6, rally: "No", garrison: "Yes (inf)", vote: "yes", slot: "D1" },
    { name: "Kayy Muteki", power: 111, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "A5" },
    { name: "乂 코로나 乂", power: 109, marches: 6, rally: "No", garrison: "No", vote: "yes", slot: "C4" },
    { name: "HORNY RABBIT", power: 107, marches: 6, rally: "No", garrison: "Yes (inf)", vote: "yes", slot: "C3" },
    { name: "Devil", power: 104, marches: 6, rally: "No", garrison: "No", vote: "yes", slot: "B7" },
    { name: "Player456", power: 104, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "C9" },
    { name: "BO", power: 100, marches: 6, rally: "No", garrison: "No", vote: "yes", slot: "A4" },
    { name: "ConstantinePrime", power: 100, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "C6" },
    { name: "LOTTERIA", power: 95, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "B9" },
    { name: "Royal Prime", power: 93, marches: "3/4", rally: "No", garrison: "No", vote: "yes", slot: "C7" },
    { name: "RagPro", power: 93, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "DBawsy", power: 93, marches: 5, rally: "No", garrison: "No", vote: "?", slot: null },
    { name: "KATTY PRIMES", power: 92, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: "C8" },
    { name: "IVGI", power: 92, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "C5" },
    { name: "BordoMavi 61", power: 92, marches: 6, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "Edvenz", power: 89, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "DrEvilPrime", power: 87, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: "D4" },
    { name: "EZZO", power: 87, marches: 5, rally: "No", garrison: "No", vote: "No", slot: null },
    { name: "Deus", power: 87, marches: 5, rally: "No", garrison: "No", vote: "?", slot: null },
    { name: "YADA", power: 86, marches: null, rally: "—", garrison: "—", vote: "yes", slot: null },
    { name: "Fishy", power: 84, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "TinkyWinky", power: 84, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "AmeoPrime", power: 81, marches: 3, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "Jodocast", power: 80, marches: 6, rally: "No", garrison: "No", vote: "yes", slot: "B8" },
    { name: "Void", power: 79, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: null },
    { name: "G H E T T O", power: 79, marches: 4, rally: "No", garrison: "No", vote: "yes", slot: "Flex" },
    { name: "GariBAN", power: 76, marches: 5, rally: "No", garrison: "Yes (Cav)", vote: "yes", slot: "Disrupt" },
    { name: "Eragon Prime", power: 74, marches: 5, rally: "No", garrison: "No", vote: "yes", slot: "B6" },
    { name: "Overworked", power: null, marches: null, rally: "—", garrison: "—", vote: "?", slot: null },
    { name: "Itachi", power: null, marches: null, rally: "—", garrison: "—", vote: "No", slot: null },
  ];

  window.BP = { LANES, OBJ, ROLE, SLOTS, ANUBIS, ROSTER };
})();
