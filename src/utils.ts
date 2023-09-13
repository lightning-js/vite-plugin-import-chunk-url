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

import { existsSync } from 'fs';

/**
 * Resolve the source file path.
 *
 * If the source file path does not exist, and it's a `.js` or `.mjs` file,
 * then try to resolve the path with the extension replaced with `.ts` or `.mts`.
 *
 * If no valid source file path can be resolved then return `null`.
 *
 * @param sourcePath
 * @returns
 */
export function resolveSourceFile(sourcePath: string): string | null {
  if (existsSync(sourcePath)) {
    return sourcePath;
  } else if (sourcePath.endsWith('.js') || sourcePath.endsWith('.mjs')) {
    const tsFilePath = sourcePath.replace(/\.js$/, '.ts').replace(/\.mjs$/, '.mts');
    if (existsSync(tsFilePath)) {
      return tsFilePath;
    } else {
      return null;
    }
  }
  return null;
}