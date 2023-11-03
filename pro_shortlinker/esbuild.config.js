const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

esbuild.build({
    entryPoints: ["./src/**/*.ts"],
    outdir: "./build",
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node14',
    plugins: [nodeExternalsPlugin()]
}).catch(console.log)