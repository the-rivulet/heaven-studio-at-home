let getId = (x) => document.getElementById(x);
let noteTimes = [];
let notesHit = 0;
document.onkeydown = (e) => {
    if (e.key == "k") {
        if (!noteTimes.length)
            return; // If there are no notes at all, return
        while (noteTimes[0] - Date.now() < -200) {
            getId("past-results").innerHTML += "<br/> Miss";
            noteTimes.splice(0, 1);
        }
        let offset = noteTimes[0] - Date.now();
        if (offset > 200)
            return; // If there are no notes to hit, return
        getId("offset").textContent = offset.toString();
        let rating = Math.abs(offset) <= 30 ? "Perfect!" : Math.abs(offset) <= 100 ? "Hit" : offset < 0 ? "Late" : "Early";
        getId("past-results").innerHTML = rating + " (" + offset.toString() + "ms)" + "<br/>" + getId("past-results").innerHTML;
        noteTimes.splice(0, 1); // Remove the note that was hit
        if (Math.abs(offset) <= 100)
            notesHit++;
        // Animate the slugkitties
        let im = Math.abs(offset) <= 100 ? "you-hit" : "you-miss";
        getId(im).style.opacity = "1";
    }
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
    noteTimes.push(Date.now() + delay * 10);
    setTimeout(() => {
        getId("wa3").style.opacity = "0";
        getId("npcs-hit").style.opacity = "1";
    }, delay * 10);
    setTimeout(() => {
        getId("npcs-hit").style.opacity = "0";
        getId("you-hit").style.opacity = "0";
        getId("you-miss").style.opacity = "0";
    }, delay * 11);
    noteTimes.push(Date.now() + delay * 12);
    setTimeout(() => {
        getId("npcs-hit").style.opacity = "1";
    }, delay * 12);
    setTimeout(() => {
        getId("npcs-hit").style.opacity = "0";
        getId("you-hit").style.opacity = "0";
        getId("you-miss").style.opacity = "0";
    }, delay * 13);
}
getId("test-button").textContent = "Go!";
getId("test-button").onclick = (e) => {
    let delay = 120, measure = delay * 16;
    kittiesClap(delay);
    setTimeout(kittiesClap, measure, delay);
};
