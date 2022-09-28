import { env as privateEnvVars } from '$env/dynamic/private';
import * as serverState from './server-state.js';

await serverState.init();

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	let userid = event.cookies.get('userid');


	// TODO ryd op i alt dette, vi skal formentlig ikke bruge sessions...
	if (!userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		userid = crypto.randomUUID();
		event.cookies.set('userid', userid, { path: '/' });
	}

	event.locals.userid = userid;

	return resolve(event);
};
