let getId = (x) => document.getElementById(x);
;
let noteTimes = [];
let score = 0;
function checkMisses() {
    while (noteTimes[0].time - Date.now() < -200) {
        getId("past-results").innerHTML = "Miss<br/>" + getId("past-results").innerHTML;
        noteTimes.splice(0, 1);
    }
}
function hitNote(key, invert) {
    if (!noteTimes.length)
        return; // If there are no notes at all, return
    noteTimes.sort((a, b) => a.time - b.time); // Sort the notes
    checkMisses();
    let note = noteTimes.find(x => (invert ? x.invert : !x.invert) && x.key == key);
    let offset = note.time - Date.now();
    if (offset > 200)
        return; // If there are no notes to hit, return
    let rating = Math.abs(offset) <= 30 ? "Perfect!" : Math.abs(offset) <= 100 ? "Hit" : offset < 0 ? "Late" : "Early";
    getId("past-results").innerHTML = rating + " (" + offset.toString() + "ms)<br/>" + getId("past-results").innerHTML;
    note.onHit(Math.abs(offset) <= 100);
    score += Math.abs(offset) <= 30 ? 10 : Math.abs(offset) <= 100 ? 10 - ((Math.abs(offset) - 30) / 14) : 0;
    noteTimes.splice(noteTimes.indexOf(note), 1); // Remove the note that was hit
}
document.onkeydown = (e) => {
    hitNote(e.key, false);
};
document.onkeyup = (e) => {
    hitNote(e.key, true);
};
function kittiesClap(delay) {
    getId("wa1").style.opacity = "1";
    setTimeout(() => {
        getId("wa1").style.opacity = "0";
        getId("wa2").style.opacity = "1";
    }, delay * 3);
    setTimeout(() => {
        getId("wa2").style.opacity = "0";
        getId("wa3").style.opacity = "1";
    }, delay * 6);
    noteTimes.push({ time: Date.now() + delay * 10, key: "k", onHit(good) {
            let im = good ? "you-hit" : "you-miss";
            getId(im).style.opacity = "1";
        }, });
    setTimeout(() => {
        getId("wa3").style.opacity = "0";
        getId("npcs-hit").style.opacity = "1";
    }, delay * 10);
    setTimeout(() => {
        getId("npcs-hit").style.opacity = "0";
        getId("you-hit").style.opacity = "0";
        getId("you-miss").style.opacity = "0";
    }, delay * 11);
    noteTimes.push({ time: Date.now() + delay * 12, key: "k", onHit(good) {
            let im = good ? "you-hit" : "you-miss";
            getId(im).style.opacity = "1";
        }, });
    setTimeout(() => {
        getId("npcs-hit").style.opacity = "1";
    }, delay * 12);
    setTimeout(() => {
        getId("npcs-hit").style.opacity = "0";
        getId("you-hit").style.opacity = "0";
        getId("you-miss").style.opacity = "0";
    }, delay * 14);
}
function kittiesSpin(delay) {
    getId("wa3").style.opacity = "1";
    setTimeout(() => { getId("wa3").style.opacity = "0"; }, delay);
    setTimeout(() => { getId("wa3").style.opacity = "1"; }, delay * 2);
    setTimeout(() => { getId("wa3").style.opacity = "0"; }, delay * 3);
    setTimeout(() => { getId("wa3").style.opacity = "1"; }, delay * 4);
    setTimeout(() => { getId("wa3").style.opacity = "0"; }, delay * 5);
    setTimeout(() => { getId("wa3").style.opacity = "1"; }, delay * 6);
    setTimeout(() => { getId("wa3").style.opacity = "0"; }, delay * 7);
    noteTimes.push({ time: Date.now() + delay * 8, key: "j", onHit(good) {
            if (good) {
                getId("you").style.opacity = "0";
                getId("you-squish").style.opacity = "1";
            }
            else
                getId("you-miss").style.opacity = "1";
        }, });
    setTimeout(() => { getId("squish").style.opacity = "1"; }, delay * 8);
    noteTimes.push({ time: Date.now() + delay * 11, key: "j", invert: true, onHit(good) {
            getId("you-squish").style.opacity = "0";
            if (!good)
                getId("you-miss").style.opacity = "1";
            else
                getId("you").style.opacity = "1";
        }, });
    setTimeout(() => {
        getId("squish").style.opacity = "0";
    }, delay * 11);
    setTimeout(() => {
        getId("you").style.opacity = "1";
        getId("you-miss").style.opacity = "0";
        getId("you-squish").style.opacity = "0";
    }, delay * 14);
}
function playSlugkitties(bpm) {
    let mspb = 60000 / bpm, delay = Math.round(mspb / 4), measure = Math.round(mspb * 4);
    score = 0;
    let maxScore = 300;
    setTimeout(kittiesClap, measure * 2, delay);
    setTimeout(kittiesClap, measure * 3, delay);
    setTimeout(kittiesClap, measure * 4, delay);
    setTimeout(kittiesSpin, measure * 5, delay);
    setTimeout(kittiesClap, measure * 6, delay);
    setTimeout(kittiesClap, measure * 7, delay);
    setTimeout(kittiesClap, measure * 8, delay);
    setTimeout(kittiesSpin, measure * 9, delay);
    setTimeout(kittiesClap, measure * 10, delay);
    setTimeout(kittiesSpin, measure * 11, delay);
    setTimeout(kittiesClap, measure * 12, delay);
    setTimeout(kittiesClap, measure * 13, delay);
    setTimeout(kittiesClap, measure * 14, delay);
    setTimeout(kittiesClap, measure * 15, delay);
    setTimeout(kittiesClap, measure * 16, delay);
    // TODO: Fish
    // Stop audio
    let musicElement = getId("music");
    setTimeout(() => {
        musicElement.pause();
        musicElement.currentTime = 0;
        getId("test-button").disabled = false;
        let pct = (100 * score / maxScore);
        getId("past-results").innerHTML = "Your score was " + pct.toFixed(1) + "%. " + (pct >= 100 ? "perfect!! :0" : pct >= 80 ? "superb! :D" : pct >= 60 ? "ok :)" : "try again :(") + "<br/>" + getId("past-results").innerHTML;
    }, measure * 17.8);
}
getId("test-button").textContent = "Play slugkitties";
let played = false;
getId("test-button").onclick = (e) => {
    // Start audio
    let musicElement = getId("music");
    if (!played) {
        let musicContext = new AudioContext();
        let musicTrack = musicContext.createMediaElementSource(musicElement);
        musicTrack.connect(musicContext.destination);
        played = true;
    }
    musicElement.play();
    getId("test-button").textContent = "Playing slugkitties";
    getId("test-button").disabled = true;
    // Set up slugkitties
    setTimeout(playSlugkitties, 400, 136);
};
