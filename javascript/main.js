let getId = function (x) { return document.getElementById(x); };
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
    // Scoring: Perfect = 10, Hit = 7.5 ~ 10, Early/Late/Miss = 0
    score += Math.abs(offset) <= 30 ? 10 : Math.abs(offset) <= 100 ? 10 - ((Math.abs(offset) - 30) / 20) : 0;
    noteTimes.splice(noteTimes.indexOf(note), 1); // Remove the note that was hit
}
document.onkeydown = (e) => {
    hitNote(e.key, false);
};
document.onkeyup = (e) => {
    hitNote(e.key, true);
};
function hideKitties() {
    getId("left").style.bottom = "-460px";
    getId("middle").style.bottom = "-460px";
    getId("right").style.bottom = "-460px";
    getId("bottom").style.bottom = "-250px";
    getId("topleft").style.top = "-175px";
    getId("topleft").style.left = "-175px";
    getId("topright").style.top = "-175px";
    getId("topright").style.right = "-175px";
}
function kittiesCloseUpClap(delay, keepKittiesShown = false) {
    hideKitties();
    // Now show them again
    getId("topleft").style.top = "0%";
    getId("topleft").style.left = "0%";
    setTimeout(() => { getId("topright").style.top = "0%"; getId("topright").style.right = "0%"; }, delay * 3);
    setTimeout(() => { getId("bottom").style.bottom = "0%"; }, delay * 6);
    // Now clap!
    setTimeout(() => {
        getId("topleft").src = "assets/nova-topleft-clap1.png";
        getId("topright").src = "assets/nova-topright-clap1.png";
    }, delay * 10);
    setTimeout(() => {
        getId("topleft").src = "assets/nova-topleft-clap2.png";
        getId("topright").src = "assets/nova-topright-clap2.png";
    }, delay * 11);
    setTimeout(() => {
        getId("topleft").src = "assets/nova-topleft-clap1.png";
        getId("topright").src = "assets/nova-topright-clap1.png";
    }, delay * 12);
    setTimeout(() => {
        getId("topleft").src = "assets/nova-topleft-clap2.png";
        getId("topright").src = "assets/nova-topright-clap2.png";
    }, delay * 13);
    setTimeout(() => {
        getId("topleft").src = "assets/nova-topleft.png";
        getId("topright").src = "assets/nova-topright.png";
        if (!keepKittiesShown)
            hideKitties();
    }, delay * 14);
    // And add the notes...
    for (let i of [10, 12]) {
        noteTimes.push({ time: Date.now() + delay * i, key: "k", onHit(good) {
                getId("bottom").src = "assets/nova-bottom-" + (good ? "clap1.png" : "miss.png");
                if (good)
                    setTimeout(() => { getId("bottom").src = "assets/nova-bottom-clap2.png"; }, delay);
                setTimeout(() => { getId("bottom").src = "assets/nova-bottom.png"; }, delay * 2);
            } });
    }
}
function kittiesClap(delay, keepKittiesShown = false) {
    hideKitties();
    // Now show them again
    getId("left").style.bottom = "0%";
    setTimeout(() => { getId("middle").style.bottom = "0%"; }, delay * 3);
    setTimeout(() => { getId("right").style.bottom = "0%"; }, delay * 6);
    // Now clap!
    setTimeout(() => {
        getId("left").src = "assets/nova-left-clap1.png";
        getId("middle").src = "assets/nova-middle-clap1.png";
    }, delay * 10);
    setTimeout(() => {
        getId("left").src = "assets/nova-left-clap2.png";
        getId("middle").src = "assets/nova-middle-clap2.png";
    }, delay * 11);
    setTimeout(() => {
        getId("left").src = "assets/nova-left-clap1.png";
        getId("middle").src = "assets/nova-middle-clap1.png";
    }, delay * 12);
    setTimeout(() => {
        getId("left").src = "assets/nova-left-clap2.png";
        getId("middle").src = "assets/nova-middle-clap2.png";
    }, delay * 13);
    setTimeout(() => {
        getId("left").src = "assets/nova-left.png";
        getId("middle").src = "assets/nova-middle.png";
        if (!keepKittiesShown)
            hideKitties();
    }, delay * 16);
    // And add the notes...
    for (let i of [10, 12]) {
        noteTimes.push({ time: Date.now() + delay * i, key: "k", onHit(good) {
                getId("right").src = "assets/nova-right-" + (good ? "clap1.png" : "miss.png");
                if (good)
                    setTimeout(() => { getId("right").src = "assets/nova-right-clap2.png"; }, delay);
                setTimeout(() => { getId("right").src = "assets/nova-right.png"; }, delay * 2);
            } });
    }
}
function kittiesSpin(delay, keepKittiesShown) {
    // This will only work right after a "kittiesClap" (not CloseUp)
    for (let time = 0; time < 4; time++) {
        setTimeout(() => {
            for (let i of ["left", "middle", "right"])
                getId(i).style.height = "calc(1.2 * 647px)";
        }, delay * 2 * time);
        setTimeout(() => {
            for (let i of ["left", "middle", "right"])
                getId(i).style.height = "calc(1.3 * 647px)";
        }, delay * (1 + 2 * time));
    }
    // Now do a BIG squish, then jump up!
    setTimeout(() => {
        for (let i of ["left", "middle"])
            getId(i).style.height = "calc(0.65 * 647px)";
    }, delay * 8);
    noteTimes.push({ time: Date.now() + delay * 8, key: "j", onHit(good) {
            getId("right").style.height = "calc(" + (good ? 0.65 : 1.0) + " * 647px)";
        }, });
    setTimeout(() => {
        for (let i of ["left", "middle", "right"])
            getId(i).style.height = "calc(1.3 * 647px)";
        getId("left").src = "assets/nova-left-pose.png";
        getId("middle").src = "assets/nova-middle-pose.png";
    }, delay * 11);
    noteTimes.push({ time: Date.now() + delay * 11, key: "j", invert: true, onHit(good) {
            getId("right").src = "assets/nova-right-pose" + (good ? ".png" : "-miss.png");
            setTimeout(() => { getId("right").src = "assets/nova-right.png"; }, delay * 3);
        }, });
    setTimeout(() => {
        getId("left").src = "assets/nova-left.png";
        getId("middle").src = "assets/nova-middle.png";
        if (!keepKittiesShown)
            hideKitties();
    }, delay * 14);
}
let slugkittiesBestScore = 0;
function playSlugkitties(bpm) {
    let mspb = 60000 / bpm, delay = Math.round(mspb / 4), measure = Math.round(mspb * 4);
    score = 0;
    let maxScore = 300; // Each action is worth 20 points
    for (let i of ["topleft", "topright", "bottom", "left", "middle", "right"])
        getId(i).style.opacity = "1";
    getId("kitties-container").style.top = "0%";
    // Set up the initial kitties... be sure that  vvv  equals the scale factor in `style.css`
    for (let i of ["bottom", "left", "middle", "right"])
        getId(i).style.left = "calc(50% - 0.5 * 1.3 * 1095px)";
    hideKitties();
    setTimeout(kittiesCloseUpClap, measure * 2, delay);
    setTimeout(kittiesCloseUpClap, measure * 3, delay);
    setTimeout(kittiesClap, measure * 4, delay, true);
    setTimeout(kittiesSpin, measure * 5, delay);
    setTimeout(kittiesCloseUpClap, measure * 6, delay);
    setTimeout(kittiesClap, measure * 7, delay);
    setTimeout(kittiesClap, measure * 8, delay, true);
    setTimeout(kittiesSpin, measure * 9, delay);
    setTimeout(kittiesClap, measure * 10, delay, true);
    setTimeout(kittiesSpin, measure * 11, delay);
    setTimeout(kittiesClap, measure * 12, delay);
    setTimeout(kittiesCloseUpClap, measure * 13, delay);
    setTimeout(kittiesClap, measure * 14, delay);
    setTimeout(kittiesClap, measure * 15, delay);
    setTimeout(kittiesClap, measure * 16, delay);
    // TODO: Fish
    let musicElement = getId("music");
    setTimeout(() => {
        musicElement.pause();
        musicElement.currentTime = 0;
        getId("test-button").disabled = false;
        let pct = 100 * score / maxScore;
        if (pct > slugkittiesBestScore)
            slugkittiesBestScore = Math.floor(pct);
        getId("past-results").innerHTML = "Your score was " + Math.floor(pct) + " (" + (pct >= 100 ? "PERFECT!! :0" : pct >= 80 ? "superb! :D" : pct >= 60 ? "ok" : "try again D:") + ")<br/>" + getId("past-results").innerHTML;
        getId("kitties-container").style.top = "-100%";
        getId("test-button").textContent = "Play slugkitties (Best: " + slugkittiesBestScore + "%)";
        // Hide all the kitties
        for (let i of ["topleft", "topright", "bottom", "left", "middle", "right"])
            getId(i).style.opacity = "0";
    }, measure * 18);
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
