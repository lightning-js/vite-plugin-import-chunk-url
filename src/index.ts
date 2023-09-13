/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ConfigEnv, Plugin } from 'vite';
import { resolve, dirname } from 'path';
import { resolveSourceFile } from './utils.js';

export function importChunkUrl(): Plugin {
  const workerChunkPattern = /(.+)\?importChunkUrl$/;

  const state: {
    command: ConfigEnv['command'] | 'unknown';
    workerMap: Map<string, string>;
  } = {
    command: 'unknown',
    workerMap: new Map<string, string>()
  };

  return {
    name: 'importChunkUrl',
    configResolved(resolvedConfig) {
      state.command = resolvedConfig.command;
    },
    resolveId: {
      order: 'pre',
      async handler(id, importer, options) {
        const matches = id.match(workerChunkPattern);

        if (importer && matches && matches[1]) {
          const matchedId = matches[1];
          const resolvedPath = resolveSourceFile(resolve(dirname(importer), matchedId));
          if (!resolvedPath) {
            throw new Error(`Could not resolve source file for ${matchedId}`);
          }
          if (state.command === 'build') {
            // In `build` mode emit a new chunk for the worker that is
            // dedicated to the worker
            // Rollup will automatically chunk common dependencies between any
            // explicit entry points and any other worker chunks generated by
            // this plugin
            const chunkRefId = this.emitFile({
              type: 'chunk',
              id: resolvedPath,
              preserveSignature: 'strict',
            });
            state.workerMap.set(id, chunkRefId);
          } else if (state.command === 'serve') {
            // In `serve` mode resolve the worker using the built-in Vite Worker
            // import API
            const transformedPath = `${matchedId}?worker&url`;
            const resolution = await this.resolve(
              transformedPath,
              importer,
              {
                skipSelf: true,
                ...options
              },
            );
            return resolution;
          }
          return id;
        }
      },
    },
    load(id) {
      if (state.workerMap.has(id)) {
        const workerChunkRefId = state.workerMap.get(id);
        return `export default import.meta.ROLLUP_FILE_URL_${workerChunkRefId};`;
      }
    },
  };
}