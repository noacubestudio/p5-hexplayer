let canvas;
let cooldownFrames = 3; // this animation time also blocks double taps
let readyForSound = false; // only play sound when ready
let drawMinDuration = 20; // 

//for constructing the hexagons
let gridBaseMidi = 24;
let gridWidth;
let gridIncrement_H = 1;
let gridIncrement_D = 4;
let gridIncrement_V = 7;
let noteLayout = "concertina";

let theme = new Object; //Filled in setup() with p5 colors

// list of all menu buttons, gets updated with visual state and name
let menuButtons = new Array;

const octaveSymbols = [
    "⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹",];
const noteNames = [
    "C","C#","D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const intervalNames = [
    "1", "m2", "2", "m3", "3", "4", "TT", "5", "m6", "6", "m7", "7",];
const intervalNames19tet = [
    "1", "1a", "m2", "2", "2a", "m3", "3", "3›‹4", "4", "4a", "m5", "5", "5a", "m6", "6", "6a", "m7", "7", "7›‹1",];
const intervalNames14tet = [
    "1", "1*", "2", "2*", "3", "3*", "4", "4*", "5", "5*", "6", "6*", "7", "7*",];
const intervalNames24tet = [
    "1", "-2", "m2", "~2", "2", "-3", "m3", "~3", "3", "+3", "4", "+4", "TT", "-5", "5", "-6", "m6", "~6", "6", "-7", "m7", "~7", "7", "-8",];
const intervalNames31tet = [
    "1", "+1", "-2", "m2", "~2", "2", "+2", "-3", "m3", "~3", "3", "+3", "-4", "4", "+4", "tt", "TT", "-5", "5", "+5", "-6", "m6", "~6", "6", "+6", "-7", "m7", "~7", "7", "+7", "-8",];

// scales - used for colors of keys and more
const scaleMajor12 = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const scaleMajor19 = [1, 0, 0, 1, 0, 0, 1, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1];
const scaleMajor14 = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
const scaleMajor24 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
const scaleMajor31 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
const scalePrimal21 = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0];

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
    2 ** (11/12)];
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
    "36/19"];
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
    "21/11"];
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
    "21/11"];
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
    "15/8"];
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
    "23/12"];
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
    2 ** (18/19)];
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
    2 ** (13/14),];
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
    "63/32"];
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
    "64/33",];
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
    2 ** (23/24),];
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

// modes
let pitchBend = false;
let tuneMode = "12tet";
let currentTuning = tuning12tet;

let currentScale = scaleMajor12.slice();
let currentKey = "C"; // wip store as numerical offset instead
let currentOctave = 0;
let labelStyle = "none";

// current keys
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
let synthvoices = new Array;

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

    theme = {
        highlight:color("#FFEECD"),
        bg:color("#362D95"),
        bgdark:color("#160E48"),
        blue:[
            color("#1D40BF"),
            color("#2B66DE"),
            color("#21A2E3"),
            color("#25DCCD"),
            color("#34F4AF")
        ],
        green:[
            color("#006A71"),
            color("#018D6C"),
            color("#2AC84C"),
            color("#ABE95C"),
            color("#F3F567")
        ],
        red:[
            color("#5E1F7B"),
            color("#8E2F99"),
            color("#C645A0"),
            color("#F36D64"),
            color("#FF9F76")
        ],
        text:color("#B7A0F8"),
        textdark:color("#8F68FF")
    };

    textAlign(CENTER, CENTER);
    textSize(22);
    textFont("Satoshi");
    textStyle(BOLD);
    rectMode(RADIUS);

    makeHexagons();
    calculateNewMidiGrid(gridIncrement_D, gridIncrement_V);

    // create buttons with negative IDs
    const xOffset = width - 586; 
    const yOffset = 130;
    const bWidth = 151;
    const bHeight = 59;
    const rows = 9;
    const columns = 4;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            controlsArr.push(
                new ButtonObj(xOffset + bWidth*x, yOffset + y*bHeight, "control", -(y + 1 + rows*x))
            );
        }
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
    gridSizeX = 52; 
    gridSizeY = 52;
    let hStartX = -0.5 * gridSizeX;
    let hStartY = 0.8 * gridSizeY;
    let id = 0;

    // hexagons are less wide so they can interlock
    if (noteLayout !== "concertina") {
        gridSizeY = sqrt((3 * pow(gridSizeY, 2)) / 4);
        gridWidth = 19; // how many in a row + odd row

        // create hexagons interlocking horizontally
        for (let y = 21 * gridSizeY; y > -50; y -= 2 * gridSizeY) {
            for (let x = 0; x < 28 * gridSizeX; x += 3 * gridSizeX) {
                // even rows
                keyArr.push(new ButtonObj(x + hStartX, y + hStartY + gridSizeY, "note", id++));
                // odd rows
                if (x > 25 * gridSizeX) { break;}
                keyArr.push(new ButtonObj(x + hStartX + 1.5*gridSizeX, y + hStartY, "note", id++));
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
                keyArr.push(new ButtonObj(x + hStartX, y + hStartY, "note", id++));
                // odd columns
                if (y < 5) {break;}
                keyArr.push(new ButtonObj(x + hStartX + gridSizeX, y + hStartY - 1.5*gridSizeY, "note", id++));
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

        // Render menu when corner button pressed
        if (newTouches[i].clientX > width-72 && newTouches[i].clientY < 72)
        {
            menuIsOpen = !menuIsOpen;
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

        // Hide open menu when finger last finger is lifted & NOT on the button
        if (newTouches[i].clientX < width-72 || newTouches[i].clientY > 72) {
            if (ongoingTouches.length === 0) {
                menuIsOpen = false;
            }
        };

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
    background(theme.bg);
    noStroke();

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

        background(atAlpha(theme.bgdark, 60));
        fill(theme.bgdark);
        rect(1006, 366, 308, 278, 20);

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
        if (pitchBend) {
            bendKeys();
        }
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
        renderBridge(
            penDragStartKey.x, penDragStartKey.y,
            penDragEndKey.x, penDragEndKey.y,
            penDragStartKey.keyColorFromPalette(1),
            penDragEndKey.keyColorFromPalette(2)
        );
    }
    if (bridgeKeyPairs.size > 0) {
        for (let b = bridgeKeyPairs.size - 1; b >= 0; b--) {
            const nameArray = Array.from(bridgeKeyPairs)[b].split(" ");
            let hexArray = [];
            print (nameArray);

            // go through hexagons to find matching ones
            keyArr.forEach((h) => {
                if (nameArray[0] == h.name) {
                    hexArray[0] = h;
                } else if (nameArray[1] == h.name) {
                    hexArray[1] = h;
                }
            });

            if (hexArray[0] !== undefined && hexArray[1] !== undefined) {
                print(hexArray);

                renderBridge(
                    hexArray[0].x, hexArray[0].y,
                    hexArray[1].x, hexArray[1].y,
                    hexArray[0].keyColorFromPalette(1),
                    hexArray[1].keyColorFromPalette(2)
                );
            }
        }
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
        //if not on menu button
        if (ongoingTouches[i].clientX < width-72 || ongoingTouches[i].clientY > 72) {

            const nearestHex = findNearestButton(ongoingTouches[i], keyArr);
            if (nearestHex !== undefined) {
                pressedButtons.push(nearestHex);
            }

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
                
                // could have other modes here
                playKey(h);
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
        // in synth mode, using activekeys to store all the voices

        // release if there is something to release
        if (activeKeys[h.name] !== undefined) {
            activeKeys[h.name].voice.triggerRelease();
            delete activeKeys[h.name].dragValues;
        }

        // attack again if mode is not 'relase'
        if (mode !== "release") {
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
                        delete activeKeys[h.name];
                        print(i + "-voice is silent, remaining active key objects: " + Object.values(activeKeys));
                        drawMinDuration = 20;
                        loop();
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
        currentScale = scaleMajor12;
        noteLayout = "concertina"; makeHexagons();
        calculateNewMidiGrid(4, 7);
        playTestChord([4,7]);

    } else if (-b.name <= rows*3) {
        switch (-b.name - rows*2) {
            case 1:
                tuneMode = "14tet";
                currentTuning = tuning14tet;
                currentOctave = 0;
                currentScale = scaleMajor14;
                noteLayout = "harmonic"; makeHexagons();
                calculateNewMidiGrid(4, 5);
                playTestChord([4, 8]);
                break;
            case 2:
                tuneMode = "19tet";
                currentTuning = tuning19tet;
                currentOctave = 0;
                currentScale = scaleMajor19;
                noteLayout = "concertina"; makeHexagons();
                calculateNewMidiGrid(6, 11);
                playTestChord([6, 11]);
                break;
            case 3:
                tuneMode = "31ji";
                currentTuning = tuning31ji;
                currentOctave = 1;
                currentScale = scaleMajor31;
                noteLayout = "harmonic"; makeHexagons();
                calculateNewMidiGrid(5, 9);
                playTestChord([10, 18]);
                break;
            case 4:
                tuneMode = "21astral";
                currentTuning = tuning21Astral;
                currentOctave = 1;
                currentScale = scalePrimal21;
                noteLayout = "harmonic"; makeHexagons();
                calculateNewMidiGrid(5, 9);
                playTestChord([6, 12, 18]);
                break;
            case 5:
                tuneMode = "24tet";
                currentTuning = tuning24tet;
                currentOctave = 1;
                currentScale = scaleMajor24;
                noteLayout = "harmonic"; makeHexagons();
                calculateNewMidiGrid(4, 7);
                playTestChord([8, 14]);
                break;
            case 6: 
                tuneMode = "24ji";
                currentTuning = tuning24ji;
                currentOctave = 1;
                currentScale = scaleMajor24;
                noteLayout = "harmonic"; makeHexagons();
                calculateNewMidiGrid(4, 7);
                playTestChord([8, 14]);
                break;
        }
    } else if (-b.name <= rows*4) {
        switch (-b.name - rows*3) {
            case 1:
                print("Changed label style");
                if (labelStyle === "notes") {labelStyle = "intervals";}
                else if (labelStyle === "intervals") {labelStyle = "none";}
                else {labelStyle = "notes";}
                break;
            case 2:
                print("Switched to different layout");
                if (noteLayout === "concertina") {
                    noteLayout = "harmonic";
                } else if (noteLayout === "harmonic") {
                    noteLayout = "swapped";
                } else {
                    noteLayout = "concertina";
                }
                makeHexagons(); calculateNewMidiGrid(gridIncrement_D, gridIncrement_V);
                break;
            case 3:
                print("Changed octave");
                currentOctave++;
                if (currentOctave == 3) {currentOctave = 0;}
                break;
            case 4:
                print("Toggled pitch bend");
                pitchBend = !pitchBend;
                break;
        }
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

    if (noteLayout === "concertina") {
        gridBaseMidi = Math.floor(currentTuning.length * 1.5);
    } else {
        gridBaseMidi = currentTuning.length * 2;
    }

    // save for checking elsewhere
    gridIncrement_H = 2 * small - big; // should be semitone
    gridIncrement_D = small;
    gridIncrement_V = big;

    // actual values take into account extra grid modes
    if (noteLayout === "swapped") {
        newIncrement_H = big;
        newIncrement_D = small;
        newIncrement_V = 2 * small - big;
    } else if (noteLayout === "concertina") {
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


function renderBridge(x1, y1, x2, y2, c1, c2) {
    const steps = 50;

    for (let gridDistanceY = 0; gridDistanceY < steps + 1; gridDistanceY++) {
        const mixColor = lerpColor(c1, c2, gridDistanceY / steps);
        const mixX = lerp(x1, x2, gridDistanceY / steps);
        const mixY = lerp(y1, y2, gridDistanceY / steps);

        const size = map(gridDistanceY, 0, steps, 12, 36);
        const alpha = map(gridDistanceY, 0, steps, 255, 255);

        mixColor.setAlpha(alpha);
        fill(mixColor);
        ellipse(mixX, mixY, size);
    }
}


function valueFromScale(scaleIndex) {
    //minor note
    if (currentScale[scaleIndex] === 0) return [1,2,3];

    //major note
    if (currentScale[scaleIndex] === 1) return [2,3,4];

    //ambiguous
    if (currentScale[scaleIndex] === -1) return [0,1,2];
}


function renderTuningReference() {
    push();

    const cornerOffset = 42;
    translate(width-cornerOffset, cornerOffset);
    scale(1.2)

    // round base
    strokeWeight(16);
    const baseSize = 26;
    for (let t = 0; t < currentTuning.length; t++) {
        const angle = map(t, 0, currentTuning.length, 0, TWO_PI) - HALF_PI;
        const start = {x: cos(angle) * 0, y: sin(angle) * 0};
        const end = {x: cos(angle) * baseSize, y: sin(angle) * baseSize};
        stroke(lerpColor(theme.bg, color("black"), 0.5));
        line(start.x, start.y, end.x, end.y);
    }


    // 12tet lines
    strokeWeight(1.3);
    for (let t = 0; t < 12; t++) {

        const angle = map(t, 0, 12, 0, TWO_PI) - HALF_PI;
        const innerD = (scaleMajor12[t] == 1) ? 0 : 10;
        const start = {x: cos(angle) * innerD, y: sin(angle) * innerD};
        const end = {x: cos(angle) * 20, y: sin(angle) * 20};

        //const lineColor = (orderedKeys.length > 0) ? theme.bg : color("#00000080");
        stroke(theme.bg);
        line(start.x, start.y, end.x, end.y);
    }


    // outer lines
    const octaveLength = currentTuning.length;
    const offset = noteNames.indexOf(currentKey);

    for (let i = 0; i < octaveLength; i++) {

        const freq = eval(currentTuning[i]);
        const cents = scaleFreqToCents(freq);
        const angle = map(cents, 0, 1200, 0, TWO_PI) - HALF_PI;
        const start = {x: cos(angle) * 20, y: sin(angle) * 20};
        const end = {x: cos(angle) * 28, y: sin(angle) * 28};

        let col = theme.blue[2]
        if (currentScale[i] === 1) {
            col = theme.blue[3]
        } else if (currentScale[i] === -1) {
            col = theme.blue[1]
        }
        const lineAlpha = (orderedKeys.length > 0) ? 70 : 90;
        const lineColor = color(atAlpha(col, lineAlpha));
        strokeWeight(2);
        stroke(lineColor);
        line(start.x, start.y, end.x, end.y);
    }

    // draw the lines between the segments in order of playing
    let lastKeyAngle;
    let lastKeyColor;
    let lastKeyOctave;
    strokeWeight(0.9);

    orderedKeys.forEach((o) => {

        const index = ((o.midiName-offset) % octaveLength);
        const freq = eval(currentTuning[index]);
        const cents = scaleFreqToCents(freq);
        const keyAngle = map(cents, 0, 1200, 0, TWO_PI) - HALF_PI;
        const keyColor = o.keyColorFromPalette(2);
        const keyOctave = map(o.octave, 0, 6, 18, 28, true);

        const now = {x: cos(keyAngle) * keyOctave, y: sin(keyAngle) * keyOctave};

        // dot
        noStroke();
        fill(keyColor);
        ellipse(now.x, now.y, 3);

        fill(color(atAlpha(keyColor, 30)));
        ellipse(now.x, now.y, 6);

        fill(color(atAlpha(keyColor, 10)));
        ellipse(now.x, now.y, 10);

        // line between previous and this key
        if (lastKeyAngle !== undefined) {

            // line between the two angles
            const step0 = {x: cos(lastKeyAngle) * lastKeyOctave, y: sin(lastKeyAngle) * lastKeyOctave};
            const distX = now.x - step0.x;
            const distY = now.y - step0.y;
            const step1 = {x: step0.x + distX*0.4, y: step0.y + distY*0.4};
            const step2 = {x: step0.x + distX*0.6, y: step0.y + distY*0.6};

            stroke(lastKeyColor);
            line(step0.x, step0.y, step1.x, step1.y);

            stroke(lerpColor(lastKeyColor, keyColor, 0.5));
            line(step1.x, step1.y, step2.x, step2.y);

            stroke(keyColor);
            line(step2.x, step2.y, now.x, now.y);
        }
        lastKeyAngle = keyAngle;
        lastKeyColor = keyColor;
        lastKeyOctave = keyOctave;
    });

    pop();
}

function updateControlStates() {
    menuButtons = [
        {name:"Piano", onCondition:(currentInstrument === "piano")},
        {name:"Rhodes", onCondition:(currentInstrument === "rhodes")},
        {name:"Organ", onCondition:(currentInstrument === "organ")},
        {name:"Harp", onCondition:(currentInstrument === "harp")},
        {name:"Sawtooth", onCondition:(currentInstrument === "sawtooth")},
        {name:"Square", onCondition:(currentInstrument === "square")},
        {name:"Triangle", onCondition:(currentInstrument === "triangle")},
        {name:"Sine", onCondition:(currentInstrument === "sine")},
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

        {name:"EDO 14", onCondition:(tuneMode === "14tet")},
        {name:"EDO 19", onCondition:(tuneMode === "19tet")},
        {name:"JI 31", onCondition:(tuneMode === "31ji")},
        {name:"Astral 21", onCondition:(tuneMode === "21astral")},
        {name:"EDO 24", onCondition:(tuneMode === "24tet")},
        {name:"JI 24", onCondition:(tuneMode === "24ji")},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},

        {name:capitalize(labelStyle), onCondition:undefined}, //onCondition:(labelStyle === "intervals")
        {name:capitalize(noteLayout), onCondition:undefined},
        {name:"Octave "+ currentOctave, onCondition:undefined},
        {name:"Pitchbend", onCondition:pitchBend},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined},
        {name:"", onCondition:undefined}
    ];
}

class ButtonObj {
    constructor(x, y, type, name) {

        this.x = x;
        this.y = y;
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

    keyColorFromPalette(v) {
        const octaveColors = [theme.red, theme.green, theme.blue];
        const hue = octaveColors[(this.octave + 3 + currentOctave) % 3];
        const value = valueFromScale(this.midiName % currentTuning.length)[v]
        return hue[value];
    }

    renderKeyType(state, strength) {
        push();
        noStroke();

        const baseColor = this.keyColorFromPalette(0);
        const lightColor = this.keyColorFromPalette(1);
        const glowColor = this.keyColorFromPalette(2);
        const lightColor50 = color(atAlpha(lightColor, 50));
        const hexSize = 34;
        const hexInner = 30;
        const circleSize = 36;
        const circleInner = ((this.midiName) % currentTuning.length == 0) ? 0 : 18;

        const someNotesOverlay = (orderedKeys.length > 0) ? color(atAlpha(theme.bgdark, 10)) : color("#00000000");

        // note states
        switch (state) {
            case "idle":
                keyShape(this.x+1, this.y+3, hexSize+1, color("#00000040"));
                keyShape(this.x, this.y, hexSize, baseColor);
                centerShape(this.x, this.y, circleSize, lightColor50);
                centerShape(this.x, this.y, circleInner, baseColor);
                keyShapeOverlay(this.x, this.y, hexSize, someNotesOverlay);
                break;
            case "differentOctave":
                keyShape(this.x+1, this.y+3, hexSize+1, color("#00000030"));
                keyShape(this.x, this.y, hexSize, baseColor);
                centerShape(this.x, this.y, circleSize* 1.05, lightColor50);
                centerShape(this.x, this.y, circleInner* 1.2, baseColor);
                break;
            case "stepHigher":
                keyShape(this.x+1, this.y+3, hexSize+1, color("#00000030"));
                keyShape(this.x, this.y, hexSize, baseColor);
                centerShape(this.x-3, this.y, circleSize, lightColor50);
                centerShape(this.x-4, this.y, circleInner, baseColor);
                break;
            case "stepLower":
                keyShape(this.x+1, this.y+3, hexSize+1, color("#00000030"));
                keyShape(this.x, this.y, hexSize, baseColor);
                centerShape(this.x+3, this.y, circleSize, lightColor50);
                centerShape(this.x+4, this.y, circleInner, baseColor);
                break;
            case "klicked":
                keyShape(this.x, this.y+1, hexSize, theme.highlight);
                keyShape(this.x, this.y+1, hexInner, lightColor);
                centerShape(this.x, this.y+1, circleInner * 1.3, baseColor);
                centerShape(this.x, this.y+1, circleInner * 1.3, lightColor50);
                break;
            case "hover":
                keyShape(this.x, this.y+1, hexSize, theme.highlight);
                keyShape(this.x, this.y+1, hexInner, lightColor);
                centerShape(this.x, this.y+1, circleInner * 1.3, baseColor);
                centerShape(this.x, this.y+1, circleInner * 1.3, lightColor50);
                break;
            case "sustained":
                keyShape(this.x, this.y+0.5, hexSize, theme.highlight);
                keyShape(this.x, this.y+0.5, hexSize, color(atAlpha(lightColor, 30)));
                keyShape(this.x, this.y+0.5, hexInner, lightColor);
                centerShape(this.x, this.y+0.5, circleInner* 1.2, baseColor);
                centerShape(this.x, this.y+0.5, circleInner* 1.2, lightColor50);
                break;
            case "glow":
                const rgb = glowColor;
                const glowColorStrength = color(atAlpha(rgb, strength));
                gradientCircle(
                    glowColorStrength, hexSize * 0.5,
                    glowColorStrength, hexSize * 4,
                    this.x, this.y, 14);
                break;
        }
        pop();
    }

    renderControlType(state) {
        push();
        noStroke();
        const baseSize = 86;
        const onColor = theme.textdark;

        // button states
        switch (state) {
            case "hidden":
                fill(atAlpha(theme.bg, 30));
                controlShape(this.x, this.y, baseSize);
                break;
            case "klicked":
                fill(onColor);
                controlShape(this.x, this.y, baseSize*0.9);
                break;
            case "hover":
                fill(onColor);
                controlShape(this.x, this.y, baseSize*0.9);
                break;
            case "activehover":
                fill(theme.textdark);
                controlShape(this.x, this.y, baseSize*0.9);
                break;
            case "idle":
                // more states than on/off
                fill(theme.bg);
                controlShape(this.x, this.y, baseSize);
                fill(onColor);
                triangle(this.x + 60, this.y, this.x + 50, this.y + 10, this.x + 50, this.y - 10);
                triangle(this.x - 60, this.y, this.x - 50, this.y + 10, this.x - 50, this.y - 10);
                break;
            case "active":
                fill(onColor);
                controlShape(this.x, this.y, baseSize);
                break;
            case "inactive":
                fill(theme.bg);
                controlShape(this.x, this.y, baseSize);
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

        const darkTextColor = lerpColor(this.keyColorFromPalette(2), theme.highlight, 0.5);
        const lightTextColor = lerpColor(this.keyColorFromPalette(2), color("white"), 0.8);

        noStroke();
        if (state === "hover" || state === "sustained") {
            fill(lightTextColor);
        } else if (this.pitchName === currentKey || this.pitchName === 1) { 
            fill(lightTextColor); 
        } else if (currentScale[this.midiName % currentTuning.length] !== 1) {
            fill(darkTextColor);
        } else {
            fill(lightTextColor);
        }

        this.renderKeyText();

        if (state === "idle") {
            const someNotesOverlay = (orderedKeys.length > 0) ? color(atAlpha(theme.bgdark, 10)) : color("#00000000");
            fill(someNotesOverlay);
            this.renderKeyText();
        }
        pop();


        // extra text above
        push();
        if (currentTuning != tuning12tet &&
                currentTuning != tuning19tet &&
                currentTuning != tuning24tet &&
                currentTuning != tuning14tet) {
            const offset = noteNames.indexOf(currentKey);
            const intervalName = currentTuning[(this.midiName - offset) % currentTuning.length];

            let topText = intervalName;
            if (topText == 1) {topText = "";}

            textSize(11);
            strokeWeight(3);
            stroke(this.keyColorFromPalette(0));
            fill(this.keyColorFromPalette(2));

            text(topText, this.x, this.y - 25);

            if (orderedKeys.length > 0 && state === "idle") {
                noStroke();
                const someNotesOverlay = color(atAlpha(theme.bgdark, 10));
                fill(someNotesOverlay);
                text(topText, this.x, this.y - 25);
            }
        }
        pop();
    }

    get findKeyVariant() {
        if (menuIsOpen) {return "idle";};
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName && t.countdown > 0);
        const inHoverHexes = pressedButtons.find(t => t.midiName === this.midiName);
        const inSustainedKeys = sustainedKeys.find(t => t.midiName === this.midiName);

        // also highlight same note in different octave.
        // in concertina layout, highlight the semitone instead.
        let higherHexes; let lowerHexes; let differentOctaveHexes;
        if (noteLayout === "concertina") {
            higherHexes = pressedButtons.find(t => t.midiName - this.midiName === 1);
            lowerHexes = pressedButtons.find(t => t.midiName - this.midiName === -1);
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
        } else if (higherHexes !== undefined) {
            return "stepHigher";
        } else if (lowerHexes !== undefined) {
            return "stepLower";
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
        } else {
            this.renderControlType("idle");
        }
    }


    drawKeyGlow() {
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName);
        if (inKlickedHexes !== undefined ) {
            this.renderKeyType("glow", "05");
            return;
        }

        const inSustainedKeys = sustainedKeys.find(t => t.midiName === this.midiName);
        if (inSustainedKeys !== undefined) {
            this.renderKeyType("glow", "02");
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
        const stateColor = (this.isControlOn) ? theme.highlight : theme.text;
        fill(stateColor);

        textSize(18);
        text(menuButtons[-this.name-1].name, this.x, this.y-1);
        pop();
    }

    renderKeyText() {
        const octaveLength = currentTuning.length;
        let keyText = "";

        if (labelStyle !== "none") {

            if (octaveLength == 12) {
                if (labelStyle === "notes") {
    
                    keyText = this.pitchName;
    
                } else if (labelStyle === "intervals") {
    
                    const offset = noteNames.indexOf(currentKey);
                    const intervalName = intervalNames[(this.midiName - offset) % 12];
                    keyText = intervalName;
                }
            } else {
                // other octave lengths
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

            // Add symbol for octave only on first note of each
            if (this.pitchName == currentKey || this.pitchName == 1) {
                const octave = this.octave + currentOctave;
                const octaveSymbol = octaveSymbols[octave % octaveSymbols.length];
                keyText = " " + keyText + octaveSymbol;
            }
            text(keyText, this.x, this.y);
        }
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

    let closestButton;

    if (!mouseUsed && touch !== undefined) {

        // which control is in range of the finger?
        if (menuIsOpen) {
            arr.forEach((h) => {
                //if in certain X and Y distance of button center
                if (Math.abs(touch.clientX - h.x) < 80 && Math.abs(touch.clientY - h.y) < 40) {
                    {closestButton = h;}
                }
            });
        } else {
            //which hexagon is closest?
            closestButton = arr[0];
            arr.forEach((h) => {
                if (h.distanceToTouch(touch) < closestButton.distanceToTouch(touch)) {
                    closestButton = h;
                  }
            });
        }
    } else {
        // mouse used
        arr.forEach((h) => {
            if (h.distanceToMouse < minDistance) {closestButton = h;}
        });
    }

    if (closestButton !== undefined) {
        closestButton.lastTouch = {id:touch.identifier, type:touch.interactionType};
        return closestButton;
    }
}


function keyShape (x, y, r, color) {
    push();

    fill(color);
    strokeWeight(r * 0.8);
    stroke(color);
    strokeJoin(ROUND);

    if (noteLayout === "concertina") {
        hexagon(x, y, r, 1/2 * PI);
    } else {
        hexagon(x, y, r, 0);
    }
    pop();
}


function keyShapeOverlay (x, y, r, color) {
    push();

    fill(color);
    noStroke();

    if (noteLayout === "concertina") {
        hexagon(x, y, r*1.5, 1/2 * PI);
    } else {
        hexagon(x, y, r*1.5, 0);
    }

    pop();
}

function centerShape(x, y, r, color) {
    push();

    fill(color);
    noStroke();

    ellipse(x, y, r*2);
    
    pop();
}

function controlShape(x, y, r) {
    rect(x, y, r * 0.78, r * 0.32, r * 0.1);
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

    textFont("Satoshi");
    textSize(16);
    textStyle(BOLD);

    let playText = currentKey + octaveSymbols[currentOctave] + " " + capitalize(tuneMode);

    if (instrumentType === "synth") {
        playText += " " + Object.values(activeKeys).length + "/32";
    }

    playText += "  ";

    for (let o = 0; o < orderedKeys.length; o++) {
        let keyName;
        const octave = orderedKeys[o].octave + currentOctave;
        const octaveSymbol = octaveSymbols[octave % octaveSymbols.length];

        if (currentTuning.length === 12) {
            keyName = orderedKeys[o].pitchName + octaveSymbol;
        } else {
            keyName = (orderedKeys[o].pitchName-1) + octaveSymbol;
        }
        playText += " " + keyName;
    }

    const xOffset = 15;
    const yOffset = height - 20;

    textAlign(LEFT, CENTER);
    strokeJoin(ROUND);

    strokeWeight(5);
    stroke(color(atAlpha(theme.bgdark,90)));
    text(playText, xOffset, yOffset);

    noStroke();
    const textColor = lerpColor(theme.textdark, theme.text, drawMinDuration/20);
    fill(textColor);
    text(playText, xOffset, yOffset);

    pop();
}

function scaleFreqToCents(freq) {
    return Math.log2(freq) * 1200;
}

function atAlpha (color, percent) {
    const r = red(color);
    const g = green(color);
    const b = blue(color);
    const a = percent / 100;
    return 'rgba('+r+','+g+','+b+','+a+')';
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