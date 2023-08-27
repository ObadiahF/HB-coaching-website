import { writable } from 'svelte/store';

export const state = writable("front-page");
export const dashState = writable(["dash", "dark-mode"]);