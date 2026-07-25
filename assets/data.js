/* OL — Ark of Osiris battle plan. Static taxonomy + the seed (default) plan.
   Plain JS, attaches to window.BP. Editable copies live in window.OLStore.
   SEED_PLAN below is the live published plan baked in as the default. */
(function () {
  const LANES = {
    A: { id: "A", name: "A Lane", geo: "Outer lane — OUR left", accent: "obelisk" },
    B: { id: "B", name: "B Lane", geo: "Inner lane — OUR left", accent: "desert" },
    C: { id: "C", name: "C Lane", geo: "Inner lane — OUR right", accent: "desert" },
    D: { id: "D", name: "D Lane", geo: "Outer lane — OUR right", accent: "sky" },
  };

  const OBJ = {
    DA:  { key: "DA",  label: "Desert Altar",  short: "DA",  tone: "desert" },
    SA:  { key: "SA",  label: "Sky Altar",     short: "SA",  tone: "sky" },
    SOL: { key: "SOL", label: "Shrine of Life",short: "SoL", tone: "life" },
    SOW: { key: "SOW", label: "Shrine of War", short: "SoW", tone: "war" },
    OBE: { key: "OBE", label: "Obelisk",       short: "Obelisk", tone: "obelisk" },
    OUT: { key: "OUT", label: "Outpost / Ark", short: "Outpost", tone: "neutral" },
  };

  const ROLE = {
    GARRISON: { key: "GARRISON", label: "Garrison", tone: "garrison" },
    RALLY:    { key: "RALLY",    label: "Rally",    tone: "rally" },
    FILL:     { key: "FILL",     label: "Fill",     tone: "fill" },
    DISRUPT:  { key: "DISRUPT",  label: "Disrupt",  tone: "disrupt" },
    FLEX:     { key: "FLEX",     label: "Flex",     tone: "disrupt" },
  };

  const SEED_PLAN = {
    "version": 2,
    "slots": [
      { "uid": "smqb4m4450", "marker": "", "anubis": true, "tile": null, "lane": "A", "slot": "A1", "player": "", "roleLabel": "Garrison obelisk", "role": "GARRISON", "obj": ["OBE","SOL"], "tp": 10, "tpWhen": "Immediately", "enter": "15", "start": ["Fast T1 march to capture Obelisk","Garrison the Obelisk","Join A3 rally","2 marches to SoL"], "rest": ["Hold Garrison on Obelisk","1 march fills A2 Obelisk rally","3 marches to SA / SoL"] },
      { "uid": "smqb4m4451", "marker": "", "anubis": false, "tile": null, "lane": "A", "slot": "A2", "player": "", "roleLabel": "Rally Obelisk", "role": "RALLY", "obj": ["OBE","SA"], "tp": 11, "tpWhen": "Immediately", "enter": "16", "start": ["Rally enemy Obelisk","All marches to SA"], "rest": ["Rally enemy Obelisk","Defend SoL","Remaining marches to enemy SA if possible"] },
      { "uid": "smqb4m4452", "marker": "", "anubis": false, "tile": null, "lane": "A", "slot": "A3", "player": "", "roleLabel": "Rally SA", "role": "RALLY", "obj": ["SA","OBE"], "tp": 12, "tpWhen": "Immediately", "enter": "17", "start": ["Rally Home Obelisk (Inf)","All marches to enemy SA"], "rest": ["Rally SA","Garrison SA with another march","Remaining marches to enemy SA"] },
      { "uid": "smqb4m4453", "marker": "", "anubis": false, "tile": null, "lane": "A", "slot": "A4", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["SA"], "tp": 5, "tpWhen": "Immediately", "enter": "18", "start": ["1 march joins A3 rally","Stay in Obelisk until safe","Remaining marches to enemy SA"], "rest": ["Remaining marches to enemy SA","1 march fills SoL","1 march fills SA"] },
      { "uid": "smqb4m4454", "marker": "", "anubis": false, "tile": null, "lane": "A", "slot": "A5", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": [], "tp": 13, "tpWhen": "2nd Spawn · 42:40", "enter": "8", "start": [], "rest": [] },
      { "uid": "smqb4m4455", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B1", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA"], "tp": 1, "tpWhen": "Immediately", "enter": "ASAP", "start": ["1 march joins B3 rally","1 march garrisons B2 DA (Inf)","Rest of marches to DA"], "rest": ["1 march fills B3 rally (inf)","1 march garrisons B2 DA (Inf)","Rest of marches to DA / SoW"] },
      { "uid": "smqb4m4456", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B2", "player": "", "roleLabel": "Garrison DA", "role": "GARRISON", "obj": ["DA","OBE"], "tp": 2, "tpWhen": "Immediately", "enter": "22", "start": ["Garrison in DA (Inf)","One march fills Obelisk","Rest of marches to DA"], "rest": ["Garrison in DA (Inf)","Rest of marches defend DA","One march fills B3 rally or A2 Obelisk"] },
      { "uid": "smqb4m4457", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B3", "player": "", "roleLabel": "Rally SoW", "role": "RALLY", "obj": ["SOW","DA"], "tp": 3, "tpWhen": "Immediately", "enter": "23", "start": ["Rally SoW","4 marches to DA"], "rest": ["1 march garrisons B2 DA (inf)","Rally enemy SoW (inf)","3 marches to SoW","Ball to Ark if needed"] },
      { "uid": "smqb4m4458", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B4", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA"], "tp": 4, "tpWhen": "Immediately", "enter": "24", "start": ["1 march to A3 rally (inf)","All marches to DA"], "rest": ["1 march fills B2 DA garrison","4 marches defend SoW / DA","Ball to Ark if needed"] },
      { "uid": "smqb4m4459", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B5", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 6, "tpWhen": "1st Spawn · 47:40", "enter": "9", "start": ["1 march joins A2 rally (arch)","1 march joins Obelisk garrison","Rest of marches to DA"], "rest": ["Defend DA","Push / defend SoW","Fill B2 DA garrison & B3 SoW rally","Ball to Ark"] },
      { "uid": "smqb4m445a", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B6", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 7, "tpWhen": "3rd Spawn · 37:40", "enter": "10", "start": ["1 march joins A2 rally (arch)","1 march joins Obelisk garrison","Rest of marches to DA"], "rest": ["Defend DA","Push / defend SoW","Fill B2 DA garrison & B3 SoW rally","Ball to Ark"] },
      { "uid": "smqb4m445b", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B7", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 8, "tpWhen": "4th Spawn · 32:40", "enter": "1", "start": [], "rest": ["Defend DA","Push / defend SoW","Fill B2 DA garrison & B3 SoW rally","Ball to Ark"] },
      { "uid": "smqb4m445c", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B8", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 9, "tpWhen": "5th Spawn · 27:40", "enter": "2", "start": [], "rest": ["Defend DA","Push / defend SoW","Fill B2 DA garrison & A2 Obelisk rally","Ball to Ark"] },
      { "uid": "smqb4m445d", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "B9", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 14, "tpWhen": "7th Spawn · 17:40", "enter": "4", "start": ["All marches to DA"], "rest": ["Defend DA","Push / defend SoW","Fill B2 DA garrison & A2 Obelisk rally","Ball to Ark"] },
      { "uid": "smqb4m445e", "marker": "", "anubis": false, "tile": null, "lane": "B", "slot": "Disrupt", "player": "", "roleLabel": "Disrupt — take buildings", "role": "DISRUPT", "obj": ["OUT"], "tp": 15, "tpWhen": "7th Spawn · 17:40", "enter": "3", "start": ["1× rally enemy Outpost","Disrupt enemy Outposts — take every Outpost with your marches"], "rest": ["All marches Ark-running","Keep taking enemy Outposts"] },
      { "uid": "smqb4m445f", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C1", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","OBE"], "tp": 16, "tpWhen": "Immediately", "enter": "19", "start": ["T1 march to Home Obelisk","Rest of marches to enemy DA"], "rest": ["Push enemy DA","1 march fills SoW","1 march fills rally"] },
      { "uid": "smqb4m445g", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C2", "player": "", "roleLabel": "Garrison SoW / Rally DA", "role": "GARRISON", "obj": ["SOW","DA"], "tp": 17, "tpWhen": "Immediately", "enter": "14", "start": ["Garrison mixed SoW","Rally DA (Cav)","3 marches to DA"], "rest": ["Rally enemy DA (inf)","3 marches to DA","Keep garrison on SoW"] },
      { "uid": "smqb4m445h", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C3", "player": "", "roleLabel": "Garrison DA", "role": "GARRISON", "obj": ["DA"], "tp": 18, "tpWhen": "Immediately", "enter": "13", "start": ["1 march fills C2 rally (for garrison)","3 marches to DA"], "rest": ["Garrison enemy DA (Inf)","1 march fills C2 rally or D2 Obelisk"] },
      { "uid": "smqb4m445i", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C4", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 20, "tpWhen": "Immediately", "enter": "12", "start": ["1 march to D3 rally","Rest of marches to enemy DA"], "rest": ["1 march fills Obelisk","4 marches defend SoW / push DA"] },
      { "uid": "smqb4m445j", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C5", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 21, "tpWhen": "1st Spawn · 47:40", "enter": "11", "start": ["1 march joins D2 Obelisk rally (Inf)","Rest of marches to enemy DA"], "rest": ["Defend SoW","Push / defend DA","Fill C2 DA garrison or D2 Obelisk rally","Ball to Ark"] },
      { "uid": "smqb4m445k", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C6", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 22, "tpWhen": "3rd Spawn · 37:40", "enter": "7", "start": [], "rest": ["Defend SoW","Push / defend DA","Fill C2 DA garrison or D2 Obelisk rally","Ball to Ark"] },
      { "uid": "smqb4m445l", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C7", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 23, "tpWhen": "4th Spawn · 32:40", "enter": "ASAP", "start": [], "rest": ["Defend SoW","Push / defend DA","Fill C2 DA garrison or D2 Obelisk rally","Ball to Ark"] },
      { "uid": "smqb4m445m", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C8", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 24, "tpWhen": "5th Spawn · 27:40", "enter": "6", "start": [], "rest": ["Defend SoW","Push / defend DA","Fill C2 DA garrison or D2 Obelisk rally","Ball to Ark"] },
      { "uid": "smqb4m445n", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "C9", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["DA","SOW"], "tp": 29, "tpWhen": "7th Spawn · 17:40", "enter": "ASAP", "start": ["All marches to enemy DA"], "rest": ["Defend SoW","Push / defend DA","Rally troops to Ark","Fill C2 DA garrison or D2 rally"] },
      { "uid": "smqb4m445o", "marker": "", "anubis": false, "tile": null, "lane": "C", "slot": "Flex", "player": "", "roleLabel": "Flex — take buildings", "role": "FLEX", "obj": ["OUT"], "tp": 30, "tpWhen": "8th Spawn · 12:40", "enter": "5", "start": ["1 march to disrupt rally","Rest of marches help where needed"], "rest": ["All marches Ark-running","Take enemy Outposts"] },
      { "uid": "smqb4m445p", "marker": "", "anubis": true, "tile": null, "lane": "D", "slot": "D1", "player": "", "roleLabel": "Garrison obelisk", "role": "GARRISON", "obj": ["OBE","SA"], "tp": 19, "tpWhen": "Immediately", "enter": "27", "start": ["Garrison Obelisk (inf)","Join D3 first rally (inf)","3 marches to SA"], "rest": ["Garrison Obelisk (inf)","Fill D2 Obelisk rally","3 marches to SA"] },
      { "uid": "smqb4m445q", "marker": "", "anubis": false, "tile": null, "lane": "D", "slot": "D2", "player": "", "roleLabel": "Rally Cav", "role": "RALLY", "obj": ["OBE","SA"], "tp": 25, "tpWhen": "Immediately", "enter": "26", "start": ["Rally enemy Obelisk (cav)","Fill D3 garrison","Rest of marches to enemy SA"], "rest": ["Rally enemy Obelisk (cav)","Fill D3 garrison","Rest of marches to enemy SA"] },
      { "uid": "smqb4m445r", "marker": "", "anubis": false, "tile": null, "lane": "D", "slot": "D3", "player": "", "roleLabel": "Garrison SA", "role": "GARRISON", "obj": ["SA"], "tp": 26, "tpWhen": "Immediately", "enter": "25", "start": ["Rally Home Obelisk (Inf)","Rest of marches to SA"], "rest": ["Garrison SA (Inf)","Defend SA with all marches"] },
      { "uid": "smqb4m445s", "marker": "", "anubis": false, "tile": null, "lane": "D", "slot": "D4", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": ["SA","OBE"], "tp": 27, "tpWhen": "Immediately", "enter": "21", "start": ["1 march joins D3 rally","Rest of marches to SA"], "rest": ["All marches to SA","Always fill Obelisk & SA garrison","Defend / retake every building in your line"] },
      { "uid": "smqb4m445t", "marker": "", "anubis": false, "tile": null, "lane": "D", "slot": "D5", "player": "", "roleLabel": "Fill", "role": "FILL", "obj": [], "tp": 28, "tpWhen": "2nd Spawn · 42:40", "enter": "20", "start": [], "rest": [] }
    ],
    "roster": [],
    "anubis": {
      "title": "Anubis Boss",
      "firstSpawn": "40:30",
      "secondSpawn": "22:00",
      "reward": "+15% points generation (minimum)",
      "lines": [
        "On the FIRST spawn (40:30) all flagged marches go to the Anubis boss.",
        "Killing it grants +15% points generation.",
        "AOE hits 2 random marches every 40 seconds.",
        "If your march is targeted → GET OUT FAST.",
        "Leave 1–2 marches to defend the line if needed.",
        "Second spawn (22:00) is optional — not necessary to do it."
      ]
    },
    "meta": { "title": "Ark of Osiris", "weekLabel": "", "matchTimeUTC": "" }
  };

  const SLOTS  = SEED_PLAN.slots;
  const ROSTER = SEED_PLAN.roster;
  const ANUBIS = SEED_PLAN.anubis;
  const META   = SEED_PLAN.meta;

  window.BP = { LANES, OBJ, ROLE, SLOTS, ANUBIS, ROSTER, META, SEED_PLAN };
})();
