let sChanges = new Array;
let eChanges = new Array;
let mChanges = new Array;
let cChanges = new Array;

let sc, ec, mc, cc;

let sLog = "--------------------------------------";
let eLog = "--------------------------------------";
let mLog = "--------------------------------------";
let cLog = "--------------------------------------";

let ongoingTouches = new Array;

let pr = "";

function setup() {
    textFont('Courier');
    canvas = createCanvas(800, 400);
    canvas.parent('canvasContainer');

    let style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = `canvas{
        -webkit-touch-callout:none;
        -webkit-user-select:none;
        -khtml-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        outline:0;
        -webkit-tap-highlight-color:rgba(255,255,255,0)}
    body{-webkit-touch-callout:none;
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
    pr = ""

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        print("touchstart: " + i);
        pr += "start: " + i + ", ";
        ongoingTouches.push(copyTouch(newTouches[i]));
    }

    //old
    sChanges = evt.changedTouches;
    sc = true;
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

    //old
    mChanges = evt.changedTouches;
    mc = true;
}

function handleEnd(evt) {
    const newTouches = evt.changedTouches;

    for (let i = 0; i < newTouches.length; i++) {
        evt.preventDefault();
        const idx = ongoingTouchIndexById(newTouches[i].identifier);
        
        if (idx >= 0) {
            print("removing touch " + idx);
            pr += "re." + idx + " ";
            ongoingTouches.splice(idx, 1);
        }
    }

    eChanges = evt.changedTouches;
    ec = true;
}

function handleCancel(evt) {
    evt.preventDefault();
    print("touch cancel.");
    const newTouches = evt.changedTouches;
    
    for (var i = 0; i < newTouches.length; i++) {
      ongoingTouches.splice(i, 1); // remove it; we're done
    }

    cChanges = evt.changedTouches;
    cc = true;
}

function copyTouch(touch) {
    return {identifier: touch.identifier,clientX: touch.clientX,clientY: touch.clientY};
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

function ongoingTouchIndexByClientX(xToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        let x = ongoingTouches[i].clientX;

        if (x == xToFind) {
            return i;
        }
    }
    return -1; // not found
}

function draw() {
    background('gray')
    

    if (sc) { sc = false; sLog = sLog.substring(1) + "" + sChanges.length;} 
    else { sLog = sLog.substring(1) + "~";}

    if (mc) { mc = false; mLog = mLog.substring(1) + "" + mChanges.length;} 
    else { mLog = mLog.substring(1) + "~";}

    if (cc) { cc = false; cLog = cLog.substring(1) + "" + cChanges.length;} 
    else { cLog = cLog.substring(1) + "~";}

    if (ec) { ec = false; eLog = eLog.substring(1) + "" + eChanges.length;} 
    else { eLog = eLog.substring(1) + "~";}

    textSize(28);
    text(sLog +"\n"+mLog+"\n"+eLog+"\n"+cLog, 40, 60);

    let xPoses = "";
    ongoingTouches.forEach(t => {
        xPoses += t.clientX + ", ";
    });

    text(xPoses, 90, 300);
    text(pr, 90, 330);
}