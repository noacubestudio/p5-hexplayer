let canvas;
let cooldownFrames = 3; // this animation time also blocks double taps
let readyForSound = false; //only play sound when ready

let gridBaseMidi = 24;
let gridWidth = 17;
let gridIncrement_H = 1;
let gridIncrement_D = 4;
let gridIncrement_V = 7;

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

const rControlNames = [
    "Clear",
    "Paste",
    "Move Key",
    "Toggle",
    "Scales",
    "Octave",
    "Labels",
    "Color",
    "GridXY",
    "12-TET",
    "/19 Novem",
    "/16 NEJI",
    "/11 Undec",
    "/11 Snow",
    "Mode 12",
    "Simple",
    "+",
    "+",
    "Piano",
    "Rhodes",
    "Organ",
    "Harp",
    "+",
    "+",
    "+",
    "+",
    "+",
];

const noteNames = [
    "C","C#","D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];
const intervalNames = [
    "1", "m2", "2", "m3", "3", "4", "TT", "5", "m6", "6", "m7", "7",
];

let tuneMode = "simple";
const baseFrequency = 32.70 //C1
let activeFreqs = [];
let activePlayFreqs = [];
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
const tuning11neji = [ //snowfall
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
const tuning16neji = [ //16:17:18:19:20:21:23:24:25:27:29:30:32
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
    //https://www.huygens-fokker.org/docs/intervals.html
    "1",
    "15/14", //semitone 16/15
    "9/8", //whole tone 8/7
    "6/5", //minor 3rd 7/6
    "5/4", //major 3rd
    "4/3", //p 4th
    "7/5", //tritone
    "3/2", //p 5th
    "8/5", //minor 6th
    "5/3", //major 6th
    "7/4", //harmonic 7th, minor 7th
    "15/8" //major 7th 17/9
];

let currentTuning = tuningSimple;

const scaleMajor = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const scaleMinor = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
const scaleChromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const layoutColorsThirds = [0, 7, 7, 11, 1, 7, 10, 7, 2, 9, 7, 7];
const layoutColorsMajor = [1, 10, 1, 10, 1, 1, 10, 1, 10, 1, 10, 1];
const layoutColorsMajor2 = [2, 7, 2, 7, 2, 2, 7, 2, 7, 2, 7, 2];
//const layoutColorsIntervals = [0, 8, 5, 8, 5, 2, 10, 2, 8, 5, 8, 5];
//const layoutColorsIntervals2 = [1, 9, 6, 9, 6,3, 11, 3, 9, 6, 9, 6];
const layoutColorsFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

const backgroundColor = "#050314"//"#000000";//"#3F346D";
const outColor = "#56459A";
const darkOutColor = "#493C94";
const lightOutColor = "#E8D1FF";
const midColor = hexColors[10];
const activeColor = "#E8D1FF";
const darkStrokeColor = "#190E43A0";
document.bgColor = backgroundColor;

let scaleMode = "chromatic";
let circleMode = false;
let colorMode = "major";

let currentScale = scaleChromatic.slice();
let scaleCustom = currentScale.slice(); //generate with toggle tool
let currentKey = "C";
let currentPlayOctave = 0;
let labelStyle = "intervals";

// base hexagons
let r, s;
let hexagons = new Array;
let buttons = new Array;

//special sets of hexagons
let hoverHex;
let activeChord = new Array;
let dragOrder = new Array;
let prevChord = new Array;

// for touch/mouse control
let ongoingTouches = new Array;
let touchHexes = new Array;
let lastTouchHexes = new Array;
let mouseUsed = false;
let mouseDown = false;

let penPressure = 0;
let penDragStartHex;
let penDragEndHex;
let hexPairs = new Set();

//in readable format
let lastPlayedNote = "";

let lastPlayedHex;

//pages for chords
let pages = [];
let activePage = -1;
let previousPage = -1;

let interactionMode = "play";

//images
let icons_image;
let icons = [];

//tonejs
let synth;
let sampler;
let currentOscType = 'sawtooth';

let pianoSampler;
let rhodesSampler;
let organSampler;
let harpSampler;
let currentSampler = 'Piano';

//const pitchShift = new Tone.PitchShift().toDestination();

let showButtons = false;

function preload() {
    icons_image = loadImage("assets/icons_v2.png");

    synth = new Tone.PolySynth({
    "volume": -10,
    "envelope": {
        "attack": 0,
        "decay": 0,
        "sustain": 0.3,
        "release": 1,
        }
    }).toDestination();

    synth.set({"oscillator": {"type": currentOscType}});

    pianoSampler = new Tone.Sampler({
        urls: {
            A2: "piano110.mp3",
            A3: "piano220.mp3",
            A4: "piano440.mp3",
            A5: "piano880.mp3"
        },
        release: 4,
        baseUrl: "sounds/",
    }).toDestination();

    rhodesSampler = new Tone.Sampler({
        urls: {
            A2: "rhodes110.mp3",
            A3: "rhodes220.mp3",
            A4: "rhodes440.mp3",
            A5: "rhodes880.mp3"
        },
        release: 4,
        baseUrl: "sounds/",
    }).toDestination();

    organSampler = new Tone.Sampler({
        urls: {
            A2: "organleslie110.mp3",
            A3: "organleslie220.mp3",
            A4: "organleslie440.mp3",
            A5: "organleslie880.mp3"
        },
        release: 4,
        baseUrl: "sounds/",
    }).toDestination();

    harpSampler = new Tone.Sampler({
        urls: {
            A2: "harp110.mp3",
            A3: "harp220.mp3",
            A4: "harp440.mp3",
            A5: "harp880.mp3"
        },
        release: 4,
        baseUrl: "sounds/",
    }).toDestination();

    sampler = pianoSampler;
}

function setup() {
    canvas = createCanvas(1366, 890);
    canvas.parent('canvasContainer');
    strokeWeight(2);

    textAlign(CENTER, CENTER);
    textSize(22);
    textFont("Satoshi");
    textStyle(BOLD);
    rectMode(RADIUS);

    //hexagons
    r = 50;
    s = sqrt((3 * pow(r, 2)) / 4);

    hStartX = 1.6 * r;

    // create hexagons
    let counter = 0;
    for (let y = 18 * s; y > 0; y -= 2 * s) {
        for (let x = 0; x < 26 * r; x += 3 * r) {
            hexagons.push(new Hexagon(
                x + hStartX, 5 + y + 0.7 * s, r, "note", counter++, 0)
            );
            if (x < 24 * r)
            {
                hexagons.push(new Hexagon(
                    x + hStartX + 1.5 * r, 5 + y - 0.3 * s, r, "note", counter++, 0)
                );
            }
        }
    }
    //create buttons
    for (let b = 0; b < 9; b++) {
        buttons.push(new Hexagon(
            r*-5.5, 2.5 * s + b * s * 1.7, r, "control", -(b + 1), 0)
        );
        buttons.push(new Hexagon(
            r*2, 2.5 * s + b * s * 1.7, r, "control", -(b + 10), 0)
        );
        buttons.push(new Hexagon(
            r*4.5, 2.5 * s + b * s * 1.7, r, "control", -(b + 19), 0)
        );
        buttons.push(new Hexagon(
            r*7, 2.5 * s + b * s * 1.7, r, "control", -(b + 28), 0)
        );
    }
    //create pages
    for (let i = 0; i < 8; i++) {
        pages[i] = []; //create nested array
    }

    let style = document.createElement('style');
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
}

function handleStart(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        print("touchstart: " + i);
        ongoingTouches.push(copyTouch(newTouches[i]));
    }

    // get combined pen pressure from new touches
    let force = 0;
    for (let t = 0; t < newTouches.length; t++) {
        force += newTouches[t].force;
    }
    penPressure = force;

    //first tone to start audio on safari
    if (readyForSound === false) {
        sampler.triggerAttackRelease("C2", "8n");
        readyForSound = true;
    }
}

function handleMove(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const idx = ongoingTouchIndexById(newTouches[i].identifier);

        if (idx >= 0) {
            print("continuing touch " + idx);
            ongoingTouches.splice(idx, 1, copyTouch(newTouches[i])); // swap in the new touch record
        }
    }
}

function handleEnd(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const idx = ongoingTouchIndexById(newTouches[i].identifier);
        
        if (idx >= 0) {
            print("removing touch " + idx);
            ongoingTouches.splice(idx, 1);
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    print("touch cancel.");
    const newTouches = evt.changedTouches;
    
    for (var i = 0; i < newTouches.length; i++) {
      ongoingTouches.splice(i, 1); // remove it; we're done
    }
}

function copyTouch(touch) {
    return {
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY, 
        force: touch.force};
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
    background(backgroundColor);

    //top left and right corner icons
    push();
    strokeWeight(6)
    stroke(color('#5027A9'));
    noFill();
    ellipse(36, 36, 30);
    ellipse(width-36, 36, 30);
    pop();

    // Render buttons when left icon pressed
    if (ongoingTouches.length > 0 && ongoingTouches[0].clientX < 72 && ongoingTouches[0].clientY < 72)
    {
        // show controls on the left
        showButtons = true;

        if (mouseUsed === false) {
            detectButtonTouch()
        }

        // Render all hexagons + variants below
        hexagons.forEach((h) => {
            if (h.countdown > 0) {
                h.countdown--;
            }
            h.render(h.findHexVariant);
        });

        // Render lines between hexagons
        renderDrawLines();

        // Render all hexagon text
        hexagons.forEach((h) => {
            h.renderText(h.findHexVariant);
        });

        let optionsBG = color(backgroundColor);
        optionsBG.setAlpha(230);
        fill(optionsBG);
        rect(220, 405, 200, 340, 20);
        optionsBG.setAlpha(30);
        background(optionsBG);

        buttons.forEach((b) => {
            if (b.countdown > 0) {
                b.countdown--;
            }
            b.drawButtonVariant();
        });

        // Render extra glow
        buttons.forEach((b) => {
            b.drawButtonGlow();
        });
    }
    else
    {
        //don't show the controls
        showButtons = false;

        if (mouseUsed === false) {
            detectTouch()
        }

        // Render all hexagons + variants
        hexagons.forEach((h) => {
            if (h.countdown > 0) {
                h.countdown--;
            }
            h.render(h.findHexVariant);
        });

        // Render extra glow
        hexagons.forEach((g) => {
            g.drawGlow();
        });

        // Render lines between hexagons
        renderDrawLines();

        // Render all hexagon text
        hexagons.forEach((h) => {
            h.renderText(h.findHexVariant);
        });
    }

    //lines at the top showing scale;
    drawScaleLines();

    // text about the pages
    push();

    textFont("Switzer");
    textStyle(NORMAL);
    fill(color('#5027A9'));
    noStroke();
    pagesText();
    scaleText();
    playText();
    synthText();

    pop();
}

function renderDrawLines() {
    push();
    noStroke();
    //lines between touchhexes
    if (penDragStartHex !== undefined && penDragEndHex !== undefined) {
        drawPointConnector(
            penDragStartHex.x, penDragStartHex.y,
            penDragEndHex.x, penDragEndHex.y,
            color(hexNoteColor(penDragStartHex, "dark")),
            color(hexNoteColor(penDragEndHex, "dark")));
    }
    if (hexPairs.size > 0) {
        hexPairs.forEach((hexpair) => {
            const nameArray = hexpair.split(" ");
            let hexArray = [];
            print (nameArray);

            //go through hexagons to find matching ones
            hexagons.forEach((h) => {
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
                    color(hexNoteColor(hexArray[0], "dark")),
                    color(hexNoteColor(hexArray[1], "dark")));
            }
        });
    }
    pop();
}

function findNoteShape(selectedHexes) {

    // go through all hexes with same midiName
    // to find the locations for each midiName in chord
    let options = [];

    if (selectedHexes.length > 0) {


        print("Selected " + selectedHexes.length);
        selectedHexes.forEach((s) => {

            // make slot for 2d array
            options.push([]);

            hexagons.forEach((h) => {
                if (s.midiName === h.midiName) {
                    //add matching hexagon to that slot
                    options[options.length-1].push(h);
                }
            });
        });

        // go through every combination
        let combo = [];

        optionCheck(combo, options, 0);
    }
}

function optionCheck(combo, options, n) {

    if (options.length > n) {
        options[n].forEach((optionHex) => {

            combo.push(optionHex);
            const nextOption = optionCheck(combo, options, n++)
            if (nextOption) {
                combo.push(nextOption);
            }

            return combo;
        });
    }
    else {
        tryCombo(c);
        combo.pop();
        return;
    }
}


function tryCombo (combo) {
    let printList = ""
    combo.forEach((c) => {
        printList += c.pitchName + "-" + c.name + " ";
    });
    print("pot. X: " + printList);
}

function detectButtonTouch() {
    //only when controls are shown

    //update which buttons are hovered over/ pressed
    lastTouchHexes = touchHexes.slice();
    touchHexes = [];

    for (let i = 0; i < ongoingTouches.length; i++) {

        nearestHex = findNearestHex(ongoingTouches[i]);
        if (nearestHex !== undefined) {
            touchHexes.push(nearestHex);
        }
    }

    //find unique items in each
    const addedHexes = touchHexes.filter((o) => lastTouchHexes.indexOf(o) === -1);

    if (addedHexes.length > 0)
    {
        // see if a button is hovered closest
        buttons.forEach((b) => {
            if (b.name === touchHexes[0].name) {
                buttonPressed(b);
                //b.countdown = cooldownFrames;
            }
        });
    }
}


function detectTouch() {
    //only when hexagons are shown

    //update which buttons are hovered over/ pressed
    lastTouchHexes = touchHexes.slice();
    touchHexes = [];

    let touchesOnHex = 0;

    for (let i = 0; i < ongoingTouches.length; i++) {

        nearestHex = findNearestHex(ongoingTouches[i])
        if (nearestHex !== undefined) {
            touchHexes.push(nearestHex);

            //pass the latest x and y values of that touch to the hex
            touchHexes[touchesOnHex].touchDragX = ongoingTouches[i].clientX;
            touchHexes[touchesOnHex].touchDragY = ongoingTouches[i].clientY;
            touchesOnHex++;
        }
    }

    //check if apple pencil or touch was used
    if (penPressure > 0.0) {
        reactToPen();
    }
    else {
        reactToTouch();
    }

    if (ongoingTouches.length === 0) {

        //add new line hexes to set, then remove the live line
        if (penDragStartHex !== undefined && penDragEndHex !== undefined) {

            const startName = penDragStartHex.name;
            const endName = penDragEndHex.name;
            const newNamePair = startName + " " + endName;
            const reverseNamePair = endName + " " + startName;
            if (hexPairs.has(newNamePair)) {
                //remove
                hexPairs.delete(newNamePair);
                print(hexPairs.size);
                print("Removed " + newNamePair);
            }
            else if (hexPairs.has(reverseNamePair)) {
                //remove
                hexPairs.delete(reverseNamePair);
                print(hexPairs.size);
                print("Removed " + reverseNamePair);
            }
            else {
                //add
                hexPairs.add(newNamePair);
                print(hexPairs.size);
                print("Added " + newNamePair);
            }
        }

        penDragStartHex = undefined;
        penDragEndHex = undefined;
    }
}

function detectMouse() {

    //update which buttons are dragged over/ pressed
    lastTouchHexes = touchHexes.slice();
    touchHexes = [];
    if (findNearestHex !== undefined) {
        touchHexes.push(findNearestHex);
    }
}

function reactToPen() {
    //clean up duplicates
    touchHexes = [...new Set(touchHexes)];

    //find unique items in each
    let addedHexes = touchHexes.filter((o) => lastTouchHexes.indexOf(o) === -1);
    let removedHexes = lastTouchHexes.filter((o) => touchHexes.indexOf(o) === -1);
    const unique = addedHexes.concat(removedHexes);

    if (unique.length > 0) {
        print("pen changes! " + unique.length);

        let addChanges = "Added ";
        let removeChanges = "Removed ";

        for (var ac = 0; ac < addedHexes.length; ac++) {
            addChanges += addedHexes[ac].name + ' '
        }
        for (var rc = 0; rc < removedHexes.length; rc++) {
            removeChanges += removedHexes[rc].name + ' '
        }

        print(addChanges + ", " + removeChanges);

        if (addedHexes.length == 1) {

            hexagons.forEach((h) => {
                if (h.name === addedHexes[0].name) {

                    if (penDragStartHex == undefined) {
                        penDragStartHex = h;
                        print("first note!")
                    }
                    else {
                        //there's a start hex already, update the end one instead
                        penDragEndHex = h;
                        print("updated end note!");
                    }
                }
            });
        }
    }
}


function reactToTouch() {
    //only when hexagons are shown

    //clean up duplicates and sort
    touchHexes = [...new Set(touchHexes)];
    touchHexes.sort((a, b) => a.name - b.name);

    //give continuous drag values
    hexagons.forEach((h) => {
        touchHexes.forEach((t) => {

            if (t.name === h.name && t.touchDragX != -1) {
                h.touchDragX = t.touchDragX;
                h.touchDragY = t.touchDragY;
            }
        });
    });

    //find unique items in each
    let addedHexes = touchHexes.filter((o) => lastTouchHexes.indexOf(o) === -1);
    let removedHexes = lastTouchHexes.filter((o) => touchHexes.indexOf(o) === -1);
    const unique = addedHexes.concat(removedHexes);

    if (unique.length > 0) {

        let addChanges = "Added ";
        let removeChanges = "Removed ";

        for (var ac = 0; ac < addedHexes.length; ac++) {
            addChanges += addedHexes[ac].name + ' ';
        }
        for (var rc = 0; rc < removedHexes.length; rc++) {
            removeChanges += removedHexes[rc].name + ' ';
        }

        print(addChanges + ", " + removeChanges);

        //if there have been additions and deletions at once,
        //toggle both in the chord
        if (activePage >= 0 && addedHexes.length > 0 && removedHexes.length > 0) {
            for (var moveAdd = 0; moveAdd < addedHexes.length; moveAdd++) {
                //added notes
                const moveAddHex = addedHexes[moveAdd];

                hexagons.forEach((h) => {
                    if (h.name === moveAddHex.name) {
                        hexagonPressed(h);
                        h.touchStartX = moveAddHex.touchDragX;
                        h.touchStartY = moveAddHex.touchDragY;
                    }
                });
            }

            for (var remAdd = 0; remAdd < removedHexes.length; remAdd++) {
                //new removed notes
                const moveRemHex = removedHexes[remAdd];

                hexagons.forEach((h) => {
                    if (h.name === moveRemHex.name) {
                        hexagonPressed(h);
                        h.touchStartX = -1;
                        h.touchStartY = -1;
                        h.touchDragX = -1;
                        h.touchDragY = -1;
                    }
                });
            }
        }
        else {
            //just additions or just deletions, or nothing

            //if there have been additions, play those
            //or toggle them in the chord
            for (var play = 0; play < addedHexes.length; play++) {

                const playHex = addedHexes[play];


                    // see if a note is hovered closest and do stuff
                    hexagons.forEach((h) => {
                        if (h.name === playHex.name) {
                            hexagonPressed(h);
                            h.touchStartX = playHex.touchDragX;
                            h.touchStartY = playHex.touchDragY;
                        }
                    });
            }

            //stop playing deleted notes
            //this only has an effect for normal played notes
            for (var endplay = 0; endplay < removedHexes.length; endplay++) {

                const removedHex = removedHexes[endplay];

                //if it's a note
                hexagons.forEach((h) => {
                    if (h.name === removedHex.name) {
                        hexagonReleased(h);
                        h.touchStartX = -1;
                        h.touchStartY = -1;
                        h.touchDragX = -1;
                        h.touchDragY = -1;
                    }
                });

            }
        }
    }
}

function reChord(h) {
    let index = -1;

    activeChord.forEach((a) => {
        if (a.midiName === h.midiName) {
            //midi value is already in chord
            index = activeChord.indexOf(a);
        }
    });

    //if the note is in the chord already
    if (index > -1) {
        activeChord.splice(index, 1);
    } else {
        activeChord.push(h);
    }

    //reorder from lowest to highest!
    activeChord.sort((a, b) => a.midiName - b.midiName);

    pageIs(activePage);
    playChord();
}

function synthSetOsc(oscType) {
    //sine, square, sawtooth, triangle
    currentOscType = oscType;
    synth.set({"oscillator": {"type": oscType}});
}

function playChord(arp) {
    if (activeChord.length > 0) {

        activeFreqs = [];
        let playPitches = [];

        activeChord.forEach((c) => {
            const pOctave = c.octave + currentPlayOctave
            const freq = eval(currentTuning[c.midiName % 12]);
            const pPitch = baseFrequency * freq * 2 ** (pOctave -1);
            activeFreqs.push(freq);
            playPitches.push(pPitch);
        });

        //if (arp) {
        //    Tone.Transport.stop();
        //    print("arp:")
        //    const pattern = new Tone.Pattern(function(time, note) {
        //            sampler.triggerAttackRelease(note, 0.1);
        //            print(playPitches.indexOf(note) + " - " + note);
        //        }, playPitches, "up").start(0);
        //    pattern.iterations = 10;
        //    Tone.Transport.start();
        //}
        //else {
            sampler.triggerAttackRelease(playPitches, "8n");
        //}

        // TODO
        //findNoteShape(activeChord);

    }
}

function playKey(h, mode) {
    lastPlayedNote = h.pitchName + "" + (h.octave + currentPlayOctave);
    lastPlayedHex = h;

    const pOctave = h.octave + currentPlayOctave
    const freq = eval(currentTuning[h.midiName % 12]);
    const pPitch = baseFrequency * freq * 2 ** (pOctave -1);

    activeFreqs.push(freq);
    activePlayFreqs.push(pPitch);

    if (mode === "release") {

        //wip - release needs to take into account the latest retune for that hex
        sampler.triggerRelease(pPitch);
        activeFreqs = [];
    }
    else {
        sampler.triggerAttack(pPitch);
    }
}

function retune(h, float) {

    //print("retune", h.pitchName, float);
    //pitchShift.pitch = float;

    //const pOctave = h.octave + currentPlayOctave
    //const freq = currentTuning[h.midiName % 12];
    //const pPitch = baseFrequency * freq * 2 ** (pOctave -1);
    //
    //for (let a = 0; a < activePlayFreqs.length; a++) {
    //    if (activePlayFreqs[a] == pPitch) {
    //        //WIP
    //        //Find correct voice of sampler, then retune that one
    //        //activePlayFreqs[a] = pPitch + 50;
    //
    //        //find note with pPitch
    //
    //    }
    //}
}

function hexagonPressed(h) {

    // change key with to note, or change scale
    if (interactionMode === "key") {

        h.countdown = cooldownFrames;
        currentKey = h.pitchName;
        pickScale(currentKey, scaleMode);
        print("Key mode current key: " + currentKey)
    }

    // toggle notes in scale
    else if (interactionMode === "edit") {
        h.countdown = cooldownFrames;
        toggleNoteInScale(h);
    }

    // add or remove notes from chord
    else if (activePage >= 0) {
        reChord(h);
        h.countdown = cooldownFrames;
    }
    // play the note normally
    else {
        playKey(h);
    }
}

function hexagonReleased(h) {
    if (activePage < 0 && interactionMode === "play") {
        playKey(h, "release");
    }
}

function buttonPressed(b) {
    // release all notes, just in case
    synth.releaseAll();

    // go to page
    for (let n = 1; n <= 8; n++) {
        if (b.label === n) {
            pageIs(n - 1);
            playChord(activeChord);
            return;
        }
    }

    // other functions
    switch (-b.name) {
        case 9:
            pageIs(-1); // play live
        break;
        case 10:
            if (activePage > -1) {
                print("Cleared the page.");
                pages[activePage] = [];
                activeChord = [];
                pageIs(activePage);
            }
            else {
                prevChord = [];
            }
        break;
        case 11:
            if (previousPage > -1) {
                print("Replaced page.");
                pages[activePage] = pages[previousPage];
                activeChord = pages[previousPage];
                pageIs(activePage);
                playChord(activeChord);
            }
        break;
        case 12:
            print("Change key");
            if (interactionMode === "key") {
                interactionMode = "play";
            } else {
                interactionMode = "key";
            }
        break;
        case 13:
            print("Toggle notes");
            if (interactionMode === "edit") {
                interactionMode = "play";
            } else {
                interactionMode = "edit";
            }
        break;
        case 14:
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
        case 15:
            print("Changed octave");
            if (currentPlayOctave < 2) {
                currentPlayOctave++;
            }
            else {
                currentPlayOctave = 0;
            }
        break;
        case 16:
            print("Changed label style");
            if (labelStyle === "notes") {labelStyle = "intervals";}
            //else if (labelStyle === "intervals") {labelStyle = "midi";}
            else {labelStyle = "notes";}
        break;
        case 17:
            print("Changed color theme!");
            if (colorMode === "fifths") {colorMode = "major";}
            else if (colorMode === "major") {colorMode = "fifths";}
            //else {colorMode = "chromatic";}
        break;
        case 18:
            print("Switched to different midi to grid XY layout");

            const temp = gridIncrement_H;
            gridIncrement_H = gridIncrement_V;
            gridIncrement_V = temp;

            hexagons.forEach((h) => {

                h.setMidiFromGrid(
                gridBaseMidi,
                gridWidth,
                gridIncrement_H,
                gridIncrement_D,
                gridIncrement_V);

            });

            //print("Switched to next oscillator type");
            //if (currentOscType === "sawtooth") {synthSetOsc("triangle");}
            //else if (currentOscType === "triangle") {synthSetOsc("square");}
            //else if (currentOscType === "square") {synthSetOsc("sine");}
            //else {synthSetOsc("sawtooth");}
            break;
        case 19:
            print("Switched to 12 tone equal temperament");
            tuneMode = "12tet";
            currentTuning = tuning12tet;
        break;
        case 20:
            print("Switched to 12 tone Novemdecimal");
            tuneMode = "novemdecimal";
            currentTuning = tuningNovemdecimal;
        break;
        case 21:
            print("Switched to 12 tone 16-NEJI");
            tuneMode = "16neji";
            currentTuning = tuning16neji;
        break;
        case 22:
            print("Switched to 12 tone Undecimal");
            tuneMode = "undecimal";
            currentTuning = tuningUndecimal;
        break;
        case 23:
            print("Switched to 12 tone 11-NEJI");
            tuneMode = "11neji";
            currentTuning = tuning11neji;
        break;
        case 24:
            print("Switched to 12 tone Harmonic series segment");
            tuneMode = "harmonic";
            currentTuning = tuningHarmonic;
        break;
        case 25:
            print("Switched to simple 12 tone tuning");
            tuneMode = "simple";
            currentTuning = tuningSimple;
        break;
        case 28:
            print("Switched to piano!");
            currentSampler = 'Piano'
            sampler = pianoSampler;
        break;
        case 29:
            print("Switched to Rhodes!");
            currentSampler = 'Rhodes'
            sampler = rhodesSampler;
        break;
        case 30:
            print("Switched to organ!");
            currentSampler = 'Organ'
            sampler = organSampler;
        break;
        case 31:
            print("Switched to harp!");
            currentSampler = 'Harp'
            sampler = harpSampler;
        break;
    }
}

function pickScale(pitch, mode) {
    //start from note
    const offset = noteNames.indexOf(pitch);

    for (let i = 0; i < currentScale.length; i++) {
        if (mode === "major") {
            currentScale[(i + offset) % 12] = scaleMajor[i];
        } else if (mode === "minor") {
            currentScale[(i + offset) % 12] = scaleMinor[i];
        } else if (mode === "chromatic") {
            currentScale[i] = scaleChromatic[i];
        } else if (mode === "custom") {
            currentScale[(i + offset) % 12] = scaleCustom[i];
        }
    }
}

function toggleNoteInScale(h) {
    //always uses custom scale, change the key to get back to defaults
    scaleMode = "custom";

    //get position of current name in notenames
    const offset = noteNames.indexOf(h.pitchName);
    const keyOffset = noteNames.indexOf(currentKey);
    print (currentKey + " at " + keyOffset)

    //todo use key for offset and custom scale

    if (scaleCustom[(offset - keyOffset) % 12] === 1) {
        scaleCustom[(offset - keyOffset) % 12] = 0;
    } else {
        scaleCustom[(offset - keyOffset) % 12] = 1;
        playKey(h);
    }

    //save the scale so it can be moved around in key later
    currentScale = scaleCustom.slice();
}

function keyTyped() {
    // Show major scale from hovered note
    if (key === "e") {
        interactionMode = "key";
        mousePressed();
    }
    else if (key === "w") {
        interactionMode = "play";
        mousePressed();
    }
    else if (key === "r") {
        interactionMode = "edit";
        mousePressed();
    }
    else if (key === "q") {
        pageIs(-1);
        mousePressed();
    }

    // Switch pages with number keys
    for (let i = 0; i < 8; i++) {
        if (key === String(i + 1)) {
            pageIs(i);
            playChord(activeChord);
        }
    }
}

function pageIs(i) {
    // save to correct page
    pages[activePage] = activeChord.slice();
    //print(activeChord[0].midiName + " was " + prevChord[0].midiName);

    if (activeChord.length > 0) {
        //keep if the same page is set multiple times, don't update!
        if (prevChord !== activeChord) {
            prevChord = activeChord.slice();
            previousPage = activePage;
        }
    }

    if (i >= 0) {
        activeChord = pages[i].slice();
    } else {
        activeChord = [];
    }
    activePage = i;
}

function hexNoteColor(h, style) {
    let palette = hexColors.slice();
    let darkPalette = darkHexColors.slice();
    let darkerPalette = darkerHexColors.slice();
    let lightPalette = lightHexColors.slice();

    if (colorMode !== "chromatic" && h.type === "note") {

        //how to translate the colors?
        let cTable;
        if (colorMode === "thirds")
        {
            cTable = layoutColorsThirds.slice()
        }
        else if (colorMode === "major")
        {
            cTable = layoutColorsMajor.slice()
            if ((h.octave + currentPlayOctave + 1) % 2 == 0) {
                cTable = layoutColorsMajor2.slice()
            }
        }
        else if (colorMode === "fifths")
        {
            cTable = layoutColorsFifths.slice()
        }

        for (let i = 0; i < hexColors.length; i++) {
            let lookup = cTable[i];

            palette[i] = hexColors[lookup];
            darkPalette[i] = darkHexColors[lookup];
            darkerPalette[i] = darkerHexColors[lookup];
            lightPalette[i] = lightHexColors[lookup];
        }
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
        offColor = color('black');
    }

    //color according to on/off state in current scale
    const index = noteNames.indexOf(h.pitchName);
    const offset = noteNames.indexOf(currentKey);

    if (currentScale[index] == 1) {
        const shiftedColor = palette[(h.midiName - offset) % 12];
        return shiftedColor;
    } else {
        return offColor;
    }
}

function drawPointConnector(x1, y1, x2, y2, c1, c2) {
    const steps = 20;

    for (let s = 0; s < steps + 1; s++) {
        const mixColor = lerpColor(c1, c2, s / steps);
        const mixX = lerp(x1, x2, s / steps);
        const mixY = lerp(y1, y2, s / steps);
        const size = map(s, 0, steps, 6, 14);
        const alpha = map(s, 0, steps, 60, 255);
        mixColor.setAlpha(alpha);
        fill(mixColor);
        ellipse(mixX, mixY, size);
    }
}

function drawScaleLines() {
    const hLength = 400;
    const startX = (width - hLength) / 2;
    const endX = (width + hLength) / 2;
    const startY = 18;

    push()
    noStroke();

    //todo
    const octLength = currentTuning.length;

    let getXValue = (fr) => map(scaleFreqToCents(fr+1), 0, 1200, startX, endX);

    for (let j = 0; j < octLength; j++) {
        const compareFreq = tuning12tet[j] - 1;
        const xCompareValue = getXValue(compareFreq);

        gradientCircle(
            lerpColor(color('black'), color('#3E1C87'), 0.2),
            0,
            lerpColor(color('black'), color('#3E1C87'), 0.7),
            20,
            xCompareValue,
            startY, 5);
    }

    for (let i = 0; i < octLength; i++) {
        let freq = eval(currentTuning[i]) - 1;

        let size = 7;
        push();
        noStroke();
        let fillC = color('white');

        const offset = noteNames.indexOf(currentKey);

        //color,new
        const inKlickedHexes = touchHexes.find(t =>
            (t.midiName % 12) === ((i+offset) % 12) &&
            t.countdown > 0);
        const inHoverHexes = touchHexes.find(t =>
            (t.midiName % 12) === ((i+offset) % 12));

        if (inKlickedHexes == undefined) {
            let cTable = layoutColorsMajor2;

            if (colorMode === "thirds") {cTable = layoutColorsThirds;}
            else if (colorMode === "fifths") {cTable = layoutColorsFifths;}

            const colorIndex = cTable[i % currentScale.length];

            const hexColor = color(hexColors[colorIndex]);
            let darkHexColor = color(darkHexColors[colorIndex]);
            fillC = darkHexColor;
            fillC.setAlpha(220);
            //stroke(darkHexColor);
        }

        if (inHoverHexes !== undefined) {
            size = 12;
        }

        const xValue = getXValue(freq);

        noStroke();
        fill(fillC);
        ellipse(xValue, startY, size);

        pop();
    }
    pop();
}

class Hexagon {
    constructor(x, y, r, type, name, countdown) {

        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.name = name;
        this.countdown = countdown;

        this.setMidiFromGrid(
            gridBaseMidi,
            gridWidth,
            gridIncrement_H,
            gridIncrement_D,
            gridIncrement_V);

        this.touchStartX = -1;
        this.touchStartY = -1;
        this.touchDragX = -1;
        this.touchDragY = -1;
    }

    setMidiFromGrid(base, width, h, d, v) {
        this.midiName =
            base +
            floor((this.name % width) / 2) * h +
            ((this.name % width) % 2) * d +
            floor(this.name / width) * v;
        this.pitchName = noteNames[this.midiName % currentTuning.length];
        this.octave = floor(this.midiName / 12) - 1;
    }

    render(state) {
        push();
        if (this.type === "note") {

            strokeWeight(4);
            noStroke();
            //stroke(hexNoteColor(this, "dark") + '20');

            let innerColor = color(hexNoteColor(this, "dark"));
            let midColor = lerpColor(innerColor, color("black"), 0.2);
            let outerColor = color(hexNoteColor(this, "darker"));

            //note states
            switch (state) {
                case "klicked":

                    buttonShape(this.x, this.y, this.r * 1.7, innerColor);
                    gradientCircle(
                        color('#FFFFFF80'),
                        0,
                        color('#FFFFFF00'),
                        this.r * 1.59,
                        this.x,
                        this.y, 12);
                break;
                case "hover":
                    buttonShape(this.x, this.y, this.r * 1.7, midColor);
                    gradientCircle(
                        color(hexNoteColor(this, "light")),
                        0,
                        midColor,
                        this.r * 1.45,
                        this.x,
                        this.y, 18);
                break;
                case "idle":
                    buttonShape(this.x, this.y, this.r * 1.7, outerColor);
                    gradientCircle(
                        lerpColor(innerColor, outerColor, 0.2),
                        0,
                        outerColor,
                        this.r * 1.45,
                        this.x,
                        this.y, 18);
                break;
                case "inChord":
                    buttonShape(this.x, this.y, this.r * 1.7, "white");
                    gradientCircle(
                        innerColor,
                        0,
                        color('white'),
                        this.r * 1.59,
                        this.x,
                        this.y, 12);
                break;
                case "inChordHover":
                    buttonShape(this.x, this.y, this.r * 1.7, "white");
                    gradientCircle(
                        innerColor,
                        0,
                        color('white'),
                        this.r * 1.59,
                        this.x,
                        this.y, 12);
                break;
                case "prevChord":
                    buttonShape(this.x, this.y, this.r * 1.7, "black");
                    gradientCircle(
                        innerColor,
                        0,
                        "black",
                        this.r * 1.59,
                        this.x,
                        this.y, 12);
                break;
                case "glow":
                    buttonShape(this.x, this.y, this.r * 2, "FFFFFF30");
                break;
            }
        }
        else if (this.type === "control") {
            strokeWeight(2);
            stroke('black');
            //button states
            switch (state) {
                case "hidden":
                    fill(backgroundColor);
                    noStroke();
                    break;
                case "klicked":
                    fill(darkStrokeColor);
                    controlShape(this.x, this.y, this.r * 1.7);
                    fill(hexColors[10]);
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
                    fill("#170744d0");
                    controlShape(this.x, this.y, this.r * 1.7);
                    //gradientCircle(
                    //    color('#361976'),
                    //    0,
                    //    color('#170744'),
                    //    this.r * 1.30,
                    //    this.x,
                    //    this.y, 12);
                    break;
                case "active":
                    fill('#3E1C87');
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
                        color('#361976'),
                        0,
                        color('#000000'),
                        this.r * 1.30,
                        this.x,
                        this.y, 12);
                    noFill();
                    stroke(midColor);
                    controlShape(this.x, this.y, this.r * 1.7);
                break;
            }
            this.pickControlText();
        }
        pop();
    }

    renderText(state) {
        // text on note
        push();
        textSize(22);

        //shadow
        strokeWeight(4);
        stroke("#00000050");
        strokeJoin(ROUND);
        fill("#00000050");
        this.pickHexText();

        noStroke();
        if (state === "hover") {
            fill("white");
        }
        else if (this.pitchName === currentKey) { 
            fill(rootColor); 
        }
        else {
            fill(hexNoteColor(this, "light"));

            const offset = noteNames.indexOf(this.pitchName);
            const keyOffset = noteNames.indexOf(currentKey);

            if (currentScale[offset] == 0) {
                fill(hexNoteColor(this));
            }
        }

        this.pickHexText();
        this.hexDragOffsetIndicator();
        pop();
    }

    get findHexVariant() {
         const inKlickedHexes = touchHexes.find(t =>
            t.midiName === this.midiName &&
            t.countdown > 0);
        const inHoverHexes = touchHexes.find(t =>
            t.midiName === this.midiName);

        if (inKlickedHexes !== undefined) {
            return "klicked";
        }
        else if (hexInChord(this, activeChord) &&
                         inHoverHexes !== undefined) {
            return "inChordHover";
        }
        else if (hexInChord(this, activeChord)) {
            return "inChord";
        }
        else if (inHoverHexes !== undefined) {
            return "hover";
        }
        else if (hexInChord(this, prevChord)) {
         return "prevChord";
        }
        else if (this.pitchName === currentKey &&
                         interactionMode === "key") {
            return "inChord";
        }
        else {
            // note is not in current chord
            return "idle";
        }
    }

    drawButtonVariant() {
        const inHoverButtons = touchHexes.find(t =>
            t.name === this.name);

        if (this.label === "") {
            this.render("hidden");
        } else if (this.countdown > 0) {
            this.render("klicked");
        } else if (this.isToggledOn && inHoverButtons !== undefined) {
            this.render("activehover");
        } else if (this.isToggledOn) {
            this.render("active");
        } else if (inHoverButtons !== undefined) {
            this.render("hover");
        } else if (this.secondaryOn){
            this.render("secondaryOn");
        } else {
            this.render("idle");
        }
    }

    drawGlow() {
        const inKlickedHexes = touchHexes.find(t =>
            t.midiName === this.midiName &&
            t.countdown > 0);

        if (inKlickedHexes !== undefined) {
            this.render("glow");
        }
    }

    drawButtonGlow() {
        if (this.countdown > 0) {
            this.render("glow");
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

    get isToggledOn() {
        if (this.label === activePage + 1 ||
            this.name === -9 && activePage === -1 ||
            this.name === -12 && interactionMode === "key" ||
            this.name === -13 && interactionMode === "edit" ||
            this.name === -19 && tuneMode === '12tet'||
            this.name === -20 && tuneMode === 'novemdecimal'||
            this.name === -21 && tuneMode === '16neji'||
            this.name === -22 && tuneMode === 'undecimal' ||
            this.name === -23 && tuneMode === '11neji'||
            this.name === -24 && tuneMode === 'harmonic' ||
            this.name === -25 && tuneMode === 'simple' ||
            this.name === -28 && currentSampler === 'Piano'||
            this.name === -29 && currentSampler === 'Rhodes' ||
            this.name === -30 && currentSampler === 'Organ'||
            this.name === -31 && currentSampler === 'Harp') {
            return true;
        }
    }

    get secondaryOn() {
        if (this.label === previousPage + 1) {
            return true;
        }
    }

    get label() {
        if (this.type === "control") {
            let label = -this.name;
            if (label < 9) {
                return 9 - label;
            }
            if (label === 9) {
                return "Play Solo";
            }
            if (
                this.name === -11 &&
                previousPage > -1 &&
                activePage > -1 &&
                activePage !== previousPage
            ) {
                return "Paste page: " + (previousPage + 1);
            }
            if (label >= 10) {
                return rControlNames[label - 10];
            }
            return label;
        }
    }

    get description() {
        if (this.type === "control") {
            let desc = this.label;

            if (this.label < 9) {
                desc = "Switch to page " + this.label;
            }

            return desc;
        }
    }

    pickControlText() {
        push();
        noStroke();
        fill("#AA6EF5");

        if (this.isToggledOn) {
            fill("#D5B9F2");
        }

        textSize(19);
        text(this.label, this.x, this.y);
        pop();

        //const imageX = this.x - 0.52 * this.r;
        //const imageY = this.y - 0.54 * this.r;
        //const size = 52;

        //for (let i = 9; i <= 17; i++) {
        //    if (this.name === -i) {
        //        image(icons[i - 9], imageX, imageY, size, size);
        //        pop();
        //        return;
        //    }
        //}

    }

    pickHexText() {
        if (labelStyle === "notes")
        {
            if (this.pitchName == currentKey) {
                text(this.pitchName + (this.octave + currentPlayOctave), this.x, this.y);
            }
            else {
                text(this.pitchName, this.x, this.y);
            }
        }
        else if (labelStyle === "midi") {
            text(this.midiName + 12 * currentPlayOctave, this.x, this.y);
        }
        else if (labelStyle === "intervals") {
            const offset = noteNames.indexOf(currentKey);
            const intervalName = intervalNames[(this.midiName - offset) % 12];
            text(intervalName, this.x, this.y);
        }

        //extra text above
        push();
        textSize(11);
        fill(hexNoteColor(this, "dark"));

        if (currentTuning != tuning12tet) {
            const offset = noteNames.indexOf(currentKey);
            const intervalName = currentTuning[(this.midiName - offset) % 12];

            let topText = intervalName;
            if (topText == 1) {
                topText = "";
            }
            text(topText, this.x, this.y - 25);
        }
        pop();
    }

    hexDragOffsetIndicator() {
        //extra control text
        push();
        //textSize(12);

        let xMapped = 0;
        let yMapped = 0;

        if (this.touchStartX >= 0 && this.touchStartY >= 0 && this.touchDragX >= 0 && this.touchDragY >= 0)
        {
            xMapped = dragDistanceMap(this.x, this.touchStartX, this.touchDragX, 5, 40);
            yMapped = dragDistanceMap(this.y, this.touchStartY, this.touchDragY, 5, 40);

            // if (xMapped !== 0) {
            //     retune(this, xMapped);
            // }
            // if (yMapped !== 0) {
            //     sampler.volume.value = map(xMapped, -1, 1, -20, 20);
            // }

            let circleColor = color(hexNoteColor(this, "light"));
            circleColor.setAlpha(60);
            fill(circleColor);

            const distance = dist(this.x, this.y, this.touchDragX, this.touchDragY)
            ellipse(this.touchDragX, this.touchDragY, 30 + distance * 1.5);
        }

        //text(xMapped, this.x, this.y - 30);
        //text(yMapped, this.x, this.y + 30);

        pop();
    }
}

function dragDistanceMap(center, start, drag, min, max) {
    if (drag > start) {
        return map(drag, start + min, center + max, 0, 1, true);
    }
    else {
        return map(drag, center - max, start - min, -1, 0, true);
    }
}

function findNearestHex(touch) {

    let arr = showButtons ? [...buttons] : [...hexagons];

    let arrNearest = arr[0];
    let inDistance = false;
    const minDistance = r * 0.85;

    //do for just one touch
    if (!mouseUsed) {

        arr.forEach((h) => {

            const hexDistance = h.distanceToTouch(touch);
            if (hexDistance < minDistance) {
                inDistance = true;

                if (hexDistance < arrNearest.distanceToTouch(touch)) {
                    arrNearest = h;
                }
            }
        });
    }

    //pc
    else {
        arr.forEach((h) => {
            if (h.distanceToMouse < minDistance) {
                inDistance = true;

                if (h.distanceToMouse < arrNearest.distanceToMouse) {
                    arrNearest = h;
                }
            }
        });
    }

    if (inDistance) {
        return arrNearest;
    }
}

function hexInChord(h, chord) {
    let isInChord = false;

    chord.forEach((c) => {
        if (c !== undefined && c.midiName === h.midiName) {
            isInChord = true;
        }
    });

    return isInChord;
}

function buttonShape(x, y, r, fillColor) {
    push()
    fill(fillColor)
    if (circleMode === true) {
        ellipse(x, y, r * 0.95);
    } else {
        strokeWeight(r * 0.3);
        stroke(fillColor);
        strokeJoin(ROUND)
        hexagon(x, y, r * 0.38);
    }
    pop()
}

function controlShape(x, y, r) {
    rect(x, y, r * 0.7, r * 0.4, r * 0.1);
}

function hexagon(x, y, r) {
    beginShape();
    for (let a = 0; a < 2 * PI; a += (2 * PI) / 6) {
        let x2 = cos(a) * r;
        let y2 = sin(a) * r;
        vertex(x + x2, y + y2);
    }
    endShape(CLOSE);
}

function hexagonTop(x, y, r) {
    beginShape();
    for (let a = 1 * PI; a < 2 * PI; a += (2 * PI) / 6) {
        let x2 = cos(a) * r;
        let y2 = sin(a) * r;
        vertex(x + x2, y + y2);
    }
    endShape();
}

function gradientCircle(cInner, sInner, cOuter, sOuter, x, y, steps) {
    push();
    noStroke();
    for (let s = 0; s < steps; s++) {
        const mixColor = lerpColor(cOuter, cInner, s / (steps*1.5));
        const mixSize = lerp(sOuter, sInner, s / steps);
        fill(mixColor);
        ellipse(x, y, mixSize*1);
    }
    pop();
}

function pagesText() {
    textSize(21);
    textAlign(LEFT, CENTER);


    // base text
    let pageText = "";
    for (b = 0; b < pages.length; b++) {
        pageText += pages[b].length;
    }
    text(pageText, 10, -44); //44
}

function scaleText() {
    textSize(15);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);

    let scaleText = currentKey;
    scaleText +=    (currentPlayOctave+1) + " – ";
    scaleText += scaleMode.toUpperCase() + " – ";
    scaleText += tuneMode.toUpperCase();

    text(scaleText, 72, 18);
}

function synthText() {
    textSize(15);
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);

    let synthText = currentOscType.toUpperCase();

    text(synthText, width - 10, -18); //18
}

function playText() {
    textSize(15);
    textAlign(RIGHT, CENTER);
    textStyle(NORMAL);
    noStroke();

    let info = "Play Solo";

    // find nearest button
    hoverHex = findNearestHex();

    if (hoverHex !== undefined) {
        // hovering over button
        if (hoverHex.type === "control") {
            buttons.forEach((b) => {
                if (b.name === hoverHex.name) {
                    info = b.description;
                }
            });
        }
    }

    // if there is an active chord, list the notes
    else if (activeChord.length > 0) {
        info = "Chord ";
        let prevOctave = activeChord[0].octave;

        for (let a = 0; a < activeChord.length; a++) {
            if (activeChord[a].octave !== prevOctave) {
                info += ", ";
            } else {
                info += " ";
            }
            prevOctave = activeChord[a].octave;
            info += activeChord[a].pitchName;
        }
    } else if (activePage >= 0) {
        // chord mode with empty chord
        info = "Chord Mode - Page " + (activePage + 1);
    } else if (lastPlayedNote.length > 0) {
        info = "Played " + lastPlayedNote + " (" + (lastPlayedHex.midiName + 12 * currentPlayOctave) + ")";
    }

    info += " – " + currentSampler;

    text(info, width - 72, 18); //44
}

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

function mousePressed() {
    //fullscreen(true);
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

function scaleFreqToCents(freq) {
    return Math.log2(freq) * 1200;
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
        dragOrder = [];
    }
    else {
        return false;
    }
}