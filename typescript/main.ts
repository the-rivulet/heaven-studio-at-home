import { doNothing, getId, IMSIZE, noteTimes } from "./globals.js";
import { hideKarateMan, karateDoubleHit, karateHit, karateMultiHit, karatePunchKick, setBounceInterval, showKarateMan } from "./karateman.js";
import { hideKitties, kittiesCloseUpClap, kittiesClap, kittiesSpin, kittiesFish } from "./kitties.js";

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
  let offset = note.time - Date.now() + (parseFloat(getId<HTMLInputElement>("offset").value) || 0);
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

document.onkeydown = (e) => { hitNote(e.key, false); }
document.onkeyup = (e) => { hitNote(e.key, true); }
document.onmousedown = (e) => { if(hitNote("", false)) e.preventDefault(); }
document.onmouseup = (e) => { if(hitNote("", true)) e.preventDefault(); }

let songNames = {"slugkitties": "Slugkitties!", "furretwalk": "furretwalk.mp3", "karateman": "Karate Scug"};
let bestScores = {}, songsPlayed = [];

function setUp() {
  getId("song-container").style.top = "0%";
  getId("marker").style.opacity = "0.5";
  // Set up the initial stuff
  for(let i of ["arti", "multihit", "topleft", "topright", "bottom", "left", "middle", "right", "fish"]) getId(i).style.display = "block";
  // Center some things
  for(let i of ["bottom", "left", "middle", "right", "fish"]) getId(i).style.left = "calc(50% - " + (IMSIZE/2) + " * 1095px)";
  hideKitties();
  hideKarateMan();
}
function cleanUp(songID: string, maxScore: number) {
  let musicElement = getId("mus-" + songID) as HTMLMediaElement;
  musicElement.pause(); musicElement.currentTime = 0;
  (getId(songID + "-button") as HTMLButtonElement).disabled = false;
  // Scoring!!
  let pct = 100 * score/maxScore;
  if((pct > bestScores[songID]) || !(bestScores[songID])) bestScores[songID] = Math.floor(pct);
  getId("past-results").innerHTML = "Your score was " + Math.floor(pct) + " (" + (pct >= 100 ? "perfect!! :0" : pct >= 80 ? "superb! :D" : pct >= 60 ? "ok" : "try again D:") + ")" + (missed ? "" : ". and you didn't miss at all!") + "<br/>" + getId("past-results").innerHTML;
  getId("results-container").style.top = "0%";
  let r = getId("results"), s = getId("scoring"), ss = getId("score"), rr = getId("rank");
  for(let i of [r, s, rr]) i.style.display = "none";
  r.textContent =
    pct >= 101 ? "I think I miscalculated something, pretty sure you're not supposed to have " + Math.floor(pct) + " points" :
    pct >= 100 ? "wow" :
    pct >= 99 ? "almost!!" :
    pct >= 98 ? "oh, that was so close... you'll get it next time!" :
    pct >= 95 ? "amazing! go for a perfect, I believe in you" :
    pct >= 90 ? "woah, very nice!" :
    pct >= 80 ? "awesome!" :
    pct >= 78 ? "superb, almost..." :
    pct >= 77 ? "what a lucky number. fortune smiles upon you, good luck!" :
    pct >= 70 ? "you made it!" :
    pct >= 63 ? "not bad." :
    pct >= 60 ? "really cutting it close huh?" :
    pct >= 55 ? "sorry to bring you such bad news, but..." :
    pct >= 50 ? "awh, if only you had hit a few more..." :
    pct >= 30 ? "maybe next time..." :
    pct >= 1 ? "at least you hit one" : "";
  setTimeout(() => { r.style.display = "block"; }, 2000);
  setTimeout(() => {
    // show the score
    s.style.display = "block";
    // slowly add it up...
    let displayedScore = 0;
    let addOne = function() {
      displayedScore++; ss.textContent = displayedScore.toString();
      ss.style.color = displayedScore >= 100 ? "magenta" : displayedScore >= 80 ? "red" : displayedScore >= 60 ? "lime": "cyan";
      if(displayedScore < Math.floor(pct)) setTimeout(addOne, 1000 / (Math.floor(pct) - displayedScore));
    };
    addOne();
  }, 4000);
  setTimeout(() => {
    rr.style.display = "block";
    rr.innerHTML = "<img src='assets/ranks/" + (pct >= 100 ? "perfect" : pct >= 80 ? "superb" : pct >= 60 ? "ok": "tryagain") + ".png'>";
    //rr.style.color = pct >= 100 ? "magenta" : pct >= 80 ? "red" : pct >= 60 ? "lime": "cyan";
    if(missed == false) rr.innerHTML += " <img src='assets/ranks/nomiss.png'>";
  }, 10000);
  setTimeout(() => { getId("results-container").style.top = "-100%"; }, 12000);
  // Cleanup
  getId("song-container").style.top = "-100%";
  getId(songID + "-button").textContent = "Play " + songNames[songID] + " (Best: " + bestScores[songID] + ")";
  // Hide all the stuff
  for(let i of ["arti", "multihit", "topleft", "topright", "bottom", "left", "middle", "right", "fish"]) getId(i).style.display = "none";
  getId("marker").style.opacity = "0";
  getId("marker").innerHTML = "| &nbsp; |"; // Clear out all the note elements
}

function playSong(songID: string, cues: ((d: number) => void)[], extraOffset: number, bpm: number, maxMeasures: number, maxScore: number) {
  let mspb = 60000 / bpm, delay = Math.round(mspb / 4), measure = Math.round(mspb * 4);
  score = 0; missed = false;
  setUp();
  // Use setInterval here as it's probably less likely to get offbeat
  let m = 0, q: number, nextAction = function() {
    cues[m](delay);
    m++;
  }
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
    kittiesCloseUpClap,
    kittiesCloseUpClap,
    d => kittiesClap(d, true),
    d => kittiesSpin(d),
    kittiesCloseUpClap,
    kittiesClap,
    d => kittiesClap(d, true),
    kittiesSpin,
    d => kittiesClap(d, true),
    kittiesSpin,
    kittiesClap,
    d => kittiesCloseUpClap(d),
    kittiesClap,
    kittiesClap,
    d => kittiesClap(d, true),
    kittiesFish,
    d => kittiesClap(d, true),
    d => kittiesSpin(d, true),
    kittiesSpin,
    d => kittiesClap(d, true),
    d => kittiesSpin(d, true),
    d => kittiesSpin(d, true),
    kittiesSpin,
    d => kittiesCloseUpClap(d),
    kittiesClap,
    d => kittiesClap(d, true),
    kittiesFish,
    d => kittiesClap(d, true),
    kittiesSpin,
    d => kittiesClap(d, true),
    kittiesSpin,
    kittiesClap,
    kittiesClap,
    d => kittiesClap(d, true),
    kittiesFish,
    d => kittiesClap(d, false, d * 8),       // wait a half measure here...
    d => kittiesCloseUpClap(d, false, d * 8) // and here
  ], 170, 136, 40, 760);
}

function playFurretWalk() {
  playSong("furretwalk", [
    doNothing,
    kittiesCloseUpClap,
    kittiesCloseUpClap,
    d => kittiesClap(d, true),
    d => kittiesSpin(d, true),
    kittiesSpin,
    d => kittiesClap(d, true),
    d => kittiesSpin(d*2, true),
    doNothing,
    d => kittiesSpin(d*2, true),
    doNothing,
    d => kittiesSpin(d*2, true),
    doNothing,
    d => kittiesSpin(d, true),
    kittiesFish,
    kittiesCloseUpClap,
    kittiesCloseUpClap,
    d => kittiesClap(d, true),
    kittiesSpin,
    d => kittiesClap(d, true),
    d => kittiesSpin(d, true),
    kittiesSpin,
    d => kittiesClap(d, true),
    d => kittiesSpin(d*2, true),
    doNothing,
    d => kittiesSpin(d*2, true),
    doNothing,
    d => kittiesSpin(d*2, true),
    doNothing,
    d => kittiesSpin(d, true),
    kittiesFish,
    kittiesCloseUpClap,
    kittiesCloseUpClap,
    kittiesClap
  ], 250, 112, 35, 540);
}

function playKarateMan() {
  playSong("karateman", [
    d => {
      setBounceInterval(15000/256);
      setTimeout(() => { showKarateMan(); }, 150);
      setTimeout(() => { getId<HTMLImageElement>("arti").src = "assets/karateman/uppercut.png"; }, 1700);
      setTimeout(() => { getId<HTMLImageElement>("arti").src = "assets/karateman/idle.png"; }, 2500);
    },
    doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing, doNothing,
    karatePunchKick,
    doNothing,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    d => karateHit(d, 0),
    karatePunchKick,
    karateHit, karateHit, karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, d => karateHit(d, 1, d*3), d => karateHit(d, 1, d*3), d => karateHit(d, 1, d*3), karateHit,
    karateHit,
    d => karateMultiHit(d, 3), // Hit 3!
    doNothing,
    karateHit, karateHit, karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    karateHit, karateHit, d => karateHit(d),
    d => karateMultiHit(d, 3), // Hit 3!
    doNothing,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    d => karateMultiHit(d, 3), // Hit 3!
    doNothing,
    karateHit, d => karateHit(d),
    d => karateMultiHit(d, 3), // Hit 3!
    doNothing,
    karateHit, karateHit, karateHit, karateHit, karateHit,
    karateHit, karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    karateHit, karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    d => karateHit(d), d => karateHit(d, 0),
    karatePunchKick,
    karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    karateHit, karateHit, d => karateHit(d, 0),
    karatePunchKick,
    d => karateHit(d, 0),
    karatePunchKick,
    doNothing,
    karatePunchKick,
    doNothing,
    doNothing,
    doNothing,
    d => karateHit(d, 1, d * 8),
  ], 0, 256, 140, 1320);
}

function buttonSetup(id: string, fn: () => void) {
  getId(id + "-button").textContent = "Play " + songNames[id];
  getId(id + "-button").onclick = (e) => {
    // Start audio
    let musicElement = getId<HTMLAudioElement>("mus-" + id);
    if(!songsPlayed.includes(id)) {
      let musicContext = new AudioContext();
      let musicTrack = musicContext.createMediaElementSource(musicElement);
      musicTrack.connect(musicContext.destination);
      songsPlayed.push(id);
    }
    musicElement.play();
    getId(id + "-button").textContent = "Playing " + songNames[id];
    (getId(id + "-button") as HTMLButtonElement).disabled = true;
    fn();
  };
}

buttonSetup("slugkitties", playSlugkitties);
buttonSetup("furretwalk", playFurretWalk);
buttonSetup("karateman", playKarateMan);