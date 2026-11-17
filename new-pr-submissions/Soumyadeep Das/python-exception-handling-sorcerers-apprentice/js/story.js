
/*
 * ============================================================
 * THE SORCERER'S APPRENTICE
 * WORLD, CHARACTERS, ROOMS, MATERIALS AND STORY DATA
 * ============================================================
 *
 * This file contains world data only.
 *
 * main.js will control:
 * - Apprentice movement
 * - Room transitions
 * - Collision
 * - Object inspection
 * - Material collection
 * - Character interaction
 * - Mission navigation
 *
 * activities.js will control:
 * - Magical experiments
 * - Python execution simulations
 * - Success and failure results
 *
 * support.js will control:
 * - Inventory persistence
 * - Quest progress
 * - Spellbook
 * - Golden stars
 *
 * Everything runs locally.
 * No API, CDN, internet service or online Python runtime.
 */


/* ============================================================
   1. GAME CONFIGURATION
   ============================================================ */

export const GAME_CONFIG = {
    canvas: {
        width: 1100,
        height: 650
    },

    movement: {
        speed: 190,
        diagonalSpeed: 134,
        playerWidth: 46,
        playerHeight: 58,
        interactionDistance: 85,
        exitDistance: 65
    },

    interaction: {
        objectDistance: 90,
        grabDistance: 75,
        inspectDistance: 115
    },

    inventory: {
        maximumUniqueItems: 60,
        allowDuplicateMaterials: false,
        preserveCollectedMaterials: true
    },

    progression: {
        chapterCount: 8,
        starsPerSuccessfulExperiment: 1,
        requireExperimentSuccess: true,
        allowUnlimitedRetries: true,
        allowSkippingMissions: false
    },

    controls: {
        up: ["ArrowUp", "w", "W"],
        down: ["ArrowDown", "s", "S"],
        left: ["ArrowLeft", "a", "A"],
        right: ["ArrowRight", "d", "D"],
        grab: ["e", "E"],
        inspect: ["i", "I"],
        release: ["q", "Q"]
    }
};


/* ============================================================
   2. PLAYER CHARACTER
   ============================================================ */

export const PLAYER = {
    id: "apprentice",

    name: "The Apprentice",

    role: "Young apprentice of the Master's Tower",

    spriteSheet: "assets/characters/apprentice-sprite.png",

    portrait: "assets/img7.png",

    fallbackEmoji: "🧙",

    width: 46,

    height: 58,

    speed: GAME_CONFIG.movement.speed,

    startingRoomId: "potion-lab",

    startingPosition: {
        x: 550,
        y: 420
    },

    startingInventory: [],

    movement: {
        directions: ["up", "down", "left", "right"],

        allowDiagonal: true,

        stopAtRoomBoundary: true
    },

    description:
        "A young apprentice who has inherited the Master's workshop and its unfinished experiments.",

    appearance: {
        clothing: "Dark brown apprentice robes",

        accessory: "Leather shoulder bag",

        mainTool: "A wooden wand"
    }
};


/* ============================================================
   3. THE MASTER
   ============================================================ */

export const MASTER = {
    id: "master",

    name: "The Master",

    role: "Master of the Tower and Guide of Magical Experiments",

    portrait: "assets/img4.png",

    sprite: "assets/characters/master-sprite.png",

    fallbackEmoji: "🧙‍♂️",

    description:
        "A wise and demanding magician who teaches through experiments rather than lectures.",

    dialogueStyle: {
        tone: "Wise, patient, direct and encouraging",

        explainFailure: true,

        explainSuccess: true,

        neverBlameThePlayer: true,

        allowUnlimitedRetries: true
    },

    rule:
        "A failed experiment is not a defeat. Understand the failure, correct the spell and try again.",

    physicalReturnChapter: 8
};


/* ============================================================
   4. OPENING STORY
   ============================================================ */

export const STORY_INTRO = {
    title: "The Sorcerer's Apprentice",

    subtitle: "A Magical Adventure into Python Exception Handling",

    scenes: [
        {
            id: "opening-1",

            speaker: "The Master",

            text:
                "The tower has stood for centuries. Every room holds a different branch of magic, and every experiment follows rules that must never be ignored."
        },

        {
            id: "opening-2",

            speaker: "The Master",

            text:
                
                "You are my apprentice. Before any spell is cast, you will gather its materials, arrange them into a program and run the experiment yourself. Nothing has failed until you execute it."
        },

        {
            id: "opening-3",

            speaker: "The Master",

            text:
                "Do not fear a failed experiment. A magician who understands failure becomes more capable than one who only knows how to succeed."
        },

        {
            id: "opening-4",

            speaker: "The Apprentice",

            text:
                "I am ready, Master. Show me the first experiment."
        },

        {
            id: "opening-5",

            speaker: "The Master",

            text:
                 "Your first task is in the Potion Lab. Collect the materials marked for your experiment from the six connected learning rooms, then bring them to the Potion Lab table. You will build and run Python programs yourself."
        }
    ]
};


/* ============================================================
   5. MAP ASSET REGISTRY
   ============================================================ */

/*
 * These nine maps originate from the uploaded maps.docx.
 *
 * Extract each corresponding image from:
 * maps.docx -> word -> media
 *
 * Rename it according to the filename below.
 *
 * Place all nine images inside assets/maps/.
 *
 * Existing story illustrations remain in assets/img1.png
 * through assets/img26.png.
 */

export const MAP_ASSETS = {
    world: {
        id: "world",

        name: "The Realm",

        src: "assets/maps/world-map.png",

        source: "maps.docx / image1.png",

        width: 785,

        height: 778
    },

    towerSuite: {
        id: "tower-suite",

        name: "Mage's Tower Room Suite",

        src: "assets/maps/tower-room-suite.png",

        source: "maps.docx / image2.png",

        width: 777,

        height: 782
    },

    observatory: {
        id: "observatory",

        name: "Observatory Floor",

        src: "assets/maps/observatory-floor.png",

        source: "maps.docx / image3.png",

        width: 772,

        height: 776
    },

    forestOutpost: {
        id: "forest-outpost",

        name: "Forest Outpost",

        src: "assets/maps/forest-outpost.png",

        source: "maps.docx / image4.png",

        width: 781,

        height: 781
    },

    academy: {
        id: "academy",

        name: "Academy Grounds",

        src: "assets/maps/academy-grounds.png",

        source: "maps.docx / image5.png",

        width: 1387,

        height: 785
    },

    undercroft: {
        id: "undercroft",

        name: "Undercroft Ritual Chamber",

        src: "assets/maps/undercroft-portal.png",

        source: "maps.docx / image6.png",

        width: 750,

        height: 667
    },

    towerMain: {
        id: "tower-main",

        name: "Mage Tower Main Floor",

        src: "assets/maps/tower-main-floor.png",

        source: "maps.docx / image7.png",

        width: 820,

        height: 787
    },

    stowerd: {
        id: "stowerd",

        name: "Stowerd Region",

        src: "assets/maps/stowerd-region.png",

        source: "maps.docx / image8.png",

        width: 850,

        height: 640
    },

    towerFloors: {
        id: "tower-floors",

        name: "Mage's Tower Floor Plan",

        src: "assets/maps/mages-tower-floors.png",

        source: "maps.docx / image9.png",

        width: 1105,

        height: 775
    }
};


/* ============================================================
   6. WORLD MAP LOCATIONS
   ============================================================ */

/*
 * Coordinates are percentages of the map image.
 * These allow main.js to position location markers.
 *
 * Names preserve the spelling and labels in the original map.
 */

export const WORLD_MAP_LOCATIONS = [
    {
        id: "dragons-peak",

        label: "Dragon's Peak",

        mapId: "world",

        x: 19,

        y: 9,

        icon: "🐉",

        targetRoomId: "forest-path",

        description:
            "A distant mountain region said to shelter ancient creatures.",

        unlockAfterChapter: 5,

        optional: true
    },

    {
        id: "eagles-watch",

        label: "Eagle's Watch",

        mapId: "world",

        x: 59,

        y: 15,

        icon: "🏰",

        targetRoomId: "forest-path",

        description:
            "A watchtower overlooking the old kingdom.",

        unlockAfterChapter: 4,

        optional: true
    },

    {
        id: "misty-sea",

        label: "Misty Sea",

        mapId: "world",

        x: 13,

        y: 30,

        icon: "🌊",

        targetRoomId: "forest-path",

        description:
            "A mysterious sea surrounded by old legends.",

        unlockAfterChapter: 5,

        optional: true
    },

    {
        id: "briarwood-village",

        label: "Briarwood Village",

        mapId: "world",

        x: 13,

        y: 58,

        icon: "🏘️",

        targetRoomId: "briarwood-village",

        description:
            "A quiet village on the edge of the enchanted woodland.",

        unlockAfterChapter: 0,

        optional: true
    },

    {
        id: "stormwind-castle",

        label: "Stormwind Castle",

        mapId: "world",

        x: 83,

        y: 37,

        icon: "🏰",

        targetRoomId: "forest-path",

        description:
            "A castle whose old walls are said to hold forgotten secrets.",

        unlockAfterChapter: 6,

        optional: true
    },

    {
        id: "enchanted-forest-temple",

        label: "Enchanted Forest Temple",

        mapId: "world",

        x: 49,

        y: 69,

        icon: "🌳",

        targetRoomId: "forest-temple",

        description:
            "An ancient temple hidden beneath the forest canopy.",

        unlockAfterChapter: 0,

        optional: true
    },

    {
        id: "pirall-cove",

        label: "Pirall Cove",

        mapId: "world",

        x: 83,

        y: 79,

        icon: "⛵",

        targetRoomId: "forest-path",

        description:
            "A secluded coastal settlement.",

        unlockAfterChapter: 7,

        optional: true
    }
];


/* ============================================================
   7. ACADEMY MAP LOCATIONS
   ============================================================ */

/*
 * The labels correspond to the map in maps.docx/image5.png.
 *
 * Some buildings are playable entrances.
 * Others are optional exploration destinations for later.
 */

export const ACADEMY_MAP_LOCATIONS = [
    {
        id: "astronomy-tower",
        label: "Astronomy Tower",
        x: 17,
        y: 26,
        targetRoomId: "observatory",
        icon: "🔭",
        unlockAfterChapter: 0
    },

    {
        id: "classroom",
        label: "Classroom",
        x: 31,
        y: 27,
        targetRoomId: "research-room",
        icon: "📚",
        unlockAfterChapter: 0
    },

    {
        id: "dorm",
        label: "Dorm",
        x: 54,
        y: 16,
        targetRoomId: "apprentice-chamber",
        icon: "🛏️",
        unlockAfterChapter: 0
    },

    {
        id: "forest",
        label: "Forest",
        x: 76,
        y: 11,
        targetRoomId: "forest-path",
        icon: "🌲",
        unlockAfterChapter: 0
    },

    {
        id: "alchemy-tower",
        label: "Alchemy Tower",
        x: 45,
        y: 30,
        targetRoomId: "entrance-hall",
        icon: "🧪",
        unlockAfterChapter: 0
    },

    {
        id: "ward",
        label: "Ward",
        x: 64,
        y: 29,
        targetRoomId: "rune-chamber",
        icon: "🛡️",
        unlockAfterChapter: 1
    },

    {
        id: "forging-tower",
        label: "Forging Tower",
        x: 28,
        y: 41,
        targetRoomId: "tower-storage",
        icon: "⚒️",
        unlockAfterChapter: 0
    },

    {
        id: "kitchen",
        label: "Kitchen",
        x: 8,
        y: 48,
        targetRoomId: "academy-grounds",
        icon: "🍲",
        unlockAfterChapter: 0
    },

    {
        id: "dining-hall",
        label: "Dining Hall",
        x: 22,
        y: 59,
        targetRoomId: "academy-grounds",
        icon: "🍽️",
        unlockAfterChapter: 0
    },

    {
        id: "training-hall",
        label: "Training Hall",
        x: 13,
        y: 78,
        targetRoomId: "academy-grounds",
        icon: "⚔️",
        unlockAfterChapter: 0
    },

    {
        id: "library",
        label: "Library",
        x: 51,
        y: 47,
        targetRoomId: "academy-library",
        icon: "📖",
        unlockAfterChapter: 0
    },

    {
        id: "field",
        label: "Field",
        x: 81,
        y: 46,
        targetRoomId: "academy-garden",
        icon: "🌾",
        unlockAfterChapter: 0
    },

    {
        id: "garden",
        label: "Garden",
        x: 59,
        y: 72,
        targetRoomId: "academy-garden",
        icon: "🌷",
        unlockAfterChapter: 0
    },

    {
        id: "greenhouse",
        label: "Greenhouse",
        x: 43,
        y: 83,
        targetRoomId: "greenhouse",
        icon: "🌿",
        unlockAfterChapter: 0
    },

    {
        id: "shopping",
        label: "Shopping",
        x: 88,
        y: 90,
        targetRoomId: "academy-grounds",
        icon: "🛍️",
        unlockAfterChapter: 2
    }
];


/* ============================================================
   8. TOWER MAP ROOM LEGENDS
   ============================================================ */

/*
 * Mage's Tower Floor Plan — image9.
 *
 * Preserve the letters used in the original legend.
 */

export const TOWER_PLAN_ROOMS = [
    {
        letter: "A",
        name: "Entrance Hall",
        roomId: "entrance-hall",
        floor: 1
    },

    {
        letter: "B",
        name: "Animal Cages",
        roomId: "animal-cages",
        floor: 1
    },

    {
        letter: "C",
        name: "Trophy Room",
        roomId: "trophy-room",
        floor: 2
    },

    {
        letter: "D",
        name: "Portal Room",
        roomId: "portal-room",
        floor: 2
    },

    {
        letter: "E",
        name: "Alchemy Lab",
        roomId: "alchemy-lab",
        floor: 2
    },

    {
        letter: "F",
        name: "Herb Garden",
        roomId: "herb-garden",
        floor: 2
    },

    {
        letter: "G",
        name: "Reception Room",
        roomId: "reception-room",
        floor: 1
    },

    {
        letter: "H",
        name: "Master Bedroom",
        roomId: "masters-bedroom",
        floor: 1
    },

    {
        letter: "I",
        name: "Study / Orrery",
        roomId: "study-orrery",
        floor: 3
    },

    {
        letter: "J",
        name: "Observatory",
        roomId: "observatory",
        floor: 3
    }
];


/*
 * Mage Tower Main Floor — image7.
 */

export const MAIN_FLOOR_ROOMS = [
    {
        name: "Storage",
        roomId: "tower-storage"
    },

    {
        name: "Parlor",
        roomId: "tower-parlour"
    },

    {
        name: "Research",
        roomId: "research-room"
    },

    {
        name: "Study",
        roomId: "tower-study"
    },

    {
        name: "Battlements",
        roomId: "entrance-hall"
    }
];


/* ============================================================
   9. ROOM AND EXIT HELPERS
   ============================================================ */

const WORLD_WIDTH = GAME_CONFIG.canvas.width;
const WORLD_HEIGHT = GAME_CONFIG.canvas.height;

function createExit(
    id,
    label,
    targetRoomId,
    x,
    y,
    targetX,
    targetY,
    options = {}
) {
    return {
        id,

        label,

        targetRoomId,

        x,

        y,

        radius: options.radius ?? 58,

        targetSpawn: {
            x: targetX,
            y: targetY
        },

        requiredChapterId:
            options.requiredChapterId ?? null,

        lockedMessage:
            options.lockedMessage ??
            "This passage is not yet available.",

        transition:
            options.transition ?? "walk"
    };
}

function createRoom(data) {
    return {
        id: data.id,

        name: data.name,

        region: data.region ?? "Mage's Tower",

        floor: data.floor ?? null,

        mapId: data.mapId,

        backgroundAsset: data.backgroundAsset,

        backgroundCrop: data.backgroundCrop ?? null,

        worldWidth: WORLD_WIDTH,

        worldHeight: WORLD_HEIGHT,

        description: data.description ?? "",

        ambience: data.ambience ?? "quiet",

        spawn: data.spawn ?? {
            x: 550,
            y: 420
        },

        walkBounds: data.walkBounds ?? {
            left: 35,
            top: 55,
            right: 1065,
            bottom: 615
        },

        collisionRects: data.collisionRects ?? [],

        exits: data.exits ?? [],

        objectIds: data.objectIds ?? [],

        masterPosition: data.masterPosition ?? null,

        experimentStation: data.experimentStation ?? null,

        isOutside: data.isOutside ?? false,

        isSafeZone: data.isSafeZone ?? false,

        unlockAfterChapter:
            data.unlockAfterChapter ?? 0,

        roomArt: data.roomArt ?? null
    };
}


/* ============================================================
   10. PLAYABLE ROOMS
   ============================================================ */

/*
 * World coordinates always use 1100 x 650.
 *
 * Background crops use the original image pixel coordinates.
 * main.js should crop the original map image before drawing it
 * across the game canvas.
 *
 * Positions, object locations and exits are game coordinates,
 * not original image pixel coordinates.
 */

export const ROOMS = {

    /* --------------------------------------------------------
       THE APPRENTICE'S STARTING QUARTERS
       Map: image2, top-left section.
       -------------------------------------------------------- */

    "apprentice-chamber": createRoom({
        id: "apprentice-chamber",

        name: "The Apprentice's Chamber",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerSuite",

        backgroundAsset: MAP_ASSETS.towerSuite.src,

        backgroundCrop: {
            x: 0,
            y: 0,
            width: 390,
            height: 390
        },

        description:
            "A small chamber where the apprentice keeps personal belongings and prepares for the Master's tasks.",

        ambience: "warm-room",

        spawn: {
            x: 550,
            y: 420
        },

        exits: [
            createExit(
                "chamber-east",
                "Enter the Rune Chamber",
                "rune-chamber",
                1050,
                325,
                65,
                325
            ),

            createExit(
                "chamber-south",
                "Visit the Archive Annex",
                "archive-annex",
                550,
                615,
                550,
                65
            ),

            createExit(
                "chamber-west",
                "Visit the Entrance Hall",
                "entrance-hall",
                40,
                325,
                1030,
                350
            )
        ],

        objectIds: [
            "apprentice-bed",
            "old-trunk",
            "wooden-wand",
            "empty-shoulder-bag"
        ],

        isSafeZone: true
    }),


    /* --------------------------------------------------------
       RUNE CHAMBER
       Map: image2, top-right section.
       -------------------------------------------------------- */

    "rune-chamber": createRoom({
        id: "rune-chamber",

        name: "The Rune Chamber",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerSuite",

        backgroundAsset: MAP_ASSETS.towerSuite.src,

        backgroundCrop: {
            x: 390,
            y: 0,
            width: 387,
            height: 390
        },

        description:
            "A chamber of glowing rune circles. Every symbol represents a different instruction in a magical spell.",

        ambience: "arcane",

        spawn: {
            x: 65,
            y: 325
        },

        exits: [
            createExit(
                "rune-west",
                "Return to the Apprentice's Chamber",
                "apprentice-chamber",
                40,
                325,
                1030,
                325
            ),

            createExit(
                "rune-south",
                "Enter the Potion Lab",
                "potion-lab",
                550,
                615,
                550,
                65
            ),

            createExit(
                "rune-east",
                "Visit the Study",
                "tower-study",
                1060,
                325,
                65,
                325
            )
        ],

        objectIds: [
            "binding-sigil",
            "try-rune",
            "floating-rune-stone",
            "broken-symbol"
        ]
    }),


    /* --------------------------------------------------------
       ARCHIVE ANNEX
       Map: image2, bottom-left section.
       -------------------------------------------------------- */

    "archive-annex": createRoom({
        id: "archive-annex",

        name: "The Archive Annex",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerSuite",

        backgroundAsset: MAP_ASSETS.towerSuite.src,

        backgroundCrop: {
            x: 0,
            y: 390,
            width: 390,
            height: 392
        },

        description:
            "A private collection of scrolls, reference books and unfinished magical notes.",

        ambience: "quiet-library",

        spawn: {
            x: 550,
            y: 65
        },

        exits: [
            createExit(
                "archive-north",
                "Return to the Apprentice's Chamber",
                "apprentice-chamber",
                550,
                35,
                550,
                585
            ),

            createExit(
                "archive-east",
                "Visit the Potion Lab",
                "potion-lab",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "archive-south",
                "Enter the Academy",
                "academy-grounds",
                550,
                615,
                700,
                580
            )
        ],

        objectIds: [
            "archive-spellbook",
            "bookmark",
            "dusty-scroll",
            "old-parchment"
        ]
    }),


    /* --------------------------------------------------------
       POTION LAB
       Map: image2, bottom-right section.
       -------------------------------------------------------- */

    "potion-lab": createRoom({
        id: "potion-lab",

        name: "The Potion Lab",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerSuite",

        backgroundAsset: MAP_ASSETS.towerSuite.src,

        backgroundCrop: {
            x: 390,
            y: 390,
            width: 387,
            height: 392
        },

        description:
            "Shelves of vials and strange ingredients surround a table used for magical experiments.",

        ambience: "potion-room",

        spawn: {
            x: 65,
            y: 325
        },

        exits: [
            createExit(
                "potion-west",
                "Visit the Archive Annex",
                "archive-annex",
                40,
                325,
                1030,
                325
            ),

            createExit(
                "potion-north",
                "Return to the Rune Chamber",
                "rune-chamber",
                550,
                35,
                550,
                585
            ),

            createExit(
                "potion-south",
                "Enter the Main Alchemy Lab",
                "alchemy-lab",
                550,
                615,
                550,
                65
            )
        ],

        objectIds: [
            "zero-crystal",
            "moonwater-vial",
            "empty-vial",
            "blue-thistle",
            "red-mushroom",
            "glass-stirrer",
            "cracked-potion"
        ],

        masterPosition: {
            x: 870,
            y: 245
        },

        experimentStation: {
            id: "potion-table",

            x: 550,

            y: 215,

            radius: 105,

            label: "Potion Experiment Table"
        }
    }),


    /* --------------------------------------------------------
       TOWER ENTRANCE HALL
       Map: image9, first-floor left section.
       -------------------------------------------------------- */

    "entrance-hall": createRoom({
        id: "entrance-hall",

        name: "Entrance Hall",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 260,
            y: 0,
            width: 405,
            height: 380
        },

        description:
            "The tower's great entrance. The floor carries the marks of countless visitors and magical journeys.",

        ambience: "stone-hall",

        spawn: {
            x: 550,
            y: 350
        },

        exits: [
            createExit(
                "entrance-west",
                "Return to the Apprentice's Chamber",
                "apprentice-chamber",
                40,
                350,
                1050,
                325
            ),

            createExit(
                "entrance-north",
                "Visit the Animal Cages",
                "animal-cages",
                550,
                55,
                550,
                585
            ),

            createExit(
                "entrance-east",
                "Visit the Reception Room",
                "reception-room",
                1060,
                330,
                65,
                340
            ),

            createExit(
                "entrance-south",
                "Go to the Academy Grounds",
                "academy-grounds",
                550,
                615,
                700,
                570
            )
        ],

        objectIds: [
            "entrance-door",
            "old-key",
            "tower-inscription",
            "stone-lantern"
        ]
    }),


    /* --------------------------------------------------------
       ANIMAL CAGES
       Map: image9, first-floor left area.
       -------------------------------------------------------- */

    "animal-cages": createRoom({
        id: "animal-cages",

        name: "Animal Cages",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 280,
            y: 40,
            width: 350,
            height: 320
        },

        description:
            "Small enchanted creatures live here. Some leave behind unusual feathers, scales and magical traces.",

        ambience: "creature-room",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "cages-south",
                "Return to the Entrance Hall",
                "entrance-hall",
                550,
                615,
                550,
                80
            )
        ],

        objectIds: [
            "silver-feather",
            "empty-creature-cage",
            "glimmering-scale",
            "sleeping-owl"
        ]
    }),


    /* --------------------------------------------------------
       RECEPTION ROOM
       Map: image9, first-floor right section.
       -------------------------------------------------------- */

    "reception-room": createRoom({
        id: "reception-room",

        name: "Reception Room",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 690,
            y: 45,
            width: 395,
            height: 340
        },

        description:
            "The main meeting room of the tower, where the Master welcomes visitors and assigns important work.",

        ambience: "warm-hall",

        spawn: {
            x: 65,
            y: 330
        },

        exits: [
            createExit(
                "reception-west",
                "Return to the Entrance Hall",
                "entrance-hall",
                40,
                330,
                1030,
                350
            ),

            createExit(
                "reception-north",
                "Visit the Master's Bedroom",
                "masters-bedroom",
                550,
                55,
                550,
                585
            ),

            createExit(
                "reception-south",
                "Visit the Trophy Room",
                "trophy-room",
                550,
                615,
                550,
                70
            ),

            createExit(
                "reception-east",
                "Visit the Parlor",
                "tower-parlour",
                1060,
                325,
                65,
                325
            )
        ],

        objectIds: [
            "golden-candlestick",
            "visitors-book",
            "old-map-fragment",
            "decorative-shield"
        ]
    }),


    /* --------------------------------------------------------
       MASTER'S BEDROOM
       Map: image9, first-floor right section.
       -------------------------------------------------------- */

    "masters-bedroom": createRoom({
        id: "masters-bedroom",

        name: "Master's Bedroom",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 690,
            y: 45,
            width: 395,
            height: 340
        },

        description:
            "A private chamber filled with old keepsakes and unfinished magical research.",

        ambience: "quiet-room",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "bedroom-south",
                "Return to the Reception Room",
                "reception-room",
                550,
                615,
                550,
                75
            )
        ],

        objectIds: [
            "master-diary",
            "old-pocket-watch",
            "sealed-letter"
        ],

        unlockAfterChapter: 6
    }),


    /* --------------------------------------------------------
       TROPHY ROOM
       Map: image9, second-floor circular section.
       -------------------------------------------------------- */

    "trophy-room": createRoom({
        id: "trophy-room",

        name: "Trophy Room",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 135,
            y: 400,
            width: 555,
            height: 355
        },

        description:
            "The Master keeps important discoveries, old magical tools and objects recovered from dangerous experiments here.",

        ambience: "treasure-room",

        spawn: {
            x: 550,
            y: 70
        },

        exits: [
            createExit(
                "trophy-north",
                "Return to the Reception Room",
                "reception-room",
                550,
                35,
                550,
                585
            ),

            createExit(
                "trophy-east",
                "Enter the Portal Room",
                "portal-room",
                1060,
                330,
                65,
                325
            ),

            createExit(
                "trophy-west",
                "Visit the Alchemy Lab",
                "alchemy-lab",
                40,
                330,
                1030,
                325
            )
        ],

        objectIds: [
            "zero-ward",
            "rule-stone",
            "exception-quill",
            "broken-crystal",
            "ancient-medal"
        ]
    }),


    /* --------------------------------------------------------
       PORTAL ROOM
       Map: image9, second-floor section.
       -------------------------------------------------------- */

    "portal-room": createRoom({
        id: "portal-room",

        name: "Portal Room",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 135,
            y: 400,
            width: 555,
            height: 355
        },

        description:
            "A circular room filled with ancient symbols. Every portal is governed by a precise magical rule.",

        ambience: "portal",

        spawn: {
            x: 65,
            y: 325
        },

        exits: [
            createExit(
                "portal-west",
                "Return to the Trophy Room",
                "trophy-room",
                40,
                325,
                1030,
                330
            ),

            createExit(
                "portal-east",
                "Descend to the Undercroft",
                "undercroft-portal",
                1060,
                325,
                550,
                590
            )
        ],

        objectIds: [
            "raise-rune",
            "portal-key",
            "red-orb",
            "strange-portal-symbol"
        ],

        experimentStation: {
            id: "portal-altar",

            x: 550,

            y: 260,

            radius: 110,

            label: "Portal Altar"
        }
    }),


    /* --------------------------------------------------------
       ALCHEMY LAB
       Map: image9, second-floor section.
       -------------------------------------------------------- */

    "alchemy-lab": createRoom({
        id: "alchemy-lab",

        name: "Alchemy Lab",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 135,
            y: 400,
            width: 555,
            height: 355
        },

        description:
            "An alchemical workspace where ingredients are measured, combined and transformed.",

        ambience: "alchemy",

        spawn: {
            x: 1030,
            y: 325
        },

        exits: [
            createExit(
                "alchemy-east",
                "Return to the Trophy Room",
                "trophy-room",
                1060,
                330,
                65,
                325
            ),

            createExit(
                "alchemy-south",
                "Visit the Herb Garden",
                "herb-garden",
                550,
                615,
                550,
                65
            ),

            createExit(
                "alchemy-north",
                "Enter the Main Potion Lab",
                "potion-lab",
                550,
                35,
                550,
                585
            )
        ],

        objectIds: [
            "ember-core",
            "cauldron-lid",
            "spare-stirrer",
            "glass-flask",
            "mystery-powder"
        ],

        masterPosition: {
            x: 875,
            y: 240
        },

        experimentStation: {
            id: "alchemy-workbench",

            x: 550,

            y: 230,

            radius: 110,

            label: "Alchemy Workbench"
        }
    }),


    /* --------------------------------------------------------
       HERB GARDEN
       Map: image9, garden section.
       -------------------------------------------------------- */

    "herb-garden": createRoom({
        id: "herb-garden",

        name: "Herb Garden",

        region: "Mage's Tower",

        floor: 2,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 125,
            y: 430,
            width: 565,
            height: 325
        },

        description:
            "A protected patch of magical plants maintained for the Master's experiments.",

        ambience: "garden",

        spawn: {
            x: 550,
            y: 65
        },

        exits: [
            createExit(
                "herbs-north",
                "Return to the Alchemy Lab",
                "alchemy-lab",
                550,
                35,
                550,
                585
            ),

            createExit(
                "herbs-south",
                "Visit the Greenhouse",
                "greenhouse",
                550,
                615,
                550,
                65
            )
        ],

        objectIds: [
            "silvermoss",
            "nightshade",
            "thorned-vine",
            "moonleaf"
        ],

        isOutside: true
    }),


    /* --------------------------------------------------------
       STUDY / ORRERY
       Map: image9, upper-floor section.
       -------------------------------------------------------- */

    "study-orrery": createRoom({
        id: "study-orrery",

        name: "Study / Orrery",

        region: "Mage's Tower",

        floor: 3,

        mapId: "towerFloors",

        backgroundAsset: MAP_ASSETS.towerFloors.src,

        backgroundCrop: {
            x: 680,
            y: 320,
            width: 415,
            height: 395
        },

        description:
            "A room for studying the movements of celestial bodies and the relationship between magical systems.",

        ambience: "celestial",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "orrery-north",
                "Return to the Tower Main Floor",
                "tower-study",
                550,
                35,
                550,
                585
            ),

            createExit(
                "orrery-east",
                "Enter the Observatory",
                "observatory",
                1060,
                325,
                65,
                325
            )
        ],

        objectIds: [
            "caller-token",
            "star-chart",
            "class-scroll",
            "celestial-ring"
        ]
    }),


    /* --------------------------------------------------------
       OBSERVATORY
       Map: image3.
       -------------------------------------------------------- */

    "observatory": createRoom({
        id: "observatory",

        name: "Observatory",

        region: "Mage's Tower",

        floor: 3,

        mapId: "observatory",

        backgroundAsset: MAP_ASSETS.observatory.src,

        description:
            "A circular chamber for studying the stars and preparing precise celestial experiments.",

        ambience: "observatory",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "observatory-west",
                "Return to the Study / Orrery",
                "study-orrery",
                40,
                325,
                1030,
                325
            )
        ],

        objectIds: [
            "success-crystal",
            "star-crystal",
            "celestial-chart",
            "caller-token"
        ],

        masterPosition: {
            x: 850,
            y: 270
        },

        experimentStation: {
            id: "celestial-workbench",

            x: 550,

            y: 260,

            radius: 100,

            label: "Wand Calibration Platform"
        }
    }),


    /* --------------------------------------------------------
       TOWER STORAGE
       Map: image7, top-left Storage area.
       -------------------------------------------------------- */

    "tower-storage": createRoom({
        id: "tower-storage",

        name: "Storage",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerMain",

        backgroundAsset: MAP_ASSETS.towerMain.src,

        backgroundCrop: {
            x: 45,
            y: 40,
            width: 290,
            height: 270
        },

        description:
            "A collection of old tools, measuring instruments, scrolls and spare magical supplies.",

        ambience: "storage",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "storage-east",
                "Enter the Parlor",
                "tower-parlour",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "storage-south",
                "Visit the Research Room",
                "research-room",
                550,
                615,
                550,
                65
            )
        ],

        objectIds: [
            "variable-scroll",
            "integer-moonstone",
            "safety-valve-key",
            "wooden-measuring-stick",
            "empty-pouch",
            "copper-button"
        ]
    }),


    /* --------------------------------------------------------
       PARLOR
       Map: image7, top-right Parlor area.
       -------------------------------------------------------- */

    "tower-parlour": createRoom({
        id: "tower-parlour",

        name: "Parlor",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerMain",

        backgroundAsset: MAP_ASSETS.towerMain.src,

        backgroundCrop: {
            x: 295,
            y: 20,
            width: 490,
            height: 285
        },

        description:
            "A place for visitors and conversation. The Master sometimes waits here before assigning an experiment.",

        ambience: "parlor",

        spawn: {
            x: 65,
            y: 325
        },

        exits: [
            createExit(
                "parlor-west",
                "Return to Storage",
                "tower-storage",
                40,
                325,
                1030,
                585
            ),

            createExit(
                "parlor-south",
                "Visit the Research Room",
                "research-room",
                550,
                615,
                550,
                65
            ),

            createExit(
                "parlor-east",
                "Visit the Tower Study",
                "tower-study",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "parlor-north",
                "Return to Reception",
                "reception-room",
                550,
                35,
                550,
                585
            )
        ],

        objectIds: [
            "visitors-book",
            "golden-candlestick",
            "old-map-fragment",
            "decorative-chest"
        ]
    }),


    /* --------------------------------------------------------
       RESEARCH ROOM
       Map: image7, bottom-left Research area.
       -------------------------------------------------------- */

    "research-room": createRoom({
        id: "research-room",

        name: "Research",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerMain",

        backgroundAsset: MAP_ASSETS.towerMain.src,

        backgroundCrop: {
            x: 35,
            y: 305,
            width: 390,
            height: 450
        },

        description:
            "The Master's research area, filled with exception records, reference books and unusual discoveries.",

        ambience: "research",

        spawn: {
            x: 550,
            y: 65
        },

        exits: [
            createExit(
                "research-north",
                "Return to Parlor",
                "tower-parlour",
                550,
                35,
                550,
                585
            ),

            createExit(
                "research-east",
                "Enter the Tower Study",
                "tower-study",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "research-west",
                "Return to Storage",
                "tower-storage",
                40,
                325,
                1030,
                325
            )
        ],

        objectIds: [
            "except-rune",
            "value-error-stone",
            "type-error-stone",
            "name-error-stone",
            "exception-index",
            "research-scroll"
        ],

        masterPosition: {
            x: 850,
            y: 250
        },

        experimentStation: {
            id: "research-table",

            x: 550,

            y: 250,

            radius: 110,

            label: "Exception Research Table"
        }
    }),


    /* --------------------------------------------------------
       TOWER STUDY
       Map: image7, bottom-right Study area.
       -------------------------------------------------------- */

    "tower-study": createRoom({
        id: "tower-study",

        name: "Study",

        region: "Mage's Tower",

        floor: 1,

        mapId: "towerMain",

        backgroundAsset: MAP_ASSETS.towerMain.src,

        backgroundCrop: {
            x: 410,
            y: 305,
            width: 380,
            height: 450
        },

        description:
            "The Master's writing and planning room. Its shelves contain the basic structures used in many magical experiments.",

        ambience: "study",

        spawn: {
            x: 65,
            y: 325
        },

        exits: [
            createExit(
                "study-west",
                "Return to Research",
                "research-room",
                40,
                325,
                1030,
                325
            ),

            createExit(
                "study-north",
                "Visit the Rune Chamber",
                "rune-chamber",
                550,
                35,
                550,
                585
            ),

            createExit(
                "study-east",
                "Enter the Study / Orrery",
                "study-orrery",
                1060,
                325,
                65,
                585
            )
        ],

        objectIds: [
            "try-rune",
            "finally-rune",
            "function-scroll",
            "class-scroll",
            "exception-quill",
            "sealed-notebook",
            "unknown-name-scroll",
        ]
    }),


    /* --------------------------------------------------------
       ACADEMY GROUNDS
       Map: image5.
       -------------------------------------------------------- */

    "academy-grounds": createRoom({
        id: "academy-grounds",

        name: "Academy Grounds",

        region: "The Academy",

        floor: null,

        mapId: "academy",

        backgroundAsset: MAP_ASSETS.academy.src,

        description:
            "The grounds connect the academy's towers, library, greenhouse, gardens, training areas and the forest beyond.",

        ambience: "academy-outdoors",

        spawn: {
            x: 700,
            y: 570
        },

        exits: [
            createExit(
                "academy-tower",
                "Enter the Alchemy Tower",
                "entrance-hall",
                800,
                250,
                550,
                350
            ),

            createExit(
                "academy-greenhouse",
                "Visit the Greenhouse",
                "greenhouse",
                450,
                590,
                550,
                65
            ),

            createExit(
                "academy-garden",
                "Explore the Garden",
                "academy-garden",
                650,
                520,
                550,
                325
            ),

            createExit(
                "academy-library",
                "Enter the Library",
                "academy-library",
                550,
                345,
                550,
                585
            ),

            createExit(
                "academy-observatory",
                "Enter the Astronomy Tower",
                "observatory",
                180,
                150,
                550,
                585
            ),

            createExit(
                "academy-forest",
                "Leave for the Forest",
                "forest-path",
                850,
                70,
                550,
                325
            ),

            createExit(
                "academy-home",
                "Return to the Tower Entrance",
                "entrance-hall",
                950,
                330,
                550,
                585
            )
        ],

        objectIds: [
            "academy-sign",
            "garden-gate",
            "academy-notice-board",
            "fallen-leaf",
            "old-fountain"
        ],

        isOutside: true,

        isSafeZone: true
    }),


    /* --------------------------------------------------------
       ACADEMY LIBRARY
       Map: image2, bottom-left archive section.
       -------------------------------------------------------- */

    "academy-library": createRoom({
        id: "academy-library",

        name: "The Academy Library",

        region: "The Academy",

        mapId: "towerSuite",

        backgroundAsset: MAP_ASSETS.towerSuite.src,

        backgroundCrop: {
            x: 0,
            y: 390,
            width: 390,
            height: 392
        },

        description:
            "Rows of spellbooks explain how functions, variables and other Python objects work together.",

        ambience: "library",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "library-south",
                "Return to the Academy Grounds",
                "academy-grounds",
                550,
                615,
                550,
                580
            ),

            createExit(
                "library-east",
                "Visit the Tower Study",
                "tower-study",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "library-north",
                "Visit the Archive Annex",
                "archive-annex",
                550,
                35,
                550,
                585
            )
        ],

        objectIds: [
            "spellbook",
            "bookmark",
            "function-scroll",
            "class-scroll",
            "exception-parent-stone",
            "ink-bottle"
        ]
    }),


    /* --------------------------------------------------------
       GREENHOUSE
       Map: image4.
       -------------------------------------------------------- */

    "greenhouse": createRoom({
        id: "greenhouse",

        name: "The Greenhouse",

        region: "The Academy",

        mapId: "forestOutpost",

        backgroundAsset: MAP_ASSETS.forestOutpost.src,

        description:
            "A sheltered cultivation room where rare herbs and magical plants are grown for experiments.",

        ambience: "greenhouse",

        spawn: {
            x: 550,
            y: 65
        },

        exits: [
            createExit(
                "greenhouse-north",
                "Return to the Academy Grounds",
                "academy-grounds",
                550,
                35,
                450,
                590
            ),

            createExit(
                "greenhouse-east",
                "Explore the Forest",
                "forest-path",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "greenhouse-south",
                "Visit the Tower Herb Garden",
                "herb-garden",
                550,
                615,
                550,
                65
            )
        ],

        objectIds: [
            "moon-herb",
            "moonleaf",
            "silvermoss",
            "sunseed",
            "poison-berry",
            "dry-vine",
            "greenhouse-notebook"
        ],

        isOutside: true
    }),


    /* --------------------------------------------------------
       ACADEMY GARDEN
       Map: image5, Garden / Field region.
       -------------------------------------------------------- */

    "academy-garden": createRoom({
        id: "academy-garden",

        name: "The Academy Garden",

        region: "The Academy",

        mapId: "academy",

        backgroundAsset: MAP_ASSETS.academy.src,

        backgroundCrop: {
            x: 650,
            y: 300,
            width: 700,
            height: 470
        },

        description:
            "A garden with several paths, old trees and places where ordinary and magical ingredients grow.",

        ambience: "garden",

        spawn: {
            x: 550,
            y: 325
        },

        exits: [
            createExit(
                "garden-west",
                "Return to the Academy Grounds",
                "academy-grounds",
                40,
                325,
                650,
                520
            ),

            createExit(
                "garden-east",
                "Travel to the Forest",
                "forest-path",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "garden-north",
                "Visit the Greenhouse",
                "greenhouse",
                550,
                35,
                550,
                585
            )
        ],

        objectIds: [
            "glimmering-feather",
            "garden-stone",
            "wild-flower",
            "mossy-pebble",
            "sunseed"
        ],

        isOutside: true
    }),


    /* --------------------------------------------------------
       FOREST PATH
       Map: image8.
       -------------------------------------------------------- */

    "forest-path": createRoom({
        id: "forest-path",

        name: "Forest Path",

        region: "Stowerd",

        mapId: "stowerd",

        backgroundAsset: MAP_ASSETS.stowerd.src,

        description:
            "A winding path through the wooded region beyond the academy. Many useful ingredients grow far from the tower.",

        ambience: "forest",

        spawn: {
            x: 550,
            y: 325
        },

        exits: [
            createExit(
                "forest-west",
                "Return to the Academy",
                "academy-grounds",
                40,
                325,
                850,
                70
            ),

            createExit(
                "forest-north",
                "Explore the Enchanted Woodland",
                "enchanted-forest",
                550,
                35,
                550,
                585
            ),

            createExit(
                "forest-east",
                "Visit Briarwood Village",
                "briarwood-village",
                1060,
                325,
                65,
                325
            ),

            createExit(
                "forest-south",
                "Find the Ancient Temple",
                "forest-temple",
                550,
                615,
                550,
                65
            )
        ],

        objectIds: [
            "forest-moonleaf",
            "silver-feather",
            "mossy-pebble",
            "wild-mushroom",
            "fallen-branch",
            "forest-herb"
        ],

        isOutside: true
    }),


    /* --------------------------------------------------------
       ENCHANTED FOREST
       Map: image8.
       -------------------------------------------------------- */

    "enchanted-forest": createRoom({
        id: "enchanted-forest",

        name: "The Enchanted Forest",

        region: "Stowerd",

        mapId: "stowerd",

        backgroundAsset: MAP_ASSETS.stowerd.src,

        description:
            "An old woodland where unusual plants grow beneath trees that have watched generations of magicians.",

        ambience: "enchanted-forest",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "enchanted-south",
                "Return to the Forest Path",
                "forest-path",
                550,
                615,
                550,
                65
            ),

            createExit(
                "enchanted-west",
                "Discover the Ancient Temple",
                "forest-temple",
                40,
                325,
                1030,
                325
            )
        ],

        objectIds: [
            "nightshade",
            "silvermoss",
            "forest-herb",
            "ancient-root",
            "glow-mushroom",
            "moonleaf"
        ],

        isOutside: true
    }),


    /* --------------------------------------------------------
       ENCHANTED FOREST TEMPLE
       Map: image1, central temple region.
       -------------------------------------------------------- */

    "forest-temple": createRoom({
        id: "forest-temple",

        name: "Enchanted Forest Temple",

        region: "Stowerd",

        mapId: "world",

        backgroundAsset: MAP_ASSETS.world.src,

        backgroundCrop: {
            x: 180,
            y: 190,
            width: 430,
            height: 460
        },

        description:
            "A forgotten temple hidden beneath ancient trees. Its old inscriptions describe rules that magic must obey.",

        ambience: "ancient-temple",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "temple-north",
                "Return to the Forest Path",
                "forest-path",
                550,
                35,
                550,
                585
            ),

            createExit(
                "temple-east",
                "Enter the Portal Chamber",
                "undercroft-portal",
                1060,
                325,
                550,
                585
            )
        ],

        objectIds: [
            "cauldron-heart",
            "ancient-rule-stone",
            "temple-inscription",
            "old-rune-fragment"
        ],

        isOutside: true
    }),


    /* --------------------------------------------------------
       BRIARWOOD VILLAGE
       Map: image1, lower-left village region.
       -------------------------------------------------------- */

    "briarwood-village": createRoom({
        id: "briarwood-village",

        name: "Briarwood Village",

        region: "Stowerd",

        mapId: "world",

        backgroundAsset: MAP_ASSETS.world.src,

        backgroundCrop: {
            x: 0,
            y: 330,
            width: 360,
            height: 360
        },

        description:
            "A small village near the forest. Its residents sometimes trade useful supplies with the academy.",

        ambience: "village",

        spawn: {
            x: 550,
            y: 325
        },

        exits: [
            createExit(
                "village-west",
                "Return to the Forest",
                "forest-path",
                40,
                325,
                1030,
                325
            )
        ],

        objectIds: [
            "village-herb-bundle",
            "old-coin",
            "sealed-parcel",
            "village-notice"
        ],

        isOutside: true,

        unlockAfterChapter: 0
    }),


    /* --------------------------------------------------------
       UNDERCROFT PORTAL CHAMBER
       Map: image6.
       -------------------------------------------------------- */

    "undercroft-portal": createRoom({
        id: "undercroft-portal",

        name: "Undercroft Ritual Chamber",

        region: "Beneath the Tower",

        floor: "Underground",

        mapId: "undercroft",

        backgroundAsset: MAP_ASSETS.undercroft.src,

        description:
            "An underground chamber where powerful runes and old magical rules are preserved.",

        ambience: "undercroft",

        spawn: {
            x: 550,
            y: 585
        },

        exits: [
            createExit(
                "undercroft-north",
                "Return to the Portal Room",
                "portal-room",
                550,
                35,
                550,
                585
            ),

            createExit(
                "undercroft-east",
                "Visit the Forest Temple",
                "forest-temple",
                1060,
                325,
                65,
                325
            )
        ],

        objectIds: [
            "exception-parent-stone",
            "ancient-rule-stone",
            "old-rune-table",
            "cauldron-heart",
            "portal-key"
        ],

        masterPosition: {
            x: 850,
            y: 250
        },

        experimentStation: {
            id: "undercroft-altar",

            x: 550,

            y: 260,

            radius: 110,

            label: "Ancient Ritual Altar"
        }
    })

};


/* ============================================================
   11. MATERIAL REGISTRY
   ============================================================ */

/*
 * Every collectible item has a corresponding programming
 * meaning.
 *
 * reusable = true:
 * Once collected, the material remains in the player's bag.
 *
 * consumeOnUse = false:
 * Experimenting does not remove previously collected
 * learning materials.
 *
 * Optional materials can be collected for discovery,
 * but are not required for the main missions.
 */

export const MATERIALS = {

    /* VARIABLES AND VALUES */

    "variable-scroll": {
        id: "variable-scroll",

        name: "Variable Scroll",

        icon: "📜",

        category: "Python variable",

        pythonMeaning:
            "A variable is a name that refers to a value.",

        pythonExample:
            "moon_count = 10",

        description:
            "A scroll containing the name moon_count. It represents a Python variable that stores a value.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "integer-moonstone": {
        id: "integer-moonstone",

        name: "Integer Moonstone",

        icon: "🔵",

        category: "Integer value",

        pythonMeaning:
            "An integer is a whole number.",

        pythonExample:
            "amount = 10",

        description:
            "A moonstone marked with the number 10. It represents an integer value that can be stored in a variable.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "zero-crystal": {
        id: "zero-crystal",

        name: "Zero Crystal",

        icon: "💎",

        category: "Integer value",

        pythonMeaning:
            "The integer value zero.",

        pythonExample:
            "divisor = 0",

        description:
            "A crystal containing the value zero. It can be used to demonstrate why division by zero raises ZeroDivisionError.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "moonwater-vial": {
        id: "moonwater-vial",

        name: "Moonwater Vial",

        icon: "🧪",

        category: "Input value",

        pythonMeaning:
            "A value that can be supplied to a Python operation.",

        pythonExample:
            'amount = "25"',

        description:
            "A vial containing a text value. It can help demonstrate the difference between a string and a number.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "moon-herb": {
        id: "moon-herb",

        name: "Moon Herb",

        icon: "🌿",

        category: "String value",

        pythonMeaning:
            "A string is a sequence of characters enclosed in quotes.",

        pythonExample:
            'ingredient = "moon dust"',

        description:
            "A herb whose name can be represented as a string value. Attempting to convert the text moon dust into an integer produces ValueError.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "unknown-name-scroll": {
        id: "unknown-name-scroll",

        name: "Unknown Name Scroll",

        icon: "📃",

        category: "Identifier",

        pythonMeaning:
            "A variable or function name that must be defined before it is used.",

        pythonExample:
            "print(missing_variable)",

        description:
            "An unfinished scroll referring to a name that has not been defined. Using such a name raises NameError.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },


    /* EXCEPTION HANDLING KEYWORDS */

    "try-rune": {
        id: "try-rune",

        name: "Try Rune",

        icon: "🟣",

        category: "Python keyword",

        pythonMeaning:
            "The try keyword begins a protected block containing code that may raise an exception.",

        pythonExample:
            "try:",

        description:
            "A magical rune that protects a risky operation so a matching exception handler can respond if it fails.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "except-rune": {
        id: "except-rune",

        name: "Except Rune",

        icon: "🛡️",

        category: "Python keyword",

        pythonMeaning:
            "The except keyword handles a matching exception raised inside a try block.",

        pythonExample:
            "except ZeroDivisionError:",

        description:
            "A protective rune that responds to a specific failure. It does not prevent the error from occurring.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "zero-ward": {
        id: "zero-ward",

        name: "Zero Ward",

        icon: "🔰",

        category: "Exception handler",

        pythonMeaning:
            "A specific ZeroDivisionError handler.",

        pythonExample:
            "except ZeroDivisionError:",

        description:
            "A ward designed to recognise a division-by-zero failure.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "value-error-stone": {
        id: "value-error-stone",

        name: "Value Error Stone",

        icon: "🟡",

        category: "Exception type",

        pythonMeaning:
            "ValueError is raised when an operation receives an inappropriate value of an otherwise acceptable type.",

        pythonExample:
            'int("moon dust")',

        description:
            "A stone that represents an unsuitable value, such as converting the text moon dust to an integer.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "type-error-stone": {
        id: "type-error-stone",

        name: "Type Error Stone",

        icon: "🔴",

        category: "Exception type",

        pythonMeaning:
            "TypeError is raised when an operation receives an inappropriate type.",

        pythonExample:
            '10 + "drops"',

        description:
            "A stone that represents incompatible types, such as adding an integer to a string.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "name-error-stone": {
        id: "name-error-stone",

        name: "Name Error Stone",

        icon: "🟠",

        category: "Exception type",

        pythonMeaning:
            "NameError occurs when Python cannot find the name being referenced.",

        pythonExample:
            "print(unknown_name)",

        description:
            "A stone representing a name that Python cannot find because it has not been defined.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "exception-index": {
        id: "exception-index",

        name: "Exception Index",

        icon: "📘",

        category: "Exception reference",

        pythonMeaning:
            "A reference to Python's built-in exception classes.",

        pythonExample:
            "Exception",

        description:
            "A reference book for the hierarchy and names of Python exception types.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },


    /* SUCCESS AND CLEANUP KEYWORDS */

    "success-crystal": {
        id: "success-crystal",

        name: "Success Crystal",

        icon: "✨",

        category: "Python keyword",

        pythonMeaning:
            "The else block runs when the try block finishes without raising an exception.",

        pythonExample:
            "else:",

        description:
            "A crystal that glows when an experiment succeeds. It represents the success-only else block.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "wand-core": {
        id: "wand-core",

        name: "Wand Core",

        icon: "🪄",

        category: "Operation tool",

        pythonMeaning:
            "Represents the operation or function used by a program.",

        pythonExample:
            "perform_experiment()",

        description:
            "A magical core that activates the experiment. In Python, an operation or function performs the work.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "finally-rune": {
        id: "finally-rune",

        name: "Finally Rune",

        icon: "🔥",

        category: "Python keyword",

        pythonMeaning:
            "The finally block runs as control leaves the try statement, making it useful for cleanup.",

        pythonExample:
            "finally:",

        description:
            "A rune that ensures an important cleanup action is attempted while leaving the try statement.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "safety-valve-key": {
        id: "safety-valve-key",

        name: "Safety Valve Key",

        icon: "🔑",

        category: "Cleanup resource",

        pythonMeaning:
            "Represents a resource that needs reliable cleanup.",

        pythonExample:
            "close_resource()",

        description:
            "A key to the magical safety valve. It represents a resource-cleanup operation.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "ember-core": {
        id: "ember-core",

        name: "Ember Core",

        icon: "🔥",

        category: "Experiment value",

        pythonMeaning:
            "A value used by an operation.",

        pythonExample:
            "heat_level = 5",

        description:
            "A small but powerful energy source used in the furnace experiment.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },


    /* CONTEXT MANAGERS */

    "spellbook": {
        id: "spellbook",

        name: "Enchanted Spellbook",

        icon: "📚",

        category: "Resource",

        pythonMeaning:
            "Represents a file or other resource managed by a context manager.",

        pythonExample:
            'with open("spellbook.txt") as book:',

        description:
            "A magical book that must be opened, used and safely closed. It represents a resource such as a file.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "binding-sigil": {
        id: "binding-sigil",

        name: "Binding Sigil",

        icon: "🔗",

        category: "Python keyword",

        pythonMeaning:
            "The with keyword begins a context-managed block.",

        pythonExample:
            "with open(...):",

        description:
            "A sigil connecting setup and cleanup within one structured block.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "bookmark": {
        id: "bookmark",

        name: "Spellbook Bookmark",

        icon: "🔖",

        category: "Resource helper",

        pythonMeaning:
            "Represents a reference to an opened resource.",

        pythonExample:
            "as book",

        description:
            "A bookmark used to refer to the opened spellbook within a with block.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "function-scroll": {
        id: "function-scroll",

        name: "Function Scroll",

        icon: "📜",

        category: "Python function",

        pythonMeaning:
            "A function groups reusable instructions that can be called.",

        pythonExample:
            "def prepare_spell():",

        description:
            "A scroll containing a named function. Functions organise code into reusable operations.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },


    /* RAISE AND PROPAGATION */

    "raise-rune": {
        id: "raise-rune",

        name: "Raise Rune",

        icon: "⚡",

        category: "Python keyword",

        pythonMeaning:
            "The raise statement deliberately raises an exception.",

        pythonExample:
            'raise ValueError("Invalid amount")',

        description:
            "A rune that signals a failure deliberately when a program rule is broken.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "rule-stone": {
        id: "rule-stone",

        name: "Rule Stone",

        icon: "🪨",

        category: "Validation rule",

        pythonMeaning:
            "A condition that determines whether a value is acceptable.",

        pythonExample:
            "if amount < 0:",

        description:
            "An ancient stone representing a rule that the program must enforce.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "caller-token": {
        id: "caller-token",

        name: "Caller Token",

        icon: "🔔",

        category: "Function call",

        pythonMeaning:
            "A function can be called by another part of a program.",

        pythonExample:
            "add_water(-2)",

        description:
            "A token representing the function that called another function. An unhandled exception can propagate back to it.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },


    /* CUSTOM EXCEPTIONS */

    "class-scroll": {
        id: "class-scroll",

        name: "Class Scroll",

        icon: "📜",

        category: "Python class",

        pythonMeaning:
            "A class defines a new type of object.",

        pythonExample:
            "class CauldronOverflowError(Exception):",

        description:
            "A scroll containing the structure for defining a custom exception class.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "exception-parent-stone": {
        id: "exception-parent-stone",

        name: "Exception Parent Stone",

        icon: "💠",

        category: "Base exception class",

        pythonMeaning:
            "Typical custom application exceptions inherit from Exception.",

        pythonExample:
            "class MyError(Exception):",

        description:
            "A stone representing Python's Exception base class. Custom exceptions normally inherit from it.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "exception-quill": {
        id: "exception-quill",

        name: "Exception Quill",

        icon: "🪶",

        category: "Class definition tool",

        pythonMeaning:
            "A tool for defining a custom exception class.",

        pythonExample:
            "class MyError(Exception):",

        description:
            "A magical quill used to write a new exception type.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },

    "cauldron-heart": {
        id: "cauldron-heart",

        name: "Cauldron Heart",

        icon: "❤️",

        category: "Custom rule value",

        pythonMeaning:
            "A domain-specific value used by an application's validation rule.",

        pythonExample:
            "if amount > capacity:",

        description:
            "The heart of the cauldron. It represents the capacity limit enforced by a custom exception.",

        reusable: true,

        consumeOnUse: false,

        optional: false
    },


    /* OPTIONAL EXPLORATION MATERIALS */

    "moonleaf": {
        id: "moonleaf",

        name: "Moonleaf",

        icon: "🍃",

        category: "String ingredient",

        pythonMeaning:
            "Can represent a string value in a Python program.",

        pythonExample:
            'plant = "moonleaf"',

        description:
            "A pale leaf that glows under moonlight. Useful for optional experiments.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "silvermoss": {
        id: "silvermoss",

        name: "Silvermoss",

        icon: "🌿",

        category: "String ingredient",

        pythonMeaning:
            "Can represent a text value.",

        pythonExample:
            'ingredient = "silvermoss"',

        description:
            "A soft silver plant growing in shaded areas.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "nightshade": {
        id: "nightshade",

        name: "Nightshade",

        icon: "🪻",

        category: "Optional ingredient",

        pythonMeaning:
            "An example value for an experimental input.",

        pythonExample:
            'ingredient = "nightshade"',

        description:
            "A dangerous-looking herb. Inspect it carefully before using it.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "blue-thistle": {
        id: "blue-thistle",

        name: "Blue Thistle",

        icon: "🌱",

        category: "Optional ingredient",

        pythonMeaning:
            "Can represent a string value.",

        pythonExample:
            'herb = "blue thistle"',

        description:
            "A prickly blue herb found near the old stone paths.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "red-mushroom": {
        id: "red-mushroom",

        name: "Red Mushroom",

        icon: "🍄",

        category: "Optional ingredient",

        pythonMeaning:
            "Can represent a string value.",

        pythonExample:
            'ingredient = "red mushroom"',

        description:
            "A mushroom with a bright red cap. It is not required for the main experiments.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "sunseed": {
        id: "sunseed",

        name: "Sunseed",

        icon: "🌻",

        category: "Optional ingredient",

        pythonMeaning:
            "Can represent a value stored in a variable.",

        pythonExample:
            "seed_count = 3",

        description:
            "A warm seed that glows faintly in direct sunlight.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "silver-feather": {
        id: "silver-feather",

        name: "Silver Feather",

        icon: "🪶",

        category: "Optional collectible",

        pythonMeaning:
            "A collectible object, not a required Python construct.",

        pythonExample: null,

        description:
            "A feather left behind by one of the tower's magical creatures.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "mossy-pebble": {
        id: "mossy-pebble",

        name: "Mossy Pebble",

        icon: "🪨",

        category: "Optional collectible",

        pythonMeaning:
            "A collectible object, not a required Python construct.",

        pythonExample: null,

        description:
            "A small stone covered in soft green moss.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    },

    "old-coin": {
        id: "old-coin",

        name: "Old Coin",

        icon: "🪙",

        category: "Optional collectible",

        pythonMeaning:
            "A collectible object, not a required Python construct.",

        pythonExample: null,

        description:
            "An old coin found near the road to Briarwood Village.",

        reusable: true,

        consumeOnUse: false,

        optional: true
    }
};


/* ============================================================
   12. WORLD OBJECTS
   ============================================================ */

/*
 * All coordinates are measured on the 1100 x 650 game canvas.
 *
 * materialId connects a physical game object to MATERIALS.
 *
 * A player can inspect objects before collecting them.
 *
 * Some objects are distractions. They can be explored,
 * but they are not required for the current experiment.
 */

export const WORLD_OBJECTS = [

    /* APPRENTICE'S CHAMBER */

    {
        id: "apprentice-bed",
        roomId: "apprentice-chamber",
        name: "Apprentice's Bed",
        x: 320,
        y: 230,
        icon: "🛏️",
        type: "scenery",
        collectible: false,
        description: "A small bed in the apprentice's private chamber."
    },

    {
        id: "old-trunk",
        roomId: "apprentice-chamber",
        name: "Old Trunk",
        x: 730,
        y: 460,
        icon: "🧳",
        type: "scenery",
        collectible: false,
        description: "A wooden trunk containing old clothes and unused belongings."
    },

    {
        id: "wooden-wand",
        roomId: "apprentice-chamber",
        name: "Wooden Wand",
        x: 500,
        y: 500,
        icon: "🪄",
        type: "scenery",
        collectible: false,
        description: "A simple wand used to activate magical experiments."
    },

    {
        id: "empty-shoulder-bag",
        roomId: "apprentice-chamber",
        name: "Shoulder Bag",
        x: 800,
        y: 480,
        icon: "🎒",
        type: "scenery",
        collectible: false,
        description: "The apprentice's bag. Collected materials will be stored here."
    },


    /* RUNE CHAMBER */

    {
        id: "binding-sigil",
        roomId: "rune-chamber",
        materialId: "binding-sigil",
        x: 560,
        y: 240,
        icon: "🔗",
        type: "material",
        collectible: true
    },

    {
        id: "try-rune",
        roomId: "rune-chamber",
        materialId: "try-rune",
        x: 360,
        y: 425,
        icon: "🟣",
        type: "material",
        collectible: true
    },

    {
        id: "floating-rune-stone",
        roomId: "rune-chamber",
        name: "Floating Rune Stone",
        x: 770,
        y: 180,
        icon: "💠",
        type: "scenery",
        collectible: false,
        description: "A floating stone with an unfamiliar symbol."
    },

    {
        id: "broken-symbol",
        roomId: "rune-chamber",
        name: "Broken Symbol",
        x: 810,
        y: 460,
        icon: "🔸",
        type: "scenery",
        collectible: false,
        description: "An incomplete magical symbol."
    },


    /* ARCHIVE ANNEX */

    {
        id: "archive-spellbook",
        roomId: "archive-annex",
        name: "Old Spellbook",
        x: 300,
        y: 250,
        icon: "📚",
        type: "scenery",
        collectible: false,
        description: "A collection of old magical instructions."
    },

    {
        id: "bookmark",
        roomId: "archive-annex",
        materialId: "bookmark",
        x: 760,
        y: 380,
        icon: "🔖",
        type: "material",
        collectible: true
    },

    {
        id: "dusty-scroll",
        roomId: "archive-annex",
        name: "Dusty Scroll",
        x: 340,
        y: 490,
        icon: "📜",
        type: "scenery",
        collectible: false,
        description: "A scroll whose ink has faded over time."
    },


    /* POTION LAB */

    {
        id: "zero-crystal",
        roomId: "potion-lab",
        materialId: "zero-crystal",
        x: 310,
        y: 250,
        icon: "💎",
        type: "material",
        collectible: true
    },

    {
        id: "moonwater-vial",
        roomId: "potion-lab",
        materialId: "moonwater-vial",
        x: 760,
        y: 390,
        icon: "🧪",
        type: "material",
        collectible: true
    },

    {
        id: "empty-vial",
        roomId: "potion-lab",
        name: "Empty Vial",
        x: 450,
        y: 475,
        icon: "⚗️",
        type: "scenery",
        collectible: false,
        description: "An empty glass vial."
    },

    {
        id: "blue-thistle",
        roomId: "potion-lab",
        materialId: "blue-thistle",
        x: 820,
        y: 200,
        icon: "🌱",
        type: "material",
        collectible: true
    },

    {
        id: "red-mushroom",
        roomId: "potion-lab",
        materialId: "red-mushroom",
        x: 650,
        y: 510,
        icon: "🍄",
        type: "material",
        collectible: true
    },

    {
        id: "glass-stirrer",
        roomId: "potion-lab",
        name: "Glass Stirrer",
        x: 280,
        y: 480,
        icon: "🥄",
        type: "scenery",
        collectible: false,
        description: "A glass rod used for mixing potions."
    },


    /* ENTRANCE HALL */

    {
        id: "entrance-door",
        roomId: "entrance-hall",
        name: "Tower Entrance",
        x: 550,
        y: 570,
        icon: "🚪",
        type: "scenery",
        collectible: false,
        description: "The great entrance to the Mage's Tower."
    },

    {
        id: "old-key",
        roomId: "entrance-hall",
        name: "Old Key",
        x: 840,
        y: 240,
        icon: "🗝️",
        type: "scenery",
        collectible: false,
        description: "A key to an old tower storage cabinet."
    },

    {
        id: "tower-inscription",
        roomId: "entrance-hall",
        name: "Tower Inscription",
        x: 300,
        y: 180,
        icon: "📜",
        type: "scenery",
        collectible: false,
        description: "An inscription recording the history of the tower."
    },


    /* ANIMAL CAGES */

    {
        id: "silver-feather",
        roomId: "animal-cages",
        materialId: "silver-feather",
        x: 370,
        y: 300,
        icon: "🪶",
        type: "material",
        collectible: true
    },

    {
        id: "empty-creature-cage",
        roomId: "animal-cages",
        name: "Empty Creature Cage",
        x: 700,
        y: 380,
        icon: "🪺",
        type: "scenery",
        collectible: false,
        description: "An empty cage with a small magical lock."
    },

    {
        id: "glimmering-scale",
        roomId: "animal-cages",
        name: "Glimmering Scale",
        x: 570,
        y: 210,
        icon: "✨",
        type: "scenery",
        collectible: false,
        description: "A shimmering scale from a small magical creature."
    },

    {
        id: "sleeping-owl",
        roomId: "animal-cages",
        name: "Sleeping Owl",
        x: 830,
        y: 480,
        icon: "🦉",
        type: "scenery",
        collectible: false,
        description: "A sleepy owl watches the apprentice."
    },


    /* RECEPTION ROOM */

    {
        id: "visitors-book",
        roomId: "reception-room",
        name: "Visitors Book",
        x: 330,
        y: 250,
        icon: "📖",
        type: "scenery",
        collectible: false,
        description: "A book containing the names of visitors to the tower."
    },

    {
        id: "golden-candlestick",
        roomId: "reception-room",
        name: "Golden Candlestick",
        x: 790,
        y: 430,
        icon: "🕯️",
        type: "scenery",
        collectible: false,
        description: "An antique candlestick that illuminates the room."
    },

    {
        id: "old-map-fragment",
        roomId: "reception-room",
        name: "Map Fragment",
        x: 590,
        y: 190,
        icon: "🗺️",
        type: "scenery",
        collectible: false,
        description: "A small fragment from an older map of the realm."
    },


    /* TROPHY ROOM */

    {
        id: "zero-ward",
        roomId: "trophy-room",
        materialId: "zero-ward",
        x: 430,
        y: 300,
        icon: "🔰",
        type: "material",
        collectible: true
    },

    {
        id: "rule-stone",
        roomId: "trophy-room",
        materialId: "rule-stone",
        x: 750,
        y: 425,
        icon: "🪨",
        type: "material",
        collectible: true
    },

    {
        id: "exception-quill",
        roomId: "trophy-room",
        materialId: "exception-quill",
        x: 820,
        y: 190,
        icon: "🪶",
        type: "material",
        collectible: true
    },

    {
        id: "broken-crystal",
        roomId: "trophy-room",
        name: "Broken Crystal",
        x: 300,
        y: 480,
        icon: "💔",
        type: "scenery",
        collectible: false,
        description: "A crystal that no longer holds magical energy."
    },

    {
        id: "ancient-medal",
        roomId: "trophy-room",
        name: "Ancient Medal",
        x: 590,
        y: 150,
        icon: "🏅",
        type: "scenery",
        collectible: false,
        description: "A medal awarded to a magician long ago."
    },


    /* PORTAL ROOM */

    {
        id: "raise-rune",
        roomId: "portal-room",
        materialId: "raise-rune",
        x: 560,
        y: 250,
        icon: "⚡",
        type: "material",
        collectible: true
    },

    {
        id: "portal-key",
        roomId: "portal-room",
        name: "Portal Key",
        x: 770,
        y: 450,
        icon: "🗝️",
        type: "scenery",
        collectible: false,
        description: "A key belonging to the tower's old portal system."
    },

    {
        id: "red-orb",
        roomId: "portal-room",
        name: "Red Orb",
        x: 320,
        y: 440,
        icon: "🔴",
        type: "scenery",
        collectible: false,
        description: "A red orb that reacts to nearby magic."
    },


    /* ALCHEMY LAB */

    {
        id: "ember-core",
        roomId: "alchemy-lab",
        materialId: "ember-core",
        x: 440,
        y: 290,
        icon: "🔥",
        type: "material",
        collectible: true
    },

    {
        id: "cauldron-lid",
        roomId: "alchemy-lab",
        name: "Cauldron Lid",
        x: 720,
        y: 410,
        icon: "⚗️",
        type: "scenery",
        collectible: false,
        description: "A heavy lid used to cover the alchemical cauldron."
    },

    {
        id: "spare-stirrer",
        roomId: "alchemy-lab",
        name: "Spare Stirrer",
        x: 300,
        y: 480,
        icon: "🥄",
        type: "scenery",
        collectible: false,
        description: "A wooden stirring tool."
    },

    {
        id: "glass-flask",
        roomId: "alchemy-lab",
        name: "Glass Flask",
        x: 800,
        y: 190,
        icon: "⚗️",
        type: "scenery",
        collectible: false,
        description: "A glass flask for mixing ingredients."
    },


    /* HERB GARDEN */

    {
        id: "silvermoss",
        roomId: "herb-garden",
        materialId: "silvermoss",
        x: 270,
        y: 280,
        icon: "🌿",
        type: "material",
        collectible: true
    },

    {
        id: "nightshade",
        roomId: "herb-garden",
        materialId: "nightshade",
        x: 790,
        y: 430,
        icon: "🪻",
        type: "material",
        collectible: true
    },

    {
        id: "thorned-vine",
        roomId: "herb-garden",
        name: "Thorned Vine",
        x: 430,
        y: 470,
        icon: "🌱",
        type: "scenery",
        collectible: false,
        description: "A thorn-covered vine growing near the wall."
    },

    {
        id: "moonleaf",
        roomId: "herb-garden",
        materialId: "moonleaf",
        x: 850,
        y: 180,
        icon: "🍃",
        type: "material",
        collectible: true
    },


    /* STUDY / ORRERY */

    {
        id: "caller-token",
        roomId: "study-orrery",
        materialId: "caller-token",
        x: 760,
        y: 240,
        icon: "🔔",
        type: "material",
        collectible: true
    },

    {
        id: "star-chart",
        roomId: "study-orrery",
        name: "Star Chart",
        x: 350,
        y: 450,
        icon: "🌌",
        type: "scenery",
        collectible: false,
        description: "A chart showing the movements of the stars."
    },

    {
        id: "class-scroll",
        roomId: "study-orrery",
        materialId: "class-scroll",
        x: 550,
        y: 190,
        icon: "📜",
        type: "material",
        collectible: true
    },

    {
    id: "unknown-name-scroll",
    roomId: "tower-study",
    materialId: "unknown-name-scroll",
    name: "Unknown Name Scroll",
    x: 770,
    y: 475,
    icon: "📃",
    type: "material",
    collectible: true,
    description:
        "A scroll containing an undefined name. It represents an identifier that Python cannot find, which can raise NameError."
    },


    /* OBSERVATORY */

    {
        id: "success-crystal",
        roomId: "observatory",
        materialId: "success-crystal",
        x: 560,
        y: 310,
        icon: "✨",
        type: "material",
        collectible: true
    },

    {
        id: "star-crystal",
        roomId: "observatory",
        name: "Star Crystal",
        x: 760,
        y: 190,
        icon: "🌟",
        type: "scenery",
        collectible: false,
        description: "A crystal containing a faint celestial glow."
    },

    {
        id: "celestial-chart",
        roomId: "observatory",
        name: "Celestial Chart",
        x: 330,
        y: 440,
        icon: "🗺️",
        type: "scenery",
        collectible: false,
        description: "A chart used to study celestial movements."
    },


    /* STORAGE */

    {
        id: "variable-scroll",
        roomId: "tower-storage",
        materialId: "variable-scroll",
        x: 270,
        y: 240,
        icon: "📜",
        type: "material",
        collectible: true
    },

    {
        id: "integer-moonstone",
        roomId: "tower-storage",
        materialId: "integer-moonstone",
        x: 700,
        y: 260,
        icon: "🔵",
        type: "material",
        collectible: true
    },

    {
        id: "safety-valve-key",
        roomId: "tower-storage",
        materialId: "safety-valve-key",
        x: 540,
        y: 470,
        icon: "🔑",
        type: "material",
        collectible: true
    },

    {
        id: "wooden-measuring-stick",
        roomId: "tower-storage",
        name: "Measuring Stick",
        x: 820,
        y: 470,
        icon: "📏",
        type: "scenery",
        collectible: false,
        description: "A measuring stick used to check ingredient quantities."
    },

    {
        id: "empty-pouch",
        roomId: "tower-storage",
        name: "Empty Pouch",
        x: 300,
        y: 480,
        icon: "👝",
        type: "scenery",
        collectible: false,
        description: "A small empty pouch."
    },


    /* PARLOR */

    {
        id: "decorative-chest",
        roomId: "tower-parlour",
        name: "Decorative Chest",
        x: 760,
        y: 460,
        icon: "📦",
        type: "scenery",
        collectible: false,
        description: "A decorated wooden chest."
    },


    /* RESEARCH */

    {
        id: "except-rune",
        roomId: "research-room",
        materialId: "except-rune",
        x: 330,
        y: 235,
        icon: "🛡️",
        type: "material",
        collectible: true
    },

    {
        id: "value-error-stone",
        roomId: "research-room",
        materialId: "value-error-stone",
        x: 740,
        y: 250,
        icon: "🟡",
        type: "material",
        collectible: true
    },

    {
        id: "type-error-stone",
        roomId: "research-room",
        materialId: "type-error-stone",
        x: 520,
        y: 440,
        icon: "🔴",
        type: "material",
        collectible: true
    },

    {
        id: "name-error-stone",
        roomId: "research-room",
        materialId: "name-error-stone",
        x: 820,
        y: 480,
        icon: "🟠",
        type: "material",
        collectible: true
    },

    {
        id: "exception-index",
        roomId: "research-room",
        materialId: "exception-index",
        x: 250,
        y: 470,
        icon: "📘",
        type: "material",
        collectible: true
    },

    {
        id: "research-scroll",
        roomId: "research-room",
        name: "Unfinished Research Scroll",
        x: 560,
        y: 180,
        icon: "📜",
        type: "scenery",
        collectible: false,
        description: "A research note containing several incomplete exception examples."
    },


    /* STUDY */

    {
        id: "try-rune",
        roomId: "tower-study",
        materialId: "try-rune",
        x: 300,
        y: 300,
        icon: "🟣",
        type: "material",
        collectible: true
    },

    {
        id: "finally-rune",
        roomId: "tower-study",
        materialId: "finally-rune",
        x: 760,
        y: 420,
        icon: "🔥",
        type: "material",
        collectible: true
    },

    {
        id: "function-scroll",
        roomId: "tower-study",
        materialId: "function-scroll",
        x: 550,
        y: 500,
        icon: "📜",
        type: "material",
        collectible: true
    },

    {
        id: "class-scroll",
        roomId: "tower-study",
        materialId: "class-scroll",
        x: 830,
        y: 200,
        icon: "📜",
        type: "material",
        collectible: true
    },

    {
        id: "sealed-notebook",
        roomId: "tower-study",
        name: "Sealed Notebook",
        x: 300,
        y: 470,
        icon: "📓",
        type: "scenery",
        collectible: false,
        description: "A notebook protected by a small magical seal."
    },


    /* LIBRARY */

    {
        id: "spellbook",
        roomId: "academy-library",
        materialId: "spellbook",
        x: 350,
        y: 220,
        icon: "📚",
        type: "material",
        collectible: true
    },

    {
        id: "bookmark",
        roomId: "academy-library",
        materialId: "bookmark",
        x: 720,
        y: 420,
        icon: "🔖",
        type: "material",
        collectible: true
    },

    {
        id: "exception-parent-stone",
        roomId: "academy-library",
        materialId: "exception-parent-stone",
        x: 810,
        y: 190,
        icon: "💠",
        type: "material",
        collectible: true
    },

    {
        id: "ink-bottle",
        roomId: "academy-library",
        name: "Ink Bottle",
        x: 530,
        y: 470,
        icon: "🖋️",
        type: "scenery",
        collectible: false,
        description: "A bottle of dark writing ink."
    },


    /* GREENHOUSE */

    {
        id: "moon-herb",
        roomId: "greenhouse",
        materialId: "moon-herb",
        x: 290,
        y: 260,
        icon: "🌿",
        type: "material",
        collectible: true
    },

    {
        id: "sunseed",
        roomId: "greenhouse",
        materialId: "sunseed",
        x: 760,
        y: 300,
        icon: "🌻",
        type: "material",
        collectible: true
    },

    {
        id: "poison-berry",
        roomId: "greenhouse",
        name: "Poison Berry",
        x: 650,
        y: 460,
        icon: "🫐",
        type: "scenery",
        collectible: false,
        description: "A berry marked as unsafe for ordinary potion experiments."
    },

    {
        id: "greenhouse-notebook",
        roomId: "greenhouse",
        name: "Greenhouse Notes",
        x: 400,
        y: 480,
        icon: "📓",
        type: "scenery",
        collectible: false,
        description: "Notes recording the plants growing in the greenhouse."
    },


    /* ACADEMY GARDEN */

    {
        id: "glimmering-feather",
        roomId: "academy-garden",
        name: "Glimmering Feather",
        x: 400,
        y: 300,
        icon: "🪶",
        type: "scenery",
        collectible: false,
        description: "A feather glowing faintly in the sunlight."
    },

    {
        id: "garden-stone",
        roomId: "academy-garden",
        name: "Garden Stone",
        x: 730,
        y: 280,
        icon: "🪨",
        type: "scenery",
        collectible: false,
        description: "A stone marking an old garden path."
    },

    {
        id: "wild-flower",
        roomId: "academy-garden",
        name: "Wild Flower",
        x: 520,
        y: 470,
        icon: "🌼",
        type: "scenery",
        collectible: false,
        description: "A common flower growing beside the path."
    },

    {
        id: "mossy-pebble",
        roomId: "academy-garden",
        materialId: "mossy-pebble",
        x: 850,
        y: 490,
        icon: "🪨",
        type: "material",
        collectible: true
    },


    /* FOREST PATH */

    {
        id: "forest-moonleaf",
        roomId: "forest-path",
        name: "Moonleaf",
        x: 340,
        y: 280,
        icon: "🍃",
        type: "scenery",
        collectible: false,
        description: "A pale leaf growing beside an old forest path."
    },

    {
        id: "forest-silver-feather",
        roomId: "forest-path",
        name: "Silver Feather",
        x: 760,
        y: 190,
        icon: "🪶",
        type: "scenery",
        collectible: false,
        description: "A feather left by a forest creature."
    },

    {
        id: "forest-mossy-pebble",
        roomId: "forest-path",
        name: "Mossy Pebble",
        x: 850,
        y: 440,
        icon: "🪨",
        type: "scenery",
        collectible: false,
        description: "A stone covered with moss."
    },

    {
        id: "wild-mushroom",
        roomId: "forest-path",
        name: "Wild Mushroom",
        x: 530,
        y: 490,
        icon: "🍄",
        type: "scenery",
        collectible: false,
        description: "A mushroom growing near the roots of an old tree."
    },

    {
        id: "fallen-branch",
        roomId: "forest-path",
        name: "Fallen Branch",
        x: 300,
        y: 480,
        icon: "🪵",
        type: "scenery",
        collectible: false,
        description: "A branch lying across the forest floor."
    },

    {
        id: "forest-herb",
        roomId: "forest-path",
        name: "Forest Herb",
        x: 680,
        y: 330,
        icon: "🌿",
        type: "scenery",
        collectible: false,
        description: "A wild herb growing in the shade."
    },


    /* ENCHANTED FOREST */

    {
        id: "forest-nightshade",
        roomId: "enchanted-forest",
        name: "Nightshade",
        x: 320,
        y: 250,
        icon: "🪻",
        type: "scenery",
        collectible: false,
        description: "A dark flower growing below the forest canopy."
    },

    {
        id: "forest-silvermoss",
        roomId: "enchanted-forest",
        name: "Silvermoss",
        x: 770,
        y: 380,
        icon: "🌿",
        type: "scenery",
        collectible: false,
        description: "Moss with a faint silver shimmer."
    },

    {
        id: "ancient-root",
        roomId: "enchanted-forest",
        name: "Ancient Root",
        x: 560,
        y: 440,
        icon: "🌳",
        type: "scenery",
        collectible: false,
        description: "A root from one of the oldest trees."
    },

    {
        id: "glow-mushroom",
        roomId: "enchanted-forest",
        name: "Glow Mushroom",
        x: 850,
        y: 180,
        icon: "🍄",
        type: "scenery",
        collectible: false,
        description: "A mushroom glowing in the darkness."
    },


    /* FOREST TEMPLE */

    {
        id: "cauldron-heart",
        roomId: "forest-temple",
        materialId: "cauldron-heart",
        x: 650,
        y: 310,
        icon: "❤️",
        type: "material",
        collectible: true
    },

    {
        id: "ancient-rule-stone",
        roomId: "forest-temple",
        name: "Ancient Rule Stone",
        x: 350,
        y: 260,
        icon: "🪨",
        type: "scenery",
        collectible: false,
        description: "A stone inscribed with an ancient rule."
    },

    {
        id: "temple-inscription",
        roomId: "forest-temple",
        name: "Temple Inscription",
        x: 540,
        y: 490,
        icon: "📜",
        type: "scenery",
        collectible: false,
        description: "An inscription that describes the rules of an old ritual."
    },

    {
        id: "old-rune-fragment",
        roomId: "forest-temple",
        name: "Rune Fragment",
        x: 800,
        y: 460,
        icon: "🔸",
        type: "scenery",
        collectible: false,
        description: "A fragment from an ancient rune."
    },


    /* UNDERCROFT */

    {
        id: "undercroft-parent-stone",
        roomId: "undercroft-portal",
        name: "Ancient Exception Stone",
        x: 340,
        y: 230,
        icon: "💠",
        type: "scenery",
        collectible: false,
        description: "A stone displaying the structure of old magical rules."
    },

    {
        id: "undercroft-rule-stone",
        roomId: "undercroft-portal",
        name: "Old Rule Stone",
        x: 780,
        y: 220,
        icon: "🪨",
        type: "scenery",
        collectible: false,
        description: "A stone containing a rule from a forgotten ritual."
    },

    {
        id: "old-rune-table",
        roomId: "undercroft-portal",
        name: "Rune Table",
        x: 550,
        y: 400,
        icon: "🔮",
        type: "scenery",
        collectible: false,
        description: "A table used for powerful magical rituals."
    },

    {
        id: "undercroft-cauldron-heart",
        roomId: "undercroft-portal",
        name: "Cauldron Heart",
        x: 820,
        y: 460,
        icon: "❤️",
        type: "scenery",
        collectible: false,
        description: "An old magical core resting in the undercroft."
    },


    /* BRIARWOOD VILLAGE */

    {
        id: "village-herb-bundle",
        roomId: "briarwood-village",
        name: "Herb Bundle",
        x: 340,
        y: 320,
        icon: "🌿",
        type: "scenery",
        collectible: false,
        description: "A bundle of ordinary herbs offered by a village trader."
    },

    {
        id: "sealed-parcel",
        roomId: "briarwood-village",
        name: "Sealed Parcel",
        x: 700,
        y: 240,
        icon: "📦",
        type: "scenery",
        collectible: false,
        description: "A parcel addressed to the Mage's Tower."
    },

    {
        id: "village-notice",
        roomId: "briarwood-village",
        name: "Village Notice",
        x: 550,
        y: 490,
        icon: "📜",
        type: "scenery",
        collectible: false,
        description: "A notice about strange events near the forest."
    }

];


/* ============================================================
   13. MASTER'S EXPERIMENT LOCATIONS
   ============================================================ */

/*
 * The Master appears at the experiment station for the
 * current mission. He is the guide and teacher.
 *
 * The Sorcerer is not the same character and does not
 * physically return until Chapter 8.
 */

export const MASTER_EXPERIMENT_POSITIONS = {
    "potion-lab": {
        x: 870,
        y: 245
    },

    "rune-chamber": {
        x: 870,
        y: 245
    },

    "research-room": {
        x: 850,
        y: 250
    },

    "observatory": {
        x: 850,
        y: 270
    },

    "alchemy-lab": {
        x: 875,
        y: 240
    },

    "archive-annex": {
        x: 850,
        y: 250
    },

    "portal-room": {
        x: 850,
        y: 250
    },

    "tower-study": {
        x: 850,
        y: 250
    }
};


/* ============================================================
   14. CHAPTER MISSIONS
   ============================================================ */

/*
 * Each chapter follows this sequence:
 *
 * 1. The Master assigns a task.
 * 2. The player explores the world.
 * 3. The player gathers required materials.
 * 4. Previously collected materials are reused.
 * 5. The player returns to the experiment location.
 * 6. The materials are prepared at the station.
 * 7. The player attempts the experiment.
 * 8. Failure leads to a specific explanation.
 * 9. The player retries.
 * 10. Success earns one golden star.
 * 11. The next chapter becomes available.
 *
 * Actual experiment logic and execution are in activities.js.
 */

export const CHAPTERS = [

    /* ========================================================
       CHAPTER 1
       ======================================================== */

    {
        id: "recognising-errors",

        number: 1,

        title: "The Cauldron of Unstable Ingredients",

        location: "potion-lab",

        concept: "exception-recognition",

        conceptTitle: "Recognising Python Exceptions",

        experimentId: "unstable-cauldron",

        masterRoomId: "potion-lab",

        experimentRoomId: "potion-lab",

        masterTask:
            "Prepare the cauldron by collecting five materials. You will use them as puzzle pieces to build and run four short Python programs.",

        briefing:
            "This is your first Python experiment. Build and run each program, then read the result to identify whether Python raised an exception and what kind.",

        objective:
            "Find the five listed materials across the six connected learning rooms. Return to the Potion Lab and place them on this experiment table before building your programs.",

        requiredMaterials: [
            "variable-scroll",
            "integer-moonstone",
            "zero-crystal",
            "moon-herb",
            "unknown-name-scroll"
        ],

        optionalMaterials: [
            "moonwater-vial",
            "blue-thistle",
            "silvermoss"
        ],

        collectionRooms: [
            "tower-storage",
            "potion-lab",
            "greenhouse",
            "tower-study"
        ],

        successDialogue:
            "Well done! You have discovered that Python reports different kinds of failures using different exception types.",

        successExplanation: {
            simple:
                "An exception is a signal that something went wrong while the program was running. Python gives different problems different names.",

            developerInsight:
                "Exception types carry semantic information about the failure. Inspecting the concrete exception type helps identify the failed operation and choose a suitable recovery strategy."
        },

        failureExplanations: {
            "ZeroDivisionError": {
                title: "The divisor is zero",

                simple:
                    "You tried to divide something by zero. Python cannot calculate that result, so it raises ZeroDivisionError.",

                developerInsight:
                    "The division operation fails during evaluation. Assignment to the result variable does not complete because the right-hand side raised an exception."
            },

            "ValueError": {
                title: "The value is unsuitable",

                simple:
                    "The text was accepted as input, but its contents could not be converted into the required number. Python raises ValueError.",

                developerInsight:
                    "The input type is acceptable to the conversion function, but the value does not represent a valid integer."
            },

            "TypeError": {
                title: "The types do not match",

                simple:
                    "You tried to combine two kinds of things that cannot be combined in that way, such as a number and a string.",

                developerInsight:
                    "The operation does not support the operand type combination. The problem is the type relationship rather than merely an invalid value."
            },

            "NameError": {
                title: "Python cannot find the name",

                simple:
                    "You used a name that has not been defined. Python does not know what object that name refers to.",

                developerInsight:
                    "Name resolution failed in the current scope. Check spelling, assignment order and whether the required variable or function is available."
            }
        },

        nextChapter: "try-except",

        starReward: 1,

        goldenStarMessage:
            "The first cauldron experiment is complete. The apprentice has learned to read the warning before attempting another spell."
    },


    /* ========================================================
       CHAPTER 2
       ======================================================== */

    {
        id: "try-except",

        number: 2,

        title: "The Protective Magic Circle",

        location: "rune-chamber",

        concept: "try-except",

        conceptTitle: "The try and except Structure",

        experimentId: "protective-circle",

        masterRoomId: "rune-chamber",

        experimentRoomId: "rune-chamber",

        masterTask:
            "Construct a protective magic circle that allows a dangerous spell to fail without bringing down the entire experiment.",

        briefing:
            "The cauldron is unstable. This time, you must prepare a response before casting the spell. The Master has supplied several runes, but only the correct arrangement will protect the experiment.",

        objective:
            "Find the try rune, except rune, ZeroDivisionError ward and wand core. Construct the protective circle.",

        requiredMaterials: [
            "try-rune",
            "except-rune",
            "zero-ward",
            "wand-core"
        ],

        optionalMaterials: [
            "binding-sigil",
            "integer-moonstone",
            "zero-crystal"
        ],

        collectionRooms: [
            "rune-chamber",
            "research-room",
            "tower-study",
            "apprentice-chamber"
        ],

        successDialogue:
            "The protective circle works! The operation still failed, but the matching handler responded to it.",

        successExplanation: {
            simple:
                "try contains the risky operation. except contains the action Python should perform when the named exception occurs.",

            developerInsight:
                "A matching except clause intercepts an exception raised inside its associated try suite. The handler executes instead of allowing that exception to propagate past the try statement."
        },

        failureExplanations: {
            "unprotected": {
                title: "The spell has no protection",

                simple:
                    "You performed a dangerous operation without preparing a try block. When it failed, there was no handler to respond.",

                developerInsight:
                    "An exception raised outside a matching try handler propagates through the call stack. An unhandled exception can terminate normal execution."
            },

            "wrong-handler": {
                title: "The shield does not match",

                simple:
                    "Your spell raised ZeroDivisionError, but your shield was prepared for a different exception. The handler did not match.",

                developerInsight:
                    "Python matches handlers using the raised exception type and its inheritance relationships. A handler for an unrelated type does not catch the exception."
            },

            "handler-in-try": {
                title: "The protective rune is in the wrong place",

                simple:
                    "The risky operation belongs inside try. The response belongs inside except, after the try block.",

                developerInsight:
                    "The try and except suites form one compound exception-handling statement. Their block structure and indentation determine which statements belong to each suite."
            }
        },

        nextChapter: "multiple-handlers",

        starReward: 1,

        goldenStarMessage:
            "The protective circle has been mastered. The apprentice now knows how to prepare a response for a specific failure."
    },


    /* ========================================================
       CHAPTER 3
       ======================================================== */

    {
        id: "multiple-handlers",

        number: 3,

        title: "The Three Potion Warnings",

        location: "research-room",

        concept: "multiple-handlers",

        conceptTitle: "Multiple Exception Handlers",

        experimentId: "three-warnings",

        masterRoomId: "research-room",

        experimentRoomId: "research-room",

        masterTask:
            "Build a system that can recognise three different potion failures and respond to each one correctly.",

        briefing:
            "Three ingredients have caused three different problems. One shield cannot solve every problem. The research table contains several warning stones. Match each failure to its own response.",

        objective:
            "Collect the ValueError, TypeError and NameError stones, along with the Exception Index.",

        requiredMaterials: [
            "value-error-stone",
            "type-error-stone",
            "name-error-stone",
            "exception-index"
        ],

        optionalMaterials: [
            "zero-ward",
            "try-rune",
            "except-rune"
        ],

        collectionRooms: [
            "research-room",
            "trophy-room"
        ],

        successDialogue:
            "Excellent! Python checked the handlers and selected the first one that matched the exception.",

        successExplanation: {
            simple:
                "One try block can have several except blocks. Python chooses the first handler that matches the problem.",

            developerInsight:
                "Multiple handlers allow different recovery policies for different exception types. More specific handlers should normally appear before broad handlers so they are not shadowed."
        },

        failureExplanations: {
            "value-mismatch": {
                title: "The value handler is missing",

                simple:
                    "The text was the wrong value for the conversion. That needs a ValueError handler, not a TypeError handler.",

                developerInsight:
                    "The conversion operation accepts the argument's type but cannot interpret its contents as the target value. This is a ValueError case."
            },

            "type-mismatch": {
                title: "The type handler is missing",

                simple:
                    "You tried to combine incompatible types. That requires a TypeError handler.",

                developerInsight:
                    "The operation's supported operand types do not include this combination. Use a TypeError handler when that failure is expected and recoverable."
            },

            "name-mismatch": {
                title: "The missing-name handler is wrong",

                simple:
                    "Python could not find the name used in the experiment. That is NameError, not ValueError.",

                developerInsight:
                    "NameError indicates failed name resolution. Check whether the identifier exists in the relevant local, enclosing, global or built-in scope."
            },

            "broad-handler-first": {
                title: "The broad handler catches too early",

                simple:
                    "A general handler was placed before the specific ones. It caught the error before the more useful handler could run.",

                developerInsight:
                    "A broad except Exception clause can match many subclasses, making later specific handlers unreachable for those exceptions. Put specific handlers first."
            }
        },

        nextChapter: "else-block",

        starReward: 1,

        goldenStarMessage:
            "Three different warnings, three useful responses. The apprentice can now choose handlers with care."
    },


    /* ========================================================
       CHAPTER 4
       ======================================================== */

    {
        id: "else-block",

        number: 4,

        title: "The Wand of Successful Spells",

        location: "observatory",

        concept: "else",

        conceptTitle: "The else Block",

        experimentId: "successful-wand",

        masterRoomId: "observatory",

        experimentRoomId: "observatory",

        masterTask:
            "Calibrate the wand and separate the successful experiment path from the failure path.",

        briefing:
            "The wand is ready, but its success message must appear only when the spell works. The Master wants you to discover where success-only instructions belong.",

        objective:
            "Collect a success crystal, wand core and moonwater vial. Reuse the integer moonstone if you have already collected it.",

        requiredMaterials: [
            "success-crystal",
            "wand-core",
            "moonwater-vial",
            "integer-moonstone"
        ],

        optionalMaterials: [
            "star-crystal",
            "function-scroll"
        ],

        collectionRooms: [
            "observatory",
            "potion-lab",
            "tower-storage",
            "apprentice-chamber"
        ],

        successDialogue:
            "The wand glows steadily. The success-only instruction runs because the try block completed without an exception.",

        successExplanation: {
            simple:
                "else runs when the try block succeeds. It does not run when the try block raises an exception.",

            developerInsight:
                "The optional else suite executes only after normal completion of the try suite. This helps separate the failure-handling path from subsequent success-only work."
        },

        failureExplanations: {
            "else-used-for-failure": {
                title: "The failure response is in the wrong block",

                simple:
                    "You put an error response in else. But else is only for successful experiments. Use except to handle a matching failure.",

                developerInsight:
                    "The else suite is not an alternative exception handler. It executes only if the try suite completes normally."
            },

            "else-not-running": {
                title: "The try block did not succeed",

                simple:
                    "The conversion failed, so Python skipped else. The success-only message cannot run when the protected operation raises an exception.",

                developerInsight:
                    "The try suite did not complete normally. Control transferred to a matching handler, so the associated else suite is skipped."
            },

            "success-code-in-except": {
                title: "The success message is in the error handler",

                simple:
                    "except is for failures. Move the success message to else so it runs only when the try operation succeeds.",

                developerInsight:
                    "Separate success-path logic from exception recovery. This improves the clarity of control flow and avoids mixing incompatible responsibilities."
            }
        },

        nextChapter: "finally-block",

        starReward: 1,

        goldenStarMessage:
            "The wand is calibrated. The apprentice understands how Python follows the successful execution path."
    },


    /* ========================================================
       CHAPTER 5
       ======================================================== */

    {
        id: "finally-block",

        number: 5,

        title: "The Runaway Furnace",

        location: "alchemy-lab",

        concept: "finally",

        conceptTitle: "The finally Block",

        experimentId: "runaway-furnace",

        masterRoomId: "alchemy-lab",

        experimentRoomId: "alchemy-lab",

        masterTask:
            "Repair the furnace so that its safety valve is closed when the experiment leaves the try statement.",

        briefing:
            "The furnace is dangerous. Sometimes the spell succeeds; sometimes it fails. The valve must be closed in either case. Build a reliable cleanup sequence.",

        objective:
            "Collect the finally rune, safety valve key and ember core.",

        requiredMaterials: [
            "finally-rune",
            "safety-valve-key",
            "ember-core"
        ],

        optionalMaterials: [
            "success-crystal",
            "zero-crystal"
        ],

        collectionRooms: [
            "tower-study",
            "tower-storage",
            "alchemy-lab"
        ],

        successDialogue:
            "The furnace is safe! The cleanup action ran after the experiment, despite the failure.",

        successExplanation: {
            simple:
                "finally is used for cleanup. It runs when control leaves the try statement, whether the experiment succeeds or fails.",

            developerInsight:
                "A finally suite executes as the try statement exits, including when an exception is raised. It is useful for cleanup actions such as releasing resources, though it does not automatically handle or suppress the original exception."
        },

        failureExplanations: {
            "cleanup-in-else": {
                title: "The valve closes only on success",

                simple:
                    "You put the cleanup action in else. That block is skipped when the experiment fails. Move cleanup into finally.",

                developerInsight:
                    "The else suite does not execute after an exception in try. Cleanup that must run on both paths belongs in finally or another reliable resource-management mechanism."
            },

            "finally-catches-error": {
                title: "finally does not catch the error",

                simple:
                    "finally is not the shield that catches the failure. except handles the exception; finally performs cleanup.",

                developerInsight:
                    "A finally suite does not provide exception matching. It executes during exit, while the exception remains active unless it has already been handled or is otherwise suppressed."
            },

            "cleanup-missing": {
                title: "The cleanup action is missing",

                simple:
                    "You have prepared the finally block, but it does not close the valve. Put the actual cleanup instruction inside it.",

                developerInsight:
                    "A finally block only guarantees execution of its statements during ordinary control-flow exit. The required cleanup operation must actually be included and must itself be valid."
            }
        },

        nextChapter: "with-statement",

        starReward: 1,

        goldenStarMessage:
            "The furnace is contained. The apprentice now understands why cleanup must be planned for both success and failure."
    },


    /* ========================================================
       CHAPTER 6
       ======================================================== */

    {
        id: "with-statement",

        number: 6,

        title: "The Archive of Sealed Spellbooks",

        location: "academy-library",

        concept: "with",

        conceptTitle: "The with Statement and Context Managers",

        experimentId: "sealed-spellbook",

        masterRoomId: "academy-library",

        experimentRoomId: "academy-library",

        masterTask:
            "Open an ancient spellbook, read its contents and ensure it closes safely even when reading fails.",

        briefing:
            "The archive contains a book needed to repair the tower. Opening it is easy. Remembering to close it in every possible situation is not. Discover how a context manager helps.",

        objective:
            "Collect the enchanted spellbook, binding sigil, bookmark and function scroll.",

        requiredMaterials: [
            "spellbook",
            "binding-sigil",
            "bookmark",
            "function-scroll"
        ],

        optionalMaterials: [
            "exception-parent-stone",
            "exception-index"
        ],

        collectionRooms: [
            "academy-library",
            "archive-annex",
            "tower-study"
        ],

        successDialogue:
            "The spellbook has closed safely. The context manager handled the resource lifecycle.",

        successExplanation: {
            simple:
                "with opens a managed resource and lets its context manager handle cleanup when the block ends.",

            developerInsight:
                "The with statement uses a context manager's entry and exit protocol. For file objects, leaving the block closes the file, including when the block exits because of an exception."
        },

        failureExplanations: {
            "manual-close-missed": {
                title: "The book was left open",

                simple:
                    "You remembered to close the spellbook after success but forgot what would happen if reading failed. The resource could remain open.",

                developerInsight:
                    "Manual cleanup can be missed on exceptional paths. A context manager centralises the lifecycle so its exit protocol performs cleanup."
            },

            "with-wrong-placement": {
                title: "The reading operation is outside the context",

                simple:
                    "The book must be used inside the with block. The context manager can only manage the resource during its block.",

                developerInsight:
                    "The managed resource is guaranteed to be active for the lexical body of the with statement. Operations outside that body occur after context exit."
            },

            "with-not-cleanup": {
                title: "The context manager handles cleanup, not every error",

                simple:
                    "with does not prevent every possible error. It handles the resource's setup and cleanup.",

                developerInsight:
                    "A context manager's exit method can release resources and may influence exception propagation, but using with does not itself eliminate arbitrary exceptions."
            }
        },

        nextChapter: "raise-propagation",

        starReward: 1,

        goldenStarMessage:
            "The archive is secure. The apprentice can now manage resources without relying on memory alone."
    },


    /* ========================================================
       CHAPTER 7
       ======================================================== */

    {
        id: "raise-propagation",

        number: 7,

        title: "The Guardian at the Forbidden Gate",

        location: "portal-room",

        concept: "raise",

        conceptTitle: "raise, Validation and Exception Propagation",

        experimentId: "forbidden-gate",

        masterRoomId: "portal-room",

        experimentRoomId: "portal-room",

        masterTask:
            "Enforce the gate's rule and reject invalid requests by raising an exception. Then trace how the exception reaches the caller.",

        briefing:
            "The guardian allows only valid quantities through the gate. A warning message is not enough. The program must signal the invalid request so that the caller can respond.",

        objective:
            "Collect the raise rune, rule stone, caller token and function scroll.",

        requiredMaterials: [
            "raise-rune",
            "rule-stone",
            "caller-token",
            "function-scroll"
        ],

        optionalMaterials: [
            "exception-index",
            "value-error-stone"
        ],

        collectionRooms: [
            "portal-room",
            "trophy-room",
            "observatory",
            "tower-study"
        ],

        successDialogue:
            "The guardian accepts the rule. An invalid request now raises an exception, and the caller can handle it.",

        successExplanation: {
            simple:
                "raise deliberately creates an exception. If the current function does not handle it, Python can pass the exception to the function that called it.",

            developerInsight:
                "The raise statement signals exceptional control flow. If the current scope does not handle the exception, stack unwinding propagates it to an enclosing handler or ultimately to the runtime."
        },

        failureExplanations: {
            "print-only": {
                title: "A warning is not an exception",

                simple:
                    "Printing a warning only displays text. It does not tell Python that the operation must stop. Use raise to signal the invalid request.",

                developerInsight:
                    "Printing is a side effect, not exceptional control flow. Raising an appropriate exception allows callers to decide whether and how to recover."
            },

            "invalid-condition": {
                title: "The validation rule is incorrect",

                simple:
                    "The gate must reject the value that breaks its rule. Check the condition before raising the exception.",

                developerInsight:
                    "Validation should express the domain invariant correctly. A reversed or incorrect comparison can reject valid inputs or accept invalid ones."
            },

            "propagation-misunderstood": {
                title: "The exception travels outward",

                simple:
                    "The function did not catch the exception, so Python passed it back to the caller. A matching except block there can handle it.",

                developerInsight:
                    "An exception propagates through caller frames until a matching handler is found. This is a normal part of Python's exception model."
            },

            "wrong-exception": {
                title: "Choose an appropriate exception type",

                simple:
                    "The quantity is invalid, so ValueError is a clearer choice than an unrelated exception.",

                developerInsight:
                    "Exception selection communicates the nature of a failure to downstream code. Use an exception type that accurately represents the violated condition."
            }
        },

        nextChapter: "custom-exceptions",

        starReward: 1,

        goldenStarMessage:
            "The gate is secure. The apprentice understands how functions can report failures to their callers."
    },


    /* ========================================================
       CHAPTER 8
       ======================================================== */

    {
        id: "custom-exceptions",

        number: 8,

        title: "The Master's Final Trial",

        location: "tower-study",

        concept: "custom-exceptions",

        conceptTitle: "Custom Exception Classes",

        experimentId: "masters-final-rule",

        masterRoomId: "tower-study",

        experimentRoomId: "tower-study",

        masterTask:
            "Create a new exception for the cauldron's overflow rule and use it to protect the final experiment.",

        briefing:
            "The final experiment uses a rule unique to this workshop. A generic warning will not explain the problem clearly enough. Create a new exception type with a meaningful name.",

        objective:
            "Gather the class scroll, Exception parent stone, exception quill and cauldron heart.",

        requiredMaterials: [
            "class-scroll",
            "exception-parent-stone",
            "exception-quill",
            "cauldron-heart"
        ],

        optionalMaterials: [
            "raise-rune",
            "rule-stone",
            "function-scroll"
        ],

        collectionRooms: [
            "tower-study",
            "academy-library",
            "forest-temple"
        ],

        successDialogue:
            "You have done it, apprentice. You have created a new exception, enforced your own rule and handled the resulting failure. You are ready to become a magician in your own right.",

        successExplanation: {
            simple:
                "A custom exception is a new exception class that you create for a special rule in your own program. It normally inherits from Exception.",

            developerInsight:
                "Custom exception classes represent domain-specific failures. They improve the expressiveness of an API, allow callers to catch precise error categories and preserve the semantic structure of an application's failure model."
        },

        failureExplanations: {
            "missing-parent": {
                title: "The custom exception needs a parent",

                simple:
                    "Your new exception class should inherit from Exception. That gives it the behaviour expected of a Python exception.",

                developerInsight:
                    "A normal user-defined exception derives from Exception, directly or through an intermediate application-specific base class."
            },

            "missing-raise": {
                title: "The new rule was defined but never raised",

                simple:
                    "Creating the exception class does not automatically trigger it. Use raise when the cauldron rule is broken.",

                developerInsight:
                    "Defining a class only introduces a new exception type. Exceptional control flow occurs only when an instance is raised."
            },

            "wrong-class-name": {
                title: "The class name must match",

                simple:
                    "The handler must refer to the same custom exception class that the program raises.",

                developerInsight:
                    "The raised instance must be compatible with the type named in the handler. Check spelling, scope and class identity."
            },

            "wrong-rule": {
                title: "The cauldron rule is incorrect",

                simple:
                    "The experiment must reject a quantity greater than the allowed capacity. Check the comparison before raising your new exception.",

                developerInsight:
                    "Domain validation should implement the invariant exactly. Boundary comparisons matter: distinguish an allowed maximum from an exceeded maximum."
            }
        },

        nextChapter: null,

        starReward: 1,

        goldenStarMessage:
            "The final experiment is complete. The Master awards the apprentice the final golden star. The Sorcerer returns, and the apprentice has earned the right to create and govern new magic."
    }

];


/* ============================================================
   15. WORLD PROGRESSION RULES
   ============================================================ */

export const PROGRESSION_RULES = {
    startingChapterId: CHAPTERS[0].id,

    startingRoomId: PLAYER.startingRoomId,

    chapterOrder: CHAPTERS.map((chapter) => chapter.id),

    requireMaterialsBeforeExperiment: true,

    allowAlreadyCollectedMaterials: true,

    consumeMaterials: false,

    requireMasterStation: true,

    requireExperimentSuccess: true,

    allowUnlimitedExperimentRetries: true,

    awardStarOnlyOnSuccess: true,

    unlockNextChapterOnlyOnSuccess: true,

    allowChapterRevisit: true,

    allowRoomRevisit: true,

    preserveInventory: true,

    preserveCompletedMissions: true,

    sorcererReturnChapter: 8,

    finalAssessmentAfterAllChapters: true
};


/* Keep the original art and room records, but expose a compact six-room
   learning world. Materials from removed destinations are redistributed
   into the nearest retained room. */
const PLAYABLE_ROOM_IDS = [
    "potion-lab",
    "academy-grounds",
    "forest-path",
    "tower-storage",
    "rune-chamber",
    "tower-study"
];
for (const roomId of Object.keys(MASTER_EXPERIMENT_POSITIONS)) {
    if (!PLAYABLE_ROOM_IDS.includes(roomId)) delete MASTER_EXPERIMENT_POSITIONS[roomId];
}

const MATERIAL_ROOM_REASSIGNMENT = {
    "apprentice-chamber": "tower-storage",
    "archive-annex": "tower-study",
    "entrance-hall": "academy-grounds",
    "animal-cages": "academy-grounds",
    "reception-room": "tower-storage",
    "masters-bedroom": "tower-storage",
    "trophy-room": "rune-chamber",
    "portal-room": "rune-chamber",
    "alchemy-lab": "potion-lab",
    "herb-garden": "potion-lab",
    "study-orrery": "tower-study",
    "observatory": "tower-study",
    "tower-parlour": "tower-storage",
    "research-room": "tower-study",
    "academy-library": "tower-study",
    "greenhouse": "academy-grounds",
    "academy-garden": "academy-grounds",
    "enchanted-forest": "forest-path",
    "forest-temple": "forest-path",
    "undercroft-portal": "rune-chamber",
    "briarwood-village": "forest-path"
};

if (!WORLD_OBJECTS.some(object => object.materialId === "wand-core")) {
    WORLD_OBJECTS.push({
        id: "wand-core-pickup",
        roomId: "rune-chamber",
        materialId: "wand-core",
        name: MATERIALS["wand-core"].name,
        x: 540,
        y: 500,
        icon: MATERIALS["wand-core"].icon,
        type: "material",
        collectible: true,
        description: MATERIALS["wand-core"].description
    });
}

const mapExit = (id, label, targetRoomId, x, y, targetX, targetY) =>
    createExit(id, label, targetRoomId, x, y, targetX, targetY);

for (const roomId of Object.keys(ROOMS)) {
    if (!PLAYABLE_ROOM_IDS.includes(roomId)) delete ROOMS[roomId];
}

ROOMS["potion-lab"].name = "Potion Lab";
ROOMS["potion-lab"].region = "Mage's Tower";
ROOMS["potion-lab"].exits = [
    mapExit("potion-runes", "Enter the Rune Chamber", "rune-chamber", 1050, 260, 60, 260),
    mapExit("potion-forest", "Visit the Academy Forest", "forest-path", 1050, 455, 60, 455)
];
ROOMS["academy-grounds"].name = "Academy";
ROOMS["academy-grounds"].exits = [
    mapExit("academy-storage", "Visit Tower Storage", "tower-storage", 40, 260, 1040, 260),
    mapExit("academy-forest", "Enter the Academy Forest", "forest-path", 1050, 455, 60, 455)
];
ROOMS["forest-path"].name = "Academy Forest";
ROOMS["forest-path"].exits = [
    mapExit("forest-academy", "Return to the Academy", "academy-grounds", 40, 260, 1040, 260),
    mapExit("forest-potion-lab", "Return to the Potion Lab", "potion-lab", 40, 455, 1040, 455)
];
ROOMS["tower-storage"].name = "Tower Storage";
ROOMS["tower-storage"].exits = [
    mapExit("storage-study", "Enter the Tower Study", "tower-study", 1050, 260, 60, 260),
    mapExit("storage-academy", "Visit the Academy", "academy-grounds", 1050, 455, 60, 455)
];
ROOMS["rune-chamber"].name = "Rune Chamber";
ROOMS["rune-chamber"].exits = [
    mapExit("runes-potion-lab", "Return to the Potion Lab", "potion-lab", 40, 260, 1040, 260),
    mapExit("runes-study", "Enter the Tower Study", "tower-study", 1050, 455, 60, 455)
];
ROOMS["tower-study"].name = "Tower Study";
ROOMS["tower-study"].exits = [
    mapExit("study-runes", "Return to the Rune Chamber", "rune-chamber", 40, 455, 1040, 455),
    mapExit("study-storage", "Visit Tower Storage", "tower-storage", 40, 260, 1040, 260)
];

for (const object of WORLD_OBJECTS) {
    object.roomId = MATERIAL_ROOM_REASSIGNMENT[object.roomId] ?? object.roomId;
}
const objectIds = new Set();
for (const object of WORLD_OBJECTS) {
    if (objectIds.has(object.id)) {
        const baseId = `${object.id}-${object.roomId}-${object.x}-${object.y}`;
        let uniqueId = baseId;
        let suffix = 2;
        while (objectIds.has(uniqueId)) uniqueId = `${baseId}-${suffix++}`;
        object.id = uniqueId;
    }
    objectIds.add(object.id);
}
WORLD_OBJECTS.splice(
    0,
    WORLD_OBJECTS.length,
    ...WORLD_OBJECTS.filter(object => PLAYABLE_ROOM_IDS.includes(object.roomId))
);
for (const roomId of PLAYABLE_ROOM_IDS) {
    ROOMS[roomId].objectIds = WORLD_OBJECTS
        .filter(object => object.roomId === roomId)
        .map(object => object.id);
}

PLAYER.startingRoomId = "potion-lab";
PLAYER.startingPosition = { x: 550, y: 500 };

for (const chapter of CHAPTERS) {
    chapter.experimentRoomId = "potion-lab";
    chapter.masterRoomId = "potion-lab";
    chapter.collectionRooms = [...new Set(
        (chapter.collectionRooms ?? [])
            .map(roomId => MATERIAL_ROOM_REASSIGNMENT[roomId] ?? roomId)
            .filter(roomId => PLAYABLE_ROOM_IDS.includes(roomId))
    )];
}

const mapRooms = [
    ["potion-lab", "Potion Lab", "🧪", 49, 55],
    ["academy-grounds", "Academy", "🏛️", 24, 39],
    ["forest-path", "Academy Forest", "🌲", 76, 63],
    ["tower-storage", "Tower Storage", "📦", 24, 78],
    ["rune-chamber", "Rune Chamber", "🔮", 70, 32],
    ["tower-study", "Tower Study", "📚", 50, 18]
];
WORLD_MAP_LOCATIONS.splice(0, WORLD_MAP_LOCATIONS.length, ...mapRooms.map(
    ([id, label, icon, x, y]) => ({
        id: `map-${id}`, label, icon, x, y, mapId: "world",
        targetRoomId: id, description: `Travel to ${label}.`, unlockAfterChapter: 0
    })
));
ACADEMY_MAP_LOCATIONS.splice(0, ACADEMY_MAP_LOCATIONS.length, ...mapRooms.map(
    ([id, label, icon, x, y]) => ({
        id: `academy-${id}`, label, icon, x, y, mapId: "academy",
        targetRoomId: id, description: `Travel to ${label}.`, unlockAfterChapter: 0
    })
));


/* ============================================================
   16. STORY NAVIGATION HELPERS
   ============================================================ */

/*
 * These functions allow main.js and other modules to
 * retrieve consistent world data.
 */

export function getRoom(roomId) {
    return ROOMS[roomId] ?? null;
}


export function getChapterById(chapterId) {
    return CHAPTERS.find(
        (chapter) => chapter.id === chapterId
    ) ?? null;
}


export function getChapterByNumber(number) {
    return CHAPTERS.find(
        (chapter) => chapter.number === number
    ) ?? null;
}


export function getChapterIndex(chapterId) {
    return CHAPTERS.findIndex(
        (chapter) => chapter.id === chapterId
    );
}


export function getNextChapter(chapterId) {
    const index = getChapterIndex(chapterId);

    if (index < 0 || index >= CHAPTERS.length - 1) {
        return null;
    }

    return CHAPTERS[index + 1];
}


export function getRoomObjects(roomId) {
    return WORLD_OBJECTS.filter(
        (object) => object.roomId === roomId
    );
}


export function getObjectById(objectId) {
    return WORLD_OBJECTS.find(
        (object) => object.id === objectId
    ) ?? null;
}


export function getMaterialById(materialId) {
    return MATERIALS[materialId] ?? null;
}


export function getMaterialForObject(objectId) {
    const object = getObjectById(objectId);

    if (!object?.materialId) {
        return null;
    }

    return getMaterialById(object.materialId);
}


export function getRequiredMaterials(chapterId) {
    const chapter = getChapterById(chapterId);

    if (!chapter) {
        return [];
    }

    return chapter.requiredMaterials.map(
        (materialId) => MATERIALS[materialId]
    ).filter(Boolean);
}


export function isMaterialRequired(chapterId, materialId) {
    const chapter = getChapterById(chapterId);

    return Boolean(
        chapter?.requiredMaterials.includes(materialId)
    );
}


export function getMissingMaterials(chapterId, inventory = []) {
    const chapter = getChapterById(chapterId);

    if (!chapter) {
        return [];
    }

    return chapter.requiredMaterials.filter(
        (materialId) => !inventory.includes(materialId)
    );
}


export function hasAllMissionMaterials(chapterId, inventory = []) {
    return getMissingMaterials(chapterId, inventory).length === 0;
}


export function isChapterCompleted(chapterId, progress = {}) {
    return Boolean(
        progress.completedChapters?.includes(chapterId)
    );
}


export function isChapterUnlocked(chapterId, progress = {}) {
    const index = getChapterIndex(chapterId);

    if (index < 0) {
        return false;
    }

    if (index === 0) {
        return true;
    }

    const previousChapter = CHAPTERS[index - 1];

    return isChapterCompleted(
        previousChapter.id,
        progress
    );
}


export function getUnlockedChapters(progress = {}) {
    return CHAPTERS.filter(
        (chapter) => isChapterUnlocked(chapter.id, progress)
    );
}


export function isExitUnlocked(exit, progress = {}) {
    if (!exit) {
        return false;
    }

    if (!exit.requiredChapterId) {
        return true;
    }

    return isChapterCompleted(
        exit.requiredChapterId,
        progress
    );
}


export function getRoomExits(roomId, progress = {}) {
    const room = getRoom(roomId);

    if (!room) {
        return [];
    }

    return room.exits.map((exit) => ({
        ...exit,

        locked: !isExitUnlocked(exit, progress)
    }));
}


export function getWorldLocation(locationId) {
    return WORLD_MAP_LOCATIONS.find(
        (location) => location.id === locationId
    ) ?? null;
}


export function getAcademyLocation(locationId) {
    return ACADEMY_MAP_LOCATIONS.find(
        (location) => location.id === locationId
    ) ?? null;
}


export function isWorldLocationUnlocked(location, progress = {}) {
    if (!location) {
        return false;
    }

    if (!location.unlockAfterChapter) {
        return true;
    }

    const requiredChapter = getChapterByNumber(
        location.unlockAfterChapter
    );

    if (!requiredChapter) {
        return true;
    }

    return isChapterCompleted(
        requiredChapter.id,
        progress
    );
}


export function getAvailableWorldLocations(mapId = "world", progress = {}) {
    const locations = mapId === "academy"
        ? ACADEMY_MAP_LOCATIONS
        : WORLD_MAP_LOCATIONS;

    return locations.map((location) => ({
        ...location,

        locked: !isWorldLocationUnlocked(location, progress)
    }));
}


/* ============================================================
   17. GAME DATA VALIDATION
   ============================================================ */

/*
 * Use this during development to detect mistakes in the data.
 *
 * It checks:
 * - Room references
 * - Room transitions
 * - Object placement
 * - Material references
 * - Chapter requirements
 * - Experiment room references
 *
 * It does not modify game progress.
 */

export function validateWorldData() {
    const errors = [];

    const warnings = [];

    for (const [roomId, room] of Object.entries(ROOMS)) {

        if (room.id !== roomId) {
            errors.push(
                `Room key "${roomId}" does not match room.id "${room.id}".`
            );
        }

        if (!MAP_ASSETS[room.mapId]) {
            errors.push(
                `Room "${roomId}" uses unknown mapId "${room.mapId}".`
            );
        }

        if (!room.backgroundAsset) {
            errors.push(
                `Room "${roomId}" has no backgroundAsset.`
            );
        }

        for (const objectId of room.objectIds) {
            const object = getObjectById(objectId);

            if (!object) {
                warnings.push(
                    `Room "${roomId}" references missing object "${objectId}".`
                );
            } else if (object.roomId !== roomId) {
                warnings.push(
                    `Object "${objectId}" is assigned to "${object.roomId}", not "${roomId}".`
                );
            }
        }

        for (const exit of room.exits) {
            if (!ROOMS[exit.targetRoomId]) {
                errors.push(
                    `Exit "${exit.id}" in "${roomId}" targets missing room "${exit.targetRoomId}".`
                );
            }
        }
    }

    for (const object of WORLD_OBJECTS) {

        if (!ROOMS[object.roomId]) {
            errors.push(
                `Object "${object.id}" refers to missing room "${object.roomId}".`
            );
        }

        if (object.materialId && !MATERIALS[object.materialId]) {
            errors.push(
                `Object "${object.id}" refers to missing material "${object.materialId}".`
            );
        }

        if (
            !Number.isFinite(object.x) ||
            !Number.isFinite(object.y) ||
            object.x < 0 ||
            object.y < 0 ||
            object.x > WORLD_WIDTH ||
            object.y > WORLD_HEIGHT
        ) {
            errors.push(
                `Object "${object.id}" has invalid world coordinates.`
            );
        }
    }

    for (const chapter of CHAPTERS) {

        if (!ROOMS[chapter.experimentRoomId]) {
            errors.push(
                `Chapter "${chapter.id}" has a missing experiment room.`
            );
        }

        if (!ROOMS[chapter.masterRoomId]) {
            errors.push(
                `Chapter "${chapter.id}" has a missing Master room.`
            );
        }

        if (chapter.experimentRoomId !== chapter.masterRoomId) {
            warnings.push(
                `Chapter "${chapter.id}" has separate experiment and Master rooms.`
            );
        }

        for (const materialId of chapter.requiredMaterials) {
            if (!MATERIALS[materialId]) {
                errors.push(
                    `Chapter "${chapter.id}" requires missing material "${materialId}".`
                );
            }
        }

        for (const roomId of chapter.collectionRooms) {
            if (!ROOMS[roomId]) {
                errors.push(
                    `Chapter "${chapter.id}" references missing collection room "${roomId}".`
                );
            }
        }
    }

    return {
        valid: errors.length === 0,

        errors,

        warnings,

        roomCount: Object.keys(ROOMS).length,

        objectCount: WORLD_OBJECTS.length,

        materialCount: Object.keys(MATERIALS).length,

        chapterCount: CHAPTERS.length
    };
}


/* ============================================================
   18. DEFAULT EXPORT
   ============================================================ */

export default {
    GAME_CONFIG,

    PLAYER,

    MASTER,

    STORY_INTRO,

    MAP_ASSETS,

    WORLD_MAP_LOCATIONS,

    ACADEMY_MAP_LOCATIONS,

    TOWER_PLAN_ROOMS,

    MAIN_FLOOR_ROOMS,

    ROOMS,

    MATERIALS,

    WORLD_OBJECTS,

    MASTER_EXPERIMENT_POSITIONS,

    CHAPTERS,

    PROGRESSION_RULES,

    getRoom,

    getChapterById,

    getNextChapter,

    getRoomObjects,

    getObjectById,

    getMaterialById,

    getRequiredMaterials,

    getMissingMaterials,

    hasAllMissionMaterials,

    isChapterCompleted,

    isChapterUnlocked,

    getRoomExits,

    validateWorldData
};
