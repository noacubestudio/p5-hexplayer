let canvas;
let cooldownFrames = 3; // this animation time also blocks double taps
let readyForSound = false; // only play sound when ready
let drawMinDuration = 20; // 

let gridBaseMidi = 24;
let gridWidth;
let gridIncrement_H = 1;
let gridIncrement_D = 4;
let gridIncrement_V = 7;
let gridXYswapped = false;
let isConcertina = false;

const hexColors = [
    "#DE4D44",
    "#EE7A39",
    "#EEA435",
    "#EFC738",
    "#C2EC4D",
    "#82DC3B",

    "#4AD679",
    "#3CC5CE",
    "#51B6FF",
    "#7976FF",
    "#9E7CFF",
    "#CD6ABD",
];
const darkHexColors = [
    "#CE2A2A",
    "#D1551F",
    "#D77F19",
    "#D18F2C",
    "#A8CD3D",
    "#52C02B",

    "#31A97E",
    "#30A0B9",
    "#3889D3",
    "#575EFF",
    "#745EF9",
    "#AF50B7",
];
const lightHexColors = [
    "#FFB993",
    "#F89A66",
    "#F4BC4E",
    "#F5DC54",
    "#DAF17D",
    "#AEEA62",

    "#7FE489",
    "#64E5CE",
    "#78D7FF",
    "#AB9DFF",
    "#C68EFE",
    "#E493C4",
];

const darkerHexColors = [
    "#200303",
    "#260B02",
    "#290F03",
    "#221203",
    "#0F1E05",
    "#031D14",

    "#031819",
    "#031322",
    "#050F29",
    "#060A32",
    "#100930",
    "#1E051F",
];

const rootColor = "#FFD0B6";

let menuButtons = [];

const noteNames = [
    "C","C#","D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];
const intervalNames = [
    "1", "m2", "2", "m3", "3", "4", "TT", "5", "m6", "6", "m7", "7",
];
const intervalNames19tet = [
    "1", "»1", "2«", "2", "»2", "3«", "3", "›34‹", "4", "»4", "5«", "5", "»5", "6«", "6", "»6", "7«", "7", "›71‹",
];
const intervalNames14tet = [
    "1", "1*", "2", "2*", "3", "3*", "4", "4*", "5", "5*", "6", "6*", "7", "7*",
];

// const intervalNames19tet = [
//    "1", "a1", "m2", "2", "s3", "m3", "3", "a3", "4", "tt", "TT", "5", "a5", "m6", "6", "M6", "m7", "7", "d8",
// ];

const intervalNames24tet = [
    "1", "-2", "m2", "~2", "2", "-3", "m3", "~3", "3", "+3", "4", "+4", "TT", "-5", "5", "-6", "m6", "~6", "6", "-7", "m7", "~7", "7", "-8",
];
const intervalNames31tet = [
    "1", "+1", "-2", "m2", "~2", "2", "+2", "-3", "m3", "~3", "3", "+3", "-4", "4", "+4", "tt", "TT", "-5", "5", "+5", "-6", "m6", "~6", "6", "+6", "-7", "m7", "~7", "7", "+7", "-8",
];
// const intervalNames31tet = [
//    "1", "", "", "m2", "n2", "2", "S2", "s3", "m3", "n3", "3", "", "", "4", "", "", "", "", "5", "", "s6", "m6", "n6", "6", // "", "h7", "m7", "n7", "7", "", "",
// ];

const baseFrequency = 32.70 // C1
const tuning12tet = [
    1,
    2 ** (1/12),
    2 ** (2/12),
    2 ** (3/12),
    2 ** (4/12),
    2 ** (5/12),
    2 ** (6/12),
    2 ** (7/12),
    2 ** (8/12),
    2 ** (9/12),
    2 ** (10/12),
    2 ** (11/12)
];
const tuningNovemdecimal = [
    "1",
    "20/19",
    "43/38",
    "23/19",
    "24/19",
    "51/38",
    "27/19",
    "3/2",
    "61/38",
    "32/19",
    "34/19",
    "36/19"
];
const tuningUndecimal = [
    "1",
    "23/22",
    "25/22",
    "13/11",
    "14/11",
    "15/11",
    "31/22",
    "3/2",
    "35/22",
    "37/22",
    "39/22",
    "21/11"
];
const tuning11neji = [ // snowfall
    "1",
    "12/11",
    "25/22",
    "13/11",
    "14/11",
    "15/11",
    "16/11",
    "17/11",
    "18/11",
    "19/11",
    "20/11",
    "21/11"
];
const tuning16neji = [ // 16:17:18:19:20:21:23:24:25:27:29:30:32
    "1",
    "17/16",
    "9/8",
    "19/16",
    "5/4",
    "21/16",
    "11/8",
    "3/2",
    "25/16",
    "27/16",
    "29/16",
    "15/8"
];
const tuningHarmonic = [
    "1",
    "13/12",
    "7/6",
    "5/4",
    "4/3",
    "17/12",
    "3/2",
    "19/12",
    "5/3",
    "7/4",
    "11/6",
    "23/12"
];
const tuningSimple = [
    // https:// www.huygens-fokker.org/docs/intervals.html
    "1",
    "15/14", // semitone 16/15
    "9/8", // whole tone 8/7
    "6/5", // minor 3rd 7/6
    "5/4", // major 3rd
    "4/3", // p 4th
    "7/5", // tritone
    "3/2", // p 5th
    "8/5", // minor 6th
    "5/3", // major 6th
    "7/4", // harmonic 7th, minor 7th
    "15/8" // major 7th 17/9
];
const tuning19tet = [
    1,
    2 ** (1/19),
    2 ** (2/19),
    2 ** (3/19),
    2 ** (4/19),
    2 ** (5/19),
    2 ** (6/19),
    2 ** (7/19),
    2 ** (8/19),
    2 ** (9/19),
    2 ** (10/19),
    2 ** (11/19),
    2 ** (12/19),
    2 ** (13/19),
    2 ** (14/19),
    2 ** (15/19),
    2 ** (16/19),
    2 ** (17/19),
    2 ** (18/19)
];
const tuning14tet = [
    1,
    2 ** (1/14),
    2 ** (2/14),
    2 ** (3/14),
    2 ** (4/14),
    2 ** (5/14),
    2 ** (6/14),
    2 ** (7/14),
    2 ** (8/14),
    2 ** (9/14),
    2 ** (10/14),
    2 ** (11/14),
    2 ** (12/14),
    2 ** (13/14),
];
const tuning31ji = [ // 7-limit by Adriaan Fokker
    "1/1",
    "64/63",
    "135/128",
    "15/14",
    "35/32",
    "9/8",
    "8/7",
    "7/6",
    "135/112",
    "315/256",
    "5/4",
    "9/7",
    "21/16",
    "4/3",
    "175/128",
    "45/32",
    "10/7",
    "35/24",
    "3/2",
    "32/21",
    "14/9",
    "45/28",
    "105/64",
    "5/3",
    "12/7",
    "7/4",
    "16/9",
    "945/512",
    "15/8",
    "40/21",
    "63/32"
];
const tuning21Astral = [
    "1/1",
    "33/32",
    "22/21",
    "256/231",
    "8/7",
    "33/28",
    "77/64",
    "14/11",
    "21/16",
    "4/3",
    "11/8",
    "16/11",
    "3/2",
    "32/21",
    "11/7",
    "128/77",
    "56/33",
    "7/4",
    "231/128",
    "21/11",
    "64/33",
];
const tuning24tet = [
    1,
    2 ** (1/24),
    2 ** (2/24),
    2 ** (3/24),
    2 ** (4/24),
    2 ** (5/24),
    2 ** (6/24),
    2 ** (7/24),
    2 ** (8/24),
    2 ** (9/24),
    2 ** (10/24),
    2 ** (11/24),
    2 ** (12/24),
    2 ** (13/24),
    2 ** (14/24),
    2 ** (15/24),
    2 ** (16/24),
    2 ** (17/24),
    2 ** (18/24),
    2 ** (19/24),
    2 ** (20/24),
    2 ** (21/24),
    2 ** (22/24),
    2 ** (23/24),
];
const tuning24ji = [
    "1/1",
    "33/32",
    "16/15",
    "12/11",
    "9/8",
    "7/6", // 6/5, 15/13
    "6/5",
    "11/9",
    "5/4",
    "9/7", // 13/10
    "4/3",
    "11/8",
    "7/5",
    "16/11",
    "3/2",
    "14/9",
    "8/5",
    "18/11",
    "5/3",
    "7/4",
    "16/9", // 9/5
    "11/6",
    "15/8",
    "35/18" // 27/14
];

// scales - used for colors of keys and more
const scaleMajor = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const scaleMinor = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
const scaleChromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const scaleMajor19 = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
const scaleMajor14 = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
const scaleTop19 =   [0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0];
const scaleMajor24 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
const scaleMajor31 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
const scalePrimal21 = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0];

const layoutColorsFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; // next hue after every fifth

// colors
const backgroundColor = "#050314";
const outColor = "#56459A";
const darkOutColor = "#493C94";
const lightOutColor = "#E8D1FF";
const midColor = hexColors[10];
const buttonBaseColor = "#190E43A0";
document.bgColor = backgroundColor;

// modes
let scaleMode = "chromatic";
let roundKeyMode = false;
let colorMode = "major";

let tuneMode = "12tet";
let currentTuning = tuning12tet;

let currentScale = scaleChromatic.slice();
let currentKey = "C"; // wip store as numerical offset instead
let currentOctave = 0;
let labelStyle = "intervals";

// current keys
let topKeyOctave = 1; // the octave the last pressed key is in, used for recoloring the reference
let pressedButtons = new Array;
let lastPressedButtons = new Array;
let sustainedKeys = new Array;
let orderedKeys = new Array;

// permanent key grid
let gridSizeX, gridSizeY;
let keyArr = new Array;
let controlsArr = new Array;

// detect playing
let interactionMode = "play";
let menuIsOpen = false;
let ongoingTouches = new Array;

// mouse
let mouseUsed = false;
let mouseDown = false;

// bridges drawn with pencil
let penPressure = 0;
let penDragStartKey;
let penDragEndKey;
let bridgeKeyPairs = new Set();

// tonejs
let synth;
let pianoSampler;
let rhodesSampler;
let organSampler;
let harpSampler;
let synthvoices = [];

let instrument;
let currentInstrument = "piano";
let instrumentType = "sampler";
Tone.context.lookAhead = 0;

let activeKeys = {
    // structure:    h.name = {"synth"..., "dragValues"...}
};


function preload() {
    // custom array of polysynths that can have separate properties
    for (let i = 0; i < 32; i++) {
        synthvoices.push(new Tone.Synth());
        synthvoices[i].toDestination();
        synthvoices[i].set({
            "volume": -10,
            "envelope": {
                "attack": 0,
                "decay": 0,
                "sustain": 0.3,
                "release": 1,
                }
            });
        synthvoices[i].set({"oscillator": {"type": "sawtooth"}});
    }

    // default polysynth for menu activation
    synth = new Tone.PolySynth().toDestination();
    synth.set({"volume": -10,
    "envelope": {
        "attack": 0,
        "decay": 0,
        "sustain": 0.3,
        "release": 1,
        }});
    synth.set({"oscillator": {"type": "sawtooth"}});

    pianoSampler = new Tone.Sampler({
        urls: {
            A2: "piano110.mp3",
            A3: "piano220.mp3",
            A4: "piano440.mp3",
            A5: "piano880.mp3"
        },
        release: 1.5,
        baseUrl: "sounds/",
    }).toDestination();

    rhodesSampler = new Tone.Sampler({
        urls: {
            A2: "rhodes110.mp3",
            A3: "rhodes220.mp3",
            A4: "rhodes440.mp3",
            A5: "rhodes880.mp3"
        },
        release: 1,
        baseUrl: "sounds/",
    }).toDestination();

    organSampler = new Tone.Sampler({
        urls: {
            A2: "organleslie110.mp3",
            A3: "organleslie220.mp3",
            A4: "organleslie440.mp3",
            A5: "organleslie880.mp3"
        },
        release: 1,
        baseUrl: "sounds/",
    }).toDestination();

    harpSampler = new Tone.Sampler({
        urls: {
            A2: "harp110.mp3",
            A3: "harp220.mp3",
            A4: "harp440.mp3",
            A5: "harp880.mp3"
        },
        release: 2,
        baseUrl: "sounds/",
    }).toDestination();

    instrument = pianoSampler;
}

function setup() {
    canvas = createCanvas(1366, 1000);
    canvas.parent("canvasContainer");
    strokeWeight(2);

    textAlign(CENTER, CENTER);
    textSize(22);
    textFont("Satoshi");
    textStyle(BOLD);
    rectMode(RADIUS);

    makeHexagons();

    // create buttons with negative IDs
    const xOffset = 740; const yOffset = 110;
    const bWidth = gridSizeX * 3; const bHeight = gridSizeY * 1.7;
    const rows = 9;
    for (let b = 0; b < rows; b++) {
        controlsArr.push(new ButtonObj(xOffset + bWidth*0, yOffset + b*bHeight, gridSizeX, "control", -(b + 1)));
        controlsArr.push(new ButtonObj(xOffset + bWidth*1, yOffset + b*bHeight, gridSizeX, "control", -(b + 1 + rows)));
        controlsArr.push(new ButtonObj(xOffset + bWidth*2, yOffset + b*bHeight, gridSizeX, "control", -(b + 1 + rows*2)));
        controlsArr.push(new ButtonObj(xOffset + bWidth*3, yOffset + b*bHeight, gridSizeX, "control", -(b + 1 + rows*3)));
    }

    let style = document.createElement("style");
    document.head.appendChild(style);
    style.innerHTML = `
        canvas{
        -webkit-touch-callout:none;
        -webkit-user-select:none;
        -khtml-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        outline:0;
        -webkit-tap-highlight-color:rgba(255,255,255,0)}
        body{
        -webkit-touch-callout:none;
        -webkit-user-select:none;
        -khtml-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;outline:0}`;

    const el = document.body;
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchleave", handleEnd, false);
    el.addEventListener("touchmove", handleMove, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("gesturestart", function(e) {e.preventDefault();});

    // run once to show starting screen
    noLoop();
    draw();
}

function makeHexagons() {

    // empty old array first
    keyArr = [];

    // store the hexagon keys with the correct coordinates and ID
    gridSizeX = 52; gridSizeY = 52;
    let hStartX = -0.5 * gridSizeX;
    let hStartY = 0.8 * gridSizeY;
    let id = 0;

    // hexagons are less wide so they can interlock
    if (isConcertina == false) {
        gridSizeY = sqrt((3 * pow(gridSizeY, 2)) / 4);
        gridWidth = 19; // how many in a row + odd row

        // create hexagons interlocking horizontally
        for (let y = 21 * gridSizeY; y > -50; y -= 2 * gridSizeY) {
            for (let x = 0; x < 28 * gridSizeX; x += 3 * gridSizeX) {
                // even rows
                keyArr.push(new ButtonObj(x + hStartX, y + hStartY + gridSizeY, gridSizeX, "note", id++));
                // odd rows
                if (x > 25 * gridSizeX) { break;}
                keyArr.push(new ButtonObj(x + hStartX + 1.5*gridSizeX, y + hStartY, gridSizeX, "note", id++));
            }
        }

    } else {
        // concertina layout
        gridSizeX = sqrt((3 * pow(gridSizeX, 2)) / 4);
        hStartX = 0;
        hStartY = -10;
        gridWidth = 13; // how many in a column + odd column
        
        // create hexagons interlocking vertically
        for (let x = 0; x < 32 * gridSizeX; x += 2 * gridSizeX) {
            for (let y = 18 * gridSizeY; y > -50; y -= 3 * gridSizeY) {
                // even columns
                keyArr.push(new ButtonObj(x + hStartX, y + hStartY, gridSizeY, "note", id++));
                // odd columns
                if (y < 5) { break;}
                keyArr.push(new ButtonObj(x + hStartX + gridSizeX, y + hStartY - 1.5*gridSizeY, gridSizeY, "note", id++));
            }
        }
    }
}


function handleStart(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        newTouches[i].interactionType = "start";
        ongoingTouches.push(copyTouch(newTouches[i]));

        // Render buttons when left icon pressed
        if (newTouches[i].clientX > width-72 && newTouches[i].clientY < 72)
        {
            menuIsOpen = true;
        }
    }

    // get combined pen pressure from new touches
    let force = 0;
    for (let t = 0; t < newTouches.length; t++) {
        force += newTouches[t].force;
    }
    penPressure = force;

    // first tone to start audio on safari
    if (readyForSound === false) {
        instrument.triggerAttackRelease("C2", "8n");
        readyForSound = true;
    }
    drawMinDuration = 20;
    loop();
}

function handleMove(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const idx = ongoingTouchIndexById(newTouches[i].identifier);
        newTouches[i].interactionType = "move";

        if (idx >= 0) {
            // print("continuing touch " + idx);
            ongoingTouches.splice(idx, 1, copyTouch(newTouches[i])); // swap in the new touch record
        }
    }
    drawMinDuration = 20;
    loop();
}

function handleEnd(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const idx = ongoingTouchIndexById(newTouches[i].identifier);

        if (idx >= 0) {
            // print("removing touch " + idx);
            ongoingTouches.splice(idx, 1);
        }
    }
    drawMinDuration = 20;
    loop();
}

function handleCancel(evt) {
    handleEnd(evt)
}

function copyTouch(touch) {
    return {
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY, 
        force: touch.force,
        interactionType: touch.interactionType
    };
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}


function draw() {
    runKeys();

    if (drawMinDuration > 0) {
        drawMinDuration--;
    } else {
        noLoop();
        drawMinDuration = 20;
    }
}

function runKeys() {
    //between keys
    background(backgroundColor);
    let optionsBG = color(backgroundColor);

    // close menu if no keys pressed
    if (ongoingTouches.length === 0) {
        menuIsOpen = false;
    }

    if (menuIsOpen) {
        if (mouseUsed === false) {
            reactToPressedControls();
        }

        // Render all hexagons + variants below
        keyArr.forEach((h) => {
            if (h.countdown > 0) {
                h.countdown--;
            }
            h.renderKeyType(h.findKeyVariant);
        });

        // Render lines between hexagons
        renderKeyBridges();

        // Render all hexagon text
        keyArr.forEach((h) => {
            h.renderText(h.findKeyVariant);
        });

        fill(optionsBG);
        rect(975, 415, 320, 350, 20);
        optionsBG.setAlpha(80);
        background(optionsBG);

        // update control states
        updateControlStates();

        controlsArr.forEach((b) => {
            if (b.countdown > 0) {
                b.countdown--;
            }
            b.renderControlVariant();
        });

        // Render extra glow
        controlsArr.forEach((b) => {
            b.drawControlGlow();
        });

    } else {
        // menu is closed

        if (mouseUsed === false) {
            reactToPressedKeys()
        }

        // Render all hexagons + variants
        keyArr.forEach((h) => {
            if (h.countdown > 0) {
                h.countdown--;
            }
            h.renderKeyType(h.findKeyVariant);
        });

        // Render extra glow
        keyArr.forEach((g) => {
            g.drawKeyGlow();
        });

        // Render lines between hexagons
        renderKeyBridges();

        // Render all hexagon text
        keyArr.forEach((h) => {
            h.renderText(h.findKeyVariant);
        });

        // produce pitch bends from drag on keys
        bendKeys();
    }

    // visual
    renderTuningReference();
    cornerText();
}


function renderKeyBridges() {
    push();
    noStroke();
    // lines between pressedButtons
    if (penDragStartKey !== undefined && penDragEndKey !== undefined) {
        drawPointConnector(
            penDragStartKey.x, penDragStartKey.y,
            penDragEndKey.x, penDragEndKey.y,
            color(keyColorFromPalette(penDragStartKey, "dark")),
            color(keyColorFromPalette(penDragEndKey, "dark")));
    }
    if (bridgeKeyPairs.size > 0) {
        bridgeKeyPairs.forEach((hexpair) => {
            const nameArray = hexpair.split(" ");
            let hexArray = [];
            print (nameArray);

            // go through hexagons to find matching ones
            keyArr.forEach((h) => {
                if (nameArray[0] == h.name) {
                    hexArray[0] = h;
                }
                else if (nameArray[1] == h.name) {
                    hexArray[1] = h;
                }
            });

            if (hexArray[0] !== undefined && hexArray[1] !== undefined) {
                print(hexArray)

                drawPointConnector(
                    hexArray[0].x, hexArray[0].y,
                    hexArray[1].x, hexArray[1].y,
                    color(keyColorFromPalette(hexArray[0], "dark")),
                    color(keyColorFromPalette(hexArray[1], "dark")));
            }
        });
    }
    pop();
}


function reactToPressedControls() {
    // update which buttons are hovered over/ pressed
    lastPressedButtons = pressedButtons.slice();
    pressedButtons = [];

    for (let i = 0; i < ongoingTouches.length; i++) {
        const nearestHex = findNearestButton(ongoingTouches[i], controlsArr);
        if (nearestHex !== undefined) {
            pressedButtons.push(nearestHex);
        }
    }

    // find unique items in each
    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);

    if (attackedKeys.length > 0)
    {
        // see if a button is hovered closest
        controlsArr.forEach((b) => {
            if (b.name === pressedButtons[0].name) {
                controlPressed(b);
            }
        });
    }
}


function reactToPressedKeys() {
    // update which buttons are hovered over/ pressed
    lastPressedButtons = pressedButtons.slice();
    pressedButtons = [];

    for (let i = 0; i < ongoingTouches.length; i++) {
        const nearestHex = findNearestButton(ongoingTouches[i], keyArr);
        if (nearestHex !== undefined) {
            pressedButtons.push(nearestHex);
        }
    }

    // check if apple pencil or touch was used
    if (penPressure > 0.0 && menuIsOpen == false) {
        reactToPen();
    } else {
        keyboardReactToTouch();
    }

    // when last finger or pen is lifted
    if (ongoingTouches.length === 0) {

        // add new line hexes to set, then remove the live line
        if (penDragStartKey !== undefined && penDragEndKey !== undefined) {

            const startName = penDragStartKey.name;
            const endName = penDragEndKey.name;
            const newNamePair = startName + " " + endName;
            const reverseNamePair = endName + " " + startName;
            if (bridgeKeyPairs.has(newNamePair)) {
                // remove
                bridgeKeyPairs.delete(newNamePair);
                print(bridgeKeyPairs.size);
                print("Removed " + newNamePair);
            }
            else if (bridgeKeyPairs.has(reverseNamePair)) {
                // remove
                bridgeKeyPairs.delete(reverseNamePair);
                print(bridgeKeyPairs.size);
                print("Removed " + reverseNamePair);
            }
            else {
                // add
                bridgeKeyPairs.add(newNamePair);
                print(bridgeKeyPairs.size);
                print("Added " + newNamePair);
            }
        }

        penDragStartKey = undefined;
        penDragEndKey = undefined;
    }
}


function detectMouse() {
    // WIP, write new later
}


function uniqByKeepFirst(a, key) {
    // from https:// stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}


function reactToPen() {
    // clean up duplicates
    pressedButtons = uniqByKeepFirst(pressedButtons, p => p.name);

    // find unique items in each
    let attackedKeys = pressedButtons.filter((o) => lastPressedButtons.indexOf(o) === -1);
    let releasedKeys = lastPressedButtons.filter((o) => pressedButtons.indexOf(o) === -1);
    const unique = attackedKeys.concat(releasedKeys);

    if (unique.length > 0 && attackedKeys.length == 1) {

        keyArr.forEach((h) => {
            if (h.name === attackedKeys[0].name) {
                if (penDragStartKey == undefined) {
                    penDragStartKey = h;
                }
                else {
                    // there is a start hex already, update the end one instead
                    penDragEndKey = h;
                }
            }
        });
    }
}


function keyboardReactToTouch() {
    // every key stores:
    // .lastTouch.id and .lastTouch.type

    // clean up duplicates if needed
    pressedButtons = uniqByKeepFirst(pressedButtons, p => p.name);

    // find unique items in each
    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);
    const releasedKeys = lastPressedButtons.filter(p => pressedButtons.find(l => {return l.name == p.name}) === undefined);
    const sameKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) !== undefined);

    // if multipe keys are added in one frame, sort them by note height
    attackedKeys.sort((a, b) => a.name - b.name);

    // find key and press
    for (let play = 0; play < attackedKeys.length; play++) {
        const playHex = attackedKeys[play];
        keyArr.forEach((h) => {
            if (h.name === playHex.name) {
                keypressed(h);
            }
        });
        // add attacked keys in order to a list
        orderedKeys.push(playHex);

        // remove sustained keys one semitone higher or lower from the playHex
        filterSustainedKeys("inSemiToneRange", playHex);
    }

    // release audio of key
    if (interactionMode === "play") {

        for (let r = 0; r < releasedKeys.length; r++) {
            const removedHex = releasedKeys[r];

            // see if finger still used (only dragged off the hexagon)
            let fingerStillDown = false;
            ongoingTouches.forEach((o) => {
                if (o.identifier === removedHex.lastTouch.id) {
                    fingerStillDown = true;
                }
            });

            if (fingerStillDown && removedHex.octave + currentOctave > 1) {
                // push to list of sustained keys
                print("Sustaining " + removedHex.midiName, removedHex.lastTouch.id)
                sustainedKeys.push(removedHex);

            } else {
                // actually release the note
                keyArr.forEach((h) => {
                    if (h.name === removedHex.name) {
                        playKey(h, "release");
                    }
                });
                // remove from list of all ordered keys
                orderedKeys = orderedKeys.filter(o => o.name !== removedHex.name);
            }
        }
        // find sustained keys with index that doesn't match any current index, remove them
        filterSustainedKeys("touchIdGone");
    }

    if (interactionMode === "play" && instrumentType === "synth") {
        // detect movement on same keys
        for (let sameplay = 0; sameplay < sameKeys.length; sameplay++) {
            const sameHex = sameKeys[sameplay];
            keyArr.forEach((h) => {
                if (h.name === sameHex.name) {
                    dragValuesInActive(h);
                }
            });
        }
    }
}


function filterSustainedKeys (mode, compareHex) {
    if (sustainedKeys.length > 0) {

        let stillSustained = [];
        let stopSustained = [];

        if (mode === "inSemiToneRange") {
            sustainedKeys.forEach((s) => {
                if (s.midiName < compareHex.midiName + 2 &&
                    s.midiName > compareHex.midiName - 2 &&
                    s.midiName !== compareHex.midiName) {
                    // print("Was in range: " + s.midiName, compareHex.midiName)
                    stopSustained.push(s);
                } else {
                    stillSustained.push(s);
                }
            });
        } else if (mode === "touchIdGone") {
            sustainedKeys.forEach((s) => {

                let sustainFingerStillPresent = false
                ongoingTouches.forEach((o) => {
                    if (s.lastTouch.id === o.identifier) {
                        sustainFingerStillPresent = true;
                    }
                });

                if (!sustainFingerStillPresent) {
                    // print("Belonged to finger that was lifted: " + s.lastTouch.id)
                    stopSustained.push(s);
                } else {
                    stillSustained.push(s);
                }
            });
        }

        sustainedKeys = stillSustained.slice();

        // release the rest
        stopSustained.forEach((n) => {
            // print("Stopping key " + n.midiName, n.lastTouch.id)
            keyArr.forEach((h) => {
                if (h.midiName === n.midiName) {
                    playKey(h, "release");
                }
            });

            // remove from list of all ordered keys
            orderedKeys = orderedKeys.filter(o => o.name !== n.name);
        });
    }
}


function keypressed(h) {

    if (interactionMode === "key") {
        // change key with to note, or change scale
        h.countdown = cooldownFrames;
        currentKey = h.pitchName;
        pickScale(currentKey, scaleMode);
        print("Key mode, current key: " + currentKey)
    } else {
        // play the note normally
        playKey(h);
    }
}

function keySustained(h) {
    // this key is still playing.
    // could do something here, WIP.
}


function playKey(h, mode) {
    const pOctave = h.octave + currentOctave;
    const freq = eval(currentTuning[h.midiName % currentTuning.length]);
    const pPitch = baseFrequency * freq * 2 ** (pOctave -1);

    if (instrumentType !== "synth") {
        if (mode === "release") {
            instrument.triggerRelease(pPitch);
        } else {
            instrument.triggerAttack(pPitch);
        }
    } else {
        if (mode === "release") {
            if (activeKeys[h.name] !== undefined) {
                activeKeys[h.name].voice.triggerRelease();
                delete activeKeys[h.name].dragValues;
            } else {
                print("No voice to release! " + h.name);
            }
        } else {
            // play note
            for (let i = 0; i < 32; i++) {
                let containsVoice = Object.values(activeKeys).find(key => {return key.voice === synthvoices[i]});

                // in free slot
                if (containsVoice == undefined) {

                    // if the key was already active (played again, audio not over yet)
                    if (activeKeys[h.name] !== undefined) {
                        activeKeys[h.name].voice.onsilence = () => {};
                    }

                    activeKeys[h.name] = {"key": h, "voice": synthvoices[i]};

                    print("Playing " + i + "-voice")
                    activeKeys[h.name].voice.triggerAttack(pPitch);
                    activeKeys[h.name].voice.onsilence = () => {
                        // if not pressed anymore
                        // if () {
                            delete activeKeys[h.name];
                            print(i + "-voice is silent, remaining active key objects: " + Object.values(activeKeys));
                            drawMinDuration = 20;
                            loop();
                        // } else {
                        //    // but then, delete when not pressed and time over! somehow
                        //    print("Can't delete this on silence yet, still pressed")
                        // }
                    }
                    
                    break;
                }
            }
        }
        print(Object.values(activeKeys));
    }
}

function dragValuesInActive(h) {

    if (activeKeys[h.name] == undefined) {
        print("No active note to apply key drag on!")
        return;
    }

    // find touch that is in range in both X and Y
    for (let i = 0; i < ongoingTouches.length; i++) {

        const touchX = ongoingTouches[i].clientX;
        const touchY = ongoingTouches[i].clientY;
        const centerOffsetX = h.x - touchX;
        const centerOffsetY = h.y - touchY;

        // in range
        if (Math.abs(centerOffsetX) < 35 && Math.abs(centerOffsetY) < 35) {

            if (activeKeys[h.name].dragValues !== undefined) {
                // use start values to calculate drag offset
                const diffX = touchX - activeKeys[h.name].dragValues.startX;
                const diffY = touchY - activeKeys[h.name].dragValues.startY;
                activeKeys[h.name].dragValues.dragX = diffX;
                activeKeys[h.name].dragValues.dragY = diffY;
            }
            else {
                // set all to start value
                const startX = touchX;
                const startY = touchY;
                activeKeys[h.name].dragValues = {"startX": startX, "startY": startY};
            }
            print("Drag values set to: " + activeKeys[h.name].dragValues);
            return;
        }
    }
    return ("No touch found in range!");
}

function bendKeys() {
    Object.values(activeKeys).forEach(a => {

        const keyHasBeenDragged = (a.dragValues !== undefined && a.dragValues.dragX !== undefined);
        if (keyHasBeenDragged) {
            const maxDetuneCents = 1200 / currentTuning.length;
            const detuneCents = dragDistanceMap(a.key.x, a.dragValues.startX, a.dragValues.dragX, 5, 40) * maxDetuneCents;
            print("detuning by: " + detuneCents)
            a.voice.set({ "detune": detuneCents });

            if (detuneCents !== 0) {
                push();
                fill('#FFFFFFC0');
                noStroke();
                ellipse(a.dragValues.startX + a.dragValues.dragX, a.key.y - 50, (Math.abs(detuneCents) / 4) + 6);
                ellipse(a.dragValues.startX, a.key.y - 50, 2);
                ellipse(a.key.x + 40 * Math.sign(detuneCents), a.key.y - 50, 2);
                // text(detuneCents.toFixed(1), a.key.x, a.key.y -60);
                pop();
            }
        }
    });
}


function controlPressed(b) {
    instrument.releaseAll();
    const rows = 9;

    // same order as menuButtons
    if (-b.name <= rows) {
        switch (-b.name) {
            case 1:
                print("Change key");
                if (interactionMode === "key") {
                    interactionMode = "play";
                } else {
                    interactionMode = "key";
                }
                break;
            case 2:
                print("Changed scale");
    
                if (scaleMode === "major") {
                    scaleMode = "minor";
                } else if (scaleMode === "minor") {
                    scaleMode = "chromatic";
                } else if (scaleMode === "chromatic") {
                    scaleMode = "major";
                } else {
                    scaleMode = "chromatic";
                }
                pickScale(currentKey, scaleMode);
                break;
            case 3:
                print("Changed octave");
                currentOctave++;
                if (currentOctave == 3) {currentOctave = 0;}
                break;
            case 4:
                print("Changed label style");
                if (labelStyle === "notes") {labelStyle = "intervals";}
                else {labelStyle = "notes";}
                break;
            case 5:
                print("Changed color theme!");
                if (colorMode === "fifths") {colorMode = "major";}
                else {colorMode = "fifths";}
                // {colorMode = "chromatic";}
                break;
            case 6:
                print("Switched to different midi to grid XY layout");
                gridXYswapped = !gridXYswapped;
                if (gridXYswapped) {
                    isConcertina = false;
                }
                calculateNewMidiGrid(gridIncrement_D, gridIncrement_V);
                break;
            case 7:
                print("switched shape of keys!");
                roundKeyMode = !roundKeyMode;
                break;
            case 8:
                print("turned semitones to whole tones!");
                isConcertina = !isConcertina;
                if (isConcertina) {
                    gridXYswapped = false;
                }
                makeHexagons();
                calculateNewMidiGrid(gridIncrement_D, gridIncrement_V);
                break;
            case 9:
                break;
        }
    } else if (-b.name <= rows*2) {
        switch (-b.name - rows) {
            case 1:
                print("Switched to 12 tone equal temperament");
                tuneMode = "12tet";
                currentTuning = tuning12tet;
                break;
            case 2:
                print("Switched to simple 12 tone tuning");
                tuneMode = "simple";
                currentTuning = tuningSimple;
                break;
            case 3:
                print("Switched to 12 tone Harmonic series segment");
                tuneMode = "harmonic";
                currentTuning = tuningHarmonic;
                break;
            case 4:
                print("Switched to 12 tone Novemdecimal");
                tuneMode = "novemdecimal";
                currentTuning = tuningNovemdecimal;
                break;
            case 5:
                print("Switched to 12 tone 16-NEJI");
                tuneMode = "16neji";
                currentTuning = tuning16neji;
                break;
            case 6:
                print("Switched to 12 tone Undecimal");
                tuneMode = "undecimal";
                currentTuning = tuningUndecimal;
                break;
            case 7:
                print("Switched to 12 tone 11-NEJI");
                tuneMode = "11neji";
                currentTuning = tuning11neji;
                break;
        }
        currentOctave = 0;
        calculateNewMidiGrid(4, 7);
        playTestChord([4,7]);

    } else if (-b.name <= rows*3) {
        switch (-b.name - rows*2) {
            case 1:
                tuneMode = "19tet";
                currentTuning = tuning19tet;
                currentOctave = 0;
                calculateNewMidiGrid(6, 11);
                playTestChord([6, 11]);
                break;
            case 2:
                tuneMode = "31ji";
                currentTuning = tuning31ji;
                currentOctave = 1;
                calculateNewMidiGrid(5, 9);
                playTestChord([10, 18]);
                break;
            case 3:
                tuneMode = "21astral";
                currentTuning = tuning21Astral;
                currentOctave = 1;
                calculateNewMidiGrid(5, 9);
                playTestChord([6, 12, 18]);
                break;
            case 4:
                tuneMode = "24tet";
                currentTuning = tuning24tet;
                currentOctave = 1;
                calculateNewMidiGrid(4, 7);
                playTestChord([8, 14]);
                break;
            case 5: 
                tuneMode = "24ji";
                currentTuning = tuning24ji;
                currentOctave = 1;
                calculateNewMidiGrid(4, 7);
                playTestChord([8, 14]);
                break;
            case 6:
                tuneMode = "14tet";
                currentTuning = tuning14tet;
                currentOctave = 0;
                calculateNewMidiGrid(4, 5);
                playTestChord([4, 8]);
        }
    } else if (-b.name <= rows*4) {
        switch (-b.name - rows*3) {
            case 1:
                print("Switched to piano!");
                currentInstrument = "piano";
                instrument = pianoSampler;
                instrumentType = "sampler";
                break;
            case 2:
                print("Switched to Rhodes!");
                currentInstrument = "rhodes";
                instrument = rhodesSampler;
                instrumentType = "sampler";
                break;
            case 3:
                print("Switched to organ!");
                currentInstrument = "organ";
                instrument = organSampler;
                instrumentType = "sampler";
                break;
            case 4:
                print("Switched to harp!");
                currentInstrument = "harp";
                instrument = harpSampler;
                instrumentType = "sampler";
                break;
            case 5:
                print("Switched to saw wave!");
                currentInstrument = "sawtooth";
                synth.set({"oscillator": {"type": "sawtooth"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "sawtooth"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
            case 6:
                print("Switched to square wave!");
                currentInstrument = "square";
                synth.set({"oscillator": {"type": "square"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "square"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
            case 7:
                print("Switched to triangle wave!");
                currentInstrument = "triangle";
                synth.set({"oscillator": {"type": "triangle"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "triangle"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
            case 8:
                print("Switched to sine wave!");
                currentInstrument = "sine";
                synth.set({"oscillator": {"type": "sine"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "sine"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
        }
        instrument.triggerAttackRelease("C3", "16n");
        instrument.triggerAttackRelease("C4", "16n");
    }
}

function playTestChord(intervals) {
    // play root
    const root = baseFrequency * eval(currentTuning[0]) * 2 ** 2;
    instrument.triggerAttackRelease(root, "16n");

    intervals.forEach(i => {
        const freq = baseFrequency * eval(currentTuning[i]) * 2 ** 3;
        instrument.triggerAttackRelease(freq, "16n");
    });
}

function calculateNewMidiGrid(small, big) {

    if (isConcertina) {
        gridBaseMidi = Math.floor(currentTuning.length * 1.5);
    } else {
        gridBaseMidi = currentTuning.length * 2;
    }

    // save for checking elsewhere
    gridIncrement_H = 2 * small - big; // should be semitone
    gridIncrement_D = small;
    gridIncrement_V = big;

    // actual values take into account extra grid modes
    if (gridXYswapped) {
        newIncrement_H = big;
        newIncrement_D = small;
        newIncrement_V = 2 * small - big;
    } else if (isConcertina) {
        newIncrement_H = currentTuning.length; // octave
        newIncrement_D = big;
        newIncrement_V = (2 * big) % currentTuning.length;
    } else {
        newIncrement_H = 2 * small - big;
        newIncrement_D = small;
        newIncrement_V = big;
    }

        keyArr.forEach((h) => {
            h.setMidiFromGrid(gridBaseMidi, gridWidth, newIncrement_H, newIncrement_D, newIncrement_V);
        });
}


function pickScale(pitch, mode) {
    // start from note
    const offset = noteNames.indexOf(pitch);

    // WIP: make this compatible with other octave sizes
    if (mode === "chromatic" || currentTuning.length != 12) {
        currentScale = new Array(currentTuning.length).fill(1); // all notes are on
        scaleMode = "chromatic"; // in case it isn't already!
    } else {
        for (let i = 0; i < 12; i++) {
            if (mode === "major") {
                currentScale[(i + offset) % 12] = scaleMajor[i];
            } else if (mode === "minor") {
                currentScale[(i + offset) % 12] = scaleMinor[i];
            }
        }
    }
}


function keyColorFromPalette(h, style) {
    let palette = new Array;
    let darkPalette = new Array;
    let darkerPalette = new Array;
    let lightPalette = new Array;

    if (colorMode !== "chromatic") {

        // table of colors
        const isOffsetOctave = ((h.octave + currentOctave) % 2 == 0);
        const colorIds = generateKeyColorTable(isOffsetOctave);

        for (let i = 0; i < colorIds.length; i++) {
            let id = colorIds[i];

            palette.push(hexColors[id]);
            darkPalette.push(darkHexColors[id]);
            darkerPalette.push(darkerHexColors[id]);
            lightPalette.push(lightHexColors[id]);
        }
    } else {
        palette = hexColors.slice();
        darkPalette = darkHexColors.slice();
        darkerPalette = darkerHexColors.slice();
        lightPalette = lightHexColors.slice();
    }

    let offColor = outColor;

    if (style === "dark") {
        palette = darkPalette;
        offColor = darkOutColor;
    }
    else if (style === "light") {
        palette = lightPalette;
        offColor = lightOutColor;
    }
    else if (style === "darker") {
        palette = darkerPalette;
        offColor = lerpColor(color(backgroundColor), color(darkOutColor), 0.15);
    }

    // color according to on/off state in current scale
    let index = 0;
    let offset = 0;

    if (currentTuning.length !== 12) {
        offset = noteNames.indexOf(currentKey);
        const shiftedColor = palette[(h.midiName - offset) % currentTuning.length];
        return shiftedColor;
    } else {
        index = noteNames.indexOf(h.pitchName);
        offset = noteNames.indexOf(currentKey);
        if (currentScale[index] == 1) {
            const shiftedColor = palette[(h.midiName - offset) % 12];
            return shiftedColor;
        } else {
            return offColor;
        }
    }
}


function drawPointConnector(x1, y1, x2, y2, c1, c2) {
    const steps = 20;

    for (let gridDistanceY = 0; gridDistanceY < steps + 1; gridDistanceY++) {
        const mixColor = lerpColor(c1, c2, gridDistanceY / steps);
        const mixX = lerp(x1, x2, gridDistanceY / steps);
        const mixY = lerp(y1, y2, gridDistanceY / steps);

        const size = map(gridDistanceY, 0, steps, 6, 14);
        const alpha = map(gridDistanceY, 0, steps, 60, 255);

        mixColor.setAlpha(alpha);
        fill(mixColor);
        ellipse(mixX, mixY, size);
    }
}

function generateKeyColorTable(isOddOctave) {

    const octaveLength = currentTuning.length;

    // just use fifth layout colors
    if (octaveLength == 12 && colorMode === "fifths") {
        return layoutColorsFifths;
    }

    // base color scheme on scale
    const oddOctave = {highlight:2, medium:6, default:7};
    const evenOctave = {highlight:1, medium:11, default:10};
    const colorScheme = (isOddOctave) ? evenOctave : oddOctave;

    let colorIdTable;
    let tTable; // may be filled for additional colors

    if (octaveLength == 12) {colorIdTable = scaleMajor.slice();}
    else if (octaveLength == 19) {colorIdTable = scaleMajor19.slice(); tTable = scaleTop19.slice();}
    else if (octaveLength == 14) {colorIdTable = scaleMajor14.slice();}
    else if (octaveLength == 24) {colorIdTable = scaleMajor24.slice();}
    else if (octaveLength == 31) {colorIdTable = scaleMajor31.slice();}
    else if (currentTuning == tuning21Astral) {colorIdTable = scalePrimal21.slice();}
    else {colorIdTable = new Array(octaveLength).fill(0);}

    for (let c = 0; c < colorIdTable.length; c++) {

        let color = colorScheme.default;

        if (colorIdTable[c] == 1) {
            color = colorScheme.highlight;
        } else if (tTable !== undefined && tTable[c] == 1) {
            color = colorScheme.medium;
        }
        colorIdTable[c] = color;
    }
    return colorIdTable;
}


function renderTuningReference() {
    push();

    const cornerOffset = 40;
    translate(width-cornerOffset, cornerOffset);
    scale(1.1)

    // round base
    noStroke();
    baseColor = color(backgroundColor);
    baseColor.setAlpha(140);
    fill(baseColor);
    ellipse(0, 0, 46);
    ellipse(0, 0, 64);
    ellipse(0, 0, 66);


    // 12tet lines
    strokeWeight(1.2);
    for (let t = 0; t < 12; t++) {
        const colorId = (scaleMajor[t] == 1) ? 2 : 7;
        const lineColor = color(darkHexColors[colorId]);
        lineColor.setAlpha((orderedKeys.length > 0) ? 60 : 110);
        stroke(lineColor);

        const angle = map(t, 0, 12, 0, TWO_PI) - HALF_PI;
        const start = {x: cos(angle) * 6, y: sin(angle) * 6};
        const end = {x: cos(angle) * 28, y: sin(angle) * 28};
        line(start.x, start.y, end.x, end.y);
    }


    // outer lines
    const colorIdTable = generateKeyColorTable(false);
    const offsetColorIdTable = generateKeyColorTable(true);
    const octaveLength = currentTuning.length;
    const offset = noteNames.indexOf(currentKey);

    for (let i = 0; i < octaveLength; i++) {

        if (pressedButtons.length > 0) {
            topKeyOctave = pressedButtons[pressedButtons.length-1].octave;
        }
        const colorTable = ((topKeyOctave + currentOctave) % 2 == 1) ? colorIdTable[i] : offsetColorIdTable[i];
        const freq = eval(currentTuning[i]);
        const cents = scaleFreqToCents(freq);
        const angle = map(cents, 0, 1200, 0, TWO_PI) - HALF_PI;
        const start = {x: cos(angle) * 20, y: sin(angle) * 20};
        const end = {x: cos(angle) * 28, y: sin(angle) * 28};
        let lineColor;

        lineColor = color(darkHexColors[colorTable]);
        lineColor.setAlpha((orderedKeys.length > 0) ? 100 : 210);
        strokeWeight(2);
        stroke(lineColor);
        line(start.x, start.y, end.x, end.y);
    }

    // draw the lines between the segments in order of playing
    let lastKeyAngle;
    let lastKeyColor;
    let lastKeyOctave;
    strokeWeight(1);

    orderedKeys.forEach((o) => {

        const index = ((o.midiName-offset) % octaveLength);
        const freq = eval(currentTuning[index]);
        const cents = scaleFreqToCents(freq);
        const keyAngle = map(cents, 0, 1200, 0, TWO_PI) - HALF_PI;
        const keyOctave = map(o.octave, 0, 6, 18, 28, true);
        const colorTable = ((o.octave + currentOctave) % 2 == 1) ? colorIdTable[index] : offsetColorIdTable[index];
        const keyColor = color(lightHexColors[colorTable]);

        const now = {x: cos(keyAngle) * keyOctave, y: sin(keyAngle) * keyOctave};

        // dot
        noStroke();
        fill(keyColor);
        ellipse(now.x, now.y, 3);

        keyColor.setAlpha(50);
        fill(keyColor);
        ellipse(now.x, now.y, 6);

        keyColor.setAlpha(20);
        fill(keyColor);
        ellipse(now.x, now.y, 10);
        keyColor.setAlpha(210);

        // line between previous and this key
        if (lastKeyAngle !== undefined) {

            // line between the two angles
            const last = {x: cos(lastKeyAngle) * lastKeyOctave, y: sin(lastKeyAngle) * lastKeyOctave};
            const halfway = {x: (last.x+now.x)/2, y: (last.y+now.y)/2};

            keyColor.setAlpha(210);

            stroke(lastKeyColor);
            line(last.x, last.y, halfway.x, halfway.y);

            stroke(keyColor);
            line(halfway.x, halfway.y, now.x, now.y);
        }

        lastKeyAngle = keyAngle;
        lastKeyColor = keyColor;
        lastKeyOctave = keyOctave;
    });

    pop();
}

function updateControlStates() {
    menuButtons = [
        {name:"Move Key " + currentKey, onCondition:(interactionMode === "key")},
        {name:capitalize(scaleMode), onCondition:undefined},
        {name:"Octave "+ currentOctave, onCondition:undefined},
        {name:"Note Labels", onCondition:(labelStyle === "notes")},
        {name:"Rainbow", onCondition:(colorMode === "fifths")},
        {name:"Swap X/Y", onCondition:gridXYswapped},
        {name:"Round Keys", onCondition:roundKeyMode},
        {name:"Concertina", onCondition:isConcertina},
        {name:"", onCondition:undefined},

        {name:"EDO 12", onCondition:(tuneMode === "12tet")},
        {name:"JI 12", onCondition:(tuneMode === "simple")},
        {name:"Mode 12", onCondition:(tuneMode === "harmonic")},
        {name:"/19 Novem", onCondition:(tuneMode === "novemdecimal")},
        {name:"/16 NEJI", onCondition:(tuneMode === "16neji")},
        {name:"/11 Undec", onCondition:(tuneMode === "undecimal")},
        {name:"/11 Snow", onCondition:(tuneMode === "11neji")},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},

        {name:"EDO 19", onCondition:(tuneMode === "19tet")},
        {name:"JI 31", onCondition:(tuneMode === "31ji")},
        {name:"Astral 21", onCondition:(tuneMode === "21astral")},
        {name:"EDO 24", onCondition:(tuneMode === "24tet")},
        {name:"JI 24", onCondition:(tuneMode === "24ji")},
        {name:"EDO 14", onCondition:(tuneMode === "14tet")},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},

        {name:"Piano", onCondition:(currentInstrument === "piano")},
        {name:"Rhodes", onCondition:(currentInstrument === "rhodes")},
        {name:"Organ", onCondition:(currentInstrument === "organ")},
        {name:"Harp", onCondition:(currentInstrument === "harp")},
        {name:"Sawtooth", onCondition:(currentInstrument === "sawtooth")},
        {name:"Square", onCondition:(currentInstrument === "square")},
        {name:"Triangle", onCondition:(currentInstrument === "triangle")},
        {name:"Sine", onCondition:(currentInstrument === "sine")},
        {name:"", onCondition:undefined}
    ];
}

class ButtonObj {
    constructor(x, y, r, type, name) {

        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.name = name;
        this.countdown = 0;

        this.setMidiFromGrid(gridBaseMidi, gridWidth, gridIncrement_H, gridIncrement_D, gridIncrement_V);
    }

    setMidiFromGrid(base, width, h, d, v) {
        this.midiName =
            base +
            floor((this.name % width) / 2) * h +
            ((this.name % width) % 2) * d +
            floor(this.name / width) * v;
        if (currentTuning.length !== 12) {
            this.pitchName = this.midiName % currentTuning.length + 1;
        } else {
            this.pitchName = noteNames[this.midiName % 12];
        }
        this.octave = floor(this.midiName / currentTuning.length) - 2;
    }

    renderKeyType(state, strength) {
        push();
        noStroke();

        const highlightColor = color(keyColorFromPalette(this, "light"));
        const innerColor = color(keyColorFromPalette(this, "dark"));
        const outerColor = color(keyColorFromPalette(this, "darker"));

        const brighterColor = lerpColor(color("#FFFFFF"), highlightColor, 0.9);
        const midColor = lerpColor(innerColor, outerColor, 0.3);
        const darkerColor = lerpColor(innerColor, outerColor, 0.5);

        // note states
        switch (state) {
            case "klicked":
                keyShape(this.x, this.y, this.r * 1.7, innerColor);
                gradientCircle(
                    color("#FFFFFF80"), 0,
                    color("#FFFFFF00"), this.r * 1.59,
                    this.x, this.y, 12);
                break;
            case "hover":
                keyShape(this.x, this.y, this.r * 1.7, midColor);
                gradientCircle(
                    highlightColor, 0,
                    midColor, this.r * 1.45,
                    this.x, this.y, 18);
                break;
            case "sustained":
                keyShape(this.x, this.y, this.r * 1.7, darkerColor);
                gradientCircle(
                    highlightColor, 0,
                    darkerColor, this.r * 1.45,
                    this.x, this.y, 18);
                break;
            case "idle":
                keyShape(this.x, this.y, this.r * 1.7, outerColor);
                gradientCircle(
                    lerpColor(innerColor, outerColor, 0.2), 0,
                    outerColor, this.r * 1.45,
                    this.x, this.y, 18);
                break;
            case "differentOctave":
                keyShape(this.x, this.y, this.r * 1.7, lerpColor(innerColor, outerColor, 0.90));
                gradientCircle(
                    lerpColor(innerColor, outerColor, 0), 0,
                    lerpColor(innerColor, outerColor, 0.90), this.r * 1.45,
                    this.x, this.y, 18);
                break;
            case "selected":
                keyShape(this.x, this.y, this.r * 1.7, "white");
                gradientCircle(
                    innerColor, 0,
                    color("white"), this.r * 1.59,
                    this.x, this.y, 12);
                break;
            case "glow":
                gradientCircle(
                    color(keyColorFromPalette(this, "light") + strength), this.r * 0.5,
                    color(keyColorFromPalette(this, "light") + strength), this.r * 2.6,
                    this.x, this.y, 14);
                break;
        }
        pop();
    }

    renderControlType(state) {
        push();
        strokeWeight(2);
        stroke("black");

        // button states
        switch (state) {
            case "hidden":
                fill("#17074450");
                controlShape(this.x, this.y, this.r * 1.7);
                break;
            case "klicked":
                fill(buttonBaseColor);
                controlShape(this.x, this.y, this.r * 1.7);
                fill(midColor);
                noStroke();
                controlShape(this.x, this.y, this.r * 1.5);
                break;
            case "hover":
                fill(outColor);
                controlShape(this.x, this.y, this.r * 1.7);
                noStroke();
                fill("#00000040");
                controlShape(this.x, this.y, this.r * 1.7);
                controlShape(this.x, this.y, this.r * 1.57);
                break;
            case "idle":
                // more states than on/off
                fill("#170744");
                controlShape(this.x, this.y, this.r * 1.7);
                fill("#3E1C8790");
                noStroke();
                triangle(this.x + 70, this.y, this.x + 55, this.y + 12, this.x + 55, this.y - 12);
                triangle(this.x - 70, this.y, this.x - 55, this.y + 12, this.x - 55, this.y - 12);
                break;
            case "active":
                fill("#3E1C87");
                controlShape(this.x, this.y, this.r * 1.7);
                break;
            case "inactive":
                fill("#170744");
                controlShape(this.x, this.y, this.r * 1.7);
                break;
            case "activehover":
                fill(darkHexColors[10]);
                controlShape(this.x, this.y, this.r * 1.7);
                noStroke();
                fill("#ffffff30");
                controlShape(this.x, this.y, this.r * 1.57);
                controlShape(this.x, this.y, this.r * 1.4);
                break;
            case "glow":
                fill("#00000030");
                noStroke();
                controlShape(this.x, this.y, this.r * 1.9);
                break;
            case "secondaryOn":
                gradientCircle(
                    color("#361976"), 0,
                    color("#000000"), this.r * 1.30,
                    this.x, this.y, 12);
                noFill();
                stroke(midColor);
                controlShape(this.x, this.y, this.r * 1.7);
            break;
        }
        this.renderControlText();
        pop();
    }

    renderText(state) {
        // text on note
        push();
        textSize(22);

        // shadow
        strokeWeight(4);
        stroke("#00000050");
        strokeJoin(ROUND);
        fill("#00000050");
        this.renderKeyText();

        noStroke();
        if (state === "hover" || state === "sustained") {
            fill("white");
        } else if (state === "differentOctave"){
            const base = color(keyColorFromPalette(this, "light"));
            const bright = color("#FFFFFF");
            fill(lerpColor(base, bright, 0.5));
        } else if (this.pitchName === currentKey || this.pitchName === 1) { 
            fill(rootColor); 
        } else {
            fill(keyColorFromPalette(this, "light"));

            const offset = noteNames.indexOf(this.pitchName);
            if (currentScale[offset] == 0) {
                fill(keyColorFromPalette(this));
            }
        }

        this.renderKeyText();
        pop();
    }

    get findKeyVariant() {
        if (menuIsOpen) {return "idle";};
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName && t.countdown > 0);
        const inHoverHexes = pressedButtons.find(t => t.midiName === this.midiName);
        const inSustainedKeys = sustainedKeys.find(t => t.midiName === this.midiName);

        // also highlight same note in different octave.
        // in concertina layout, highlight the semitone instead.
        let differentOctaveHexes;
        if (isConcertina) {
            differentOctaveHexes = pressedButtons.find(t => Math.abs(t.midiName - this.midiName) === 1);
        } else {
            differentOctaveHexes = pressedButtons.find(t => t.midiName % currentTuning.length === this.midiName % currentTuning.length);
        }

        if (inKlickedHexes !== undefined) {
            return "klicked";
        } else if (inHoverHexes !== undefined) {
            return "hover";
        } else if (this.pitchName === currentKey && interactionMode === "key") {
            return "selected";
        } else if (inSustainedKeys !== undefined) {
            return "sustained";
        } else if (differentOctaveHexes !== undefined) {
            return "differentOctave";
        } else {
            return "idle";
        }
    }

    renderControlVariant() {
        const inHoverButtons = pressedButtons.find(t => t.name === this.name);

        if (menuButtons[-this.name - 1] !== undefined && menuButtons[-this.name - 1].name === "") {
            this.renderControlType("hidden");
        } else if (this.countdown > 0) {
            this.renderControlType("klicked");
        } else if (this.isControlOn && inHoverButtons !== undefined) {
            this.renderControlType("activehover");
        } else if (this.isControlOn) {
            this.renderControlType("active");
        } else if (this.isControlOn === false) {
            this.renderControlType("inactive");
        } else if (inHoverButtons !== undefined) {
            this.renderControlType("hover");
        } else if (this.secondaryOn){
            this.renderControlType("secondaryOn");
        } else {
            this.renderControlType("idle");
        }
    }


    drawKeyGlow() {
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName);
        if (inKlickedHexes !== undefined ) {
            this.renderKeyType("glow", "06");
            return;
        }

        const inSustainedKeys = sustainedKeys.find(t => t.midiName === this.midiName);
        if (inSustainedKeys !== undefined) {
            this.renderKeyType("glow", "03");
            return;
        }
    }

    drawControlGlow() {
        if (this.countdown > 0) {
            this.renderControlType("glow");
        }
    }


    get distanceToMouse() {
        return dist(mouseX, mouseY, this.x, this.y);
    }

    distanceToTouch(touch) {
        if (touch !== undefined) {
             return dist(touch.clientX, touch.clientY, this.x, this.y);
        }
    }

    get isControlOn() {
        for (let i = 0; i < menuButtons.length; i++) {
            if (i == -this.name-1) {
                return menuButtons[i].onCondition;
            }
        }
        // if checking number that's too big
        return undefined;
    }


    renderControlText() {
        push();
        noStroke();
        const stateColor = (this.isControlOn) ? "#D5B9F2" : "#AA6EF5";
        fill(stateColor);

        textSize(19);
        text(menuButtons[-this.name-1].name, this.x, this.y);
        pop();
    }

    renderKeyText() {
        const octaveLength = currentTuning.length;
        let keyText = this.name;
        if (octaveLength == 12) {
            if (labelStyle === "notes")
            {
                if (this.pitchName == currentKey) {
                    keyText = this.pitchName + (this.octave + currentOctave);
                }
                else {
                    keyText = this.pitchName;
                }
            }
            else if (labelStyle === "midi") {
                keyText = this.midiName + octaveLength * currentOctave;
            }
            else if (labelStyle === "intervals") {
                const offset = noteNames.indexOf(currentKey);
                const intervalName = intervalNames[(this.midiName - offset) % 12];
                keyText = intervalName;
            }
        } else {
            if (labelStyle === "intervals") {
                const offset = noteNames.indexOf(currentKey);
                let intervalNamesTable;
                if (octaveLength == 19) {intervalNamesTable = intervalNames19tet.slice();}
                else if (octaveLength == 14) {intervalNamesTable = intervalNames14tet.slice();}
                else if (octaveLength == 24) {intervalNamesTable = intervalNames24tet.slice();}
                else if (octaveLength == 31) {intervalNamesTable = intervalNames31tet.slice();}
                else {intervalNamesTable = new Array(octaveLength).fill((this.midiName - offset) % octaveLength + 1);}
                
                const intervalName = intervalNamesTable[(this.midiName - offset) % octaveLength];
                keyText = intervalName;
            } else {
                keyText = this.pitchName - 1;
            }
        }
        text(keyText, this.x, this.y);

        // extra text above
        push();
        textSize(11);
        fill(keyColorFromPalette(this, "dark"));

        if (currentTuning != tuning12tet &&
                currentTuning != tuning19tet &&
                currentTuning != tuning24tet &&
                currentTuning != tuning14tet) {
            const offset = noteNames.indexOf(currentKey);
            const intervalName = currentTuning[(this.midiName - offset) % octaveLength];

            let topText = intervalName;
            if (topText == 1) {
                topText = "";
            }
            text(topText, this.x, this.y - 25);
        }
        pop();
    }
}


function dragDistanceMap(center, start, drag, min, max) {
    if (drag > min) {
        return map(start + drag, start + min, center + max, 0, 1, true);
    } else if (-drag > min) {
        return map(start + drag, start - min, center - max, 0, -1, true);
    }
    else {
        return 0;
    }
}


function findNearestButton(touch, arr) {

    // minimum distance is a weird way to measure which button is hit
    // WIP when the menu isn't open, do a different check instead that compares which hex is closest
    const minDistance = (isConcertina) ? gridSizeY * 0.85 : gridSizeX * 0.85;
    let closestButton;

    if (!mouseUsed && touch !== undefined) {
        arr.forEach((h) => {
            if (h.distanceToTouch(touch) < minDistance) {closestButton = h;}
        });
    }
    else {
        arr.forEach((h) => {
            if (h.distanceToMouse < minDistance) {closestButton = h;}
        });
    }

    if (closestButton !== undefined) {
        // print("Found " + closestButton.distanceToTouch(touch));
        closestButton.lastTouch = {id:touch.identifier, type:touch.interactionType};
        // print(closestButton.lastTouch);
        return closestButton;
    }
    // print("No hexagon found in reach!");

}


function keyShape(x, y, r, lineColorolor) {
    push()
    fill(lineColorolor)
    if (roundKeyMode === true) {
        ellipse(x, y, r * 0.99);
    } else {
        strokeWeight(r * 0.3);
        stroke(lineColorolor);
        strokeJoin(ROUND)
        if (isConcertina) hexagon(x, y, r * 0.38, 1/2 * PI);
        else hexagon(x, y, r * 0.38, 0);
    }
    pop()
}

function controlShape(x, y, r) {
    rect(x, y, r * 0.85, r * 0.4, r * 0.1);
}

function hexagon(x, y, r, angle) {
    beginShape();
    for (let a = 0; a < 2 * PI; a += (2 * PI) / 6) {
        let x2 = cos(a + angle) * r;
        let y2 = sin(a + angle) * r;
        vertex(x + x2, y + y2);
    }
    endShape(CLOSE);
}

// function hexagonTop(x, y, r) {
//    beginShape();
//    for (let a = 1 * PI; a < 2 * PI; a += (2 * PI) / 6) {
//        let x2 = cos(a) * r;
//        let y2 = sin(a) * r;
//        vertex(x + x2, y + y2);
//    }
//    endShape();
// }

function gradientCircle(cInner, sInner, cOuter, sOuter, x, y, steps) {
    push();
    noStroke();
    for (let gridDistanceY = 0; gridDistanceY < steps; gridDistanceY++) {
        const mixColor = lerpColor(cOuter, cInner, gridDistanceY / (steps*1.5));
        const mixSize = lerp(sOuter, sInner, gridDistanceY / steps);
        fill(mixColor);
        ellipse(x, y, mixSize*1);
    }
    pop();
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function cornerText() {

    push();

    textFont("Switzer");
    textSize(15);
    textStyle(BOLD);

    let playText = currentKey + (currentOctave) + "–" + capitalize(tuneMode) + " ";
    if (instrumentType == "synth") {
        playText += Object.values(activeKeys).length;
    }

    playText += "  ";

    for (let o = 0; o < orderedKeys.length; o++) {
        const keyName = orderedKeys[o].pitchName + ":" +orderedKeys[o].midiName;
        playText += "  " + keyName + " ";
    }

    const xOffset = 15;
    const yOffset = height - 18;

    textAlign(LEFT, CENTER);

    stroke(backgroundColor);
    strokeJoin(ROUND);
    strokeWeight(8);
    text(playText, xOffset, yOffset);

    noStroke();
    const textColor = lerpColor(color("#5027A9"), color("#FFFFFF"), drawMinDuration/20)
    fill(textColor);
    text(playText, xOffset, yOffset);

    pop();
}

function scaleFreqToCents(freq) {
    return Math.log2(freq) * 1200;
}

function mousePressed() {
    if (ongoingTouches.length <= 0) {
        mouseUsed = true;
        mouseDown = true;
        readyForSound = true;
        detectMouse();
    }
    else {
        return false;
    }
}

function mouseDragged() {
    // there was no touch, an actual mouse was dragged;
    if (ongoingTouches.length <= 0) {
        mouseUsed = true;
        mouseDown = true;
        readyForSound = true;
        detectMouse();
    }
    else {
        return false;
    }
}

function mouseReleased() {
    if (ongoingTouches.length <= 0) {
        mouseDown = false;
    }
    else {
        return false;
    }
}