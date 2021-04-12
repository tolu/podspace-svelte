const pkg = require('./package.json');

/** see: https://github.com/sveltejs/kit/issues/928 */

/** @type {import('vite').UserConfig} */
export default {
	ssr: {
		noExternal: Object.keys(pkg.dependencies || {})
	},
};