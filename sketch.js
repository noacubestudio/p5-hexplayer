let canvas;
let cooldownFrames = 3; // this animation time also blocks double taps
let readyForSound = false; //only play sound when ready
let drawMinDuration = 20; //

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
    "Move Key",
    "Toggle",
    "Scales",
    "Octave",
    "Labels",
    "Color",
    "GridXY",
    "+",
    "+",
    "EDO 12",
    "JI 12",
    "Mode 12",
    "/19 Novem",
    "/16 NEJI",
    "/11 Undec",
    "/11 Snow",
    "+",
    "+",
    "Piano",
    "Rhodes",
    "Organ",
    "Harp",
    "Sawtooth",
    "Square",
    "Triangle",
    "Sine",
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

const scaleMajor = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const scaleMinor = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
const scaleChromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const layoutColorsThirds = [0, 7, 7, 11, 1, 7, 10, 7, 2, 9, 7, 7];
const layoutColorsMajor = [1, 10, 1, 10, 1, 1, 10, 1, 10, 1, 10, 1];
const layoutColorsMajor2 = [2, 7, 2, 7, 2, 2, 7, 2, 7, 2, 7, 2];
const layoutColorsFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

const backgroundColor = "#050314";
const outColor = "#56459A";
const darkOutColor = "#493C94";
const lightOutColor = "#E8D1FF";
const midColor = hexColors[10];
const activeColor = "#E8D1FF";
const darkStrokeColor = "#190E43A0";
document.bgColor = backgroundColor;

let scaleMode = "chromatic";
let circleMode = true;
let colorMode = "major";

let currentTuning = tuningSimple;

let currentScale = scaleChromatic.slice();
let scaleCustom = currentScale.slice(); //generate with toggle tool

let currentKey = "C";
let currentOctave = 0;
let labelStyle = "intervals";

// permanent key grid
let gridSizeX, gridSizeY;
let keyArr = new Array;
let controlsArr = new Array;

// detect playing
let interactionMode = "play";
let menuIsOpen = false;

let ongoingTouches = new Array;
let pressedButtons = new Array;
let lastPressedButtons = new Array;

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

let instrument;
let currentInstrument = "piano";

//const pitchShift = new Tone.PitchShift().toDestination();

function preload() {
    synth = new Tone.PolySynth({
    "volume": -10,
    "envelope": {
        "attack": 0,
        "decay": 0,
        "sustain": 0.3,
        "release": 1,
        }
    }).toDestination();

    synth.set({"oscillator": {"type": "sawtooth"}});

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

    instrument = pianoSampler;
}



function setup() {
    canvas = createCanvas(1366, 890);
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
    hStartX = 1.1 * gridSizeX;
    let id = 0;

    for (let y = 17 * gridSizeY; y > 0; y -= 2 * gridSizeY) {
        for (let x = 0; x < 26 * gridSizeX; x += 3 * gridSizeX) {
            //even rows
            keyArr.push(new ButtonObj(x + hStartX, y + 1.8 * gridSizeY, gridSizeX, "note", id++));
            //odd rows
            if (x < 24 * gridSizeX) {
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
        instrument.triggerAttackRelease("C2", "8n");
        readyForSound = true;
    }
    loop();
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
    loop();
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

    //clear and stop everything when tap in top right
    if (newTouches[0].clientX > width - 72 && newTouches[0].clientY < 72) {
        pressedButtons = [];
        lastPressedButtons = [];
        activeFreqs = [];
        ongoingTouches = [];
        //wip, this still isn't quite working
        keyArr.forEach((h) => {
            playKey(h, "release");
            h.touchStartX = -1;
            h.touchStartY = -1;
            h.touchDragX = -1;
            h.touchDragY = -1;
        });
    }
    loop();
}

function handleCancel(evt) {
    evt.preventDefault();
    print("touch cancel.");
    const newTouches = evt.changedTouches;
    
    for (var i = 0; i < newTouches.length; i++) {
      ongoingTouches.splice(i, 1); // remove it; we"re done
    }
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
    }
}

function runKeys() {
    background(backgroundColor);

    //top left and right corner icons
    push();
    strokeWeight(6)
    stroke(color("#5027A9"));
    noFill();
    ellipse(36, 36, 30);
    ellipse(width-36, 36, 30);
    pop();

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
            h.renderKeyType(h.findHexVariant);
        });

        // Render lines between hexagons
        renderKeyBridges();

        // Render all hexagon text
        keyArr.forEach((h) => {
            h.renderText(h.findHexVariant);
        });

        let optionsBG = color(backgroundColor);
        optionsBG.setAlpha(230);
        fill(optionsBG);
        rect(235, 420, 200, 350, 20);
        optionsBG.setAlpha(50);
        background(optionsBG);

        controlsArr.forEach((b) => {
            if (b.countdown > 0) {
                b.countdown--;
            }
            b.drawButtonVariant();
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
            h.renderKeyType(h.findHexVariant);
        });

        // Render extra glow
        keyArr.forEach((g) => {
            g.drawKeyGlow();
        });

        // Render lines between hexagons
        renderKeyBridges();

        // Render all hexagon text
        keyArr.forEach((h) => {
            h.renderText(h.findHexVariant);
        });
    }

    //lines at the top showing scale;
    drawScaleLines();

    //text info in corners
    push();

    textFont("Switzer");
    textStyle(NORMAL);
    fill(color("#5027A9"));
    noStroke();

    cornerText();

    pop();
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
    const attackedKeys = pressedButtons.filter((o) => lastPressedButtons.indexOf(o) === -1);

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


function detectMouse() {
    //write new later
}

function reactToPen() {
    //clean up duplicates
    pressedButtons = [...new Set(pressedButtons)];

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

    //cleaning up duplicates?
    //then it should only be possible for there to be one pressed button with a certain name,
    //or at least all the ones after need to properly work with their own touchdrag and start

    //clean up duplicates and sort
    pressedButtons = [...new Set(pressedButtons)];
    pressedButtons.sort((a, b) => a.name - b.name);

    //give continuous drag values
    keyArr.forEach((h) => {
        pressedButtons.forEach((t) => {
            if (t.name === h.name && t.touchDragX != -1) {
                h.touchDragX = t.touchDragX;
                h.touchDragY = t.touchDragY;
            }
        });
    });

    //find unique items in each
    let attackedKeys = pressedButtons.filter((o) => lastPressedButtons.indexOf(o) === -1);
    let releasedKeys = lastPressedButtons.filter((o) => pressedButtons.indexOf(o) === -1);

    //find key and press
    for (var play = 0; play < attackedKeys.length; play++) {
        const playHex = attackedKeys[play];
        keyArr.forEach((h) => {
            if (h.name === playHex.name) {
                keypressed(h);
                h.touchStartX = playHex.touchDragX;
                h.touchStartY = playHex.touchDragY;
            }
        });
    }

    //release audio of key and reset drag values
    for (var endplay = 0; endplay < releasedKeys.length; endplay++) {
        const removedHex = releasedKeys[endplay];
        keyArr.forEach((h) => {
            if (h.name === removedHex.name) {
                if (interactionMode === "play") {
                    playKey(h, "release");
                }
                h.touchStartX = -1;
                h.touchStartY = -1;
                h.touchDragX = -1;
                h.touchDragY = -1;
            }
        });
    }
}


function playKey(h, mode) {
    const pOctave = h.octave + currentOctave;
    const freq = eval(currentTuning[h.midiName % 12]);
    const pPitch = baseFrequency * freq * 2 ** (pOctave -1);

    activeFreqs.push(freq);
    activePlayFreqs.push(pPitch);

    if (mode === "release") {
        //release would need to take pitch bend into account!
        instrument.triggerRelease(pPitch);
        activeFreqs = [];
    } else if (mode === "short") {
        instrument.triggerAttackRelease(pPitch, '16n');
        activeFreqs = [];
    }
    else {
        instrument.triggerAttack(pPitch);
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
                currentOctave = (currentOctave < 2) ? currentOctave++ : 0;
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
                const temp = gridIncrement_H;
                gridIncrement_H = gridIncrement_V;
                gridIncrement_V = temp;
    
                keyArr.forEach((h) => {
                    h.setMidiFromGrid(gridBaseMidi, gridWidth, gridIncrement_H, gridIncrement_D, gridIncrement_V);
                });
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
        const root = baseFrequency * eval(currentTuning[0]) * 2 ** 2;
        const third = baseFrequency * eval(currentTuning[4]) * 2 ** 3;
        const fifth = baseFrequency * eval(currentTuning[7]) * 2 ** 3;
        //const m7 = baseFrequency * eval(currentTuning[10]) * 2 ** 2;
        instrument.triggerAttackRelease(root, "16n");
        instrument.triggerAttackRelease(third, "16n");
        instrument.triggerAttackRelease(fifth, "16n");
        //instrument.triggerAttackRelease(m7, "16n");
    } else if (-b.name <= rows*3) {
        switch (-b.name - rows*2) {
            case 1:
                print("Switched to piano!");
                currentInstrument = "piano";
                instrument = pianoSampler;
                break;
            case 2:
                print("Switched to Rhodes!");
                currentInstrument = "rhodes";
                instrument = rhodesSampler;
                break;
            case 3:
                print("Switched to organ!");
                currentInstrument = "organ";
                instrument = organSampler;
                break;
            case 4:
                print("Switched to harp!");
                currentInstrument = "harp";
                instrument = harpSampler;
                break;
            case 5:
                print("Switched to saw wave!");
                currentInstrument = "sawtooth";
                synth.set({"oscillator": {"type": "sawtooth"}});
                instrument = synth;
                break;
            case 6:
                print("Switched to square wave!");
                currentInstrument = "square";
                synth.set({"oscillator": {"type": "square"}});
                instrument = synth;
                break;
            case 7:
                print("Switched to triangle wave!");
                currentInstrument = "triangle";
                synth.set({"oscillator": {"type": "triangle"}});
                instrument = synth;
                break;
            case 8:
                print("Switched to sine wave!");
                currentInstrument = "sine";
                synth.set({"oscillator": {"type": "sine"}});
                instrument = synth;
                break;
        }
        instrument.triggerAttackRelease("C3", "16n");
        instrument.triggerAttackRelease("C4", "16n");
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


function keyColorFromPalette(h, style) {
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
            if ((h.octave + currentOctave + 1) % 2 == 0) {
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
        offColor = color("black");
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
    const startY = 20;

    push()
    noStroke();

    //WIP: adjust with octave length
    const octLength = currentTuning.length;

    let getXValue = (fr) => map(scaleFreqToCents(fr+1), 0, 1200, startX, endX);

    for (let j = 0; j < octLength; j++) {
        const compareFreq = tuning12tet[j] - 1;
        const xCompareValue = getXValue(compareFreq);

        gradientCircle(
            lerpColor(color("black"), color("#3E1C87"), 0.2),
            0,
            lerpColor(color("black"), color("#3E1C87"), 0.7),
            20,
            xCompareValue,
            startY, 5);
    }

    for (let i = 0; i < octLength; i++) {
        let freq = eval(currentTuning[i]) - 1;

        let size = 7;
        push();
        noStroke();
        let fillC = color("white");

        const offset = noteNames.indexOf(currentKey);

        //color,new
        const inKlickedHexes = pressedButtons.find(t => (t.midiName % 12) === ((i+offset) % 12) && t.countdown > 0);
        const inHoverHexes = pressedButtons.find(t => (t.midiName % 12) === ((i+offset) % 12));

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

class ButtonObj {
    constructor(x, y, r, type, name) {

        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.name = name;
        this.countdown = 0;

        this.setMidiFromGrid(gridBaseMidi, gridWidth, gridIncrement_H, gridIncrement_D, gridIncrement_V);

        //WIP - Only relevant for active keys, shouldn't be here!
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
        }
        else if (this.pitchName === currentKey) { 
            fill(rootColor); 
        }
        else {
            fill(keyColorFromPalette(this, "light"));

            const offset = noteNames.indexOf(this.pitchName);
            const keyOffset = noteNames.indexOf(currentKey);

            if (currentScale[offset] == 0) {
                fill(keyColorFromPalette(this));
            }
        }

        this.renderKeyText();
        this.hexDragOffsetIndicator();
        pop();
    }

    get findHexVariant() {
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName && t.countdown > 0);
        const inHoverHexes = pressedButtons.find(t => t.midiName === this.midiName);

        if (inKlickedHexes !== undefined) {
            return "klicked";
        } else if (inHoverHexes !== undefined) {
            return "hover";
        } else if (this.pitchName === currentKey && interactionMode === "key") {
            return "selected";
        } else {
            return "idle";
        }
    }


    drawButtonVariant() {
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
            text(this.midiName + 12 * currentOctave, this.x, this.y);
        }
        else if (labelStyle === "intervals") {
            const offset = noteNames.indexOf(currentKey);
            const intervalName = intervalNames[(this.midiName - offset) % 12];
            text(intervalName, this.x, this.y);
        }

        //extra text above
        push();
        textSize(11);
        fill(keyColorFromPalette(this, "dark"));

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
            //     instrument.volume.value = map(xMapped, -1, 1, -20, 20);
            // }

            let circleColor = color(keyColorFromPalette(this, "light"));
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
        print("Found " + closestButton.distanceToTouch(touch));
        return closestButton;
    } else {
        print("No hexagon found in reach!");
    }
}


function keyShape(x, y, r, fillColor) {
    push()
    fill(fillColor)
    if (circleMode === true) {
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
    const scaleText = currentKey + (currentOctave+1) + " – " + capitalize(scaleMode) + " – " + capitalize(tuneMode);

    textSize(15);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    text(scaleText, 72, 18);

    let playText = "";
    if (pressedButtons.length > 0 && !menuIsOpen) {
        for (let b = 0; b < pressedButtons.length; b++) {
            const button = pressedButtons[b];
            playText += (button.pitchName + (button.octave + currentOctave)) + " ";
        }
    } else {
        playText = capitalize(currentInstrument);
    }

    textSize(15);
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    text(playText, width - 72, 18);
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