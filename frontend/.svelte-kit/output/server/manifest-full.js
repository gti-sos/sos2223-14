export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.c63675c3.js","imports":["_app/immutable/entry/start.c63675c3.js","_app/immutable/chunks/index.b75380e7.js","_app/immutable/chunks/singletons.91a52786.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.bb6c31be.js","imports":["_app/immutable/entry/app.bb6c31be.js","_app/immutable/chunks/index.b75380e7.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: "/apartment-occupancy-surveys",
				pattern: /^\/apartment-occupancy-surveys\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
