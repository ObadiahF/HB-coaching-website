

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.5084961e.js","_app/immutable/chunks/scheduler.1f6706a1.js","_app/immutable/chunks/index.6dfe87dd.js","_app/immutable/chunks/store.059aa0f5.js","_app/immutable/chunks/index.b16b216b.js"];
export const stylesheets = ["_app/immutable/assets/3.ec2f8341.css"];
export const fonts = [];
