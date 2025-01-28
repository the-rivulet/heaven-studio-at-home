var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getId, IMSIZE, noteTimes, sleep } from "./globals.js";
let artiBounceInterval;
export function hideKarateMan() {
    getId("arti").style.bottom = "-500px";
    getId("arti").style.left = "0px";
    getId("multihit").style.top = "-200px";
    clearInterval(artiBounceInterval);
}
export function setBounceInterval(delay) {
    let km = getId("arti");
    artiBounceInterval = setInterval(() => {
        km.style.height = "calc(" + (IMSIZE * 0.995) + " * 647px)";
        setTimeout(() => { km.style.height = "calc(" + IMSIZE + " * 647px)"; }, delay * 2);
    }, delay * 8);
}
export function showKarateMan(delay) {
    let km = getId("arti");
    km.style.bottom = "0px";
    if (delay && !artiBounceInterval)
        setBounceInterval(delay);
}
export function karateHit(delay_1) {
    return __awaiter(this, arguments, void 0, function* (delay, rockType = 1, extraWait = 0) {
        showKarateMan(delay);
        let km = getId("arti");
        // And add the note...
        let rock;
        let rockHit = false;
        noteTimes.push({ time: Date.now() + delay * 8 + extraWait, key: "k", onHit(good) {
                km.src = "assets/arti-punch" + (good ? ".png" : "-miss.png");
                if (good) {
                    if (rockType <= 4) {
                        rockHit = true;
                        rock.style.left = "3000px"; // Get rid of it quickly
                    }
                }
                setTimeout(() => { km.src = "assets/arti.png"; }, 200);
            } });
        yield sleep(extraWait).then(() => {
            // Create a rock
            rock = document.createElement("img");
            rock.src = (rockType == 0 ? "assets/lantern.png" : rockType > 4 ? "assets/bomb.png" : "assets/rock" + rockType + ".png");
            getId("song-container").appendChild(rock);
            rock.style.display = "block";
            rock.style.transition = (delay * 8 / 1000 + 0.1) + "s cubic-bezier(.2, 0.01, .4, 1.35)";
            rock.style.bottom = "-450px";
            rock.style.left = "0px";
            setTimeout(() => {
                rock.style.bottom = "-10px";
            }, 20);
        })
            .then(() => sleep(delay * 8 + 100)).then(() => {
            if (!rockHit)
                rock.style.bottom = "-450px";
        });
        setTimeout(() => { rock.remove(); }, delay * 16);
        return rock; // this will be useful for later
    });
}
export function karateDoubleHit(delay_1) {
    return __awaiter(this, arguments, void 0, function* (delay, rockTypeA = 1, rockTypeB = 1, extraWait = 0) {
        karateHit(delay, rockTypeA, extraWait);
        karateHit(delay, rockTypeB, extraWait + delay * 4);
    });
}
export function karateMultiHit(delay, num, extraWait = 0) {
    let mh = getId("multihit");
    mh.src = "assets/hit" + num + ".png";
    mh.style.top = "-50px";
    karateHit(delay, 1, extraWait);
    for (let i = 2; i <= 4; i++) {
        if (i > num)
            break;
        karateHit(delay, i, delay * (i * 8 - 8) + extraWait);
    }
    setTimeout(() => { mh.style.top = "-200px"; }, delay * (num * 8) + extraWait);
}
export function karatePunchKick(delay, extraWait = 0) {
    // First do a normal hit...
    let hit = karateHit(delay, 5, extraWait);
    // ... then add a extra note to it
    let km = getId("arti");
    noteTimes.push({ time: Date.now() + delay * 13 + extraWait, key: "k", invert: true, onHit(good) {
            km.src = "assets/arti-kick" + (good ? ".png" : "-miss.png");
            hit.then(rock => {
                if (good) {
                    rock.style.left = "3000px";
                    rock.style.bottom = "-10px"; // don't fall
                }
            });
            setTimeout(() => { km.src = "assets/arti.png"; }, 200);
        } });
}
