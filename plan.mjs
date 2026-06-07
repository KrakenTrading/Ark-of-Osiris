<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>OL — Ark of Osiris Battle Plan</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
:root{
  --bg:        oklch(0.18 0.012 70);
  --bg2:       oklch(0.21 0.013 70);
  --panel:     oklch(0.24 0.014 72);
  --panel2:    oklch(0.27 0.015 74);
  --line:      oklch(0.34 0.018 74);
  --line2:     oklch(0.40 0.02 76);
  --ink:       oklch(0.95 0.01 80);
  --ink2:      oklch(0.78 0.015 80);
  --ink3:      oklch(0.62 0.015 80);
  --gold:      oklch(0.80 0.13 78);
  --gold-dim:  oklch(0.66 0.10 78);
  /* objective tones (shared chroma/lightness, varied hue) */
  --desert:    oklch(0.74 0.13 70);
  --sky:       oklch(0.74 0.11 235);
  --life:      oklch(0.74 0.13 150);
  --war:       oklch(0.66 0.16 25);
  --obelisk:   oklch(0.72 0.12 300);
  --neutral:   oklch(0.70 0.02 80);
  /* role tones */
  --garrison:  oklch(0.72 0.10 215);
  --rally:     oklch(0.80 0.13 78);
  --fill:      oklch(0.66 0.015 80);
  --disrupt:   oklch(0.66 0.16 25);
}
*{box-sizing:border-box;}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:"Barlow",system-ui,sans-serif;}
body{
  background:
    radial-gradient(1100px 600px at 78% -8%, oklch(0.26 0.03 78 / .55), transparent 60%),
    radial-gradient(900px 500px at -5% 8%, oklch(0.24 0.02 300 / .35), transparent 55%),
    var(--bg);
  min-height:100vh;
}
#root{max-width:1320px;margin:0 auto;padding:0 18px 60px;}
h1,h2,h3,h4,h5{font-family:"Oswald",sans-serif;font-weight:600;margin:0;letter-spacing:.01em;}
b{font-weight:600;}

/* ---------------- hero ---------------- */
.hero{padding:26px 4px 18px;position:relative;}
.hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.brand{display:flex;align-items:center;gap:16px;}
.crest{
  width:60px;height:60px;flex:0 0 auto;display:grid;place-items:center;
  font-family:"Oswald";font-weight:700;font-size:24px;letter-spacing:.04em;
  color:var(--bg);background:linear-gradient(160deg,var(--gold),var(--gold-dim));
  border-radius:11px;box-shadow:0 6px 22px oklch(0.6 0.12 78 / .35), inset 0 1px 0 oklch(1 0 0 / .4);
}
.brand-txt h1{font-size:29px;line-height:1;text-transform:uppercase;letter-spacing:.055em;white-space:nowrap;}
.brand-txt p{margin:6px 0 0;color:var(--ink3);font-size:13.5px;letter-spacing:.02em;}
.hero-stats{margin-top:16px;display:flex;align-items:center;gap:10px;color:var(--ink3);
  font-family:"JetBrains Mono",monospace;font-size:12.5px;letter-spacing:.02em;flex-wrap:wrap;}
.hero-stats b{color:var(--gold);font-weight:700;}
.hero-stats .dot{color:var(--line2);}

/* search */
.search{position:relative;min-width:240px;flex:0 1 320px;}
.search-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--ink3);font-size:17px;}
.search input{
  width:100%;padding:13px 14px 13px 38px;border-radius:11px;
  background:var(--panel);border:1px solid var(--line);color:var(--ink);
  font-family:"Barlow";font-size:15px;outline:none;transition:border-color .15s,box-shadow .15s;
}
.search input::placeholder{color:var(--ink3);}
.search input:focus{border-color:var(--gold-dim);box-shadow:0 0 0 3px oklch(0.66 0.10 78 / .18);}
.search-pop{
  position:absolute;top:calc(100% + 8px);left:0;right:0;z-index:30;
  background:var(--panel2);border:1px solid var(--line2);border-radius:12px;overflow:hidden;
  box-shadow:0 18px 50px oklch(0 0 0 / .5);
}
.search-item{
  width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:11px 14px;background:none;border:0;border-bottom:1px solid var(--line);
  color:var(--ink);font-family:"Barlow";font-size:14.5px;cursor:pointer;text-align:left;
}
.search-item:last-child{border-bottom:0;}
.search-item:hover{background:var(--panel);}
.si-slot{font-family:"JetBrains Mono";font-size:12px;font-weight:700;color:var(--bg);
  background:var(--gold);padding:3px 8px;border-radius:6px;}
.si-res{font-family:"JetBrains Mono";font-size:11px;color:var(--ink3);
  border:1px solid var(--line2);padding:3px 8px;border-radius:6px;}

/* ---------------- tabs ---------------- */
.tabs{display:flex;gap:6px;margin:8px 0 22px;border-bottom:1px solid var(--line);
  position:sticky;top:0;z-index:20;background:linear-gradient(var(--bg),var(--bg) 70%,transparent);
  padding-top:8px;flex-wrap:wrap;}
.tabs button{
  background:none;border:0;color:var(--ink3);font-family:"Oswald";font-size:15px;
  text-transform:uppercase;letter-spacing:.06em;padding:11px 16px;cursor:pointer;
  border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .15s;
}
.tabs button:hover{color:var(--ink2);}
.tabs button.on{color:var(--gold);border-bottom-color:var(--gold);}

.tab-intro{color:var(--ink2);font-size:14px;line-height:1.55;margin:0 0 18px;max-width:760px;}
.tab-intro b{color:var(--ink);font-family:"JetBrains Mono";font-weight:500;font-size:12.5px;}

/* ---------------- anubis banner ---------------- */
.anubis{
  display:flex;gap:18px;margin-bottom:22px;padding:18px 20px;border-radius:14px;
  background:linear-gradient(135deg, oklch(0.27 0.04 78 / .9), oklch(0.23 0.02 300 / .6));
  border:1px solid oklch(0.5 0.08 78 / .5);box-shadow:inset 0 1px 0 oklch(1 0 0 /.06);
}
.anubis-glyph{font-size:46px;line-height:1;color:var(--gold);flex:0 0 auto;
  text-shadow:0 0 24px oklch(0.7 0.12 78 / .55);}
.anubis-body{flex:1;}
.anubis-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.anubis-head h3{font-size:20px;text-transform:uppercase;letter-spacing:.05em;color:var(--gold);}
.anubis-times{display:flex;gap:16px;flex-wrap:wrap;font-family:"JetBrains Mono";font-size:11.5px;}
.anubis-times span{display:flex;flex-direction:column;color:var(--ink3);}
.anubis-times i{font-style:normal;text-transform:uppercase;letter-spacing:.08em;font-size:9.5px;}
.anubis-times b{color:var(--ink);font-size:14px;font-weight:700;}
.anubis-times .reward b{color:var(--life);}
.anubis-lines{margin:12px 0 10px;padding:0;list-style:none;display:grid;
  grid-template-columns:1fr 1fr;gap:5px 22px;}
.anubis-lines li{position:relative;padding-left:16px;color:var(--ink2);font-size:13px;line-height:1.45;}
.anubis-lines li::before{content:"›";position:absolute;left:0;color:var(--gold-dim);}
.anubis-who{font-size:12.5px;color:var(--ink3);border-top:1px solid var(--line);padding-top:9px;}
.anubis-who b{color:var(--ink);}

/* ---------------- board ---------------- */
.board{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.lane{background:var(--bg2);border:1px solid var(--line);border-radius:14px;padding:12px;
  display:flex;flex-direction:column;}
.lane-head{padding:4px 4px 12px;border-bottom:1px dashed var(--line2);margin-bottom:12px;}
.lane-title{display:flex;align-items:center;gap:11px;}
.lane-letter{width:34px;height:34px;flex:0 0 auto;display:grid;place-items:center;border-radius:9px;
  font-family:"Oswald";font-weight:700;font-size:18px;color:var(--bg);}
.lane-obelisk .lane-letter{background:var(--obelisk);}
.lane-desert  .lane-letter{background:var(--desert);}
.lane-sky     .lane-letter{background:var(--sky);}
.lane-name{font-family:"Oswald";font-size:16px;text-transform:uppercase;letter-spacing:.04em;}
.lane-geo{font-size:11px;color:var(--ink3);margin-top:1px;}
.lane-objs{display:flex;gap:5px;margin-top:11px;flex-wrap:wrap;}
.lane-slots{display:flex;flex-direction:column;gap:9px;}

/* slot card */
.slot-card{background:var(--panel);border:1px solid var(--line);border-radius:11px;
  padding:11px 11px 9px;cursor:pointer;transition:border-color .14s,background .14s,transform .1s;}
.slot-card:hover{border-color:var(--line2);background:var(--panel2);}
.slot-card.is-open{border-color:var(--gold-dim);}
.slot-card.is-selected{border-color:var(--gold);box-shadow:0 0 0 3px oklch(0.7 0.1 78 / .22);
  animation:pulse 1.1s ease-out;}
@keyframes pulse{0%{box-shadow:0 0 0 6px oklch(0.7 0.1 78 / .4);}100%{box-shadow:0 0 0 3px oklch(0.7 0.1 78 / .22);}}
.slot-top{display:flex;align-items:center;gap:9px;}
.slot-id{font-family:"JetBrains Mono";font-weight:700;font-size:12px;color:var(--gold);
  background:oklch(0.7 0.1 78 / .12);border:1px solid oklch(0.7 0.1 78 / .25);
  padding:3px 7px;border-radius:6px;flex:0 0 auto;min-width:34px;text-align:center;}
.slot-name-wrap{flex:1;min-width:0;}
.slot-name{display:block;font-weight:600;font-size:14.5px;line-height:1.15;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.slot-role-label{display:block;font-size:11px;color:var(--ink3);margin-top:1px;}
.slot-power{font-family:"JetBrains Mono";font-weight:700;font-size:14px;color:var(--ink);
  text-align:right;flex:0 0 auto;line-height:1;}
.slot-power i{display:block;font-style:normal;font-size:8px;color:var(--ink3);
  text-transform:uppercase;letter-spacing:.1em;margin-top:2px;font-weight:400;}
.marker{color:var(--gold);margin-left:5px;font-size:12px;}

.slot-meta{display:flex;align-items:center;gap:7px;margin:9px 0 8px;flex-wrap:wrap;}
.tag-row{display:flex;gap:4px;flex-wrap:wrap;}
.anubis-flag{margin-left:auto;font-family:"JetBrains Mono";font-size:10px;color:var(--gold);
  border:1px solid oklch(0.7 0.1 78 /.4);border-radius:5px;padding:2px 6px;white-space:nowrap;}

.slot-orderbar{display:flex;align-items:center;gap:9px;padding-top:8px;border-top:1px solid var(--line);}
.ob{display:flex;flex-direction:column;line-height:1;}
.ob i{font-style:normal;font-size:8.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);}
.ob b{font-family:"JetBrains Mono";font-size:12.5px;font-weight:700;color:var(--ink);margin-top:3px;}
.ob-toggle{margin-left:auto;font-size:11px;color:var(--gold-dim);font-weight:600;white-space:nowrap;}

.orders{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line2);cursor:default;
  display:flex;flex-direction:column;gap:11px;opacity:1;}
.order-col h5{font-family:"Oswald";font-size:11px;text-transform:uppercase;letter-spacing:.1em;
  color:var(--gold);margin-bottom:6px;}
.order-col ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;}
.order-col li{position:relative;padding-left:15px;font-size:12.5px;line-height:1.4;color:var(--ink2);}
.order-col li::before{content:"";position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:1px;
  background:var(--gold-dim);}
.order-foot{font-size:11.5px;color:var(--ink3);font-family:"JetBrains Mono";}
.order-foot b{color:var(--ink2);}

/* tags & roles */
.tag{font-family:"JetBrains Mono";font-size:10px;font-weight:700;letter-spacing:.02em;
  padding:2px 6px;border-radius:5px;color:var(--bg);white-space:nowrap;}
.tone-desert{background:var(--desert);} .tone-sky{background:var(--sky);}
.tone-life{background:var(--life);} .tone-war{background:var(--war);color:var(--ink);}
.tone-obelisk{background:var(--obelisk);} .tone-neutral{background:var(--neutral);}
.role{font-family:"Oswald";font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;
  padding:2px 9px;border-radius:20px;border:1px solid transparent;}
.role-garrison{color:var(--garrison);border-color:oklch(0.72 0.10 215 / .5);background:oklch(0.72 0.10 215 /.12);}
.role-rally{color:var(--rally);border-color:oklch(0.8 0.13 78 /.5);background:oklch(0.8 0.13 78 /.12);}
.role-fill{color:var(--ink2);border-color:var(--line2);background:oklch(0.66 0.015 80 /.1);}
.role-disrupt{color:var(--disrupt);border-color:oklch(0.66 0.16 25 /.5);background:oklch(0.66 0.16 25 /.12);}

/* ---------------- teleport timeline ---------------- */
.tl-phase{margin-bottom:22px;}
.tl-phead{display:flex;align-items:center;gap:11px;margin:0 2px 9px;padding-bottom:8px;
  border-bottom:1px solid var(--line);}
.tl-pstep{width:24px;height:24px;flex:0 0 auto;display:grid;place-items:center;border-radius:50%;
  font-family:"JetBrains Mono";font-weight:700;font-size:12px;color:var(--bg);background:var(--gold);}
.tl-pname{font-family:"Oswald";font-size:17px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink);}
.tl-ptime{font-family:"JetBrains Mono";font-size:13px;font-weight:700;color:var(--sky);
  background:oklch(0.74 0.11 235 /.12);padding:2px 9px;border-radius:6px;}
.tl-pcount{margin-left:auto;font-family:"JetBrains Mono";font-size:11px;color:var(--ink3);
  text-transform:uppercase;letter-spacing:.06em;}
.timeline{display:flex;flex-direction:column;gap:5px;}
.tl-row{display:grid;grid-template-columns:52px 58px 1fr auto 86px;align-items:center;gap:12px;
  width:100%;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:9px;
  padding:10px 13px;cursor:pointer;color:var(--ink);transition:border-color .14s,background .14s;}
.tl-row:hover{border-color:var(--gold-dim);background:var(--panel2);}
.tl-no{font-family:"JetBrains Mono";font-weight:700;font-size:15px;color:var(--gold);}
.tl-lane{font-family:"JetBrains Mono";font-weight:700;font-size:12px;text-align:center;
  padding:3px 0;border-radius:6px;color:var(--bg);}
.lane-dot-obelisk{background:var(--obelisk);} .lane-dot-desert{background:var(--desert);}
.lane-dot-sky{background:var(--sky);}
.tl-name{font-weight:600;font-size:14.5px;}
.tl-role{justify-self:start;}
.tl-enter{font-family:"JetBrains Mono";font-size:11.5px;color:var(--ink3);text-align:right;}

/* ---------------- map tab ---------------- */
.map-figure{margin:0 0 14px;border:1px solid var(--line);border-radius:14px;overflow:hidden;
  background:var(--bg2);box-shadow:0 10px 34px oklch(0 0 0 /.35);}
.map-figure img{display:block;width:100%;height:auto;}
.map-legend{display:flex;gap:22px;flex-wrap:wrap;margin-bottom:22px;
  font-size:13px;color:var(--ink2);font-family:"Barlow";}
.map-legend span{display:flex;align-items:center;gap:8px;}
.ml-dot{width:12px;height:12px;border-radius:50%;display:inline-block;}
.ml-top{background:#7aa7e6;} .ml-bot{background:#e88b8b;}
.map-grid{display:grid;grid-template-columns:1fr;gap:16px;}

/* ---------------- roster ---------------- */
.roster-bar{display:flex;justify-content:flex-end;margin-bottom:14px;}
.seg{display:inline-flex;background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:3px;gap:3px;}
.seg button{background:none;border:0;color:var(--ink3);font-family:"Oswald";font-size:12.5px;
  text-transform:uppercase;letter-spacing:.05em;padding:7px 13px;border-radius:7px;cursor:pointer;}
.seg button.on{background:var(--gold);color:var(--bg);font-weight:600;}
.table-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:13px;}
table.roster{width:100%;border-collapse:collapse;min-width:680px;}
.roster th{font-family:"Oswald";font-size:11.5px;text-transform:uppercase;letter-spacing:.07em;
  color:var(--ink3);text-align:left;padding:12px 14px;background:var(--bg2);
  border-bottom:1px solid var(--line);white-space:nowrap;position:sticky;top:0;}
.roster th.sortable{cursor:pointer;user-select:none;}
.roster th.sortable:hover{color:var(--ink2);}
.roster th.active{color:var(--gold);}
.roster td{padding:11px 14px;border-bottom:1px solid var(--line);font-size:13.5px;color:var(--ink2);}
.roster tbody tr{transition:background .12s;}
.roster tbody tr:hover{background:var(--panel);}
.roster tbody tr[onclick],.roster tbody tr{cursor:pointer;}
.roster tr.is-reserve{opacity:.62;}
.roster .rn{color:var(--ink);font-weight:600;white-space:nowrap;}
.roster .num{font-family:"JetBrains Mono";font-weight:500;}
.roster .cap{font-size:12.5px;}
.slot-chip{font-family:"JetBrains Mono";font-size:11.5px;font-weight:700;color:var(--bg);
  background:var(--gold);padding:3px 9px;border-radius:6px;cursor:pointer;}
.res-chip{font-family:"JetBrains Mono";font-size:11px;color:var(--ink3);border:1px solid var(--line2);
  padding:3px 9px;border-radius:6px;}
.pip{font-family:"JetBrains Mono";font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;}
.pip-yes{color:var(--life);background:oklch(0.74 0.13 150 /.13);}
.pip-no{color:var(--disrupt);background:oklch(0.66 0.16 25 /.14);}
.pip-maybe{color:var(--ink3);background:oklch(0.7 0.02 80 /.12);}

/* ---------------- legend ---------------- */
.legend-grid{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:16px;}
.legend section{background:var(--bg2);border:1px solid var(--line);border-radius:13px;padding:18px 20px;}
.legend h4{font-size:15px;text-transform:uppercase;letter-spacing:.05em;color:var(--gold);margin-bottom:14px;}
.legend h4 span{color:var(--ink3);font-size:11px;letter-spacing:0;text-transform:none;}
.gloss{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:11px;}
.gloss li{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--ink2);}
.geo-map{display:flex;gap:6px;align-items:stretch;margin-bottom:12px;}
.geo-lane{flex:1;border-radius:8px;padding:14px 6px;text-align:center;color:var(--bg);
  display:flex;flex-direction:column;gap:3px;}
.geo-lane b{font-family:"Oswald";font-size:18px;}
.geo-lane span{font-family:"JetBrains Mono";font-size:9px;opacity:.85;}
.gl-obelisk{background:var(--obelisk);} .gl-desert{background:var(--desert);} .gl-sky{background:var(--sky);}
.geo-mid{flex:0 0 60px;display:grid;place-items:center;text-align:center;border-radius:8px;
  border:1px dashed var(--line2);font-family:"JetBrains Mono";font-size:9px;color:var(--ink3);
  text-transform:uppercase;letter-spacing:.05em;line-height:1.4;}
.geo-note{font-size:12.5px;color:var(--ink3);line-height:1.5;margin:0;}

.foot{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);
  color:var(--ink3);font-size:12px;text-align:center;}

/* ---------------- hero bar / countdown ---------------- */
.hero-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end;}

/* cloud pill */
.cloud-pill{display:inline-flex;align-items:center;gap:7px;font-family:"JetBrains Mono",monospace;
  font-size:11px;letter-spacing:.02em;padding:7px 11px;border-radius:8px;border:1px solid var(--line2);
  background:var(--panel);color:var(--ink2);white-space:nowrap;}
.cp-dot{width:7px;height:7px;border-radius:50%;background:var(--ink3);}
.cp-live .cp-dot{background:var(--life);box-shadow:0 0 8px oklch(0.74 0.13 150 /.7);}
.cp-offline .cp-dot{background:var(--gold-dim);}
.cp-loading .cp-dot{background:var(--ink3);animation:blink 1s infinite;}
.pub-stamp{font-family:"JetBrains Mono",monospace;font-size:10.5px;color:var(--ink3);white-space:nowrap;}

/* organiser */
.org-btn{font-family:"Oswald";font-size:12.5px;text-transform:uppercase;letter-spacing:.05em;
  padding:8px 13px;border-radius:9px;cursor:pointer;background:var(--panel);color:var(--ink2);
  border:1px solid var(--line2);transition:.12s;}
.org-btn:hover{background:var(--panel2);color:var(--ink);border-color:var(--gold-dim);}
.org-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:var(--panel);
  border:1px solid var(--line2);border-radius:10px;padding:5px 6px 5px 11px;}
.org-tag{font-family:"Oswald";font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--gold);}
.pub-btn{display:inline-flex;align-items:center;gap:7px;font-family:"Oswald";font-size:12.5px;
  text-transform:uppercase;letter-spacing:.04em;padding:8px 13px;border-radius:8px;cursor:pointer;
  border:1px solid transparent;transition:.12s;}
.pub-dot{width:7px;height:7px;border-radius:50%;background:currentColor;}
.pub-dirty{background:var(--gold);color:var(--bg);font-weight:600;}
.pub-dirty:hover{filter:brightness(1.08);}
.pub-busy{background:var(--panel2);color:var(--ink3);cursor:default;}
.pub-done{background:oklch(0.74 0.13 150 /.16);color:var(--life);cursor:default;border-color:oklch(0.74 0.13 150 /.4);}
.pub-clean{background:var(--panel2);color:var(--ink3);cursor:default;}
.pub-offline{background:var(--panel2);color:var(--ink3);cursor:default;}
.pub-error{background:oklch(0.66 0.16 25 /.16);color:var(--war);border-color:var(--war);font-weight:600;}
.org-out{width:28px;height:28px;flex:0 0 auto;display:grid;place-items:center;border-radius:7px;
  background:none;border:1px solid var(--line2);color:var(--ink3);cursor:pointer;font-size:11px;}
.org-out:hover{color:var(--war);border-color:var(--war);}
.org-warn{flex:1 1 100%;font-size:11.5px;color:var(--gold);padding-top:3px;}
.org-warn button{background:none;border:0;color:var(--gold);text-decoration:underline;cursor:pointer;font-size:11.5px;font-family:inherit;}
.org-err{flex:1 1 100%;font-size:11.5px;color:var(--war);padding-top:2px;}
.org-saved{font-family:"JetBrains Mono";font-size:10.5px;color:var(--ink3);}

/* modal */
.modal-veil{position:fixed;inset:0;z-index:80;background:oklch(0.1 0.01 70 /.7);
  display:grid;place-items:center;padding:20px;backdrop-filter:blur(2px);}
.modal{width:100%;max-width:380px;background:var(--panel2);border:1px solid var(--line2);
  border-radius:15px;padding:24px;box-shadow:0 24px 70px oklch(0 0 0 /.55);}
.modal h3{font-family:"Oswald";font-size:18px;text-transform:uppercase;letter-spacing:.04em;color:var(--gold);}
.modal-sub{font-size:13px;color:var(--ink2);line-height:1.5;margin:8px 0 16px;}
.modal-input{margin-bottom:12px;}
.modal-err{font-size:12.5px;color:var(--war);margin-bottom:10px;}
.modal-note{font-size:12px;color:var(--ink3);line-height:1.5;margin-bottom:12px;
  background:var(--bg2);border:1px solid var(--line);border-radius:8px;padding:9px 11px;}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;}

/* hero stats / countdown */
.hero-bar{display:flex;align-items:center;gap:18px;margin-top:16px;flex-wrap:wrap;}
.match-chip{display:flex;align-items:center;gap:11px;background:var(--panel);
  border:1px solid var(--line2);border-radius:11px;padding:9px 14px;}
.mc-ico{font-size:16px;color:var(--gold);}
.cd{display:flex;align-items:center;gap:14px;font-family:"JetBrains Mono",monospace;}
.cd-when{font-size:12px;color:var(--ink2);letter-spacing:.01em;}
.cd-none{font-size:12px;color:var(--ink3);}
.cd-clock{display:flex;align-items:flex-end;gap:6px;}
.cd-clock b{font-size:18px;font-weight:700;color:var(--gold);line-height:1;display:flex;align-items:baseline;gap:1px;}
.cd-clock b i{font-style:normal;font-size:9px;color:var(--ink3);font-weight:500;}
.cd.is-past .cd-when{color:var(--ink3);}
.cd .cd-live{color:var(--life);font-size:15px;animation:blink 1.2s step-start infinite;}
.cd .cd-ended{color:var(--ink3);font-size:14px;}
@keyframes blink{50%{opacity:.35;}}
.cd-lg .cd-clock b{font-size:24px;}
.cd-lg .cd-when{font-size:13px;}
.hero-bar .hero-stats{margin-top:0;}

/* unfilled / empty seats */
.unfilled{font-style:italic;color:var(--ink3);font-weight:400;}
.slot-card.is-empty{border-style:dashed;opacity:.82;}
.slot-card.is-empty .slot-id{background:oklch(0.7 0.02 80 /.12);color:var(--ink3);border-color:var(--line2);}
.lane-empty{font-size:12.5px;color:var(--ink3);font-style:italic;padding:10px 6px;text-align:center;
  border:1px dashed var(--line2);border-radius:9px;}

/* ---------------- Manage tab ---------------- */
.manage-sub{display:inline-flex;background:var(--panel);border:1px solid var(--line);border-radius:10px;
  padding:3px;gap:3px;margin-bottom:20px;flex-wrap:wrap;}
.manage-sub button{background:none;border:0;color:var(--ink3);font-family:"Oswald";font-size:13px;
  text-transform:uppercase;letter-spacing:.05em;padding:9px 16px;border-radius:7px;cursor:pointer;transition:.12s;}
.manage-sub button.on{background:var(--gold);color:var(--bg);font-weight:600;}
.manage-sub button:not(.on):hover{color:var(--ink2);}
.mgr-hint{font-size:13px;color:var(--ink2);line-height:1.55;margin:0 0 16px;max-width:820px;}
.mgr-hint b{color:var(--ink);}
.mgr-note{font-size:12px;color:var(--ink3);line-height:1.5;margin:10px 0 0;}
.mgr-note b{color:var(--ink2);}

/* buttons */
.btn{font-family:"Oswald";font-size:13px;text-transform:uppercase;letter-spacing:.04em;
  padding:9px 16px;border-radius:9px;cursor:pointer;border:1px solid transparent;transition:.12s;}
.btn-add{background:var(--gold);color:var(--bg);font-weight:600;border-color:var(--gold);}
.btn-add:hover{filter:brightness(1.08);}
.btn-ghost{background:var(--panel);color:var(--ink2);border-color:var(--line2);}
.btn-ghost:hover{background:var(--panel2);color:var(--ink);}
.btn-danger-solid{background:var(--war);color:var(--ink);border-color:var(--war);font-weight:600;}
.btn-danger-solid:hover{filter:brightness(1.1);}
.btn-icon{width:30px;height:30px;flex:0 0 auto;display:grid;place-items:center;border-radius:8px;
  background:var(--panel);border:1px solid var(--line2);color:var(--ink2);cursor:pointer;font-size:12px;transition:.12s;}
.btn-icon:hover{background:var(--panel2);color:var(--ink);}
.btn-icon.btn-danger:hover{background:oklch(0.66 0.16 25 /.18);color:var(--war);border-color:var(--war);}

/* inputs */
.minput,.mselect,.mtextarea{font-family:"Barlow";font-size:13.5px;color:var(--ink);
  background:var(--bg2);border:1px solid var(--line2);border-radius:8px;padding:8px 10px;outline:none;
  width:100%;transition:border-color .12s,box-shadow .12s;}
.minput:focus,.mselect:focus,.mtextarea:focus{border-color:var(--gold-dim);box-shadow:0 0 0 3px oklch(0.66 0.10 78 /.16);}
.mselect{cursor:pointer;-webkit-appearance:none;appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--ink3) 50%),linear-gradient(135deg,var(--ink3) 50%,transparent 50%);background-position:calc(100% - 14px) 16px,calc(100% - 9px) 16px;background-size:5px 5px;background-repeat:no-repeat;padding-right:26px;}
.mtextarea{resize:vertical;line-height:1.5;font-size:13px;}
.minput.tiny,.mselect.tiny{width:auto;min-width:62px;}
.minput.sm{min-width:90px;}
.fld{display:flex;flex-direction:column;gap:5px;}
.fld-lbl{font-family:"Oswald";font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);}

/* slot editor */
.lane-block{margin-bottom:22px;}
.lane-block-head{display:flex;align-items:center;gap:12px;padding-bottom:10px;margin-bottom:12px;
  border-bottom:1px solid var(--line);}
.lb-letter{width:32px;height:32px;flex:0 0 auto;display:grid;place-items:center;border-radius:8px;
  font-family:"Oswald";font-weight:700;font-size:16px;color:var(--bg);}
.lb-title{flex:1;display:flex;flex-direction:column;line-height:1.25;}
.lb-title b{font-family:"Oswald";font-size:15px;text-transform:uppercase;letter-spacing:.03em;}
.lb-title span{font-size:11.5px;color:var(--ink3);}
.slot-editor{background:var(--bg2);border:1px solid var(--line);border-radius:11px;padding:11px 12px;margin-bottom:9px;}
.slot-editor.is-open{border-color:var(--line2);}
.se-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.se-slotid{width:62px;flex:0 0 auto;font-family:"JetBrains Mono";font-weight:700;text-align:center;color:var(--gold);}
.se-player{flex:1;min-width:150px;}
.se-role{width:128px;flex:0 0 auto;}
.se-lane{width:96px;flex:0 0 auto;}
.se-row2{display:flex;align-items:flex-end;gap:14px;margin-top:11px;flex-wrap:wrap;}
.se-anubis{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink2);cursor:pointer;margin-left:auto;
  padding-bottom:8px;white-space:nowrap;}
.se-anubis input{width:16px;height:16px;accent-color:var(--gold);}
.se-extra{margin-top:13px;padding-top:13px;border-top:1px dashed var(--line2);display:flex;flex-direction:column;gap:14px;}
.se-objs{display:flex;flex-direction:column;gap:7px;}
.chip-tog-row{display:flex;gap:6px;flex-wrap:wrap;}
.chip-tog{font-family:"JetBrains Mono";font-size:11px;font-weight:700;padding:5px 10px;border-radius:6px;
  border:1px solid var(--line2);background:var(--bg);color:var(--ink3);cursor:pointer;transition:.12s;}
.chip-tog.on{color:var(--bg);}
.chip-tog.on.tone-desert{background:var(--desert);border-color:var(--desert);}
.chip-tog.on.tone-sky{background:var(--sky);border-color:var(--sky);}
.chip-tog.on.tone-life{background:var(--life);border-color:var(--life);}
.chip-tog.on.tone-war{background:var(--war);border-color:var(--war);color:var(--ink);}
.chip-tog.on.tone-obelisk{background:var(--obelisk);border-color:var(--obelisk);}
.chip-tog.on.tone-neutral{background:var(--neutral);border-color:var(--neutral);}
.se-orders-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.se-marker{display:flex;flex-direction:column;gap:5px;max-width:160px;}
.se-view{align-self:flex-start;}

/* roster editor */
.rmgr-bar{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px;flex-wrap:wrap;}
.rmgr-bar .mgr-hint{margin:0;flex:1;}
table.roster-edit{width:100%;border-collapse:collapse;min-width:760px;}
.roster-edit th{font-family:"Oswald";font-size:11px;text-transform:uppercase;letter-spacing:.06em;
  color:var(--ink3);text-align:left;padding:10px 10px;background:var(--bg2);border-bottom:1px solid var(--line);white-space:nowrap;}
.roster-edit td{padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:middle;}
.roster-edit td .minput{padding:6px 8px;}

/* match & setup */
.match-mgr{display:flex;flex-direction:column;gap:18px;max-width:880px;}
.mblock{background:var(--bg2);border:1px solid var(--line);border-radius:13px;padding:18px 20px;}
.mblock h3{font-family:"Oswald";font-size:15px;text-transform:uppercase;letter-spacing:.05em;color:var(--gold);margin-bottom:14px;}
.mblock-danger{border-color:oklch(0.5 0.1 25 /.4);}
.mb-grid{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;}
.mb-grid .fld{min-width:160px;}
.mb-grid .fld-wide{flex:1;min-width:240px;}
.cd-preview{display:flex;align-items:center;gap:16px;margin-top:16px;padding:14px 16px;
  background:var(--panel);border:1px solid var(--line2);border-radius:11px;flex-wrap:wrap;}
.cd-preview-lbl{font-family:"Oswald";font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);}
.data-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;}

/* ---------------- responsive ---------------- */
@media(max-width:1080px){
  .board{grid-template-columns:repeat(2,1fr);}
  .anubis-lines{grid-template-columns:1fr;}
  .legend-grid{grid-template-columns:1fr;}
}
@media(max-width:680px){
  .board{grid-template-columns:1fr;}
  .tl-row{grid-template-columns:44px 48px 1fr;gap:8px;}
  .tl-role,.tl-enter{display:none;}
  .map-grid{grid-template-columns:1fr;}
  .map-main{height:300px;}
  .map-sub{height:220px;}
  .brand-txt h1{font-size:24px;}
  .hero-top{gap:14px;}
  .search{flex:1 1 100%;}
  .se-orders-grid{grid-template-columns:1fr;}
  .se-role,.se-lane{width:auto;flex:1 1 120px;}
  .se-player{flex:1 1 100%;}
}
</style>
</head>
<body>
<template id="__bundler_thumbnail">
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#241c12"/>
  <rect x="30" y="30" width="40" height="40" rx="9" fill="#e0a84e"/>
  <text x="50" y="57" font-family="Oswald, sans-serif" font-weight="700" font-size="20" fill="#241c12" text-anchor="middle">OL</text>
</svg>
</template>
<div id="root"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<script src="assets/image-slot.js"></script>
<script src="assets/map-image.js"></script>
<script src="assets/data.js"></script>
<script src="assets/store.js"></script>
<script src="assets/cloud.js"></script>
<script type="text/babel" src="assets/components.jsx"></script>
<script type="text/babel" src="assets/manage.jsx"></script>
<script type="text/babel" src="assets/cloud-ui.jsx"></script>
<script type="text/babel" src="assets/app.jsx"></script>
</body>
</html>
