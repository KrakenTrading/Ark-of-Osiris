/* OL — Ark of Osiris battle plan. Static taxonomy + the seed (default) plan.
   Plain JS, attaches to window.BP. Editable copies live in window.OLStore.
   SEED_PLAN below is the live published plan baked in as the default. */
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

  // ---- Seed plan (the live published plan, baked in as the default) --------
  const SEED_PLAN = {
    "version": 2,
    "slots": [
      {
        "uid": "smqb4m4450",
        "marker": "★",
        "anubis": true,
        "tile": 44,
        "lane": "A",
        "slot": "A1",
        "player": "Senex",
        "roleLabel": "Garrison obelisk",
        "role": "GARRISON",
        "obj": [
          "OBE",
          "SOL"
        ],
        "tp": 10,
        "tpWhen": "Immediately",
        "enter": "15",
        "start": [
          "Fast T1 march to capture Obelisk",
          "Garrison the Obelisk",
          "Join A3 rally",
          "2 marches to SoL"
        ],
        "rest": [
          "Hold Garrison on Obelisk",
          "1 march fills A2 Obelisk rally",
          "3 marches to SA / SoL"
        ]
      },
      {
        "uid": "smqb4m4451",
        "marker": "",
        "anubis": false,
        "tile": 43,
        "lane": "A",
        "slot": "A2",
        "player": "NightxReaper",
        "roleLabel": "Rally Obelisk",
        "role": "RALLY",
        "obj": [
          "OBE",
          "SA"
        ],
        "tp": 11,
        "tpWhen": "Immediately",
        "enter": "16",
        "start": [
          "Rally enemy Obelisk",
          "All marches to SA"
        ],
        "rest": [
          "Rally enemy Obelisk",
          "Defend SoL",
          "Remaining marches to enemy SA if possible"
        ]
      },
      {
        "uid": "smqb4m4452",
        "marker": "",
        "anubis": false,
        "tile": 68,
        "lane": "A",
        "slot": "A3",
        "player": "DarkGiyu",
        "roleLabel": "Rally SA",
        "role": "RALLY",
        "obj": [
          "SA",
          "OBE"
        ],
        "tp": 12,
        "tpWhen": "Immediately",
        "enter": "17",
        "start": [
          "Rally Home Obelisk (Inf)",
          "All marches to enemy SA"
        ],
        "rest": [
          "Rally SA",
          "Garrison SA with another march",
          "Remaining marches to enemy SA"
        ]
      },
      {
        "uid": "smqb4m4453",
        "marker": "",
        "anubis": false,
        "tile": 14,
        "lane": "A",
        "slot": "A4",
        "player": "BO",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "SA"
        ],
        "tp": 5,
        "tpWhen": "Immediately",
        "enter": "18",
        "start": [
          "1 march joins A3 rally",
          "Stay in Obelisk until safe",
          "Remaining marches to enemy SA"
        ],
        "rest": [
          "Remaining marches to enemy SA",
          "1 march fills SoL",
          "1 march fills SA"
        ]
      },
      {
        "uid": "smqb4m4454",
        "marker": "",
        "anubis": false,
        "tile": 41,
        "lane": "A",
        "slot": "A5",
        "player": "Kayy Muteki",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [],
        "tp": 13,
        "tpWhen": "2nd Spawn · 42:40",
        "enter": "8",
        "start": [],
        "rest": []
      },
      {
        "uid": "smqb4m4455",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B1",
        "player": "DevilheurnPrime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA"
        ],
        "tp": 1,
        "tpWhen": "Immediately",
        "enter": "ASAP",
        "start": [
          "1 march joins B3 rally",
          "1 march garrisons B2 DA (Inf)",
          "Rest of marches to DA"
        ],
        "rest": [
          "1 march fills B3 rally (inf)",
          "1 march garrisons B2 DA (Inf)",
          "Rest of marches to DA / SoW"
        ]
      },
      {
        "uid": "smqb4m4456",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B2",
        "player": "Ku",
        "roleLabel": "Garrison DA",
        "role": "GARRISON",
        "obj": [
          "DA",
          "OBE"
        ],
        "tp": 2,
        "tpWhen": "Immediately",
        "enter": "22",
        "start": [
          "Garrison in DA (Inf)",
          "One march fills Obelisk",
          "Rest of marches to DA"
        ],
        "rest": [
          "Garrison in DA (Inf)",
          "Rest of marches defend DA",
          "One march fills B3 rally or A2 Obelisk"
        ]
      },
      {
        "uid": "smqb4m4457",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B3",
        "player": "Ace",
        "roleLabel": "Rally SoW",
        "role": "RALLY",
        "obj": [
          "SOW",
          "DA"
        ],
        "tp": 3,
        "tpWhen": "Immediately",
        "enter": "23",
        "start": [
          "Rally SoW",
          "4 marches to DA"
        ],
        "rest": [
          "1 march garrisons B2 DA (inf)",
          "Rally enemy SoW (inf)",
          "3 marches to SoW",
          "Ball to Ark if needed"
        ]
      },
      {
        "uid": "smqb4m4458",
        "marker": "㋛",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B4",
        "player": "Alice Prime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA"
        ],
        "tp": 4,
        "tpWhen": "Immediately",
        "enter": "24",
        "start": [
          "1 march to A3 rally (inf)",
          "All marches to DA"
        ],
        "rest": [
          "1 march fills B2 DA garrison",
          "4 marches defend SoW / DA",
          "Ball to Ark if needed"
        ]
      },
      {
        "uid": "smqb4m4459",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B5",
        "player": "BordoMavi 61",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 6,
        "tpWhen": "1st Spawn · 47:40",
        "enter": "9",
        "start": [
          "1 march joins A2 rally (arch)",
          "1 march joins Obelisk garrison",
          "Rest of marches to DA"
        ],
        "rest": [
          "Defend DA",
          "Push / defend SoW",
          "Fill B2 DA garrison & B3 SoW rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445a",
        "marker": "★",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B6",
        "player": "Eragon Prime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 7,
        "tpWhen": "3rd Spawn · 37:40",
        "enter": "10",
        "start": [
          "1 march joins A2 rally (arch)",
          "1 march joins Obelisk garrison",
          "Rest of marches to DA"
        ],
        "rest": [
          "Defend DA",
          "Push / defend SoW",
          "Fill B2 DA garrison & B3 SoW rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445b",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B7",
        "player": "Devil",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 8,
        "tpWhen": "4th Spawn · 32:40",
        "enter": "1",
        "start": [],
        "rest": [
          "Defend DA",
          "Push / defend SoW",
          "Fill B2 DA garrison & B3 SoW rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445c",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B8",
        "player": "Jodocast",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 9,
        "tpWhen": "5th Spawn · 27:40",
        "enter": "2",
        "start": [],
        "rest": [
          "Defend DA",
          "Push / defend SoW",
          "Fill B2 DA garrison & A2 Obelisk rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445d",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "B9",
        "player": "LOTTERIA",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 14,
        "tpWhen": "7th Spawn · 17:40",
        "enter": "4",
        "start": [
          "All marches to DA"
        ],
        "rest": [
          "Defend DA",
          "Push / defend SoW",
          "Fill B2 DA garrison & A2 Obelisk rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445e",
        "marker": "",
        "anubis": false,
        "tile": null,
        "lane": "B",
        "slot": "Disrupt",
        "player": "GariBAN",
        "roleLabel": "Disrupt — take buildings",
        "role": "DISRUPT",
        "obj": [
          "OUT"
        ],
        "tp": 15,
        "tpWhen": "7th Spawn · 17:40",
        "enter": "3",
        "start": [
          "1× rally enemy Outpost",
          "Disrupt enemy Outposts — take every Outpost with your marches"
        ],
        "rest": [
          "All marches Ark-running",
          "Keep taking enemy Outposts"
        ]
      },
      {
        "uid": "smqb4m445f",
        "marker": "",
        "anubis": false,
        "tile": 11,
        "lane": "C",
        "slot": "C1",
        "player": "Rose Prime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "OBE"
        ],
        "tp": 16,
        "tpWhen": "Immediately",
        "enter": "19",
        "start": [
          "T1 march to Home Obelisk",
          "Rest of marches to enemy DA"
        ],
        "rest": [
          "Push enemy DA",
          "1 march fills SoW",
          "1 march fills rally"
        ]
      },
      {
        "uid": "smqb4m445g",
        "marker": "",
        "anubis": false,
        "tile": 21,
        "lane": "C",
        "slot": "C2",
        "player": "FORCEXIII",
        "roleLabel": "Garrison SoW / Rally DA",
        "role": "GARRISON",
        "obj": [
          "SOW",
          "DA"
        ],
        "tp": 17,
        "tpWhen": "Immediately",
        "enter": "14",
        "start": [
          "Garrison mixed SoW",
          "Rally DA (Cav)",
          "3 marches to DA"
        ],
        "rest": [
          "Rally enemy DA (inf)",
          "3 marches to DA",
          "Keep garrison on SoW"
        ]
      },
      {
        "uid": "smqb4m445h",
        "marker": "",
        "anubis": false,
        "tile": 3,
        "lane": "C",
        "slot": "C3",
        "player": "HORNY RABBIT",
        "roleLabel": "Garrison DA",
        "role": "GARRISON",
        "obj": [
          "DA"
        ],
        "tp": 18,
        "tpWhen": "Immediately",
        "enter": "13",
        "start": [
          "1 march fills C2 rally (for garrison)",
          "3 marches to DA"
        ],
        "rest": [
          "Garrison enemy DA (Inf)",
          "1 march fills C2 rally or D2 Obelisk"
        ]
      },
      {
        "uid": "smqb4m445i",
        "marker": "",
        "anubis": false,
        "tile": 23,
        "lane": "C",
        "slot": "C4",
        "player": "乂 코로나 乂",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 20,
        "tpWhen": "Immediately",
        "enter": "12",
        "start": [
          "1 march to D3 rally",
          "Rest of marches to enemy DA"
        ],
        "rest": [
          "1 march fills Obelisk",
          "4 marches defend SoW / push DA"
        ]
      },
      {
        "uid": "smqb4m445j",
        "marker": "",
        "anubis": false,
        "tile": 38,
        "lane": "C",
        "slot": "C5",
        "player": "IVGI",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 21,
        "tpWhen": "1st Spawn · 47:40",
        "enter": "11",
        "start": [
          "1 march joins D2 Obelisk rally (Inf)",
          "Rest of marches to enemy DA"
        ],
        "rest": [
          "Defend SoW",
          "Push / defend DA",
          "Fill C2 DA garrison or D2 Obelisk rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445k",
        "marker": "",
        "anubis": false,
        "tile": 66,
        "lane": "C",
        "slot": "C6",
        "player": "Kobbie Prime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 22,
        "tpWhen": "3rd Spawn · 37:40",
        "enter": "7",
        "start": [],
        "rest": [
          "Defend SoW",
          "Push / defend DA",
          "Fill C2 DA garrison or D2 Obelisk rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445l",
        "marker": "★",
        "anubis": false,
        "tile": 31,
        "lane": "C",
        "slot": "C7",
        "player": "Royal Prime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 23,
        "tpWhen": "4th Spawn · 32:40",
        "enter": "ASAP",
        "start": [],
        "rest": [
          "Defend SoW",
          "Push / defend DA",
          "Fill C2 DA garrison or D2 Obelisk rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445m",
        "marker": "",
        "anubis": false,
        "tile": 18,
        "lane": "C",
        "slot": "C8",
        "player": "KATTY PRIMES",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 24,
        "tpWhen": "5th Spawn · 27:40",
        "enter": "6",
        "start": [],
        "rest": [
          "Defend SoW",
          "Push / defend DA",
          "Fill C2 DA garrison or D2 Obelisk rally",
          "Ball to Ark"
        ]
      },
      {
        "uid": "smqb4m445n",
        "marker": "",
        "anubis": false,
        "tile": 20,
        "lane": "C",
        "slot": "C9",
        "player": "Player456",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "DA",
          "SOW"
        ],
        "tp": 29,
        "tpWhen": "7th Spawn · 17:40",
        "enter": "ASAP",
        "start": [
          "All marches to enemy DA"
        ],
        "rest": [
          "Defend SoW",
          "Push / defend DA",
          "Rally troops to Ark",
          "Fill C2 DA garrison or D2 rally"
        ]
      },
      {
        "uid": "smqb4m445o",
        "marker": "",
        "anubis": false,
        "tile": 22,
        "lane": "C",
        "slot": "Flex",
        "player": "G H E T T O",
        "roleLabel": "Flex — take buildings",
        "role": "FLEX",
        "obj": [
          "OUT"
        ],
        "tp": 30,
        "tpWhen": "8th Spawn · 12:40",
        "enter": "5",
        "start": [
          "1 march to disrupt rally",
          "Rest of marches help where needed"
        ],
        "rest": [
          "All marches Ark-running",
          "Take enemy Outposts"
        ]
      },
      {
        "uid": "smqb4m445p",
        "marker": "",
        "anubis": true,
        "tile": 27,
        "lane": "D",
        "slot": "D1",
        "player": "Force13-CPT",
        "roleLabel": "Garrison obelisk",
        "role": "GARRISON",
        "obj": [
          "OBE",
          "SA"
        ],
        "tp": 19,
        "tpWhen": "Immediately",
        "enter": "27",
        "start": [
          "Garrison Obelisk (inf)",
          "Join D3 first rally (inf)",
          "3 marches to SA"
        ],
        "rest": [
          "Garrison Obelisk (inf)",
          "Fill D2 Obelisk rally",
          "3 marches to SA"
        ]
      },
      {
        "uid": "smqb4m445q",
        "marker": "",
        "anubis": false,
        "tile": 6,
        "lane": "D",
        "slot": "D2",
        "player": "Kraken",
        "roleLabel": "Rally Cav",
        "role": "RALLY",
        "obj": [
          "OBE",
          "SA"
        ],
        "tp": 25,
        "tpWhen": "Immediately",
        "enter": "26",
        "start": [
          "Rally enemy Obelisk (cav)",
          "Fill D3 garrison",
          "Rest of marches to enemy SA"
        ],
        "rest": [
          "Rally enemy Obelisk (cav)",
          "Fill D3 garrison",
          "Rest of marches to enemy SA"
        ]
      },
      {
        "uid": "smqb4m445r",
        "marker": "",
        "anubis": false,
        "tile": 26,
        "lane": "D",
        "slot": "D3",
        "player": "Overworked",
        "roleLabel": "Garrison SA",
        "role": "GARRISON",
        "obj": [
          "SA"
        ],
        "tp": 26,
        "tpWhen": "Immediately",
        "enter": "25",
        "start": [
          "Rally Home Obelisk (Inf)",
          "Rest of marches to SA"
        ],
        "rest": [
          "Garrison SA (Inf)",
          "Defend SA with all marches"
        ]
      },
      {
        "uid": "smqb4m445s",
        "marker": "★",
        "anubis": false,
        "tile": 19,
        "lane": "D",
        "slot": "D4",
        "player": "DrEvilPrime",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [
          "SA",
          "OBE"
        ],
        "tp": 27,
        "tpWhen": "Immediately",
        "enter": "21",
        "start": [
          "1 march joins D3 rally",
          "Rest of marches to SA"
        ],
        "rest": [
          "All marches to SA",
          "Always fill Obelisk & SA garrison",
          "Defend / retake every building in your line"
        ]
      },
      {
        "uid": "smqb4m445t",
        "marker": "",
        "anubis": false,
        "tile": 45,
        "lane": "D",
        "slot": "D5",
        "player": "MrKienDZ",
        "roleLabel": "Fill",
        "role": "FILL",
        "obj": [],
        "tp": 28,
        "tpWhen": "2nd Spawn · 42:40",
        "enter": "20",
        "start": [],
        "rest": []
      }
    ],
    "roster": [
      {
        "uid": "rmqb4m445u",
        "name": "Ace",
        "power": 257,
        "marches": 6,
        "rally": "Yes",
        "garrison": "Yes",
        "vote": "yes",
        "slot": "B3"
      },
      {
        "uid": "rmqb4m445v",
        "name": "Ku",
        "power": 197,
        "marches": null,
        "rally": "Yes (arch)",
        "garrison": "Yes (inf · Gorgo Hera)",
        "vote": "yes",
        "slot": "B2"
      },
      {
        "uid": "rmqb4m445w",
        "name": "Satan Himself",
        "power": 191,
        "marches": "5+?",
        "rally": "Yes",
        "garrison": "Yes?",
        "vote": "No",
        "slot": "D3"
      },
      {
        "uid": "rmqb4m445x",
        "name": "Duong Tank",
        "power": 180,
        "marches": 6,
        "rally": "No",
        "garrison": "No",
        "vote": "?",
        "slot": "B1"
      },
      {
        "uid": "rmqb4m445y",
        "name": "Rose Prime",
        "power": 173,
        "marches": null,
        "rally": "—",
        "garrison": "—",
        "vote": "yes",
        "slot": "C1"
      },
      {
        "uid": "rmqb4m445z",
        "name": "DarkGiyu",
        "power": 161,
        "marches": 7,
        "rally": "Yes (arch?)",
        "garrison": "—",
        "vote": "yes",
        "slot": "A3"
      },
      {
        "uid": "rmqb4m44510",
        "name": "Kobbie Prime",
        "power": 162,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m44511",
        "name": "FORCEXIII",
        "power": 154,
        "marches": 7,
        "rally": "Yes (cav)",
        "garrison": "Yes?",
        "vote": "yes",
        "slot": "C2"
      },
      {
        "uid": "rmqb4m44512",
        "name": "Alice Prime",
        "power": 149,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "B4"
      },
      {
        "uid": "rmqb4m44513",
        "name": "SeNex",
        "power": 143,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "A1"
      },
      {
        "uid": "rmqb4m44514",
        "name": "DevilheurnPrime",
        "power": 147,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m44515",
        "name": "MrKienDZ",
        "power": 142,
        "marches": 6,
        "rally": "No",
        "garrison": "Yes (maybe inf)",
        "vote": "yes",
        "slot": "D5"
      },
      {
        "uid": "rmqb4m44516",
        "name": "Kraken",
        "power": 140,
        "marches": 5,
        "rally": "Yes ?",
        "garrison": "—",
        "vote": "yes",
        "slot": "D2"
      },
      {
        "uid": "rmqb4m44517",
        "name": "A9 Prime",
        "power": 139,
        "marches": null,
        "rally": "—",
        "garrison": "—",
        "vote": "yes",
        "slot": "B5"
      },
      {
        "uid": "rmqb4m44518",
        "name": "NightxReaper",
        "power": 129,
        "marches": 7,
        "rally": "—",
        "garrison": "—",
        "vote": "yes",
        "slot": "A2"
      },
      {
        "uid": "rmqb4m44519",
        "name": "Force13-CPT",
        "power": 132,
        "marches": 6,
        "rally": "No",
        "garrison": "Yes (inf)",
        "vote": "yes",
        "slot": "D1"
      },
      {
        "uid": "rmqb4m4451a",
        "name": "Kayy Muteki",
        "power": 111,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "A5"
      },
      {
        "uid": "rmqb4m4451b",
        "name": "乂 코로나 乂",
        "power": 113,
        "marches": 6,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "C4"
      },
      {
        "uid": "rmqb4m4451c",
        "name": "HORNY RABBIT",
        "power": 111,
        "marches": 6,
        "rally": "No",
        "garrison": "Yes (inf)",
        "vote": "yes",
        "slot": "C3"
      },
      {
        "uid": "rmqb4m4451d",
        "name": "Devil",
        "power": 106,
        "marches": 6,
        "rally": "No",
        "garrison": "No",
        "vote": "No",
        "slot": "B7"
      },
      {
        "uid": "rmqb4m4451e",
        "name": "Player456",
        "power": 105,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "C9"
      },
      {
        "uid": "rmqb4m4451f",
        "name": "BO",
        "power": 103,
        "marches": 6,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "A4"
      },
      {
        "uid": "rmqb4m4451g",
        "name": "ConstantinePrime",
        "power": 103,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "C6"
      },
      {
        "uid": "rmqb4m4451h",
        "name": "LOTTERIA",
        "power": 97,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "B9"
      },
      {
        "uid": "rmqb4m4451i",
        "name": "Royal Prime",
        "power": 100,
        "marches": "3/4",
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "C7"
      },
      {
        "uid": "rmqb4m4451j",
        "name": "RagPro",
        "power": 94,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451k",
        "name": "DBawsy",
        "power": 94,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "?",
        "slot": null
      },
      {
        "uid": "rmqb4m4451l",
        "name": "KATTY PRIMES",
        "power": 96,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "C8"
      },
      {
        "uid": "rmqb4m4451m",
        "name": "IVGI",
        "power": 94,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "C5"
      },
      {
        "uid": "rmqb4m4451n",
        "name": "BordoMavi 61",
        "power": 92,
        "marches": 6,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451o",
        "name": "Edvenz",
        "power": 91,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "No",
        "slot": null
      },
      {
        "uid": "rmqb4m4451p",
        "name": "DrEvilPrime",
        "power": 90,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "D4"
      },
      {
        "uid": "rmqb4m4451q",
        "name": "EZZO",
        "power": 90,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "No",
        "slot": null
      },
      {
        "uid": "rmqb4m4451r",
        "name": "Deus",
        "power": 89,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "No",
        "slot": null
      },
      {
        "uid": "rmqb4m4451s",
        "name": "YADA",
        "power": 90,
        "marches": null,
        "rally": "—",
        "garrison": "—",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451t",
        "name": "Fishy",
        "power": 86,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451u",
        "name": "TinkyWinky",
        "power": 86,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451v",
        "name": "AmeoPrime",
        "power": 84,
        "marches": 3,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451w",
        "name": "Jodocast",
        "power": 91,
        "marches": 6,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "B8"
      },
      {
        "uid": "rmqb4m4451x",
        "name": "Void",
        "power": 79,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m4451y",
        "name": "G H E T T O",
        "power": 84,
        "marches": 4,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "Flex"
      },
      {
        "uid": "rmqb4m4451z",
        "name": "GariBAN",
        "power": 80,
        "marches": 5,
        "rally": "No",
        "garrison": "Yes (Cav)",
        "vote": "yes",
        "slot": "Disrupt"
      },
      {
        "uid": "rmqb4m44520",
        "name": "Eragon Prime",
        "power": 80,
        "marches": 5,
        "rally": "No",
        "garrison": "No",
        "vote": "yes",
        "slot": "B6"
      },
      {
        "uid": "rmqb4m44521",
        "name": "Overworked",
        "power": null,
        "marches": null,
        "rally": "—",
        "garrison": "—",
        "vote": "yes",
        "slot": null
      },
      {
        "uid": "rmqb4m44522",
        "name": "Itachi",
        "power": null,
        "marches": null,
        "rally": "—",
        "garrison": "—",
        "vote": "No",
        "slot": null
      }
    ],
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
    "meta": {
      "title": "Ark of Osiris",
      "weekLabel": "14 June Divison Finals",
      "matchTimeUTC": "2026-06-14T15:00"
    }
  };

  const SLOTS  = SEED_PLAN.slots;
  const ROSTER = SEED_PLAN.roster;
  const ANUBIS = SEED_PLAN.anubis;
  const META   = SEED_PLAN.meta;

  window.BP = { LANES, OBJ, ROLE, SLOTS, ANUBIS, ROSTER, META, SEED_PLAN };
})();
