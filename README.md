# vite-plugin-import-chunk-url

This plugin allows you to declare that a JavaScript/TypeScript file be bundled
into a seperate chunk while getting the relative URL to that chunk file. The
chunk can then be imported dynamically or run via a worker.

## Usage

**vite.config.ts**
```ts
import { importChunkUrl } from 'vite-plugin-import-chunk-url';

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [
      importChunkUrl(),
    ],
    build: {
      minify: false,
      sourcemap: true,
    }
  };
});
```

**app.ts**
```ts
import customModuleBundleUrl from './CustomCodeModule.js?importChunkUrl';

import(customModuleBundleUrl).then(/*..*/);
```
