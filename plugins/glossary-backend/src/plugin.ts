/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { DefaultGlossaryDatabase } from './database';

/**
 * glossaryPlugin backend plugin
 *
 * @public
 */
export const glossaryPlugin = createBackendPlugin({
  pluginId: 'glossary',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        database: coreServices.database,
      },
      async init({ httpRouter, database }) {
        const db = await database.getClient();
        const glossaryDatabase = new DefaultGlossaryDatabase(db);

        const router = await createRouter({
          database: glossaryDatabase,
          identity: null, // TODO: Add proper identity service
        });

        httpRouter.use(router);
      },
    });
  },
});

/**
 * @public
 * @deprecated Use `glossaryPlugin` instead.
 */
export const plugin = glossaryPlugin;