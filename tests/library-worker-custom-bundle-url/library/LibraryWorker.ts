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

import { LibraryWorkerContext } from "./LibraryWorkerContext.js";

self.addEventListener('message', (event) => {
  console.log('worker received event', event);
  if (event.data.type === 'init') {
    const librayContext = new LibraryWorkerContext();

    import(event.data.url /* @vite-ignore */).then(({ CustomCode }) => {
      console.log('imported custom code');
      const customCode = new CustomCode();
      customCode.run(librayContext);
    });
  }
});

console.log('worker loaded');
