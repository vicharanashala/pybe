
/*
 * THE SORCERER'S APPRENTICE
 * THE APPRENTICE'S ROUTE COMPASS
 * File: js/compass.js
 *
 * Calculates real room-to-room routes to outstanding mission materials.
 *
 * Features:
 * - Reads the apprentice's CURRENT room from main.js.
 * - Finds the actual room containing each required material.
 * - Calculates the shortest available route using story.js exits.
 * - Shows the door to use at every step.
 * - Warns when a passage is locked.
 * - Groups materials that are in the same destination room.
 * - Shows the route back to the experiment table.
 * - Automatically refreshes after room transitions and collection.
 *
 * Offline only. No APIs, network requests or external libraries.
 */

import {
    GAME_CONFIG,
    ROOMS,
    WORLD_OBJECTS,
    MATERIALS,
    CHAPTERS,
    getRoom,
    getRoomExits,
    getChapterById
} from "./story.js";


/* ============================================================
   1. CONFIGURATION
   ============================================================ */

const ROUTE_STYLE_ID = "sa-route-compass-styles";
const ROUTE_PANEL_ID = "sa-route-parchment";

const CANVAS_WIDTH = GAME_CONFIG.canvas.width;
const CANVAS_HEIGHT = GAME_CONFIG.canvas.height;

const $ = (selector, root = document) =>
    root.querySelector(selector);

let lastRenderSignature = "";


/* ============================================================
   2. SAFE HELPERS
   ============================================================ */

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


function gameState() {
    try {
        return typeof window.SA_GAME?.getState === "function"
            ? window.SA_GAME.getState()
            : null;

    } catch (error) {
        console.warn(
            "Route compass could not read the game state.",
            error
        );

        return null;
    }
}


function currentChapter(state) {
    const chapter = CHAPTERS.find(
        item => item.id === state?.chapterId
    );

    if (chapter) return chapter;

    return CHAPTERS.find(
        item => !state?.completed?.includes(item.id)
    ) ?? null;
}


function roomName(roomId) {
    return getRoom(roomId)?.name ?? roomId ?? "Unknown room";
}


function completedList(state) {
    return Array.isArray(state?.completed)
        ? state.completed
        : [];
}


function inventoryList(state) {
    return Array.isArray(state?.inventory)
        ? state.inventory
        : [];
}


/* ============================================================
   3. MATERIAL PICKUP LOCATIONS
   ============================================================ */

/*
 * The main game can create fallback pickups for materials.
 * Therefore, first ask the live game for pickup locations.
 *
 * If that function is unavailable, use WORLD_OBJECTS from story.js.
 */

function pickupRoomIds(materialId) {
    let locations = [];

    try {
        if (
            typeof window.SA_GAME?.getMaterialPickupRooms === "function"
        ) {
            locations =
                window.SA_GAME.getMaterialPickupRooms(materialId);
        }
    } catch (error) {
        console.warn(
            "Could not read live material locations.",
            error
        );
    }

    if (!Array.isArray(locations) || !locations.length) {
        locations = WORLD_OBJECTS
            .filter(object =>
                object.materialId === materialId &&
                object.collectible === true
            )
            .map(object => object.roomId);
    }

    return [...new Set(
        locations.filter(roomId => Boolean(getRoom(roomId)))
    )];
}


/* ============================================================
   4. DOOR DIRECTION
   ============================================================ */

function doorDirection(exit) {
    const x = Number(exit.x);
    const y = Number(exit.y);

    const left = CANVAS_WIDTH * 0.30;
    const right = CANVAS_WIDTH * 0.70;
    const top = CANVAS_HEIGHT * 0.25;
    const bottom = CANVAS_HEIGHT * 0.75;

    if (x <= left) {
        return {
            label: "WEST · LEFT",
            arrow: "←",
            key: "west"
        };
    }

    if (x >= right) {
        return {
            label: "EAST · RIGHT",
            arrow: "→",
            key: "east"
        };
    }

    if (y <= top) {
        return {
            label: "NORTH · TOP",
            arrow: "↑",
            key: "north"
        };
    }

    if (y >= bottom) {
        return {
            label: "SOUTH · BOTTOM",
            arrow: "↓",
            key: "south"
        };
    }

    // Some maps put exits away from the exact outer edges.
    const dx = x - CANVAS_WIDTH / 2;
    const dy = y - CANVAS_HEIGHT / 2;

    if (Math.abs(dx) >= Math.abs(dy)) {
        return dx < 0
            ? { label: "WEST · LEFT", arrow: "←", key: "west" }
            : { label: "EAST · RIGHT", arrow: "→", key: "east" };
    }

    return dy < 0
        ? { label: "NORTH · TOP", arrow: "↑", key: "north" }
        : { label: "SOUTH · BOTTOM", arrow: "↓", key: "south" };
}


/* ============================================================
   5. SHORTEST ROUTE SEARCH
   ============================================================ */

/*
 * Breadth-first search:
 *
 * A room is a node.
 * A doorway is a connection between two rooms.
 *
 * The algorithm searches the actual exits in story.js.
 *
 * Locked doors are excluded in the first search.
 * If no unlocked route exists, a second search checks
 * whether a route exists but is blocked by a chapter lock.
 */

function findPath(startRoomId, destinationRoomId, progress, allowLocked = false) {
    if (!getRoom(startRoomId) || !getRoom(destinationRoomId)) {
        return null;
    }

    if (startRoomId === destinationRoomId) {
        return {
            rooms: [startRoomId],
            steps: [],
            hasLockedDoor: false
        };
    }

    const queue = [{
        roomId: startRoomId,
        rooms: [startRoomId],
        steps: []
    }];

    const visited = new Set([startRoomId]);

    while (queue.length) {
        const current = queue.shift();

        const exits = getRoomExits(
            current.roomId,
            progress
        );

        for (const exit of exits) {
            if (!exit.targetRoomId) continue;

            if (!getRoom(exit.targetRoomId)) continue;

            if (!allowLocked && exit.locked) continue;

            if (visited.has(exit.targetRoomId)) continue;

            const direction = doorDirection(exit);

            const step = {
                fromRoomId: current.roomId,
                toRoomId: exit.targetRoomId,

                fromRoomName: roomName(current.roomId),
                toRoomName: roomName(exit.targetRoomId),

                doorLabel: exit.label ?? "Unnamed doorway",

                direction,

                locked: Boolean(exit.locked),

                requiredChapterId: exit.requiredChapterId ?? null
            };

            const rooms = [
                ...current.rooms,
                exit.targetRoomId
            ];

            const steps = [
                ...current.steps,
                step
            ];

            if (exit.targetRoomId === destinationRoomId) {
                return {
                    rooms,
                    steps,
                    hasLockedDoor: steps.some(item => item.locked)
                };
            }

            visited.add(exit.targetRoomId);

            queue.push({
                roomId: exit.targetRoomId,
                rooms,
                steps
            });
        }
    }

    return null;
}


/* ============================================================
   6. FIND THE BEST DESTINATION FOR A MATERIAL
   ============================================================ */

function findMaterialRoute(materialId, state, chapter) {
    const destinations = pickupRoomIds(materialId);

    if (!destinations.length) {
        return {
            materialId,
            roomId: null,
            path: null,
            status: "missing-location"
        };
    }

    const progress = {
        completedChapters: completedList(state)
    };

    const candidates = [];

    for (const destinationRoomId of destinations) {
        const unlockedPath = findPath(
            state.roomId,
            destinationRoomId,
            progress,
            false
        );

        if (unlockedPath) {
            candidates.push({
                materialId,
                roomId: destinationRoomId,
                path: unlockedPath,
                status: "available"
            });

            continue;
        }

        const fullPath = findPath(
            state.roomId,
            destinationRoomId,
            progress,
            true
        );

        if (fullPath) {
            candidates.push({
                materialId,
                roomId: destinationRoomId,
                path: fullPath,
                status: "locked"
            });
        }
    }

    if (!candidates.length) {
        return {
            materialId,
            roomId: destinations[0],
            path: null,
            status: "unreachable"
        };
    }

    // Prefer unlocked routes, then the shortest route.
    candidates.sort((a, b) => {
        const aLocked = a.status === "locked" ? 1 : 0;
        const bLocked = b.status === "locked" ? 1 : 0;

        if (aLocked !== bLocked) return aLocked - bLocked;

        return a.path.steps.length - b.path.steps.length;
    });

    return candidates[0];
}


/* ============================================================
   7. GROUP MATERIALS BY DESTINATION
   ============================================================ */

function buildDestinationGroups(state, chapter) {
    const inventory = inventoryList(state);

    const missingMaterials = chapter.requiredMaterials.filter(
        id => !inventory.includes(id)
    );

    const groups = new Map();

    const unlocated = [];
    const unreachable = [];

    for (const materialId of missingMaterials) {
        const route = findMaterialRoute(
            materialId,
            state,
            chapter
        );

        if (route.status === "missing-location") {
            unlocated.push(materialId);
            continue;
        }

        if (!route.path) {
            unreachable.push({
                materialId,
                roomId: route.roomId
            });

            continue;
        }

        const groupKey = route.roomId;

        if (!groups.has(groupKey)) {
            groups.set(groupKey, {
                roomId: route.roomId,
                roomName: roomName(route.roomId),
                path: route.path,
                status: route.status,
                materials: []
            });
        }

        groups.get(groupKey).materials.push(materialId);
    }

    const result = [...groups.values()];

    result.sort((a, b) => {
        const al = a.status === "locked" ? 1 : 0;
        const bl = b.status === "locked" ? 1 : 0;

        if (al !== bl) return al - bl;

        return a.path.steps.length - b.path.steps.length;
    });

    return {
        groups: result,
        unlocated,
        unreachable,
        missingMaterials
    };
}


/* ============================================================
   8. BUILD THE LIST OF ROOM-BY-ROOM DIRECTIONS
   ============================================================ */

function renderRouteSteps(path) {
    if (!path || !path.steps.length) {
        return `
            <div class="sa-route-arrived">
                ✓ You are already in this room.
                Search the room for the material.
            </div>
        `;
    }

    return `
        <ol class="sa-route-steps">
            ${path.steps.map((step, index) => {
                const chapter = step.requiredChapterId
                    ? getChapterById(step.requiredChapterId)
                    : null;

                return `
                    <li class="${step.locked ? "is-locked" : ""}">
                        <span class="sa-route-step-number">
                            ${index + 1}
                        </span>

                        <div class="sa-route-step-content">

                            <span class="sa-route-direction">
                                ${esc(step.direction.arrow)}
                                ${esc(step.direction.label)}
                            </span>

                            <strong>
                                From ${esc(step.fromRoomName)}
                            </strong>

                            <span>
                                Take the "${esc(step.doorLabel)}" doorway.
                            </span>

                            <span class="sa-route-destination">
                                Enter ${esc(step.toRoomName)}
                            </span>

                            ${step.locked
                                ? `
                                    <span class="sa-route-lock">
                                        🔒 Locked until ${
                                            esc(chapter?.title ?? "the required mission")
                                        } is completed.
                                    </span>
                                `
                                : ""}
                        </div>
                    </li>
                `;
            }).join("")}
        </ol>
    `;
}


/* ============================================================
   9. RETURN ROUTE TO EXPERIMENT TABLE
   ============================================================ */

function renderReturnRoute(state, chapter) {
    const inventory = inventoryList(state);

    const allCollected = chapter.requiredMaterials.every(
        id => inventory.includes(id)
    );

    const placedCount = chapter.requiredMaterials.filter(
        id => state.placedByChapter?.[chapter.id]?.includes(id)
    ).length;

    if (!allCollected || placedCount === chapter.requiredMaterials.length) {
        return "";
    }

    const target = chapter.experimentRoomId;

    const progress = {
        completedChapters: completedList(state)
    };

    const path = findPath(
        state.roomId,
        target,
        progress,
        false
    );

    if (!path) {
        return `
            <section class="sa-route-return">
                <h4>↩ Return to the Experiment Table</h4>
                <p>
                    Your materials are collected. The table is in
                    ${esc(roomName(target))}, but no unlocked route
                    is currently available.
                </p>
            </section>
        `;
    }

    return `
        <section class="sa-route-return">
            <h4>↩ After collecting: return to the experiment table</h4>

            <p>
                Destination:
                <strong>${esc(roomName(target))}</strong>
            </p>

            ${renderRouteSteps(path)}
        </section>
    `;
}


/* ============================================================
   10. ROUTE PARCHMENT STYLES
   ============================================================ */

function ensureStyles() {
    if (document.getElementById(ROUTE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = ROUTE_STYLE_ID;

    style.textContent = `
        #${ROUTE_PANEL_ID} {
            position: relative;
            margin-top: 15px;
            padding: 15px 13px 13px;
            overflow: hidden;

            border: 1px solid #b89559;
            border-radius: 4px 12px 5px 11px;

            color: #49351f;

            background:
                radial-gradient(ellipse at 10% 10%, rgba(255,255,255,.64), transparent 45%),
                repeating-linear-gradient(
                    0deg,
                    rgba(111,76,37,.035) 0px,
                    rgba(111,76,37,.035) 1px,
                    transparent 1px,
                    transparent 5px
                ),
                #f5ebd2;

            box-shadow:
                0 2px 5px rgba(53,38,22,.12),
                inset 0 0 22px rgba(160,119,60,.13);

            font-family: Georgia, "Times New Roman", serif;
        }

        #${ROUTE_PANEL_ID}::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 5px;
            background: linear-gradient(
                90deg,
                #765031,
                #d0ae6c,
                #765031
            );
        }

        .sa-route-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 11px;
        }

        .sa-route-heading {
            margin: 0;
            color: #513922;
            font: 600 17px Georgia, serif;
        }

        .sa-route-subtitle {
            margin: 4px 0 0;
            color: #866a46;
            font: 10px/1.5 "Segoe UI", sans-serif;
        }

        .sa-route-current {
            margin: 9px 0 13px;
            padding: 9px 10px;
            border-left: 3px solid #9b7139;
            background: rgba(255,255,255,.48);
        }

        .sa-route-current small {
            display: block;
            color: #8c6b40;
            font: 800 9px "Segoe UI", sans-serif;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .sa-route-current strong {
            display: block;
            margin-top: 3px;
            color: #4c3621;
            font: 700 13px "Segoe UI", sans-serif;
        }

        .sa-route-destination {
            margin-top: 7px;
            padding-top: 8px;
            border-top: 1px solid rgba(126,92,48,.22);
            color: #5d4025;
            font: 700 12px "Segoe UI", sans-serif;
        }

        .sa-route-materials {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 7px 0 9px;
        }

        .sa-route-material-chip {
            display: inline-flex;
            padding: 4px 7px;
            border: 1px solid rgba(133,96,47,.3);
            border-radius: 3px;
            color: #634725;
            background: rgba(255,255,255,.48);
            font: 700 9px "Segoe UI", sans-serif;
        }

        .sa-route-steps {
            display: grid;
            gap: 8px;
            margin: 9px 0 0;
            padding: 0;
            list-style: none;
        }

        .sa-route-steps li {
            display: grid;
            grid-template-columns: 23px minmax(0,1fr);
            gap: 8px;
            align-items: start;
        }

        .sa-route-step-number {
            display: grid;
            width: 22px;
            height: 22px;
            place-items: center;
            border: 1px solid #b68d4e;
            border-radius: 50%;
            color: #664821;
            background: #ebd7a9;
            font: 800 10px "Segoe UI", sans-serif;
        }

        .sa-route-step-content {
            display: grid;
            gap: 3px;
            min-width: 0;
            color: #705436;
            font: 10px/1.45 "Segoe UI", sans-serif;
        }

        .sa-route-step-content strong {
            color: #513922;
            font-size: 11px;
        }

        .sa-route-direction {
            color: #835b29;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .6px;
        }

        .sa-route-destination {
            margin: 0;
            padding: 0;
            border: 0;
            color: #3e6645;
            font-size: 10px;
            font-weight: 800;
        }

        .sa-route-arrived {
            margin-top: 9px;
            padding: 8px;
            border: 1px dashed #a68855;
            color: #426342;
            background: rgba(255,255,255,.47);
            font: 700 10px/1.5 "Segoe UI", sans-serif;
        }

        .sa-route-locked {
            margin-top: 4px;
            color: #9a3f40;
            font-size: 10px;
            font-weight: 700;
        }

        .sa-route-alert {
            margin-top: 9px;
            padding: 9px;
            border-left: 3px solid #9b7139;
            color: #755735;
            background: rgba(255,255,255,.48);
            font: 10px/1.6 "Segoe UI", sans-serif;
        }

        .sa-route-return {
            margin-top: 13px;
            padding-top: 11px;
            border-top: 1px dashed rgba(126,92,48,.42);
        }

        .sa-route-return h4 {
            margin: 0 0 6px;
            color: #624629;
            font: 700 12px "Segoe UI", sans-serif;
        }

        .sa-route-return p {
            margin: 4px 0;
            color: #755735;
            font: 10px/1.5 "Segoe UI", sans-serif;
        }

        .sa-route-refresh {
            min-height: 29px;
            padding: 5px 8px;
            border: 1px solid #ad8a54;
            border-radius: 5px;
            color: #654820;
            background: rgba(255,255,255,.52);
            font: 700 9px "Segoe UI", sans-serif;
            cursor: pointer;
        }

        .sa-route-refresh:hover {
            background: #fff8e9;
        }

        .sa-route-empty {
            padding: 11px;
            border: 1px dashed rgba(130,96,53,.4);
            color: #725738;
            background: rgba(255,255,255,.43);
            font: 11px/1.6 "Segoe UI", sans-serif;
        }

        @media (max-width: 520px) {
            .sa-route-header {
                flex-wrap: wrap;
            }
        }
    `;

    document.head.appendChild(style);
}


/* ============================================================
   11. CREATE THE PARCHMENT UNDER THE MATERIAL CHECKLIST
   ============================================================ */

function ensureParchment() {
    let panel = document.getElementById(ROUTE_PANEL_ID);

    if (panel) return panel;

    const anchor =
        $("#mission-material-guide") ||
        $("#quest-objective") ||
        $("#quest-panel");

    if (!anchor) {
        console.warn(
            "Route parchment could not find the Active Mission panel."
        );
        return null;
    }

    panel = document.createElement("section");
    panel.id = ROUTE_PANEL_ID;
    panel.setAttribute("aria-live", "polite");
    panel.setAttribute("aria-label", "Room-by-room ingredient directions");

    anchor.insertAdjacentElement("afterend", panel);

    return panel;
}


/* ============================================================
   12. RENDER ONE DESTINATION CARD
   ============================================================ */

function renderDestinationCard(group, index) {
    const itemNames = group.materials.map(id =>
        MATERIALS[id]?.name ?? id
    );

    const locked = group.status === "locked";

    return `
        <article class="sa-route-destination">

            <strong>
                ${index + 1}. ${esc(group.roomName)}
                ${locked ? " · LOCKED ROUTE" : ""}
            </strong>

            <div class="sa-route-materials">
                ${itemNames.map(name => `
                    <span class="sa-route-material-chip">
                        ${esc(name)}
                    </span>
                `).join("")}
            </div>

            ${renderRouteSteps(group.path)}

        </article>
    `;
}


/* ============================================================
   13. MAIN PARCHMENT RENDERER
   ============================================================ */

export function renderRouteParchment() {
    const panel = ensureParchment();

    if (!panel) return;

    const state = gameState();

    if (!state) {
        panel.innerHTML = `
            <div class="sa-route-empty">
                The compass is waiting for the game world to load.
            </div>
        `;
        return;
    }

    const chapter = currentChapter(state);

    if (!chapter) {
        panel.innerHTML = `
            <div class="sa-route-empty">
                No active mission is available.
            </div>
        `;
        return;
    }

    const current = getRoom(state.roomId);

    if (!current) {
        panel.innerHTML = `
            <div class="sa-route-empty">
                Current room not found. Check the room ID in main.js
                and story.js.
            </div>
        `;
        return;
    }

    const progress = {
        completedChapters: completedList(state)
    };

    const routeData = buildDestinationGroups(state, chapter);

    const groupHtml = routeData.groups.length
        ? routeData.groups.map(renderDestinationCard).join("")
        : `
            <div class="sa-route-empty">
                ${routeData.missingMaterials.length
                    ? "No outstanding material routes are available."
                    : "All required materials have been collected. Well done!"}
            </div>
        `;

    const unlocatedHtml = routeData.unlocated.length
        ? `
            <div class="sa-route-alert">
                <strong>Pickup location not registered:</strong>
                ${routeData.unlocated.map(id =>
                    esc(MATERIALS[id]?.name ?? id)
                ).join(", ")}.

                The material needs a collectible entry in WORLD_OBJECTS
                or a live pickup location in main.js.
            </div>
        `
        : "";

    const unreachableHtml = routeData.unreachable.length
        ? `
            <div class="sa-route-alert">
                <strong>No route found:</strong>
                ${routeData.unreachable.map(item =>
                    `${esc(MATERIALS[item.materialId]?.name ?? item.materialId)} (${esc(roomName(item.roomId))})`
                ).join(", ")}.

                Check whether the destination room is connected to the
                current room in story.js.
            </div>
        `
        : "";

    const returnRoute = renderReturnRoute(state, chapter);

    const signature = JSON.stringify({
        roomId: state.roomId,
        chapterId: chapter.id,
        inventory: inventoryList(state),
        completed: completedList(state),
        placed: state.placedByChapter?.[chapter.id] ?? []
    });

    lastRenderSignature = signature;

    panel.innerHTML = `
        <div class="sa-route-header">

            <div>
                <h3 class="sa-route-heading">
                    📜 The Apprentice's Route Parchment
                </h3>

                <p class="sa-route-subtitle">
                    Follow the connected doorways to find each ingredient.
                </p>
            </div>

            <button type="button"
                class="sa-route-refresh"
                data-route-refresh>
                ↻ Refresh
            </button>

        </div>

        <div class="sa-route-current">
            <small>Your current location</small>
            <strong>📍 ${esc(current.name)}</strong>
        </div>

        ${
            routeData.groups.length
                ? `
                    <p class="sa-route-subtitle">
                        ${routeData.missingMaterials.length}
                        ingredient(s) still need collecting.
                        Destinations are grouped to avoid unnecessary travel.
                    </p>

                    ${groupHtml}
                `
                : groupHtml
        }

        ${unlocatedHtml}
        ${unreachableHtml}
        ${returnRoute}

        <div class="sa-route-alert">
            <strong>How to follow the parchment:</strong>
            Walk to the indicated side of the room, approach the named
            doorway and press E. The compass updates when you enter
            the next room. It guides room-to-room travel; you still
            control the apprentice.
        </div>
    `;
}


/* ============================================================
   14. AUTOMATIC REFRESH
   ============================================================ */

function scheduleRefresh() {
    window.requestAnimationFrame(() => {
        renderRouteParchment();
    });
}

function bindEvents() {
    window.addEventListener("sa:room-entered", scheduleRefresh);
    window.addEventListener("sa:material-collected", scheduleRefresh);
    window.addEventListener("sa:material-placed", scheduleRefresh);
    window.addEventListener("sa:chapter-completed", scheduleRefresh);
    window.addEventListener("sa:chapter-activated", scheduleRefresh);

    window.addEventListener("pageshow", scheduleRefresh);
    window.addEventListener("storage", scheduleRefresh);

    document.addEventListener("click", event => {
        if (event.target.closest("[data-route-refresh]")) {
            renderRouteParchment();
        }
    });

    // Refresh when the player returns to the game tab.
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) scheduleRefresh();
    });
}


/* ============================================================
   15. INITIALISE
   ============================================================ */

function initialiseCompass() {
    ensureStyles();
    ensureParchment();
    bindEvents();
    renderRouteParchment();

    console.info(
        "Apprentice Route Compass loaded. Current room:",
        gameState()?.roomId ?? "waiting for game"
    );
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialiseCompass,
        { once: true }
    );
} else {
    initialiseCompass();
}


/* ============================================================
   16. PUBLIC COMPASS API
   ============================================================ */

window.SA_COMPASS = {
    refresh: renderRouteParchment,

    getCurrentRoom: () => gameState()?.roomId ?? null,

    getRoutes() {
        const state = gameState();
        const chapter = currentChapter(state);

        if (!state || !chapter) return [];

        return buildDestinationGroups(state, chapter)
            .groups
            .map(group => ({
                destination: group.roomName,
                materials: group.materials.map(id =>
                    MATERIALS[id]?.name ?? id
                ),
                rooms: group.path.rooms.map(roomName),
                steps: group.path.steps.map(step => ({
                    from: step.fromRoomName,
                    door: step.doorLabel,
                    direction: step.direction.label,
                    to: step.toRoomName,
                    locked: step.locked
                }))
            }));
    }
};

