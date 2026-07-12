import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as esbuild } from 'esbuild';

// Bundles the standalone Render server (admin panel API + static file
// serving) into a single ESM file. Separate from the Vite build, which
// produces the static site itself (dist/public).
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

await esbuild({
  entryPoints: [path.resolve(artifactDir, 'server/render-server.ts')],
  platform: 'node',
  bundle: true,
  format: 'esm',
  outfile: path.resolve(artifactDir, 'dist/render-server.mjs'),
  logLevel: 'info',
  sourcemap: 'linked',
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
