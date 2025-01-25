let getId = function<T extends HTMLElement>(x: string) { return document.getElementById(x) as T; }

interface Note {time: number, key: string, invert?: boolean, value?: number, onHit: (good: boolean) => void};

const IMSIZE = 1.1;

let noteTimes: Note[] = [];
let score = 0, missed = false;

function checkMisses() {
  while(noteTimes[0].time - Date.now() < -200) {
    getId("past-results").innerHTML = "Miss<br/>" + getId("past-results").innerHTML;
    missed = true;
    noteTimes.splice(0, 1);
  }
}

function hitNote(key = "", invert = false) {
  if(!noteTimes.length) return false; // If there are no notes at all, return
  noteTimes.sort((a, b) => a.time - b.time); // Sort the notes
  checkMisses();
  // if no key was given, then look for any key
  let note = noteTimes.find(x => ((x.invert ? invert : !invert) && (key ? (key == x.key) : true)));
  let offset = note.time - Date.now();
  if(offset > 200) return false; // If there are no notes to hit, return
  let good = Math.abs(offset) <= 100, perfect = Math.abs(offset) <= 30;
  if(!good) missed = true;
  let rating = perfect ? "Perfect!" : good ? "Hit" : offset < 0 ? "Late" : "Early";
  getId("past-results").innerHTML = rating + " (" + (offset > 0 ? "+" : "") + offset.toString() + "ms)<br/>" + getId("past-results").innerHTML;
  note.onHit(good);
  // Scoring: Perfect = 10, Hit = 7.5 ~ 10, Early/Late/Miss = 0
  score += (perfect ? 10 : good ? 10 - ((Math.abs(offset) - 30) / 20) : 0) * (note.value ?? 1);
  // Add a note thing to the DOM, and prepare to remove it
  let el = document.createElement("div");
  el.classList.add("hit");
  el.style.background = (perfect ? "lime" : good ? "yellow" : "red");
  el.style.left = "calc(" + (50 - offset/4) + "% - 8px)";
  getId("marker").appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; }, 10);
  noteTimes.splice(noteTimes.indexOf(note), 1); // Remove the note that was hit
  return true;
}

document.onkeydown = (e) => {
  hitNote(e.key, false);
}
document.onkeyup = (e) => {
  hitNote(e.key, true);
}
document.onmousedown = (e) => {
  if(hitNote("", false)) e.preventDefault();
}
document.onmouseup = (e) => {
  if(hitNote("", true)) e.preventDefault();
}

function hideKitties() {
  getId("left").style.bottom = "-460px";
  getId("middle").style.bottom = "-460px";
  getId("right").style.bottom = "-460px";
  getId("bottom").style.bottom = "-250px";
  getId("topleft").style.top = "-175px"; getId("topleft").style.left = "-175px";
  getId("topright").style.top = "-175px"; getId("topright").style.right = "-175px";
  getId("fish").style.top = "-300px";
}

function kittiesCloseUpClap(delay: number, keepKittiesShown = false) {
  hideKitties();
  // Now show them again
  getId("topleft").style.top = "0%"; getId("topleft").style.left = "0%";
  setTimeout(() => { getId("topright").style.top = "0%"; getId("topright").style.right = "0%"; }, delay * 3);
  setTimeout(() => { getId("bottom").style.bottom = "0%"; }, delay * 6);
  // Now clap!
  setTimeout(() => {
    getId<HTMLImageElement>("topleft").src = "assets/nova-topleft-clap1.png";
    getId<HTMLImageElement>("topright").src = "assets/nova-topright-clap1.png";
  }, delay * 10);
  setTimeout(() => {
    getId<HTMLImageElement>("topleft").src = "assets/nova-topleft-clap2.png";
    getId<HTMLImageElement>("topright").src = "assets/nova-topright-clap2.png";
  }, delay * 11);
  setTimeout(() => {
    getId<HTMLImageElement>("topleft").src = "assets/nova-topleft-clap1.png";
    getId<HTMLImageElement>("topright").src = "assets/nova-topright-clap1.png";
  }, delay * 12);
  setTimeout(() => {
    getId<HTMLImageElement>("topleft").src = "assets/nova-topleft-clap2.png";
    getId<HTMLImageElement>("topright").src = "assets/nova-topright-clap2.png";
  }, delay * 13);
  setTimeout(() => {
    getId<HTMLImageElement>("topleft").src = "assets/nova-topleft.png";
    getId<HTMLImageElement>("topright").src = "assets/nova-topright.png";
    getId<HTMLImageElement>("bottom").src = "assets/nova-bottom.png";
    if(!keepKittiesShown) hideKitties();
  }, delay * 14);
  // And add the notes...
  for(let i of [10, 12]) {
    noteTimes.push({time: Date.now() + delay * i, key: "k", onHit(good) {
      getId<HTMLImageElement>("bottom").src = "assets/nova-bottom-" + (good ? "clap1.png" : "miss.png");
      if(good) setTimeout(() => { getId<HTMLImageElement>("bottom").src = "assets/nova-bottom-clap2.png"; }, delay);
    }});
  }
}

function kittiesClap(delay: number, keepKittiesShown = false) {
  hideKitties();
  // Now show them again
  getId("left").style.bottom = "0%";
  setTimeout(() => { getId("middle").style.bottom = "0%"; }, delay * 3);
  setTimeout(() => { getId("right").style.bottom = "0%"; }, delay * 6);
  // Now clap!
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left-clap1.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-clap1.png";
  }, delay * 10);
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left-clap2.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-clap2.png";
  }, delay * 11);
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left-clap1.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-clap1.png";
  }, delay * 12);
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left-clap2.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-clap2.png";
  }, delay * 13);
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle.png";
    getId<HTMLImageElement>("right").src = "assets/nova-right.png";
    if(!keepKittiesShown) hideKitties();
  }, delay * 14);
  // And add the notes...
  for(let i of [10, 12]) {
    noteTimes.push({time: Date.now() + delay * i, key: "k", onHit(good) {
      getId<HTMLImageElement>("right").src = "assets/nova-right-" + (good ? "clap1.png" : "miss.png");
      if(good) setTimeout(() => { getId<HTMLImageElement>("right").src = "assets/nova-right-clap2.png"; }, delay);
    }});
  }
}

function kittiesSpin(delay: number, keepKittiesShown = false) {
  // This will only work right after a "kittiesClap" (not CloseUp)
  for(let time = 0; time < 4; time++) {
    setTimeout(() => {
      for(let i of ["left", "middle", "right"]) getId(i).style.height = "calc(" + (IMSIZE*0.9) + " * 647px)";
    }, delay * 2 * time);
    setTimeout(() => {
      for(let i of ["left", "middle", "right"]) getId(i).style.height = "calc(" + IMSIZE + " * 647px)";
    }, delay * (1 + 2 * time));
  }
  // Now do a BIG squish, then jump up!
  setTimeout(() => {
    for(let i of ["left", "middle"]) getId(i).style.height = "calc(0.65 * 647px)";
  }, delay * 8);
  noteTimes.push({time: Date.now() + delay * 8, key: "j", onHit(good) {
    getId("right").style.height = "calc(" + (good ? 0.65 : 0.9) + " * 647px)";
  },});
  setTimeout(() => {
    for(let i of ["left", "middle", "right"]) getId(i).style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("left").src = "assets/nova-left-pose.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-pose.png";
  }, delay * 11);
  noteTimes.push({time: Date.now() + delay * 11, key: "j", invert: true, onHit(good) {
    getId<HTMLImageElement>("right").src = "assets/nova-right-pose" + (good ? ".png" : "-miss.png");
    setTimeout(() => { getId<HTMLImageElement>("right").src = "assets/nova-right.png"; }, delay * 3);
  },});
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle.png";
    if(!keepKittiesShown) hideKitties();
  }, delay * 14);
}

function kittiesFish(delay: number, keepKittiesShown = false) {
  getId("fish").style.transition = (delay * 8 / 1000) + "s";
  getId("fish").style.top = "0%";
  setTimeout(() => { getId("left").style.height = "calc(" + (IMSIZE/2) + " * 647px)"; }, delay * 8);
  setTimeout(() => { getId("middle").style.height = "calc(" + (IMSIZE/2) + " * 647px)"; }, delay * 9);
  setTimeout(() => { getId("right").style.height = "calc(" + (IMSIZE/2) + " * 647px)"; }, delay * 10);
  setTimeout(() => {
    for(let i of ["left", "middle"]) getId(i).style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("left").src = "assets/nova-left-fish.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-fish.png";
  }, delay * 11);
  noteTimes.push({time: Date.now() + delay * 11, key: "k", value: 2, onHit(good) {
    getId("right").style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("right").src = "assets/nova-right-" + (good ? "fish.png" : "miss.png");
  },});
  setTimeout(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle.png";
    getId("right").style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("right").src = "assets/nova-right.png";
    if(!keepKittiesShown) hideKitties();
  }, delay * 14);
}

let bestScores = {}, songsPlayed = [];

function setUp() {
  getId("song-container").style.top = "0%";
  getId("marker").style.opacity = "0.5";
  // Set up the initial kitties
  for(let i of ["topleft", "topright", "bottom", "left", "middle", "right", "fish"]) getId(i).style.display = "block";
  for(let i of ["bottom", "left", "middle", "right", "fish"]) getId(i).style.left = "calc(50% - " + (IMSIZE/2) + " * 1095px)";
  hideKitties();
}
function cleanUp(songID: string, maxScore: number) {
  let musicElement = getId("mus-" + songID) as HTMLMediaElement;
  musicElement.pause(); musicElement.currentTime = 0;
  (getId(songID + "-button") as HTMLButtonElement).disabled = false;
  let pct = 100 * score/maxScore;
  if((pct > bestScores[songID]) || !(bestScores[songID])) bestScores[songID] = Math.floor(pct);
  getId("past-results").innerHTML = "Your score was " + Math.floor(pct) + " (" + (pct >= 100 ? "perfect!! :0" : pct >= 80 ? "superb! :D" : pct >= 60 ? "ok" : "try again D:") + ")" + (missed ? "" : ". and you didn't miss at all!") + "<br/>" + getId("past-results").innerHTML;
  getId("song-container").style.top = "-100%";
  getId(songID + "-button").textContent = "Play " + songID + " (Best: " + bestScores[songID] + ")";
  // Hide all the kitties
  for(let i of ["topleft", "topright", "bottom", "left", "middle", "right", "fish"]) getId(i).style.display = "none";
  getId("marker").style.opacity = "0";
  getId("marker").innerHTML = "| &nbsp; |"; // Clear out all the note elements
}

function playSlugkitties(bpm: number) {
  let mspb = 60000 / bpm, delay = Math.round(mspb / 4), measure = Math.round(mspb * 4);
  let extraOffset = 250; // Adjust this if everything is wrong
  score = 0; missed = false;
  setUp();
  // Use setInterval here as it's probably less likely to get offbeat
  let m = 0, q: any, nextAction = function() {
    m++;
    if(m < 2) return;
    /* */if(m ==  2) kittiesCloseUpClap(delay);
    else if(m ==  3) kittiesCloseUpClap(delay);
    else if(m ==  4) kittiesClap(delay, true);
    else if(m ==  5) kittiesSpin(delay);
    else if(m ==  6) kittiesCloseUpClap(delay);
    else if(m ==  7) kittiesClap(delay);
    else if(m ==  8) kittiesClap(delay, true);
    else if(m ==  9) kittiesSpin(delay);
    else if(m == 10) kittiesClap(delay, true);
    else if(m == 11) kittiesSpin(delay);
    else if(m == 12) kittiesClap(delay);
    else if(m == 13) kittiesCloseUpClap(delay);
    else if(m == 14) kittiesClap(delay);
    else if(m == 15) kittiesClap(delay);
    else if(m == 16) kittiesClap(delay, true);
    else if(m == 17) kittiesFish(delay);
    else if(m == 18) kittiesClap(delay, true);
    else if(m == 19) kittiesSpin(delay, true);
    else if(m == 20) kittiesSpin(delay);
    else if(m == 21) kittiesClap(delay, true);
    else if(m == 22) kittiesSpin(delay, true);
    else if(m == 23) kittiesSpin(delay, true);
    else if(m == 24) kittiesSpin(delay);
    else if(m == 25) kittiesCloseUpClap(delay);
    else if(m == 26) kittiesClap(delay);
    else if(m == 27) kittiesClap(delay, true);
    else if(m == 28) kittiesFish(delay);
    else if(m == 29) kittiesClap(delay, true);
    else if(m == 30) kittiesSpin(delay);
    else if(m == 31) kittiesClap(delay, true);
    else if(m == 32) kittiesSpin(delay);
    else if(m == 33) kittiesClap(delay);
    else if(m == 34) kittiesClap(delay);
    else if(m == 35) kittiesClap(delay, true);
    else if(m == 36) {
      kittiesFish(delay);
      // set up some extra timeouts
      setTimeout(kittiesClap, measure * 1.5, delay);
      setTimeout(kittiesCloseUpClap, measure * 2.5, delay);
    }
    else if(m > 36) clearInterval(q);
  }
  setTimeout(() => {
    q = setInterval(nextAction, measure);
  }, extraOffset);

  setTimeout(() => {
    cleanUp("slugkitties", 760);
  }, measure * 40);
}

function playFurretWalk(bpm: number) {
  let mspb = 60000 / bpm, delay = Math.round(mspb / 4), measure = Math.round(mspb * 4);
  let extraOffset = 250; // Adjust this if everything is wrong
  score = 0; missed = false;
  setUp();
  // Use setInterval here as it's probably less likely to get offbeat
  let m = 0, q: any, nextAction = function() {
    m++;
    if(m < 2) return;
    /* */if(m ==  2) kittiesCloseUpClap(delay);
    else if(m ==  3) kittiesCloseUpClap(delay);
    else if(m ==  4) kittiesClap(delay, true);
    else if(m ==  5) kittiesSpin(delay, true);
    else if(m ==  6) kittiesSpin(delay);
    else if(m ==  7) kittiesClap(delay, true);
    else if(m ==  8) kittiesSpin(delay*2, true);
    else if(m == 10) kittiesSpin(delay*2, true);
    else if(m == 12) kittiesSpin(delay*2, true);
    else if(m == 14) kittiesSpin(delay, true);
    else if(m == 15) kittiesFish(delay);

    else if(m == 16) kittiesCloseUpClap(delay);
    else if(m == 17) kittiesCloseUpClap(delay);
    else if(m == 18) kittiesClap(delay, true);
    else if(m == 19) kittiesSpin(delay);
    else if(m == 20) kittiesClap(delay, true);
    else if(m == 21) kittiesSpin(delay, true);
    else if(m == 22) kittiesSpin(delay);
    else if(m == 23) kittiesClap(delay, true);
    else if(m == 24) kittiesSpin(delay*2, true);
    else if(m == 26) kittiesSpin(delay*2, true);
    else if(m == 28) kittiesSpin(delay*2, true);
    else if(m == 30) kittiesSpin(delay, true);
    else if(m == 31) kittiesFish(delay);

    else if(m == 32) kittiesCloseUpClap(delay);
    else if(m == 33) kittiesCloseUpClap(delay);
    else if(m == 34) kittiesClap(delay);
    else if(m >  34) clearInterval(q);
  }
  setTimeout(() => {
    q = setInterval(nextAction, measure);
  }, extraOffset);

  setTimeout(() => {
    cleanUp("furretwalk", 540);
  }, measure * 35);
}

getId("slugkitties-button").textContent = "Play slugkitties";
getId("slugkitties-button").onclick = (e) => {
  // Start audio
  let musicElement = getId<HTMLAudioElement>("mus-slugkitties");
  if(!songsPlayed.includes("slugkitties")) {
    let musicContext = new AudioContext();
    let musicTrack = musicContext.createMediaElementSource(musicElement);
    musicTrack.connect(musicContext.destination);
    songsPlayed.push("slugkitties");
  }
  musicElement.play();
  getId("slugkitties-button").textContent = "Playing slugkitties";
  (getId("slugkitties-button") as HTMLButtonElement).disabled = true;
  playSlugkitties(136);
};

getId("furretwalk-button").textContent = "Play furretwalk";
getId("furretwalk-button").onclick = (e) => {
  // Start audio
  let musicElement = getId<HTMLAudioElement>("mus-furretwalk");
  if(!songsPlayed.includes("furretwalk")) {
    let musicContext = new AudioContext();
    let musicTrack = musicContext.createMediaElementSource(musicElement);
    musicTrack.connect(musicContext.destination);
    songsPlayed.push("furretwalk");
  }
  musicElement.play();
  getId("furretwalk-button").textContent = "Playing furretwalk";
  (getId("furretwalk-button") as HTMLButtonElement).disabled = true;
  // Set up slugkitties
  playFurretWalk(112);
};