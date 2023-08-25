

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.9fc60d72.js","_app/immutable/chunks/scheduler.1f6706a1.js","_app/immutable/chunks/index.6dfe87dd.js","_app/immutable/chunks/edit.svelte_svelte_type_style_lang.d3311d4b.js","_app/immutable/chunks/store.059aa0f5.js","_app/immutable/chunks/index.b16b216b.js"];
export const stylesheets = ["_app/immutable/assets/4.4e2bfbb0.css","_app/immutable/assets/edit.2590dfe8.css"];
export const fonts = [];
