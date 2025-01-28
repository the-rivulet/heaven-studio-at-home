import { doNothing, getId, IMSIZE, noteTimes } from "./globals.js";
import { hideKarateMan, karateHit, karateMultiHit, karatePunchKick, setBounceInterval, showKarateMan } from "./karateman.js";
import { hideKitties, kittiesCloseUpClap, kittiesClap, kittiesSpin, kittiesFish } from "./kitties.js";
let score = 0, missed = false;
function checkMisses() {
    while (noteTimes[0].time - Date.now() < -200) {
        getId("past-results").innerHTML = "Miss<br/>" + getId("past-results").innerHTML;
        missed = true;
        noteTimes.splice(0, 1);
    }
}
function hitNote(key = "", invert = false) {
    var _a;
    if (!noteTimes.length)
        return false; // If there are no notes at all, return
    noteTimes.sort((a, b) => a.time - b.time); // Sort the notes
    checkMisses();
    // if no key was given, then look for any key
    let note = noteTimes.find(x => ((x.invert ? invert : !invert) && (key ? (key == x.key) : true)));
    let offset = note.time - Date.now();
    if (offset > 200)
        return false; // If there are no notes to hit, return
    let good = Math.abs(offset) <= 100, perfect = Math.abs(offset) <= 30;
    if (!good)
        missed = true;
    let rating = perfect ? "Perfect!" : good ? "Hit" : offset < 0 ? "Late" : "Early";
    getId("past-results").innerHTML = rating + " (" + (offset > 0 ? "+" : "") + offset.toString() + "ms)<br/>" + getId("past-results").innerHTML;
    note.onHit(good);
    // Scoring: Perfect = 10, Hit = 7.5 ~ 10, Early/Late/Miss = 0
    score += (perfect ? 10 : good ? 10 - ((Math.abs(offset) - 30) / 20) : 0) * ((_a = note.value) !== null && _a !== void 0 ? _a : 1);
    // Add a note thing to the DOM, and prepare to remove it
    let el = document.createElement("div");
    el.classList.add("hit");
    el.style.background = (perfect ? "lime" : good ? "yellow" : "red");
    el.style.left = "calc(" + (50 - offset / 4) + "% - 8px)";
    getId("marker").appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; }, 10);
    noteTimes.splice(noteTimes.indexOf(note), 1); // Remove the note that was hit
    return true;
}
document.onkeydown = (e) => { hitNote(e.key, false); };
document.onkeyup = (e) => { hitNote(e.key, true); };
document.onmousedown = (e) => { if (hitNote("", false))
    e.preventDefault(); };
document.onmouseup = (e) => { if (hitNote("", true))
    e.preventDefault(); };
let songNames = { "slugkitties": "Slugkitties!", "furretwalk": "furretwalk.mp3", "karateman": "Karate Scug" };
let bestScores = {}, songsPlayed = [];
function setUp() {
    getId("song-container").style.top = "0%";
    getId("marker").style.opacity = "0.5";
    // Set up the initial stuff
    for (let i of ["arti", "multihit", "topleft", "topright", "bottom", "left", "middle", "right", "fish"])
        getId(i).style.display = "block";
    // Center some things
    for (let i of ["bottom", "left", "middle", "right", "fish"])
        getId(i).style.left = "calc(50% - " + (IMSIZE / 2) + " * 1095px)";
    hideKitties();
    hideKarateMan();
}
function cleanUp(songID, maxScore) {
    let musicElement = getId("mus-" + songID);
    musicElement.pause();
    musicElement.currentTime = 0;
    getId(songID + "-button").disabled = false;
    let pct = 100 * score / maxScore;
    if ((pct > bestScores[songID]) || !(bestScores[songID]))
        bestScores[songID] = Math.floor(pct);
    getId("past-results").innerHTML = "Your score was " + Math.floor(pct) + " (" + (pct >= 100 ? "perfect!! :0" : pct >= 80 ? "superb! :D" : pct >= 60 ? "ok" : "try again D:") + ")" + (missed ? "" : ". and you didn't miss at all!") + "<br/>" + getId("past-results").innerHTML;
    getId("song-container").style.top = "-100%";
    getId(songID + "-button").textContent = "Play " + songNames[songID] + " (Best: " + bestScores[songID] + ")";
    // Hide all the stuff
    for (let i of ["arti", "multihit", "topleft", "topright", "bottom", "left", "middle", "right", "fish"])
        getId(i).style.display = "none";
    getId("marker").style.opacity = "0";
    getId("marker").innerHTML = "| &nbsp; |"; // Clear out all the note elements
}
function playSong(songID, cues, extraOffset, bpm, maxMeasures, maxScore) {
    let mspb = 60000 / bpm, delay = Math.round(mspb / 4), measure = Math.round(mspb * 4);
    score = 0;
    missed = false;
    setUp();
    // Use setInterval here as it's probably less likely to get offbeat
    let m = 0, q, nextAction = function () {
        cues[m](delay);
        m++;
    };
    setTimeout(() => {
        q = setInterval(nextAction, measure);
    }, extraOffset);
    setTimeout(() => {
        clearInterval(q);
        cleanUp(songID, maxScore);
    }, measure * maxMeasures);
}
function playSlugkitties() {
    playSong("slugkitties", [
        doNothing,
        d => kittiesCloseUpClap(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d),
        d => kittiesClap(d),
        d => kittiesClap(d, true),
        d => kittiesFish(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d, true),
        d => kittiesSpin(d, true),
        d => kittiesSpin(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d),
        d => kittiesClap(d, true),
        d => kittiesFish(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d),
        d => kittiesClap(d),
        d => kittiesClap(d, true),
        d => kittiesFish(d),
        d => kittiesClap(d, false, d * 8), // wait a half measure here...
        // wait a half measure here...
        d => kittiesCloseUpClap(d, false, d * 8) // and here
    ], 250, 136, 40, 760);
}
function playFurretWalk() {
    playSong("furretwalk", [
        doNothing,
        d => kittiesCloseUpClap(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d * 2, true),
        doNothing,
        d => kittiesSpin(d * 2, true),
        doNothing,
        d => kittiesSpin(d * 2, true),
        doNothing,
        d => kittiesSpin(d, true),
        d => kittiesFish(d),
        d => kittiesCloseUpClap(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d, true),
        d => kittiesSpin(d),
        d => kittiesClap(d, true),
        d => kittiesSpin(d * 2, true),
        doNothing,
        d => kittiesSpin(d * 2, true),
        doNothing,
        d => kittiesSpin(d * 2, true),
        doNothing,
        d => kittiesSpin(d, true),
        d => kittiesFish(d),
        d => kittiesCloseUpClap(d),
        d => kittiesCloseUpClap(d),
        d => kittiesClap(d)
    ], 250, 112, 35, 540);
}
function playKarateMan() {
    playSong("karateman", [
        d => { setBounceInterval(15000 / 256); setTimeout(() => { showKarateMan(); }, 90); },
        doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing,
        d => karatePunchKick(d),
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 1, d * 3), // this part is a little weird :slugshrug:
        // this part is a little weird :slugshrug:
        d => karateHit(d, 1, d * 3),
        d => karateHit(d, 1, d * 3),
        d => karateHit(d),
        d => karateMultiHit(d, 3), // Hit 3!
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateMultiHit(d, 3), // Hit 3!
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateMultiHit(d, 3), // Hit 3!
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateMultiHit(d, 3), // Hit 3!
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        doNothing,
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        doNothing,
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        d => karateHit(d),
        d => karateHit(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        d => karateHit(d, 0),
        d => karatePunchKick(d),
        doNothing,
        d => karatePunchKick(d),
        doNothing,
        doNothing,
        doNothing,
        d => karateHit(d, 1, d * 8),
    ], 65, 256, 140, 1320);
}
function buttonSetup(id, fn) {
    getId(id + "-button").textContent = "Play " + songNames[id];
    getId(id + "-button").onclick = (e) => {
        // Start audio
        let musicElement = getId("mus-" + id);
        if (!songsPlayed.includes(id)) {
            let musicContext = new AudioContext();
            let musicTrack = musicContext.createMediaElementSource(musicElement);
            musicTrack.connect(musicContext.destination);
            songsPlayed.push(id);
        }
        musicElement.play();
        getId(id + "-button").textContent = "Playing " + songNames[id];
        getId(id + "-button").disabled = true;
        fn();
    };
}
buttonSetup("slugkitties", playSlugkitties);
buttonSetup("furretwalk", playFurretWalk);
buttonSetup("karateman", playKarateMan);
