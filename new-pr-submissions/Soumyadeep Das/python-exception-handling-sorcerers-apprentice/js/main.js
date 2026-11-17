
/* THE SORCERER'S APPRENTICE — offline pixel-RPG controller.
   Rooms are drawn in code; no missing background/avatar file can blank the game. */
import {
  GAME_CONFIG, PLAYER, MASTER, STORY_INTRO, WORLD_MAP_LOCATIONS,
  ACADEMY_MAP_LOCATIONS, ROOMS, MATERIALS, WORLD_OBJECTS, CHAPTERS,
  MASTER_EXPERIMENT_POSITIONS, getRoom, getChapterById, getMaterialById,
  getRoomExits, isWorldLocationUnlocked
} from "./story.js";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const el = {
  app: $("#game-app"), navGame: $("#nav-game"), navMap: $("#nav-world-map"),
  navInventory: $("#nav-inventory"), navQuest: $("#nav-quest"),
  navSpellbook: $("#nav-spellbook"), navHelp: $("#nav-help"),
  gameView: $("#game-view"), mapView: $("#world-map-view"),
  inventoryView: $("#inventory-view"), questView: $("#quest-view"),
  spellbookView: $("#spellbook-view"), examView: $("#exam-view"),
  canvas: $("#game-canvas"), locationName: $("#location-name"),
  locationDescription: $("#location-description"), roomHeading: $("#room-heading"),
  roomRegion: $("#room-region"), objectCount: $("#room-object-count"),
  stars: $("#star-count"), bagCount: $("#bag-count"), chapterNumber: $("#chapter-number"),
  prompt: $("#interaction-prompt"), promptText: $("#interaction-prompt-text"),
  notification: $("#game-notification"), status: $("#game-status"),
  grab: $("#action-grab"), inspect: $("#action-inspect"), put: $("#action-put"),
  talk: $("#talk-to-master"), questPanel: $("#quest-panel"), questTitle: $("#quest-title"),
  questDescription: $("#quest-description"), questObjective: $("#quest-objective"),
  questTrack: $("#quest-progress-track"), questFill: $("#quest-progress-fill"),
  questLabel: $("#quest-progress-label"), inventory: $("#inventory-items"),
  fullInventory: $("#full-inventory-items"), objectDetails: $("#object-details"),
  companionName: $("#companion-name"), companionStatus: $("#companion-status"),
  mapImage: $("#world-map-image"), mapLocations: $("#world-map-locations"),
  mapInfo: $("#map-location-information"), mapContainer: $("#world-map-container"),
  questJournal: $("#quest-journal-content"), spellbook: $("#spellbook-content"),
  exam: $("#exam-content"), masterDialog: $("#master-dialogue"),
  dialoguePortrait: $("#dialogue-portrait"), dialogueSpeaker: $("#dialogue-speaker"),
  dialogueRole: $("#dialogue-role"), dialogueMessage: $("#dialogue-message"),
  dialogueProgress: $("#dialogue-progress"), dialogueNext: $("#dialogue-next"),
  objectDialog: $("#object-dialogue"), objectTitle: $("#object-dialogue-title"),
  objectDescription: $("#object-dialogue-description"), objectStatus: $("#object-dialogue-status"),
  objectGrab: $("#object-dialogue-grab"), objectClose: $("#object-dialogue-close"),
  helpDialog: $("#help-dialogue"), helpTitle: $("#help-dialogue-title"),
  helpContent: $("#help-dialogue-content"), helpClose: $("#help-dialogue-close")
};

const SAVE_KEY = "sorcerers-apprentice-adventure-v1";
const RESET_STORAGE_KEYS = [
    SAVE_KEY,
    "sorcerers-apprentice-support-v1",
    "sorcerers-apprentice-final-assessment-v1"
];

function resetAdventure() {
    const confirmed = window.confirm(
        "Reset the entire adventure? This will erase your collected materials, stars, completed chapters, spellbook progress and final assessment results. Your project files and Git history will not be changed."
    );

    if (!confirmed) return;

    try {
        for (const key of RESET_STORAGE_KEYS) {
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error("Could not clear saved progress.", error);
        notify("Could not reset the adventure. Check browser storage permissions.");
        return;
    }

    window.location.reload();
}
const W = GAME_CONFIG.canvas.width, H = GAME_CONFIG.canvas.height;
const HW = PLAYER.width / 2, HH = PLAYER.height / 2;
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
const canvas = el.canvas;
const ctx = canvas?.getContext("2d", { alpha: false });
const backgroundCache = new Map();

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function uniq(a) { return [...new Set((Array.isArray(a) ? a : []).filter(x => typeof x === "string"))]; }
function esc(v) { return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
function emit(name, detail = {}) { window.dispatchEvent(new CustomEvent(name, { detail })); }
function notify(message, duration = 2400) {
  if (el.notification) {
    el.notification.textContent = String(message); el.notification.hidden = false;
    clearTimeout(state.noticeTimer);
    state.noticeTimer = window.setTimeout(() => { el.notification.hidden = true; }, duration);
  }
  if (el.status) el.status.textContent = String(message);
}
function showDialog(d) { if (!d) return; if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", ""); }
function closeDialog(d) { if (!d) return; if (d.close && d.open) d.close(); else d.removeAttribute("open"); }

function readSave() {
  try { const v = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); return v && typeof v === "object" ? v : {}; }
  catch (e) { console.warn("Could not read game save; starting a new session.", e); return {}; }
}
const saved = readSave();
function startingChapter() {
  const done = uniq(saved.completedChapters);
  if (saved.currentChapterId && getChapterById(saved.currentChapterId) && !done.includes(saved.currentChapterId)) {
    const i = CHAPTERS.findIndex(c => c.id === saved.currentChapterId);
    if (i === 0 || done.includes(CHAPTERS[i - 1]?.id)) return saved.currentChapterId;
  }
  return CHAPTERS.find(c => !done.includes(c.id))?.id ?? CHAPTERS.at(-1).id;
}
const state = {
  view: "game", roomId: getRoom(saved.currentRoomId) ? saved.currentRoomId : PLAYER.startingRoomId,
  chapterId: startingChapter(),
  player: {
    x: Number.isFinite(saved.playerPosition?.x) ? saved.playerPosition.x : PLAYER.startingPosition.x,
    y: Number.isFinite(saved.playerPosition?.y) ? saved.playerPosition.y : PLAYER.startingPosition.y,
    direction: ["up","down","left","right"].includes(saved.playerDirection) ? saved.playerDirection : "down",
    moving: false, walkTime: 0
  },
  completed: uniq(saved.completedChapters), stars: Math.max(0, Number(saved.stars) || 0),
  inventory: uniq(saved.inventory).filter(id => MATERIALS[id]),
  collectedObjects: new Set(uniq(saved.collectedObjectKeys)),
  placedByChapter: saved.placedMaterialsByChapter && typeof saved.placedMaterialsByChapter === "object" ? saved.placedMaterialsByChapter : {},
  attempts: saved.attemptsByChapter && typeof saved.attemptsByChapter === "object" ? saved.attemptsByChapter : {},
  visited: new Set(uniq(saved.visitedRooms)), introSeen: Boolean(saved.introSeen),
  missionBriefed: Boolean(saved.missionBriefed), selectedObject: null, hoverObject: null,
  nearbyObject: null, nearbyExit: null, nearbyMaster: false, heldId: null, selectedId: null,
  keys: new Set(), pointerKeys: new Set(), dialogue: [], dialoguePageIndex: 0,
  dialogueDone: null, mapLayer: "world", mapSelection: null, noticeTimer: null,
  selectedTableId: null, readyChapterId: null,
  lastFrame: 0, lastSave: 0, experimentStarted: false,
  experimentAttemptOpen: false
};

const tableOwnedIds = new Set();
for (const chapter of CHAPTERS) {
  const savedIds = Array.isArray(state.placedByChapter[chapter.id])
    ? state.placedByChapter[chapter.id]
    : [];
  state.placedByChapter[chapter.id] = uniq(savedIds).filter(id =>
    chapter.requiredMaterials.includes(id) &&
    MATERIALS[id] &&
    !tableOwnedIds.has(id)
  );
  state.placedByChapter[chapter.id].forEach(id => tableOwnedIds.add(id));
}
state.inventory = state.inventory.filter(id => !tableOwnedIds.has(id));

function currentRoom() { return getRoom(state.roomId); }
function currentChapter() { return getChapterById(state.chapterId) ?? CHAPTERS[0]; }
function chapterDone(id = state.chapterId) { return state.completed.includes(id); }
function allDone() { return CHAPTERS.every(c => chapterDone(c.id)); }
function placed(chapterId = state.chapterId) {
  if (!Array.isArray(state.placedByChapter[chapterId])) state.placedByChapter[chapterId] = [];
  return state.placedByChapter[chapterId];
}
function ownsMaterial(id) {
  return state.inventory.includes(id) ||
    Object.values(state.placedByChapter).some(ids => Array.isArray(ids) && ids.includes(id));
}
function save(force = false) {
  const now = performance.now(); if (!force && now - state.lastSave < 700) return;
  state.lastSave = now;
  const data = {
    version: 3, currentRoomId: state.roomId, currentChapterId: state.chapterId,
    playerPosition: { x: state.player.x, y: state.player.y }, playerDirection: state.player.direction,
    completedChapters: state.completed, stars: state.stars, inventory: state.inventory,
    collectedObjectKeys: [...state.collectedObjects], placedMaterialsByChapter: state.placedByChapter,
    attemptsByChapter: state.attempts, visitedRooms: [...state.visited],
    introSeen: state.introSeen, missionBriefed: state.missionBriefed
  };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); }
  catch (e) { console.warn("Local progress could not be saved.", e); }
}

function station(room = currentRoom()) { return room?.experimentStation ?? null; }
function masterPosition(room = currentRoom()) {
  return room?.masterPosition ?? MASTER_EXPERIMENT_POSITIONS[room?.id] ?? null;
}
function nearStation() {
  const c = currentChapter(); const s = station();
  return state.roomId === c.experimentRoomId && Boolean(s && dist(state.player, s) <= s.radius);
}

/* Build fallback pickups for any required materials that have no world object. */
function buildObjects() {
  const result = [...WORLD_OBJECTS];
  const known = new Set(result.map(o => o.materialId).filter(Boolean));
  let n = 0;
  for (const c of CHAPTERS) for (const id of c.requiredMaterials) {
    if (known.has(id) || !MATERIALS[id]) continue;
    const roomId = c.collectionRooms.find(id => getRoom(id));
    if (!roomId) { console.error(`Required material ${id} has no valid collection room.`); continue; }
    const m = MATERIALS[id];
    result.push({ id: `fallback-${id}`, roomId, materialId: id, name: m.name,
      x: 330 + (n % 3) * 205, y: 245 + (Math.floor(n / 3) % 2) * 150,
      icon: m.icon ?? "✧", type: "material", collectible: true,
      description: m.description, isFallbackPlacement: true });
    known.add(id); n++;
    console.warn(`Backup pickup added for ${id} in ${roomId}.`);
  }
  return result;
}
const objects = buildObjects();
function objectsHere(roomId = state.roomId) { return objects.filter(o => o.roomId === roomId); }
function objectKey(o) { return `${o.roomId}::${o.id}`; }
function itemMaterial(o) { return o?.materialId ? getMaterialById(o.materialId) : null; }
function itemName(o) { return o?.name ?? itemMaterial(o)?.name ?? "Unknown object"; }
function itemDescription(o) { return o?.description ?? itemMaterial(o)?.description ?? "An object in the Master's workshop."; }
function collected(o) { return state.collectedObjects.has(objectKey(o)) || Boolean(o.materialId && ownsMaterial(o.materialId)); }
function nearestObject(max = GAME_CONFIG.interaction.objectDistance) {
  let found = null, best = max;
  for (const o of objectsHere()) { const d = dist(state.player, o); if (d <= best) { best = d; found = o; } }
  return found;
}

/* ---------- Pixel-art environment ---------- */
const C = {
  wall: "#343347", wall2: "#55546a", wallDark: "#252538", stone: "#65717c",
  stoneLight: "#84909a", stoneDark: "#46525e", wood: "#79563e", woodLight: "#a87950",
  purple: "#59427f", purpleLight: "#9174b4", gold: "#d6ad58", goldLight: "#f1d68c",
  green: "#315b3e", greenLight: "#4b7950", cream: "#ead9b5"
};
function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function tile(c, x, y, s, color, light, dark) {
  rect(c, x, y, s, s, color); rect(c, x, y, s, 2, light); rect(c, x, y, 2, s, light);
  rect(c, x, y + s - 2, s, 2, dark); rect(c, x + s - 2, y, 2, s, dark);
}
function bookshelf(c, x, y, w, h) {
  rect(c, x + 5, y + 6, w, h, "rgba(0,0,0,.25)"); rect(c, x, y, w, h, "#49332c");
  rect(c, x + 4, y + 4, w - 8, h - 8, "#684531");
  const colors = ["#8c4b47", "#446e7a", "#b18a47", "#55476e", "#55754d", "#9c6848"];
  for (let yy = y + 8; yy < y + h - 10; yy += 30) {
    let xx = x + 9;
    while (xx < x + w - 14) {
      const bh = 18 + (Math.floor(xx / 7) % 2) * 6;
      rect(c, xx, yy + 25 - bh, 10, bh, colors[Math.floor(xx + yy) % colors.length]);
      rect(c, xx + 2, yy + 28 - bh, 2, Math.max(4, bh - 7), "rgba(255,255,255,.2)"); xx += 14;
    }
    rect(c, x + 4, yy + 27, w - 8, 4, "#b17d4c");
  }
}
function desk(c, x, y, w, h) {
  rect(c, x + 5, y + h - 2, w, 12, "rgba(0,0,0,.25)"); rect(c, x, y, w, h, "#4d342b");
  rect(c, x + 4, y + 3, w - 8, h - 8, "#825b3e"); rect(c, x + 4, y + 3, w - 8, 5, "#bd8b58");
  rect(c, x + 10, y + h - 2, 7, 12, "#4d342b"); rect(c, x + w - 17, y + h - 2, 7, 12, "#4d342b");
}


function cauldron(c, x, y, scale = 1) {
  rect(c, x - 26 * scale, y + 18 * scale, 52 * scale, 9 * scale, "rgba(0,0,0,.3)");
  rect(c, x - 23 * scale, y - 10 * scale, 46 * scale, 35 * scale, "#26313a");
  rect(c, x - 27 * scale, y - 15 * scale, 54 * scale, 9 * scale, "#68737c");
  rect(c, x - 18 * scale, y - 7 * scale, 36 * scale, 7 * scale, "#5b9b89");
  rect(c, x - 5 * scale, y - 19 * scale, 5 * scale, 9 * scale, "#a7d38c");
  rect(c, x + 5 * scale, y - 23 * scale, 5 * scale, 12 * scale, "#e2b65e");
}
function tree(c, x, y, s = 1) {
  rect(c, x - 17*s, y + 20*s, 45*s, 8*s, "rgba(0,0,0,.25)");
  rect(c, x - 2*s, y + 2*s, 14*s, 32*s, "#68452f");
  rect(c, x + 2*s, y + 3*s, 4*s, 28*s, "#9a6944");
  rect(c, x - 15*s, y - 10*s, 42*s, 25*s, "#244d35");
  rect(c, x - 8*s, y - 20*s, 31*s, 22*s, "#356c43");
  rect(c, x - 1*s, y - 26*s, 19*s, 13*s, "#4e8050");
  rect(c, x - 12*s, y - 7*s, 8*s, 7*s, "#6e9754");
}
function arcaneCircle(c, x, y, radius) {
  c.save(); c.strokeStyle = "#d4b66f"; c.lineWidth = 4;
  for (const f of [1, .78, .54]) { c.beginPath(); c.arc(x, y, radius*f, 0, Math.PI*2); c.stroke(); }
  c.strokeStyle = "rgba(182,139,214,.9)"; c.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, x1 = x + Math.cos(a)*radius*.54, y1 = y + Math.sin(a)*radius*.54;
    const x2 = x + Math.cos(a)*radius, y2 = y + Math.sin(a)*radius;
    c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke(); rect(c,x2-4,y2-4,8,8,C.gold);
  }
  c.restore();
}
function drawRoomBackground(c, room) {
  const outside = room.isOutside || /forest|garden|greenhouse|outdoors/.test(room.ambience ?? "");
  if (outside) {
    rect(c,0,0,W,H,"#244b36"); let n = 0;
    for (let y=0;y<H;y+=34) for(let x=0;x<W;x+=34) {
      const colors=["#315b3e","#356441","#3b6945","#2d563b"];
      tile(c,x,y,34,colors[n++%4],"#4c7951","#214630");
    }
    const path=[[0,455,260,102],[190,390,220,105],[370,315,210,106],[560,260,210,95],[745,190,220,105],[920,110,180,100]];
    for(const [x,y,w,h] of path) { rect(c,x,y,w,h,"#8c795a"); rect(c,x+5,y+6,w-10,h-12,"#a08c68"); }
    [[110,115,1.25],[270,170,1.05],[470,110,1.1],[690,95,1.1],[930,140,1.25],[1030,410,1.15],[870,520,1.2],[600,540,1.1],[350,545,1.15],[80,560,1.05]].forEach(p=>tree(c,...p));
    [[220,300],[530,185],[780,405],[995,280]].forEach(([x,y])=>{rect(c,x,y,24,15,"#3e754a");rect(c,x+5,y-7,17,12,"#5b8a50");});
    if(room.id==="forest-temple") { rect(c,290,170,520,365,"#4d5962"); rect(c,310,190,480,325,"#78828a"); rect(c,340,220,420,270,"#495560"); arcaneCircle(c,550,355,135); }
  } else {
    rect(c,0,0,W,H,C.wallDark);
    for(let y=0;y<62;y+=29) for(let x=0;x<W;x+=72) {
      rect(c,x+2,y+2,68,25,C.wall); rect(c,x+3,y+3,65,3,C.wallLight);
    }
    rect(c,0,62,W,10,C.wallDark); rect(c,0,0,26,H,C.wallDark); rect(c,W-26,0,26,H,C.wallDark); rect(c,0,H-26,W,26,C.wallDark);
    const wood=/study|library|parlor|parlour|room|storage/.test(room.ambience ?? ""); let n=0;
    for(let y=72;y<H-58;y+=32) for(let x=26;x<W-58;x+=32) {
      if(wood) tile(c,x,y,32,(Math.floor(y/32)%2)?"#70513d":"#795a43","#9a7453","#4e3a31");
      else tile(c,x,y,32,((x/32+y/32)%2)?"#616c77":"#697580","#87929a","#43505b");
      n++;
    }
    rect(c,358,238,384,204,"#332b48"); rect(c,365,245,370,190,C.purple); rect(c,373,253,354,174,"#786197");
    for(let x=385;x<720;x+=24) { rect(c,x,257,4,4,C.gold); rect(c,x,419,4,4,C.gold); }
    const id=room.id, amb=room.ambience ?? "";
    if(id==="apprentice-chamber") {
      rect(c,110,172,180,90,"#6e4e42"); rect(c,117,179,166,75,"#9a735c"); rect(c,125,184,50,28,"#d9cdb7"); rect(c,190,188,82,52,C.purple);
      bookshelf(c,55,100,190,80); desk(c,790,185,185,65); rect(c,805,470,90,55,"#56392b");
    } else if(/potion|alchemy/.test(amb)||id==="potion-lab"||id==="alchemy-lab") {
      bookshelf(c,60,90,195,94); bookshelf(c,845,90,195,94); desk(c,335,175,410,82); cauldron(c,550,390,1.35);
      [[380,200,"#55a4a0"],[445,210,"#9472b7"],[625,206,"#b77b4b"],[690,202,"#668cc0"]].forEach(([x,y,col])=>{rect(c,x,y,18,28,col);rect(c,x+5,y-7,8,8,"#e3d3a8");});
    } else if(/library|research|study/.test(amb)||id==="academy-library"||id==="archive-annex") {
      bookshelf(c,52,100,205,445); bookshelf(c,843,100,205,445); desk(c,365,180,360,73); desk(c,430,430,230,62);
    } else if(/portal|arcane|undercroft/.test(amb)||id==="rune-chamber"||id==="portal-room") {
      arcaneCircle(c,550,330,180); rect(c,492,112,116,34,"#3d314e"); rect(c,500,118,100,20,"#9773b6");
    } else if(id==="observatory"||/celestial/.test(amb)) {
      arcaneCircle(c,550,325,190); rect(c,515,210,70,190,"#4a394f"); rect(c,530,195,40,28,C.gold);
    } else if(/garden|greenhouse/.test(amb)) {
      [[170,180],[330,470],[820,185],[960,450]].forEach(([x,y])=>{rect(c,x,y,25,16,"#3e754a");rect(c,x+4,y-9,16,12,"#5b8a50");});
    } else { bookshelf(c,72,105,165,92); desk(c,390,185,320,68); }
    for(const x of [55,1045]) { rect(c,x,165,10,34,"#54382b"); rect(c,x-4,151,18,17,"#d58b42"); rect(c,x,145,10,10,"#f3d18a"); }
  }
  c.strokeStyle="rgba(230,211,166,.5)"; c.lineWidth=3; c.strokeRect(13,13,W-26,H-26);
}


function backgroundFor(room) {
  if (backgroundCache.has(room.id)) return backgroundCache.get(room.id);
  const buffer=document.createElement("canvas"); buffer.width=W; buffer.height=H;
  const bctx=buffer.getContext("2d",{alpha:false});
  if(!bctx) return null;
  bctx.imageSmoothingEnabled=false; drawRoomBackground(bctx,room);
  backgroundCache.set(room.id,buffer);
  while(backgroundCache.size>8) backgroundCache.delete(backgroundCache.keys().next().value);
  return buffer;
}

/* ---------- Pixel characters ---------- */
function pixel(c,x,y,w,h,color,s=2) { rect(c,x*s,y*s,w*s,h*s,color); }
function drawApprentice() {
  const p=state.player, x=Math.round(p.x-20), y=Math.round(p.y-27), step=p.moving&&!reduceMotion?Math.floor(p.walkTime*9)%2:0;
  ctx.save(); ctx.translate(x,y);
  pixel(ctx,2,18,16,3,"rgba(0,0,0,.28)");
  pixel(ctx,1,9,4,7,"#805737"); pixel(ctx,2,10,2,4,"#b1804e");
  pixel(ctx,5,8,11,2,"#202844"); pixel(ctx,3,10,15,7,"#30395e"); pixel(ctx,5,11,3,6,"#46517d"); pixel(ctx,13,11,3,6,"#46517d");
  pixel(ctx,5,14,11,1,"#d9b76d"); pixel(ctx,6,17,3,2,"#3b2d2b"); pixel(ctx,13,17,3,2,"#3b2d2b");
  pixel(ctx,6+(step? -1:0),19,4,2,"#5a3b32"); pixel(ctx,12+(step?1:0),19,4,2,"#5a3b32");
  pixel(ctx,7,3,8,6,"#d6a07c"); pixel(ctx,6,4,2,4,"#54372d"); pixel(ctx,14,4,2,4,"#54372d"); pixel(ctx,7,2,8,3,"#54372d"); pixel(ctx,9,2,4,1,"#76503a");
  if(p.direction==="down"){pixel(ctx,9,6,1,1,"#282335");pixel(ctx,13,6,1,1,"#282335");}
  if(p.direction==="left"){pixel(ctx,7,6,1,1,"#282335");pixel(ctx,6,7,1,2,"#54372d");}
  if(p.direction==="right"){pixel(ctx,14,6,1,1,"#282335");pixel(ctx,15,7,1,2,"#54372d");}
  if(p.direction==="up"){pixel(ctx,6,4,10,5,"#54372d");pixel(ctx,8,3,6,2,"#76503a");}
  pixel(ctx,p.direction==="left"?1:17,11,1,8,"#b98b56"); pixel(ctx,p.direction==="left"?1:17,10,1,2,"#d9b76d");
  if(state.heldId) pixel(ctx,17,15,2,2,"#f1d68c");
  ctx.restore();
}
function drawMasterSprite(x,y) {
  ctx.save();ctx.translate(Math.round(x-20),Math.round(y-27));
  pixel(ctx,3,18,16,3,"rgba(0,0,0,.3)"); pixel(ctx,5,8,11,2,"#25354f"); pixel(ctx,3,10,15,8,"#344b70"); pixel(ctx,5,11,3,7,"#526c8f");pixel(ctx,13,11,3,7,"#526c8f");pixel(ctx,5,16,11,1,"#d7b36b");
  pixel(ctx,7,3,8,6,"#d9ad88");pixel(ctx,6,4,2,5,"#c9c5bb");pixel(ctx,14,4,2,5,"#c9c5bb");pixel(ctx,7,2,8,3,"#c9c5bb");pixel(ctx,7,7,8,4,"#e1ded5");pixel(ctx,10,6,1,1,"#282335");pixel(ctx,14,6,1,1,"#282335");
  pixel(ctx,18,5,1,14,"#9b7449");pixel(ctx,17,4,3,2,"#d7b36b");ctx.restore();
  text(ctx,MASTER.name,x,y-48,"bold 12px 'Segoe UI',sans-serif","#fff2d5");
}
function drawSorcererSprite(x,y) {
  ctx.save();ctx.translate(Math.round(x-20),Math.round(y-27));
  pixel(ctx,4,18,14,3,"rgba(0,0,0,.3)");pixel(ctx,5,9,11,2,"#271e38");pixel(ctx,3,11,15,7,"#3c294d");pixel(ctx,4,17,13,2,"#211b31");pixel(ctx,4,17,4,1,"#d6ad58");pixel(ctx,14,17,3,1,"#d6ad58");
  pixel(ctx,6,4,10,5,"#cda483");pixel(ctx,4,4,3,5,"#302340");pixel(ctx,14,4,3,5,"#302340");pixel(ctx,5,2,10,4,"#332341");pixel(ctx,8,6,1,1,"#9f3c4a");pixel(ctx,13,6,1,1,"#9f3c4a");pixel(ctx,18,5,1,14,"#7a4b39");pixel(ctx,17,3,3,3,"#b4454b");ctx.restore();
  text(ctx,"The Sorcerer",x,y-52,"bold 12px 'Segoe UI',sans-serif","#f3d58d");
}
function text(c,value,x,y,font="bold 12px 'Segoe UI',sans-serif",color="#fff4dc") {
  c.save();c.font=font;c.textAlign="center";c.textBaseline="middle";c.fillStyle=color;c.shadowColor="rgba(0,0,0,.8)";c.shadowBlur=4;c.fillText(String(value),x,y);c.restore();
}
function drawIcon(o,x,y) {
  const id=(o.materialId??o.id??"").toLowerCase();
  if(/herb|leaf|moss|thistle|shade|seed|vine|mushroom/.test(id)) {
    rect(ctx,x-2,y-12,4,24,"#4b7c48");rect(ctx,x-12,y-5,11,6,"#6d9d58");rect(ctx,x+1,y-10,12,6,"#80a85f");rect(ctx,x-9,y+3,8,5,"#94b86d");return;
  }
  if(/potion|vial|water|flask/.test(id)) {
    rect(ctx,x-5,y-13,10,6,"#c6b58d");rect(ctx,x-4,y-7,8,4,"#816044");rect(ctx,x-10,y-3,20,17,"#4a9b9a");rect(ctx,x-7,y,14,9,"#82c7bd");return;
  }
  if(/crystal|stone|moonstone|orb/.test(id)) {
    rect(ctx,x-5,y-12,10,6,"#a8c8e3");rect(ctx,x-10,y-6,20,14,"#648db8");rect(ctx,x-6,y-3,12,8,"#9fc9e0");rect(ctx,x-5,y+8,10,5,"#455f8c");return;
  }
  if(/scroll|spellbook|bookmark|class|quill|notebook/.test(id)) {
    rect(ctx,x-10,y-13,20,26,"#6b4934");rect(ctx,x-7,y-10,14,20,"#e1d1a9");rect(ctx,x-4,y-5,9,2,"#876c4d");rect(ctx,x-4,y,9,2,"#876c4d");rect(ctx,x-4,y+5,7,2,"#876c4d");return;
  }
  // Runes and tools.
  rect(ctx,x-10,y-10,20,20,"#57416f");rect(ctx,x-7,y-7,14,14,"#9b79b8");rect(ctx,x-2,y-9,4,18,"#f0d38b");rect(ctx,x-8,y-2,16,4,"#d6ad58");
}


function drawObject(o) {
  const isNear=state.nearbyObject&&objectKey(state.nearbyObject)===objectKey(o);
  const isSelected=state.selectedObject&&objectKey(state.selectedObject)===objectKey(o);
  const isDone=collected(o);
  ctx.save();ctx.globalAlpha=isDone?.55:1;
  ctx.fillStyle="rgba(0,0,0,.28)";ctx.beginPath();ctx.ellipse(o.x,o.y+13,24,8,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=isDone?"#315d49":o.collectible?"#4b3a65":"#393444";
  ctx.beginPath();ctx.arc(o.x,o.y,isNear||isSelected?25:21,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=isNear||isSelected?"#f1d58f":o.collectible?"#d6ad58":"#a79ab3";ctx.lineWidth=isNear?3:1.5;ctx.stroke();
  drawIcon(o,o.x,o.y);
  ctx.restore();
  if(isNear||isSelected) {
    const label=itemName(o);ctx.font="bold 12px 'Segoe UI',sans-serif";const width=Math.min(250,ctx.measureText(label).width+18);
    rect(ctx,o.x-width/2,o.y-51,width,22,"rgba(25,23,38,.92)");text(ctx,label,o.x,o.y-40,"bold 12px 'Segoe UI',sans-serif","#fff4dc");
  }
  if(isDone){ctx.fillStyle="#cfe8cb";ctx.beginPath();ctx.arc(o.x+17,o.y-17,8,0,Math.PI*2);ctx.fill();text(ctx,"✓",o.x+17,o.y-17,"bold 11px sans-serif","#244f3c");}
}
function drawExit(exit) {
  const near=state.nearbyExit?.id===exit.id;
  const locked=Boolean(exit.requiredChapterId&&!state.completed.includes(exit.requiredChapterId));
  ctx.fillStyle=near?"rgba(243,210,137,.32)":"rgba(23,22,36,.55)";ctx.beginPath();ctx.arc(exit.x,exit.y,near?37:29,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=locked?"#c78086":near?"#f1d58f":"rgba(244,230,191,.65)";ctx.lineWidth=near?3:2;ctx.stroke();
  text(ctx,locked?"🔒":"🚪",exit.x,exit.y,"24px 'Segoe UI Emoji',sans-serif");
  if(near)text(ctx,exit.label,exit.x,exit.y-43,"bold 12px 'Segoe UI',sans-serif");
}
function drawStation(room) {
  const s=station(room);if(!s)return;
  ctx.fillStyle="rgba(0,0,0,.35)";ctx.beginPath();ctx.ellipse(s.x,s.y+25,92,28,0,0,Math.PI*2);ctx.fill();
  rect(ctx,s.x-77,s.y-28,154,72,"#30283f");rect(ctx,s.x-72,s.y-23,144,62,"#68513e");
  ctx.strokeStyle="#d6ad58";ctx.lineWidth=3;ctx.strokeRect(s.x-77,s.y-28,154,72);
  const contents=placed().filter(id=>currentChapter().requiredMaterials.includes(id));
  if(contents.length) {
    contents.slice(0,6).forEach((id,index)=>{
      const x=s.x-44+(index%3)*44,y=s.y-11+Math.floor(index/3)*27;
      ctx.fillStyle="#3c3048";ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#d4b66f";ctx.lineWidth=1.5;ctx.stroke();
      drawIcon({materialId:id},x,y);
    });
  } else {
    ctx.strokeStyle="#d4b66f";ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y+8,30,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(s.x,s.y+8,19,0,Math.PI*2);ctx.stroke();
    text(ctx,"✧",s.x,s.y+8,"bold 26px Georgia","#f1d68c");
  }
  text(ctx,s.label,s.x,s.y-43,"bold 11px 'Segoe UI',sans-serif");
}

/* ---------- Background / foreground canvas ---------- */
function draw() {
  if(!ctx||!canvas)return;
  const dpr=Math.min(window.devicePixelRatio||1,2), pw=Math.round(W*dpr), ph=Math.round(H*dpr);
  if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);
  const room=currentRoom();if(!room)return;
  let bg=backgroundCache.get(room.id);
  if(!bg){bg=document.createElement("canvas");bg.width=W;bg.height=H;const bctx=bg.getContext("2d",{alpha:false});if(bctx){bctx.imageSmoothingEnabled=false;drawRoomBackground(bctx,room);backgroundCache.set(room.id,bg);while(backgroundCache.size>8)backgroundCache.delete(backgroundCache.keys().next().value);}else bg=null;}
  if(bg)ctx.drawImage(bg,0,0,W,H);else drawRoomBackground(ctx,room);
  room.exits.forEach(drawExit);drawStation(room);
  objectsHere().forEach(drawObject);
  const mp=room.id===currentChapter().masterRoomId?masterPosition(room):null;
  if(mp)drawMasterSprite(mp.x,mp.y);
  drawApprentice();
  if(allDone()&&room.id==="tower-study")drawSorcererSprite(980,370);
  ctx.strokeStyle="rgba(230,211,166,.45)";ctx.lineWidth=3;ctx.strokeRect(12,12,W-24,H-24);
}


/* ---------- Movement, collision and room transitions ---------- */
function inputBlocked() { return state.view!=="game"||Boolean(el.masterDialog?.open||el.objectDialog?.open||el.helpDialog?.open||window.SA_EXPERIMENTS?.isOpen?.()); }
const keyDirections={ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};
function isDown(direction){return state.keys.has(direction)||state.pointerKeys.has(direction);}
function movementVector(){let dx=(isDown("right")?1:0)-(isDown("left")?1:0),dy=(isDown("down")?1:0)-(isDown("up")?1:0);if(dx&&dy){dx*=Math.SQRT1_2;dy*=Math.SQRT1_2;}return{dx,dy};}
function collides(x,y,room){return (room.collisionRects??[]).some(r=>x>r.x-HW&&x<r.x+r.width+HW&&y>r.y-HH&&y<r.y+r.height+HH);}
function canMove(x,y,room){const b=room.walkBounds??{left:28,top:72,right:W-28,bottom:H-26};return x>=b.left+HW&&x<=b.right-HW&&y>=b.top+HH&&y<=b.bottom-HH&&!collides(x,y,room);}
function updateMovement(dt){if(inputBlocked()){state.player.moving=false;return;}const {dx,dy}=movementVector();state.player.moving=Boolean(dx||dy);if(!dx&&!dy)return;const speed=GAME_CONFIG.movement.speed,room=currentRoom();if(dx<0)state.player.direction="left";else if(dx>0)state.player.direction="right";else if(dy<0)state.player.direction="up";else state.player.direction="down";const nx=state.player.x+dx*speed*dt,ny=state.player.y+dy*speed*dt;if(canMove(nx,state.player.y,room))state.player.x=nx;if(canMove(state.player.x,ny,room))state.player.y=ny;state.player.walkTime+=dt;}
function nearestExit(max=95){let found=null,best=max;for(const exit of getRoomExits(state.roomId,{completedChapters:state.completed})){const d=dist(state.player,exit);if(d<=best){best=d;found=exit;}}return found;}
function transition(exit){if(!exit)return;if(exit.requiredChapterId&&!state.completed.includes(exit.requiredChapterId)){notify(exit.lockedMessage??"This passage is still sealed.");return;}const next=getRoom(exit.targetRoomId);if(!next){notify("This passage is unavailable.");return;}const previous=state.roomId;state.roomId=next.id;const spawn=exit.targetSpawn??next.spawn??PLAYER.startingPosition;const b=next.walkBounds??{left:28,top:72,right:W-28,bottom:H-26};state.player.x=clamp(spawn.x,b.left+HW,b.right-HW);state.player.y=clamp(spawn.y,b.top+HH,b.bottom-HH);state.player.direction="down";state.player.moving=false;state.nearbyObject=state.nearbyExit=state.hoverObject=state.selectedObject=null;state.heldId=state.selectedId=null;state.visited.add(next.id);save(true);updatePanels();draw();notify(`Entered ${next.name}`);emit("sa:room-entered",{fromRoomId:previous,roomId:next.id,room:next});if(next.id===currentChapter().masterRoomId&&!chapterDone())window.setTimeout(talkToMaster,180);}
function nearestMaster(){const room=currentRoom();if(room.id!==currentChapter().masterRoomId)return false;const p=masterPosition(room);return Boolean(p&&dist(state.player,p)<=125);}
function updateTargets(){const old=state.nearbyObject?objectKey(state.nearbyObject):"",oldExit=state.nearbyExit?.id??"";state.nearbyObject=nearestObject();state.nearbyExit=nearestExit();state.nearbyMaster=nearestMaster();const next=state.nearbyObject?objectKey(state.nearbyObject):"";if(old!==next||oldExit!==(state.nearbyExit?.id??"")){updateNearbyPanel();draw();}const inRange=nearStation();if(state.tableInRange!==inRange){state.tableInRange=inRange;updateQuest();}let message="";if(state.nearbyExit)message=`Press E to ${state.nearbyExit.label}`;else if(state.nearbyObject)message=collected(state.nearbyObject)?`${itemName(state.nearbyObject)} · already collected`:`Press E to inspect ${itemName(state.nearbyObject)}`;else if(state.nearbyMaster)message="Press E to speak with the Master";if(el.prompt){el.prompt.hidden=!message;if(el.promptText)el.promptText.textContent=message;}}
function gameLoop(now){if(!state.lastFrame)state.lastFrame=now;const dt=Math.min((now-state.lastFrame)/1000,.05);state.lastFrame=now;updateMovement(dt);updateTargets();draw();if(state.player.moving)save();window.requestAnimationFrame(gameLoop);}

/* ---------- Inspection and inventory ---------- */
function inspectObject(o){if(!o){notify("Move closer to an object or click one to inspect it.");return;}state.selectedObject=o;updateNearbyPanel();draw();const m=itemMaterial(o),done=collected(o);if(el.objectTitle)el.objectTitle.textContent=itemName(o);if(el.objectStatus)el.objectStatus.textContent=done?"Already collected":o.collectible?"Collectible material":"World object";const parts=[`<p>${esc(itemDescription(o))}</p>`];if(m?.category)parts.push(`<p><strong>Material type:</strong> ${esc(m.category)}</p>`);if(m?.pythonMeaning)parts.push(`<p><strong>Python connection:</strong> ${esc(m.pythonMeaning)}</p>`);if(m?.pythonExample)parts.push(`<pre class="lesson-code"><code>${esc(m.pythonExample)}</code></pre>`);if(el.objectDescription)el.objectDescription.innerHTML=parts.join("");if(el.objectGrab){el.objectGrab.disabled=!o.collectible||done;el.objectGrab.textContent=done?"Already in Bag":o.collectible?"Grab Object":"Not Collectible";}showDialog(el.objectDialog);emit("sa:object-inspected",{objectId:o.id,roomId:o.roomId,materialId:o.materialId??null});}
function grabObject(o=state.nearbyObject){if(!o){notify("Move closer to a material before grabbing it.");return;}if(dist(state.player,o)>GAME_CONFIG.interaction.grabDistance){notify("Move a little closer to grab this object.");return;}if(!o.collectible||!o.materialId){notify("This object can be inspected, but it cannot be collected.");return;}if(!MATERIALS[o.materialId]){notify("This object has no material record.");return;}if(ownsMaterial(o.materialId)){state.collectedObjects.add(objectKey(o));notify(`${itemName(o)} is already in your bag or on the experiment table.`);return;}if(state.inventory.length>=GAME_CONFIG.inventory.maximumUniqueItems){notify("Your shoulder bag is full.");return;}state.inventory.push(o.materialId);state.collectedObjects.add(objectKey(o));state.heldId=o.materialId;state.selectedId=o.materialId;save(true);updatePanels();draw();notify(`${getMaterialById(o.materialId).name} collected.`);emit("sa:material-collected",{materialId:o.materialId,objectId:o.id,roomId:o.roomId,material:getMaterialById(o.materialId)});closeDialog(el.objectDialog);}
function grabNearest(){grabObject(state.nearbyObject??nearestObject(GAME_CONFIG.interaction.grabDistance));}
function inspectNearest(){inspectObject(state.nearbyObject??nearestObject(GAME_CONFIG.interaction.inspectDistance));}
function renderInventoryItems(container){if(!container)return;if(!state.inventory.length){container.innerHTML=`<div class="inventory-empty"><span aria-hidden="true">◇</span><p>Your bag is empty.</p><small>Explore the rooms to find useful materials.</small></div>`;return;}container.innerHTML=state.inventory.map(id=>{const m=getMaterialById(id);if(!m)return"";const selected=state.selectedId===id,held=state.heldId===id;return `<button class="inventory-item ${selected?"is-selected":""}" type="button" data-inventory-item="${esc(id)}" aria-pressed="${selected}" title="${esc(m.description??m.name)}"><span class="item-icon" aria-hidden="true">${esc(m.icon??"✧")}</span><strong>${esc(m.name)}</strong><small>${held?"In hand":selected?"Selected":"In bag"}</small></button>`;}).join("");}


function renderInventory(){renderInventoryItems(el.inventory);renderInventoryItems(el.fullInventory);if(el.bagCount)el.bagCount.textContent=String(state.inventory.length);}
function selectInventoryItem(id){if(!state.inventory.includes(id))return;state.selectedTableId=null;state.selectedId=id;state.heldId=id;notify(`${getMaterialById(id)?.name??id} selected.`);renderInventory();renderExperimentTableMaterials();draw();}
function allCollected(c=currentChapter()){return c.requiredMaterials.every(ownsMaterial);}
function allPlaced(c=currentChapter()){return c.requiredMaterials.every(id=>placed(c.id).includes(id));}
function putOrRelease(){
  const c=currentChapter(),p=placed(c.id);
  if(!nearStation()){notify("Stand beside the Potion Lab experiment table to move materials.");return;}
  if(state.selectedTableId){
    const tableId=state.selectedTableId,index=p.indexOf(tableId);
    if(index<0){state.selectedTableId=null;notify("That material is no longer on this table.");return;}
    if(!state.inventory.includes(tableId))state.inventory.push(tableId);
    p.splice(index,1);state.selectedTableId=null;state.readyChapterId=null;state.experimentAttemptOpen=false;
    state.heldId=state.selectedId=tableId;save(true);updatePanels();draw();
    notify(`${getMaterialById(tableId)?.name??tableId} returned to your shoulder bag.`);
    return;
  }
  const id=state.heldId??state.selectedId;
  if(!id||!state.inventory.includes(id)){notify("Select an item from your shoulder bag first.");return;}
  if(!c.requiredMaterials.includes(id)){notify("The Master has not requested this item for this experiment.");return;}
  if(p.includes(id)){notify("That material is already on the experiment table.");return;}
  const m=getMaterialById(id);
  state.inventory.splice(state.inventory.indexOf(id),1);
  p.push(id);state.heldId=state.selectedId=null;
  save(true);updatePanels();draw();
  notify(`${m?.name??id} placed on the experiment table.`);
  emit("sa:material-placed",{chapterId:c.id,experimentId:c.experimentId,materialId:id,roomId:state.roomId,stationId:station()?.id,materialIds:[...p]});
  if(allPlaced(c)&&state.readyChapterId!==c.id){
    state.readyChapterId=c.id;
    emit("sa:experiment-ready",{chapterId:c.id,experimentId:c.experimentId,roomId:state.roomId,stationId:station()?.id,materialIds:[...p]});
  }
}
function materialProgress(c=currentChapter()){return{collected:c.requiredMaterials.filter(ownsMaterial).length,placed:c.requiredMaterials.filter(id=>placed(c.id).includes(id)).length,total:c.requiredMaterials.length};}

function renderExperimentTableMaterials(c=currentChapter()){
  const container=$("#experiment-table-materials",el.questPanel);
  if(!container)return;
  const contents=placed(c.id);
  container.innerHTML=`<strong>Experiment table · ${contents.length}/${c.requiredMaterials.length}</strong>${
    contents.length
      ? contents.map(id=>{const m=getMaterialById(id);return `<button type="button" class="table-material ${state.selectedTableId===id?"is-selected":""}" data-table-material="${esc(id)}" ${nearStation()?"":"disabled"} aria-pressed="${state.selectedTableId===id}" title="${nearStation()?"Select to return this item to your bag":"Stand beside the table to move this item"}">${esc(m?.icon??"✧")} ${esc(m?.name??id)}</button>`;}).join("")
      : '<small>No materials placed yet.</small>'
  }`;
}
/* ============================================================
   MISSION MATERIAL GUIDE
   ============================================================ */

function missionChapter() {
    return typeof currentChapter === "function"
        ? currentChapter()
        : chapter();
}

function missionWorldObjects() {
    if (typeof objects !== "undefined") return objects;

    if (typeof worldObjects !== "undefined") return worldObjects;

    return [];
}

function missionPlacedIds(chapterId) {
    if (typeof placed === "function") {
        return placed(chapterId);
    }

    if (typeof placedMaterials === "function") {
        return placedMaterials(chapterId);
    }

    return state.placedByChapter?.[chapterId] ?? [];
}

function materialCollectionRoom(materialId, c = missionChapter()) {
    const availableObjects = missionWorldObjects();

    // Prefer the collection room listed in this chapter.
    for (const roomId of c.collectionRooms ?? []) {
        const found = availableObjects.find(object =>
            object.materialId === materialId &&
            object.roomId === roomId &&
            object.collectible
        );

        if (found) return roomId;
    }

    // Otherwise find its actual physical pickup.
    const pickup = availableObjects.find(object =>
        object.materialId === materialId &&
        object.collectible
    );

    if (pickup) return pickup.roomId;

    return c.collectionRooms?.[0] ?? c.experimentRoomId;
}

function materialRouteRows(c = missionChapter()) {
    const placedIds = missionPlacedIds(c.id);

    return c.requiredMaterials.map(materialId => {
        const item = getMaterialById(materialId);
        const roomId = materialCollectionRoom(materialId, c);

        return {
            id: materialId,
            name: item?.name ?? materialId,
            roomId,
            roomName: getRoom(roomId)?.name ?? roomId,
            collected: ownsMaterial(materialId),
            placed: placedIds.includes(materialId)
        };
    });
}

function ensureMaterialGuideStyles() {
    if (document.getElementById("mission-material-guide-styles")) return;

    const style = document.createElement("style");

    style.id = "mission-material-guide-styles";

    style.textContent = `
        #mission-material-guide {
            margin-top: 12px;
            display: grid;
            gap: 7px;
        }

        .mission-material-guide-title {
            margin: 0 0 2px;
            color: var(--color-purple-dark);
            font-size: 11px;
            font-weight: 800;
        }

        .mission-material-row {
            display: grid;
            grid-template-columns: minmax(0,1fr) auto;
            gap: 8px;
            align-items: center;
            padding: 8px 9px;
            border: 1px solid var(--color-border);
            border-radius: 8px;
            background: #fffefa;
        }

        .mission-material-row strong {
            display: block;
            color: var(--color-ink);
            font-size: 10px;
        }

        .mission-material-row small {
            display: block;
            margin-top: 2px;
            color: var(--color-muted);
            font-size: 9px;
        }

        .mission-material-status {
            color: var(--color-gold-dark);
            font-size: 9px;
            font-weight: 800;
            text-align: right;
        }

        .mission-material-row.is-done {
            border-color: rgba(54,117,84,.35);
            background: var(--color-surface-green);
        }

        .mission-material-row.is-done .mission-material-status {
            color: var(--color-success);
        }
    `;

    document.head.appendChild(style);
}

function renderMissionMaterialGuide(c = missionChapter()) {
    if (!el.questObjective) return;

    ensureMaterialGuideStyles();

    let guide = $("#mission-material-guide");

    if (!guide) {
        guide = document.createElement("div");
        guide.id = "mission-material-guide";

        el.questObjective.insertAdjacentElement("afterend", guide);
    }

    if (state.completed.includes(c.id)) {
        guide.innerHTML = "";
        return;
    }

    const rows = materialRouteRows(c);

    guide.innerHTML = `
        <p class="mission-material-guide-title">
            MATERIALS AND WHERE TO FIND THEM
        </p>

        ${rows.map(row => `
            <div class="mission-material-row ${row.placed ? "is-done" : ""}">
                <div>
                    <strong>${esc(row.name)}</strong>

                    <small>
                        ${row.placed
                            ? "Placed on the experiment table"
                            : row.collected
                                ? "Already in your shoulder bag"
                                : `Find in: ${esc(row.roomName)}`}
                    </small>
                </div>

                <span class="mission-material-status">
                    ${row.placed
                        ? "ON TABLE ✓"
                        : row.collected
                            ? "COLLECTED ✓"
                            : "NEEDED"}
                </span>
            </div>
        `).join("")}
    `;
}
/* ---------- Quest, Spellbook and HUD ---------- */
function ensureExperimentButton(){if(!el.questPanel)return null;let b=$("#begin-experiment-button",el.questPanel);if(b)return b;b=document.createElement("button");b.id="begin-experiment-button";b.type="button";b.className="primary-button";b.textContent="Begin Magical Experiment";b.hidden=true;(el.questLabel??el.questPanel).insertAdjacentElement("afterend",b);b.addEventListener("click",beginExperiment);return b;}
function updateQuest(){const c=currentChapter(),p=materialProgress(c),done=chapterDone(c.id);if(el.questTitle)el.questTitle.textContent=done?"Mission Complete":c.title;if(el.questDescription)el.questDescription.textContent=done?c.goldenStarMessage:c.masterTask;let objective="";if(done)objective="Mission cleared. Your golden star has been recorded.";else if(p.collected<p.total){const missing=c.requiredMaterials.filter(id=>!ownsMaterial(id)).map(id=>getMaterialById(id)?.name??id);objective=`Collect ${p.total-p.collected} more material(s): ${missing.join(", ")}.`;}else if(p.placed<p.total){const missing=c.requiredMaterials.filter(id=>!placed(c.id).includes(id)).map(id=>getMaterialById(id)?.name??id);objective=`Place these on the experiment table: ${missing.join(", ")}.`;}else objective=state.experimentStarted?"The program puzzle is open. Experiment freely and run it as many times as you like.":"All materials are on the table. The Python program puzzle is ready.";if(el.questObjective)el.questObjective.textContent=objective;renderMissionMaterialGuide(c);renderExperimentTableMaterials(c);const percent=done?100:p.total?Math.round((p.collected+p.placed)/(p.total*2)*100):0;if(el.questFill)el.questFill.style.width=`${percent}%`;if(el.questTrack)el.questTrack.setAttribute("aria-valuenow",String(percent));if(el.questLabel)el.questLabel.textContent=done?"100% completed":`${p.collected}/${p.total} collected · ${p.placed}/${p.total} placed`;const b=ensureExperimentButton();if(b){const ready=!done&&allPlaced(c);const correctRoom=state.roomId===c.experimentRoomId;b.hidden=!ready||state.experimentStarted||window.SA_EXPERIMENTS?.isOpen?.();b.disabled=!correctRoom||!nearStation();b.textContent=state.readyChapterId===c.id?"Resume Python Program Puzzle":"Begin Python Program Puzzle";}if(el.stars)el.stars.textContent=String(state.stars);if(el.chapterNumber)el.chapterNumber.textContent=`${c.number} / ${CHAPTERS.length}`;}
function renderInventoryPanel(){renderInventory();}
function renderQuestJournal(){if(!el.questJournal)return;el.questJournal.innerHTML=`<div class="spellbook-summary"><div class="spellbook-stat"><strong>${state.completed.length}/8</strong><span>missions cleared</span></div><div class="spellbook-stat"><strong>${state.stars}</strong><span>golden stars</span></div><div class="spellbook-stat"><strong>${state.visited.size}</strong><span>rooms explored</span></div></div><div class="spellbook-list"><h3>The Master's Assignments</h3>${CHAPTERS.map(c=>`<article class="quest-journal-entry"><div class="quest-journal-mark">${chapterDone(c.id)?"★":c.number}</div><div><h3>${esc(c.title)}</h3><p>${esc(c.conceptTitle)} · ${esc(c.masterTask)}</p></div><span>${chapterDone(c.id)?"Golden star earned":c.id===state.chapterId?"Current mission":"Awaiting previous mission"}</span></article>`).join("")}</div>`;}
function renderSpellbook(){if(!el.spellbook)return;el.spellbook.innerHTML=`<div class="page-heading"><span class="section-eyebrow">THE APPRENTICE'S LEARNING RECORD</span><h2>The Magical Spellbook</h2><p>Lessons are marked as demonstrated only after their experiments are successfully cleared.</p></div><div class="spellbook-summary"><div class="spellbook-stat"><strong>${state.completed.length}/8</strong><span>concepts demonstrated</span></div><div class="spellbook-stat"><strong>${state.stars}</strong><span>golden stars</span></div><div class="spellbook-stat"><strong>${state.inventory.length}</strong><span>materials collected</span></div></div><div class="spellbook-list"><h3>Knowledge mastered</h3>${CHAPTERS.map(c=>`<article class="spellbook-entry ${chapterDone(c.id)?"is-complete":""}"><div class="spellbook-entry-mark">${chapterDone(c.id)?"✓":c.number}</div><div class="spellbook-entry-copy"><h3>${esc(c.conceptTitle)}</h3><p>${esc(c.successExplanation.simple)}</p><span class="spellbook-status">${chapterDone(c.id)?"Demonstrated":Number(state.attempts[c.id]??0)?"Practised":"Not yet demonstrated"}</span><details><summary>Developer insight</summary><p>${esc(c.successExplanation.developerInsight)}</p></details></div></article>`).join("")}</div>`;}
function updateNearbyPanel(){if(!el.objectDetails)return;const o=state.nearbyObject??state.selectedObject;if(!o){el.objectDetails.innerHTML='<p class="panel-description">Move close to an object or click it to discover what it is.</p>';return;}const m=itemMaterial(o);el.objectDetails.innerHTML=`<p class="object-detail-name">${esc(itemName(o))}</p><p class="object-detail-description">${esc(itemDescription(o))}</p>${m?.category?`<span class="object-detail-kind">${esc(m.category)}</span>`:""}<span class="object-detail-kind">${collected(o)?"Collected":o.collectible?"Collectible":"Scenery"}</span>`;}
function updatePanels(){const r=currentRoom(),c=currentChapter();if(!r||!c)return;if(el.locationName)el.locationName.textContent=r.name;if(el.locationDescription)el.locationDescription.textContent=r.description;if(el.roomHeading)el.roomHeading.textContent=r.name;if(el.roomRegion)el.roomRegion.textContent=String(r.region??"").toUpperCase();if(el.objectCount)el.objectCount.textContent=`${objectsHere().filter(o=>o.collectible&&!collected(o)).length} materials to discover`;if(el.companionName)el.companionName.textContent=MASTER.name;if(el.companionStatus)el.companionStatus.textContent=r.id===c.masterRoomId?"The Master is here, ready to guide your experiment.":`The Master is waiting in ${getRoom(c.masterRoomId)?.name??"the experiment room"}.`;renderInventory();updateQuest();updateNearbyPanel();}

/* ---------- Dialogue and story ---------- */
function portraitData(kind){const apprentice=kind==="apprentice",robe=apprentice?"#35436f":"#435b7b",hair=apprentice?"#60402f":"#c7c3ba",trim="#d6ad58";const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#eee7f2"/><rect x="22" y="51" width="52" height="38" rx="10" fill="${robe}"/><rect x="43" y="52" width="10" height="32" fill="${trim}"/><rect x="33" y="20" width="30" height="35" rx="12" fill="#d6a07c"/><rect x="30" y="16" width="36" height="16" rx="8" fill="${hair}"/><rect x="29" y="23" width="9" height="20" fill="${hair}"/><rect x="58" y="23" width="9" height="20" fill="${hair}"/><rect x="39" y="36" width="4" height="4" fill="#282335"/><rect x="54" y="36" width="4" height="4" fill="#282335"/>${apprentice?'<rect x="23" y="59" width="13" height="20" rx="4" fill="#805737"/>':'<rect x="39" y="44" width="18" height="12" rx="5" fill="#e2ded7"/>'}<rect x="12" y="12" width="72" height="72" rx="36" fill="none" stroke="${trim}" stroke-width="2"/></svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;}
function portraitFor(speaker){return speaker==="The Apprentice"||speaker===PLAYER.name?portraitData("apprentice"):portraitData("master");}
function openDialogue(lines,onComplete=null){state.dialogue=(Array.isArray(lines)?lines:[lines]).map(line=>typeof line==="string"?{speaker:MASTER.name,role:MASTER.role,text:line}:{speaker:line.speaker??MASTER.name,role:line.role??MASTER.role,text:line.text??"",portrait:line.portrait});state.dialoguePageIndex=0;state.dialogueDone=onComplete;renderDialogue();showDialog(el.masterDialog);}


function renderDialogue(){const line=state.dialogue[state.dialoguePageIndex];if(!line)return;if(el.dialogueSpeaker)el.dialogueSpeaker.textContent=line.speaker;if(el.dialogueRole)el.dialogueRole.textContent=line.role;if(el.dialogueMessage)el.dialogueMessage.textContent=line.text;if(el.dialoguePortrait){el.dialoguePortrait.onerror=null;el.dialoguePortrait.src=line.portrait??portraitFor(line.speaker);el.dialoguePortrait.alt=line.speaker;}if(el.dialogueProgress)el.dialogueProgress.textContent=`${state.dialoguePageIndex+1} / ${state.dialogue.length}`;if(el.dialogueNext)el.dialogueNext.textContent=state.dialoguePageIndex===state.dialogue.length-1?"Close":"Continue";}
function nextDialogue(){if(state.dialoguePageIndex<state.dialogue.length-1){state.dialoguePageIndex++;renderDialogue();return;}closeDialog(el.masterDialog);const done=state.dialogueDone;state.dialogue=[];state.dialogueDone=null;if(typeof done==="function")done();}
function talkToMaster() {
    const c = missionChapter();

    if (state.roomId !== c.masterRoomId) {
        openDialogue([{
            speaker: MASTER.name,
            text:
                `I am waiting in ${getRoom(c.masterRoomId)?.name ?? "the experiment room"}. The Active Mission panel shows the materials you need and where to find each one.`
        }]);

        return;
    }

    if (state.completed.includes(c.id)) {
        openDialogue([{
            speaker: MASTER.name,
            text:
                "You have already mastered this experiment. Your golden star is safely recorded."
        }]);

        return;
    }

    const rows = materialRouteRows(c);

    const missing = rows.filter(row => !row.collected);

    const alreadyHave = rows.filter(row => row.collected);

    const allOnTable = rows.every(row => row.placed);

    if (allOnTable) {
        state.missionBriefed = true;
        save(true);
        openDialogue([{
            speaker: MASTER.name,
            text:
                "Your workbench is ready. Build and run the Python program yourself; I will explain the result only after the interpreter has analyzed your code."
        }]);
        return;
    }

    const lines = [
        {
            speaker: MASTER.name,
            text: c.masterTask
        },
        {
            speaker: MASTER.name,
            text: c.briefing
        }
    ];

    if (alreadyHave.length) {
        lines.push({
            speaker: MASTER.name,
            text:
                `You already have: ${alreadyHave.map(row => row.name).join(", ")}. These materials are reusable. You do not need to collect them again.`
        });
    }

    if (missing.length) {
        const byRoom = new Map();

        for (const row of missing) {
            if (!byRoom.has(row.roomName)) {
                byRoom.set(row.roomName, []);
            }

            byRoom.get(row.roomName).push(row.name);
        }

        const routeText = [...byRoom.entries()]
            .map(([roomName, names]) =>
                `${roomName}: ${names.join(", ")}`
            )
            .join("; ");

        lines.push({
            speaker: MASTER.name,
            text:
                `Collection route — ${routeText}. Find each object, inspect it, then use Grab. The Active Mission panel will keep this list visible.`
        });

        lines.push({
            speaker: MASTER.name,
            text:
                "When every material is in your shoulder bag, select each one and use Put / Release beside my experiment table. Previously collected materials can be reused."
        });

    } else if (!allOnTable) {
        const toPlace = rows
            .filter(row => !row.placed)
            .map(row => row.name);

        lines.push({
            speaker: MASTER.name,
            text:
                `You have all the materials. Now place these on my table: ${toPlace.join(", ")}. Select each item in your shoulder bag, stand beside the table and press Put / Release.`
        });

    }

    lines.push({
        speaker: MASTER.name,
        text: c.objective
    });

    state.missionBriefed = true;

    save(true);

    openDialogue(lines);
}

function openingStory() {
    const lines = STORY_INTRO.scenes.map(s => ({
        speaker: s.speaker,
        role: s.speaker === PLAYER.name ? "Apprentice" : MASTER.role,
        text: s.text
    }));

    openDialogue(lines, () => {
        state.introSeen = true;
        save(true);

        const c = missionChapter();
        const rows = materialRouteRows(c);
        const groups = new Map();

        for (const row of rows) {
            if (!groups.has(row.roomName)) {
                groups.set(row.roomName, []);
            }

            groups.get(row.roomName).push(row.name);
        }

        const routeText = [...groups.entries()]
            .map(([roomName, names]) =>
                `${roomName}: ${names.join(", ")}`
            )
            .join("; ");

        openDialogue([
            {
                speaker: MASTER.name,
                text:
                    `Your first assignment is ${c.title}. Nothing has failed yet. You must collect the materials, assemble the Python code from the pieces and execute each program yourself.`
            },
            {
                speaker: MASTER.name,
                text:
                    `Find these materials: ${routeText}. Start in the Potion Lab and follow the connected rooms. The Active Mission panel will keep the list visible.`
            },
            {
                speaker: MASTER.name,
                text:
                    "Bring everything to the Potion Lab table. You will arrange the collected pieces into a program, execute it and inspect the result. Reusable materials never need to be collected twice."
            }
        ]);
    });
}
/* ---------- Experiment events and chapter progression ---------- */
function beginExperiment(){
  const c=currentChapter();
  if(state.experimentStarted)return;
  if(chapterDone(c.id)){notify("This experiment is already complete.");return;}
  if(state.roomId!==c.experimentRoomId||!nearStation()){notify("Stand beside the Potion Lab experiment table to begin.");return;}
  if(!allCollected(c)||!allPlaced(c)){notify("Place every required material on the experiment table first.");return;}
  if(state.experimentAttemptOpen){
    state.experimentStarted=true;
    window.SA_EXPERIMENTS?.open?.();
    updatePanels();
    return;
  }
  state.attempts[c.id]=Number(state.attempts[c.id]??0)+1;
  state.experimentAttemptOpen=true;
  save(true);
  state.experimentStarted=true;
  emit("sa:experiment-start",{chapterId:c.id,experimentId:c.experimentId,roomId:state.roomId,materialIds:[...placed(c.id)],attempt:Number(state.attempts[c.id]),chapter:c});
  updatePanels();
  notify("The Python program puzzle is ready. Build, run and experiment freely.",3200);
}
function onExperimentReady(event){
  const detail=event.detail??{},chapter=currentChapter();
  const ids=Array.isArray(detail.materialIds)?detail.materialIds:[];
  if(detail.chapterId!==chapter.id||detail.experimentId!==chapter.experimentId||
     detail.roomId!==state.roomId||!nearStation()||!allPlaced(chapter)||
     chapter.requiredMaterials.some(id=>!ids.includes(id))||
     ids.some(id=>!chapter.requiredMaterials.includes(id))){
    console.warn("Ignoring an incomplete or mismatched experiment-ready event.",detail);
    return;
  }
  state.readyChapterId=chapter.id;
  beginExperiment();
}
function onExperimentClosed(event){
  if(event.detail?.chapterId&&event.detail.chapterId!==state.chapterId)return;
  state.experimentStarted=false;
  updatePanels();
}
function failureExplanation(c,key){const found=c.failureExplanations?.[key];if(found)return found;if(key==="cleanup-in-except")return{title:"The valve closes only on failure",simple:"An except block runs only when a matching exception occurs. The valve must also close after success, so place cleanup in finally.",developerInsight:"The except suite executes only for matching exceptional control flow. Cleanup required on both normal and exceptional exits belongs in finally or a context manager."};return{title:"The experiment needs another attempt",simple:"Something did not behave as expected. Examine the operation and the Python error, then try again.",developerInsight:"Check the input values, the operation, the exception type and the matching handler. Keep the failure visible until the program can recover safely."};}
function onExperimentResult(event){
  const d=event.detail??{},c=currentChapter();
  if(d.chapterId!==c.id||(d.experimentId&&d.experimentId!==c.experimentId)){
    console.warn("Ignoring a result for an inactive experiment.",d);return;
  }
  if(d.success===true&&chapterDone(c.id))return;
  state.attempts[c.id]=Math.max(Number(state.attempts[c.id]??0),Number(d.attempt)||0);
  state.experimentStarted=false;
  if(d.success===true){
    for(const id of placed(c.id))if(!state.inventory.includes(id))state.inventory.push(id);
    state.placedByChapter[c.id]=[];
    state.readyChapterId=null;state.selectedTableId=null;state.experimentAttemptOpen=false;
    state.completed.push(c.id);state.stars+=c.starReward??1;
    save(true);updatePanels();renderQuestJournal();renderSpellbook();
    const lines=[
      {speaker:MASTER.name,text:c.successDialogue},
      {speaker:MASTER.name,text:`The principle is simple: ${c.successExplanation.simple}`},
      {speaker:MASTER.name,text:`For deeper understanding: ${c.successExplanation.developerInsight}`},
      {speaker:MASTER.name,text:`You have earned a golden star. ${c.goldenStarMessage}`}
    ];
    openDialogue(lines,()=>{
      window.SA_EXPERIMENTS?.close?.();
      if(c.nextChapter){
        const next=getChapterById(c.nextChapter);
        if(next){state.chapterId=next.id;state.missionBriefed=false;save(true);updatePanels();emit("sa:chapter-activated",{chapterId:next.id});notify(`New mission unlocked: ${next.title}`,4200);}
      }else{save(true);notify("All eight experiments are complete. The Final Trial is unlocked.",5000);}
    });
    emit("sa:chapter-completed",{chapterId:c.id,nextChapterId:c.nextChapter,stars:state.stars});
  }else{
    const key=d.failureType??d.failureKey??"unknown",ex=d.explanation??failureExplanation(c,key);
    save(true);updatePanels();
    openDialogue([
      {speaker:MASTER.name,text:d.masterMessage??`The experiment failed: ${ex.title}.`},
      {speaker:MASTER.name,text:ex.simple},
      {speaker:MASTER.name,text:ex.developerInsight},
      {speaker:MASTER.name,text:"Your materials remain on the table. Close this explanation and immediately try a different program."}
    ]);
    emit("sa:experiment-failed",{chapterId:c.id,failureType:key,attempts:state.attempts[c.id],explanation:ex});
  }
}
window.addEventListener("sa:experiment-ready",onExperimentReady);
window.addEventListener("sa:experiment-closed",onExperimentClosed);
window.addEventListener("sa:experiment-result",onExperimentResult);

/* ---------- World map ---------- */
const MAP_FILES={world:"assets/maps/image1.png",academy:"assets/maps/image5.png"};
function mapLocations(){return state.mapLayer==="academy"?ACADEMY_MAP_LOCATIONS:WORLD_MAP_LOCATIONS;}
function routeBetween(start,target){if(start===target)return[start];const q=[[start]],seen=new Set([start]);while(q.length){const path=q.shift(),id=path.at(-1);for(const exit of getRoomExits(id,{completedChapters:state.completed})){if(seen.has(exit.targetRoomId))continue;const next=[...path,exit.targetRoomId];if(exit.targetRoomId===target)return next;seen.add(exit.targetRoomId);q.push(next);}}return null;}
function ensureMapControls(){if(!el.mapContainer||$("#map-layer-controls"))return;const box=document.createElement("div");box.id="map-layer-controls";box.className="map-layer-controls";box.innerHTML='<button type="button" class="secondary-button" data-map-layer="world">World Map</button><button type="button" class="secondary-button" data-map-layer="academy">Academy Grounds</button>';el.mapContainer.insertAdjacentElement("beforebegin",box);}
function showMapLocation(item){if(!el.mapInfo)return;const unlocked=isWorldLocationUnlocked(item,{completedChapters:state.completed}),route=routeBetween(state.roomId,item.targetRoomId);const info=item.targetRoomId===state.roomId?"The apprentice is already here.":route?`Walking route: ${route.map(id=>getRoom(id)?.name??id).join(" → ")}`:"No connected walking route is available.";el.mapInfo.innerHTML=`<h3>${esc(item.label)}</h3><p>${esc(item.description??"Explore this location.")}</p><p class="microcopy">${unlocked?esc(info):"This location remains sealed until more missions are complete."}</p><p class="microcopy">Selecting a map marker does not teleport the apprentice. Walk through connected exits to travel.</p>`;}
function renderMap(){if(!el.mapImage||!el.mapLocations)return;ensureMapControls();const src=MAP_FILES[state.mapLayer]??MAP_FILES.world;el.mapImage.onerror=()=>{el.mapImage.onerror=null;el.mapImage.src=MAP_FILES.world;};el.mapImage.src=src;const items=mapLocations();el.mapLocations.innerHTML=items.map(item=>{const unlocked=isWorldLocationUnlocked(item,{completedChapters:state.completed}),selected=state.mapSelection===item.id;return `<button type="button" class="map-location-button ${selected?"is-selected":""}" data-map-location="${esc(item.id)}" style="left:${item.x}%;top:${item.y}%" ${unlocked?"":"disabled"} title="${esc(item.description??item.label)}"><span aria-hidden="true">${esc(item.icon??"✧")}</span><span>${esc(item.label)}</span></button>`;}).join("");const selected=items.find(i=>i.id===state.mapSelection);if(selected)showMapLocation(selected);}
function setMapLayer(layer){state.mapLayer=layer==="academy"?"academy":"world";state.mapSelection=null;renderMap();if(el.mapInfo)el.mapInfo.innerHTML=`<h3>${state.mapLayer==="academy"?"Academy Grounds":"The Wider Realm"}</h3><p>Select a marker to inspect the location and plan a walking route.</p>`;}
function selectMapLocation(id){const item=mapLocations().find(i=>i.id===id);if(!item)return;if(!isWorldLocationUnlocked(item,{completedChapters:state.completed})){notify("This location is not unlocked yet.");return;}state.mapSelection=id;showMapLocation(item);$$('[data-map-location]',el.mapLocations).forEach(b=>b.classList.toggle("is-selected",b.dataset.mapLocation===id));}

/* ---------- Views and help ---------- */
function showView(view){if(!["game","map","inventory","quest","spellbook","exam"].includes(view))view="game";state.view=view;state.keys.clear();state.pointerKeys.clear();state.player.moving=false;for(const [node,name] of [[el.gameView,"game"],[el.mapView,"map"],[el.inventoryView,"inventory"],[el.questView,"quest"],[el.spellbookView,"spellbook"],[el.examView,"exam"]])if(node)node.hidden=view!==name;for(const [button,name] of [[el.navGame,"game"],[el.navMap,"map"],[el.navInventory,"inventory"],[el.navQuest,"quest"],[el.navSpellbook,"spellbook"],[$("#nav-exam"),"exam"]])if(button){button.classList.toggle("is-active",view===name);button.setAttribute("aria-current",view===name?"page":"false");}if(view==="game"){updatePanels();draw();}if(view==="map")renderMap();if(view==="inventory")renderInventory();if(view==="quest")renderQuestJournal();if(view==="spellbook")renderSpellbook();if(view==="exam"&&el.exam)el.exam.innerHTML=`<div class="stage-card"><span class="section-eyebrow">THE MASTER'S FINAL PRACTICE</span><h2>${allDone()?"The final practice is ready":"Complete the eight experiments first"}</h2><p>${allDone()?"The Master's ten-question assessment is ready.":"Every experiment must be cleared before the final practice is unlocked."}</p></div>`;save(true);}
function openHelp(){if(el.helpTitle)el.helpTitle.textContent="How to Play";if(el.helpContent)el.helpContent.innerHTML=`<h3>Move and explore</h3><p>Use the directional pad or Arrow keys / WASD. Walk to a doorway and press E to enter the connected room.</p><h3>Inspect and collect</h3><p>Hover over objects to see names. Click or press I to inspect. Move close and press Grab to collect a required material.</p><h3>Shoulder bag</h3><p>Select an item in your inventory to hold it. Stand beside the experiment table and use Put / Release to place a requested material.</p><h3>Experiments</h3><p>Once all required materials are on the table, the experiment opens automatically. Failed experiments can be retried. Only success clears the mission and awards a golden star.</p><h3>Controls</h3><p><strong>Move:</strong> Arrow keys / WASD<br><strong>Interact:</strong> E<br><strong>Inspect:</strong> I<br><strong>Put / Release:</strong> Q</p><p class="microcopy">Progress is stored locally in this browser. No internet connection is required.</p>`;showDialog(el.helpDialog);}

/* ---------- Inputs ---------- */
function keyDown(event){if(inputBlocked())return;const target=event.target;if(target instanceof HTMLElement&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName)))return;const d=({ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"})[event.key];if(d){event.preventDefault();state.keys.add(d);return;}if(event.repeat)return;if(event.key==="e"||event.key==="E"){event.preventDefault();if(state.nearbyExit){const x=getRoomExits(state.roomId,{completedChapters:state.completed}).find(i=>i.id===state.nearbyExit.id);if(x)transition(x);}else if(state.nearbyObject)inspectObject(state.nearbyObject);else if(state.nearbyMaster)talkToMaster();}else if(event.key==="i"||event.key==="I"){event.preventDefault();inspectNearest();}else if(event.key==="q"||event.key==="Q"){event.preventDefault();putOrRelease();}}
function keyUp(event){const d=({ArrowUp:"up",w:"up",W:"up",ArrowDown:"down",s:"down",S:"down",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"})[event.key];if(d)state.keys.delete(d);}
function bindDirectionPad(){ $$("[data-move]").forEach(button=>{const d=button.dataset.move;if(!["up","down","left","right"].includes(d))return;const down=e=>{e.preventDefault();state.pointerKeys.add(d);button.classList.add("is-pressed");try{button.setPointerCapture(e.pointerId);}catch(_){}};const up=e=>{if(e)e.preventDefault();state.pointerKeys.delete(d);button.classList.remove("is-pressed");};button.addEventListener("pointerdown",down);button.addEventListener("pointerup",up);button.addEventListener("pointercancel",up);button.addEventListener("lostpointercapture",up);button.addEventListener("pointerleave",e=>{if(e.buttons===0)up(e);});button.addEventListener("contextmenu",e=>e.preventDefault());});}
function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};}
function objectAt(point,max=42){let found=null,best=max;for(const o of objectsHere()){const d=dist(point,o);if(d<=best){best=d;found=o;}}return found;}
function pointerMove(e){const o=objectAt(canvasPoint(e),40),old=state.hoverObject?objectKey(state.hoverObject):"",next=o?objectKey(o):"";state.hoverObject=o;canvas.style.cursor=o?"pointer":"default";if(old!==next)draw();}
function canvasClick(e){if(state.view!=="game")return;const p=canvasPoint(e),o=objectAt(p,44);if(o){inspectObject(o);return;}const exit=currentRoom().exits.find(x=>dist(p,x)<=43);if(exit&&dist(state.player,exit)<=115)transition(exit);}
function handleGlobalClick(e){const b=e.target.closest("button");if(!b)return;if(b.matches("[data-inventory-item]")){selectInventoryItem(b.dataset.inventoryItem);return;}if(b.matches("[data-table-material]")){const id=b.dataset.tableMaterial;if(!nearStation()||!placed().includes(id))return;state.selectedId=state.heldId=null;state.selectedTableId=id;renderInventory();renderExperimentTableMaterials();notify(`${getMaterialById(id)?.name??id} selected on the experiment table. Press Put / Release to return it to your bag.`);return;}if(b.matches("[data-map-layer]")){setMapLayer(b.dataset.mapLayer);return;}if(b.matches("[data-map-location]")){selectMapLocation(b.dataset.mapLocation);return;}if(b.hasAttribute("data-return-to-game"))showView("game");}
function bindEvents(){document.addEventListener("keydown",keyDown);document.addEventListener("keyup",keyUp);document.addEventListener("click",handleGlobalClick);window.addEventListener("blur",()=>{state.keys.clear();state.pointerKeys.clear();});canvas?.addEventListener("pointermove",pointerMove);canvas?.addEventListener("pointerleave",()=>{state.hoverObject=null;if(canvas)canvas.style.cursor="default";draw();});canvas?.addEventListener("click",canvasClick);canvas?.addEventListener("contextmenu",e=>e.preventDefault());bindDirectionPad();el.grab?.addEventListener("click",grabNearest);el.inspect?.addEventListener("click",inspectNearest);el.put?.addEventListener("click",putOrRelease);el.talk?.addEventListener("click",talkToMaster);el.navGame?.addEventListener("click",()=>showView("game"));el.navMap?.addEventListener("click",()=>showView("map"));el.navInventory?.addEventListener("click",()=>showView("inventory"));el.navQuest?.addEventListener("click",()=>showView("quest"));el.navSpellbook?.addEventListener("click",()=>showView("spellbook"));el.navHelp?.addEventListener("click",openHelp);
$("#reset-adventure-button")?.addEventListener(
    "click",
    resetAdventure
);
$("#open-map-button")?.addEventListener("click",()=>showView("map"));$("#open-inventory-button")?.addEventListener("click",()=>showView("inventory"));el.dialogueNext?.addEventListener("click",nextDialogue);el.objectClose?.addEventListener("click",()=>closeDialog(el.objectDialog));el.helpClose?.addEventListener("click",()=>closeDialog(el.helpDialog));el.objectGrab?.addEventListener("click",()=>{if(state.selectedObject)grabObject(state.selectedObject);});[el.masterDialog,el.objectDialog,el.helpDialog].forEach(d=>d?.addEventListener("close",()=>{state.keys.clear();state.pointerKeys.clear();}));}

/* ---------- Start ---------- */

function initialise() {
    if (!el.app || !canvas || !el.gameView) {
        console.error(
            "Game interface is incomplete. Check #game-app and #game-canvas in index.html."
        );
        return;
    }

    if (!ctx) {
        console.error(
            "The browser could not create a 2D canvas context."
        );

        const viewport = $("#game-viewport");

        if (viewport) {
            viewport.style.background =
                "linear-gradient(145deg, #34433f, #202b39)";

            const warning = document.createElement("p");
            warning.className = "canvas-error-message";
            warning.textContent =
                "The game canvas could not start. Try refreshing the page or using a current version of Chrome or Edge.";

            viewport.appendChild(warning);
        }

        return;
    }

    if (!getRoom(state.roomId)) {
        state.roomId = PLAYER.startingRoomId;
    }

    const r = currentRoom();

    const bounds = r.walkBounds ?? {
        left: 28,
        top: 72,
        right: W - 28,
        bottom: H - 26
    };

    if (!saved.currentRoomId || !getRoom(saved.currentRoomId)) {
        state.player.x =
            r.spawn?.x ?? PLAYER.startingPosition.x;

        state.player.y =
            r.spawn?.y ?? PLAYER.startingPosition.y;
    }

    state.player.x = clamp(
        state.player.x,
        bounds.left + HW,
        bounds.right - HW
    );

    state.player.y = clamp(
        state.player.y,
        bounds.top + HH,
        bounds.bottom - HH
    );

    state.visited.add(r.id);

    // Public interface shared by the game modules.
    window.SA_GAME = {
        getState: () => ({
            roomId: state.roomId,
            chapterId: state.chapterId,
            inventory: [...state.inventory],
            heldId: state.heldId,
            completed: [...state.completed],
            stars: state.stars,

            playerPosition: {
                x: state.player.x,
                y: state.player.y
            },

            placedByChapter: Object.fromEntries(
                Object.entries(state.placedByChapter).map(
                    ([id, materials]) => [id, [...materials]]
                )
            )
        }),

        getCurrentChapter: () => currentChapter(),

        showView: view => showView(view),

        reportExperimentResult: result =>
            emit("sa:experiment-result", result),

        notify,

        openMasterDialogue: (lines, onComplete) =>
            openDialogue(lines, onComplete),

        getRoom: id => getRoom(id),

        getMaterialPickupRooms: materialId =>
            objects
                .filter(object =>
                    object.materialId === materialId &&
                    object.collectible
                )
                .map(object => object.roomId),

        resetAdventure
    };

    // Start the actual game.
    bindEvents();
    updatePanels();
    showView("game");
    draw();

    // Start continuous rendering and movement.
    window.requestAnimationFrame(gameLoop);

    // Show the opening story only on a new adventure.
    if (!state.introSeen) {
        window.setTimeout(openingStory, 350);
    }

    save(true);

    console.info(
        "The Sorcerer's Apprentice game started successfully."
    );
}

initialise();

window.addEventListener("DOMContentLoaded",()=>{
  const c=currentChapter();
  if(!chapterDone(c.id)&&allPlaced(c)){
    emit("sa:experiment-ready",{
      chapterId:c.id,experimentId:c.experimentId,roomId:state.roomId,
      stationId:station()?.id,materialIds:[...placed(c.id)]
    });
  }
},{once:true});

