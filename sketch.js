let canvas;
let cooldownFrames = 3; // this animation time also blocks double taps
let readyForSound = false; //only play sound when ready
let drawMinDuration = 20; //

let gridBaseMidi = 24;
let gridWidth = 19;
let gridIncrement_H = 1;
let gridIncrement_D = 4;
let gridIncrement_V = 7;
let gridXYswapped = false;

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
    "Move Key", "Toggle", "Scales", "Octave", "Labels", "Color", "GridXY", "Shape", "+",
    "EDO 12", "JI 12", "Mode 12","/19 Novem","/16 NEJI","/11 Undec","/11 Snow","+","+",
    "EDO 19", "JI 31", "Astral 21", "EDO 24", "JI 24", "+", "+", "+", "+",
    "Piano", "Rhodes", "Organ", "Harp", "Sawtooth", "Square", "Triangle", "Sine", "+",
];

const noteNames = [
    "C","C#","D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];
const intervalNames = [
    "1", "m2", "2", "m3", "3", "4", "TT", "5", "m6", "6", "m7", "7",
];
const intervalNames19tet = [
    "1", "a1", "m2", "2", "s3", "m3", "3", "a3", "4", "tt", "TT", "5", "a5", "m6", "6", "M6", "m7", "7", "d8",
];
const intervalNames24tet = [
    "1", "-2", "m2", "~2", "2", "-3", "m3", "~3", "3", "+3", "4", "+4", "TT", "-5", "5", "-6", "m6", "~6", "6", "-7", "m7", "~7", "7", "-8",
];
const intervalNames31tet = [
    "1", "+1", "-2", "m2", "~2", "2", "+2", "-3", "m3", "~3", "3", "+3", "-4", "4", "+4", "tt", "TT", "-5", "5", "+5", "-6", "m6", "~6", "6", "+6", "-7", "m7", "~7", "7", "+7", "-8",
];
//const intervalNames31tet = [
//    "1", "", "", "m2", "n2", "2", "S2", "s3", "m3", "n3", "3", "", "", "4", "", "", "", "", "5", "", "s6", "m6", "n6", "6", //"", "h7", "m7", "n7", "7", "", "",
//];

const baseFrequency = 32.70 //C1
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
const tuning31ji = [ //7-limit by Adriaan Fokker
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
    "7/6", //6/5, 15/13
    "6/5",
    "11/9",
    "5/4",
    "9/7", //13/10
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
    "16/9", //9/5
    "11/6",
    "15/8",
    "35/18" //27/14
];

const scaleMajor = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const scaleMinor = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
const scaleChromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const scaleMajor19 = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
const scaleMajor24 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
const scaleMajor31 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
const scalePrimal21 = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0];

const layoutColorsFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; //next hue after every fifth

const backgroundColor = "#050314";
const outColor = "#56459A";
const darkOutColor = "#493C94";
const lightOutColor = "#E8D1FF";
const midColor = hexColors[10];
const buttonBaseColor = "#190E43A0";
document.bgColor = backgroundColor;

let scaleMode = "chromatic";
let roundKeyMode = false;
let colorMode = "major";

let tuneMode = "12tet";
let currentTuning = tuning12tet;

let currentScale = scaleChromatic.slice();
let scaleCustom = currentScale.slice(); //generate with toggle tool
let currentKey = "C"; //wip store as numerical offset instead
let currentOctave = 0;
let labelStyle = "intervals";


// wip: make these not quite be hexagons, only store swipe data here etc.
let pressedButtons = new Array;
let lastPressedButtons = new Array;


// permanent key grid
let gridSizeX, gridSizeY;
let keyArr = new Array;
let controlsArr = new Array;

// detect playing
let interactionMode = "play";
let menuIsOpen = false;
let ongoingTouches = new Array;

//mouse
let mouseUsed = false;
let mouseDown = false;

//bridges drawn with pencil
let penPressure = 0;
let penDragStartKey;
let penDragEndKey;
let bridgeKeyPairs = new Set();

//tonejs
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
    //object key is the name (same as hex name)
    //value is also an object with the following keys:

    //touchStartX/Y, touchDragX/Y
    //instrument
};

//const pitchShift = new Tone.PitchShift().toDestination();

function preload() {
    for (let i = 0; i < 32; i++) {
        synthvoices.push(new Tone.PolySynth());
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
        synthvoices[i].set({oscillator: {type: "sawtooth"}});
    }

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
        release: 1,
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

function freeVoice (i) {
    let containsVoice = Object.keys(activeKeys).find(key => activeKeys[key].voice == synthvoices[i]);
    if (containsVoice !== undefined) {
        print ("Removed key: " + containsVoice);
        delete activeKeys[containsVoice];
    }
}


function setup() {
    canvas = createCanvas(1366, 920);
    canvas.parent("canvasContainer");
    strokeWeight(2);

    textAlign(CENTER, CENTER);
    textSize(22);
    textFont("Satoshi");
    textStyle(BOLD);
    rectMode(RADIUS);

    //store the hexagon keys with the correct coordinates and ID
    gridSizeX = 52;
    gridSizeY = sqrt((3 * pow(gridSizeX, 2)) / 4);
    hStartX = -0.5 * gridSizeX;
    let id = 0;

    for (let y = 19 * gridSizeY; y > -50; y -= 2 * gridSizeY) {
        for (let x = 0; x < 28 * gridSizeX; x += 3 * gridSizeX) {
            //even rows
            keyArr.push(new ButtonObj(x + hStartX, y + 1.8 * gridSizeY, gridSizeX, "note", id++));
            //odd rows
            if (x < 26 * gridSizeX) {
                keyArr.push(new ButtonObj(x + hStartX + 1.5 * gridSizeX, y + 0.8 * gridSizeY, gridSizeX, "note", id++));
            }
        }
    }

    //create buttons with negative IDs
    const rows = 9;
    for (let b = 0; b < rows; b++) {
        controlsArr.push(new ButtonObj(gridSizeX*2.0, 2.5*gridSizeY + b*gridSizeY*1.7, gridSizeX, "control", -(b + 1)));
        controlsArr.push(new ButtonObj(gridSizeX*4.5, 2.5*gridSizeY + b*gridSizeY*1.7, gridSizeX, "control", -(b + 1 + rows)));
        controlsArr.push(new ButtonObj(gridSizeX*7.0, 2.5*gridSizeY + b*gridSizeY*1.7, gridSizeX, "control", -(b + 1 + rows*2)));
        controlsArr.push(new ButtonObj(gridSizeX*9.5, 2.5*gridSizeY + b*gridSizeY*1.7, gridSizeX, "control", -(b + 1 + rows*3)));
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

    //run once to show starting screen
    noLoop();
    draw();
}


function handleStart(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        if (newTouches[i].clientX > width - 72 && newTouches[i].clientY < 72) { return };
        //print("touchstart: " + i);
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

        if (idx >= 0) {
            //print("continuing touch " + idx);
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

        //clear and stop everything when tap in top right
        if (newTouches[i].clientX > width - 72 && newTouches[i].clientY < 72) {
            pressedButtons = [];
            lastPressedButtons = [];
            activeKeys = {};
            ongoingTouches = [];
            synthvoices.forEach(v => {
                v.triggerRelease();
            });
            keyArr.forEach((h) => {
                playKey(h, "release");
            });
        }

        const idx = ongoingTouchIndexById(newTouches[i].identifier);
        
        if (idx >= 0) {
            //print("removing touch " + idx);
            ongoingTouches.splice(idx, 1);
        }
    }

    drawMinDuration = 20;
    loop();
}

function handleCancel(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const idx = ongoingTouchIndexById(newTouches[i].identifier);
        
        if (idx >= 0) {
            //print("removing touch " + idx);
            ongoingTouches.splice(idx, 1);
        }
    }
    drawMinDuration = 20;
    loop();
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
    runKeys();

    if (drawMinDuration > 0) {
        drawMinDuration--;
    } else {
        noLoop();
        drawMinDuration = 20;

        if (instrumentType == "synth") {
            for (let i = 0; i < 32; i++) {
                freeVoice(i);
            }
            print("Remaining active key objects: " + Object.values(activeKeys));
        }
    }
}

function runKeys() {
    background(backgroundColor);
    let optionsBG = color(backgroundColor);
    optionsBG.setAlpha(230);

    // Render buttons when left icon pressed
    if (ongoingTouches.length > 0 && ongoingTouches[0].clientX < 72 && ongoingTouches[0].clientY < 72)
    {
        // show controls on the left
        menuIsOpen = true;

        if (mouseUsed === false) {
            reactToPressedControls()
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
        rect(300, 420, 265, 350, 20);
        optionsBG.setAlpha(50);
        background(optionsBG);

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
    }
    else
    {
        //don"t show the controls
        menuIsOpen = false;

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
    }

    //top left and right corner icons
    push();
    noStroke();
    optionsBG.setAlpha(150);
    fill(optionsBG);
    ellipse(36, 36, 60);
    ellipse(width-36, 36, 60);
    strokeWeight(6)
    stroke(color("#5027A9"));
    noFill();
    ellipse(36, 36, 30);
    ellipse(width-36, 36, 30);
    pop();

    //lines at the top showing scale;
    drawScaleLines();

    //text info in corners
    //optionsBG.setAlpha(80);
    //fill(optionsBG);
    //noStroke();
    //rect(0, height-16, 300, 16);
    cornerText();
}


function renderKeyBridges() {
    push();
    noStroke();
    //lines between pressedButtons
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

            //go through hexagons to find matching ones
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
    //update which buttons are hovered over/ pressed
    lastPressedButtons = pressedButtons.slice();
    pressedButtons = [];

    for (let i = 0; i < ongoingTouches.length; i++) {
        nearestHex = findNearestButton(ongoingTouches[i], controlsArr);
        if (nearestHex !== undefined) {
            pressedButtons.push(nearestHex);
        }
    }

    //find unique items in each
    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);

    if (attackedKeys.length > 0)
    {
        // see if a button is hovered closest
        controlsArr.forEach((b) => {
            if (b.name === pressedButtons[0].name) {
                controlPressed(b);
                //b.countdown = cooldownFrames;
            }
        });
    }
}


function reactToPressedKeys() {
    //update which buttons are hovered over/ pressed
    lastPressedButtons = pressedButtons.slice();
    pressedButtons = [];

    let touchesOnHex = 0;

    for (let i = 0; i < ongoingTouches.length; i++) {

        nearestHex = findNearestButton(ongoingTouches[i], keyArr)
        if (nearestHex !== undefined) {
            pressedButtons.push(nearestHex);

            //pass the latest x and y values of that touch to the hex
            pressedButtons[touchesOnHex].touchDragX = ongoingTouches[i].clientX;
            pressedButtons[touchesOnHex].touchDragY = ongoingTouches[i].clientY;
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
        if (penDragStartKey !== undefined && penDragEndKey !== undefined) {

            const startName = penDragStartKey.name;
            const endName = penDragEndKey.name;
            const newNamePair = startName + " " + endName;
            const reverseNamePair = endName + " " + startName;
            if (bridgeKeyPairs.has(newNamePair)) {
                //remove
                bridgeKeyPairs.delete(newNamePair);
                print(bridgeKeyPairs.size);
                print("Removed " + newNamePair);
            }
            else if (bridgeKeyPairs.has(reverseNamePair)) {
                //remove
                bridgeKeyPairs.delete(reverseNamePair);
                print(bridgeKeyPairs.size);
                print("Removed " + reverseNamePair);
            }
            else {
                //add
                bridgeKeyPairs.add(newNamePair);
                print(bridgeKeyPairs.size);
                print("Added " + newNamePair);
            }
        }

        penDragStartKey = undefined;
        penDragEndKey = undefined;
    }
}

function uniqByKeepFirst(a, key) {
    // from https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}


function detectMouse() {
    //write new later
}

function reactToPen() {
    //clean up duplicates
    pressedButtons = uniqByKeepFirst(pressedButtons, p => p.name);

    //find unique items in each
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
                    //there is a start hex already, update the end one instead
                    penDragEndKey = h;
                }
            }
        });
    }
}


function reactToTouch() {
    //only when hexagons are shown

    //clean up duplicates and sort
    pressedButtons = uniqByKeepFirst(pressedButtons, p => p.name);
    pressedButtons.sort((a, b) => a.name - b.name);


    //find unique items in each
    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);
    const releasedKeys = lastPressedButtons.filter(p => pressedButtons.find(l => {return l.name == p.name}) === undefined);
    const sameKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) !== undefined);

    //find key and press
    for (let play = 0; play < attackedKeys.length; play++) {
        const playHex = attackedKeys[play];
        keyArr.forEach((h) => {
            if (h.name === playHex.name) {
                keypressed(h);
            }
        });
    }

    //release audio of key and reset drag values
    for (let endplay = 0; endplay < releasedKeys.length; endplay++) {
        const removedHex = releasedKeys[endplay];
        keyArr.forEach((h) => {
            if (h.name === removedHex.name) {
                if (interactionMode === "play") {
                    playKey(h, "release");
                }
            }
        });
    }

    if (interactionMode === "play" && instrumentType === "synth") {
        //detect movement on same keys
        for (let sameplay = 0; sameplay < sameKeys.length; sameplay++) {
            const sameHex = sameKeys[sameplay];
            keyArr.forEach((h) => {
                if (h.name === sameHex.name) {
                    dragValuesInActive(h);
                    bendKeys();
                }
            });
        }
    }
}


function keypressed(h) {

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

    // play the note normally
    else {
        playKey(h);
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
    }
    else {
        if (mode === "release") {
            activeKeys[h.name].voice.triggerRelease(pPitch);
            delete activeKeys[h.name].dragValues;
        } else {
            //play note
            for (let i = 0; i < 32; i++) {
                let containsVoice = Object.values(activeKeys).find(key => {return key.voice === synthvoices[i]});

                //in free slot
                if (containsVoice == undefined) {
                    activeKeys[h.name] = {"key": h, "voice": synthvoices[i]};

                    print(i + "-voice")
                    activeKeys[h.name].voice.triggerAttack(pPitch);
                    break;
                }
            }
        }
        print(Object.values(activeKeys));
        //print(activeKeys);
    }
}

function dragValuesInActive(h) {

    if (activeKeys[h.name] == undefined) {
        print("No active note to apply key drag on!")
        return;
    }

    //find touch that is in range in both X and Y
    for (let i = 0; i < ongoingTouches.length; i++) {

        const touchX = ongoingTouches[i].clientX;
        const touchY = ongoingTouches[i].clientY;
        const centerOffsetX = h.x - touchX;
        const centerOffsetY = h.y - touchY;

        //in range
        if (Math.abs(centerOffsetX) < 15 && Math.abs(centerOffsetY) < 15) {

            //already has start saved?
            let hasDragStart = Object.values(activeKeys).find(key => {return key.dragValues !== undefined});
            
            if (hasDragStart) {
                //use start values to calculate drag offset
                const diffX = touchX - activeKeys[h.name].dragValues.startX;
                const diffY = touchY - activeKeys[h.name].dragValues.startY;
                activeKeys[h.name].dragValues.dragX = diffX;
                activeKeys[h.name].dragValues.dragY = diffY;
            }
            else {
                //set all to start value
                const startX = touchX;
                const startY = touchY;
                activeKeys[h.name].dragValues = {"startX": startX, "startY": startY};
            }
            print(activeKeys[h.name].dragValues);
            return;
        }
    }
    return ("No touch found in range!");
}

function bendKeys() {
    Object.values(activeKeys).forEach(a => {

        const keyHasBeenDragged = (a.dragValues !== undefined && a.dragValues.dragX !== undefined);

        if (keyHasBeenDragged) {
            const detuneCents = dragDistanceMap(a.key.x, a.dragValues.startX, a.dragValues.dragX, 5, 40) * 100;
            print("detuning by: " + detuneCents)
            ellipse(a.key.x + detuneCents, a.key.y, 30);
            a.voice.set({ detune: detuneCents });
        }
    });
}


function controlPressed(b) {
    instrument.releaseAll();
    const rows = 9;

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
                print("Toggle notes");
                if (interactionMode === "edit") {
                    interactionMode = "play";
                } else {
                    interactionMode = "edit";
                }
                break;
            case 3:
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
            case 4:
                print("Changed octave");
                currentOctave++;
                if (currentOctave == 3) {currentOctave = 0;}
                break;
            case 5:
                print("Changed label style");
                if (labelStyle === "notes") {labelStyle = "intervals";}
                else {labelStyle = "notes";}
                break;
            case 6:
                print("Changed color theme!");
                if (colorMode === "fifths") {colorMode = "major";}
                else if (colorMode === "major") {colorMode = "fifths";}
                //else {colorMode = "chromatic";}
                break;
            case 7:
                print("Switched to different midi to grid XY layout");
                gridXYswapped = !gridXYswapped;
                calculateNewMidiGrid(gridIncrement_D, gridIncrement_V);
                break;
            case 8:
                print("switched shape of keys!");
                roundKeyMode = !roundKeyMode;
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
                currentOctave = 0;
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
                    synthvoices[i].set({oscillator: {type: "sawtooth"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
            case 6:
                print("Switched to square wave!");
                currentInstrument = "square";
                synth.set({"oscillator": {"type": "square"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({oscillator: {type: "square"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
            case 7:
                print("Switched to triangle wave!");
                currentInstrument = "triangle";
                synth.set({"oscillator": {"type": "triangle"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({oscillator: {type: "triangle"}});
                }
                instrument = synth;
                instrumentType = "synth";
                break;
            case 8:
                print("Switched to sine wave!");
                currentInstrument = "sine";
                synth.set({"oscillator": {"type": "sine"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({oscillator: {type: "sine"}});
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
    //play root
    const root = baseFrequency * eval(currentTuning[0]) * 2 ** 2;
    instrument.triggerAttackRelease(root, "16n");

    intervals.forEach(i => {
        const freq = baseFrequency * eval(currentTuning[i]) * 2 ** 3;
        instrument.triggerAttackRelease(freq, "16n");
    });
}

function calculateNewMidiGrid(small, big) {

    gridBaseMidi = currentTuning.length * 2;
    gridIncrement_H = 2 * small - big;;
    gridIncrement_D = small;
    gridIncrement_V = big;

    if (gridXYswapped == false) {
        keyArr.forEach((h) => {
            h.setMidiFromGrid(gridBaseMidi, gridWidth, gridIncrement_H, gridIncrement_D, gridIncrement_V);
        });
    } else {
        keyArr.forEach((h) => {
            h.setMidiFromGrid(gridBaseMidi, gridWidth, gridIncrement_V, gridIncrement_D, gridIncrement_H);
        });
    }
}


function pickScale(pitch, mode) {
    //start from note
    const offset = noteNames.indexOf(pitch);

    //WIP: make this compatible with other octave sizes
    if (mode === "chromatic" || currentTuning.length != 12) {
        currentScale = new Array(currentTuning.length).fill(1); //all notes are on
        scaleMode = "chromatic"; //in case it isn't already!
    } else {
        for (let i = 0; i < 12; i++) {
            if (mode === "major") {
                currentScale[(i + offset) % 12] = scaleMajor[i];
            } else if (mode === "minor") {
                currentScale[(i + offset) % 12] = scaleMinor[i];
            } else if (mode === "custom") {
                currentScale[(i + offset) % 12] = scaleCustom[i];
            }
        }
    }
}


function toggleNoteInScale(h) {
    if (currentTuning.length == 12) {
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
    } else {
        print("Tuning needs to be 12 notes long for this!");
    }
}


function keyColorFromPalette(h, style) {
    let palette = new Array;
    let darkPalette = new Array;
    let darkerPalette = new Array;
    let lightPalette = new Array;

    if (colorMode !== "chromatic") {

        //how to translate the colors?
        let cTable;

        if (currentTuning.length == 12) {
            if (colorMode === "major")
            {
                cTable = scaleMajor.slice();
                for (let c = 0; c < cTable.length; c++) {
                    if ((h.octave + currentOctave) % 2 == 0) {
                        cTable[c] = (cTable[c] == 1) ? 1 : 10;
                    } else {
                        cTable[c] = (cTable[c] == 1) ? 2 : 7;
                    }
                }
            }
            else if (colorMode === "fifths")
            {
                cTable = layoutColorsFifths.slice()
            }
        } else {
            if (currentTuning.length == 19) {cTable = scaleMajor19.slice();}
            else if (currentTuning.length == 24) {cTable = scaleMajor24.slice();}
            else if (currentTuning.length == 31) {cTable = scaleMajor31.slice();}
            else if (currentTuning == tuning21Astral) {cTable = scalePrimal21.slice();}
            else {cTable = new Array(currentTuning.length).fill(0);}

            for (let c = 0; c < cTable.length; c++) {
                if ((h.octave + currentOctave) % 2 == 0) {
                    cTable[c] = (cTable[c] == 1) ? 1 : 10;
                } else {
                    cTable[c] = (cTable[c] == 1) ? 2 : 7;
                }
            }
        }

        for (let i = 0; i < cTable.length; i++) {
            let lookup = cTable[i];

            palette.push(hexColors[lookup]);
            darkPalette.push(darkHexColors[lookup]);
            darkerPalette.push(darkerHexColors[lookup]);
            lightPalette.push(lightHexColors[lookup]);
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

    //color according to on/off state in current scale
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


function drawScaleLines() {
    const hLength = 400;
    const startX = (width - hLength) / 2;
    const endX = (width + hLength) / 2;
    const startY = 13;

    push()
    noStroke();
    fill(backgroundColor);
    rect(width / 2 - 12, startY, 202, 13, 100)

    //WIP: adjust with octave length
    const octaveLength = currentTuning.length;

    let getXValue = (fr) => map(scaleFreqToCents(fr+1), 0, 1200, startX, endX);

    for (let j = 0; j < 12; j++) {
        const compareFreq = 2 ** (j/12) - 1;
        const xCompareValue = getXValue(compareFreq);

        gradientCircle(
            lerpColor(color("black"), color("#3E1C87"), 0.2),
            0,
            lerpColor(color("black"), color("#3E1C87"), 0.7),
            16,
            xCompareValue,
            startY, 5);
    }

    for (let i = 0; i < octaveLength; i++) {
        let freq = eval(currentTuning[i]) - 1;

        let size = 7;
        push();
        noStroke();
        let fillC = color("white");

        const offset = noteNames.indexOf(currentKey);

        //color,new
        const inKlickedHexes = pressedButtons.find(t => (t.midiName % octaveLength) === ((i+offset) % octaveLength) && t.countdown > 0);
        const inHoverHexes = pressedButtons.find(t => (t.midiName % octaveLength) === ((i+offset) % octaveLength));

        if (inKlickedHexes == undefined) {
            let darkHexColor;
            let cTable;

            if (octaveLength == 12) {
                cTable = scaleMajor.slice();
                for (let c = 0; c < cTable.length; c++) {
                    cTable[c] = (cTable[c] == 1) ? 2 : 7;
                }

                if (colorMode === "fifths") {cTable = layoutColorsFifths;}

            } else {
                if (octaveLength == 19) {cTable = scaleMajor19.slice();}
                else if (octaveLength == 24) {cTable = scaleMajor24.slice();}
                else if (octaveLength == 31) {cTable = scaleMajor31.slice();}
                else if (currentTuning == tuning21Astral) {cTable = scalePrimal21.slice();}
                else {cTable = new Array(octaveLength).fill(0);}

                for (let c = 0; c < cTable.length; c++) {
                    cTable[c] = (cTable[c] == 1) ? 2 : 7;
                }
            }

            const colorIndex = cTable[i % currentTuning.length];
            darkHexColor = color(darkHexColors[colorIndex]);

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

    renderKeyType(state) {
        push();
        noStroke();

        let innerColor = color(keyColorFromPalette(this, "dark"));
        let midColor = lerpColor(innerColor, color("black"), 0.2);
        let outerColor = color(keyColorFromPalette(this, "darker"));

        //note states
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
                    color(keyColorFromPalette(this, "light")), 0,
                    midColor, this.r * 1.45,
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
                    color(keyColorFromPalette(this, "light") + "06"), this.r * 0.5,
                    color(keyColorFromPalette(this, "light") + "06"), this.r * 2.6,
                    this.x, this.y, 14);
                break;
        }
        pop();
    }

    renderControlType(state) {
        push();
        strokeWeight(2);
        stroke("black");

        //button states
        switch (state) {
            case "hidden":
                fill(backgroundColor);
                noStroke();
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
                fill("#170744d0");
                controlShape(this.x, this.y, this.r * 1.7);
                break;
            case "active":
                fill("#3E1C87");
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

        //shadow
        strokeWeight(4);
        stroke("#00000050");
        strokeJoin(ROUND);
        fill("#00000050");
        this.renderKeyText();

        noStroke();
        if (state === "hover") {
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
        this.hexDragOffsetIndicator();
        pop();
    }

    get findKeyVariant() {
        if (menuIsOpen) {return "idle";};
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName && t.countdown > 0);
        const inHoverHexes = pressedButtons.find(t => t.midiName === this.midiName);
        const differentOctaveHexes = pressedButtons.find(t => t.midiName % currentTuning.length === this.midiName % currentTuning.length);

        if (inKlickedHexes !== undefined) {
            return "klicked";
        } else if (inHoverHexes !== undefined) {
            return "hover";
        } else if (this.pitchName === currentKey && interactionMode === "key") {
            return "selected";
        } else if (differentOctaveHexes !== undefined) {
            return "differentOctave";
        } else {
            return "idle";
        }
    }


    renderControlVariant() {
        const inHoverButtons = pressedButtons.find(t => t.name === this.name);

        if (rControlNames[-this.name] === "") {
            this.renderControlType("hidden");
        } else if (this.countdown > 0) {
            this.renderControlType("klicked");
        } else if (this.isControlOn && inHoverButtons !== undefined) {
            this.renderControlType("activehover");
        } else if (this.isControlOn) {
            this.renderControlType("active");
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

        if (inKlickedHexes !== undefined) {
            this.renderKeyType("glow");
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
        const onConditions = [
            false,
            false,
            (interactionMode === "key"),
            (interactionMode === "edit"),
            false,
            false,
            false,
            false,
            false,

            (tuneMode === "12tet"),
            (tuneMode === "simple"),
            (tuneMode === "harmonic"),
            (tuneMode === "novemdecimal"),
            (tuneMode === "16neji"),
            (tuneMode === "undecimal"),
            (tuneMode === "11neji"),
            false, 
            false,

            (tuneMode === "19tet"),
            (tuneMode === "31ji"),
            (tuneMode === "21astral"),
            (tuneMode === "24tet"),
            (tuneMode === "24ji"),
            false,
            false,
            false,
            false,

            (currentInstrument === "piano"),
            (currentInstrument === "rhodes"),
            (currentInstrument === "organ"),
            (currentInstrument === "harp"),
            (currentInstrument === "sawtooth"),
            (currentInstrument === "square"),
            (currentInstrument === "triangle"),
            (currentInstrument === "sine"),
            false
        ]

        for (let i = 0; i < onConditions.length; i++) {
            if (i == -this.name-1) {
                return onConditions[i];
            }
        }
        return true;
    }


    renderControlText() {
        push();
        noStroke();
        const stateColor = (this.isControlOn) ? "#D5B9F2" : "#AA6EF5";
        fill(stateColor);

        textSize(19);
        text(rControlNames[-this.name-1], this.x, this.y);
        pop();
    }

    renderKeyText() {
        const octaveLength = currentTuning.length;
        if (octaveLength == 12) {
            if (labelStyle === "notes")
            {
                if (this.pitchName == currentKey) {
                    text(this.pitchName + (this.octave + currentOctave), this.x, this.y);
                }
                else {
                    text(this.pitchName, this.x, this.y);
                }
            }
            else if (labelStyle === "midi") {
                text(this.midiName + octaveLength * currentOctave, this.x, this.y);
            }
            else if (labelStyle === "intervals") {
                const offset = noteNames.indexOf(currentKey);
                const intervalName = intervalNames[(this.midiName - offset) % 12];
                text(intervalName, this.x, this.y);
            }
        } else {
            if (labelStyle === "intervals") {
                const offset = noteNames.indexOf(currentKey);
                let intervalNamesTable;
                if (octaveLength == 19) {intervalNamesTable = intervalNames19tet.slice();}
                else if (octaveLength == 24) {intervalNamesTable = intervalNames24tet.slice();}
                else if (octaveLength == 31) {intervalNamesTable = intervalNames31tet.slice();}
                else {intervalNamesTable = new Array(octaveLength).fill((this.midiName - offset) % octaveLength + 1);}
                
                const intervalName = intervalNamesTable[(this.midiName - offset) % octaveLength];
                text(intervalName, this.x, this.y);
            } else {
                text(this.pitchName, this.x, this.y);
            }
        } 

        //extra text above
        push();
        textSize(11);
        fill(keyColorFromPalette(this, "dark"));

        if (currentTuning != tuning12tet &&
                currentTuning != tuning19tet &&
                currentTuning != tuning24tet) {
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


    hexDragOffsetIndicator() {
        //extra control text
        //push();
        ////textSize(12);
//
        //let xMapped = 0;
        //let yMapped = 0;
//
        //if (this.touchStartX >= 0 && this.touchStartY >= 0 && this.touchDragX >= 0 && this.touchDragY >= 0)
        //{
        //    xMapped = dragDistanceMap(this.x, this.touchStartX, this.touchDragX, 5, 40);
        //    yMapped = dragDistanceMap(this.y, this.touchStartY, this.touchDragY, 5, 40);
//
        //    // if (xMapped !== 0) {
        //    //     retune(this, xMapped);
        //    // }
        //    // if (yMapped !== 0) {
        //    //     instrument.volume.value = map(xMapped, -1, 1, -20, 20);
        //    // }
//
        //    let circleColor = color(keyColorFromPalette(this, "light"));
        //    circleColor.setAlpha(60);
        //    fill(circleColor);
//
        //    const distance = dist(this.x, this.y, this.touchDragX, this.touchDragY)
        //    ellipse(this.touchDragX, this.touchDragY, 30 + distance * 1.5);
        //}
        ////text(xMapped, this.x, this.y - 30);
        ////text(yMapped, this.x, this.y + 30);
        //pop();
    }
}

function dragDistanceMap(center, start, drag, min, max) {
    if (drag > start) {
        return map(start + drag, start + min, center + max, 0, 1, true);
    }
    else {
        return map(start + drag, center - max, start - min, -1, 0, true);
    }
}


function findNearestButton(touch, arr) {

    //minimum distance is a weird way to measure which button is hit, wip
    const minDistance = gridSizeX * 0.85;
    let closestButton;

    if (!mouseUsed && touch != undefined) {
        arr.forEach((h) => {
            if (h.distanceToTouch(touch) < minDistance) {closestButton = h;}
        });
    }
    else {
        arr.forEach((h) => {
            if (h.distanceToMouse < minDistance) {closestButton = h;}
        });
    }

    if (closestButton != undefined) {
        //print("Found " + closestButton.distanceToTouch(touch));
        return closestButton;
    } else {
        //print("No hexagon found in reach!");
    }
}


function keyShape(x, y, r, fillColor) {
    push()
    fill(fillColor)
    if (roundKeyMode === true) {
        ellipse(x, y, r * 0.99);
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

//function hexagonTop(x, y, r) {
//    beginShape();
//    for (let a = 1 * PI; a < 2 * PI; a += (2 * PI) / 6) {
//        let x2 = cos(a) * r;
//        let y2 = sin(a) * r;
//        vertex(x + x2, y + y2);
//    }
//    endShape();
//}

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

    let playText = "";
    if (pressedButtons.length > 0 && !menuIsOpen) {
        // show which buttons are pressed
        playText = Object.values(activeKeys).length + " - ";
        for (let b = 0; b < pressedButtons.length; b++) {
            const button = pressedButtons[b];
            playText += (button.pitchName + "(" + (button.octave + currentOctave)) + ") ";
        }
    } else {
        //show general info
        playText = currentKey + (currentOctave) + " – " + capitalize(tuneMode);
    }

    const xOffset = 15;
    const yOffset = height - 18;

    textAlign(LEFT, CENTER);

    stroke(backgroundColor);
    strokeJoin(ROUND);
    strokeWeight(8);
    text(playText, xOffset, yOffset);

    noStroke();
    fill(color("#5027A9"));
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