

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.0777f6c6.js","_app/immutable/chunks/scheduler.1f6706a1.js","_app/immutable/chunks/index.6dfe87dd.js","_app/immutable/chunks/singletons.4d874b06.js","_app/immutable/chunks/index.b16b216b.js"];
export const stylesheets = [];
export const fonts = [];
