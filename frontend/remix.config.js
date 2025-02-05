/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  serverBuildPath: "build/server/index.js",
  serverMainFields: ["main", "module"],
  serverMinify: false,
  serverPlatform: "node",
  serverDependenciesToBundle: [
    /^@remix-run\/.*/,
    /^@vercel\/.*/,
  ],
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  publicPath: "/build/",
  assetsBuildDirectory: "public/build"
}; 