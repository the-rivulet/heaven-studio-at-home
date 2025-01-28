import { getId, sleep, IMSIZE, noteTimes } from "./globals.js";

export function hideKitties() {
  getId("left").style.bottom = "-460px";
  getId("middle").style.bottom = "-460px";
  getId("right").style.bottom = "-460px";
  getId("bottom").style.bottom = "-250px";
  getId("topleft").style.top = "-175px"; getId("topleft").style.left = "-175px";
  getId("topright").style.top = "-175px"; getId("topright").style.right = "-175px";
  getId("fish").style.top = "-300px";
}

export async function kittiesCloseUpClap(delay: number, keepKittiesShown = false, extraWait = 0) {
  hideKitties();
  // Now show them again
  let tl = getId<HTMLImageElement>("topleft"), tr = getId<HTMLImageElement>("topright"), b = getId<HTMLImageElement>("bottom");
  tl.style.top = "0%"; tl.style.left = "0%";
  // And add the notes...
  for(let i of [10, 12]) {
    noteTimes.push({time: Date.now() + delay * i + extraWait, key: "k", onHit(good) {
      b.src = "assets/nova-bottom-" + (good ? "clap1.png" : "miss.png");
      if(good) setTimeout(() => { b.src = "assets/nova-bottom-clap2.png"; }, delay);
    }});
  }
  await sleep(delay * 3 + extraWait).then(() => { tr.style.top = "0%"; tr.style.right = "0%"; })
  .then(() => sleep(delay * 3)).then(() => { b.style.bottom = "0%"; })
  .then(() => sleep(delay * 4)).then(() => {
    tl.src = "assets/nova-topleft-clap1.png";
    tr.src = "assets/nova-topright-clap1.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    tl.src = "assets/nova-topleft-clap2.png";
    tr.src = "assets/nova-topright-clap2.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    tl.src = "assets/nova-topleft-clap1.png";
    tr.src = "assets/nova-topright-clap1.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    tl.src = "assets/nova-topleft-clap2.png";
    tr.src = "assets/nova-topright-clap2.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    tl.src = "assets/nova-topleft.png";
    tr.src = "assets/nova-topright.png";
    b.src = "assets/nova-bottom.png";
    if(!keepKittiesShown) hideKitties();
  }).then(() => sleep(delay * 2));
}

export async function kittiesClap(delay: number, keepKittiesShown = false, extraWait = 0) {
  hideKitties();
  // Now show them again
  let l = getId<HTMLImageElement>("left"), m = getId<HTMLImageElement>("middle"), r = getId<HTMLImageElement>("right");
  l.style.bottom = "0%";
  // And add the notes...
  for(let i of [10, 12]) {
    noteTimes.push({time: Date.now() + delay * i + extraWait, key: "k", onHit(good) {
      r.src = "assets/nova-right-" + (good ? "clap1.png" : "miss.png");
      if(good) setTimeout(() => { r.src = "assets/nova-right-clap2.png"; }, delay);
    }});
  }
  await sleep(delay * 3 + extraWait).then(() => { m.style.bottom = "0%"; })
  .then(() => sleep(delay * 3)).then(() => { r.style.bottom = "0%"; })
  .then(() => sleep(delay * 4)).then(() => {
    l.src = "assets/nova-left-clap1.png";
    m.src = "assets/nova-middle-clap1.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    l.src = "assets/nova-left-clap2.png";
    m.src = "assets/nova-middle-clap2.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    l.src = "assets/nova-left-clap1.png";
    m.src = "assets/nova-middle-clap1.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    l.src = "assets/nova-left-clap2.png";
    m.src = "assets/nova-middle-clap2.png";
  })
  .then(() => sleep(delay * 1)).then(() => {
    l.src = "assets/nova-left.png";
    m.src = "assets/nova-middle.png";
    r.src = "assets/nova-right.png";
    if(!keepKittiesShown) hideKitties();
  }).then(() => sleep(delay * 2));
}

export async function kittiesSpin(delay: number, keepKittiesShown = false, extraWait = 0) {
  // This will only work right after a "kittiesClap" (not CloseUp)
  let l = getId<HTMLImageElement>("left"), m = getId<HTMLImageElement>("middle"), r = getId<HTMLImageElement>("right");
  noteTimes.push({time: Date.now() + delay * 8 + extraWait, key: "j", onHit(good) {
    r.style.height = "calc(" + (good ? IMSIZE/2 : IMSIZE*0.8) + " * 647px)";
  }}, {time: Date.now() + delay * 11 + extraWait, key: "j", invert: true, onHit(good) {
    r.src = "assets/nova-right-pose" + (good ? ".png" : "-miss.png");
    r.style.height = "calc(" + IMSIZE + " * 647px)";
    setTimeout(() => { r.src = "assets/nova-right.png"; }, delay * 3);
  }});
  for(let time = 0; time < 4; time++) {
    await sleep(extraWait).then(() => { for(let i of [l, m, r]) i.style.height = "calc(" + (IMSIZE*0.9) + " * 647px)"; })
    .then(() => sleep(delay * 1)).then(() => { for(let i of [l, m, r]) i.style.height = "calc(" + IMSIZE + " * 647px)"; })
    .then(() => sleep(delay * 1));
  }
  await sleep(0).then(() => { for(let i of [l, m]) i.style.height = "calc(" + (IMSIZE/2) + " * 647px)"; })
  .then(() => sleep(delay * 3)).then(() => {
    for(let i of [l, m]) i.style.height = "calc(" + IMSIZE + " * 647px)";
    l.src = "assets/nova-left-pose.png";
    m.src = "assets/nova-middle-pose.png";
  })
  .then(() => sleep(delay * 3)).then(() => {
    // in case the note was missed
    r.style.height = "calc(" + IMSIZE + " * 647px)";
    l.src = "assets/nova-left.png";
    m.src = "assets/nova-middle.png";
    r.src = "assets/nova-right.png";
    if(!keepKittiesShown) hideKitties();
  })
}

export async function kittiesFish(delay: number, keepKittiesShown = false) {
  getId("fish").style.transition = (delay * 8 / 1000) + "s";
  getId("fish").style.top = "0%";
  noteTimes.push({time: Date.now() + delay * 11, key: "k", value: 2, onHit(good) {
    getId("right").style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("right").src = "assets/nova-right-" + (good ? "fish.png" : "miss.png");
  },});
  await sleep(delay * 8).then(() => { getId("left").style.height = "calc(" + (IMSIZE/2) + " * 647px)"; })
  .then(() => sleep(delay * 1)).then(() => { getId("middle").style.height = "calc(" + (IMSIZE/2) + " * 647px)"; })
  .then(() => sleep(delay * 1)).then(() => { getId("right").style.height = "calc(" + (IMSIZE/2) + " * 647px)"; })
  .then(() => sleep(delay * 1)).then(() => {
    for(let i of ["left", "middle"]) getId(i).style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("left").src = "assets/nova-left-fish.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle-fish.png";
  })
  .then(() => sleep(delay * 3)).then(() => {
    getId<HTMLImageElement>("left").src = "assets/nova-left.png";
    getId<HTMLImageElement>("middle").src = "assets/nova-middle.png";
    getId("right").style.height = "calc(" + IMSIZE + " * 647px)";
    getId<HTMLImageElement>("right").src = "assets/nova-right.png";
    if(!keepKittiesShown) hideKitties();
  });
}