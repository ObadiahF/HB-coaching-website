export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [];

export const dictionary = {
		"/": [4],
		"/auth": [5],
		"/dashboard": [6,[2]],
		"/dashboard/edit-profile": [7,[2]],
		"/dashboard/manage": [8,[2]],
		"/dashboard/messages": [9,[2,3]],
		"/dashboard/schedule": [10,[2]],
		"/dashboard/settings": [11,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';