let canvas;
let readyForSound = false; // only play sound when ready
let toneReady = false;
let frameCountdown = 20; // minimum frames to render after anything happened
Tone.context.lookAhead = 0;

// labels
const octaveSymbols = ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹","¹⁰"];
const noteNames = ["C","C#","D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const whiteKeyModes = ["Ionian", "", "Dorian", "", "Phrygian", "Lydian", "", "Mixolydian", "", "Aeolian", "", "Locrian"];

//C1 to B1
const baseFrequencies = [
    32.70,
    34.65,
    36.71,
    38.89,
    41.20,
    43.65,
    46.25,
    49.00,
    51.91,
    55.00,
    58.27,
    61.74,
]

const tuningPatterns = {
    ne12: {
        steps: 12,
        scale: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        intervals: ["1", "m2", "2", "m3", "3", "4", "TT", "5", "m6", "6", "m7", "7"],
        smallStep: 4,
        bigStep: 7,
        testChordSteps: [4, 7],
        defaultLayout: "concertina",
        midiOffset: 0,
        bridgeKeyPairs: new Array,
    },
    harmonic12: {
        // modify!
        steps: 12,
        scale: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        intervals: undefined,
        smallStep: 4,
        bigStep: 7,
        testChordSteps: [4, 7],
        defaultLayout: "concertina",
        midiOffset: 0,
        bridgeKeyPairs: new Array,
    },
    ne19: {
        steps: 19,
        scale: [1, 0, 0, 1, 0, 0, 1, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1],
        intervals: ["1", "1a", "m2", "2", "2a", "m3", "3", "3›‹4", "4", "4a", "m5", "5", "5a", "m6", "6", "6a", "m7", "7", "7›‹1"],
        smallStep: 6,
        bigStep: 11,
        testChordSteps: [6, 11],
        defaultLayout: "concertina",
        midiOffset: 0,
        bridgeKeyPairs: new Array,
    },
    ne14: {
        steps: 14,
        scale: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        intervals: ["1", "1*", "2", "2*", "3", "3*", "4", "4*", "5", "5*", "6", "6*", "7", "7*"],
        smallStep: 4,
        bigStep: 5,
        testChordSteps: [4, 8],
        defaultLayout: "harmonic",
        midiOffset: 0,
        bridgeKeyPairs: new Array,
    },
    ne24: {
        steps: 24,
        scale: [1, 0, -1, 0, 1, 0, -1, 0, 1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0],
        intervals: ["1", "-2", "m2", "~2", "2", "-3", "m3", "~3", "3", "+3", "4", "+4", "TT", "-5", "5", "-6", "m6", "~6", "6", "-7", "m7", "~7", "7", "-8"],
        smallStep: 4,
        bigStep: 7,
        testChordSteps: [8, 14],
        defaultLayout: "harmonic",
        midiOffset: 24,
        bridgeKeyPairs: new Array,
    },
    ne31: {
        steps: 31,
        scale: [1, -1, 0, 0, -1, 1, -1, 0, 0, -1, 1, 0, 0, 1, -1, 0, 0, -1, 1, -1, 0, 0, -1, 1, -1, 0, 0, -1, 1, 0, 0],
        intervals: ["1", "+1", "-2", "m2", "~2", "2", "+2", "-3", "m3", "~3", "3", "+3", "-4", "4", "+4", "tt", "TT", "-5", "5", "+5", "-6", "m6", "~6", "6", "+6", "-7", "m7", "~7", "7", "+7", "-8"],
        smallStep: 10,
        bigStep: 18,
        testChordSteps: [10, 18],
        defaultLayout: "concertina",
        midiOffset: 12,
        bridgeKeyPairs: new Array,
    },
    primal21: {
        steps: 21,
        scale: [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0],
        intervals: undefined,
        smallStep: 5,
        bigStep: 9,
        testChordSteps: [6, 12, 18],
        defaultLayout: "harmonic",
        midiOffset: 26,
        bridgeKeyPairs: new Array,
    },
}

const tunings = {
    edo12: {
        name:"12 EDO",
        type:"equal",
        pattern:tuningPatterns.ne12,
    },
    novemdecimal: {
        name:"Novemdecimal",
        type:"ratios",
        ratios:[
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
        ],
        pattern:tuningPatterns.ne12,
    },
    undecimal: {
        name:"Undecimal",
        type:"ratios",
        ratios:[
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
        ],
        pattern:tuningPatterns.ne12,
    },
    snowfall: {
        name:"/11 \"Snowfall\"",
        type:"ratios",
        ratios:[
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
        ],
        pattern:tuningPatterns.ne12,
    },
    hexadecimal: {
        name:"Hexadecimal",
        type:"ratios", // 16:17:18:19:20:21:23:24:25:27:29:30:32
        ratios:[
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
        ],
        pattern:tuningPatterns.ne12,
    },
    harmonic: {
        name:"12 Harmonic",
        type:"ratios",
        ratios:[
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
        ],
        pattern:tuningPatterns.harmonic12,
    },
    simplefractions: {
        name:"Simple Fractions",
        type:"ratios", // https:// www.huygens-fokker.org/docs/intervals.html
        ratios:[
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
        ],
        pattern:tuningPatterns.ne12,
    },
    edo19: {
        name:"19 EDO",
        type:"equal",
        pattern:tuningPatterns.ne19,
    },
    edo14: {
        name:"14 EDO",
        type:"equal",
        pattern:tuningPatterns.ne14,
    },
    neji31: {
        name:"31 JI",
        type:"ratios", // 7-limit by Adriaan Fokker
        ratios:[
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
        ],
        pattern:tuningPatterns.ne31,
    },
    astral21: {
        name:"21 JI Astral",
        type:"ratios",
        ratios:[
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
            "64/33"
        ],
        pattern:tuningPatterns.primal21,
    },
    edo24: {
        name:"24 EDO",
        type:"equal",
        pattern:tuningPatterns.ne24,
    },
    neji24: {
        name:"24 JI",
        type:"ratios",
        ratios:[
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
        ],
        pattern:tuningPatterns.ne24,
    },
}

// settings that can be changed via the menu or tools
let cfg = {
    tuning: tunings.edo12,
    baseOctave: 0,
    baseNote: 0, //C1
    labelStyle: "none",
    isPitchBend: false,
    layout: "concertina"
}
let lastCfg = cfg;

//for constructing the hexagons
grid = {
    baseMidi: 24,
    width: undefined,
    axisH: 1,
    axisD: 4,
    axisV: 7,
    hexSize: 34, // 34 seems good
    tuningMidiOffset: 0, // different tunings may start at a higher midi note
    translateOffset: new Object, // x/y
    angle: 0,
}

// permanent key grid
let gridSizeX, gridSizeY;
let keyArr = new Array;
let controlsArr = new Array;

// colors
let theme = new Object; // Filled with p5 color()s

// current keys
let pressedButtons = new Array;
let lastPressedButtons = new Array;
let sustainedKeys = new Array;
let deactivatedSustainedKeys = new Array;
let orderedKeys = new Array; //sustained and pressed, in order
let hoverButton; // for when mouse is used

// detect playing
let menuIsOpen = false;
let ongoingTouches = new Array;
let ongoingHover = new Object;
let mouseUsed;

//tools
let toolMode = "none";
let currentToolIndex = undefined;
let currentToolTouch = undefined;
let dragKeyPairs = new Array;

// tonejs
let menuSynth;
let pianoSampler;
let rhodesSampler;
let organSampler;
let harpSampler;
let synthvoices = new Array;
let instrument;
let currentInstrument = "piano";
let instrumentType = "sampler";
let vol;

let activeKeys = {
    // structure: h.name = {"synth"..., "dragValues"...}
};

const menuButtonFunctions = [
    [
        //1st column
        {
            type:"label",
            label:() => "Samplers"
        },
        {
            type:"button",
            label:() => "Piano",
            onCondition:() => (currentInstrument === "piano"),
            function:function() {
                print("Switched to piano!");
                currentInstrument = "piano";
                instrument = pianoSampler;
                instrumentType = "sampler";
                vol.volume.value = -7;
            },
        },
        {
            type:"button",
            label:() => "Rhodes",
            onCondition:() => (currentInstrument === "rhodes"),
            function:function() {
                print("Switched to Rhodes!");
                currentInstrument = "rhodes";
                instrument = rhodesSampler;
                instrumentType = "sampler";
                vol.volume.value = -10;
            },
        },
        {
            type:"button",
            label:() => "Organ",
            onCondition:() => (currentInstrument === "organ"),
            function:function() {
                print("Switched to organ!");
                currentInstrument = "organ";
                instrument = organSampler;
                instrumentType = "sampler";
                vol.volume.value = -12;
            },
        },
        {
            type:"button",
            label:() => "Harp",
            onCondition:() => (currentInstrument === "harp"),
            function:function() {
                print("Switched to harp!");
                currentInstrument = "harp";
                instrument = harpSampler;
                instrumentType = "sampler";
                vol.volume.value = -10;
            },
        },
        {
            type:"label",
            label:() => "Oscillators"
        },
        {
            type:"button",
            label:() => "Sawtooth",
            onCondition:() => (currentInstrument === "sawtooth"),
            function:function() {
                print("Switched to saw wave!");
                currentInstrument = "sawtooth";
                menuSynth.set({"oscillator": {"type": "sawtooth"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "sawtooth"}});
                }
                instrument = menuSynth;
                instrumentType = "synth";
                vol.volume.value = -28;
            },
        },
        {
            type:"button",
            label:() => "Square",
            onCondition:() => (currentInstrument === "square"),
            function:function() {
                print("Switched to square wave!");
                currentInstrument = "square";
                menuSynth.set({"oscillator": {"type": "square"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "square"}});
                }
                instrument = menuSynth;
                instrumentType = "synth";
                vol.volume.value = -31;
            },
        },
        {
            type:"button",
            label:() => "Triangle",
            onCondition:() => (currentInstrument === "triangle"),
            function:function() {
                print("Switched to triangle wave!");
                currentInstrument = "triangle";
                menuSynth.set({"oscillator": {"type": "triangle"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "triangle"}});
                }
                instrument = menuSynth;
                instrumentType = "synth";
                vol.volume.value = -20;
            },
        },
        {
            type:"button",
            label:() => "Sine",
            onCondition:() => (currentInstrument === "sine"),
            function:function() {
                print("Switched to sine wave!");
                currentInstrument = "sine";
                menuSynth.set({"oscillator": {"type": "sine"}});
                for (let i = 0; i < 32; i++) {
                    synthvoices[i].set({"oscillator": {"type": "sine"}});
                    //synthvoices[i] = pianoSampler;
                }
                instrument = menuSynth;
                instrumentType = "synth";
                vol.volume.value = -30;
            },
        },
    ],
    [
        //2nd column
        {
            type:"label",
            label:() => "12 EDO and NEJIs"
        },
        {
            type:"button",
            label:() => tunings.edo12.name,
            onCondition:() => (cfg.tuning === tunings.edo12),
            function:function() {
                cfg.tuning = tunings.edo12;
            },
        },
        {
            type:"button",
            label:() => tunings.simplefractions.name,
            onCondition:() => (cfg.tuning === tunings.simplefractions),
            function:function() {
                cfg.tuning = tunings.simplefractions;
            },
        },
        {
            type:"button",
            label:() => tunings.novemdecimal.name,
            onCondition:() => (cfg.tuning === tunings.novemdecimal),
            function:function() {
                cfg.tuning = tunings.novemdecimal;
            },
        },
        {
            type:"button",
            label:() => tunings.hexadecimal.name,
            onCondition:() => (cfg.tuning === tunings.hexadecimal),
            function:function() {
                cfg.tuning = tunings.hexadecimal;
            },
        },
        {
            type:"button",
            label:() => tunings.undecimal.name,
            onCondition:() => (cfg.tuning === tunings.undecimal),
            function:function() {
                cfg.tuning = tunings.undecimal;
            },
        },
        {
            type:"button",
            label:() => tunings.snowfall.name,
            onCondition:() => (cfg.tuning === tunings.snowfall),
            function:function() {
                cfg.tuning = tunings.snowfall;
            },
        },
    ],
    [
        //3rd column
        {
            type:"label",
            label:() => "Other Tunings",
        },
        {
            type:"button",
            label:() => tunings.harmonic.name,
            onCondition:() => (cfg.tuning === tunings.harmonic),
            function:function() {
                cfg.tuning = tunings.harmonic;
            },
        },
        {
            type:"button",
            label:() => tunings.edo14.name,
            onCondition:() => (cfg.tuning === tunings.edo14),
            function:function() {
                cfg.tuning = tunings.edo14;
            },
        },
        {
            type:"button",
            label:() => tunings.edo19.name,
            onCondition:() => (cfg.tuning === tunings.edo19),
            function:function() {
                cfg.tuning = tunings.edo19;
            },
        },
        {
            type:"button",
            label:() => tunings.neji31.name,
            onCondition:() => (cfg.tuning === tunings.neji31),
            function:function() {
                cfg.tuning = tunings.neji31;
            },
        },
        {
            type:"button",
            label:() => tunings.astral21.name,
            onCondition:() => (cfg.tuning === tunings.astral21),
            function:function() {
                cfg.tuning = tunings.astral21;
            },
        },
        {
            type:"button",
            label:() => tunings.edo24.name,
            onCondition:() => (cfg.tuning === tunings.edo24),
            function:function() {
                cfg.tuning = tunings.edo24;
            },
        },
        {
            type:"button",
            label:() => tunings.neji24.name,
            onCondition:() => (cfg.tuning === tunings.neji24),
            function:function() {
                cfg.tuning = tunings.neji24;
            },
        },
    ],
    [
        //4th column
        {
            type:"label",
            label:() => "Note Labels",
        },
        {
            type:"stepper",
            label:() => capitalize(cfg.labelStyle),
            onCondition:() => undefined,
            function:function() {
                print("Changed label style");
                if (cfg.labelStyle === "notes") {cfg.labelStyle = "intervals";}
                else if (cfg.labelStyle === "intervals") {cfg.labelStyle = "none";}
                else {cfg.labelStyle = "notes";}
            },
        },
        {
            type:"label",
            label:() => "Note Layout",
        },
        {
            type:"stepper",
            label:() => capitalize(cfg.layout),
            onCondition:() => undefined,
            function:function() {
                print("Switched to different layout");
                if (cfg.layout === "concertina") cfg.layout = "harmonic";
                else if (cfg.layout === "harmonic") cfg.layout = "swapped";
                else cfg.layout = "concertina";
                makeKeys(); 
                calculateNewMidiGrid(grid.axisD, grid.axisV);
            },
        },
        {
            type:"button",
            label:() => "Smaller Keys",
            onCondition:() => (grid.hexSize === 28),
            function:function() {
                if (grid.hexSize === 34) {
                    grid.hexSize = 28;
                } else {
                    grid.hexSize = 34;
                }
                makeKeys();
                calculateNewMidiGrid(grid.axisD, grid.axisV);
            },
        },
        {
            type:"button",
            label:() => "Angle (WIP)",
            onCondition:() => (grid.angle !== 0),
            function:function() {
                if (grid.angle === 0) {
                    grid.angle = -35;
                } else {
                    grid.angle = 0;
                }
                makeKeys();
                calculateNewMidiGrid(grid.axisD, grid.axisV);
            },
        },
        {
            type:"label",
            label:() => "Base Octave/Key",
        },
        {
            type:"stepper",
            label:() => cfg.baseOctave,
            onCondition:() => undefined,
            function:function() {
                print("Changed octave");
                cfg.baseOctave++;
                if (cfg.baseOctave == 3) {cfg.baseOctave = 0;}
            },
        },
        {
            type:"stepper",
            label:() => noteNames[cfg.baseNote] + " (" + baseFrequencies[cfg.baseNote]+")",
            onCondition:() => undefined,
            function:function() {
                print("Changed to root " + noteNames[cfg.baseNote]);
                cfg.baseNote++;
                if (cfg.baseNote === 12) cfg.baseNote = 0;

                //update midiname of notes
                keyArr.forEach((h) => {
                    h.setMidiFromGrid(grid.baseMidi, grid.width, newIncrement_H, newIncrement_D, newIncrement_V);
                });
            }
        },
        {
            type:"label",
            label:() => "Tools",
        },
        {
            type:"button",
            label:() => "Clear "+cfg.tuning.pattern.bridgeKeyPairs.length+" Lines",
            onCondition:() => undefined,
            function:function() {
                cfg.tuning.pattern.bridgeKeyPairs = [];
            },
        },
    ],
];

const tools = [
    {
        label:"Pen",
        image: undefined,
        visible:() => true,
        onTap:function() {
            toolMode = "pen";
        },
        onRelease:function() {
            toolMode = "none";
            dragKeyPairs = [];
        },
    },
    {
        label:"Bend",
        image: undefined,
        visible:() => (instrumentType === "synth"),
        onTap:function() {
            cfg.isPitchBend = true;
        },
        onRelease:function() {
            cfg.isPitchBend = false;
        },
    },
]


function preload() {

    vol = new Tone.Volume().toDestination();
    vol.volume.value = -7; //starting value for the piano

    // custom array of polysynths that can have separate properties
    for (let i = 0; i < 32; i++) {
        synthvoices.push(new Tone.Synth());
        synthvoices[i].connect(vol);
        synthvoices[i].set({
            "envelope": {
                "attack": 0,
                "decay": 0,
                "sustain": 0.3,
                "release": 1,
            }
        });
        synthvoices[i].set({
            "oscillator": {"type": "sawtooth"}
        });
    }

    // default polysynth for menu activation
    menuSynth = new Tone.PolySynth().connect(vol);
    menuSynth.set({
        "envelope": {
            "attack": 0,
            "decay": 0,
            "sustain": 0.3,
            "release": 1,
            }});
    menuSynth.set({
        "oscillator": {"type": "sawtooth"}
    });

    pianoSampler = new Tone.Sampler({
        urls: {
            A2: "piano110.mp3",
            A3: "piano220.mp3",
            A4: "piano440.mp3",
            A5: "piano880.mp3"
        },
        release: 1.5,
        baseUrl: "sounds/",
    }).connect(vol);

    rhodesSampler = new Tone.Sampler({
        urls: {
            A2: "rhodes110.mp3",
            A3: "rhodes220.mp3",
            A4: "rhodes440.mp3",
            A5: "rhodes880.mp3"
        },
        release: 1,
        baseUrl: "sounds/",
    }).connect(vol);

    organSampler = new Tone.Sampler({
        urls: {
            A2: "organleslie110.mp3",
            A3: "organleslie220.mp3",
            A4: "organleslie440.mp3",
            A5: "organleslie880.mp3"
        },
        release: 1,
        baseUrl: "sounds/",
    }).connect(vol);

    harpSampler = new Tone.Sampler({
        urls: {
            A2: "harp110.mp3",
            A3: "harp220.mp3",
            A4: "harp440.mp3",
            A5: "harp880.mp3"
        },
        release: 2,
        baseUrl: "sounds/",
    }).connect(vol);

    instrument = pianoSampler;

    tools[0].image = loadImage("assets/pentool.svg");
    tools[1].image = loadImage("assets/bendtool.svg");
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight);
    makeKeys();
    calculateNewMidiGrid(grid.axisD, grid.axisV);
    makeControls();

    frameCountdown = 20;
    loop();
}

function setup () {
    //is mouse used, true or false
    //mouseUsed = !(window.matchMedia("(any-hover: none)").matches);
    //print("Mouse detected:" + mouseUsed);

    mouseUsed = false; //gets turned to true if mouse moved

    canvas = createCanvas(windowWidth, windowHeight); //1366, 1000 on my iPad
    canvas.parent("canvasContainer");
    strokeWeight(2);
    strokeJoin(ROUND);

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
        textdark:color("#8F68FF"),
        textdarker:color("#6D4DED")
    };

    textAlign(CENTER, CENTER);
    textSize(22);
    textFont("Satoshi");
    textStyle(BOLD);
    rectMode(RADIUS);

    makeKeys();
    calculateNewMidiGrid(grid.axisD, grid.axisV);
    makeControls();

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

    Tone.loaded().then(() => {
        toneReady = true;
        console.log("Tone has loaded!")
    });

    // run once to show starting screen
    noLoop();
    draw();
}

function makeKeys () {

    // empty old array first
    keyArr = [];

    // store the hexagon keys with the correct coordinates and ID
    gridSizeX = 1.53*grid.hexSize; //52
    gridSizeY = 1.53*grid.hexSize;
    let id = 0;

    // hexagons are less wide so they can interlock
    if (cfg.layout !== "concertina") {
        gridSizeY = sqrt((3 * pow(gridSizeY, 2)) / 4);
        grid.width = 19; // how many in a row + odd row

        grid.translateOffset.x = (width - 31*gridSizeY) / 2 //-26;
        grid.translateOffset.y = (height - 20.5*gridSizeY) / 2 //42;

        // create hexagons interlocking horizontally
        for (let y = 21 * gridSizeY; y > -50; y -= 2 * gridSizeY) {
            for (let x = 0; x < 28 * gridSizeX; x += 3 * gridSizeX) {
                // even rows
                keyArr.push(new KeyClass(x, y + gridSizeY, id++));
                // odd rows
                if (x > 25 * gridSizeX) { break;}
                keyArr.push(new KeyClass(x + 1.5*gridSizeX, y, id++));
            }
        }
    } else {
        // concertina layout
        gridSizeX = sqrt((3 * pow(gridSizeX, 2)) / 4);
        grid.width = 13; // how many in a column + odd column

        grid.translateOffset.x = (width - 26.5*gridSizeY) / 2;
        grid.translateOffset.y = (height - 18*gridSizeY) / 2;
        
        // create hexagons interlocking vertically
        for (let x = 0; x < 32 * gridSizeX; x += 2 * gridSizeX) {
            for (let y = 18 * gridSizeY; y > -50; y -= 3 * gridSizeY) {
                // even columns
                keyArr.push(new KeyClass(x, y, id++));
                // odd columns
                if (y < 5) {break;}
                keyArr.push(new KeyClass(x + gridSizeX, y - 1.5*gridSizeY, id++));
            }
        }
    }
}

function makeControls () {
    // empty old array first
    controlsArr = [];
    let id = 0;

    const xOffset = width - 620;
    const yOffset = 124;
    const bWidth = 170;
    const bHeight = 59;
    let columnHeight = 0;

    for (let x = 0; x < menuButtonFunctions.length; x++) {
        columnHeight = 0;
        for (let y = 0; y < menuButtonFunctions[x].length; y++) {
            const xPos = xOffset + bWidth*x;

            const yPos = yOffset + columnHeight;
            const elementHeight = (menuButtonFunctions[x][y].type === "label") ? 32 : bHeight;
            columnHeight += elementHeight;

            controlsArr.push(new MenuButtonClass(xPos, yPos, x, y, id++));
        }
    }
}


function handleStart (evt) {
    // first tone to start audio on safari
    console.log(readyForSound, toneReady)
    if (readyForSound === false) {
        if (toneReady) {
            Tone.start();
            print("Audio is ready!");
            //instrument.triggerAttackRelease("C2", "8n");
            readyForSound = true;
        } else {
            return;
        }
    }

    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();

        // Render menu when corner button pressed
        if (overMenuButton(newTouches[i].clientX, newTouches[i].clientY)) {
            menuIsOpen = !menuIsOpen;
        } else {
            newTouches[i].interactionType = "start";
            ongoingTouches.push(copyTouch(newTouches[i]));

            const toolIndex = overToolIndex(newTouches[i].clientX, newTouches[i].clientY);
            if (toolIndex !== undefined) {
                tools[toolIndex].onTap();
                currentToolIndex = toolIndex;
                currentToolTouch = newTouches[i].identifier;
            }
        }
    }
    // get combined pen pressure from new touches
    //let force = 0;
    //for (let t = 0; t < newTouches.length; t++) {
    //    force += newTouches[t].force;
    //}

    frameCountdown = 20;
    loop();
}

function mousePressed () {
    if (readyForSound === false) {
        if (toneReady) {
            Tone.start();
            print("Audio is ready!");
            //instrument.triggerAttackRelease("C2", "8n");
            readyForSound = true;
        } else {
            return;
        }
    }

    if (mouseUsed) {
        newPress = {
            identifier:1,
            clientX:mouseX,
            clientY:mouseY,
            force:0,
            interactionType:"start"
        };

        // Render menu when corner button pressed
        if (overMenuButton(newPress.clientX, newPress.clientY)) {
            menuIsOpen = !menuIsOpen;
        } else {
            ongoingTouches = [copyTouch(newPress)];
        }
        frameCountdown = 20;
        loop();
    }
}

function handleMove (evt) {
    if (!toneReady) return;
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const ongoingIndex = ongoingTouchIndexById(newTouches[i].identifier);
        newTouches[i].interactionType = "move";

        if (ongoingIndex >= 0) {
            ongoingTouches.splice(ongoingIndex, 1, copyTouch(newTouches[i])); // swap in the new touch record
        }
    }
    frameCountdown = 20;
    loop();
}

function mouseDragged () {
    if (!toneReady) return;
    if (mouseUsed) {
        newPress = {
            identifier:1,
            clientX:mouseX,
            clientY:mouseY,
            force:0,
            interactionType:"move"
        };
        ongoingTouches = [copyTouch(newPress)];

        frameCountdown = 20;
        loop();
    }
}

function mouseMoved() {
    if (!toneReady) return;
    mouseUsed = true;
    newHover = {
        identifier:0,
        clientX:mouseX,
        clientY:mouseY,
        force:0,
        interactionType:"hover"
    };
    ongoingHover = copyTouch(newHover);

    frameCountdown = 20;
    loop();
}

function handleEnd (evt) {
    if (!toneReady) return;
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const ongoingIndex = ongoingTouchIndexById(newTouches[i].identifier);

        if (ongoingIndex >= 0) {
            ongoingTouches.splice(ongoingIndex, 1);
        }

        // Hide open menu when last finger is lifted & NOT on the button
        if (!overMenuButton(newTouches[i].clientX, newTouches[i].clientY && ongoingTouches.length === 0)){
            menuIsOpen = false;
        };

        // release tool and remove current tool
        if (newTouches[i].identifier === currentToolTouch) {
            tools[currentToolIndex].onRelease();
            currentToolIndex = undefined;
            currentToolTouch = undefined;
        }
    }
    frameCountdown = 20;
    loop();
}

function handleCancel (evt) {
    if (!toneReady) return;
    handleEnd(evt)
}

function mouseReleased () {
    if (!toneReady) return;
    if (mouseUsed) {
        ongoingTouches = [];

        // Hide open menu when mouse released & NOT on the button
        if (!overMenuButton(mouseX, mouseY)) {
            menuIsOpen = false;
        };
        // toolbar not interactive

        frameCountdown = 20;
        loop();
    }
}

function copyTouch (touch) {
    return {
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY, 
        force: touch.force,
        interactionType: touch.interactionType
    };
}

function ongoingTouchIndexById (idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}

// keyboard shortcuts
function keyPressed () {
    if (!isNaN(key)) {
        let visibleNumber = 0;
        // is a number
        for (let i = 0; i < tools.length; i++) {
            const t = tools[i]
            if (t.visible()) {
                visibleNumber++;
            }
            if (visibleNumber == key) {
                print("Pressed key for tool " + t.label);
                t.onTap();
                currentToolIndex = i;
                break;
            }
        }
    }
    frameCountdown = 20;
    loop();
    return false;
}

// keyboard shortcuts
function keyReleased () {
    if (!isNaN(key)) {
        let visibleNumber = 0;
        // is a number
        for (let i = 0; i < tools.length; i++) {
            const t = tools[i]
            if (t.visible()) {
                visibleNumber++;
            }
            if (visibleNumber == key) {
                print("Released key for tool " + t.label);
                t.onRelease();
                currentToolIndex = undefined;
                break;
            }
        }
    }
    frameCountdown = 20;
    loop();
    return false;
}


function draw () {
    runApp();

    if (frameCountdown > 0) {
        frameCountdown--;
    } else {
        noLoop();
        frameCountdown = 20;
    }
}

function runApp () {
    //between keys
    background(theme.bg);
    noStroke();

    if (menuIsOpen) {
        useMenu();
    } else {
        useKeys();
        useToolbar();
    }

    //translate to center the hexagons and such on screen
    push();
    translate(grid.translateOffset.x, grid.translateOffset.y);

    // Render all hexagons + variants
    keyArr.forEach((h) => {
        h.renderKeyType(h.findKeyVariant);
        h.heat = (h.heat * 0.95).toFixed(7);
    });

    // Render extra glow
    if (!menuIsOpen && (pressedButtons.length > 0 || hoverButton !== undefined)) {
        keyArr.forEach((g) => {
            g.drawKeyGlow();
        });
    }

    renderKeyBridges();

    keyArr.forEach((h) => {
        h.renderText(h.findKeyVariant);
    });

    if (cfg.isPitchBend && !menuIsOpen) {
        pitchBendVoices();
    }

    // MENU

    pop(); //translate for hexagons ended
    renderToolbar();

    if (menuIsOpen) {

        //bg
        push();
        rectMode(CORNER);
        const gradientSteps = width;
        for (let i = 0; i < gradientSteps; i++) {
            const alpha = map(i, 0, gradientSteps-1, 10, 60);
            fill(atAlpha(theme.bgdark,alpha));
            rect(i * (width / gradientSteps), 0, width /gradientSteps, height);
        }
        pop();
        //background(atAlpha(theme.bgdark, 60));

        //menu
        fill(theme.bgdark);
        rect(width - 366, 374, 350, 282, 20);
        

        controlsArr.forEach((b) => {
            b.renderButtonVariant();
        });

        // Render extra glow
        if (hoverButton !== undefined) {
            controlsArr.forEach((b) => {
                b.renderButtonHover();
            });
        }
    }

    // HUD
    renderTuningReference();
    renderCornerText();

    // Display on top until sound has loaded
    if (!toneReady) {
        background(atAlpha(theme.bgdark, 20));
    }
}


function renderKeyBridges () {
    push();
    noStroke();

    bridgeType(dragKeyPairs);
    bridgeType(cfg.tuning.pattern.bridgeKeyPairs);

    //wip - draw in progress pairs differently. also show when both overlap - bridge is about to get deleted.

    function bridgeType (pairArray) {
        for (let b = pairArray.length - 1; b >= 0; b--) {

            // find actual keys with same name as bridge keys
            const bridgePair = pairArray[b];
            let hexPair = [];
            keyArr.forEach((h) => {
                if (h.name === bridgePair[0].name) {
                    hexPair[0] = h;
                }
                if (h.name === bridgePair[1].name) {
                    hexPair[1] = h;
                }
            });

            // drag the bridge
            if (hexPair[0] !== undefined && hexPair[1] !== undefined) {
                renderBridge(
                    hexPair[0].x, hexPair[0].y,
                    hexPair[1].x, hexPair[1].y,
                    hexPair[0].keyColorFromPalette(1),
                    hexPair[1].keyColorFromPalette(2)
                );
            }
        }
    }

    pop();
}


function useMenu () {
    // update which buttons are hovered over/ pressed
    lastPressedButtons = pressedButtons.slice();
    pressedButtons = [];
    hoverButton = undefined;

    for (let i = 0; i < ongoingTouches.length; i++) {
        const nearestHex = findNearestButton(ongoingTouches[i], controlsArr);
        if (nearestHex !== undefined) {
            pressedButtons.push(nearestHex);
        }
    }
    if (mouseUsed && ongoingTouches.length === 0) {
        hoverButton = findNearestButton(ongoingHover, controlsArr);
    }

    // find unique items in each
    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);

    if (attackedKeys.length > 0) {

        instrument.releaseAll();

        controlsArr.forEach((b) => {
            if (b.name === pressedButtons[0].name) {
                menuButtonPressed(b);
            }
        });
    }
}


function useToolbar () {
    // Currently not needed
}


function useKeys () {
    // update which buttons are hovered over/ pressed
    lastPressedButtons = pressedButtons.slice();
    pressedButtons = [];
    hoverButton = undefined;

    // find what key each finger is on, add to pressedButtons list
    for (let i = 0; i < ongoingTouches.length; i++) {
        const touch = ongoingTouches[i];
        //if not on menu button, toolbar or same touch from toolbar
        if (touch.identifier !== currentToolTouch) {
            const nearestKey = findNearestButton(ongoingTouches[i], keyArr);
            if (nearestKey !== undefined) {pressedButtons.push(nearestKey);}
        }
    }

    // find where the mouse is hovering, except when on menu button
    if (mouseUsed && ongoingTouches.length === 0 && !overMenuButton(mouseX, mouseY)) {
        hoverButton = findNearestButton(ongoingHover, keyArr);
    }

    // clean up duplicates if the same key was pressed more than once
    pressedButtons = uniqByKeepFirst(pressedButtons, p => p.name);

    // do something with the pressed keys
    if (toolMode === "pen") {
        pressedKeysPen();
        return;
    }
    pressedKeysPlay();
}


function pressedKeysPen () {

    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);
    for (let a = 0; a < attackedKeys.length; a++) {

        // what's the identifier of the key?
        // is there an existing dragkeypair that started with this identifier? if so, update that endkey.
        // otherwise, start a new pair with both ends being this key.

        const attackedKey = attackedKeys[a];
        let foundFinger = false;
        dragKeyPairs.forEach((dragPair) => {
            if (dragPair[0].lastTouch.id === attackedKey.lastTouch.id) {
                dragPair[1] = attackedKey;
                foundFinger = true;
            }
        })
        if (!foundFinger) {
            dragKeyPairs.push([attackedKey, attackedKey]);
        }
    }

    const pt = cfg.tuning.pattern;
    const releasedKeys = lastPressedButtons.filter(p => pressedButtons.find(l => {return l.name == p.name}) === undefined);
    for (let r = 0; r < releasedKeys.length; r++) {

        // see if finger still used (only dragged off the hexagon)
        const releasedKey = releasedKeys[r];
        let fingerStillDown = false;
        ongoingTouches.forEach((o) => {
            if (o.identifier === releasedKey.lastTouch.id) {
                fingerStillDown = true;
            }
        });

        if (!fingerStillDown) {

            // find the dragkeypair with the same identifier, and move it to a final bridgekeypair instead
            // only if both keys in it are different

            dragKeyPairs.forEach((dragPair) => {
                if (dragPair[1].lastTouch.id === releasedKey.lastTouch.id) {
                    // update bridge pairs
                    if (dragPair[0] !== dragPair[1]) {
                        // push the dragpair, or remove if it already exists - either way around
                        let foundPair = false;
                        pt.bridgeKeyPairs.forEach((bridgePair) => {
                            if (dragPair[0].name === bridgePair[0].name && dragPair[1].name === bridgePair[1].name ||
                                dragPair[0].name === bridgePair[1].name && dragPair[1].name === bridgePair[0].name) {
                                // remove
                                foundPair = true;
                                print("Removed bridge", bridgePair);
                                const index = pt.bridgeKeyPairs.indexOf(bridgePair);
                                if (index > -1) {pt.bridgeKeyPairs.splice(index, 1);}
                            }
                        });
                        if (!foundPair){
                            // add
                            print("Added bridge", dragPair);
                            pt.bridgeKeyPairs.push(dragPair);
                        }
                    }
                    // remove from dragged pairs
                    const index = dragKeyPairs.indexOf(dragPair);
                    if (index > -1) {dragKeyPairs.splice(index, 1);}
                }
            });

        }
    }
}


function pressedKeysPlay () {
    // every key stores:
    // .lastTouch.id and .lastTouch.type

    // find unique items in each
    const attackedKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) === undefined);
    const releasedKeys = lastPressedButtons.filter(p => pressedButtons.find(l => {return l.name == p.name}) === undefined);
    const sameKeys = pressedButtons.filter(p => lastPressedButtons.find(l => {return l.name == p.name}) !== undefined);

    // if multipe keys are added in one frame, sort them by note height
    attackedKeys.sort((a, b) => a.name - b.name);

    // find key and press
    if (attackedKeys.length > 0) {
        deactivatedSustainedKeys = [];
    }
    for (let a = 0; a < attackedKeys.length; a++) {
        const attackedKey = attackedKeys[a];
        keyArr.forEach((h) => {
            if (h.name === attackedKey.name) {
                h.heat++;
                playKey(h);
            }
        });
        // add attacked keys in order to a list (after removing earlier keys with same name)
        orderedKeys.push(attackedKey);
        orderedKeys = uniqByKeepLast(orderedKeys, p => p.name);

        // remove sustained keys one semitone higher or lower from the playHex
        filterSustainedKeys("inSemiToneRange", attackedKey);
    }

    // release audio of key
    for (let r = 0; r < releasedKeys.length; r++) {
        const releasedKey = releasedKeys[r];

        // see if finger still used (only dragged off the hexagon)
        let fingerStillDown = false;
        ongoingTouches.forEach((o) => {
            if (o.identifier === releasedKey.lastTouch.id) {
                fingerStillDown = true;
            }
        });

        // push to list of sustained keys if...
        const octaveHighEnough = (releasedKey.octave + cfg.baseOctave > 1);
        const foundInSemitoneRange = attackedKeys.find(a =>
            a.midiName < releasedKey.midiName + 2 &&
            a.midiName > releasedKey.midiName - 2);
        if (fingerStillDown && octaveHighEnough && foundInSemitoneRange === undefined) {
                sustainedKeys.push(releasedKey);
        } else {
            // actually release the note
            keyArr.forEach((h) => {
                if (h.name === releasedKey.name) {
                    playKey(h, "release");
                }
            });
            // remove from list of all ordered keys
            orderedKeys = orderedKeys.filter(o => o.name !== releasedKey.name);
        }
    }
    // find sustained keys with index that doesn't match any current index, remove them
    filterSustainedKeys("touchIdGone");

    if (cfg.isPitchBend) {
        // detect movement on same keys
        for (let s = 0; s < sameKeys.length; s++) {
            const sameHex = sameKeys[s];
            keyArr.forEach((h) => {
                if (h.name === sameHex.name) {
                    keyDragToVoices(h);
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
                    deactivatedSustainedKeys.push(s);
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
            deactivatedSustainedKeys.forEach((d) => {
                let sustainFingerStillPresent = false
                ongoingTouches.forEach((o) => {
                    if (d.lastTouch.id === o.identifier) {
                        sustainFingerStillPresent = true;
                    }
                });
                if (!sustainFingerStillPresent) {
                    deactivatedSustainedKeys = [];
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

function intervalFromTuning(midiNumber) {
    const i = midiNumber % cfg.tuning.pattern.steps;

    if (cfg.tuning.type === "equal") {
        return 2 ** (i / cfg.tuning.pattern.steps);
    }
    if (cfg.tuning.type === "ratios") {
        return eval(cfg.tuning.ratios[i]);
    }
}

function playKey (h, mode) {
    const octave = h.octave + cfg.baseOctave;
    const freq = intervalFromTuning(h.midiName);
    const pPitch = baseFrequencies[cfg.baseNote] * freq * 2 ** (octave -1);

    if (instrumentType !== "synth") {
        if (mode === "release") {
            instrument.triggerRelease(pPitch);
        } else {
            instrument.triggerAttack(pPitch);
        }
    } else {
        // in synth mode, using activekeys to store all the voices

        // always release if there is something to release
        if (activeKeys[h.name] !== undefined) {
            activeKeys[h.name].voice.triggerRelease();
            delete activeKeys[h.name].dragValues;
        }
        // now do attack
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
                    activeKeys[h.name].voice.set({ "detune": 0 });

                    print("Playing " + i + "-voice")
                    activeKeys[h.name].voice.triggerAttack(pPitch);
                    activeKeys[h.name].voice.onsilence = () => {
                        delete activeKeys[h.name];
                        synthvoices[i].set({ "detune": 0 });
                        print(i + "-voice is silent, remaining active key objects: " + Object.values(activeKeys));
                        frameCountdown = 20;
                        loop();
                    }
                    break;
                }
            }
        }
        print(Object.values(activeKeys));
    }
}



function pitchBendVoices () {
    //go through voices that are still playing
    Object.values(activeKeys).forEach(a => {
        const keyHasBeenDragged = (a.dragValues !== undefined && a.dragValues.dragX !== undefined);
        if (keyHasBeenDragged) {
            const maxDetuneCents = 1200 / cfg.tuning.pattern.steps;
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

function dragDistanceMap (center, start, drag, min, max) {
    if (drag > min) {
        return map(start + drag, start + min, center + max, 0, 1, true);
    } else if (-drag > min) {
        return map(start + drag, start - min, center - max, 0, -1, true);
    }
    else {
        return 0;
    }
}


function menuButtonPressed (b) {
    const bFunction = menuButtonFunctions[b.col][b.row].function;
    if (bFunction !== undefined) {
        bFunction();

        if (b.col === 0) {
            //for all instruments
            instrument.triggerAttackRelease("C3", "16n");
            instrument.triggerAttackRelease("C4", "16n");
        } else if (b.col === 1 || b.col === 2) {
            print("Switched tuning to", cfg.tuning);
            const pat = cfg.tuning.pattern;
            const lastpat = lastCfg.tuning.pattern;


            cfg.layout = pat.defaultLayout; //wip, should keep the previous type if the pattern didn't change
            //if (lastpat !== pat) {
            //    
            //}

            grid.tuningMidiOffset = pat.midiOffset;
            makeKeys();
            calculateNewMidiGrid(pat.smallStep, pat.bigStep);
            playTestChord(pat.testChordSteps);
        }
    }
    lastCfg = cfg;
}

function playTestChord (intervals) {
    // play root
    const root = baseFrequencies[cfg.baseNote] * 2 ** 2;
    instrument.triggerAttackRelease(root, "16n");

    intervals.forEach(i => {
        const interval = intervalFromTuning(i);
        const freq = baseFrequencies[cfg.baseNote] * interval * 2 ** 3;
        instrument.triggerAttackRelease(freq, "16n");
    });
}

function calculateNewMidiGrid (small, big) {
    if (cfg.layout === "concertina") {
        grid.baseMidi = Math.floor(cfg.tuning.pattern.steps * 1.5);
    } else {
        grid.baseMidi = cfg.tuning.pattern.steps * 2;
    }

    // save for checking elsewhere
    grid.axisH = 2 * small - big; // should be semitone
    grid.axisD = small;
    grid.axisV = big;

    // actual values take into account extra grid modes
    if (cfg.layout === "swapped") {
        newIncrement_H = big;
        newIncrement_D = small;
        newIncrement_V = 2 * small - big;
    } else if (cfg.layout === "concertina") {
        newIncrement_H = cfg.tuning.pattern.steps; // octave
        newIncrement_D = big;
        newIncrement_V = (2 * big) % cfg.tuning.pattern.steps;
    } else {
        newIncrement_H = 2 * small - big;
        newIncrement_D = small;
        newIncrement_V = big;
    }
    keyArr.forEach((h) => {
        h.setMidiFromGrid(grid.baseMidi, grid.width, newIncrement_H, newIncrement_D, newIncrement_V);
    });
}


function renderBridge (x1, y1, x2, y2, c1, c2) {
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


function renderTuningReference () {
    push();
    const cornerOffset = map(width, 1200, 2200, 44, 54, true);
    translate(width-cornerOffset, cornerOffset);
    scale((menuIsOpen) ? 1.3 : 1.2);

    // round base
    strokeWeight(16);
    const baseSize = 26;
    for (let t = 0; t < cfg.tuning.pattern.steps; t++) {
        const angle = map(t, 0, cfg.tuning.pattern.steps, 0, TWO_PI) - HALF_PI;
        const start = {x: cos(angle) * 0, y: sin(angle) * 0};
        const end = {x: cos(angle) * baseSize, y: sin(angle) * baseSize};
        stroke(lerpColor(theme.bg, color("black"), 0.5));
        line(start.x, start.y, end.x, end.y);
    }

    // 12tet lines
    const lineAlpha = (orderedKeys.length > 0) ? 70 : 100;
    strokeWeight(2);

    for (let t = 0; t < 12; t++) {
        const angle = map(t, 0, 12, 0, TWO_PI) - HALF_PI;
        const innerD = (tuningPatterns.ne12.scale[t] == 1) ? 0 : 10;
        const start = {x: cos(angle) * innerD, y: sin(angle) * innerD};
        const end = {x: cos(angle) * 19, y: sin(angle) * 19};

        const lineColor = color(atAlpha(theme.bg, lineAlpha));
        stroke(lineColor);
        line(start.x, start.y, end.x, end.y);
    }

    // outer lines
    const octaveLength = cfg.tuning.pattern.steps;
    strokeWeight(map(octaveLength, 12, 24, 3, 2, true)); //2 or more
    const endScale = map(octaveLength, 12, 24, 26, 28, true);

    for (let i = 0; i < octaveLength; i++) {
        const freq = intervalFromTuning(i);
        const cents = scaleFreqToCents(freq);
        const angle = map(cents, 0, 1200, 0, TWO_PI) - HALF_PI;
        const start = {x: cos(angle) * 19, y: sin(angle) * 19};
        const end = {x: cos(angle) * endScale, y: sin(angle) * endScale};

        let col = theme.textdark;
        if (cfg.tuning.pattern.scale[i] === 1) {
            col = theme.text;
        } else if (cfg.tuning.pattern.scale[i] === -1) {
            col = theme.textdarker;
        }
        const lineColor = color(atAlpha(col, lineAlpha));
        stroke(lineColor);
        line(start.x, start.y, end.x, end.y);
    }

    // draw the lines between the segments in order of playing
    let lastKeyAngle;
    let lastKeyColor;
    let lastKeyOctave;
    strokeWeight(0.9);
    const orderedPercent = Math.min(orderedKeys.length / cfg.tuning.pattern.steps, 1);
    const dotScale = -sqrt(1 - pow(orderedPercent - 1, 2)) + 2;

    orderedKeys.forEach((o) => {

        const index = (o.midiName % octaveLength);
        const freq = intervalFromTuning(index);
        let cents = scaleFreqToCents(freq);

        const matchingVoice = activeKeys[o.name];
        if (matchingVoice !== undefined) {
            const bendcents = matchingVoice.voice.get().detune;
            cents += bendcents;
        }

        const keyAngle = map(cents, 0, 1200, 0, TWO_PI) - HALF_PI;
        const keyColor = o.keyColorFromPalette(2);
        const keyOctave = map(o.octave, 0, 6, 18, 28, true);

        const now = {x: cos(keyAngle) * keyOctave, y: sin(keyAngle) * keyOctave};

        // dot
        noStroke();
        fill(keyColor);
        ellipse(now.x, now.y, 2.8 * dotScale);

        fill(color(atAlpha(keyColor, 30)));
        ellipse(now.x, now.y, 4.5 * dotScale);

        fill(color(atAlpha(keyColor, 10)));
        ellipse(now.x, now.y, 7.5 * dotScale);

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

function renderToolbar () {
    push();
    translate(38, 38);

    const buttonSize = 38;
    let buttonsX = 0;
    let keyboardHelp = 1;

    for (let t = 0; t < tools.length; t++) {
        const tool = tools[t];
        textSize(17);
    
        if (tool.visible()) {
            if (t === currentToolIndex) {
                stroke(theme.text)
                fill(theme.bg);
                rect(buttonsX, 0, buttonSize -4, buttonSize -4, 12);
                noStroke();
                fill(theme.highlight);
            } else {
                fill(color(atAlpha(theme.bgdark,90)));
                rect(buttonsX, 0, buttonSize -4, buttonSize -4, 12);
                noStroke();
                fill(theme.textdark);
            }

            if (tool.image !== undefined) {
                image(tool.image, buttonsX-18, -20, 32, 32);
            } else {
                text(tool.label, buttonsX-2, -8);
            }

            fill(theme.textdark);
            textSize(13);
            text(keyboardHelp, buttonsX+18, 14);
            keyboardHelp++;

            buttonsX += buttonSize*2;
        }
    }
    pop();

    push();
    ongoingTouches.forEach((o) => {
        if (o.identifier === currentToolTouch) {
            noFill();
            strokeWeight(4);
            stroke("#FFFFFF70");
            ellipse(o.clientX, o.clientY, 80);

            noStroke();
            //fill("#FFFFFF70");
            //rect(o.clientX + 80, o.clientY, 34, 14, 20);
            fill(theme.highlight)
            strokeWeight(5);
            stroke("#00000040");
            textSize(16);
            textAlign(LEFT);
            text(tools[currentToolIndex].label, o.clientX + 55, o.clientY - 18);
        }
    });
    pop();
}

function renderCornerText () {
    push();
    textFont("Satoshi");
    textSize(16);
    textStyle(BOLD);

    let playText = noteNames[cfg.baseNote] + octaveSymbols[cfg.baseOctave] + " " + capitalize(cfg.tuning.name);
    playText += "  ";

    for (let o = 0; o < orderedKeys.length; o++) {
        let keyName;
        const octave = orderedKeys[o].octave + cfg.baseOctave;
        let octaveSymbol = octaveSymbols[octave % octaveSymbols.length];
        if (octaveSymbol === undefined) octaveSymbol = "-";

        if (cfg.tuning.pattern === tuningPatterns.ne12) {
            keyName = orderedKeys[o].noteSymbol + octaveSymbol;
        } else {
            keyName = (orderedKeys[o].midiName % octaveSymbols.length) + octaveSymbol;
        }
        playText += " " + keyName;
    }

    //testing
    if (toolMode === "pen") playText += " PEN ";
    if (cfg.isPitchBend) playText += " BEND ";

    textWithShadow(playText, LEFT, 15, height - 20);


    let voicesText = "";
    if (instrumentType === "synth") {

        let sumDetune = 0;
        synthvoices.forEach((s) => {
            sumDetune += s.get().detune;
        });
        if (sumDetune !== 0) {
            voicesText += " " + sumDetune.toFixed(1);
        }

        voicesText += "  " + Object.values(activeKeys).length + "/32 Voices";
    }

    textWithShadow(voicesText, RIGHT, width-15, height - 20);


    function textWithShadow(txt, align, x, y) {
        textAlign(align, CENTER);

        strokeWeight(5);
        stroke(color(atAlpha(theme.bgdark,90)));
        text(txt, x, y);

        noStroke();
        const textColor = lerpColor(theme.textdark, theme.text, frameCountdown/20);
        fill(textColor);
        text(txt, x, y);
    }

    pop();
}


function findNearestButton (touch, arr) {
    let closestButton;
    if (touch === undefined) return;

    if (menuIsOpen) {
        arr.forEach((h) => {
            //if in certain X and Y distance of button center
            if (Math.abs(touch.clientX - h.x) < 80 && 
                Math.abs(touch.clientY - h.y) < 40 &&
                menuButtonFunctions[h.col][h.row].type !== "label") {
                {closestButton = h;}
            }
        });
    } else {
        //which hexagon is closest?
        closestButton = arr[0];
        arr.forEach((h) => {
            if (h.keyDistanceToTouch(touch) < closestButton.keyDistanceToTouch(touch)) {
                closestButton = h;
              }
        });
    }

    if (closestButton !== undefined) {
        closestButton.lastTouch = {id:touch.identifier, type:touch.interactionType};
        return closestButton;
    }
}


class GenericButtonClass {
    // anything shared by keys and menu buttons can go here
}

class KeyClass extends GenericButtonClass {
    constructor (x, y, name) {
        super();
        this.setRotatedCoordinates(x, y)
        this.name = name;
        this.setMidiFromGrid(grid.baseMidi, grid.width, grid.axisH, grid.axisD, grid.axisV);
        this.heat = 0;
    }

    setMidiFromGrid (base, width, h, d, v) {
        this.midiName =
            base + grid.tuningMidiOffset +
            floor((this.name % width) / 2) * h +
            ((this.name % width) % 2) * d +
            floor(this.name / width) * v;

        // note symbols are only used in 12nejis.
        this.noteSymbol = (cfg.tuning.pattern === tuningPatterns.ne12) ? noteNames[(this.midiName + cfg.baseNote) % 12] :"";
        this.octave = floor(this.midiName / cfg.tuning.pattern.steps) - 2;
    }

    setRotatedCoordinates(startX, startY) {

        function calculateRotationMatrix(rotation, center) {
            var m = [];

            m[0] = Math.cos(PI*(rotation/360));
            m[1] = Math.sin(PI*(rotation/360));
            m[2] = -m[1];
            m[3] = m[0];
            m[4] = center.x - m[0] * center.x - m[2] * center.y;
            m[5] = center.y - m[1] * center.x - m[3] * center.y;

            return m;
        }

        const m = calculateRotationMatrix(grid.angle, {x:width/2, y:height/2});

        function applyMatrixToPoint(m, p) { /*Array, Point*/
            return {
                x:m[0] * p.x + m[2] * p.y + m[4],
                y:m[1] * p.x + m[3] * p.y + m[5],
            };
        }

        const point = applyMatrixToPoint(m, {x:startX, y:startY})

        this.x = point.x;
        this.y = point.y;
    }

    renderKeyType (state, strength) {
        push();
        noStroke();
        translate(this.x, this.y);
        rotate(PI*(grid.angle/360));

        const baseColor = this.keyColorFromPalette(0);
        const lightColor = this.keyColorFromPalette(1);
        const glowColor = this.keyColorFromPalette(2);
        const lightColor50 = color(atAlpha(lightColor, 50));
        const hexInner = 0.9 * grid.hexSize;
        const circleSize = 0.53 * grid.hexSize * 2;
        const nearOctave = ((this.midiName) % cfg.tuning.pattern.steps) / cfg.tuning.pattern.steps;
        const circleInner = (nearOctave === 0)? 0 : map(nearOctave, 0, 1, 0.24, 1) * 0.38 * grid.hexSize * 2;

        // if keys are being pressed, dim the other keys
        const idleOverlay = (orderedKeys.length > 0) ? color(atAlpha(theme.bgdark, 8)) : color(atAlpha(theme.bgdark, 4));

        const scale = grid.hexSize / 34;

        // note states
        switch (state) {
            case "idle":
                keyShape(1*scale, 3*scale, grid.hexSize+1*scale, color("#00000040"));
                keyShape(0, 0, grid.hexSize, baseColor);
                centerShape(0, 0, circleSize, lightColor50);
                centerShape(0, 0, circleInner, baseColor);
                keyShapeOverlay(0, 0, grid.hexSize, idleOverlay);
                break;
            case "differentOctave":
                keyShape(1*scale, 3*scale, grid.hexSize+1*scale, color("#00000030"));
                keyShape(0, 0, grid.hexSize, baseColor);
                centerShape(0, 0, circleSize* 1.05, lightColor50);
                centerShape(0, 0, circleInner* 1.2, baseColor);
                keyShapeOverlay(0, 0, grid.hexSize, idleOverlay);
                break;
            case "stepHigher":
                keyShape(1*scale, 3*scale, grid.hexSize+1*scale, color("#00000030"));
                keyShape(0, 0, grid.hexSize, baseColor);
                centerShape(0-2*scale, 0, circleSize, lightColor50);
                centerShape(0-2*scale, 0, circleInner, baseColor);
                keyShapeOverlay(0, 0, grid.hexSize, idleOverlay);
                break;
            case "stepLower":
                keyShape(1*scale, 3*scale, grid.hexSize+1*scale, color("#00000030"));
                keyShape(0, 0, grid.hexSize, baseColor);
                centerShape(2*scale, 0, circleSize, lightColor50);
                centerShape(2*scale, 0, circleInner, baseColor);
                keyShapeOverlay(0, 0, grid.hexSize, idleOverlay);
                break;
            case "stepHigherAndLower":
                keyShape(1*scale, 3*scale, grid.hexSize+1*scale, color("#00000030"));
                keyShape(0, 0, grid.hexSize, baseColor);
                centerShape(0, 0, circleSize, lightColor50, "wide");
                centerShape(0, 0, circleInner, baseColor, "wide");
                keyShapeOverlay(0, 0, grid.hexSize, idleOverlay);
                break;
            case "pressed":
                keyShape(0, 1*scale, grid.hexSize, theme.highlight);
                keyShape(0, 1*scale, hexInner, lightColor);
                centerShape(0, 1*scale, circleInner * 1.3, baseColor);
                centerShape(0, 1*scale, circleInner * 1.3, lightColor50);
                break;
            case "sustained":
                keyShape(0, 0.5*scale, grid.hexSize, theme.highlight);
                keyShape(0, 0.5*scale, grid.hexSize, color(atAlpha(lightColor, 30)));
                keyShape(0, 0.5*scale, hexInner, lightColor);
                centerShape(0, 0.5*scale, circleInner* 1.2, baseColor);
                centerShape(0, 0.5*scale, circleInner* 1.2, lightColor50);
                break;
            case "deactivatedSustained":
                keyShape(1*scale, 3*scale, grid.hexSize+1*scale, color("#00000030"));
                keyShape(0, 0, grid.hexSize, theme.highlight);
                keyShape(0, 0, grid.hexSize, lightColor50);
                keyShape(0, 0, hexInner, lightColor);
                centerShape(0, 0, circleInner, baseColor);
                centerShape(0, 0, circleInner, lightColor50);
                break;
            case "glow":
                const rgb = glowColor;
                const glowColorStrength = color(atAlpha(rgb, strength));
                gradientCircle(
                    glowColorStrength, grid.hexSize * 0.5,
                    glowColorStrength, grid.hexSize * 4,
                    0, 0, 14);
                break;
            case "hover":
                const hoverColor = color(atAlpha(glowColor, 30));
                centerShape(0, 0, 42, hoverColor);
                break;
        }
        pop();
    }

    drawKeyGlow () {
        const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName);
        if (inKlickedHexes !== undefined ) {
            this.renderKeyType("glow", "05"); return;
        }
        const inSustainedKeys = sustainedKeys.find(t => t.midiName === this.midiName);
        if (inSustainedKeys !== undefined) {
            this.renderKeyType("glow", "02"); return;
        }
        if (hoverButton !== undefined && hoverButton.midiName === this.midiName) {
            this.renderKeyType("hover"); return;
        }
    }

    keyColorFromPalette (v) {
        const octaveColors = [theme.red, theme.green, theme.blue];
        const hue = octaveColors[(this.octave + 3 + cfg.baseOctave) % 3];
        const value = valueFromScale(this.midiName % cfg.tuning.pattern.steps)[v]
        return hue[value];
    }

    renderText (state) {
        // text on note
        push();
        translate(this.x, this.y);
        //rotate(PI*0.1);
        const scaler = grid.hexSize / 34;
        textSize(22 * scaler);

        // shadow
        strokeWeight(4 * scaler);
        stroke("#00000050");
        fill("#00000050");
        this.renderKeyText(0, 0);

        const darkTextColor = lerpColor(this.keyColorFromPalette(2), theme.highlight, 0.5);
        const lightTextColor = lerpColor(this.keyColorFromPalette(2), color("white"), 0.8);

        noStroke();
        if (state === "hover" || state === "klicked" || state === "sustained") {
            fill(lightTextColor);
        } else if (this.noteSymbol === noteNames[cfg.baseNote] || this.midiName % cfg.tuning.pattern.steps === 0) { 
            fill(lightTextColor); 
        } else if (cfg.tuning.pattern.scale[this.midiName % cfg.tuning.pattern.steps] !== 1) {
            fill(darkTextColor);
        } else {
            fill(lightTextColor);
        }

        this.renderKeyText(0, 0);

        if (state === "idle") {
            const idleOverlay = (orderedKeys.length > 0) ? color(atAlpha(theme.bgdark, 4)) : color("#00000000");
            fill(idleOverlay);
            this.renderKeyText(0, 0);
        }

        // extra text above

        if (cfg.tuning.type === "ratios") {
            const intervalName = cfg.tuning.ratios[this.midiName % cfg.tuning.pattern.steps]; //intervalFromTuning

            let topText = intervalName;
            if (topText == 1) {topText = "";}

            this.renderExtraKeyText(topText, 0, -25*scaler, state, this.keyColorFromPalette(2), this.keyColorFromPalette(0));
        }

        //if (this.heat > 0) {
        //    this.renderExtraKeyText(this.heat, 0, 25, state);
        //}

        if (cfg.tuning.pattern === tuningPatterns.ne12 && menuIsOpen) {
            const index = (this.midiName - cfg.tuning.pattern.steps * 5);
            let whitekeytext = whiteKeyModes[index];
            if (whitekeytext === undefined) {whitekeytext = ""}
            if (whitekeytext !== "") {
                this.renderExtraKeyText(whitekeytext, 0, 18*scaler, state, lightTextColor, "#00000050");
            }
            
        }
        pop();
    }

    renderExtraKeyText (txt, x, y, state, fc, sc) {
        push();
        const scaler = grid.hexSize / 34;
        textSize(11 * scaler);
        strokeWeight(3 * scaler);
        stroke(sc);
        fill(fc);

        text(txt, x, y);

        if (orderedKeys.length > 0 && state === "idle") {
            noStroke();
            const idleOverlay = color(atAlpha(theme.bgdark, 10));
            fill(idleOverlay);
            text(txt, x, y);
        }
        pop();
    }

    renderKeyText (x, y) {
        const octaveLength = cfg.tuning.pattern.steps;
        let keyText = "";

        if (cfg.labelStyle !== "none") {

            if (cfg.labelStyle === "intervals" && cfg.tuning.pattern.intervals !== undefined) {
                keyText = cfg.tuning.pattern.intervals[this.midiName % octaveLength];
            } else if (cfg.labelStyle === "notes" && cfg.tuning.pattern === tuningPatterns.ne12) {
                keyText = this.noteSymbol;
            } else {
                keyText = this.midiName % octaveLength;
            }

            // Add symbol for octave only on first note of each
            if (this.noteSymbol === noteNames[cfg.baseNote] || this.midiName % cfg.tuning.pattern.steps === 0) {
                const octave = this.octave + cfg.baseOctave;
                const octaveSymbol = octaveSymbols[octave % octaveSymbols.length];
                keyText = " " + keyText + octaveSymbol;
            }
            text(keyText, x, y);
        } else if (menuIsOpen && this.midiName >= octaveLength*5 && this.midiName < octaveLength*6 && 
            cfg.tuning.pattern.scale[this.midiName % octaveLength] === 1) {
            if (cfg.tuning.pattern === tuningPatterns.ne12) {
                keyText = this.noteSymbol;
            } else {
                keyText = this.midiName % octaveLength;
            }
            text(keyText, x, y);
        }
    }

    get findKeyVariant () {
        if (menuIsOpen) return "idle";

        //const inKlickedHexes = pressedButtons.find(t => t.midiName === this.midiName && t.countdown > 0);
        const inPressedKeys = pressedButtons.find(t => t.midiName === this.midiName);
        const inSustainedKeys = sustainedKeys.find(t => t.midiName === this.midiName);
        const inDeactivatedSustainedKeys = deactivatedSustainedKeys.find(t => t.midiName === this.midiName);

        // also highlight same note in different octave.
        // in concertina layout, highlight the semitone instead.
        let higherHexes; let lowerHexes; let differentOctaveHexes;
        if (cfg.layout === "concertina") {
            higherHexes = pressedButtons.find(t => t.midiName - this.midiName === 1);
            lowerHexes = pressedButtons.find(t => t.midiName - this.midiName === -1);
        } else {
            const octaveLength = cfg.tuning.pattern.steps;
            differentOctaveHexes = pressedButtons.find(t => t.midiName % octaveLength === this.midiName % octaveLength);
        }

        if (inPressedKeys !== undefined) {
            return "pressed";
        } else if (inSustainedKeys !== undefined) {
            return "sustained";
        } else if (inDeactivatedSustainedKeys !== undefined) {
            return "deactivatedSustained";
        } else if (differentOctaveHexes !== undefined) {
            return "differentOctave";
        } else if (higherHexes !== undefined && lowerHexes !== undefined) {
            return "stepHigherAndLower";
        } else if (higherHexes !== undefined) {
            return "stepHigher";
        } else if (lowerHexes !== undefined) {
            return "stepLower";
        } else {
            return "idle";
        }
    }

    keyDistanceToTouch (touch) {
        if (touch !== undefined) {
             return dist(touch.clientX, touch.clientY, this.x + grid.translateOffset.x, this.y + grid.translateOffset.y);
        }
    }
}
function valueFromScale (scaleIndex) {
    //minor note
    if (cfg.tuning.pattern.scale[scaleIndex] === 0) return [1,2,3];
    //major note
    if (cfg.tuning.pattern.scale[scaleIndex] === 1) return [2,3,4];
    //ambiguous
    if (cfg.tuning.pattern.scale[scaleIndex] === -1) return [0,1,2];
}

function keyDragToVoices (h) {
    if (activeKeys[h.name] === undefined) {
        print("No active note to apply key drag on!");
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

class MenuButtonClass extends GenericButtonClass {
    constructor(x, y, column, row, id) {
        super();
        this.x = x;
        this.y = y;
        this.col = column;
        this.row = row;
        this.name = id;
    }

    renderButtonVariant () {
        const inPressedButtons = pressedButtons.find(t => t.name === this.name);

        const func = menuButtonFunctions[this.col][this.row];

        if (func !== undefined && func.type === "label") {
            this.renderButtonType("label");
        } else if (func !== undefined && func.label() === "") {
            this.renderButtonType("hidden");
        } else if (this.isButtonOn && inPressedButtons !== undefined) {
            this.renderButtonType("activepressed");
        } else if (inPressedButtons !== undefined) {
            this.renderButtonType("pressed");
        } else if (this.isButtonOn) {
            this.renderButtonType("active");
        } else if (this.isButtonOn === false || (func.type === "button" && this.isButtonOn === undefined)) {
            this.renderButtonType("inactive");
        } else {
            this.renderButtonType("idle");
        }
    }

    renderButtonType (state) {
        push();
        noStroke();
        const baseSize = 86;
        const onColor = theme.textdark;

        // button states
        switch (state) {
            case "label":
                break;
            case "hidden":
                fill(atAlpha(theme.bg, 30));
                controlShape(this.x, this.y, baseSize);
                break;
            case "pressed":
                fill(onColor);
                controlShape(this.x, this.y, baseSize*0.9);
                break;
            case "activepressed":
                fill(theme.textdark);
                controlShape(this.x, this.y, baseSize*0.9);
                break;
            case "idle":
                // more states than on/off
                fill(theme.bg);
                controlShape(this.x, this.y, baseSize);
                fill(onColor);
                triangle(this.x + 70, this.y, this.x + 60, this.y + 10, this.x + 60, this.y - 10);
                triangle(this.x - 70, this.y, this.x - 60, this.y + 10, this.x - 60, this.y - 10);
                break;
            case "active":
                fill(onColor);
                controlShape(this.x, this.y, baseSize);
                break;
            case "inactive":
                fill(theme.bg);
                controlShape(this.x, this.y, baseSize);
                break;
            case "hover":
                const hoverColor = color(atAlpha(theme.text, 20));
                fill(hoverColor);
                controlShape(this.x, this.y, baseSize);
                break;
        }
        this.renderButtonText();
        pop();
    }

    renderButtonHover () {
        if (hoverButton !== undefined && hoverButton.name === this.name) {
            this.renderButtonType("hover"); return;
        }
    }

    get isButtonOn () {
        const func = menuButtonFunctions[this.col][this.row];
        if (func.type !== "label") {
            return func.onCondition();
        } else {
            return false;
        }
    }

    renderButtonText () {
        push();
        noStroke();

        const func = menuButtonFunctions[this.col][this.row];
        if (func.type === "label") {
            fill(theme.textdark);
            textSize(15);
            textAlign(LEFT);
            text(func.label(), this.x-72, this.y-10);
        } else {
            const stateColor = (this.isButtonOn) ? theme.highlight : theme.text;
            fill(stateColor);
            textSize(18);
            text(func.label(), this.x, this.y-1);
        }
        pop();
    }
}


// HELPERS ===========================================================================================

function keyShape (x, y, r, color) {
    push();

    fill(color);
    strokeWeight(r * 0.8);
    stroke(color);

    if (cfg.layout === "concertina") {
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

    if (cfg.layout === "concertina") {
        hexagon(x, y, r*1.5, 1/2 * PI);
    } else {
        hexagon(x, y, r*1.5, 0);
    }
    pop();
}

function centerShape (x, y, r, color, variant) {
    push();
    fill(color);
    noStroke();
    if (variant === "wide") {
        ellipse(x, y, r*2.1, r*2);
    } else {
        ellipse(x, y, r*2);
    }
    pop();
}

function controlShape (x, y, r) {
    rect(x, y, r * 0.9, r * 0.32, r * 0.1);
}

function hexagon (x, y, r, angle) {
    beginShape();
    for (let a = 0; a < 2 * PI; a += (2 * PI) / 6) {
        let x2 = cos(a + angle) * r;
        let y2 = sin(a + angle) * r;
        vertex(x + x2, y + y2);
    }
    endShape(CLOSE);
}

function gradientCircle (cInner, sInner, cOuter, sOuter, x, y, steps) {
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

function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function scaleFreqToCents (freq) {
    return Math.log2(freq) * 1200;
}

function atAlpha (color, percent) {
    const r = red(color);
    const g = green(color);
    const b = blue(color);
    const a = percent / 100;
    return 'rgba('+r+','+g+','+b+','+a+')';
}

function overMenuButton(x, y) {
    return (x > width-72 && y < 72);
}
function overToolbar(x, y) {
    let visibleNumber = 0;
    tools.forEach((t) => {
        if (t.visible()) visibleNumber++;
    });
    return (x < (76 * visibleNumber) && y < 76);
}

function overToolIndex(x, y) {
    if (overToolbar(x, y)) {
        let checkAt = 0;
        for (let t = 0; t < tools.length; t++) {
            if (x > checkAt*76 && x < (checkAt + 1)*76) {
                print("On button: " + t)
                return t;
            }
            if (tools[t].visible()) checkAt++;
        }
    } 
}

function uniqByKeepFirst (a, key) {
    // from https:// stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

function uniqByKeepLast(a, key) {
    // from https:// stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    return [
        ...new Map(
            a.map(x => [key(x), x])
        ).values()
    ];
}