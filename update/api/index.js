// Pre-bundled CommonJS Vercel Serverless Entrypoint (Zero TS6059 rootDir conflicts)
const app = require('../dist/server.cjs');
module.exports = app.default || app;
