var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getId, sleep, IMSIZE, noteTimes } from "./globals.js";
export function hideKitties() {
    getId("left").style.bottom = "-460px";
    getId("middle").style.bottom = "-460px";
    getId("right").style.bottom = "-460px";
    getId("bottom").style.bottom = "-250px";
    getId("topleft").style.top = "-175px";
    getId("topleft").style.left = "-175px";
    getId("topright").style.top = "-175px";
    getId("topright").style.right = "-175px";
    getId("fish").style.top = "-300px";
}
export function kittiesCloseUpClap(delay_1) {
    return __awaiter(this, arguments, void 0, function* (delay, keepKittiesShown = false, extraWait = 0) {
        let tl = getId("topleft"), tr = getId("topright"), b = getId("bottom");
        // And add the notes...
        for (let i of [10, 12]) {
            noteTimes.push({ time: Date.now() + delay * i + extraWait, key: "k", onHit(good) {
                    b.src = "assets/kitties/bottom-" + (good ? "clap1.png" : "miss.png");
                    if (good)
                        setTimeout(() => { b.src = "assets/kitties/bottom-clap2.png"; }, delay);
                } });
        }
        yield sleep(extraWait).then(() => { hideKitties(); tl.style.top = "0%"; tl.style.left = "0%"; })
            .then(() => sleep(delay * 3)).then(() => { tr.style.top = "0%"; tr.style.right = "0%"; })
            .then(() => sleep(delay * 3)).then(() => { b.style.bottom = "0%"; })
            .then(() => sleep(delay * 4)).then(() => {
            tl.src = "assets/kitties/topleft-clap1.png";
            tr.src = "assets/kitties/topright-clap1.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            tl.src = "assets/kitties/topleft-clap2.png";
            tr.src = "assets/kitties/topright-clap2.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            tl.src = "assets/kitties/topleft-clap1.png";
            tr.src = "assets/kitties/topright-clap1.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            tl.src = "assets/kitties/topleft-clap2.png";
            tr.src = "assets/kitties/topright-clap2.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            tl.src = "assets/kitties/topleft.png";
            tr.src = "assets/kitties/topright.png";
            b.src = "assets/kitties/bottom.png";
            if (!keepKittiesShown)
                hideKitties();
        }).then(() => sleep(delay * 2));
    });
}
export function kittiesClap(delay_1) {
    return __awaiter(this, arguments, void 0, function* (delay, keepKittiesShown = false, extraWait = 0) {
        let l = getId("left"), m = getId("middle"), r = getId("right");
        // And add the notes...
        for (let i of [10, 12]) {
            noteTimes.push({ time: Date.now() + delay * i + extraWait, key: "k", onHit(good) {
                    r.src = "assets/kitties/right-" + (good ? "clap1.png" : "miss.png");
                    if (good)
                        setTimeout(() => { r.src = "assets/kitties/right-clap2.png"; }, delay);
                } });
        }
        yield sleep(extraWait).then(() => { hideKitties(); l.style.bottom = "0%"; })
            .then(() => sleep(delay * 3)).then(() => { m.style.bottom = "0%"; })
            .then(() => sleep(delay * 3)).then(() => { r.style.bottom = "0%"; })
            .then(() => sleep(delay * 4)).then(() => {
            l.src = "assets/kitties/left-clap1.png";
            m.src = "assets/kitties/middle-clap1.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            l.src = "assets/kitties/left-clap2.png";
            m.src = "assets/kitties/middle-clap2.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            l.src = "assets/kitties/left-clap1.png";
            m.src = "assets/kitties/middle-clap1.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            l.src = "assets/kitties/left-clap2.png";
            m.src = "assets/kitties/middle-clap2.png";
        })
            .then(() => sleep(delay * 1)).then(() => {
            l.src = "assets/kitties/left.png";
            m.src = "assets/kitties/middle.png";
            r.src = "assets/kitties/right.png";
            if (!keepKittiesShown)
                hideKitties();
        }).then(() => sleep(delay * 2));
    });
}
export function kittiesSpin(delay_1) {
    return __awaiter(this, arguments, void 0, function* (delay, keepKittiesShown = false, extraWait = 0) {
        // This will only work right after a "kittiesClap" (not CloseUp)
        let l = getId("left"), m = getId("middle"), r = getId("right");
        noteTimes.push({ time: Date.now() + delay * 8 + extraWait, key: "j", onHit(good) {
                r.style.height = "calc(" + (good ? IMSIZE / 2 : IMSIZE * 0.8) + " * 647px)";
            } }, { time: Date.now() + delay * 11 + extraWait, key: "j", invert: true, onHit(good) {
                r.src = "assets/kitties/right-pose" + (good ? ".png" : "-miss.png");
                r.style.height = "calc(" + IMSIZE + " * 647px)";
                setTimeout(() => { r.src = "assets/kitties/right.png"; }, delay * 3);
            } });
        for (let time = 0; time < 4; time++) {
            yield sleep(extraWait).then(() => { for (let i of [l, m, r])
                i.style.height = "calc(" + (IMSIZE * 0.9) + " * 647px)"; })
                .then(() => sleep(delay * 1)).then(() => { for (let i of [l, m, r])
                i.style.height = "calc(" + IMSIZE + " * 647px)"; })
                .then(() => sleep(delay * 1));
        }
        yield sleep(0).then(() => { for (let i of [l, m])
            i.style.height = "calc(" + (IMSIZE / 2) + " * 647px)"; })
            .then(() => sleep(delay * 3)).then(() => {
            for (let i of [l, m])
                i.style.height = "calc(" + IMSIZE + " * 647px)";
            l.src = "assets/kitties/left-pose.png";
            m.src = "assets/kitties/middle-pose.png";
        })
            .then(() => sleep(delay * 3)).then(() => {
            // in case the note was missed
            r.style.height = "calc(" + IMSIZE + " * 647px)";
            l.src = "assets/kitties/left.png";
            m.src = "assets/kitties/middle.png";
            r.src = "assets/kitties/right.png";
            if (!keepKittiesShown)
                hideKitties();
        });
    });
}
export function kittiesFish(delay_1) {
    return __awaiter(this, arguments, void 0, function* (delay, keepKittiesShown = false) {
        getId("fish").style.transition = (delay * 8 / 1000) + "s";
        getId("fish").style.top = "0%";
        noteTimes.push({ time: Date.now() + delay * 11, key: "k", value: 2, onHit(good) {
                getId("right").style.height = "calc(" + IMSIZE + " * 647px)";
                getId("right").src = "assets/kitties/right-" + (good ? "fish.png" : "miss.png");
            }, });
        yield sleep(delay * 8).then(() => { getId("left").style.height = "calc(" + (IMSIZE / 2) + " * 647px)"; })
            .then(() => sleep(delay * 1)).then(() => { getId("middle").style.height = "calc(" + (IMSIZE / 2) + " * 647px)"; })
            .then(() => sleep(delay * 1)).then(() => { getId("right").style.height = "calc(" + (IMSIZE / 2) + " * 647px)"; })
            .then(() => sleep(delay * 1)).then(() => {
            for (let i of ["left", "middle"])
                getId(i).style.height = "calc(" + IMSIZE + " * 647px)";
            getId("left").src = "assets/kitties/left-fish.png";
            getId("middle").src = "assets/kitties/middle-fish.png";
        })
            .then(() => sleep(delay * 3)).then(() => {
            getId("left").src = "assets/kitties/left.png";
            getId("middle").src = "assets/kitties/middle.png";
            getId("right").style.height = "calc(" + IMSIZE + " * 647px)";
            getId("right").src = "assets/kitties/right.png";
            if (!keepKittiesShown)
                hideKitties();
        });
    });
}
