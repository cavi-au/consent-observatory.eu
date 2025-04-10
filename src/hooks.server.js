import * as app from './app.server.js';

try {
	await app.init();
} catch (e) {
	console.error('Could not init server...');
	console.error(e);
	process.exit(1);
}

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	/*
	let userid = event.cookies.get('userid');
	if (!userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		userid = crypto.randomUUID();
		event.cookies.set('userid', userid, { path: '/' });
	}
	event.locals.userid = userid;
	*/
	return resolve(event);
};
