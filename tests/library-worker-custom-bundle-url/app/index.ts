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

// Import the library's worker itself with Vite's Web Worker import API
import libraryWorkerUrl from '../library/LibraryWorker.js?importChunkUrl';
import customModuleBundleUrl from './CustomCodeModule.js?importChunkUrl';

// Use the same Web Worker import API but in URL mode
// This tell's Vite to create a separate bundle for CustomCodeModule.js
// but only return the URL to that bundle

(async () => {
  // Start the worker
  const worker = new Worker(libraryWorkerUrl, { type: 'module' });
  // Wait some time for worker to be ready
  await sleep(1000);
  // Send the custom module bundle to the Worker
  worker.postMessage({
    type: 'init',
    url: customModuleBundleUrl,
  });
})();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
