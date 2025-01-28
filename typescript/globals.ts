export let getId = function<T extends HTMLElement>(x: string) { return document.getElementById(x) as T; }
export let sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export interface Note {time: number, key: string, invert?: boolean, value?: number, onHit: (good: boolean) => void};
export const IMSIZE = 1.1;
export let noteTimes: Note[] = [];
export let doNothing = () => { };